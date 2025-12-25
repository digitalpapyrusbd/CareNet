import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/middleware/auth';
import { UserRole } from '@/lib/auth';

// Update application status (APPROVED/REJECTED)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR])(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const status = String(body.status || '').toUpperCase();
    const notes = body.notes ? String(body.notes) : null;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Ensure the application exists
    const existing = await prisma.job_applications.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const updated = await prisma.job_applications.update({
      where: { id },
      data: {
        status,
        reviewed_by: user.id,
        reviewed_at: new Date(),
        review_notes: notes,
      },
      include: {
        caregivers: { select: { id: true, users: { select: { id: true, name: true } } } },
        marketplace_jobs: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ message: 'Application updated', data: updated });
  } catch (error) {
    console.error('Update application status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
