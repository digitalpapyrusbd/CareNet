import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get all disputes
export async function GET(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
    UserRole.COMPANY,
    UserRole.GUARDIAN,
    UserRole.CAREGIVER
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const disputeType = searchParams.get('disputeType');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: any = {};
    
    switch (user.role) {
      case UserRole.GUARDIAN:
      case UserRole.CAREGIVER:
        // Users can only see disputes they raised or are against
        where.OR = [
          { raisedBy: user.id },
          { against: user.id },
        ];
        break;
        
      case UserRole.COMPANY:
        // Companies can see disputes for their jobs
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
    
    if (status) {
      where.status = status;
    }
    
    if (disputeType) {
      where.disputeType = disputeType;
    }
    
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { job: { patient: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    // Get disputes and total count
    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where,
        skip,
        take: limit,
        include: {
          raisedByUser: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
            },
          },
          againstUser: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
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
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.dispute.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: disputes,
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
    console.error('Get disputes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new dispute
export async function POST(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
    UserRole.GUARDIAN,
    UserRole.CAREGIVER
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const body = await request.json();
    const {
      jobId,
      against,
      disputeType,
      description,
      evidenceUrls,
    } = body;

    // Validate required fields
    if (!jobId || !against || !disputeType || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify job exists and user has access
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        guardian: {
          select: {
            id: true,
          },
        },
        assignments: {
          include: {
            caregiver: {
              select: {
                userId: true,
              },
            },
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

    // Check if user can raise dispute for this job
    let canRaiseDispute = false;
    
    if (user.role === UserRole.GUARDIAN && job.guardian.id === user.id) {
      canRaiseDispute = true;
    } else if (user.role === UserRole.CAREGIVER) {
      canRaiseDispute = job.assignments.some(
        (assignment: any) => assignment.caregiver.userId === user.id
      );
    }

    if (!canRaiseDispute) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if dispute already exists for this job and user
    const existingDispute = await prisma.dispute.findFirst({
      where: {
        jobId,
        raisedBy: user.id,
        against,
        status: {
          notIn: ['RESOLVED', 'CLOSED'],
        },
      },
    });

    if (existingDispute) {
      return NextResponse.json(
        { error: 'Dispute already exists for this job' },
        { status: 400 }
      );
    }

    // Create dispute
    const dispute = await prisma.dispute.create({
      data: {
        jobId,
        raisedBy: user.id,
        against,
        disputeType,
        description,
        evidenceUrls,
        status: 'OPEN',
      },
      include: {
        raisedByUser: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
          },
        },
        againstUser: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
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
          },
        },
      },
    });

    // TODO: Notify moderators/admins of new dispute
    // This would integrate with notification system

    return NextResponse.json({
      success: true,
      data: dispute,
      message: 'Dispute created successfully',
    });
  } catch (error) {
    console.error('Create dispute error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}