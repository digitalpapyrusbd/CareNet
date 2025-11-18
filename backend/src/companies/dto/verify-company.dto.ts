import { IsIn, IsOptional, IsString } from 'class-validator';

export class VerifyCompanyDto {
  @IsString()
  @IsIn(['VERIFIED', 'REJECTED', 'PENDING'])
  verification_status: 'VERIFIED' | 'REJECTED' | 'PENDING';

  @IsOptional()
  @IsString()
  verification_notes?: string;
}
