import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hashPassword, generateOTP } from '@/lib/auth';
import { getUserByPhone } from '@/lib/db-utils';
import { prisma } from '@/lib/db';
import { kv } from '@vercel/kv';
import { deleteUserSessions } from '@/lib/session';

// Enhanced validation schemas
const resetRequestSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  email: z.string().email('Valid email is required').optional(),
  method: z.enum(['PHONE', 'EMAIL']).default('PHONE'),
});

const resetConfirmSchema = z.object({
  token: z.string().min(32, 'Invalid reset token'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const resetVerifySchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  resetToken: z.string().min(32, 'Invalid reset token').optional(),
});

// Generate secure reset token
function generateResetToken(): string {
  return crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
}

// Rate limiting helper
async function checkResetRateLimit(identifier: string, type: 'PHONE' | 'EMAIL'): Promise<{
  allowed: boolean;
  retryAfter?: number;
  attempts?: number;
}> {
  const rateLimitKey = `reset_rate_${type}:${identifier}`;
  const rateData = await kv.get(rateLimitKey);
  
  if (!rateData) {
    return { allowed: true, attempts: 0 };
  }
  
  const data = JSON.parse(rateData as string);
  const now = Date.now();
  const timeSinceLastRequest = now - new Date(data.lastRequest).getTime();
  
  // Allow 3 requests per hour
  if (data.count >= 3 && timeSinceLastRequest < 60 * 60 * 1000) {
    return {
      allowed: false,
      retryAfter: Math.ceil((60 * 60 * 1000 - timeSinceLastRequest) / 1000),
      attempts: data.count,
    };
  }
  
  return { allowed: true, attempts: data.count };
}

// Update rate limit counter
async function updateResetRateLimit(identifier: string, type: 'PHONE' | 'EMAIL'): Promise<void> {
  const rateLimitKey = `reset_rate_${type}:${identifier}`;
  const rateData = await kv.get(rateLimitKey);
  
  if (rateData) {
    const data = JSON.parse(rateData as string);
    data.count++;
    data.lastRequest = new Date().toISOString();
    
    await kv.set(rateLimitKey, JSON.stringify(data), { ex: 60 * 60 }); // 1 hour expiry
  } else {
    await kv.set(rateLimitKey, JSON.stringify({
      count: 1,
      lastRequest: new Date().toISOString(),
    }));
  }
}

// Request password reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetRequestSchema.parse(body);
    
    const identifier = validatedData.method === 'PHONE' ? validatedData.phone : validatedData.email;
    
    if (!identifier) {
      return NextResponse.json(
        { error: `${validatedData.method} is required` },
        { status: 400 }
      );
    }
    
    // Check rate limiting
    const rateCheck = await checkResetRateLimit(identifier, validatedData.method);
    
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many password reset requests. Please try again later.',
          retryAfter: rateCheck.retryAfter,
          attempts: rateCheck.attempts,
          maxAttempts: 3,
          timeWindow: '1 hour',
        },
        { status: 429 }
      );
    }
    
    // Find user by identifier
    let user;
    if (validatedData.method === 'PHONE') {
      user = await getUserByPhone(validatedData.phone);
    } else {
      user = await prisma.users.findUnique({
        where: { email: validatedData.email },
      });
    }
    
    if (!user) {
      // Don't reveal that user doesn't exist for security
      // Update rate limit anyway to prevent enumeration
      await updateResetRateLimit(identifier, validatedData.method);
      
      return NextResponse.json({
        message: 'If an account with this identifier exists, a reset OTP/token has been sent',
        method: validatedData.method,
      });
    }
    
    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }
    
    // Generate reset token and OTP
    const resetToken = generateResetToken();
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Store reset data
    const resetKey = `password_reset:${user.id}`;
    const resetData = {
      resetToken,
      otp: validatedData.method === 'PHONE' ? otp : null,
      email: validatedData.method === 'EMAIL' ? validatedData.email : null,
      method: validatedData.method,
      userId: user.id,
      timestamp: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      attempts: 0,
    };
    
    await kv.set(resetKey, JSON.stringify(resetData), { ex: 10 * 60  });
    
    // Update rate limit
    await updateResetRateLimit(identifier, validatedData.method);
    
    // Log password reset request
    await prisma.audit_logs.create({
      data: {
        actor_id: user.id,
        actor_role: user.role,
        action_type: 'PASSWORD_RESET_REQUEST',
        entity_type: 'USER',
        entity_id: user.id,
        ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown" || request.headers.get('x-forwarded-for') || 'Unknown',
        user_agent: request.headers.get('user-agent') || 'Unknown',
      },
    });
    
    // Send reset OTP/token (in production, use SMS/email service)
    let resetUrl: string | undefined;
    if (validatedData.method === 'PHONE') {
      console.log(`Password reset OTP for ${validatedData.phone}: ${otp}`); // Development only
    } else {
      resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(validatedData.email!)}`;
      console.log(`Password reset URL for ${validatedData.email}: ${resetUrl}`); // Development only
    }
    
    return NextResponse.json({
      message: 'Password reset OTP/token sent successfully',
      method: validatedData.method,
      identifier,
      expiresIn: 10 * 60, // 10 minutes in seconds
      canResendAfter: 60, // 1 minute in seconds
      // In development, return OTP/token for testing (remove in production)
      ...(process.env.NODE_ENV === 'development' && {
        ...(validatedData.method === 'PHONE' && { otp }),
        ...(validatedData.method === 'EMAIL' && { resetToken, resetUrl }),
      }),
    });
    
  } catch (error) {
    console.error('Password reset request error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify OTP for password reset
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetVerifySchema.parse(body);
    
    // Find user by phone
    const user = await getUserByPhone(validatedData.phone);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid phone number or OTP' },
        { status: 401 }
      );
    }
    
    // Get stored reset data
    const resetKey = `password_reset:${user.id}`;
    const storedData = await kv.get(resetKey);
    
    if (!storedData) {
      return NextResponse.json(
        { error: 'Reset request not found or expired' },
        { status: 401 }
      );
    }
    
    const resetData = JSON.parse(storedData as string);
    
    // Check if reset is expired
    if (new Date() > new Date(resetData.expiresAt)) {
      await kv.del(resetKey);
      
      return NextResponse.json(
        { error: 'Reset request expired' },
        { status: 401 }
      );
    }
    
    // Verify OTP matches
    if (resetData.otp !== validatedData.otp) {
      // Increment attempts
      resetData.attempts = (resetData.attempts || 0) + 1;
      
      if (resetData.attempts >= 3) {
        // Block further attempts
        await kv.del(resetKey);
        
        return NextResponse.json(
          { error: 'Too many failed attempts. Please request a new password reset.' },
          { status: 429 }
        );
      }
      
      await kv.set(resetKey, JSON.stringify(resetData), { ex: 10 * 60  });
      
      return NextResponse.json(
        { error: 'Invalid OTP', attemptsRemaining: 3 - resetData.attempts },
        { status: 401 }
      );
    }
    
    // Generate confirmation token for password reset
    const confirmToken = generateResetToken();
    resetData.confirmToken = confirmToken;
    resetData.otpVerified = true;
    
    await kv.set(resetKey, JSON.stringify(resetData), { ex: 10 * 60  });
    
    return NextResponse.json({
      message: 'OTP verified successfully',
      confirmToken,
      expiresIn: 10 * 60, // 10 minutes in seconds
      nextStep: 'Use this token to reset your password',
    });
    
  } catch (error) {
    console.error('Password reset verification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Confirm password reset with new password
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetConfirmSchema.parse(body);
    
    // Get stored reset data using token
    let resetData;
    let user;
    
    // Try to find reset data by token
    const resetKeys = await kv.keys(`password_reset:*`);
    
    for (const key of resetKeys) {
      const data = await kv.get(key);
      if (data) {
        const parsedData = JSON.parse(data as string);
        if (parsedData.resetToken === validatedData.token || parsedData.confirmToken === validatedData.token) {
          resetData = parsedData;
          user = await prisma.users.findUnique({
            where: { id: parsedData.userId },
          });
          break;
        }
      }
    }
    
    if (!resetData || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 401 }
      );
    }
    
    // Check if reset is expired
    if (new Date() > new Date(resetData.expiresAt)) {
      await kv.del(`password_reset:${user.id}`);
      
      return NextResponse.json(
        { error: 'Reset request expired' },
        { status: 401 }
      );
    }
    
    // Check if OTP was verified (for phone resets)
    if (resetData.method === 'PHONE' && !resetData.otpVerified) {
      return NextResponse.json(
        { error: 'OTP verification required' },
        { status: 401 }
      );
    }
    
    // Hash new password
    const passwordHash = await hashPassword(validatedData.newPassword);
    
    // Update password and clear reset data
    await prisma.$transaction(async (tx) => {
      await tx.users.update({
        where: { id: user.id },
        data: {
          passwordHash,
          last_login_at: new Date(), // Update last login on password reset
        },
      });
      
      // Clear all reset tokens for this user
      await kv.del(`password_reset:${user.id}`);
    });
    
    // Logout from all devices for security
    await deleteUserSessions(user.id);
    
    // Log password reset completion
    await prisma.audit_logs.create({
      data: {
        actor_id: user.id,
        actor_role: user.role,
        action_type: 'PASSWORD_RESET_COMPLETE',
        entity_type: 'USER',
        entity_id: user.id,
        ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown" || request.headers.get('x-forwarded-for') || 'Unknown',
        user_agent: request.headers.get('user-agent') || 'Unknown',
      },
    });
    
    return NextResponse.json({
      message: 'Password reset successfully',
      resetAt: new Date().toISOString(),
      securityInfo: {
        allSessionsTerminated: true,
        requiresReLogin: true,
      },
    });
    
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/auth/reset-password - Check reset status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const phone = url.searchParams.get('phone');
    const email = url.searchParams.get('email');
    
    if (!token && !phone && !email) {
      return NextResponse.json({
        message: 'Password reset requirements',
        requirements: {
          phoneFormat: 'Bangladeshi: +8801XXXXXXXXX',
          emailFormat: 'Valid email address',
          maxAttempts: 3,
          tokenExpiry: 10 * 60, // 10 minutes
          rateLimit: {
            maxRequests: 3,
            timeWindow: '1 hour',
          },
        },
      });
    }
    
    let resetData;
    let user;
    
    if (token) {
      // Find by token
      const resetKeys = await kv.keys(`password_reset:*`);
      
      for (const key of resetKeys) {
        const data = await kv.get(key);
        if (data) {
          const parsedData = JSON.parse(data as string);
          if (parsedData.resetToken === token || parsedData.confirmToken === token) {
            resetData = parsedData;
            user = await prisma.users.findUnique({
              where: { id: parsedData.userId },
            });
            break;
          }
        }
      }
    } else if (phone) {
      // Find by phone
      user = await getUserByPhone(phone);
      if (user) {
        const data = await kv.get(`password_reset:${user.id}`);
        if (data) {
          resetData = JSON.parse(data as string);
        }
      }
    }
    
    if (!resetData || !user) {
      return NextResponse.json({
        message: 'No active password reset found',
        canRequest: true,
        requestAfter: 0,
      });
    }
    
    const expiresIn = Math.max(0, Math.floor((new Date(resetData.expiresAt).getTime() - Date.now()) / 1000));
    
    return NextResponse.json({
      message: 'Password reset status',
      method: resetData.method,
      identifier: resetData.phone || resetData.email,
      requestedAt: resetData.timestamp,
      expiresAt: resetData.expiresAt,
      expiresIn,
      otpVerified: resetData.otpVerified,
      attempts: resetData.attempts || 0,
      maxAttempts: 3,
      canRequest: expiresIn === 0,
    });
    
  } catch (error) {
    console.error('Password reset status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/auth/reset-password - Cancel password reset
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }
    
    // Find and delete reset data
    const resetKeys = await kv.keys(`password_reset:*`);
    
    for (const key of resetKeys) {
      const data = await kv.get(key);
      if (data) {
        const parsedData = JSON.parse(data as string);
        if (parsedData.resetToken === token || parsedData.confirmToken === token) {
          await kv.del(key);
          
          return NextResponse.json({
            message: 'Password reset cancelled successfully',
            cancelledAt: new Date().toISOString(),
          });
        }
      }
    }
    
    return NextResponse.json(
      { error: 'Invalid or expired reset token' },
      { status: 401 }
    );
    
  } catch (error) {
    console.error('Cancel password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}