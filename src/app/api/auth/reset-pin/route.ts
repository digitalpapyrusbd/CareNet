import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { hashToken } from '@/lib/pin-reset-service';
import bcrypt from 'bcryptjs';

// Validation schema
const resetPinSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPin: z.string()
    .regex(/^\d{6}$/, 'PIN must be exactly 6 digits')
    .refine((pin) => /^\d{6}$/.test(pin), 'PIN must contain only numbers'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = resetPinSchema.parse(body);

    const { token, newPin } = validatedData;

    // Hash the incoming token to compare with stored hash
    const hashedToken = await hashToken(token);

    // Find user with matching hashed token and valid expiry
    const user = await prisma.users.findFirst({
      where: {
        reset_token: hashedToken,
        reset_token_expiry: {
          gt: new Date(),
        },
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 }
      );
    }

    // Hash the new PIN using bcrypt
    const hashedPin = await hashPassword(newPin);

    // Update user's PIN and clear reset token
    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password_hash: hashedPin,
        reset_token: null,
        reset_token_expiry: null,
      },
    });

    // Log PIN reset
    await prisma.audit_logs.create({
      data: {
        actor_id: user.id,
        actor_role: 'USER', // We don't have role here, but could be added
        action_type: 'PIN_RESET',
        entity_type: 'USER',
        entity_id: user.id,
        ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown" || request.headers.get('x-forwarded-for') || 'Unknown',
        user_agent: request.headers.get('user-agent') || 'Unknown',
      },
    });

    return NextResponse.json({
      message: 'PIN reset successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error('Reset PIN error:', error);

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
