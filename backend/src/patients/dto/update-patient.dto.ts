import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';
import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { Gender, MobilityLevel, CognitiveStatus } from '@prisma/client';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  blood_group?: string;

  @IsOptional()
  @IsString()
  primaryConditions?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsEnum(MobilityLevel)
  mobility_level?: MobilityLevel;

  @IsOptional()
  @IsEnum(CognitiveStatus)
  cognitive_status?: CognitiveStatus;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  emergency_contact_name?: string;

  @IsOptional()
  @IsString()
  emergency_contact_phone?: string;

  @IsOptional()
  @IsBoolean()
  consent_data_sharing?: boolean;

  @IsOptional()
  @IsBoolean()
  consent_marketing?: boolean;
}