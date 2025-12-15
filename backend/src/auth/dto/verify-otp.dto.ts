import { IsString, IsPhoneNumber } from 'class-validator';

export class VerifyOtpDto {
  @IsPhoneNumber('BD')
  phone: string;

  @IsString()
  code: string;
}
