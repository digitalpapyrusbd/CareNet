import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate, authorize, getCurrentUser } from '@/lib/middleware/auth';
import { authorizeResource, authorizeOwnResource } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

// Enhanced validation schemas
const updateCompanySchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name must be less than 100 characters'),
  tradeLicense: z.string().min(5, 'Trade license number is required'),
  tin: z.string().optional(),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  contactEmail: z.string().email('Valid contact email is required'),
  contactPhone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Valid Bangladeshi contact phone is required'),
  address: z.string().min(10, 'Company address must be at least 10 characters'),
  logoUrl: z.string().url('Valid logo URL is required').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  specializations: z.array(z.string()).optional(),
  payoutMethod: z.enum(['BANK_TRANSFER', 'BKASH', 'NAGAD']),
  payoutAccount: z.string().min(5, 'Payout account is required'),
  commissionRate: z.number().min(0).max(50).optional(),
  subscriptionTier: z.enum(['STARTER', 'GROWTH', 'ENTERPRISE']).optional(),
});

const verificationSchema = z.object({
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED']),
  verificationNotes: z.string().max(500, 'Verification notes must be less than 500 characters').optional(),
  subscriptionExpiresAt: z.string().optional(),
});

const packageSchema = z.object({
  name: z.string().min(2, 'Package name is required'),
  description: z.string().min(10, 'Package description must be at least 10 characters'),
  category: z.enum(['ELDERLY_CARE', 'POST_SURGERY', 'CHRONIC_ILLNESS', 'COMPANION', 'NURSING']),
  price: z.number().min(50, 'Price must be at least 50 BDT'),
  durationDays: z.number().min(1, 'Duration must be at least 1 day'),
  hoursPerDay: z.number().min(1).max(24, 'Hours per day must be between 1 and 24'),
  inclusions: z.array(z.string()).min(1, 'At least one inclusion is required'),
  exclusions: z.array(z.string()).optional(),
  caregiverCount: z.number().min(1).max(10).default(1),
  isActive: z.boolean().default(true),
  minAdvanceDays: z.number().min(0).default(2),
});

const serviceZoneSchema = z.object({
  zoneName: z.string().min(2, 'Zone name is required'),
  regionCode: z.string().min(2, 'Region code is required'),
  boundaryGeojson: z.string().optional(),
  isActive: z.boolean().default(true),
});

// GET /api/companies - Get companies with advanced filtering
export async function GET(request: NextRequest) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR])(request);
  if (authResult) return authResult;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isVerified = searchParams.get('isVerified');
    const subscriptionTier = searchParams.get('subscriptionTier') as any;
    const region = searchParams.get('region');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { contactPhone: { contains: search, mode: 'insensitive' } },
        { contactEmail: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (isVerified !== null) {
      where.isVerified = isVerified === 'true';
    }
    
    if (subscriptionTier) {
      where.subscriptionTier = subscriptionTier;
    }
    
    if (region) {
      where.service_zones = {
        some: {
          regionCode: region,
        },
      };
    }
    
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }
    
    // Build order by clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;
    
    // Get companies and total count
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
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
            },
          },
          caregivers: {
            select: {
              id: true,
              name: true,
              isVerified: true,
              ratingAvg: true,
              totalJobsCompleted: true,
              isAvailable: true,
            },
          },
          jobs: {
            select: {
              _count: true,
            },
          },
          packages: {
            select: {
              _count: true,
            },
          },
          service_zones: {
            select: {
              id: true,
              zoneName: true,
              regionCode: true,
              isActive: true,
            },
          },
          _count: {
            select: true,
          },
        },
        orderBy,
      }),
      prisma.company.count({ where }),
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      data: companies,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      filters: {
        applied: {
          search,
          isVerified,
          subscriptionTier,
          region,
          dateFrom,
          dateTo,
          sortBy,
          sortOrder,
        },
        available: {
          subscriptionTiers: ['STARTER', 'GROWTH', 'ENTERPRISE'],
          sortOptions: ['createdAt', 'companyName', 'ratingAvg', 'caregiverCount'],
        },
      },
    });
  } catch (error) {
    console.error('Get companies error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/companies - Create new company
export async function POST(request: NextRequest) {
  // Authenticate user (must be authenticated to create company)
  const authResult = await authenticate(request);
  if (authResult) return authResult;
  
  const currentUser = getCurrentUser(request);
  
  try {
    const body = await request.json();
    const validatedData = updateCompanySchema.parse(body);
    
    // Check if user already has a company
    if (currentUser.role === UserRole.COMPANY) {
      const existingCompany = await prisma.company.findUnique({
        where: { userId: currentUser.id },
      });
      
      if (existingCompany) {
        return NextResponse.json(
          { error: 'User already has a registered company' },
          { status: 409 }
        );
      }
    }
    
    // Check if trade license already exists
    const existingTradeLicense = await prisma.company.findFirst({
      where: { tradeLicense: validatedData.tradeLicense },
    });
    
    if (existingTradeLicense) {
      return NextResponse.json(
        { error: 'Trade license already exists' },
        { status: 409 }
      );
    }
    
    // Create company
    const company = await prisma.company.create({
      data: {
        userId: currentUser.id,
        companyName: validatedData.companyName,
        tradeLicense: validatedData.tradeLicense,
        tin: validatedData.tin,
        contactPerson: validatedData.contactPerson,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone,
        address: validatedData.address,
        logoUrl: validatedData.logoUrl,
        description: validatedData.description,
        specializations: validatedData.specializations,
        payoutMethod: validatedData.payoutMethod,
        payoutAccount: validatedData.payoutAccount,
        commissionRate: validatedData.commissionRate || 12.00,
        subscriptionTier: validatedData.subscriptionTier || 'STARTER',
        ratingAvg: 0.0,
        ratingCount: 0,
        isVerified: false,
      },
    });
    
    // Update user role to COMPANY if not already
    if (currentUser.role !== UserRole.COMPANY) {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { role: UserRole.COMPANY },
      });
    }
    
    return NextResponse.json({
      success: true,
      data: company,
      message: 'Company created successfully',
    });
  } catch (error) {
    console.error('Create company error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/companies/[id] - Update company
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorizeResource('companies', 'write')(request);
  if (authResult) return authResult;
  
  const currentUser = getCurrentUser(request);
  
  try {
    const companyId = params.id;
    const body = await request.json();
    const validatedData = updateCompanySchema.parse(body);
    
    // Find company
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
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
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Check authorization - only admin, moderator, or company owner can update
    const isOwner = currentUser.role === UserRole.COMPANY && company.userId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.MODERATOR;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions to update this company' },
        { status: 403 }
      );
    }
    
    // Check if trade license is being changed to an existing one
    if (validatedData.tradeLicense && validatedData.tradeLicense !== company.tradeLicense) {
      const existingTradeLicense = await prisma.company.findFirst({
        where: { 
          tradeLicense: validatedData.tradeLicense,
          id: { not: companyId },
        },
      });
      
      if (existingTradeLicense) {
        return NextResponse.json(
          { error: 'Trade license already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update company
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        companyName: validatedData.companyName,
        tradeLicense: validatedData.tradeLicense,
        tin: validatedData.tin,
        contactPerson: validatedData.contactPerson,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone,
        address: validatedData.address,
        logoUrl: validatedData.logoUrl,
        description: validatedData.description,
        specializations: validatedData.specializations,
        payoutMethod: validatedData.payoutMethod,
        payoutAccount: validatedData.payoutAccount,
        commissionRate: validatedData.commissionRate,
        subscriptionTier: validatedData.subscriptionTier,
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json({
      success: true,
      data: updatedCompany,
      message: 'Company updated successfully',
    });
  } catch (error) {
    console.error('Update company error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/companies/[id]/verify - Verify/reject company
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR])(request);
  if (authResult) return authResult;
  
  try {
    const companyId = params.id;
    const body = await request.json();
    const validatedData = verificationSchema.parse(body);
    
    // Find company
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Update verification status
    const updateData: any = {
      isVerified: validatedData.status === 'VERIFIED',
      verificationNotes: validatedData.verificationNotes,
      updatedAt: new Date(),
    };
    
    if (validatedData.subscriptionExpiresAt) {
      updateData.subscriptionExpiresAt = new Date(validatedData.subscriptionExpiresAt);
    }
    
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: updateData,
    });
    
    return NextResponse.json({
      success: true,
      data: updatedCompany,
      message: `Company ${validatedData.status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error('Verify company error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/companies/[id]/packages - Create package for company
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorizeResource('companies', 'write')(request);
  if (authResult) return authResult;
  
  const currentUser = getCurrentUser(request);
  
  try {
    const companyId = params.id;
    const body = await request.json();
    const validatedData = packageSchema.parse(body);
    
    // Find company to verify ownership
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { userId: true },
    });
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Check authorization - only admin, moderator, or company owner can create packages
    const isOwner = currentUser.role === UserRole.COMPANY && company.userId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.MODERATOR;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create packages for this company' },
        { status: 403 }
      );
    }
    
    // Create package
    const packageData = await prisma.packages.create({
      data: {
        companyId,
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        price: validatedData.price,
        durationDays: validatedData.durationDays,
        hoursPerDay: validatedData.hoursPerDay,
        inclusions: validatedData.inclusions,
        exclusions: validatedData.exclusions,
        caregiverCount: validatedData.caregiverCount,
        isActive: validatedData.isActive,
        minAdvanceDays: validatedData.minAdvanceDays,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: packageData,
      message: 'Package created successfully',
    });
  } catch (error) {
    console.error('Create package error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/companies/[id]/packages - Get company packages
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorizeResource('companies', 'read')(request);
  if (authResult) return authResult;
  
  try {
    const companyId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') as any;
    const isActive = searchParams.get('isActive');
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = { companyId };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.category = category;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    // Get packages and total count
    const [packages, total] = await Promise.all([
      prisma.packages.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.packages.count({ where }),
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
    console.error('Get company packages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/companies/[id]/service-zones - Create service zone for company
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorizeResource('companies', 'write')(request);
  if (authResult) return authResult;
  
  const currentUser = getCurrentUser(request);
  
  try {
    const companyId = params.id;
    const body = await request.json();
    const validatedData = serviceZoneSchema.parse(body);
    
    // Find company to verify ownership
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { userId: true },
    });
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Check authorization - only admin, moderator, or company owner can create service zones
    const isOwner = currentUser.role === UserRole.COMPANY && company.userId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.MODERATOR;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create service zones for this company' },
        { status: 403 }
      );
    }
    
    // Create service zone
    const serviceZone = await prisma.service_zones.create({
      data: {
        companyId,
        zoneName: validatedData.zoneName,
        regionCode: validatedData.regionCode,
        boundaryGeojson: validatedData.boundaryGeojson,
        isActive: validatedData.isActive,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: serviceZone,
      message: 'Service zone created successfully',
    });
  } catch (error) {
    console.error('Create service zone error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/companies/[id]/service-zones - Get company service zones
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorizeResource('companies', 'read')(request);
  if (authResult) return authResult;
  
  try {
    const companyId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = { companyId };
    
    if (search) {
      where.OR = [
        { zoneName: { contains: search, mode: 'insensitive' } },
        { regionCode: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    // Get service zones and total count
    const [serviceZones, total] = await Promise.all([
      prisma.service_zones.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.service_zones.count({ where }),
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      data: serviceZones,
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
    console.error('Get service zones error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/companies/[id] - Delete company (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN])(request);
  if (authResult) return authResult;
  
  try {
    const companyId = params.id;
    
    // Find company
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Soft delete company
    const deletedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json({
      success: true,
      data: deletedCompany,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    console.error('Delete company error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}