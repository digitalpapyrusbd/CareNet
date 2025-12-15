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
          prisma.user.count({ where: { deletedAt: null } }),
          prisma.company.count(),
          prisma.caregiver.count(),
          prisma.patient.count(),
          prisma.job.count(),
          prisma.job.count({ where: { status: 'ACTIVE' } }),
          prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true },
          }),
          prisma.dispute.count({ where: { status: 'OPEN' } }),
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
        const company = await prisma.company.findUnique({
          where: { userId: user.id },
        });

        if (company) {
          const [
            totalCaregiversCount,
            activeJobsCount,
            monthlyRevenueData,
            totalJobsCount,
          ] = await Promise.all([
            prisma.caregiver.count({ where: { companyId: company.id } }),
            prisma.job.count({
              where: {
                companyId: company.id,
                status: 'ACTIVE',
              },
            }),
            prisma.payment.aggregate({
              where: {
                job: { companyId: company.id },
                status: 'COMPLETED',
                paidAt: {
                  gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
              },
              _sum: { amount: true },
            }),
            prisma.job.count({ where: { companyId: company.id } }),
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
        const caregiver = await prisma.caregiver.findUnique({
          where: { userId: user.id },
        });

        if (caregiver) {
          const [
            completedJobsCount,
            averageRatingData,
            monthlyEarningsData,
            currentAssignmentsCount,
          ] = await Promise.all([
            prisma.job.count({
              where: {
                assignments: {
                  some: {
                    caregiverId: caregiver.id,
                  },
                },
                status: 'COMPLETED',
              },
            }),
            prisma.caregiver.findUnique({
              where: { id: caregiver.id },
              select: { ratingAvg: true },
            }),
            prisma.payment.aggregate({
              where: {
                job: {
                  assignments: {
                    some: {
                      caregiverId: caregiver.id,
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
            prisma.assignment.count({
              where: {
                caregiverId: caregiver.id,
                status: 'ACTIVE',
              },
            }),
          ]);

          stats = {
            completedJobs: completedJobsCount,
            averageRating: averageRatingData?.ratingAvg || 0,
            monthlyEarnings: monthlyEarningsData._sum.amount || 0,
            currentAssignments: currentAssignmentsCount,
            recentActivity: await getRecentActivity('CAREGIVER', caregiver.id),
          };
        }
        break;

      case UserRole.GUARDIAN:
        // Guardian stats
        const [
          totalPatientsCount,
          activeJobsCount,
          totalSpentData,
          pendingPaymentsCount,
        ] = await Promise.all([
          prisma.patient.count({ where: { guardianId: user.id } }),
          prisma.job.count({
            where: {
              guardianId: user.id,
              status: 'ACTIVE',
            },
          }),
          prisma.payment.aggregate({
            where: {
              payerId: user.id,
              status: 'COMPLETED',
            },
            _sum: { amount: true },
          }),
          prisma.payment.count({
            where: {
              payerId: user.id,
              status: 'PENDING',
            },
          }),
          ]);

        stats = {
          totalPatients: totalPatientsCount,
          activeJobs: activeJobsCount,
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
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            role: true,
            createdAt: true,
          },
        }),
        prisma.job.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            patient: { select: { name: true } },
            createdAt: true,
          },
        }),
        prisma.dispute.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            description: true,
            status: true,
            createdAt: true,
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
        prisma.job.findMany({
          where: { companyId: entityId },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            patient: { select: { name: true } },
            status: true,
            createdAt: true,
          },
        }),
        prisma.payment.findMany({
          where: {
            job: { companyId: entityId },
            status: 'COMPLETED',
          },
          take: 5,
          orderBy: { paidAt: 'desc' },
          select: {
            id: true,
            amount: true,
            paidAt: true,
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
        prisma.assignment.findMany({
          where: { caregiverId: entityId },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            job: {
              select: {
                id: true,
                patient: { select: { name: true } },
              },
            },
          },
        }),
        prisma.careLog.findMany({
          where: { caregiverId: entityId },
          take: 5,
          orderBy: { timestamp: 'desc' },
          select: {
            id: true,
            logType: true,
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
        prisma.job.findMany({
          where: { guardianId: entityId },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            patient: { select: { name: true } },
            status: true,
            createdAt: true,
          },
        }),
        prisma.payment.findMany({
          where: { payerId: entityId },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
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