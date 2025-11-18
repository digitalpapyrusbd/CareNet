import { IsString, IsEnum, IsNotEmpty, IsOptional, IsInt, Min, Max, IsBoolean } from 'class-validator';

export enum FeedbackType {
  CAREGIVER = 'CAREGIVER',
  COMPANY = 'COMPANY',
  GUARDIAN = 'GUARDIAN',
}

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  job_id: string;

  @IsString()
  @IsNotEmpty()
  to_user_id: string;

  @IsEnum(FeedbackType)
  @IsNotEmpty()
  reviewee_type: FeedbackType;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  comments?: string;

  @IsBoolean()
  @IsOptional()
  is_public?: boolean;
}

export class RespondToFeedbackDto {
  @IsString()
  @IsNotEmpty()
  company_response: string;
}
