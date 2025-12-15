import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  IsArray,
} from 'class-validator';
import { CareLogType } from '@prisma/client';

export class CreateCareLogDto {
  @IsString()
  job_id: string;

  @IsEnum(CareLogType)
  @IsOptional()
  log_type?: CareLogType;

  @IsObject()
  @IsOptional()
  data?: any;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  @IsOptional()
  vitals?: any;

  @IsArray()
  @IsOptional()
  activities?: any[];

  @IsArray()
  @IsOptional()
  photoUrls?: string[];
}

export class UpdateCareLogDto {
  @IsEnum(CareLogType)
  @IsOptional()
  log_type?: CareLogType;

  @IsObject()
  @IsOptional()
  data?: any;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  @IsOptional()
  vitals?: any;

  @IsArray()
  @IsOptional()
  activities?: any[];

  @IsArray()
  @IsOptional()
  photoUrls?: string[];
}
