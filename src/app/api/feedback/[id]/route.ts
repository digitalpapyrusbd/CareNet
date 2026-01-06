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
    UserRole.AGENCY,
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
        
      case UserRole.AGENCY:
        // Agencies can see feedback for their caregivers and themselves
        const agency = await prisma.agencies.findUnique({
          where: { userId: user.id },
        });
        
        if (agency) {
          where.OR = [
            { toUserId: user.id }, // Feedback about the agency
            { 
              users_feedbacks_to_user_idTousers: {
                caregiver: {
                  agency_id: agency.id,
                },
              },
            }, // Feedback about their caregivers
          ];
        }
        break;
    }

    // Get feedback with related data
    const feedback = await prisma.feedbacks.findFirst({
      where,
      include: {
        users_feedbacks_from_user_idTousers: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        users_feedbacks_to_user_idTousers: {
          select: {
            id: true,
            name: true,
            role: true,
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
    const feedback = await prisma.feedbacks.findUnique({
      where: { id },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Toggle flagged status
    const updatedFeedback = await prisma.feedbacks.update({
      where: { id },
      data: {
        flagged_inappropriate: !feedback.flagged_inappropriate,
      },
      include: {
        users_feedbacks_from_user_idTousers: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        users_feedbacks_to_user_idTousers: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedFeedback,
      message: `Feedback ${updatedFeedback.flagged_inappropriate ? 'flagged' : 'unflagged'} as inappropriate`,
    });
  } catch (error) {
    console.error('Flag feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}