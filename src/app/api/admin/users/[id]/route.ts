import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';
import { appendFileSync } from 'fs';

// #region agent log
const logPath = '/home/zia/Documents/My Projects/SynologyDrive/Websites/Caregiver/.cursor/debug.log';
function logDebug(location: string, message: string, data: any, hypothesisId: string) {
  try {
    const logEntry = JSON.stringify({
      location,
      message,
      data,
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId
    }) + '\n';
    appendFileSync(logPath, logEntry, 'utf8');
  } catch (e) { /* log error silently */ }
}
// #endregion

// Get single user by ID (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  // #region agent log
  logDebug('admin/users/[id]/route.ts:22', 'GET /api/admin/users/[id] called', { userId: id }, 'A');
  // #endregion

  // Check authentication
  const authResult = await authenticate(request);
  if (authResult) {
    // #region agent log
    logDebug('admin/users/[id]/route.ts:28', 'Auth failed', { hasAuthResult: !!authResult }, 'A');
    // #endregion
    return authResult;
  }

  const user = (request as any).user;
  // #region agent log
  logDebug('admin/users/[id]/route.ts:34', 'Auth passed', { requestingUserId: user?.id, role: user?.role }, 'A');
  // #endregion

  // Check authorization - only SUPER_ADMIN and MODERATOR can view user details
  if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.MODERATOR) {
    // #region agent log
    logDebug('admin/users/[id]/route.ts:40', 'Authorization failed', { role: user?.role }, 'A');
    // #endregion
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  try {
    // #region agent log
    logDebug('admin/users/[id]/route.ts:48', 'Before Prisma query', { userId: id }, 'A');
    // #endregion

    const userData = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        role: true,
        kyc_status: true,
        is_active: true,
        last_login_at: true,
        created_at: true,
      },
    });

    // #region agent log
    logDebug('admin/users/[id]/route.ts:66', 'Prisma query completed', { found: !!userData }, 'A');
    // #endregion

    if (!userData) {
      // #region agent log
      logDebug('admin/users/[id]/route.ts:70', 'User not found', { userId: id }, 'A');
      // #endregion
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // #region agent log
    logDebug('admin/users/[id]/route.ts:78', 'Returning user data', { userId: userData.id }, 'A');
    // #endregion

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error: any) {
    // #region agent log
    logDebug('admin/users/[id]/route.ts:86', 'Error caught', { error: error?.message, stack: error?.stack, name: error?.name }, 'A');
    // #endregion
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}

