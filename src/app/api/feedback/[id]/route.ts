import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get a single feedback by ID
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
        // Users can only see feedback they gave or received
        where.OR = [
          { fromUserId: user.id },
          { toUserId: user.id },
        ];
        break;
        
      case UserRole.COMPANY:
        // Companies can see feedback for their caregivers and themselves
        const company = await prisma.company.findUnique({
          where: { userId: user.id },
        });
        
        if (company) {
          where.OR = [
            { toUserId: user.id }, // Feedback about the company
            { 
              toUser: {
                caregiver: {
                  companyId: company.id,
                },
              },
            }, // Feedback about their caregivers
          ];
        }
        break;
    }

    // Get feedback with related data
    const feedback = await prisma.feedback.findFirst({
      where,
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
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Flag/unflag feedback as inappropriate - Admin/Moderator only
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication and authorization - only Admin/Moderator can flag feedback
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR
  ])(request);
  if (authResult) return authResult;

  const { id } = await params;

  try {
    // Get current feedback
    const feedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Toggle flagged status
    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: {
        flaggedInappropriate: !feedback.flaggedInappropriate,
      },
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
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedFeedback,
      message: `Feedback ${updatedFeedback.flaggedInappropriate ? 'flagged' : 'unflagged'} as inappropriate`,
    });
  } catch (error) {
    console.error('Flag feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}