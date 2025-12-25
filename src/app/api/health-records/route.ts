import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get all health records
export async function GET(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
    UserRole.GUARDIAN,
    UserRole.PATIENT
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const patientId = searchParams.get('patientId');
    const recordType = searchParams.get('recordType');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: any = {};
    
    switch (user.role) {
      case UserRole.GUARDIAN:
        // Guardians can only see health records for their patients
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
        
      case UserRole.PATIENT:
        // Patients can only see their own health records
        const patientRecord = await prisma.patients.findFirst({
          where: { user_id: user.id },
          select: { id: true }
        });
        
        if (patientRecord) {
          where.patientId = patientRecord.id;
        }
        break;
    }
    
    if (recordType) {
      where.recordType = recordType;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    where.isArchived = false;

    // Get health records and total count
    const [healthRecords, total] = await Promise.all([
      prisma.health_records.findMany({
        where,
        skip,
        take: limit,
        include: { patients: {
            select: {
              id: true,
              name: true,
              date_of_birth: true,
              guardian: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.health_records.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: healthRecords,
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
    console.error('Get health records error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new health record
export async function POST(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
    UserRole.GUARDIAN,
    UserRole.PATIENT
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const body = await request.json();
    const {
      patientId,
      recordType,
      title,
      description,
      fileUrl,
      metadata,
      validFrom,
      validUntil,
    } = body;

    // Validate required fields
    if (!patientId || !recordType || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify patient access based on user role
    let hasAccess = false;
    
    if (user.role === UserRole.GUARDIAN) {
      const patient = await prisma.patients.findUnique({
        where: { id: patientId },
        select: { guardian_id: true }
      });
      
      hasAccess = patient?.guardian_id === user.id;
    } else if (user.role === UserRole.PATIENT) {
      const patient = await prisma.patients.findFirst({
        where: { user_id: user.id },
        select: { id: true }
      });
      
      hasAccess = patient?.id === patientId;
    } else if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MODERATOR) {
      hasAccess = true;
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Create health record
    const healthRecord = await prisma.health_records.create({
      data: {
        patientId,
        recordType,
        title,
        description,
        fileUrl,
        metadata,
        uploadedBy: user.id,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        isArchived: false,
      },
      include: { patients: {
          select: {
            id: true,
            name: true,
            date_of_birth: true,
            guardian: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    // TODO: Send notification to guardian if uploaded by someone else
    // This would trigger a notification to the guardian about new health record

    return NextResponse.json({
      success: true,
      data: healthRecord,
      message: 'Health record created successfully',
    });
  } catch (error) {
    console.error('Create health record error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update health record
export async function PUT(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
    UserRole.GUARDIAN,
    UserRole.PATIENT
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('id');

    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      fileUrl,
      metadata,
      validFrom,
      validUntil,
      isArchived,
    } = body;

    // Check if record exists and user has access
    const existingRecord = await prisma.health_records.findUnique({
      where: { id: recordId },
      include: { patients: {
          select: {
            guardian_id: true,
            user_id: true,
          },
        },
      },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Health record not found' },
        { status: 404 }
      );
    }

    // Verify access
    let hasAccess = false;
    
    if (user.role === UserRole.GUARDIAN) {
      hasAccess = existingRecord.patient.guardian_id === user.id;
    } else if (user.role === UserRole.PATIENT) {
      hasAccess = existingRecord.patient.userId === user.id;
    } else if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MODERATOR) {
      hasAccess = true;
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update health record
    const updatedRecord = await prisma.health_records.update({
      where: { id: recordId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(fileUrl && { fileUrl }),
        ...(metadata && { metadata }),
        ...(validFrom && { validFrom: new Date(validFrom) }),
        ...(validUntil && { validUntil: new Date(validUntil) }),
        ...(isArchived !== undefined && { isArchived }),
      },
      include: { patients: {
          select: {
            id: true,
            name: true,
            date_of_birth: true,
            guardian: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedRecord,
      message: 'Health record updated successfully',
    });
  } catch (error) {
    console.error('Update health record error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}