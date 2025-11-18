import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export interface JWTPayload {
  userId: string;
  role: UserRole;
  phone: string;
  email?: string;
  name?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  generateAccessToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload as any, {
      expiresIn: '30d',
    });
  }

  generateRefreshToken(payload: Pick<JWTPayload, 'userId' | 'role'>): string {
    return this.jwtService.sign(payload as any, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    } as any);
  }

  generateTokenPair(payload: JWTPayload): TokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken({
      userId: payload.userId,
      role: payload.role,
    });
    
    return { accessToken, refreshToken };
  }

  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: { phone },
    });

    if (user && await this.verifyPassword(password, user.password_hash)) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(phone: string, password: string) {
    const user = await this.validateUser(phone, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

          if (!user.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const payload: JWTPayload = {
      userId: user.id,
      role: user.role,
      phone: user.phone,
      email: user.email ?? undefined,
      name: user.name,
    };

    const tokens = this.generateTokenPair(payload);

    // Update last login
    await this.prisma.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    return {
      user,
      tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      }) as Pick<JWTPayload, 'userId' | 'role'>;

      const user = await this.prisma.users.findUnique({
        where: { id: payload.userId },
      });

      if (!user || !user.is_active) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload: JWTPayload = {
        userId: user.id,
        role: user.role,
        phone: user.phone,
        email: user.email ?? undefined,
        name: user.name,
      };

      return this.generateTokenPair(newPayload);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async register(userData: {
    phone: string;
    password: string;
    name: string;
    email?: string;
    role: UserRole;
  }) {
    // Check if user already exists
    const existingUser = await this.prisma.users.findUnique({
      where: { phone: userData.phone },
    });

    if (existingUser) {
      throw new UnauthorizedException('User with this phone number already exists');
    }

    // Hash password
    const hashedPwd = await this.hashPassword(userData.password);

    // Create user
    const user = await this.prisma.users.create({
      data: {
        phone: userData.phone,
        password_hash: hashedPwd,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        is_active: true,
        kyc_status: 'PENDING',
      },
    });

    // Generate tokens
    const payload: JWTPayload = {
      userId: user.id,
      role: user.role,
      phone: user.phone,
      email: user.email || undefined,
      name: user.name,
    };

    const tokens = this.generateTokenPair(payload);

    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async generateOTP(phone: string): Promise<string> {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database
    await this.prisma.verification_codes.create({
      data: {
        userId: phone, // Temporarily using phone as userId for OTP generation
        code: otp,
        type: 'OTP',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        isUsed: false,
      },
    });

    return otp;
  }

  async verifyOTP(phone: string, otp: string): Promise<boolean> {
    const verificationCode = await this.prisma.verification_codes.findFirst({
      where: {
        userId: phone,
        code: otp,
        type: 'OTP',
        isUsed: false,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!verificationCode) {
      return false;
    }

    // Mark OTP as used
    await this.prisma.verification_codes.update({
      where: { id: verificationCode.id },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });

    return true;
  }
}