import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserRole, JobStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAdminStats() {
    const [
      totalUsers,
      totalJobs,
      activeJobs,
      totalRevenue, // Needs calculation
    ] = await Promise.all([
      this.prisma.users.count(),
      this.prisma.jobs.count(),
      this.prisma.jobs.count({ where: { status: JobStatus.ACTIVE } }),
      this.prisma.invoices.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' }, // 'PAID' enum string (InvoiceStatus.PAID)
      }),
    ]);

    return {
      totalUsers,
      totalJobs,
      activeJobs,
      revenue: totalRevenue._sum.amount || 0,
    };
  }

  async getCompanyStats(companyId: string) {
    const company = await this.prisma.companies.findUnique({
      where: { id: companyId },
    });

    // Logic to count company's caregivers, jobs, etc.
    const [caregivers, jobs] = await Promise.all([
      this.prisma.caregivers.count({ where: { company_id: companyId } }),
      this.prisma.jobs.count({ where: { company_id: companyId } }),
    ]);

    return {
      caregivers,
      jobs,
    };
  }

  async getPlatformStats() {
    return this.getAdminStats();
  }

  async getCompanyAnalytics(id: string) {
    return this.getCompanyStats(id);
  }

  async getRevenueBreakdown() {
    const revenue = await this.prisma.invoices.aggregate({
      _sum: { amount: true },
      where: { status: 'PAID' },
    });

    return {
      total: revenue._sum.amount || 0,
      breakdown: {},
    };
  }
}
