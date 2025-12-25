import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get all feedback
export async function GET(request: NextRequest) {
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

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const jobId = searchParams.get('jobId');
    const revieweeType = searchParams.get('revieweeType');
    const rating = searchParams.get('rating');
    const isPublic = searchParams.get('isPublic');

    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: any = {};
    
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
        // Companies can see feedback for their caregivers
        const company = await prisma.companies.findUnique({
          where: { user_id: user.id },
        });
        
        if (company) {
          where.toUser = {
            caregiver: {
              companyId: company.id,
            },
          };
        }
        break;
    }
    
    if (jobId) {
      where.jobId = jobId;
    }
    
    if (revieweeType) {
      where.revieweeType = revieweeType;
    }
    
    if (rating) {
      where.rating = parseInt(rating);
    }
    
    if (isPublic !== null) {
      where.isPublic = isPublic === 'true';
    }

    // Get feedback and total count
    const [feedback, total] = await Promise.all([
      prisma.feedbacks.findMany({
        where,
        skip,
        take: limit,
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
              start_date: true,
              endDate: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.feedbacks.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: feedback,
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
    console.error('Get feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new feedback
export async function POST(request: NextRequest) {
  // Check authentication
  const authResult = await authenticate(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const body = await request.json();
    const {
      jobId,
      toUserId,
      revieweeType,
      rating,
      tags,
      comments,
      isPublic = false,
    } = body;

    // Validate required fields
    if (!jobId || !toUserId || !revieweeType || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify job exists and user is involved
    const job = await prisma.jobs.findUnique({
      where: { id: jobId },
      include: {
        guardian: {
          select: { id: true },
        },
        assignments: {
          include: { caregivers: {
              select: { user_id: true },
            },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    // Check if user is involved in the job (guardian or assigned caregiver)
    const isGuardian = job.guardian.id === user.id;
    const isCaregiver = job.assignments.some(
      (assignment: any) => assignment.caregiver.userId === user.id
    );

    if (!isGuardian && !isCaregiver) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if feedback already exists for this job/user combination
    const existingFeedback = await prisma.feedbacks.findUnique({
      where: {
        jobId_fromUserId_toUserId: {
          jobId,
          from_user_id: user.id,
          toUserId,
        },
      },
    });

    if (existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback already exists for this job and user' },
        { status: 400 }
      );
    }

    // Create feedback
    const feedbackData = await prisma.feedbacks.create({
      data: {
        jobId,
        from_user_id: user.id,
        toUserId,
        revieweeType,
        rating: parseInt(rating),
        tags,
        comments,
        isPublic,
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
            start_date: true,
            endDate: true,
          },
        },
      },
    });

    // Update average rating for the reviewee
    const allFeedback = await prisma.feedbacks.findMany({
      where: { toUserId },
      select: { rating: true },
    });

    const totalRating = allFeedback.reduce((sum: number, f: any) => sum + f.rating, 0);
    const avgRating = totalRating / allFeedback.length;

    // Update caregiver or company rating based on reviewee type
    if (revieweeType === 'CAREGIVER') {
      await prisma.caregivers.updateMany({
        where: { user_id: toUserId },
        data: {
          rating_avg: avgRating,
          rating_count: allFeedback.length,
        },
      });
    } else if (revieweeType === 'COMPANY') {
      await prisma.companies.updateMany({
        where: { user_id: toUserId },
        data: {
          rating_avg: avgRating,
          rating_count: allFeedback.length,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: feedbackData,
      message: 'Feedback created successfully',
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}