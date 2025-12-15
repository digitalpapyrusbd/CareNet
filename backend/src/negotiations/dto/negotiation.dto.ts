import { IsString, IsDecimal, IsOptional } from 'class-validator';

export class CreateNegotiationDto {
  @IsString()
  package_id: string;

  @IsDecimal()
  proposed_price: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class RespondNegotiationDto {
  @IsString()
  action: 'ACCEPT' | 'DECLINE' | 'COUNTER';

  @IsDecimal()
  @IsOptional()
  counter_price?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
