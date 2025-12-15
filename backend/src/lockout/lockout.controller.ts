import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { LockoutService } from './lockout.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, AccountLockReason } from '@prisma/client';

@Controller('lockout')
export class LockoutController {
  constructor(private readonly lockoutService: LockoutService) {}

  @Get('status')
  getStatus(@CurrentUser('id') userId: string) {
    return this.lockoutService.getLockoutStatus(userId);
  }

  @Post(':userId/lock')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  lockAccount(
    @Param('userId') userId: string,
    @Body() body: { reason: AccountLockReason },
  ) {
    return this.lockoutService.lockAccount(userId, body.reason);
  }

  @Post(':userId/unlock')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  unlockAccount(
    @Param('userId') userId: string,
    @CurrentUser('id') unlockedBy: string,
  ) {
    return this.lockoutService.unlockAccount(userId, unlockedBy);
  }

  @Post(':userId/grace')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  grantGracePeriod(
    @Param('userId') userId: string,
    @Body() body: { days: number },
  ) {
    return this.lockoutService.grantGracePeriod(userId, body.days);
  }
}
