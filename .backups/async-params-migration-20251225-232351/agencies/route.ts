import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate, authorize, getCurrentUser } from '@/lib/middleware/auth';
import { authorizeResource, authorizeOwnResource } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

// Enhanced validation schemas
const updateAgencySchema = z.object({
  agencyName: z.string().min(2, 'Agency name must be at least 2 characters').max(100, 'Agency name must be less than 100 characters'),
  tradeLicense: z.string().min(5, 'Trade license number is required'),
  tin: z.string().optional(),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  contactEmail: z.string().email('Valid contact email is required'),
  contactPhone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Valid Bangladeshi contact phone is required'),
  address: z.string().min(10, 'Agency address must be at least 10 characters'),
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

// GET /api/agencies - Get agencies with advanced filtering
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
        { agency_name: { contains: search, mode: 'insensitive' } },
        { contact_person: { contains: search, mode: 'insensitive' } },
        { contact_phone: { contains: search, mode: 'insensitive' } },
        { contact_email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (isVerified !== null) {
      where.is_verified = isVerified === 'true';
    }
    
    if (subscriptionTier) {
      where.subscription_tier = subscriptionTier;
    }
    
    if (region) {
      where.service_zones = {
        some: {
          region_code: region,
        },
      };
    }
    
    if (dateFrom || dateTo) {
      where.created_at = {};
      if (dateFrom) {
        where.created_at.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.created_at.lte = new Date(dateTo);
      }
    }
    
    // Build order by clause - map camelCase to snake_case
    const orderBy: any = {};
    const sortByMap: Record<string, string> = {
      'createdAt': 'created_at',
      'agencyName': 'agency_name',
      'ratingAvg': 'rating_avg',
    };
    orderBy[sortByMap[sortBy] || sortBy] = sortOrder;
    
    // Get agencies and total count
    const [agencies, total] = await Promise.all([
      prisma.agencies.findMany({
        where: {
          ...where,
          deleted_at: null,
        },
        skip,
        take: limit,
        select: {
          id: true,
          agency_name: true,
          contact_person: true,
          contact_email: true,
          contact_phone: true,
          is_verified: true,
          subscription_tier: true,
          rating_avg: true,
          rating_count: true,
          created_at: true,
          users: {
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
              users: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy,
      }),
      prisma.agencies.count({ where: { ...where, deleted_at: null } }),
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      data: agencies,
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
          sortOptions: ['createdAt', 'agencyName', 'ratingAvg', 'caregiverCount'],
        },
      },
    });
  } catch (error) {
    console.error('Get agencies error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/agencies - Create new agency
export async function POST(request: NextRequest) {
  // Authenticate user (must be authenticated to create agency)
  const authResult = await authenticate(request);
  if (authResult) return authResult;
  
  const currentUser = getCurrentUser(request);
  
  try {
    const body = await request.json();
    const validatedData = updateAgencySchema.parse(body);
    
    // Check if user already has an agency
    if (currentUser.role === UserRole.AGENCY) {
      const existingAgency = await prisma.agencies.findUnique({
        where: { userId: currentUser.id },
      });
      
      if (existingAgency) {
        return NextResponse.json(
          { error: 'User already has a registered agency' },
          { status: 409 }
        );
      }
    }
    
    // Check if trade license already exists
    const existingTradeLicense = await prisma.agencies.findFirst({
      where: { trade_license: validatedData.tradeLicense },
    });
    
    if (existingTradeLicense) {
      return NextResponse.json(
        { error: 'Trade license already exists' },
        { status: 409 }
      );
    }
    
    // Create agency
    const agency = await prisma.agencies.create({
      data: {
        userId: currentUser.id,
        agency_name: validatedData.agencyName,
        trade_license: validatedData.tradeLicense,
        tin: validatedData.tin,
        contact_person: validatedData.contactPerson,
        contact_email: validatedData.contactEmail,
        contact_phone: validatedData.contactPhone,
        address: validatedData.address,
        logo_url: validatedData.logoUrl,
        description: validatedData.description,
        specializations: validatedData.specializations,
        payout_method: validatedData.payoutMethod,
        payout_account: validatedData.payoutAccount,
        commission_rate: validatedData.commissionRate || 12.00,
        subscription_tier: validatedData.subscriptionTier || 'STARTER',
        rating_avg: 0.0,
        rating_count: 0,
        is_verified: false,
      },
    });
    
    // Update user role to AGENCY if not already
    if (currentUser.role !== UserRole.AGENCY) {
      await prisma.users.update({
        where: { id: currentUser.id },
        data: { role: UserRole.AGENCY },
      });
    }
    
    return NextResponse.json({
      success: true,
      data: agency,
      message: 'Agency created successfully',
    });
  } catch (error) {
    console.error('Create agency error:', error);
    
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

// PUT /api/agencies/[id] - Update agency
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorizeResource('agencies', 'write')(request);
  if (authResult) return authResult;
  
  const currentUser = getCurrentUser(request);
  
  try {
    const agencyId = params.id;
    const body = await request.json();
    const validatedData = updateAgencySchema.parse(body);
    
    // Find agency
    const agency = await prisma.agencies.findUnique({
      where: { id: agencyId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }
    
    // Check authorization - only admin, moderator, or agency owner can update
    const isOwner = currentUser.role === UserRole.AGENCY && agency.userId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.MODERATOR;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions to update this agency' },
        { status: 403 }
      );
    }
    
    // Check if trade license is being changed to an existing one
    if (validatedData.tradeLicense && validatedData.tradeLicense !== agency.trade_license) {
      const existingTradeLicense = await prisma.agencies.findFirst({
        where: { 
          trade_license: validatedData.tradeLicense,
          id: { not: agencyId },
        },
      });
      
      if (existingTradeLicense) {
        return NextResponse.json(
          { error: 'Trade license already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update agency
    const updatedAgency = await prisma.agencies.update({
      where: { id: agencyId },
      data: {
        agency_name: validatedData.agencyName,
        trade_license: validatedData.tradeLicense,
        tin: validatedData.tin,
        contact_person: validatedData.contactPerson,
        contact_email: validatedData.contactEmail,
        contact_phone: validatedData.contactPhone,
        address: validatedData.address,
        logo_url: validatedData.logoUrl,
        description: validatedData.description,
        specializations: validatedData.specializations,
        payout_method: validatedData.payoutMethod,
        payout_account: validatedData.payoutAccount,
        commission_rate: validatedData.commissionRate,
        subscription_tier: validatedData.subscriptionTier,
        updated_at: new Date(),
      },
    });
    
    return NextResponse.json({
      success: true,
      data: updatedAgency,
      message: 'Agency updated successfully',
    });
  } catch (error) {
    console.error('Update agency error:', error);
    
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

// PATCH /api/agencies/[id]/verify - Verify/reject agency
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR])(request);
  if (authResult) return authResult;
  
  try {
    const agencyId = params.id;
    const body = await request.json();
    const validatedData = verificationSchema.parse(body);
    
    // Find agency
    const agency = await prisma.agencies.findUnique({
      where: { id: agencyId },
    });
    
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }
    
    // Update verification status
    const updateData: any = {
      is_verified: validatedData.status === 'VERIFIED',
      verification_notes: validatedData.verificationNotes,
      updated_at: new Date(),
    };
    
    if (validatedData.subscriptionExpiresAt) {
      updateData.subscription_expires_at = new Date(validatedData.subscriptionExpiresAt);
    }
    
    const updatedAgency = await prisma.agencies.update({
      where: { id: agencyId },
      data: updateData,
    });
    
    return NextResponse.json({
      success: true,
      data: updatedAgency,
      message: `Agency ${validatedData.status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error('Verify agency error:', error);
    
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

// TODO: Move to /api/agencies/[id]/packages/route.ts
// POST /api/agencies/[id]/packages - Create package for agency
/* export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorizeResource('agencies', 'write')(request);
  if (authResult) return authResult;
  
  const currentUser = getCurrentUser(request);
  
  try {
    const agencyId = params.id;
    const body = await request.json();
    const validatedData = packageSchema.parse(body);
    
    // Find agency to verify ownership
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
      select: { userId: true },
    });
    
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }
    
    // Check authorization - only admin, moderator, or agency owner can create packages
    const isOwner = currentUser.role === UserRole.AGENCY && agency.userId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.MODERATOR;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create packages for this agency' },
        { status: 403 }
      );
    }
    
    // Create package
    const packageData = await prisma.packages.create({
      data: {
        agencyId,
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

// GET /api/agencies/[id]/packages - Get agency packages
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorizeResource('agencies', 'read')(request);
  if (authResult) return authResult;
  
  try {
    const agencyId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') as any;
    const isActive = searchParams.get('isActive');
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = { agencyId };
    
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
    console.error('Get agency packages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} */

// TODO: Move to /api/agencies/[id]/service-zones/route.ts
// POST /api/agencies/[id]/service-zones - Create service zone for agency
/* export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorizeResource('agencies', 'write')(request);
  if (authResult) return authResult;
  
  const currentUser = getCurrentUser(request);
  
  try {
    const agencyId = params.id;
    const body = await request.json();
    const validatedData = serviceZoneSchema.parse(body);
    
    // Find agency to verify ownership
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
      select: { userId: true },
    });
    
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }
    
    // Check authorization - only admin, moderator, or agency owner can create service zones
    const isOwner = currentUser.role === UserRole.AGENCY && agency.userId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.MODERATOR;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create service zones for this agency' },
        { status: 403 }
      );
    }
    
    // Create service zone
    const serviceZone = await prisma.service_zones.create({
      data: {
        agencyId,
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

// GET /api/agencies/[id]/service-zones - Get agency service zones
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorizeResource('agencies', 'read')(request);
  if (authResult) return authResult;
  
  try {
    const agencyId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = { agencyId };
    
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

// DELETE /api/agencies/[id] - Delete agency (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Check authentication and authorization
  const authResult = await authorize([UserRole.SUPER_ADMIN])(request);
  if (authResult) return authResult;
  
  try {
    const agencyId = params.id;
    
    // Find agency
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
    });
    
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }
    
    // Soft delete agency
    const deletedAgency = await prisma.agency.update({
      where: { id: agencyId },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json({
      success: true,
      data: deletedAgency,
      message: 'Agency deleted successfully',
    });
  } catch (error) {
    console.error('Delete agency error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} */