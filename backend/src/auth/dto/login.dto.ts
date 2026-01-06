import { IsString, IsPhoneNumber, MinLength, IsEmail, IsOptional, ValidateIf } from 'class-validator';

export class LoginDto {
  // Phone OR email (at least one required)
  @ValidateIf((o) => !o.email)
  @IsPhoneNumber('BD', { message: 'Phone must be a valid Bangladeshi phone number' })
  phone?: string;

  @ValidateIf((o) => !o.phone)
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsString()
  @MinLength(8)
  password: string;
}
