import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get all caregivers (admin/moderator only)
export async function GET(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.AGENCY])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isVerified = searchParams.get('isVerified');
    const isAvailable = searchParams.get('isAvailable');
    const skills = searchParams.get('skills');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    // Agencies can only see their own caregivers
    if (user.role === UserRole.AGENCY) {
      const agency = await prisma.agencies.findUnique({
        where: { userId: user.id },
      });
      
      if (agency) {
        where.agency_id = agency.id;
      }
    }
    
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search, mode: 'insensitive' } } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (isVerified !== null) {
      where.isVerified = isVerified === 'true';
    }
    
    if (isAvailable !== null) {
      where.isAvailable = isAvailable === 'true';
    }
    
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      where.skills = {
        path: '$',
        contains: skillsArray,
      };
    }

    // Get caregivers and total count
    const [caregivers, total] = await Promise.all([
      prisma.caregivers.findMany({
        where,
        skip,
        take: limit,
        include: { users: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              is_active: true,
              created_at: true,
            },
          },
          companies: {
            select: {
              id: true,
              company_name: true,
              is_verified: true,
            },
          },
          _count: {
            select: {
              care_logs: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.caregivers.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: caregivers,
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
    console.error('Get caregivers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new caregiver
export async function POST(request: NextRequest) {
  // Check authentication
  const authResult = await authenticate(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const body = await request.json();
    const {
      nid,
      nidUrl,
      photoUrl,
      dateOfBirth,
      gender,
      address,
      skills,
      certifications,
      experienceYears = 0,
      languages = ['bn'],
      hourlyRate,
      companyId,
    } = body;

    // Validate required fields
    if (!nid || !nidUrl || !photoUrl || !dateOfBirth || !gender || !address || !skills) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already has a caregiver profile
    if (user.role === UserRole.CAREGIVER) {
      const existingCaregiver = await prisma.caregivers.findUnique({
        where: { userId: user.id },
      });

      if (existingCaregiver) {
        return NextResponse.json(
          { error: 'User already has a caregiver profile' },
          { status: 400 }
        );
      }
    }

    // Verify agency if provided
    if (companyId) {
      const agency = await prisma.agencies.findUnique({
        where: { id: companyId },
      });

      if (!agency) {
        return NextResponse.json(
          { error: 'Invalid agency ID' },
          { status: 400 }
        );
      }
    }

    // Create caregiver
    const caregiver = await prisma.caregivers.create({
      data: {
        userId: user.id,
        agency_id: companyId,
        nid,
        nid_url: nidUrl,
        photo_url: photoUrl,
        date_of_birth: new Date(dateOfBirth),
        gender,
        address,
        skills,
        certifications,
        experience_years: experienceYears,
        languages,
        hourly_rate: hourlyRate,
        background_check_status: 'PENDING',
        rating_avg: 0.0,
        rating_count: 0,
        total_jobs_completed: 0,
        is_available: true,
        is_verified: false,
      },
      include: { users: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        agencies: {
          select: {
            id: true,
            agency_name: true,
          },
        },
      },
    });

    // Update user role to CAREGIVER if not already
    if (user.role !== UserRole.CAREGIVER) {
      await prisma.users.update({
        where: { id: user.id },
        data: { role: UserRole.CAREGIVER },
      });
    }

    return NextResponse.json({
      success: true,
      data: caregiver,
      message: 'Caregiver profile created successfully',
    });
  } catch (error) {
    console.error('Create caregiver error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}