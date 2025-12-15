import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
  IsDecimal,
  IsBoolean,
} from 'class-validator';
import { PackageCategory } from '@prisma/client';

export class CreatePackageDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(PackageCategory)
  category: PackageCategory;

  @IsDecimal()
  price: number;

  @IsNumber()
  duration_days: number;

  @IsNumber()
  hours_per_day: number;

  @IsArray()
  inclusions: string[];

  @IsArray()
  @IsOptional()
  exclusions?: string[];

  @IsNumber()
  @IsOptional()
  caregiver_count?: number;

  @IsNumber()
  @IsOptional()
  min_advance_days?: number;
}

export class UpdatePackageDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal()
  @IsOptional()
  price?: number;

  @IsArray()
  @IsOptional()
  inclusions?: string[];

  @IsArray()
  @IsOptional()
  exclusions?: string[];

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
