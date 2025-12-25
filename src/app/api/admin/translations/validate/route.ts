import { NextRequest, NextResponse } from 'next/server';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';
import { UserRole } from '@prisma/client';
import { TranslationValidator } from '@/utils/translationValidator';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    // Get authenticated user and verify SUPER_ADMIN role
    const user = getCurrentUser(request);
    if (!user || user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Insufficient permissions: SUPER_ADMIN role required' },
        { status: 403 }
      );
    }

    const validator = new TranslationValidator();
    const result = await validator.validate();

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error validating translations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate translations' },
      { status: 500 }
    );
  }
}
