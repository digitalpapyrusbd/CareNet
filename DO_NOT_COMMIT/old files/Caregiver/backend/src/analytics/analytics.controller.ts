import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'MODERATOR')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('users')
  async getUserMetrics() {
    return this.analyticsService.getUserMetrics();
  }

  @Get('revenue')
  async getRevenueMetrics() {
    return this.analyticsService.getRevenueMetrics();
  }

  @Get('caregivers')
  async getCaregiverPerformance() {
    return this.analyticsService.getCaregiverPerformance();
  }

  @Get('companies')
  async getCompanyPerformance() {
    return this.analyticsService.getCompanyPerformance();
  }
}
