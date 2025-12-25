import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAccessToken } from '@/lib/auth';

// In-memory storage for system settings (for demo purposes)
// In production, this should be stored in the database
let systemSettings = {
  platformCommission: 10,
  paymentGracePeriod: 7,
  verificationTimeout: 48,
  minCaregiverRating: 4.0,
  maxDisputeDays: 14,
  updatedAt: new Date().toISOString(),
  updatedBy: null as string | null,
};

// GET: Retrieve current system settings
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = verifyAccessToken(token);

    // Only super admin can access system settings
    if (payload.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ settings: systemSettings });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update system settings
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = verifyAccessToken(token);

    // Only super admin can update system settings
    if (payload.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { platformCommission, paymentGracePeriod, verificationTimeout, minCaregiverRating, maxDisputeDays } = body;

    // Validate inputs
    if (platformCommission !== undefined && (platformCommission < 0 || platformCommission > 100)) {
      return NextResponse.json({ error: 'Platform commission must be between 0 and 100' }, { status: 400 });
    }
    if (paymentGracePeriod !== undefined && paymentGracePeriod < 1) {
      return NextResponse.json({ error: 'Payment grace period must be at least 1 day' }, { status: 400 });
    }
    if (verificationTimeout !== undefined && verificationTimeout < 1) {
      return NextResponse.json({ error: 'Verification timeout must be at least 1 hour' }, { status: 400 });
    }
    if (minCaregiverRating !== undefined && (minCaregiverRating < 0 || minCaregiverRating > 5)) {
      return NextResponse.json({ error: 'Minimum caregiver rating must be between 0 and 5' }, { status: 400 });
    }
    if (maxDisputeDays !== undefined && maxDisputeDays < 1) {
      return NextResponse.json({ error: 'Max dispute days must be at least 1 day' }, { status: 400 });
    }

    // Update settings
    systemSettings = {
      platformCommission: platformCommission ?? systemSettings.platformCommission,
      paymentGracePeriod: paymentGracePeriod ?? systemSettings.paymentGracePeriod,
      verificationTimeout: verificationTimeout ?? systemSettings.verificationTimeout,
      minCaregiverRating: minCaregiverRating ?? systemSettings.minCaregiverRating,
      maxDisputeDays: maxDisputeDays ?? systemSettings.maxDisputeDays,
      updatedAt: new Date().toISOString(),
      updatedBy: payload.userId,
    };

    // Log the change in audit logs
    await prisma.audit_logs.create({
      data: {
        actor_id: payload.userId,
        actor_role: payload.role,
        action_type: 'UPDATE',
        entity_type: 'SYSTEM_SETTINGS',
        entity_id: 'system',
        changes: JSON.stringify(body),
        ip_address: request.ip || request.headers.get('x-forwarded-for') || 'Unknown',
        user_agent: request.headers.get('user-agent') || 'Unknown',
      },
    });

    return NextResponse.json({ 
      message: 'Settings updated successfully', 
      settings: systemSettings 
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
