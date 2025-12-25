import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';
import { z } from 'zod';

// Validation schemas
const verifyCompanySchema = z.object({
  companyId: z.string(),
  isVerified: z.boolean(),
  verificationNotes: z.string().optional(),
});

const verifyCaregiverSchema = z.object({
  caregiverId: z.string(),
  isVerified: z.boolean(),
  verificationNotes: z.string().optional(),
});

// Get all pending verifications
export async function GET(request: NextRequest) {
  // Check authentication and authorization - only Admin/Moderator can view verifications
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR
  ])(request);
  if (authResult) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type'); // 'company' or 'caregiver'
    const status = searchParams.get('status'); // 'pending', 'verified', 'rejected'

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (type === 'company') {
      where.company = {
        isVerified: status === 'verified' ? true : status === 'rejected' ? false : undefined,
      };
    } else if (type === 'caregiver') {
      where.caregiver = {
        isVerified: status === 'verified' ? true : status === 'rejected' ? false : undefined,
      };
    }

    // Get companies and caregivers pending verification
    const [companies, caregivers, companyTotal, caregiverTotal] = await Promise.all([
      // Companies
      type !== 'caregiver' ? prisma.companies.findMany({
        where: type === 'company' ? where.company : {},
        skip: type === 'company' ? skip : 0,
        take: type === 'company' ? limit : 0,
        include: { users: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }) : [],
      
      // Caregivers
      type !== 'company' ? prisma.caregivers.findMany({
        where: type === 'caregiver' ? where.caregiver : {},
        skip: type === 'caregiver' ? skip : 0,
        take: type === 'caregiver' ? limit : 0,
        include: { users: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          company: {
            select: {
              id: true,
              company_name: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }) : [],
      
      // Counts
      type !== 'caregiver' ? prisma.companies.count({ where: type === 'company' ? where.company : {} }) : 0,
      type !== 'company' ? prisma.caregivers.count({ where: type === 'caregiver' ? where.caregiver : {} }) : 0,
    ]);

    const data = type === 'company' ? companies : caregivers;
    const total = type === 'company' ? companyTotal : caregiverTotal;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data,
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
    console.error('Get verifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify/reject company or caregiver
export async function POST(request: NextRequest) {
  // Check authentication and authorization - only Admin/Moderator can verify
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const body = await request.json();
    const { type } = body; // 'company' or 'caregiver'

    let validatedData;
    let result;

    if (type === 'company') {
      validatedData = verifyCompanySchema.parse(body);
      
      // Update company verification status
      result = await prisma.companies.update({
        where: { id: validatedData.companyId },
        data: {
          is_verified: validatedData.isVerified,
          verification_notes: validatedData.verificationNotes,
        },
        include: { users: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      });
    } else if (type === 'caregiver') {
      validatedData = verifyCaregiverSchema.parse(body);
      
      // Update caregiver verification status
      result = await prisma.caregivers.update({
        where: { id: validatedData.caregiverId },
        data: {
          is_verified: validatedData.isVerified,
          verification_notes: validatedData.verificationNotes,
          backgroundCheckDate: validatedData.isVerified ? new Date() : null,
          background_check_status: validatedData.isVerified ? 'CLEARED' : 'FLAGGED',
        },
        include: { users: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          company: {
            select: {
              id: true,
              company_name: true,
            },
          },
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid verification type' },
        { status: 400 }
      );
    }

    // Create audit log
    await prisma.audit_logs.create({
      data: {
        actor_id: user.id,
        actor_role: user.role,
        action_type: validatedData.isVerified ? 'VERIFY' : 'REJECT',
        entity_type: type.toUpperCase(),
        entity_id: type === 'company'
          ? (validatedData as any).company_id
          : (validatedData as any).caregiverId,
        changes: {
          is_verified: validatedData.isVerified,
          verification_notes: validatedData.verificationNotes,
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
      },
    });

    // TODO: Send notification to user about verification status
    // This would integrate with notification system

    return NextResponse.json({
      success: true,
      data: result,
      message: `${type === 'company' ? 'Company' : 'Caregiver'} ${validatedData.isVerified ? 'verified' : 'rejected'} successfully`,
    });
  } catch (error) {
    console.error('Verification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}