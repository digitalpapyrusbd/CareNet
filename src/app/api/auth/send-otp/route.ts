import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { sendOTP } from '@/lib/notification-service';

// Bangladesh phone number validation
const phoneRegex = /^(\+880|0)?1[3-9]\d{8}$/;

const sendOTPSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Please enter a valid Bangladesh phone number (+8801XXXXXXXXX or 01XXXXXXXXX)'),
});

// POST /api/auth/send-otp - Send OTP for login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = sendOTPSchema.parse(body);
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { phone },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this phone number' },
        { status: 404 }
      );
    }
    
    // Store OTP in database
    await prisma.verification_codes.create({
      data: {
        user_id: user.id,
        code: otp,
        type: 'PHONE_VERIFICATION',
        expiresAt: otpExpiry,
      },
    });
    
    // Send OTP via SMS
    try {
      await sendOTP(phone, otp);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      // Continue with registration even if OTP fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    
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