import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Respond to feedback - Company only
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication and authorization - only Company can respond to feedback
  const authResult = await authorize([UserRole.COMPANY])(request);
  if (authResult) return authResult;

  const user = (request as any).user;
  const { id } = params;

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
    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        toUser: {
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
    if (feedback.companyResponse) {
      return NextResponse.json(
        { error: 'Feedback already has a response' },
        { status: 400 }
      );
    }

    // Verify feedback is about the company
    if (feedback.revieweeType !== 'COMPANY' || feedback.toUserId !== user.id) {
      return NextResponse.json(
        { error: 'You can only respond to feedback about your company' },
        { status: 403 }
      );
    }

    // Update feedback with response
    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: {
        companyResponse: response.trim(),
        respondedAt: new Date(),
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