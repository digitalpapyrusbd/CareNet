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
    @CurrentUser('agency_id') agencyId: string,
    @Body() createDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(agencyId, createDto);
  }

  @Get()
  findByAgency(@CurrentUser('agency_id') agencyId: string) {
    return this.subscriptionsService.findByAgency(agencyId);
  }

  @Patch('upgrade')
  upgrade(
    @CurrentUser('agency_id') agencyId: string,
    @Body() updateDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.upgrade(agencyId, updateDto);
  }

  @Post('cancel')
  cancel(@CurrentUser('agency_id') agencyId: string) {
    return this.subscriptionsService.cancel(agencyId);
  }
}
