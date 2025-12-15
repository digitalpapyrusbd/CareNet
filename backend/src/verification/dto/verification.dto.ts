import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { VerificationStepType, VerificationDecision } from '@prisma/client';

export class SubmitVerificationStepDto {
  @IsEnum(VerificationStepType)
  step_type: VerificationStepType;

  @IsArray()
  @IsOptional()
  document_urls?: string[];
}

export class ModeratorReviewDto {
  @IsEnum(VerificationDecision)
  decision: VerificationDecision;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class AdminReviewDto {
  @IsEnum(VerificationDecision)
  decision: VerificationDecision;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  resubmit_reason?: string;
}
