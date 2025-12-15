import { IsString, IsDateString, IsArray, IsOptional } from 'class-validator';

export class CreateJobDto {
  @IsString()
  package_id: string;

  @IsString()
  patient_id: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsString()
  @IsOptional()
  special_instructions?: string;
}

export class UpdateJobDto {
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsString()
  @IsOptional()
  special_instructions?: string;
}

export class AssignCaregiverDto {
  @IsArray()
  caregiver_ids: string[];
}
