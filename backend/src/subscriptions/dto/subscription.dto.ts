import { IsEnum } from 'class-validator';
import { SubscriptionTier } from '@prisma/client';

export class CreateSubscriptionDto {
  @IsEnum(SubscriptionTier)
  tier: SubscriptionTier;
}

export class UpdateSubscriptionDto {
  @IsEnum(SubscriptionTier)
  tier: SubscriptionTier;
}
