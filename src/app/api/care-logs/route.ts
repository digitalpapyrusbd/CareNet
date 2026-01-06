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
    const end_date = searchParams.get('end_date');

    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: any = {};
    
    switch (user.role) {
      case UserRole.GUARDIAN: {
        // Guardians can only see care logs for their patients
        const guardianPatients = await prisma.patients.findMany({
          where: { guardian_id: user.id },
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
        const company = await prisma.companies.findUnique({
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
      where.job_id = jobId;
    }
    
    if (logType) {
      where.logType = logType;
    }
    
    if (startDate && end_date) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(end_date),
      };
    } else if (startDate) {
      where.timestamp = {
        gte: new Date(startDate),
      };
    } else if (end_date) {
      where.timestamp = {
        lte: new Date(end_date),
      };
    }

    // Get care logs and total count
    const [careLogs, total] = await Promise.all([
      prisma.care_logs.findMany({
        where,
        skip,
        take: limit,
        include: { caregivers: {
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
            },
          },
          patients: {
            select: {
              id: true,
              name: true,
              date_of_birth: true,
            },
          },
          jobs: {
            select: {
              id: true,
              start_date: true,
              end_date: true,
            },
          },
          assignments: {
            select: {
              id: true,
              shift_start_time: true,
                shift_end_time: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
      }),
      prisma.care_logs.count({ where }),
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
    const assignment = await prisma.assignments.findFirst({
      where: {
        id: assignmentId,
        job_id: jobId,
        caregiver_id: user.id,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Invalid assignment or access denied' },
        { status: 403 }
      );
    }

    // Create care log
    const careLog = await prisma.care_logs.create({
      data: {
        job_id: jobId,
        assignment_id: assignmentId,
        caregiver_id: user.id,
        patient_id: patientId,
        log_type: logType,
        timestamp: new Date(timestamp),
        location_lat: locationLat ? parseFloat(locationLat) : null,
        location_lng: locationLng ? parseFloat(locationLng) : null,
        data,
        notes,
        photo_urls: photoUrls,
        guardian_notified: false,
      },
      include: { caregivers: {
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
          },
        },
        patients: {
          select: {
            id: true,
            name: true,
            users: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        jobs: {
          select: {
            id: true,
            start_date: true,
            end_date: true,
          },
        },
        assignments: {
          select: {
            id: true,
            shift_start_time: true,
                shift_end_time: true,
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