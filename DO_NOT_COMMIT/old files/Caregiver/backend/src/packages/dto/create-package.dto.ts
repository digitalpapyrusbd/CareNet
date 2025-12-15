import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, IsEnum } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['ELDERLY_CARE', 'DISABILITY_SUPPORT', 'POST_SURGERY', 'CHRONIC_ILLNESS', 'COMPANIONSHIP'])
  category: string;

  @IsNumber()
  price: number;

  @IsNumber()
  duration_days: number;

  @IsNumber()
  hours_per_day: number;

  @IsArray()
  @IsString({ each: true })
  inclusions: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exclusions?: string[];

  @IsNumber()
  caregiver_count: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  min_advance_days?: number;
}
