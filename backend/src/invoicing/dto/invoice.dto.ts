import {
  IsString,
  IsDecimal,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { InvoiceType } from '@prisma/client';

export class CreateInvoiceDto {
  @IsString()
  job_id: string;

  @IsEnum(InvoiceType)
  type: InvoiceType;

  @IsDecimal()
  amount: number;

  @IsDateString()
  @IsOptional()
  due_date?: string;
}

export class PayInvoiceDto {
  @IsString()
  payment_id: string;

  @IsString()
  @IsOptional()
  transaction_id?: string;
}
