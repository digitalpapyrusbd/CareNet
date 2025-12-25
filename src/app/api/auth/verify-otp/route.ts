import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const verifyOTPSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});

// POST /api/auth/verify-otp - Verify OTP and activate account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp } = verifyOTPSchema.parse(body);
    
    // Find valid OTP code
    const verificationCode = await prisma.verification_codes.findFirst({
      where: {
        code: otp,
        type: 'PHONE_VERIFICATION',
        expiresAt: {
          gt: new Date(),
        },
        isUsed: false,
      },
      include: { users: true,
      },
    });
    
    if (!verificationCode) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }
    
    // Mark OTP as used
    await prisma.verification_codes.update({
      where: { id: verificationCode.id },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });
    
    // Activate user account
    await prisma.users.update({
      where: { id: verificationCode.userId },
      data: {
        is_active: true,
      },
    });
    
    // Log OTP verification
    await prisma.audit_logs.create({
      data: {
        actor_id: verificationCode.userId,
        actor_role: verificationCode.users.role,
        action_type: 'PHONE_VERIFIED',
        entity_type: 'USER',
        entity_id: verificationCode.userId,
        ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown" || request.headers.get('x-forwarded-for') || 'Unknown',
        user_agent: request.headers.get('user-agent') || 'Unknown',
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully. Your account is now active.',
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    
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