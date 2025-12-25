import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyPassword, generateTokenPair, extractTokenFromHeader, verifyRefreshToken } from '@/lib/auth';
import { getUserByPhone, updateUserLastLogin, getUserById } from '@/lib/db-utils';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { createSession, deleteSession, getUserSessions, deleteUserSessions } from '@/lib/session';
import speakeasy from 'speakeasy';
import { kvMock } from '@/lib/kv-mock';

// Use KV mock for development if no real KV configured
const hasRealKV = process.env.KV_REST_API_URL && 
  process.env.KV_REST_API_URL !== 'https://localhost:8079' &&
  process.env.KV_REST_API_TOKEN &&
  process.env.KV_REST_API_TOKEN !== 'dev-token-dummy';

let kv: typeof kvMock;
if (hasRealKV) {
  const vercelKv = require('@vercel/kv');
  kv = vercelKv.kv;
} else {
  kv = kvMock;
}

// Enhanced validation schemas
const loginSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  password: z.string().min(1, 'Password is required'),
  mfaCode: z.string().optional(),
  rememberMe: z.boolean().default(false),
  deviceInfo: z.object({
    userAgent: z.string().optional(),
    ip: z.string().optional(),
    platform: z.string().optional(),
    deviceId: z.string().optional(),
  }).optional(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const logoutSchema = z.object({
  allDevices: z.boolean().default(false),
  deviceId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    
    // Rate limiting check
    const rateLimitKey = `login_attempts:${validatedData.phone}`;
    const attempts = await kv.get(rateLimitKey);
    
    if (attempts) {
      const attemptData = JSON.parse(attempts as string);
      const timeSinceLastAttempt = Date.now() - new Date(attemptData.lastAttempt).getTime();
      
      if (attemptData.count >= 5 && timeSinceLastAttempt < 15 * 60 * 1000) {
        return NextResponse.json(
          { 
            error: 'Too many login attempts. Please try again after 15 minutes.',
            blockedUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            retryAfter: 15 * 60
          },
          { status: 429 }
        );
      }
    }
    
    // Find user by phone
    const user = await getUserByPhone(validatedData.phone);
    
    if (!user) {
      // Update failed attempts
      await updateLoginAttempts(validatedData.phone, false);
      
      return NextResponse.json(
        { error: 'Invalid phone number or password' },
        { status: 401 }
      );
    }
    
    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(validatedData.password, user.password_hash);
    
    if (!isPasswordValid) {
      // Update failed attempts
      await updateLoginAttempts(validatedData.phone, false);
      
      return NextResponse.json(
        { error: 'Invalid phone number or password' },
        { status: 401 }
      );
    }
    
    // Check if MFA is enabled and verify code if provided
    if (user.mfa_enabled) {
      if (!validatedData.mfaCode) {
        // Create temporary session for MFA verification
        const tempSessionId = crypto.randomUUID();
        const tempSessionKey = `temp_session:${tempSessionId}`;
        
        await kv.setex(tempSessionKey, 600, JSON.stringify({ // 10 minutes expiry
          userId: user.id,
          userRole: user.role,
          phone: user.phone,
          email: user.email,
          name: user.name,
          purpose: 'MFA_VERIFICATION',
          timestamp: new Date().toISOString(),
        }));
        
        return NextResponse.json({
          error: 'MFA code required',
          requiresMFA: true,
          tempSessionId,
          mfaMethods: ['TOTP'], // Can be extended to include SMS, Email, etc.
        }, { status: 200 });
      }
      
      // Verify MFA code
      const verified = speakeasy.totp.verify({
        secret: user.mfa_secret,
        encoding: 'base32',
        token: validatedData.mfaCode,
        window: 2, // Allow 2 time windows for clock drift
      });
      
      if (!verified) {
        // Update failed attempts
        await updateLoginAttempts(validatedData.phone, false);
        
        return NextResponse.json(
          { error: 'Invalid MFA code' },
          { status: 401 }
        );
      }
    }
    
    // Clear failed attempts on successful login
    await kv.del(rateLimitKey);
    
    // Get device info
    const deviceInfo = validatedData.deviceInfo || {
      userAgent: request.headers.get('user-agent') || 'Unknown',
      ip: request.ip || request.headers.get('x-forwarded-for') || 'Unknown',
      platform: request.headers.get('sec-ch-ua-platform') || 'Unknown',
      deviceId: crypto.randomUUID(),
    };
    
    // Create session
    const session = await createSession({
      userId: user.id,
      userRole: user.role,
      phone: user.phone,
      email: user.email,
      name: user.name,
      deviceInfo,
      rememberMe: validatedData.rememberMe,
    });
    
    // Update last login
    await updateUserLastLogin(user.id);
    
    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      role: user.role as UserRole,
      phone: user.phone,
      email: user.email || undefined,
      name: user.name,
    });
    
    // Log successful login
    await prisma.audit_logs.create({
      data: {
        actor_id: user.id,
        actor_role: user.role,
        action_type: 'LOGIN',
        entity_type: 'USER',
        entity_id: user.id,
        ip_address: deviceInfo.ip,
        user_agent: deviceInfo.userAgent,
      },
    });
    
    // Get user's active sessions count
    const userSessions = await getUserSessions(user.id);
    
    // Remove sensitive data from response
    const { password_hash: _, mfa_secret: __, ...userWithoutSensitiveData } = user;
    
    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutSensitiveData,
      session: {
        id: session.id,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        deviceInfo: session.deviceInfo,
        mfaVerified: session.mfaVerified,
      },
      tokens,
      activeSessions: userSessions.length,
      securityInfo: {
        lastLogin: user.last_login_at,
        requiresPasswordChange: false, // Could implement password expiry logic
        mfaEnabled: user.mfa_enabled,
      },
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
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

// Refresh token endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = refreshTokenSchema.parse(body);
    
    // Check if refresh token is blacklisted
    const blacklistKey = `blacklist:${validatedData.refreshToken}`;
    const isBlacklisted = await kv.get(blacklistKey);
    
    if (isBlacklisted) {
      return NextResponse.json(
        { error: 'Refresh token has been revoked' },
        { status: 401 }
      );
    }
    
    // Verify refresh token
    const payload = verifyRefreshToken(validatedData.refreshToken);
    
    // Get user from database
    const user = await getUserById(payload.userId);
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }
    
    // Generate new tokens
    const tokens = generateTokenPair({
      userId: user.id,
      role: user.role as UserRole,
      phone: user.phone,
      email: user.email || undefined,
      name: user.name,
    });
    
    // Blacklist the old refresh token
    await kv.setex(blacklistKey, 7 * 24 * 60 * 60, JSON.stringify({ // 7 days expiry
      reason: 'REFRESH_USED',
      timestamp: new Date().toISOString(),
    }));
    
    // Log token refresh
    await prisma.audit_logs.create({
      data: {
        actor_id: user.id,
        actor_role: user.role,
        action_type: 'TOKEN_REFRESH',
        entity_type: 'USER',
        entity_id: user.id,
        ip_address: request.ip || request.headers.get('x-forwarded-for') || 'Unknown',
        user_agent: request.headers.get('user-agent') || 'Unknown',
      },
    });
    
    return NextResponse.json({
      message: 'Token refreshed successfully',
      tokens,
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Invalid refresh token' },
      { status: 401 }
    );
  }
}

// Logout endpoint
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = logoutSchema.parse(body);
    
    // Get current session info
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || undefined);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }
    
    // Get user from token (for logging)
    let user = null;
    try {
      const { verifyAccessToken } = await import('@/lib/auth');
      const payload = verifyAccessToken(token);
      user = await getUserById(payload.userId);
    } catch (error) {
      // Token is invalid, but we'll still proceed with logout
    }
    
    if (validatedData.allDevices && user) {
      // Logout from all devices
      await deleteUserSessions(user.id);
      
      // Blacklist all refresh tokens for this user
      const userSessions = await getUserSessions(user.id);
      for (const session of userSessions) {
        // This would require tracking refresh tokens per session
        // For now, we'll just clear sessions
      }
      
      if (user) {
        await prisma.audit_logs.create({
          data: {
            actor_id: user.id,
            actor_role: user.role,
            action_type: 'LOGOUT_ALL',
            entity_type: 'USER',
            entity_id: user.id,
            ip_address: request.ip || request.headers.get('x-forwarded-for') || 'Unknown',
            user_agent: request.headers.get('user-agent') || 'Unknown',
          },
        });
      }
      
      return NextResponse.json({
        message: 'Logged out from all devices successfully',
        loggedOutFrom: 'all',
      });
    } else {
      // Logout from current device only
      // Extract session ID from token or request
      const sessionId = request.headers.get('x-session-id');
      
      if (sessionId) {
        await deleteSession(sessionId);
      }
      
      // Blacklist current access token
      const blacklistKey = `blacklist:${token}`;
      await kv.setex(blacklistKey, 15 * 60, JSON.stringify({ // 15 minutes expiry
        reason: 'LOGOUT',
        timestamp: new Date().toISOString(),
      }));
      
      if (user) {
        await prisma.audit_logs.create({
          data: {
            actor_id: user.id,
            actor_role: user.role,
            action_type: 'LOGOUT',
            entity_type: 'USER',
            entity_id: user.id,
            ip_address: request.ip || request.headers.get('x-forwarded-for') || 'Unknown',
            user_agent: request.headers.get('user-agent') || 'Unknown',
          },
        });
      }
      
      return NextResponse.json({
        message: 'Logout successful',
        loggedOutFrom: 'current',
      });
    }
    
  } catch (error) {
    console.error('Logout error:', error);
    
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

// Helper function to update login attempts
async function updateLoginAttempts(phone: string, success: boolean) {
  const rateLimitKey = `login_attempts:${phone}`;
  const attempts = await kv.get(rateLimitKey);
  
  if (success) {
    // Clear on successful login
    await kv.del(rateLimitKey);
  } else {
    // Increment failed attempts
    if (attempts) {
      const attemptData = JSON.parse(attempts as string);
      attemptData.count++;
      attemptData.lastAttempt = new Date().toISOString();
      
      await kv.setex(rateLimitKey, 15 * 60, JSON.stringify(attemptData)); // 15 minutes
    } else {
      await kv.setex(rateLimitKey, 15 * 60, JSON.stringify({
        count: 1,
        lastAttempt: new Date().toISOString(),
      }));
    }
  }
}

// GET /api/auth/login - Get login status and requirements
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const phone = url.searchParams.get('phone');
    
    if (!phone) {
      return NextResponse.json({
        message: 'Login requirements',
        requirements: {
          phoneFormat: 'Bangladeshi: +8801XXXXXXXXX',
          passwordRequired: true,
          mfaRequired: true, // For certain roles
          maxAttempts: 5,
          lockoutDuration: 15 * 60, // 15 minutes
        },
      });
    }
    
    // Check login attempts for this phone
    const rateLimitKey = `login_attempts:${phone}`;
    const attempts = await kv.get(rateLimitKey);
    
    if (attempts) {
      const attemptData = JSON.parse(attempts as string);
      const timeSinceLastAttempt = Date.now() - new Date(attemptData.lastAttempt).getTime();
      const isBlocked = attemptData.count >= 5 && timeSinceLastAttempt < 15 * 60 * 1000;
      
      return NextResponse.json({
        phone,
        attempts: attemptData.count,
        lastAttempt: attemptData.lastAttempt,
        isBlocked,
        blockedUntil: isBlocked ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null,
        canRetry: !isBlocked && timeSinceLastAttempt > 60 * 1000, // Can retry after 1 minute
        retryAfter: isBlocked ? Math.ceil((15 * 60 * 1000 - timeSinceLastAttempt) / 1000) : 
                   (timeSinceLastAttempt > 60 * 1000 ? 0 : Math.ceil((60 * 1000 - timeSinceLastAttempt) / 1000)),
      });
    }
    
    return NextResponse.json({
      phone,
      attempts: 0,
      isBlocked: false,
      canRetry: true,
      retryAfter: 0,
    });
    
  } catch (error) {
    console.error('Login status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}