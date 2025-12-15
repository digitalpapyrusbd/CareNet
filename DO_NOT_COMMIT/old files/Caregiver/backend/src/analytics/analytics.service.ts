import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [
      totalUsers,
      totalCompanies,
      totalCaregivers,
      totalPatients,
      activeJobs,
      completedJobs,
      totalRevenue,
      totalJobs,
    ] = await Promise.all([
      this.prisma.users.count(),
      this.prisma.companies.count({ where: { is_verified: true } }),
      this.prisma.caregivers.count({ where: { is_verified: true } }),
      this.prisma.patients.count(),
      this.prisma.jobs.count({ where: { status: 'ACTIVE' } }),
      this.prisma.jobs.count({ where: { status: 'COMPLETED' } }),
      this.prisma.payments.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.jobs.count(),
    ]);

    return {
      statusCode: 200,
      message: 'Analytics overview retrieved successfully',
      data: {
        totalUsers,
        totalCompanies,
        totalCaregivers,
        totalPatients,
        activeJobs,
        completedJobs,
        totalJobs,
        totalRevenue: Number(totalRevenue._sum.amount || 0),
        timestamp: new Date(),
      },
    };
  }

  async getUserMetrics() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [newUsers, usersByRole] = await Promise.all([
      this.prisma.users.count({
        where: { created_at: { gte: thirtyDaysAgo } },
      }),
      this.prisma.users.groupBy({
        by: ['role'],
        _count: true,
      }),
    ]);

    return {
      newUsersLast30Days: newUsers,
      usersByRole,
      timestamp: new Date(),
    };
  }

  async getRevenueMetrics() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [monthlyRevenue, avgTransactionValue, totalTransactions] =
      await Promise.all([
        this.prisma.payments.aggregate({
          where: {
            status: 'COMPLETED',
            paid_at: { gte: thirtyDaysAgo },
          },
          _sum: { amount: true },
        }),
        this.prisma.payments.aggregate({
          where: { status: 'COMPLETED' },
          _avg: { amount: true },
        }),
        this.prisma.payments.count({ where: { status: 'COMPLETED' } }),
      ]);

    return {
      monthlyRevenue: Number(monthlyRevenue._sum.amount || 0),
      avgTransactionValue: Number(avgTransactionValue._avg.amount || 0),
      totalTransactions,
      timestamp: new Date(),
    };
  }

  async getCaregiverPerformance() {
    const topCaregivers = await this.prisma.caregivers.findMany({
      where: { is_verified: true },
      orderBy: [{ rating_avg: 'desc' }, { rating_count: 'desc' }],
      take: 10,
      include: {
        users: {
          select: { name: true, phone: true },
        },
      },
    });

    // TODO: Add duration fields to jobs table to calculate avg completion time
    // const avgCompletionTime = await this.prisma.jobs.aggregate({
    //   where: { status: 'COMPLETED' },
    //   _avg: { duration_hours: true },
    // });

    return {
      topCaregivers: topCaregivers.map((c) => ({
        id: c.id,
        name: c.users.name,
        rating: Number(c.rating_avg),
        totalRatings: c.rating_count,
        jobsCompleted: c.total_jobs_completed,
        experienceYears: c.experience_years,
      })),
      timestamp: new Date(),
    };
  }

  async getCompanyPerformance() {
    const topCompanies = await this.prisma.companies.findMany({
      where: { is_verified: true },
      orderBy: [{ rating_avg: 'desc' }, { rating_count: 'desc' }],
      take: 10,
      include: {
        users: {
          select: { name: true },
        },
        _count: {
          select: { jobs: true, caregivers: true },
        },
      },
    });

    return {
      topCompanies: topCompanies.map((c) => ({
        id: c.id,
        name: c.company_name,
        rating: Number(c.rating_avg),
        totalRatings: c.rating_count,
        totalJobs: c._count.jobs,
        totalCaregivers: c._count.caregivers,
      })),
      timestamp: new Date(),
    };
  }
}
