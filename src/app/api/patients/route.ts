/* OLD VERSION - TODO: Remove after verifying new version works
import { NextResponse } from 'next/server';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export async function GET() {
  try {
    const patients = await prisma.patient.findMany();
    return NextResponse.json({ success: true, data: patients });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'server_error', details: err?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, dob } = body;
    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'missing_fields' }, { status: 400 });
    }
    const created = await prisma.patient.create({ data: { name, phone, email: email || null, dob: dob || null } });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'server_error', details: err?.message }, { status: 500 });
  }
}
*/

import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get all patients (guardian/admin/moderator only)
export async function GET(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.GUARDIAN])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    // Guardians can only see their own patients
    if (user.role === UserRole.GUARDIAN) {
      where.guardianId = user.id;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { emergencyContactName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get patients and total count
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        include: {
          guardian: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          _count: {
            select: {
              healthRecords: true,
              jobs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: patients,
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
    console.error('Get patients error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/* TODO: Move this to a separate route file
// Create new patient
export async function POST(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.GUARDIAN])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const body = await request.json();
    const {
      name,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContactName,
      emergencyContactPhone,
      primaryConditions,
      allergies,
      mobilityLevel = 'INDEPENDENT',
      cognitiveStatus = 'NORMAL',
      photoUrl,
      userId,
      guardianId,
    } = body;

    // Validate required fields
    if (!name || !dateOfBirth || !gender || !address || !emergencyContactName || !emergencyContactPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine guardian ID
    let patientGuardianId = guardianId;
    
    if (user.role === UserRole.GUARDIAN) {
      patientGuardianId = user.id;
    } else if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MODERATOR) {
      if (!guardianId) {
        return NextResponse.json(
          { error: 'Guardian ID is required' },
          { status: 400 }
        );
      }
    }

    // Create patient
    const patient = await prisma.patient.create({
      data: {
        userId,
        guardianId: patientGuardianId!,
        name,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        bloodGroup,
        address,
        emergencyContactName,
        emergencyContactPhone,
        primaryConditions,
        allergies,
        mobilityLevel,
        cognitiveStatus,
        photoUrl,
        consentDataSharing: false,
        consentMarketing: false,
      },
      include: {
        guardian: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: patient,
      message: 'Patient created successfully',
    });
  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
*/