import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get all packages
export async function GET(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR,
    UserRole.COMPANY,
    UserRole.GUARDIAN
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const companyId = searchParams.get('companyId');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    // Companies can only see their own packages
    if (user.role === UserRole.COMPANY) {
      const company = await prisma.company.findUnique({
        where: { userId: user.id },
      });
      
      if (company) {
        where.companyId = company.id;
      }
    } else if (companyId) {
      where.companyId = companyId;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.category = category;
    }
    
    where.isActive = true;

    // Get packages and total count
    const [packages, total] = await Promise.all([
      prisma.package.findMany({
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
          _count: {
            select: {
              jobs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.package.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: packages,
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
    console.error('Get packages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new package
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
      name,
      description,
      category,
      price,
      durationDays,
      hoursPerDay,
      inclusions,
      exclusions,
      caregiverCount = 1,
      minAdvanceDays = 2,
      companyId,
    } = body;

    // Validate required fields
    if (!name || !description || !category || !price || !durationDays || !hoursPerDay || !inclusions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine company ID
    let packageCompanyId = companyId;
    
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
      
      packageCompanyId = company.id;
    } else if (!packageCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Create package
    const packageData = await prisma.package.create({
      data: {
        companyId: packageCompanyId,
        name,
        description,
        category,
        price: parseFloat(price),
        durationDays: parseInt(durationDays),
        hoursPerDay: parseInt(hoursPerDay),
        inclusions,
        exclusions,
        caregiverCount: parseInt(caregiverCount),
        minAdvanceDays: parseInt(minAdvanceDays),
        isActive: true,
      },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: packageData,
      message: 'Package created successfully',
    });
  } catch (error) {
    console.error('Create package error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}