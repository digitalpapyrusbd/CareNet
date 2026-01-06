import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get feedbacks for a caregiver
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
    const caregiverId = searchParams.get('caregiverId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (caregiverId) {
      where.to_user_id = caregiverId;
      where.reviewee_type = 'CAREGIVER';
    }

    // Add access control based on user role
    switch (user.role) {
      case UserRole.GUARDIAN:
      case UserRole.CAREGIVER:
        // Users can only see feedback they gave or received
        where.OR = [
          { fromUserId: user.id },
          { to_user_id: user.id },
        ];
        break;

      case UserRole.COMPANY:
        // Companies can see feedback for their caregivers
        const company = await prisma.companies.findFirst({
          where: { userId: user.id },
        });

        if (company) {
          where.toUser = {
            caregivers_assignments_caregiver_idTocaregivers: {
              companyId: company.id,
            },
          };
        }
        break;
    }

    // Get feedback and total count
    const [feedbacks, total] = await Promise.all([
      prisma.feedbacks.findMany({
        where,
        skip,
        take: limit,
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
        orderBy: { createdAt: 'desc' },
      }),
      prisma.feedbacks.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: feedbacks,
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
    console.error('Get feedbacks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
