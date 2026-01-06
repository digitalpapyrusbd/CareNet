import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('platform')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  getPlatformStats() {
    return this.analyticsService.getPlatformStats();
  }

  @Get('agency/:id')
  @Roles(UserRole.AGENCY_ADMIN, UserRole.AGENCY_MANAGER, UserRole.SUPER_ADMIN)
  getAgencyAnalytics(@Param('id') id: string) {
    return this.analyticsService.getAgencyAnalytics(id);
  }

  @Get('revenue')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  getRevenueBreakdown() {
    return this.analyticsService.getRevenueBreakdown();
  }
}
