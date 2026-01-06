import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { generateResetToken, hashToken, sendResetEmail } from '@/lib/pin-reset-service';
import crypto from 'crypto';

// Validation schema
const forgotPinSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = forgotPinSchema.parse(body);

    // Find user by phone
    const user = await prisma.users.findUnique({
      where: {
        phone: validatedData.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        is_active: true,
      },
    });

    // Always return success for security (don't reveal if user exists)
    const response = {
      message: "If this phone number exists, a reset link has been sent.",
    };

    // Only proceed if user exists and is active
    if (!user || !user.is_active) {
      return NextResponse.json(response);
    }

    // Generate secure random token (32 bytes)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token for storage
    const hashedToken = await hashToken(resetToken);

    // Set token expiry (15 minutes from now)
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    // Store hashed token and expiry in database
    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        reset_token: hashedToken,
        reset_token_expiry: expiry,
      },
    });

    // Send email with unhashed token
    try {
      await sendResetEmail({
        email: user.email!,
        name: user.name,
        resetToken,
        phone: validatedData.phone,
      });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Don't return error to user for security
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Forgot PIN error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
