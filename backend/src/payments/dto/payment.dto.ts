import { IsString, IsDecimal, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsString()
  job_id: string;

  @IsDecimal()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}

export class ProcessPaymentDto {
  @IsString()
  payment_id: string;

  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsOptional()
  gateway_response?: any;
}

export class RefundPaymentDto {
  @IsDecimal()
  amount: number;

  @IsString()
  reason: string;
}
