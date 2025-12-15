import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { Gender, MobilityLevel, CognitiveStatus } from '@prisma/client';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  date_of_birth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  blood_group?: string;

  @IsOptional()
  @IsString()
  primaryConditions?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsEnum(MobilityLevel)
  mobility_level: MobilityLevel;

  @IsEnum(CognitiveStatus)
  cognitive_status: CognitiveStatus;

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
  consent_data_sharing?: boolean;

  @IsOptional()
  consent_marketing?: boolean;
}