import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';
import rateLimitRequest from '@/lib/middleware/rateLimit'

// Get all payments
export async function GET(request: NextRequest) {
  const rl = await rateLimitRequest(request as unknown as Request, { key: 'payments_list', limit: 30, windowSeconds: 60 })
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

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const method = searchParams.get('method');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: any = {};
    
    switch (user.role) {
      case UserRole.GUARDIAN:
        // Guardians can only see their own payments
        where.payerId = user.id;
        break;
        
      case UserRole.COMPANY:
        // Companies can see payments for their jobs
        const company = await prisma.companies.findUnique({
          where: { user_id: user.id },
        });
        
        if (company) {
          where.job = {
            companyId: company.id,
          };
        }
        break;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (method) {
      where.method = method;
    }
    
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { transactionId: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get payments and total count
    const [payments, total] = await Promise.all([
      prisma.payments.findMany({
        where,
        skip,
        take: limit,
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
                  company_name: true,
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
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.payments.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: payments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new payment
export async function POST(request: NextRequest) {
  const rl = await rateLimitRequest(request as unknown as Request, { key: 'payments_create', limit: 20, windowSeconds: 60 })
  if (rl) return rl
  // Check authentication and authorization
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
    UserRole.GUARDIAN
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const body = await request.json();
    const {
      jobId,
      amount,
      method,
      transactionId,
      invoiceNumber,
    } = body;

    // Validate required fields
    if (!jobId || !amount || !method || !transactionId || !invoiceNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify job exists and belongs to guardian
    const job = await prisma.jobs.findUnique({
      where: { id: jobId },
      include: {
        guardian: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    // Guardians can only pay for their own jobs
    if (user.role === UserRole.GUARDIAN && job.guardian.id !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if payment already exists for this transaction
    const existingPayment = await prisma.payments.findUnique({
      where: { transactionId },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Payment with this transaction ID already exists' },
        { status: 400 }
      );
    }

    // Create payment
    const payment = await prisma.payments.create({
      data: {
        jobId,
        payer_id: user.id,
        amount: parseFloat(amount),
        method,
        transactionId,
        invoiceNumber,
        status: 'PENDING' as const,
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
                company_name: true,
              },
            },
            package: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
            startDate: true,
            endDate: true,
            totalPrice: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: payment,
      message: 'Payment created successfully',
    });
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}