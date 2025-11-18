import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  license_number: string;

  @IsString()
  address: string;

  @IsString()
  contact_phone: string;

  @IsOptional()
  @IsString()
  contact_email?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  service_areas?: string[];
}
