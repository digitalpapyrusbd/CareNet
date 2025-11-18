import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get all caregivers (admin/moderator only)
export async function GET(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY])(request);
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
    
    // Companies can only see their own caregivers
    if (user.role === UserRole.COMPANY) {
      const company = await prisma.company.findUnique({
        where: { userId: user.id },
      });
      
      if (company) {
        where.companyId = company.id;
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
      prisma.caregiver.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              isActive: true,
              createdAt: true,
            },
          },
          company: {
            select: {
              id: true,
              companyName: true,
              isVerified: true,
            },
          },
          _count: {
            select: {
              assignments: true,
              careLogs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.caregiver.count({ where }),
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
      const existingCaregiver = await prisma.caregiver.findUnique({
        where: { userId: user.id },
      });

      if (existingCaregiver) {
        return NextResponse.json(
          { error: 'User already has a caregiver profile' },
          { status: 400 }
        );
      }
    }

    // Verify company if provided
    if (companyId) {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        return NextResponse.json(
          { error: 'Invalid company ID' },
          { status: 400 }
        );
      }
    }

    // Create caregiver
    const caregiver = await prisma.caregiver.create({
      data: {
        userId: user.id,
        companyId,
        nid,
        nidUrl,
        photoUrl,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
        skills,
        certifications,
        experienceYears,
        languages,
        hourlyRate,
        backgroundCheckStatus: 'PENDING',
        ratingAvg: 0.0,
        ratingCount: 0,
        totalJobsCompleted: 0,
        isAvailable: true,
        isVerified: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        company: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    // Update user role to CAREGIVER if not already
    if (user.role !== UserRole.CAREGIVER) {
      await prisma.user.update({
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