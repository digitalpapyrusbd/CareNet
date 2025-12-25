import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/middleware/auth';
import { UserRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR])(request);
  if (authResult) return authResult;

  try {
    const agencies = await prisma.companies.findMany({
      select: { id: true, agency_name: true },
        orderBy: { company_name: 'asc' },
      take: 200,
    });
    return NextResponse.json({ data: agencies });
  } catch (error) {
    console.error('Company options error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
