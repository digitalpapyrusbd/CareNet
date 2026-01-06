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
        where.guardian_id = user.id;
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
const agency = await prisma.agencies.findUnique({
      where: { userId: user.id },
    });
    
    if (agency) {
      where.agencyId = agency.id;
    }
        break;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { patient: { name: { contains: search, mode: 'insensitive' } } },
        { special_instructions: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get jobs and total count
    const [jobs, total] = await Promise.all([
      prisma.jobs.findMany({
        where,
        skip,
        take: limit,
        include: { patients: {
            select: {
              id: true,
              name: true,
              date_of_birth: true,
              gender: true,
              primaryConditions: true,
            },
          },
          users: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          companies: {
            select: {
              id: true,
              agency_name: true,
              is_verified: true,
            },
          },
          packages: {
            select: {
              id: true,
              name: true,
              category: true,
              price: true,
              duration_days: true,
              hours_per_day: true,
            },
          },
          assignments: {
            include: { caregivers_assignments_caregiver_idTocaregivers: {
                select: {
                  id: true,
                  users: {
                    select: {
                      id: true,
                      name: true,
                      phone: true,
                    },
                  },
                  photo_url: true,
                  rating_avg: true,
                },
              },
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              paid_at: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.jobs.count({ where }),
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
      agencyId,
      startDate,
        end_date: endDate,
      specialInstructions,
    } = body;

    // Validate required fields
    if (!packageId || !patientId || !agencyId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify package exists and get price
    const packageData = await prisma.packages.findUnique({
      where: { id: packageId },
    });

    if (!packageData) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      );
    }

    // Verify patient exists and belongs to guardian
    const patient = await prisma.patients.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    // Guardians can only create jobs for their own patients
    if (user.role === UserRole.GUARDIAN && patient.guardian_id !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Verify agency exists
    const agency = await prisma.agencies.findUnique({
      where: { id: agencyId },
    });

    if (!agency) {
      return NextResponse.json(
        { error: 'Invalid agency ID' },
        { status: 400 }
      );
    }

    // Calculate pricing
    const totalPrice = parseFloat(packageData.price.toString());
    const commissionRate = parseFloat(agency.commission_rate.toString());
    const commissionAmount = (totalPrice * commissionRate) / 100;
    const payoutAmount = totalPrice - commissionAmount;

    // Create job
    const job = await prisma.jobs.create({
      data: {
        package_id: packageId,
        patient_id: patientId,
        agency_id: agencyId,
        guardian_id: user.id,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        total_price: totalPrice,
        commission_amount: commissionAmount,
        payout_amount: payoutAmount,
        special_instructions: specialInstructions,
        status: 'PENDING_ASSIGNMENT',
      },
      include: { patients: {
          select: {
            id: true,
            name: true,
            date_of_birth: true,
            gender: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        companies: {
          select: {
            id: true,
            agency_name: true,
            is_verified: true,
          },
        },
        packages: {
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            duration_days: true,
            hours_per_day: true,
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