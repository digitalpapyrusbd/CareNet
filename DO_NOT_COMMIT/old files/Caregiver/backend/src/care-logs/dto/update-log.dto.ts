import { IsObject, IsArray, IsString, IsOptional } from 'class-validator';

export class UpdateLogDto {
  @IsOptional()
  @IsObject()
  vitals?: {
    blood_pressure?: string;
    heart_rate?: number;
    temperature?: number;
    oxygen_saturation?: number;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activities?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
