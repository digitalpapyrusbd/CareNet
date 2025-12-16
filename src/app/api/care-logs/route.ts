import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get all care logs
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
    const jobId = searchParams.get('jobId');
    const patientId = searchParams.get('patientId');
    const logType = searchParams.get('logType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: any = {};
    
    switch (user.role) {
      case UserRole.GUARDIAN: {
        // Guardians can only see care logs for their patients
        const guardianPatients = await prisma.patient.findMany({
          where: { guardianId: user.id },
          select: { id: true }
        });
        const patientIds = guardianPatients.map((p: any) => p.id);
        
        if (patientId) {
          if (!patientIds.includes(patientId)) {
            return NextResponse.json(
              { error: 'Access denied' },
              { status: 403 }
            );
          }
          where.patientId = patientId;
        } else {
          where.patientId = { in: patientIds };
        }
        break;
      }
        
      case UserRole.CAREGIVER:
        // Caregivers can only see their own care logs
        where.caregiverId = user.id;
        break;
        
      case UserRole.COMPANY: {
        // Companies can see care logs for their caregivers
        const company = await prisma.company.findUnique({
          where: { userId: user.id },
        });
        
        if (company) {
          where.caregiver = {
            companyId: company.id,
          };
        }
        break;
      }
    }
    
    if (jobId) {
      where.jobId = jobId;
    }
    
    if (logType) {
      where.logType = logType;
    }
    
    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.timestamp = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.timestamp = {
        lte: new Date(endDate),
      };
    }

    // Get care logs and total count
    const [careLogs, total] = await Promise.all([
      prisma.careLog.findMany({
        where,
        skip,
        take: limit,
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
            },
          },
          patient: {
            select: {
              id: true,
              name: true,
              dateOfBirth: true,
            },
          },
          job: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
            },
          },
          assignment: {
            select: {
              id: true,
              shiftStartTime: true,
              shiftEndTime: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
      }),
      prisma.careLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: careLogs,
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
    console.error('Get care logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new care log
export async function POST(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
    UserRole.CAREGIVER
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const body = await request.json();
    const {
      jobId,
      assignmentId,
      patientId,
      logType,
      timestamp,
      locationLat,
      locationLng,
      data,
      notes,
      photoUrls,
    } = body;

    // Validate required fields
    if (!jobId || !assignmentId || !patientId || !logType || !timestamp || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify caregiver is assigned to this job
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        jobId,
        caregiverId: user.id,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Invalid assignment or access denied' },
        { status: 403 }
      );
    }

    // Create care log
    const careLog = await prisma.careLog.create({
      data: {
        jobId,
        assignmentId,
        caregiverId: user.id,
        patientId,
        logType,
        timestamp: new Date(timestamp),
        locationLat: locationLat ? parseFloat(locationLat) : null,
        locationLng: locationLng ? parseFloat(locationLng) : null,
        data,
        notes,
        photoUrls,
        guardianNotified: false,
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
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            guardian: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        job: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
          },
        },
        assignment: {
          select: {
            id: true,
            shiftStartTime: true,
            shiftEndTime: true,
          },
        },
      },
    });

    // TODO: Send notification to guardian
    // This would trigger a notification to the guardian about the new care log

    return NextResponse.json({
      success: true,
      data: careLog,
      message: 'Care log created successfully',
    });
  } catch (error) {
    console.error('Create care log error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}