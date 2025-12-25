import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDecimal,
  IsArray,
} from 'class-validator';
import { PayoutMethod, SubscriptionTier } from '@prisma/client';

export class CreateAgencyDto {
  @IsString()
  agency_name: string;

  @IsString()
  trade_license: string;

  @IsString()
  @IsOptional()
  trade_license_url?: string;

  @IsString()
  @IsOptional()
  tin?: string;

  @IsString()
  contact_person: string;

  @IsString()
  contact_phone: string;

  @IsEmail()
  @IsOptional()
  contact_email?: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  specializations?: string[];

  @IsEnum(PayoutMethod)
  payout_method: PayoutMethod;

  @IsString()
  payout_account: string;
}

export class UpdateAgencyDto {
  @IsString()
  @IsOptional()
  agency_name?: string;

  @IsString()
  @IsOptional()
  contact_person?: string;

  @IsString()
  @IsOptional()
  contact_phone?: string;

  @IsEmail()
  @IsOptional()
  contact_email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  specializations?: string[];

  @IsEnum(PayoutMethod)
  @IsOptional()
  payout_method?: PayoutMethod;

  @IsString()
  @IsOptional()
  payout_account?: string;
}

export class VerifyAgencyDto {
  @IsString()
  verification_notes: string;
}
