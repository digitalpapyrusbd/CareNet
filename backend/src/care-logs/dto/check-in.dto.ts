import { IsString, IsNotEmpty, IsObject } from 'class-validator';

class LocationDto {
  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;
}

export class CheckInDto {
  @IsString()
  @IsNotEmpty()
  job_id: string;

  @IsString()
  @IsNotEmpty()
  patient_id: string;

  @IsObject()
  location: LocationDto;
}
