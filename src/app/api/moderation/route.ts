import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';
import { z } from 'zod';

// Validation schemas
const moderateContentSchema = z.object({
  entityType: z.enum(['FEEDBACK', 'DISPUTE', 'USER', 'COMPANY', 'CAREGIVER', 'JOB']),
  entityId: z.string(),
  action: z.enum(['FLAG', 'UNFLAG', 'HIDE', 'DELETE']),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

// Get moderation queue
export async function GET(request: NextRequest) {
  // Check authentication and authorization - only Admin/Moderator can moderate
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR
  ])(request);
  if (authResult) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // 'flagged', 'reviewed'
    const entityType = searchParams.get('entityType'); // 'feedback', 'dispute', etc.

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (status === 'flagged') {
      where.OR = [
        { flaggedInappropriate: true },
      ];
    } else if (status === 'reviewed') {
      where.OR = [
        { flaggedInappropriate: false },
      ];
    }
    
    if (entityType) {
      where.entityType = entityType.toUpperCase();
    }

    // Get moderation items
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: {
          actionType: { in: ['FLAG', 'UNFLAG', 'HIDE', 'DELETE'] },
          ...where,
        },
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Get flagged feedback and disputes separately for more details
    let flaggedItems: any[] = [];
    
    if (!entityType || entityType === 'FEEDBACK') {
      const flaggedFeedback = await prisma.feedback.findMany({
        where: {
          flaggedInappropriate: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
              role: true,
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
                  companyName: true,
                },
              },
            },
          },
        },
      });
      
      flaggedItems = [...flaggedItems, ...flaggedFeedback.map((item: any) => ({
        ...item,
        entityType: 'FEEDBACK',
        details: {
          comments: item.comments,
          rating: item.rating,
        },
      }))];
    }
    
    if (!entityType || entityType === 'DISPUTE') {
      const flaggedDisputes = await prisma.dispute.findMany({
        where: {
          status: 'OPEN',
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          raisedByUser: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          againstUser: {
            select: {
              id: true,
              name: true,
              role: true,
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
                  companyName: true,
                },
              },
            },
          },
        },
      });
      
      flaggedItems = [...flaggedItems, ...flaggedDisputes.map((item: any) => ({
        ...item,
        entityType: 'DISPUTE',
        details: {
          disputeType: item.disputeType,
          description: item.description,
        },
      }))];
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: items,
      flaggedItems,
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
    console.error('Get moderation queue error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Moderate content (flag, unflag, hide, delete)
export async function POST(request: NextRequest) {
  // Check authentication and authorization - only Admin/Moderator can moderate
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR
  ])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const body = await request.json();
    const validatedData = moderateContentSchema.parse(body);
    const { entityType, entityId, action, reason, notes } = validatedData;

    let result;

    switch (action) {
      case 'FLAG':
        result = await handleFlag(user, entityType, entityId, reason, notes);
        break;
      case 'UNFLAG':
        result = await handleUnflag(user, entityType, entityId);
        break;
      case 'HIDE':
        result = await handleHide(user, entityType, entityId);
        break;
      case 'DELETE':
        result = await handleDelete(user, entityType, entityId);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Content ${action}ed successfully`,
    });
  } catch (error) {
    console.error('Moderation error:', error);
    
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

// Handle flagging content
async function handleFlag(user: any, entityType: string, entityId: string, reason: string, notes?: string) {
  // Create audit log entry
  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorRole: user.role,
      actionType: 'FLAG',
      entityType: entityType.toUpperCase(),
      entityId,
      changes: {
        reason,
        notes,
      },
      ipAddress: 'unknown', // Would be set from request headers
      userAgent: 'unknown', // Would be set from request headers
      timestamp: new Date(),
    },
  });

  // Update the actual entity based on type
  switch (entityType) {
    case 'FEEDBACK':
      await prisma.feedback.update({
        where: { id: entityId },
        data: { flaggedInappropriate: true },
      });
      break;
    case 'DISPUTE':
      // Disputes are handled differently - they're already in a moderation queue
      break;
    default:
      // For other entities, we might need to add a flaggedInappropriate field
      break;
  }

  return { success: true };
}

// Handle unflagging content
async function handleUnflag(user: any, entityType: string, entityId: string) {
  // Create audit log entry
  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorRole: user.role,
      actionType: 'UNFLAG',
      entityType: entityType.toUpperCase(),
      entityId,
      ipAddress: 'unknown',
      userAgent: 'unknown',
      timestamp: new Date(),
    },
  });

  // Update the actual entity based on type
  switch (entityType) {
    case 'FEEDBACK':
      await prisma.feedback.update({
        where: { id: entityId },
        data: { flaggedInappropriate: false },
      });
      break;
    default:
      // For other entities, we might need to add a flaggedInappropriate field
      break;
  }

  return { success: true };
}

// Handle hiding content
async function handleHide(user: any, entityType: string, entityId: string) {
  // Create audit log entry
  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorRole: user.role,
      actionType: 'HIDE',
      entityType: entityType.toUpperCase(),
      entityId,
      ipAddress: 'unknown',
      userAgent: 'unknown',
      timestamp: new Date(),
    },
  });

  // Update the actual entity based on type
  switch (entityType) {
    case 'FEEDBACK':
      await prisma.feedback.update({
        where: { id: entityId },
        data: { isPublic: false },
      });
      break;
    default:
      // For other entities, we might need to add a visibility field
      break;
  }

  return { success: true };
}

// Handle deleting content
async function handleDelete(user: any, entityType: string, entityId: string) {
  // Create audit log entry
  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorRole: user.role,
      actionType: 'DELETE',
      entityType: entityType.toUpperCase(),
      entityId,
      ipAddress: 'unknown',
      userAgent: 'unknown',
      timestamp: new Date(),
    },
  });

  // Update the actual entity based on type
  switch (entityType) {
    case 'FEEDBACK':
      await prisma.feedback.delete({
        where: { id: entityId },
      });
      break;
    default:
      // For other entities, implement deletion as needed
      break;
  }

  return { success: true };
}