import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export enum CareLogType {
  CHECK_IN = 'CHECK_IN',
  VITALS = 'VITALS',
  MEDICATION = 'MEDICATION',
  MEAL = 'MEAL',
  ACTIVITY = 'ACTIVITY',
  INCIDENT = 'INCIDENT',
  CHECK_OUT = 'CHECK_OUT',
}

export class CreateCareLogDto {
  @IsString()
  @IsNotEmpty()
  job_id: string;

  @IsString()
  @IsOptional()
  assignment_id?: string;

  @IsString()
  @IsNotEmpty()
  patient_id: string;

  @IsEnum(CareLogType)
  @IsNotEmpty()
  log_type: CareLogType;

  @IsNumber()
  @IsOptional()
  location_lat?: number;

  @IsNumber()
  @IsOptional()
  location_lng?: number;

  @IsNotEmpty()
  data: Record<string, any>;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  photo_urls?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activities?: string[];
}

export class UpdateCareLogDto {
  @IsNotEmpty()
  @IsOptional()
  data?: Record<string, any>;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  photo_urls?: string[];
}
