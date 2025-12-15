import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  IsDecimal,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateCaregiverDto {
  @IsString()
  nid: string;

  @IsString()
  nid_url: string;

  @IsString()
  photo_url: string;

  @IsDateString()
  date_of_birth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  address: string;

  @IsArray()
  skills: string[];

  @IsArray()
  @IsOptional()
  certifications?: any[];

  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @IsArray()
  @IsOptional()
  languages?: string[];

  @IsDecimal()
  @IsOptional()
  hourly_rate?: number;
}

export class UpdateCaregiverDto {
  @IsString()
  @IsOptional()
  address?: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsOptional()
  certifications?: any[];

  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @IsDecimal()
  @IsOptional()
  hourly_rate?: number;

  @IsOptional()
  availabilityCalendar?: any;
}
