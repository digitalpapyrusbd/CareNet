import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Gender, MobilityLevel, CognitiveStatus } from '@prisma/client';

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsDateString()
  date_of_birth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsOptional()
  blood_group?: string;

  @IsString()
  address: string;

  @IsString()
  emergency_contact_name: string;

  @IsString()
  emergency_contact_phone: string;

  @IsArray()
  @IsOptional()
  primaryConditions?: string[];

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsEnum(MobilityLevel)
  @IsOptional()
  mobility_level?: MobilityLevel;

  @IsEnum(CognitiveStatus)
  @IsOptional()
  cognitive_status?: CognitiveStatus;

  @IsString()
  @IsOptional()
  photoUrl?: string;
}

export class UpdatePatientDto {
  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  emergency_contact_name?: string;

  @IsString()
  @IsOptional()
  emergency_contact_phone?: string;

  @IsArray()
  @IsOptional()
  primaryConditions?: string[];

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsEnum(MobilityLevel)
  @IsOptional()
  mobility_level?: MobilityLevel;

  @IsEnum(CognitiveStatus)
  @IsOptional()
  cognitive_status?: CognitiveStatus;
}
