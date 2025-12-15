import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get all jobs
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
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: any = {};
    
    switch (user.role) {
      case UserRole.GUARDIAN:
        // Guardians can only see their own jobs
        where.guardianId = user.id;
        break;
        
      case UserRole.CAREGIVER:
        // Caregivers can only see jobs assigned to them
        where.assignments = {
          some: {
            caregiverId: user.id,
          },
        };
        break;
        
      case UserRole.COMPANY:
        // Companies can see their own jobs
        const company = await prisma.company.findUnique({
          where: { userId: user.id },
        });
        
        if (company) {
          where.companyId = company.id;
        }
        break;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { patient: { name: { contains: search, mode: 'insensitive' } } },
        { specialInstructions: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get jobs and total count
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              dateOfBirth: true,
              gender: true,
              primaryConditions: true,
            },
          },
          guardian: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          company: {
            select: {
              id: true,
              companyName: true,
              isVerified: true,
            },
          },
          package: {
            select: {
              id: true,
              name: true,
              category: true,
              price: true,
              durationDays: true,
              hoursPerDay: true,
            },
          },
          assignments: {
            include: {
              caregiver: {
                select: {
                  id: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      phone: true,
                    },
                  },
                  photoUrl: true,
                  ratingAvg: true,
                },
              },
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              paidAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.job.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: jobs,
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
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new job
export async function POST(request: NextRequest) {
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
      packageId,
      patientId,
      companyId,
      startDate,
      endDate,
      specialInstructions,
    } = body;

    // Validate required fields
    if (!packageId || !patientId || !companyId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify package exists and get price
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!packageData) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      );
    }

    // Verify patient exists and belongs to guardian
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    // Guardians can only create jobs for their own patients
    if (user.role === UserRole.GUARDIAN && patient.guardianId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Invalid company ID' },
        { status: 400 }
      );
    }

    // Calculate pricing
    const totalPrice = packageData.price;
    const commissionAmount = (totalPrice * company.commissionRate) / 100;
    const payoutAmount = totalPrice - commissionAmount;

    // Create job
    const job = await prisma.job.create({
      data: {
        packageId,
        patientId,
        companyId,
        guardianId: user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        commissionAmount,
        payoutAmount,
        specialInstructions,
        status: 'PENDING_ASSIGNMENT',
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            dateOfBirth: true,
            gender: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            companyName: true,
            isVerified: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            durationDays: true,
            hoursPerDay: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: job,
      message: 'Job created successfully',
    });
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}