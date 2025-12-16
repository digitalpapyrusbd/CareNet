import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/middleware/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/lib/auth';

// Get comprehensive analytics data
export async function GET(request: NextRequest) {
  // Check authentication and authorization - only Admin/Moderator can view analytics
  const authResult = await authorize([
    UserRole.SUPER_ADMIN,
    UserRole.MODERATOR
  ])(request);
  if (authResult) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y
    const type = searchParams.get('type') || 'overview'; // overview, users, jobs, payments, disputes

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    let data: any = {};

    switch (type) {
      case 'overview': {
        // Get overview metrics
        const [
          totalUsers,
          totalCompanies,
          totalCaregivers,
          totalPatients,
          totalJobs,
          activeJobs,
          completedJobs,
          totalRevenue,
          totalDisputes,
          pendingDisputes,
          resolvedDisputes,
          newUsersThisPeriod,
          newJobsThisPeriod,
          completedJobsThisPeriod,
        ] = await Promise.all([
          // Total counts
          prisma.user.count({ where: { deletedAt: null } }),
          prisma.company.count(),
          prisma.caregiver.count(),
          prisma.patient.count(),
          prisma.job.count(),
          prisma.job.count({ where: { status: 'ACTIVE' } }),
          prisma.job.count({ where: { status: 'COMPLETED' } }),
          
          // Revenue
          prisma.payment.aggregate({
            where: {
              status: 'COMPLETED',
              paidAt: { gte: startDate },
            },
            _sum: { amount: true },
          }),
          
          // Disputes
          prisma.dispute.count({ where: { createdAt: { gte: startDate } } }),
          prisma.dispute.count({ where: { status: 'OPEN', createdAt: { gte: startDate } } }),
          prisma.dispute.count({ where: { status: 'RESOLVED', createdAt: { gte: startDate } } }),
          
          // Period-specific metrics
          prisma.user.count({
            where: {
              deletedAt: null,
              createdAt: { gte: startDate },
            },
          }),
          prisma.job.count({
            where: {
              createdAt: { gte: startDate },
            },
          }),
          prisma.job.count({
            where: {
              status: 'COMPLETED',
              updatedAt: { gte: startDate },
            },
          }),
        ]);

        data = {
          totals: {
            users: totalUsers,
            companies: totalCompanies,
            caregivers: totalCaregivers,
            patients: totalPatients,
            jobs: totalJobs,
            activeJobs,
            completedJobs,
          },
          financial: {
            totalRevenue: totalRevenue._sum.amount || 0,
            revenueThisPeriod: totalRevenue._sum.amount || 0, // Same as total since we filtered by period
          },
          disputes: {
            total: totalDisputes,
            pending: pendingDisputes,
            resolved: resolvedDisputes,
            resolutionRate: totalDisputes > 0 ? Math.round((resolvedDisputes / totalDisputes) * 100) : 0,
          },
          growth: {
            newUsers: newUsersThisPeriod,
            newJobs: newJobsThisPeriod,
            completedJobs: completedJobsThisPeriod,
          },
        };
        break;
      }

      case 'users': {
        // Get user analytics
        const [
          userGrowth,
          userByRole,
          userByKycStatus,
          userRegistrationsByDay,
        ] = await Promise.all([
          // User growth over time
          prisma.user.groupBy({
            by: ['createdAt'],
            where: {
              createdAt: { gte: startDate },
            },
            _count: { id: true },
          }),
          
          // Users by role
          prisma.user.groupBy({
            by: ['role'],
            _count: { id: true },
          }),
          
          // Users by KYC status
          prisma.user.groupBy({
            by: ['kycStatus'],
            _count: { id: true },
          }),
          
          // User registrations by day
          prisma.$queryRaw`
            SELECT 
              DATE(createdAt) as date,
              COUNT(*) as count
            FROM User 
            WHERE createdAt >= ${startDate.toISOString()}
            GROUP BY DATE(createdAt)
            ORDER BY date DESC
            LIMIT 30
          `,
        ]);

        data = {
          growth: userGrowth,
          byRole: userByRole,
          byKycStatus: userByKycStatus,
          registrationsByDay: userRegistrationsByDay,
        };
        break;
      }

      case 'jobs': {
        // Get job analytics
        const [
          jobStatus,
          jobsByCompany,
          jobCompletionRate,
          jobsByDay,
          topPackages,
        ] = await Promise.all([
          // Jobs by status
          prisma.job.groupBy({
            by: ['status'],
            where: {
              createdAt: { gte: startDate },
            },
            _count: { id: true },
          }),
          
          // Jobs by company (top 10)
          prisma.job.groupBy({
            by: ['companyId'],
            where: {
              createdAt: { gte: startDate },
            },
            _count: { id: true },
            orderBy: {
              _count: { id: 'desc' },
            },
            take: 10,
          }),
          
          // Job completion rate
          prisma.job.aggregate({
            where: {
              createdAt: { gte: startDate },
            },
            _count: { id: true },
          }),
          
          // Jobs created by day
          prisma.$queryRaw`
            SELECT 
              DATE(createdAt) as date,
              COUNT(*) as count
            FROM Job 
            WHERE createdAt >= ${startDate.toISOString()}
            GROUP BY DATE(createdAt)
            ORDER BY date DESC
            LIMIT 30
          `,
          
          // Top packages
          prisma.job.groupBy({
            by: ['packageId'],
            where: {
              createdAt: { gte: startDate },
            },
            _count: { id: true },
            orderBy: {
              _count: { id: 'desc' },
            },
            take: 10,
          }),
        ]);

        // Get company details for jobs by company
        const companyIds = jobsByCompany.map((item: any) => item.companyId);
        const companies = await prisma.company.findMany({
          where: { id: { in: companyIds } },
          select: { id: true, companyName: true },
        });

        // Get package details for top packages
        const packageIds = topPackages.map((item: any) => item.packageId);
        const packages = await prisma.package.findMany({
          where: { id: { in: packageIds } },
          select: { id: true, name: true },
        });

        // Enrich data with company and package names
        const enrichedJobsByCompany = jobsByCompany.map((item: any) => ({
          ...item,
          company: companies.find((c: any) => c.id === item.companyId),
        }));

        const enrichedTopPackages = topPackages.map((item: any) => ({
          ...item,
          package: packages.find((p: any) => p.id === item.packageId),
        }));

        data = {
          byStatus: jobStatus,
          byCompany: enrichedJobsByCompany,
          completionRate: jobCompletionRate._count.id > 0 
            ? Math.round((jobCompletionRate._count.id / jobCompletionRate._count.id) * 100) 
            : 0,
          byDay: jobsByDay,
          topPackages: enrichedTopPackages,
        };
        break;
      }

      case 'payments': {
        // Get payment analytics
        const [
          paymentMethods,
          paymentStatus,
          paymentsByDay,
          paymentVolume,
        ] = await Promise.all([
          // Payments by method
          prisma.payment.groupBy({
            by: ['method'],
            where: {
              createdAt: { gte: startDate },
            },
            _count: { id: true },
            _sum: { amount: true },
          }),
          
          // Payments by status
          prisma.payment.groupBy({
            by: ['status'],
            where: {
              createdAt: { gte: startDate },
            },
            _count: { id: true },
            _sum: { amount: true },
          }),
          
          // Payments by day
          prisma.$queryRaw`
            SELECT 
              DATE(paidAt) as date,
              COUNT(*) as count,
              COALESCE(SUM(amount), 0) as total
            FROM Payment 
            WHERE paidAt >= ${startDate.toISOString()}
            GROUP BY DATE(paidAt)
            ORDER BY date DESC
            LIMIT 30
          `,
          
          // Payment volume metrics
          prisma.payment.aggregate({
            where: {
              createdAt: { gte: startDate },
            },
            _count: { id: true },
            _sum: { amount: true },
            _avg: { amount: true },
          }),
        ]);

        data = {
          byMethod: paymentMethods,
          byStatus: paymentStatus,
          byDay: paymentsByDay,
          volume: paymentVolume,
        };
        break;
      }

      case 'disputes': {
        // Get dispute analytics
        const [
          disputeTypes,
          disputeStatus,
          disputeResolutionTime,
          disputesByDay,
        ] = await Promise.all([
          // Disputes by type
          prisma.dispute.groupBy({
            by: ['disputeType'],
            where: {
              createdAt: { gte: startDate },
            },
            _count: { id: true },
          }),
          
          // Disputes by status
          prisma.dispute.groupBy({
            by: ['status'],
            where: {
              createdAt: { gte: startDate },
            },
            _count: { id: true },
          }),
          
          // Average resolution time
          prisma.dispute.aggregate({
            where: {
              status: 'RESOLVED',
              createdAt: { gte: startDate },
            },
            _avg: {
              resolvedAt: true,
              createdAt: true,
            },
          }),
          
          // Disputes by day
          prisma.$queryRaw`
            SELECT 
              DATE(createdAt) as date,
              COUNT(*) as count
            FROM Dispute 
            WHERE createdAt >= ${startDate.toISOString()}
            GROUP BY DATE(createdAt)
            ORDER BY date DESC
            LIMIT 30
          `,
        ]);

        // Calculate average resolution time in days
        const avgResolutionTimeInMs = disputeResolutionTime._avg.resolvedAt - disputeResolutionTime._avg.createdAt;
        const avgResolutionTimeInDays = avgResolutionTimeInMs / (1000 * 60 * 60 * 24);

        data = {
          byType: disputeTypes,
          byStatus: disputeStatus,
          avgResolutionTime: Math.round(avgResolutionTimeInDays * 10) / 10, // Round to 1 decimal
          byDay: disputesByDay,
        };
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data,
      period,
      type,
      dateRange: {
        start: startDate,
        end: now,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}