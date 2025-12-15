import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateDisputeDto {
  @IsString()
  job_id: string;

  @IsString()
  reason: string;

  @IsString()
  description: string;

  @IsArray()
  @IsOptional()
  evidence_urls?: string[];
}

export class ResolveDisputeDto {
  @IsString()
  resolution: 'REFUND' | 'DISMISS' | 'PARTIAL_REFUND';

  @IsString()
  notes: string;
}
