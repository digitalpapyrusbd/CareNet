import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/middleware/auth';
import { UserRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Only super admins and moderators can create demo data
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR])(request);
  if (authResult) return authResult;

  try {
    // Pick first available agency
    const agency = await prisma.companies.findFirst({
      orderBy: { created_at: 'asc' },
    });

    if (!agency) {
      return NextResponse.json({ error: 'No agency found to attach the job' }, { status: 400 });
    }

    // Pick a caregiver (prefer unverified if available)
    const caregiver = await prisma.caregivers.findFirst({
      where: { deleted_at: null },
      orderBy: { created_at: 'asc' },
      include: { users: { select: { id: true, name: true, phone: true } } },
    });

    if (!caregiver) {
      return NextResponse.json({ error: 'No caregiver found' }, { status: 400 });
    }

    // Create a marketplace job
    const job = await prisma.marketplace_jobs.create({
      data: {
        agency_id: agency.id,
        title: 'Demo Elderly Care Shift',
        description: 'Assist with daily activities and medication reminders.',
        location: 'Dhaka',
        required_skills: ['companionship', 'medication_management'],
        start_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        duration_days: 7,
        hours_per_day: 8,
        offered_rate: 400.0,
        status: 'OPEN',
        applications_count: 0,
      },
    });

    // Create a job application from the caregiver
    const application = await prisma.job_applications.create({
      data: {
        marketplace_job_id: job.id,
        caregiver_id: caregiver.id,
        coverLetter: 'I have 5+ years experience in elderly care and medication management.',
        status: 'PENDING',
      },
      include: {
        caregivers: {
          select: {
            id: true,
            rating_avg: true,
            users: { select: { id: true, name: true, phone: true } },
          },
        },
        marketplace_jobs: {
          select: { id: true, title: true, location: true, offered_rate: true },
        },
      },
    });

    // Increment applications_count
    await prisma.marketplace_jobs.update({
      where: { id: job.id },
      data: { applications_count: { increment: 1 } },
    });

    return NextResponse.json({
      message: 'Demo caregiver application created',
      job,
      application,
    });
  } catch (error) {
    console.error('Create demo caregiver application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
