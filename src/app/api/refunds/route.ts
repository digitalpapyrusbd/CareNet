/**
 * Refunds API Routes
 * Handles all refund operations and management
 */

import { NextRequest, NextResponse } from 'next/server';
import { refundService } from '@/lib/refund-service';
import { z } from 'zod';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';

// Validation schemas
const createRefundSchema = z.object({
  paymentId: z.string(),
  amount: z.number().positive().optional(),
  reason: z.string(),
  type: z.enum(['FULL', 'PARTIAL']),
  evidence: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

const processRefundSchema = z.object({
  refundId: z.string(),
});

const rejectRefundSchema = z.object({
  refundId: z.string(),
  reason: z.string(),
});

// Unused schemas removed to fix lint errors

/**
 * GET /api/refunds
 * Get refunds for authenticated user or specific refund
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }
    
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const refundId = searchParams.get('refundId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const statistics = searchParams.get('statistics');

    if (statistics === 'true') {
      // Get refund statistics
      const stats = await refundService.getRefundStatistics(
        user.id,
        user.role as 'GUARDIAN' | 'CAREGIVER' | 'COMPANY',
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );

      return NextResponse.json({
        success: true,
        data: stats,
      });
    } else if (refundId) {
      // Get specific refund
      const refund = await refundService.getRefund(refundId);
      
      if (!refund) {
        return NextResponse.json(
          { error: 'Refund not found' },
          { status: 404 }
        );
      }

      // Check if user has permission to view this refund
      const hasPermission = await checkRefundPermission(user.id, user.role, refund);
      
      if (!hasPermission) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: refund,
      });
    } else {
      // Get user's refunds
      const userRefunds = await refundService.getUserRefunds(
        user.id,
        user.role as 'GUARDIAN' | 'CAREGIVER' | 'COMPANY',
        status || undefined
      );

      return NextResponse.json({
        success: true,
        data: userRefunds,
      });
    }
  } catch (error) {
    console.error('Refunds GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/refunds
 * Create refund request or process refund operations
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }
    
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create':
        return handleCreateRefund(body, user);
      case 'process':
        return handleProcessRefund(body, user);
      case 'reject':
        return handleRejectRefund(body, user);
      case 'check-eligibility':
        return handleCheckEligibility(body, user);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Refunds POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle refund request creation
 */
async function handleCreateRefund(body: any, user: any) {
  try {
    const validatedData = createRefundSchema.parse(body);
    
    // Check permissions for creating refund
    const hasPermission = await checkCreateRefundPermission(user.id, user.role, validatedData.paymentId);
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const refund = await refundService.createRefundRequest({
      paymentId: validatedData.paymentId,
      amount: validatedData.amount,
      reason: validatedData.reason,
      type: validatedData.type,
      requestedBy: user.id,
      evidence: validatedData.evidence,
      metadata: validatedData.metadata,
    });

    return NextResponse.json({
      success: true,
      data: refund,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create refund error:', error);
    return NextResponse.json(
      { error: 'Failed to create refund request' },
      { status: 500 }
    );
  }
}

/**
 * Handle refund processing
 */
async function handleProcessRefund(body: any, user: any) {
  try {
    const validatedData = processRefundSchema.parse(body);
    
    // Check permissions for processing refund
    const hasPermission = await checkProcessRefundPermission(user.id, user.role);
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const refund = await refundService.processRefund(
      validatedData.refundId,
      user.id
    );

    return NextResponse.json({
      success: true,
      data: refund,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Process refund error:', error);
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}

/**
 * Handle refund rejection
 */
async function handleRejectRefund(body: any, user: any) {
  try {
    const validatedData = rejectRefundSchema.parse(body);
    
    // Check permissions for rejecting refund
    const hasPermission = await checkProcessRefundPermission(user.id, user.role);
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const refund = await refundService.rejectRefund(
      validatedData.refundId,
      validatedData.reason,
      user.id
    );

    return NextResponse.json({
      success: true,
      data: refund,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Reject refund error:', error);
    return NextResponse.json(
      { error: 'Failed to reject refund' },
      { status: 500 }
    );
  }
}

/**
 * Handle refund eligibility check
 */
async function handleCheckEligibility(body: any, user: any) {
  try {
    const { paymentId, amount } = body;
    
    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Check if user has permission to check eligibility for this payment
    const hasPermission = await checkCreateRefundPermission(user.id, user.role, paymentId);
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const eligibility = await refundService.checkRefundEligibility(paymentId, amount);

    return NextResponse.json({
      success: true,
      data: eligibility,
    });
  } catch (error) {
    console.error('Check refund eligibility error:', error);
    return NextResponse.json(
      { error: 'Failed to check refund eligibility' },
      { status: 500 }
    );
  }
}

/**
 * Check if user has permission to view refund
 */
async function checkRefundPermission(userId: string, userRole: string, refund: any): Promise<boolean> {
  // Super admin can view all refunds
  if (userRole === 'SUPER_ADMIN') {
    return true;
  }

  // Moderator can view all refunds
  if (userRole === 'MODERATOR') {
    return true;
  }

  // Guardian can view refunds for their payments
  if (userRole === 'GUARDIAN' && refund.payment?.job?.guardianId === userId) {
    return true;
  }

  // Caregiver can view refunds for their job payments
  if (userRole === 'CAREGIVER' && refund.payment?.job?.caregiverId === userId) {
    return true;
  }

  // Company can view refunds for their job payments
  if (userRole === 'COMPANY' && refund.payment?.job?.companyId === userId) {
    return true;
  }

  // User can view their own refund requests
  if (refund.requestedBy === userId) {
    return true;
  }

  return false;
}

/**
 * Check if user has permission to create refund
 */
async function checkCreateRefundPermission(userId: string, userRole: string, paymentId: string): Promise<boolean> {
  // Super admin and moderator can create refunds for any payment
  if (userRole === 'SUPER_ADMIN' || userRole === 'MODERATOR') {
    return true;
  }

  // Import PrismaClient to check payment ownership
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const payment = await prisma.payments.findUnique({
      where: { id: paymentId },
      include: { jobs: {
          include: {
            guardian: true,
            caregiver: true,
            company: true,
          },
        },
      },
    });

    if (!payment) {
      return false;
    }

    // Guardian can create refunds for their payments
    if (userRole === 'GUARDIAN' && payment.job?.guardianId === userId) {
      return true;
    }

    // Caregiver can create refunds for their job payments
    if (userRole === 'CAREGIVER' && payment.job?.caregiverId === userId) {
      return true;
    }

    // Company can create refunds for their job payments
    if (userRole === 'COMPANY' && payment.job?.companyId === userId) {
      return true;
    }

    return false;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Check if user has permission to process refund
 */
async function checkProcessRefundPermission(userId: string, userRole: string): Promise<boolean> {
  // Only moderators and super admins can process refunds
  return userRole === 'MODERATOR' || userRole === 'SUPER_ADMIN';
}