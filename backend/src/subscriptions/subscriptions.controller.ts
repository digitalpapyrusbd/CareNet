import { Controller, Get, Post, Patch, Body } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('subscriptions')
@Roles(UserRole.AGENCY_ADMIN, UserRole.AGENCY_MANAGER)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(
    @CurrentUser('company_id') companyId: string,
    @Body() createDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(companyId, createDto);
  }

  @Get()
  findByCompany(@CurrentUser('company_id') companyId: string) {
    return this.subscriptionsService.findByCompany(companyId);
  }

  @Patch('upgrade')
  upgrade(
    @CurrentUser('company_id') companyId: string,
    @Body() updateDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.upgrade(companyId, updateDto);
  }

  @Post('cancel')
  cancel(@CurrentUser('company_id') companyId: string) {
    return this.subscriptionsService.cancel(companyId);
  }
}
