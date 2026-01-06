import { Controller, Post, Body, UseGuards, Get, Req, Res, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { MfaVerifyDto } from './dto/mfa.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

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

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Query('phone') phone?: string, @Req() req?: Request) {
    // Store phone in Redis temporarily if provided
    // The phone will be retrieved in the callback using the OAuth state
    if (phone && req) {
      // Generate a unique state ID and store phone in Redis
      const stateId = `google_oauth_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      await this.authService.storeOAuthPhone(stateId, phone);
      // Store state ID in request for later retrieval
      (req as any).oauthState = stateId;
    }
    // Initiates Google OAuth flow
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const googleUser = req.user as any;
    // Get phone from the user object (passed through validate method)
    const phone = googleUser.phone;
    
    try {
      const result = await this.authService.googleLogin(googleUser, phone);
      
      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/google/callback?token=${result.accessToken}&refreshToken=${result.refreshToken}`;
      
      res.redirect(redirectUrl);
    } catch (error: any) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/login?error=${encodeURIComponent(error.message || 'Google authentication failed')}`);
    }
  }

  @Public()
  @Post('check-google-association')
  async checkGoogleAssociation(@Body() body: { phone?: string; email?: string }) {
    return this.authService.checkGoogleAssociation(body.phone, body.email);
  }
}
