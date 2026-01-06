import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Respond to feedback - Company only
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication and authorization - only Agency can respond to feedback
  const authResult = await authorize([UserRole.AGENCY])(request);
  if (authResult) return authResult;

  const user = (request as any).user;
  const { id } = await params;

  try {
    const body = await request.json();
    const { response } = body;

    if (!response || !response.trim()) {
      return NextResponse.json(
        { error: 'Response is required' },
        { status: 400 }
      );
    }

    // Get feedback and verify company can respond
    const feedback = await prisma.feedbacks.findUnique({
      where: { id },
      include: {
        users_feedbacks_to_user_idTousers: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Check if feedback is already responded to
    if (feedback.agency_response) {
      return NextResponse.json(
        { error: 'Feedback already has a response' },
        { status: 400 }
      );
    }

    // Verify feedback is about the agency
    if (feedback.reviewee_type !== 'AGENCY' || feedback.to_user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only respond to feedback about your agency' },
        { status: 403 }
      );
    }

    // Update feedback with response
    const updatedFeedback = await prisma.feedbacks.update({
      where: { id },
      data: {
        agency_response: response.trim(),
        responded_at: new Date(),
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

    // TODO: Send notification to the feedback author about the response
    // This would integrate with notification system

    return NextResponse.json({
      success: true,
      data: updatedFeedback,
      message: 'Response submitted successfully',
    });
  } catch (error) {
    console.error('Respond to feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}