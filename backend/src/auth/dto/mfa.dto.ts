import { IsString } from 'class-validator';

export class MfaSetupDto {
  @IsString()
  userId: string;
}

export class MfaVerifyDto {
  @IsString()
  userId: string;

  @IsString()
  token: string;
}
