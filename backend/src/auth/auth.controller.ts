import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { MfaVerifyDto } from './dto/mfa.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('mfa/setup')
  async setupMfa(@CurrentUser('id') userId: string) {
    return this.authService.setupMfa(userId);
  }

  @Post('mfa/verify-setup')
  async verifyMfaSetup(
    @CurrentUser('id') userId: string,
    @Body() body: { token: string },
  ) {
    return this.authService.verifyMfaSetup(userId, body.token);
  }

  @Public()
  @Post('mfa/verify-login')
  async verifyMfaLogin(@Body() mfaVerifyDto: MfaVerifyDto) {
    return this.authService.verifyMfaLogin(
      mfaVerifyDto.userId,
      mfaVerifyDto.token,
    );
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refreshToken(body.refresh_token);
  }

  @Post('logout')
  logout() {
    // In a stateless JWT system, logout is typically handled client-side
    // by removing the tokens. You could implement token blacklisting here if needed.
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  getMe(@CurrentUser() user: any) {
    return { user };
  }
}
