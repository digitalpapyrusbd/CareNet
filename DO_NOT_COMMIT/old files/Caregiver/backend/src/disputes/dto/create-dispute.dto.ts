import { IsString, IsEnum, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export enum DisputeType {
  PAYMENT = 'PAYMENT',
  QUALITY = 'QUALITY',
  SAFETY = 'SAFETY',
  NO_SHOW = 'NO_SHOW',
  OTHER = 'OTHER',
}

export class CreateDisputeDto {
  @IsString()
  @IsNotEmpty()
  job_id: string;

  @IsString()
  @IsNotEmpty()
  against: string;

  @IsEnum(DisputeType)
  @IsNotEmpty()
  dispute_type: DisputeType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  evidence_urls?: string[];
}

export class AssignModeratorDto {
  @IsString()
  @IsNotEmpty()
  assigned_moderator: string;
}

export class ResolveDisputeDto {
  @IsString()
  @IsNotEmpty()
  resolution: string;

  @IsString()
  @IsNotEmpty()
  resolution_action: string; // 'refund', 'warning', 'suspend', 'no_action'
}
