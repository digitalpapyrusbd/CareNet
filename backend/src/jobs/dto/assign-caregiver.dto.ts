import { AssignmentRole } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class AssignCaregiverDto {
  @IsString()
  job_id: string;

  @IsString()
  caregiver_id: string;

  @IsOptional()
  @IsEnum(AssignmentRole)
  role?: AssignmentRole;

  @IsOptional()
  @IsString()
  shift_start_time?: string;

  @IsOptional()
  @IsString()
  shift_end_time?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  days_of_week?: string[];
}
