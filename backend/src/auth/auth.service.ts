import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
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
  private redis: Redis | null = null;
  private redisAvailable = false;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Initialize Redis client - supports both Upstash and standard Redis
    // Support multiple environment variable names for Upstash
    const upstashUrl =
      this.configService.get('UPSTASH_REDIS_URL') ||
      this.configService.get('UPSTASH_REDIS_REST_URL');
    const upstashToken =
      this.configService.get('UPSTASH_REDIS_TOKEN') ||
      this.configService.get('UPSTASH_REDIS_REST_TOKEN');
    
    // Parse REDIS_URL if provided (format: rediss://default:password@host:port)
    const redisUrl = this.configService.get('REDIS_URL');
    let redisHost = this.configService.get('REDIS_HOST');
    let redisPort = this.configService.get('REDIS_PORT', 6379);
    let redisPassword = this.configService.get('REDIS_PASSWORD');

    // Parse REDIS_URL to extract host, port, and password
    if (redisUrl && redisUrl.startsWith('rediss://')) {
      try {
        const url = new URL(redisUrl);
        if (!redisHost) redisHost = url.hostname;
        if (!redisPassword) redisPassword = url.password || url.username;
        if (url.port && !this.configService.get('REDIS_PORT')) {
          redisPort = parseInt(url.port, 10);
        }
      } catch (error) {
        console.warn('[Redis] Failed to parse REDIS_URL:', error.message);
      }
    }

    // Check if REDIS_HOST points to Upstash (contains .upstash.io)
    const isUpstashHost = redisHost && redisHost.includes('.upstash.io');

    // Validate Upstash configuration
    const hasValidUpstashConfig = upstashUrl && upstashToken;
    const hasValidUpstashHostConfig = isUpstashHost && redisPassword;

    // Validate configuration and provide helpful error messages
    if (!hasValidUpstashConfig && !hasValidUpstashHostConfig && !redisHost) {
      console.warn(
        '[Redis] No Redis configuration found. Redis features will be disabled.',
      );
    } else if (hasValidUpstashConfig) {
      // Validate Upstash URL format
      if (
        !upstashUrl.startsWith('https://') ||
        !upstashUrl.includes('.upstash.io')
      ) {
        console.error(
          '[Redis] Invalid Upstash URL format. Expected format: https://your-instance.upstash.io',
          'Current URL:',
          upstashUrl,
        );
      }
    } else if (hasValidUpstashHostConfig) {
      // Validate Upstash host format
      if (!redisHost.includes('.upstash.io')) {
        console.error(
          '[Redis] Invalid Upstash host format. Expected format: your-instance.upstash.io',
          'Current host:',
          redisHost,
        );
      }
    }

    if (hasValidUpstashConfig) {
      try {
        // ioredis requires TCP connection (rediss://), not HTTPS
        // Extract hostname from HTTPS URL and use TCP connection
        let upstashHost: string;
        if (upstashUrl.startsWith('https://')) {
          try {
            const url = new URL(upstashUrl);
            upstashHost = url.hostname;
          } catch {
            // Fallback: extract hostname manually
            upstashHost = upstashUrl.replace('https://', '').split('/')[0];
          }
        } else {
          upstashHost = upstashUrl;
        }

        // Use TCP connection (rediss) with extracted hostname
        this.redis = new Redis({
          host: upstashHost,
          port: redisPort,
          password: upstashToken,
          tls: {},
          maxRetriesPerRequest: 1,
          enableOfflineQueue: false,
          retryStrategy: (times) => {
            if (times > 3) {
              return null; // Stop retrying
            }
            return Math.min(times * 100, 1000);
          },
          lazyConnect: true, // Don't connect immediately to avoid DNS errors during init
        });
      } catch (error) {
        console.error(
          '[Redis] Failed to create Upstash Redis client:',
          error.message,
        );
        throw new Error(`Redis initialization failed: ${error.message}`);
      }
    } else if (hasValidUpstashHostConfig) {
      try {
        // Use Upstash Redis with host/port format (requires TLS)
        this.redis = new Redis({
          host: redisHost,
          port: redisPort,
          password: redisPassword,
          tls: {},
          maxRetriesPerRequest: 1,
          enableOfflineQueue: false, // Don't queue commands when disconnected
          retryStrategy: (times) => {
            // Stop retrying after 3 attempts to prevent log spam
            if (times > 3) {
              console.warn('[Redis] Max retries reached. Redis features disabled.');
              return null; // Stop retrying
            }
            return Math.min(times * 100, 1000);
          },
          lazyConnect: true, // Don't connect immediately to avoid DNS errors during init
        });
      } catch (error) {
        console.error(
          '[Redis] Failed to create Upstash Redis client:',
          error.message,
        );
        throw new Error(`Redis initialization failed: ${error.message}`);
      }
    } else {
      // Use standard Redis (only if explicitly configured, otherwise warn)
      if (!redisHost || redisHost === 'localhost') {
        console.warn(
          '[Redis] No Upstash configuration found. Falling back to localhost:6379. Redis features will not work without a running local Redis instance.',
        );
      }
      try {
        this.redis = new Redis({
          host: redisHost || 'localhost',
          port: redisPort,
          password: redisPassword,
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => Math.min(times * 50, 2000),
          lazyConnect: true, // Don't connect immediately
        });
      } catch (error) {
        console.error(
          '[Redis] Failed to create standard Redis client:',
          error.message,
        );
        throw new Error(`Redis initialization failed: ${error.message}`);
      }
    }

    // Add error handlers to prevent unhandled errors
    this.redis.on('error', (err) => {
      // If DNS resolution fails, disconnect immediately to stop retries
      if (
        err.message.includes('ENOTFOUND') ||
        err.message.includes('getaddrinfo')
      ) {
        if (this.redis && !this.redisAvailable) {
          // Only log once, then disconnect
          console.warn(
            '[Redis] DNS resolution failed - Redis features disabled. The Upstash instance may not exist.',
          );
          this.redis.disconnect();
          this.redis = null;
        }
        return; // Don't log every DNS error
      }
      
      // Only log non-DNS errors (and only if Redis is still available)
      if (this.redisAvailable) {
        console.error('[Redis] Connection error:', err.message);
      }
    });

    this.redis.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });

    this.redis.on('ready', () => {
      this.redisAvailable = true;
      console.log('[Redis] Ready');
    });

    this.redis.on('end', () => {
      this.redisAvailable = false;
      console.log('[Redis] Connection closed');
    });

    // Test Redis connection and handle DNS resolution errors
    this.testRedisConnection().catch((error) => {
      console.error('[Redis] Connection test failed:', error.message);
    });
  }

  private async testRedisConnection(): Promise<void> {
    if (!this.redis) {
      this.redisAvailable = false;
      console.warn('[Redis] Redis client not initialized - skipping connection test');
      return;
    }

    try {
      // Test connection with a simple ping
      await this.redis.ping();
      this.redisAvailable = true;
      console.log('[Redis] Connection test successful');
    } catch (error) {
      // Mark Redis as unavailable
      this.redisAvailable = false;

      // Handle specific DNS resolution errors
      if (
        error.message.includes('ENOTFOUND') ||
        error.message.includes('getaddrinfo')
      ) {
        console.warn(
          '[Redis] DNS resolution failed - Redis features disabled. The Upstash instance may not exist.',
          'OTP and MFA features will not work without Redis.',
        );
        // Disconnect to stop retry attempts
        this.redis?.disconnect();
        this.redis = null;
      } else if (error.message.includes('ECONNREFUSED')) {
        console.warn(
          '[Redis] Connection refused - Redis features disabled.',
          'OTP and MFA features will not work without Redis.',
        );
        this.redis?.disconnect();
        this.redis = null;
      } else {
        console.warn('[Redis] Connection failed - Redis features disabled:', error.message);
        this.redis?.disconnect();
        this.redis = null;
      }
      // Don't throw - allow app to continue without Redis
    }
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
      // Check if phone is associated with Google account
      if (existingUser.google_id && existingUser.google_email) {
        throw new ConflictException(
          `This phone number is already associated with Google account: ${existingUser.google_email}. Please sign in with Google.`,
        );
      }
      throw new ConflictException('User with this phone number already exists');
    }

    if (registerDto.email) {
      const existingEmail = await this.prisma.users.findUnique({
        where: { email: registerDto.email },
      });

      if (existingEmail) {
        // Check if email is associated with Google account
        if (existingEmail.google_id && existingEmail.google_email) {
          throw new ConflictException(
            `This email is already associated with a Google account. Please sign in with Google.`,
          );
        }
        throw new ConflictException('User with this email already exists');
      }

      // Check if email is already used as Google email for another phone
      const existingGoogleEmail = await this.prisma.users.findFirst({
        where: {
          google_email: registerDto.email,
          phone: { not: registerDto.phone },
        },
      });

      if (existingGoogleEmail) {
        throw new ConflictException(
          `This email is already associated with phone number: ${existingGoogleEmail.phone}. Please use a different email or sign in with Google.`,
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Generate OTP
    const otp = this.generateOTP();

    // Check if Redis is available for OTP storage
    if (!this.redisAvailable || !this.redis) {
      console.warn('[Redis] Redis unavailable - creating user directly without OTP verification');
      // Create user directly without OTP verification (dev mode fallback)
      const user = await this.prisma.users.create({
        data: {
          phone: registerDto.phone,
          email: registerDto.email,
          password_hash: hashedPassword,
          name: registerDto.name,
          role: registerDto.role,
          language: registerDto.language || 'en',
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

      const tokens = this.generateTokens(user.id, user.phone, user.role);

      return {
        message: 'Registration successful (OTP verification skipped - Redis unavailable)',
        user,
        tokens,
      };
    }

    try {
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
    } catch (error) {
      console.error('[Redis] Failed to store OTP data:', error.message);
      throw new InternalServerErrorException(
        'Failed to register user. Please try again.',
      );
    }

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
    // Check if Redis is available
    if (!this.redisAvailable || !this.redis) {
      throw new BadRequestException(
        'OTP verification is not available. Redis is not configured.',
      );
    }

    const otpKey = `otp:${verifyOtpDto.phone}`;
    const userDataKey = `registration:${verifyOtpDto.phone}`;
    let userData: any;

    try {
      const storedOtp = await this.redis.get(otpKey);

      if (!storedOtp || storedOtp !== verifyOtpDto.code) {
        throw new BadRequestException('Invalid or expired OTP');
      }

      // Get user data from Redis
      const userDataStr = await this.redis.get(userDataKey);

      if (!userDataStr) {
        throw new BadRequestException(
          'Registration data expired. Please register again',
        );
      }

      userData = JSON.parse(userDataStr);
    } catch (error) {
      console.error('[Redis] Failed to verify OTP:', error.message);
      throw new InternalServerErrorException(
        'Failed to verify OTP. Please try again.',
      );
    }

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

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.phone, user.role);

    try {
      // Clean up Redis
      await this.redis.del(otpKey, userDataKey);
    } catch (error) {
      console.error('[Redis] Failed to clean up OTP data:', error.message);
      // Don't throw error for cleanup failure as user is already created
    }

    return {
      message: 'Registration successful',
      user,
      tokens,
    };
  }

  /**
   * Login user - supports phone OR email
   */
  async login(loginDto: LoginDto) {
    // Find user by phone OR email
    let user;
    if (loginDto.phone) {
      user = await this.prisma.users.findUnique({
        where: { phone: loginDto.phone },
      });
    } else if (loginDto.email) {
      user = await this.prisma.users.findUnique({
        where: { email: loginDto.email },
      });
    } else {
      throw new BadRequestException('Phone or email is required');
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Check if user has Google account associated
    if (user.google_id && user.google_email) {
      // User has Google account - redirect to Google OAuth
      return {
        requiresGoogleAuth: true,
        message: 'This account is linked to Google. Please sign in with Google.',
        googleEmail: user.google_email,
      };
    }

    // Verify password (required for non-Google accounts)
    if (!user.password_hash) {
      throw new UnauthorizedException('Password not set. Please use Google sign-in.');
    }

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
        requiresMFA: true,
        tempToken,
      };
    }

    try {
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
    } catch (error) {
      console.error(
        '[Redis] Failed to complete MFA verification:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Failed to complete MFA verification. Please try again.',
      );
    }
  }

  /**
   * Setup MFA for user
   */
  async setupMfa(userId: string) {
    // Check if Redis is available for MFA setup
    if (!this.redisAvailable || !this.redis) {
      throw new BadRequestException(
        'MFA setup is not available. Redis is not configured.',
      );
    }

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

    try {
      // Store secret temporarily in Redis (expires in 10 minutes)
      const mfaKey = `mfa:setup:${userId}`;
      await this.redis.setex(mfaKey, 600, secret.base32);

      return {
        secret: secret.base32,
        qr_code: secret.otpauth_url,
      };
    } catch (error) {
      console.error('[Redis] Failed to store MFA setup data:', error.message);
      throw new InternalServerErrorException(
        'Failed to setup MFA. Please try again.',
      );
    }
  }

  /**
   * Verify MFA token and enable MFA
   */
  async verifyMfaSetup(userId: string, token: string) {
    // Check if Redis is available
    if (!this.redisAvailable || !this.redis) {
      throw new BadRequestException(
        'MFA verification is not available. Redis is not configured.',
      );
    }

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

    try {
      // Enable MFA for user
      await this.prisma.users.update({
        where: { id: userId },
        data: {
          mfa_enabled: true,
          mfa_secret: secret,
        },
      });
    } catch (error) {
      console.error('[Redis] Failed to enable MFA:', error.message);
      throw new InternalServerErrorException(
        'Failed to enable MFA. Please try again.',
      );
    }

    try {
      // Clean up Redis
      await this.redis.del(mfaKey);
    } catch (error) {
      console.error(
        '[Redis] Failed to clean up MFA setup data:',
        error.message,
      );
      // Don't throw error for cleanup failure as MFA is already enabled
    }

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

    try {
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
    } catch (error) {
      console.error('[Redis] Failed to generate tokens:', error.message);
      throw new InternalServerErrorException(
        'Failed to complete MFA verification. Please try again.',
      );
    }
  }

  /**
   * Store phone number temporarily for OAuth flow
   */
  async storeOAuthPhone(stateId: string, phone: string): Promise<void> {
    if (!this.redisAvailable || !this.redis) {
      console.warn('[Redis] Cannot store OAuth phone - Redis not available');
      return;
    }
    try {
      // Store phone for 10 minutes (OAuth flow should complete faster)
      await this.redis.setex(`oauth:phone:${stateId}`, 600, phone);
    } catch (error) {
      console.error('[Redis] Failed to store OAuth phone:', error.message);
    }
  }

  /**
   * Retrieve phone number from OAuth state
   */
  async getOAuthPhone(stateId: string): Promise<string | null> {
    if (!this.redisAvailable || !this.redis) {
      return null;
    }
    try {
      const phone = await this.redis.get(`oauth:phone:${stateId}`);
      // Clean up after retrieval
      if (phone) {
        await this.redis.del(`oauth:phone:${stateId}`);
      }
      return phone;
    } catch (error) {
      console.error('[Redis] Failed to retrieve OAuth phone:', error.message);
      return null;
    }
  }

  /**
   * Handle Google OAuth callback
   */
  async googleLogin(googleUser: any, phone?: string) {
    const { googleId, email, firstName, lastName, picture } = googleUser;

    // Check if Google account already exists
    let user = await this.prisma.users.findUnique({
      where: { google_id: googleId },
    });

    if (user) {
      // Existing Google user - update last login
      await this.prisma.users.update({
        where: { id: user.id },
        data: { last_login_at: new Date() },
      });

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

    // New Google user - check if phone is provided
    if (phone) {
      // Check if phone is already registered
      const existingPhoneUser = await this.prisma.users.findUnique({
        where: { phone },
      });

      if (existingPhoneUser) {
        // Link Google account to existing phone
        user = await this.prisma.users.update({
          where: { id: existingPhoneUser.id },
          data: {
            google_id: googleId,
            google_email: email,
            email: email || existingPhoneUser.email,
            name: existingPhoneUser.name || `${firstName} ${lastName}`,
            last_login_at: new Date(),
          },
        });
      } else {
        // Create new user with phone and Google
        user = await this.prisma.users.create({
          data: {
            phone,
            email,
            google_id: googleId,
            google_email: email,
            name: `${firstName} ${lastName}`,
            password_hash: null, // No password for Google users
            role: UserRole.GUARDIAN, // Default role, can be changed
            language: 'en',
            kyc_status: 'PENDING',
          },
        });
      }
    } else {
      // No phone provided - check if email exists
      const existingEmailUser = await this.prisma.users.findUnique({
        where: { email },
      });

      if (existingEmailUser) {
        // Link Google to existing email account
        user = await this.prisma.users.update({
          where: { id: existingEmailUser.id },
          data: {
            google_id: googleId,
            google_email: email,
            last_login_at: new Date(),
          },
        });
      } else {
        throw new BadRequestException(
          'Phone number is required for new Google account registration',
        );
      }
    }

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
   * Check if phone/email is associated with Google account
   */
  async checkGoogleAssociation(phone?: string, email?: string) {
    if (phone) {
      const user = await this.prisma.users.findUnique({
        where: { phone },
        select: { google_id: true, google_email: true },
      });
      if (user?.google_id) {
        return {
          hasGoogleAccount: true,
          googleEmail: user.google_email,
        };
      }
    }

    if (email) {
      const user = await this.prisma.users.findFirst({
        where: {
          OR: [{ email }, { google_email: email }],
        },
        select: { google_id: true, google_email: true, phone: true },
      });
      if (user?.google_id) {
        return {
          hasGoogleAccount: true,
          googleEmail: user.google_email,
          phone: user.phone,
        };
      }
    }

    return { hasGoogleAccount: false };
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

      try {
        const tokens = this.generateTokens(user.id, user.phone, user.role);

        return {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };
      } catch (error) {
        console.error('[Redis] Failed to generate tokens:', error.message);
        throw new InternalServerErrorException(
          'Failed to refresh token. Please try again.',
        );
      }
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Generate JWT tokens
   */
  private generateTokens(userId: string, phone: string, role: string) {
    try {
      const payload = { sub: userId, phone, role };

      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_EXPIRATION',
          '15m',
        ) as any,
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION',
          '7d',
        ) as any,
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('[Redis] Failed to generate tokens:', error.message);
      throw new InternalServerErrorException(
        'Failed to generate tokens. Please try again.',
      );
    }
  }

  /**
   * Generate 6-digit OTP
   */
  private generateOTP(): string {
    try {
      const length = this.configService.get<number>('OTP_LENGTH', 6);
      return Math.floor(Math.random() * Math.pow(10, length))
        .toString()
        .padStart(length, '0');
    } catch (error) {
      console.error('[Redis] Failed to generate OTP:', error.message);
      throw new InternalServerErrorException(
        'Failed to generate OTP. Please try again.',
      );
    }
  }
}
