import { IsIn, IsOptional, IsString } from 'class-validator';

export class VerifyCaregiverDto {
  @IsString()
  @IsIn(['VERIFIED', 'PENDING', 'REJECTED'])
  verification_status: 'VERIFIED' | 'PENDING' | 'REJECTED';

  @IsOptional()
  @IsString()
  verification_notes?: string;
}
