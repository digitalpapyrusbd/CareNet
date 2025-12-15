import { IsString, IsPhoneNumber, MinLength } from 'class-validator';

export class LoginDto {
  @IsPhoneNumber('BD')
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;
}
