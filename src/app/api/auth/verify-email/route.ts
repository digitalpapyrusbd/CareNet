import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { kv } from '@vercel/kv';
import { generateSecureToken } from '@/lib/security';

// Email verification schema
const sendVerificationSchema = z.object({
  email: z.string().email('Valid email is required'),
  purpose: z.enum(['EMAIL_VERIFICATION', 'EMAIL_CHANGE']),
  userId: z.string().optional(),
});

const verifyEmailTokenSchema = z.object({
  token: z.string().min(32, 'Invalid verification token'),
  email: z.string().email('Valid email is required'),
});

// Send email verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = sendVerificationSchema.parse(body);
    
    // Check if email is already being verified
    const existingKey = `email_verify:${validatedData.email}`;
    const existingData = await kv.get(existingKey);
    
    if (existingData) {
      const data = JSON.parse(existingData as string);
      const timeSinceLastSent = Date.now() - new Date(data.timestamp).getTime();
      
      if (timeSinceLastSent < 60 * 1000) { // 1 minute cooldown
        return NextResponse.json(
          { 
            error: 'Please wait before requesting another verification email',
            canResendAfter: Math.ceil((60 * 1000 - timeSinceLastSent) / 1000)
          },
          { status: 429 }
        );
      }
    }
    
    // Find user by email if userId is not provided
    let user;
    if (validatedData.userId) {
      user = await prisma.user.findUnique({
        where: { id: validatedData.userId },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
    }
    
    if (!user && validatedData.purpose !== 'EMAIL_CHANGE') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Generate verification token
    const token = generateSecureToken(32);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Store verification data
    const verificationData = {
      token,
      email: validatedData.email,
      purpose: validatedData.purpose,
      userId: user?.id || validatedData.userId,
      timestamp: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      attempts: 0,
    };
    
    await kv.setex(existingKey, 24 * 60 * 60, JSON.stringify(verificationData));
    
    // Send verification email (in production, use email service)
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}&email=${encodeURIComponent(validatedData.email)}`;
    
    console.log(`Email verification URL: ${verificationUrl}`); // Development only
    
    // In production, you would send an actual email:
    // await emailService.sendVerificationEmail(validatedData.email, verificationUrl);
    
    return NextResponse.json({
      message: 'Verification email sent successfully',
      email: validatedData.email,
      expiresIn: 24 * 60 * 60, // 24 hours in seconds
      canResendAfter: 60, // 1 minute in seconds
    });
    
  } catch (error) {
    console.error('Send email verification error:', error);
    
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

// Verify email token
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = verifyEmailTokenSchema.parse(body);
    
    // Get stored verification data
    const verificationKey = `email_verify:${validatedData.email}`;
    const storedData = await kv.get(verificationKey);
    
    if (!storedData) {
      return NextResponse.json(
        { error: 'Verification token not found or expired' },
        { status: 401 }
      );
    }
    
    const verificationData = JSON.parse(storedData as string);
    
    // Verify token matches
    if (verificationData.token !== validatedData.token) {
      // Increment attempts
      verificationData.attempts = (verificationData.attempts || 0) + 1;
      
      if (verificationData.attempts >= 5) {
        // Block further attempts for this email
        await kv.setex(`email_blocked:${validatedData.email}`, 3600, JSON.stringify({
          reason: 'TOO_MANY_ATTEMPTS',
          until: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        }));
        
        await kv.del(verificationKey);
        
        return NextResponse.json(
          { error: 'Too many failed attempts. Please try again after 1 hour.' },
          { status: 429 }
        );
      }
      
      await kv.setex(verificationKey, 24 * 60 * 60, JSON.stringify(verificationData));
      
      return NextResponse.json(
        { error: 'Invalid verification token', attemptsRemaining: 5 - verificationData.attempts },
        { status: 401 }
      );
    }
    
    // Check if token is expired
    if (new Date() > new Date(verificationData.expiresAt)) {
      await kv.del(verificationKey);
      
      return NextResponse.json(
        { error: 'Verification token expired' },
        { status: 401 }
      );
    }
    
    // Check if email is blocked
    const blockedKey = `email_blocked:${validatedData.email}`;
    const isBlocked = await kv.get(blockedKey);
    if (isBlocked) {
      const blockData = JSON.parse(isBlocked as string);
      return NextResponse.json(
        { 
          error: 'Email temporarily blocked due to too many failed attempts',
          blockedUntil: blockData.until,
          retryAfter: Math.ceil((new Date(blockData.until).getTime() - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }
    
    // Clear verification token after successful verification
    await kv.del(verificationKey);
    await kv.del(blockedKey);
    
    // Find user and update email verification status
    let user;
    if (verificationData.userId) {
      user = await prisma.user.findUnique({
        where: { id: verificationData.userId },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update user based on purpose
    let updateData: any = {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    };
    
    if (verificationData.purpose === 'EMAIL_CHANGE') {
      updateData.email = validatedData.email;
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });
    
    return NextResponse.json({
      message: 'Email verified successfully',
      email: validatedData.email,
      purpose: verificationData.purpose,
      verifiedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: updateData.email || user.email,
        isEmailVerified: true,
      }
    });
    
  } catch (error) {
    console.error('Verify email error:', error);
    
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

// GET /api/auth/verify-email - Check verification status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const token = url.searchParams.get('token');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if verification was sent
    const verificationKey = `email_verify:${email}`;
    const verificationData = await kv.get(verificationKey);
    
    if (!verificationData) {
      return NextResponse.json({
        message: 'No verification email found',
        canResend: true,
        resendAfter: 0,
      });
    }
    
    const data = JSON.parse(verificationData as string);
    const timeSinceSent = Date.now() - new Date(data.timestamp).getTime();
    const canResend = timeSinceSent > 60 * 1000; // Can resend after 1 minute
    const resendAfter = canResend ? 0 : Math.ceil((60 * 1000 - timeSinceSent) / 1000);
    const expiresIn = Math.max(0, Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000));
    
    return NextResponse.json({
      message: 'Email verification status',
      email,
      purpose: data.purpose,
      sentAt: data.timestamp,
      expiresAt: data.expiresAt,
      expiresIn,
      canResend,
      resendAfter,
      attempts: data.attempts || 0,
      maxAttempts: 5,
    });
    
  } catch (error) {
    console.error('Email verification status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/auth/verify-email - Cancel pending verification
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Delete pending verification
    const verificationKey = `email_verify:${email}`;
    await kv.del(verificationKey);
    
    return NextResponse.json({
      message: 'Pending email verification cancelled',
      email,
    });
    
  } catch (error) {
    console.error('Cancel email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}