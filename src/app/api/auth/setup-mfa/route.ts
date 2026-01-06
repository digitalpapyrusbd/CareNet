import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';
import { generateMFASecret } from '@/lib/auth';
import { prisma } from '@/lib/db';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// Validation schema
const setupMFASchema = z.object({
  verifyCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const user = getCurrentUser(request);
  
  // Only companies and moderators can set up MFA
  if (user.role !== 'COMPANY' && user.role !== 'MODERATOR' && user.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'MFA is only available for companies and moderators' },
      { status: 403 }
    );
  }
  
  try {
    const body = await request.json();
    const validatedData = setupMFASchema.parse(body);
    
    // If verification code is provided, enable MFA
    if (validatedData.verifyCode) {
      const updatedUser = await prisma.users.findUnique({
        where: { id: user.id },
        select: { mfa_secret: true }
      });
      
      if (!updatedUser?.mfa_secret) {
        return NextResponse.json(
          { error: 'MFA setup not initiated' },
          { status: 400 }
        );
      }
      
      // Verify the TOTP code
      const verified = (speakeasy.totp as any).verify({
        secret: updatedUser.mfa_secret,
        encoding: 'base32',
        token: validatedData.verifyCode,
        window: 2, // Allow 2 time windows for clock drift
      });
      
      if (!verified) {
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 400 }
        );
      }
      
      // Enable MFA for the user
      await prisma.users.update({
        where: { id: user.id },
        data: { mfa_enabled: true }
      });
      
      return NextResponse.json({
        message: 'MFA enabled successfully',
        mfaEnabled: true,
      });
    } else {
      // Generate new MFA secret and QR code
      const secret = generateMFASecret();
      const issuer = 'Caregiver Platform';
      const label = `${issuer} (${user.name})`;
      
      // Add backup codes for recovery (store in production)
      const backupCodes = Array.from({ length: 10 }, (_, i) =>
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      
      // Generate TOTP URI
      const totpUri = (speakeasy as any).otpauthURL({
        secret,
        label,
        issuer,
      });
      
      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(totpUri);
      
      // Store the secret temporarily (not enabled yet)
      await prisma.users.update({
        where: { id: user.id },
        data: { mfa_secret: secret }
      });
      
      return NextResponse.json({
        message: 'MFA setup initiated',
        secret,
        qrCode: qrCodeDataUrl,
        manualEntryKey: secret,
        backupCodes, // Include backup codes for user to save
        instructions: [
          '1. Scan the QR code with your authenticator app',
          '2. Or manually enter the key in your authenticator app',
          '3. Enter the 6-digit code to verify and enable MFA',
          '4. Save your backup codes securely for account recovery'
        ]
      });
    }
    
  } catch (error) {
    console.error('MFA setup error:', error);
    
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

export async function DELETE(request: NextRequest) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const user = getCurrentUser(request);
  
  try {
    // Disable MFA for the user
    await prisma.users.update({
      where: { id: user.id },
      data: { 
        mfa_enabled: false,
        mfa_secret: null
      }
    });
    
    return NextResponse.json({
      message: 'MFA disabled successfully',
      mfaEnabled: false,
    });
    
  } catch (error) {
    console.error('MFA disable error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}