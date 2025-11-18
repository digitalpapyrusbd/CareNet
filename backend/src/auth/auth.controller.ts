import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { LoginDto } from '../users/dto/login.dto';
import { RegisterDto } from '../users/dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto.phone, loginDto.password);
    if (!result) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
        data: null,
      };
    }

    // Convert null email to undefined for JWT payload
    const jwtPayload = {
      userId: result.user.id,
      role: result.user.role,
      phone: result.user.phone,
      email: result.user.email || undefined,
      name: result.user.name,
    };

    const { accessToken, refreshToken } = this.authService.generateTokenPair(jwtPayload);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: result.user.id,
          phone: result.user.phone,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
      },
    };
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    
    // Convert null email to undefined for JWT payload
    const jwtPayload = {
      userId: result.user.id,
      role: result.user.role,
      phone: result.user.phone,
      email: result.user.email || undefined,
      name: result.user.name,
    };

    const { accessToken, refreshToken } = this.authService.generateTokenPair(jwtPayload);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Registration successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: result.user.id,
          phone: result.user.phone,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
      },
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshDto: RefreshDto) {
    const result = await this.authService.refreshToken(refreshDto.refreshToken);
    if (!result) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid refresh token',
        data: null,
      };
    }

    // Get user details to create proper response
    const user = await this.authService.validateUser(refreshDto.phone, '');
    if (!user) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid refresh token',
        data: null,
      };
    }

    // Convert null email to undefined for JWT payload
    const jwtPayload = {
      userId: user.id,
      role: user.role,
      phone: user.phone,
      email: user.email || undefined,
      name: user.name,
    };

    const { accessToken, refreshToken } = this.authService.generateTokenPair(jwtPayload);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const isValid = await this.authService.verifyOTP(verifyOtpDto.phone, verifyOtpDto.otp);
    
    if (!isValid) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid OTP',
        data: null,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'OTP verified successfully',
      data: {
        verified: true,
      },
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request & { user: any }) {
    const user = await this.authService.validateUser(req.user.userId, '');
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Profile retrieved successfully',
      data: user,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request & { user: any }) {
    // In a real implementation, you might want to blacklist the token
    return {
      statusCode: HttpStatus.OK,
      message: 'Logout successful',
      data: null,
    };
  }
}