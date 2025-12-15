import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get all marketplace jobs
export async function GET(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
    UserRole.COMPANY,
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
    const location = searchParams.get('location');
    const skills = searchParams.get('skills');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    // Companies can only see their own marketplace jobs
    if (user.role === UserRole.COMPANY) {
      const company = await prisma.company.findUnique({
        where: { userId: user.id },
      });
      
      if (company) {
        where.companyId = company.id;
      }
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    
    if (skills) {
      const skillsArray = skills.split(',').map((s: string) => s.trim());
      where.requiredSkills = {
        path: '$',
        contains: skillsArray,
      };
    }

    // Get marketplace jobs and total count
    const [marketplaceJobs, total] = await Promise.all([
      prisma.marketplaceJob.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: {
            select: {
              id: true,
              companyName: true,
              isVerified: true,
              ratingAvg: true,
            },
          },
          postedByUser: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          filledByCaregiver: {
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
          applications: {
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
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.marketplaceJob.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: marketplaceJobs,
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
    console.error('Get marketplace jobs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new marketplace job
export async function POST(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
    UserRole.COMPANY
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const body = await request.json();
    const {
      title,
      description,
      location,
      requiredSkills,
      startDate,
      durationDays,
      hoursPerDay,
      offeredRate,
      companyId,
    } = body;

    // Validate required fields
    if (!title || !description || !location || !requiredSkills || !startDate || !durationDays || !hoursPerDay || !offeredRate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine company ID
    let jobCompanyId = companyId;
    
    if (user.role === UserRole.COMPANY) {
      const company = await prisma.company.findUnique({
        where: { userId: user.id },
      });
      
      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }
      
      jobCompanyId = company.id;
    } else if (!jobCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Create marketplace job
    const marketplaceJob = await prisma.marketplaceJob.create({
      data: {
        companyId: jobCompanyId,
        title,
        description,
        location,
        requiredSkills,
        startDate: new Date(startDate),
        durationDays: parseInt(durationDays),
        hoursPerDay: parseInt(hoursPerDay),
        offeredRate: parseFloat(offeredRate),
        status: 'OPEN',
        applicationsCount: 0,
      },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            isVerified: true,
          },
        },
        postedByUser: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: marketplaceJob,
      message: 'Marketplace job created successfully',
    });
  } catch (error) {
    console.error('Create marketplace job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply to marketplace job
export async function PUT(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
    UserRole.CAREGIVER
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { coverLetter } = body;

    // Check if marketplace job exists and is open
    const marketplaceJob = await prisma.marketplaceJob.findUnique({
      where: { id: jobId },
    });

    if (!marketplaceJob) {
      return NextResponse.json(
        { error: 'Marketplace job not found' },
        { status: 404 }
      );
    }

    if (marketplaceJob.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Job is no longer accepting applications' },
        { status: 400 }
      );
    }

    // Get caregiver profile
    const caregiver = await prisma.caregiver.findUnique({
      where: { userId: user.id },
    });

    if (!caregiver) {
      return NextResponse.json(
        { error: 'Caregiver profile not found' },
        { status: 404 }
      );
    }

    // Check if already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        marketplaceJobId_caregiverId: {
          marketplaceJobId: jobId,
          caregiverId: caregiver.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Already applied to this job' },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        marketplaceJobId: jobId,
        caregiverId: caregiver.id,
        coverLetter,
        status: 'PENDING',
      },
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
        marketplaceJob: {
          select: {
            id: true,
            title: true,
            location: true,
            offeredRate: true,
            company: {
              select: {
                id: true,
                companyName: true,
              },
            },
          },
        },
      },
    });

    // Update applications count
    await prisma.marketplaceJob.update({
      where: { id: jobId },
      data: {
        applicationsCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: application,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Apply to marketplace job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}