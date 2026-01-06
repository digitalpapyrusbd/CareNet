import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';
import { SubscriptionTier } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  private getTierPricing(tier: SubscriptionTier) {
    const pricing = {
      [SubscriptionTier.STARTER]: { monthly: 50, commission: 0.15 },
      [SubscriptionTier.GROWTH]: { monthly: 100, commission: 0.12 },
      [SubscriptionTier.ENTERPRISE]: { monthly: 200, commission: 0.1 },
    };
    return pricing[tier] || pricing[SubscriptionTier.STARTER];
  }

  async create(agencyId: string, createDto: CreateSubscriptionDto) {
    const agency = await this.prisma.agencies.findUnique({
      where: { id: agencyId },
    });
    if (!agency) throw new NotFoundException('Agency not found');

    const pricing = this.getTierPricing(createDto.tier);
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const subscription = await this.prisma.subscriptions.create({
      data: {
        user_id: agency.userId,
        plan_type: 'MONTHLY',
        tier: createDto.tier,
        price: pricing.monthly,
        billing_cycle: 'MONTHLY',
        current_period_start: new Date(),
        current_period_end: nextBillingDate,
        is_active: true,
      },
    });

    return subscription;
  }

  async findByAgency(agencyId: string) {
    const agency = await this.prisma.agencies.findUnique({
      where: { id: agencyId },
    });
    if (!agency) throw new NotFoundException('Agency not found');

    // We search by user_id
    const subscription = await this.prisma.subscriptions.findFirst({
      where: { user_id: agency.userId, is_active: true },
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    return subscription;
  }

  async upgrade(agencyId: string, updateDto: UpdateSubscriptionDto) {
    const subscription = await this.findByAgency(agencyId);
    const pricing = this.getTierPricing(updateDto.tier);

    const updated = await this.prisma.subscriptions.update({
      where: { id: subscription.id },
      data: {
        tier: updateDto.tier,
        price: pricing.monthly,
      },
    });

    return updated;
  }

  async cancel(agencyId: string) {
    const subscription = await this.findByAgency(agencyId);

    await this.prisma.subscriptions.update({
      where: { id: subscription.id },
      data: { is_active: false, cancelled_at: new Date() },
    });

    return { message: 'Subscription cancelled successfully' };
  }
}
