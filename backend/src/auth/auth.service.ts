import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { PrismaService } from '../common/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Redis } from 'ioredis';
import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  phone: string;
  role: string;
  mfa_pending?: boolean;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  private redis: Redis;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Initialize Redis client
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
    });
  }

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.users.findUnique({
      where: { phone: registerDto.phone },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    if (registerDto.email) {
      const existingEmail = await this.prisma.users.findUnique({
        where: { email: registerDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Generate OTP
    const otp = this.generateOTP();

    // Store OTP in Redis (expires in 10 minutes)
    const otpKey = `otp:${registerDto.phone}`;
    await this.redis.setex(otpKey, 600, otp);

    // Store user data temporarily in Redis
    const userData = {
      ...registerDto,
      password_hash: hashedPassword,
    };
    const userDataKey = `registration:${registerDto.phone}`;
    await this.redis.setex(userDataKey, 600, JSON.stringify(userData));

    // TODO: Send OTP via SMS (Twilio integration)
    console.log(`OTP for ${registerDto.phone}: ${otp}`);

    return {
      message: 'OTP sent to your phone number',
      phone: registerDto.phone,
      // Remove this in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  }

  /**
   * Verify OTP and complete registration
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const otpKey = `otp:${verifyOtpDto.phone}`;
    const storedOtp = await this.redis.get(otpKey);

    if (!storedOtp || storedOtp !== verifyOtpDto.code) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Get user data from Redis
    const userDataKey = `registration:${verifyOtpDto.phone}`;
    const userDataStr = await this.redis.get(userDataKey);

    if (!userDataStr) {
      throw new BadRequestException(
        'Registration data expired. Please register again',
      );
    }

    const userData = JSON.parse(userDataStr);

    // Create user in database
    const user = await this.prisma.users.create({
      data: {
        phone: userData.phone,
        email: userData.email,
        password_hash: userData.password_hash,
        name: userData.name,
        role: userData.role,
        language: userData.language || 'en',
        kyc_status: 'PENDING',
      },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Clean up Redis
    await this.redis.del(otpKey, userDataKey);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.phone, user.role);

    return {
      user,
      ...tokens,
    };
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { phone: loginDto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if MFA is enabled
    if (user.mfa_enabled) {
      // Return temporary token for MFA verification
      const tempToken = this.jwtService.sign(
        { sub: user.id, mfa_pending: true },
        { expiresIn: '5m' },
      );

      return {
        mfa_required: true,
        temp_token: tempToken,
      };
    }

    // Update last login
    await this.prisma.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.phone, user.role);

    return {
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  /**
   * Setup MFA for user
   */
  async setupMfa(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.mfa_enabled) {
      throw new BadRequestException('MFA is already enabled');
    }

    // Generate MFA secret
    const secret = speakeasy.generateSecret({
      name: `CareNet (${user.phone})`,
      issuer: this.configService.get('MFA_ISSUER', 'CareNet'),
    });

    // Store secret temporarily in Redis (expires in 10 minutes)
    const mfaKey = `mfa:setup:${userId}`;
    await this.redis.setex(mfaKey, 600, secret.base32);

    return {
      secret: secret.base32,
      qr_code: secret.otpauth_url,
    };
  }

  /**
   * Verify MFA token and enable MFA
   */
  async verifyMfaSetup(userId: string, token: string) {
    const mfaKey = `mfa:setup:${userId}`;
    const secret = await this.redis.get(mfaKey);

    if (!secret) {
      throw new BadRequestException('MFA setup expired. Please start again');
    }

    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: this.configService.get<number>('MFA_WINDOW', 1),
    });

    if (!isValid) {
      throw new BadRequestException('Invalid MFA token');
    }

    // Enable MFA for user
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        mfa_enabled: true,
        mfa_secret: secret,
      },
    });

    // Clean up Redis
    await this.redis.del(mfaKey);

    return {
      message: 'MFA enabled successfully',
    };
  }

  /**
   * Verify MFA during login
   */
  async verifyMfaLogin(tempToken: string, token: string) {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(tempToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!payload.mfa_pending) {
      throw new BadRequestException('Invalid MFA flow');
    }

    const user = await this.prisma.users.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.mfa_secret) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: 'base32',
      token,
      window: this.configService.get<number>('MFA_WINDOW', 1),
    });

    if (!isValid) {
      throw new BadRequestException('Invalid MFA token');
    }

    // Update last login
    await this.prisma.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.phone, user.role);

    return {
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.users.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.is_active) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const tokens = this.generateTokens(user.id, user.phone, user.role);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Generate JWT tokens
   */
  private generateTokens(userId: string, phone: string, role: string) {
    const payload = { sub: userId, phone, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_EXPIRATION',
        '7d',
      ) as any,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * Generate 6-digit OTP
   */
  private generateOTP(): string {
    const length = this.configService.get<number>('OTP_LENGTH', 6);
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }
}
