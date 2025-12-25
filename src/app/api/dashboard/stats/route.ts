import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get dashboard statistics
export async function GET(request: NextRequest) {
  // Check authentication
  const authResult = await authenticate(request);
  if (authResult) return authResult;

  const user = (request as any).user;

  try {
    let stats: any = {};

    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        // Admin can see all system stats
        const [
          totalUsersCount,
          totalCompaniesCount,
          totalCaregiversCount,
          totalPatientsCount,
          totalJobsCount,
          activeJobsCount,
          totalRevenueData,
          pendingDisputesCount,
        ] = await Promise.all([
          prisma.users.count({ where: { deleted_at: null } }),
          prisma.companies.count(),
          prisma.caregivers.count(),
          prisma.patients.count(),
          prisma.jobs.count(),
          prisma.jobs.count({ where: { status: 'ACTIVE' } }),
          prisma.payments.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true },
          }),
          prisma.disputes.count({ where: { status: 'OPEN' } }),
        ]);

        stats = {
          totalUsers: totalUsersCount,
          totalCompanies: totalCompaniesCount,
          totalCaregivers: totalCaregiversCount,
          totalPatients: totalPatientsCount,
          totalJobs: totalJobsCount,
          activeJobs: activeJobsCount,
          totalRevenue: totalRevenueData._sum.amount || 0,
          pendingDisputes: pendingDisputesCount,
          recentActivity: await getRecentActivity('ADMIN'),
        };
        break;

      case UserRole.COMPANY:
        // Company stats
        const company = await prisma.companies.findUnique({
          where: { user_id: user.id },
        });

        if (company) {
          const [
            totalCaregiversCount,
            activeJobsCount,
            monthlyRevenueData,
            totalJobsCount,
          ] = await Promise.all([
            prisma.caregivers.count({ where: { company_id: company.id } }),
            prisma.jobs.count({
              where: {
                company_id: company.id,
                status: 'ACTIVE',
              },
            }),
            prisma.payments.aggregate({
              where: {
                job: { company_id: company.id },
                status: 'COMPLETED',
                paidAt: {
                  gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
              },
              _sum: { amount: true },
            }),
            prisma.jobs.count({ where: { company_id: company.id } }),
          ]);

          stats = {
            totalCaregivers: totalCaregiversCount,
            activeJobs: activeJobsCount,
            monthlyRevenue: monthlyRevenueData._sum.amount || 0,
            totalJobs: totalJobsCount,
            recentActivity: await getRecentActivity('COMPANY', company.id),
          };
        }
        break;

      case UserRole.CAREGIVER:
        // Caregiver stats
        const caregiver = await prisma.caregivers.findUnique({
          where: { user_id: user.id },
        });

        if (caregiver) {
          const [
            completedJobsCount,
            averageRatingData,
            monthlyEarningsData,
            currentAssignmentsCount,
          ] = await Promise.all([
            prisma.jobs.count({
              where: {
                assignments: {
                  some: {
                    caregiver_id: caregiver.id,
                  },
                },
                status: 'COMPLETED',
              },
            }),
            prisma.caregivers.findUnique({
              where: { id: caregiver.id },
              select: { rating_avg: true },
            }),
            prisma.payments.aggregate({
              where: {
                job: {
                  assignments: {
                    some: {
                      caregiver_id: caregiver.id,
                    },
                  },
                },
                status: 'COMPLETED',
                paidAt: {
                  gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
              },
              _sum: { amount: true },
            }),
            prisma.assignments.count({
              where: {
                caregiver_id: caregiver.id,
                status: 'ACTIVE',
              },
            }),
          ]);

          stats = {
            completedJobs: completedJobsCount,
            averageRating: averageRatingData?.rating_avg || 0,
            monthlyEarnings: monthlyEarningsData._sum.amount || 0,
            currentAssignments: currentAssignmentsCount,
            recentActivity: await getRecentActivity('CAREGIVER', caregiver.id),
          };
        }
        break;

      case UserRole.GUARDIAN:
        // Guardian stats
        const [
          guardianPatientsCount,
          guardianActiveJobsCount,
          totalSpentData,
          pendingPaymentsCount,
        ] = await Promise.all([
          prisma.patients.count({ where: { guardian_id: user.id } }),
          prisma.jobs.count({
            where: {
              guardian_id: user.id,
              status: 'ACTIVE',
            },
          }),
          prisma.payments.aggregate({
            where: {
              payer_id: user.id,
              status: 'COMPLETED',
            },
            _sum: { amount: true },
          }),
          prisma.payments.count({
            where: {
              payer_id: user.id,
              status: 'PENDING',
            },
          }),
          ]);

        stats = {
          totalPatients: guardianPatientsCount,
          activeJobs: guardianActiveJobsCount,
          totalSpent: totalSpentData._sum.amount || 0,
          pendingPayments: pendingPaymentsCount,
          recentActivity: await getRecentActivity('GUARDIAN', user.id),
        };
        break;
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get recent activity
async function getRecentActivity(role: string, entityId: string) {
  const activities: any[] = [];

  switch (role) {
    case 'ADMIN':
      // Get recent user registrations, job creations, etc.
      const [
        recentUsersData,
        recentJobsData,
        recentDisputesData,
      ] = await Promise.all([
        prisma.users.findMany({
          take: 5,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            name: true,
            role: true,
            created_at: true,
          },
        }),
        prisma.jobs.findMany({
          take: 5,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            patient: { select: { name: true } },
            createdAt: true,
          },
        }),
        prisma.disputes.findMany({
          take: 5,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            description: true,
            status: true,
            created_at: true,
          },
        }),
      ]);

      recentUsersData.forEach((user: any) => {
        activities.push({
          type: 'USER_REGISTRATION',
          description: `New ${user.role} registered: ${user.name}`,
          timestamp: user.createdAt,
        });
      });

      recentJobsData.forEach((job: any) => {
        activities.push({
          type: 'JOB_CREATED',
          description: `New job created for ${job.patient?.name}`,
          timestamp: job.createdAt,
        });
      });

      recentDisputesData.forEach((dispute: any) => {
        activities.push({
          type: 'DISPUTE_RAISED',
          description: `New dispute: ${dispute.description}`,
          timestamp: dispute.createdAt,
        });
      });
      break;

    case 'COMPANY':
      // Get recent job assignments, payments
      const [
        recentJobs,
        recentPayments,
      ] = await Promise.all([
        prisma.jobs.findMany({
          where: { company_id: entityId },
          take: 5,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            patient: { select: { name: true } },
            status: true,
            createdAt: true,
          },
        }),
        prisma.payments.findMany({
          where: {
            job: { company_id: entityId },
            status: 'COMPLETED',
          },
          take: 5,
          orderBy: { paid_at: 'desc' },
          select: {
            id: true,
            amount: true,
            paid_at: true,
          },
        }),
      ]);

      recentJobs.forEach(job => {
        activities.push({
          type: 'JOB_CREATED',
          description: `New job created for ${job.patient?.name}`,
          timestamp: job.createdAt,
        });
      });

      recentPayments.forEach(payment => {
        activities.push({
          type: 'PAYMENT_RECEIVED',
          description: `Payment of ৳${payment.amount} received`,
          timestamp: payment.paidAt,
        });
      });
      break;

    case 'CAREGIVER':
      // Get recent assignments, care logs
      const [
        recentAssignmentsData,
        recentCareLogsData,
      ] = await Promise.all([
        prisma.assignments.findMany({
          where: { caregiver_id: entityId },
          take: 5,
          orderBy: { created_at: 'desc' },
          include: { jobs: {
              select: {
                id: true,
                patient: { select: { name: true } },
              },
            },
          },
        }),
        prisma.care_logs.findMany({
          where: { caregiver_id: entityId },
          take: 5,
          orderBy: { timestamp: 'desc' },
          select: {
            id: true,
            log_type: true,
            timestamp: true,
          },
        }),
      ]);

      recentAssignmentsData.forEach((assignment: any) => {
        activities.push({
          type: 'ASSIGNMENT_RECEIVED',
          description: `New assignment for ${assignment.job?.patient?.name}`,
          timestamp: assignment.createdAt,
        });
      });

      recentCareLogsData.forEach((log: any) => {
        activities.push({
          type: 'CARE_LOG',
          description: `${log.logType} logged`,
          timestamp: log.timestamp,
        });
      });
      break;

    case 'GUARDIAN':
      // Get recent jobs, payments
      const [
        guardianJobsData,
        guardianPaymentsData,
      ] = await Promise.all([
        prisma.jobs.findMany({
          where: { guardian_id: entityId },
          take: 5,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            patient: { select: { name: true } },
            status: true,
            createdAt: true,
          },
        }),
        prisma.payments.findMany({
          where: { payer_id: entityId },
          take: 5,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            amount: true,
            status: true,
            created_at: true,
          },
        }),
      ]);

      guardianJobsData.forEach((job: any) => {
        activities.push({
          type: 'JOB_CREATED',
          description: `New job created for ${job.patient?.name}`,
          timestamp: job.createdAt,
        });
      });

      guardianPaymentsData.forEach((payment: any) => {
        activities.push({
          type: 'PAYMENT_MADE',
          description: `Payment of ৳${payment.amount} ${payment.status === 'COMPLETED' ? 'completed' : 'pending'}`,
          timestamp: payment.createdAt,
        });
      });
      break;
  }

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}