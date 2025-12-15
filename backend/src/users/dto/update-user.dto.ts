import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  kyc_document_url?: string;
}

export class UpdateUserStatusDto {
  @IsBoolean()
  is_active: boolean;
}

export class ChangeRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
