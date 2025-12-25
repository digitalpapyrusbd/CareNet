import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/middleware/auth';
import { UserRole } from '@/lib/auth';

// List recent marketplace job applications for admin
export async function GET(request: NextRequest) {
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR])(request);
  if (authResult) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = (searchParams.get('status') || '').toUpperCase(); // PENDING/APPROVED/REJECTED
    const agencyId = searchParams.get('agencyId') || undefined;
    const search = searchParams.get('search') || '';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const where: any = {};
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      where.status = status;
    }
    if (agencyId) {
      // Filter by related marketplace job's agency
      where.marketplace_jobs = { agency_id: agencyId } as any;
    }
    if (search) {
      // Search by job title or caregiver name/phone
      where.OR = [
        { marketplace_jobs: { title: { contains: search, mode: 'insensitive' } } },
        { caregivers: { users: { name: { contains: search, mode: 'insensitive' } } } },
        { caregivers: { users: { phone: { contains: search, mode: 'insensitive' } } } },
      ];
    }
    if (dateFrom || dateTo) {
      where.created_at = {} as any;
      if (dateFrom) (where.created_at as any).gte = new Date(dateFrom);
      if (dateTo) (where.created_at as any).lte = new Date(dateTo);
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.job_applications.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
        include: {
          caregivers: {
            select: {
              id: true,
              rating_avg: true,
              users: { select: { id: true, name: true, phone: true } },
            },
          },
          marketplace_jobs: {
            select: {
              id: true,
              title: true,
              location: true,
              offered_rate: true,
              agencies: { select: { id: true, agency_name: true } },
            },
          },
        },
      }),
      prisma.job_applications.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      data: applications,
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
    console.error('List applications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
