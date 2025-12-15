import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';
import rateLimitRequest from '@/lib/middleware/rateLimit'

// Get a single payment by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const rl = await rateLimitRequest(request as unknown as Request, { key: 'payments_get_by_id', limit: 30, windowSeconds: 60 })
  if (rl) return rl
  // Check authentication and authorization
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
    UserRole.COMPANY,
    UserRole.GUARDIAN
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;
  const { id } = params;

  try {
    // Build where clause based on user role
    const where: any = { id };
    
    switch (user.role) {
      case UserRole.GUARDIAN:
        // Guardians can only see their own payments
        where.payerId = user.id;
        break;
        
      case UserRole.COMPANY:
        // Companies can see payments for their jobs
        const company = await prisma.company.findUnique({
          where: { userId: user.id },
        });
        
        if (company) {
          where.job = {
            companyId: company.id,
          };
        }
        break;
    }

    // Get payment with related data
    const payment = await prisma.payment.findFirst({
      where,
      include: {
        payer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            patient: {
              select: {
                id: true,
                name: true,
              },
            },
            company: {
              select: {
                id: true,
                companyName: true,
              },
            },
            package: {
              select: {
                id: true,
                name: true,
              },
            },
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Get payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Process a payment (approve/reject) - Admin/Moderator only
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const rl = await rateLimitRequest(request as unknown as Request, { key: 'payments_process', limit: 10, windowSeconds: 60 })
  if (rl) return rl
  // Check authentication and authorization - only Admin/Moderator can process payments
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR
  ])(request);
  if (authResult) return authResult;

  const { id } = params;

  try {
    const body = await request.json();
    const { action } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Get the payment
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Payment can only be processed if status is PENDING' },
        { status: 400 }
      );
    }

    // Update payment status based on action
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: action === 'approve' ? 'COMPLETED' : 'FAILED',
        paidAt: action === 'approve' ? new Date() : null,
      },
      include: {
        payer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            patient: {
              select: {
                id: true,
                name: true,
              },
            },
            company: {
              select: {
                id: true,
                companyName: true,
              },
            },
            package: {
              select: {
                id: true,
                name: true,
              },
            },
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });

    // If payment is approved, update job status to ACTIVE
    if (action === 'approve') {
      await prisma.job.update({
        where: { id: payment.jobId },
        data: { status: 'ACTIVE' },
      });
    }

    // TODO: Send notification to payer about payment status change
    // This would integrate with notification system

    return NextResponse.json({
      success: true,
      data: updatedPayment,
      message: `Payment ${action}d successfully`,
    });
  } catch (error) {
    console.error('Process payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}