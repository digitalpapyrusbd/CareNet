import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';
import { z } from 'zod';

// Validation schemas
const assignModeratorSchema = z.object({
  moderatorId: z.string(),
});

const resolveDisputeSchema = z.object({
  resolution: z.string(),
  resolutionAction: z.string(),
});

// Get a single dispute by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
  const { id } = await params;

  try {
    // Build where clause based on user role
    const where: any = { id };
    
    switch (user.role) {
      case UserRole.GUARDIAN:
      case UserRole.CAREGIVER:
        // Users can only see disputes they raised or are against
        where.OR = [
          { raisedBy: user.id },
          { against: user.id },
        ];
        break;
        
      case UserRole.COMPANY:
        // Companies can see disputes for their jobs
        const company = await prisma.companies.findUnique({
          where: { user_id: user.id },
        });
        
        if (company) {
          where.job = {
            companyId: company.id,
          };
        }
        break;
    }

    // Get dispute with related data
    const dispute = await prisma.disputes.findFirst({
      where,
      include: {
        raisedByUser: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
          },
        },
        againstUser: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
          },
        },
        assignedModerator: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        job: {
          select: {
            id: true,
            patient: {
              select: {
                id: true,
                name: true,
              },
            },
            company: {
              select: {
                id: true,
                company_name: true,
              },
            },
            package: {
              select: {
                id: true,
                name: true,
              },
            },
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!dispute) {
      return NextResponse.json(
        { error: 'Dispute not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    console.error('Get dispute error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Assign moderator to dispute - Admin/Moderator only
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication and authorization - only Admin/Moderator can assign
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;
  const { id } = await params;

  try {
    const body = await request.json();
    const { action } = body; // 'assign' or 'resolve'

    if (action === 'assign') {
      const validatedData = assignModeratorSchema.parse(body);
      
      // Get dispute
      const dispute = await prisma.disputes.findUnique({
        where: { id },
      });

      if (!dispute) {
        return NextResponse.json(
          { error: 'Dispute not found' },
          { status: 404 }
        );
      }

      // Verify moderator exists
      const moderator = await prisma.users.findUnique({
        where: { id: validatedData.moderatorId, role: 'MODERATOR' },
      });

      if (!moderator) {
        return NextResponse.json(
          { error: 'Moderator not found' },
          { status: 404 }
        );
      }

      // Update dispute with assigned moderator
      const updatedDispute = await prisma.disputes.update({
        where: { id },
        data: {
          assigned_moderator: validatedData.moderatorId,
          status: 'UNDER_REVIEW',
        },
        include: {
          raisedByUser: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
            },
          },
          againstUser: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
            },
          },
          assignedModerator: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          job: {
            select: {
              id: true,
              patient: {
                select: {
                  id: true,
                  name: true,
                },
              },
              company: {
                select: {
                  id: true,
                  company_name: true,
                },
              },
              package: {
                select: {
                  id: true,
                  name: true,
                },
              },
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      // Create audit log
      await prisma.audit_logs.create({
        data: {
          actor_id: user.id,
          actor_role: user.role,
          action_type: 'ASSIGN',
          entity_type: 'DISPUTE',
          entity_id: id,
          changes: {
            assigned_moderator: validatedData.moderatorId,
          },
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          timestamp: new Date(),
        },
      });

      // TODO: Send notification to assigned moderator
      // This would integrate with notification system

      return NextResponse.json({
        success: true,
        data: updatedDispute,
        message: 'Moderator assigned to dispute successfully',
      });
    } else if (action === 'resolve') {
      const validatedData = resolveDisputeSchema.parse(body);
      
      // Get dispute
      const dispute = await prisma.disputes.findUnique({
        where: { id },
      });

      if (!dispute) {
        return NextResponse.json(
          { error: 'Dispute not found' },
          { status: 404 }
        );
      }

      // Update dispute with resolution
      const updatedDispute = await prisma.disputes.update({
        where: { id },
        data: {
          status: 'RESOLVED',
          resolution: validatedData.resolution,
          resolution_action: validatedData.resolutionAction,
          resolvedAt: new Date(),
        },
        include: {
          raisedByUser: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
            },
          },
          againstUser: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
            },
          },
          assignedModerator: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          job: {
            select: {
              id: true,
              patient: {
                select: {
                  id: true,
                  name: true,
                },
              },
              company: {
                select: {
                  id: true,
                  company_name: true,
                },
              },
              package: {
                select: {
                  id: true,
                  name: true,
                },
              },
              startDate: true,
              endDate: true,
            },
          },
        },
      });

      // Create audit log
      await prisma.audit_logs.create({
        data: {
          actor_id: user.id,
          actor_role: user.role,
          action_type: 'RESOLVE',
          entity_type: 'DISPUTE',
          entity_id: id,
          changes: {
            resolution: validatedData.resolution,
            resolution_action: validatedData.resolutionAction,
          },
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          timestamp: new Date(),
        },
      });

      // TODO: Send notification to both parties about resolution
      // This would integrate with notification system

      return NextResponse.json({
        success: true,
        data: updatedDispute,
        message: 'Dispute resolved successfully',
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Manage dispute error:', error);
    
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