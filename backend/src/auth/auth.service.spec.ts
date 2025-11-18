import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    users: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    verification_codes: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password with bcrypt', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await service.hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for matching password', async () => {
      const password = 'testPassword123';
      const hash = 'hashedPassword123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.verifyPassword(password, hash);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('should return false for non-matching password', async () => {
      const password = 'wrongPassword';
      const hash = 'hashedPassword123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.verifyPassword(password, hash);

      expect(result).toBe(false);
    });
  });

  describe('generateAccessToken', () => {
    it('should generate access token with correct payload', () => {
      const payload = {
        userId: 'user-123',
        role: UserRole.CAREGIVER,
        phone: '+1234567890',
        email: 'test@example.com',
        name: 'John Doe',
      };
      const token = 'access-token-123';
      mockJwtService.sign.mockReturnValue(token);

      const result = service.generateAccessToken(payload);

      expect(result).toBe(token);
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
        expiresIn: '30d',
      });
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token with userId and role only', () => {
      const payload = { userId: 'user-123', role: UserRole.CAREGIVER };
      const token = 'refresh-token-123';
      mockJwtService.sign.mockReturnValue(token);

      const result = service.generateRefreshToken(payload);

      expect(result).toBe(token);
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      });
    });
  });

  describe('generateTokenPair', () => {
    it('should generate both access and refresh tokens', () => {
      const payload = {
        userId: 'user-123',
        role: UserRole.CAREGIVER,
        phone: '+1234567890',
        email: 'test@example.com',
        name: 'John Doe',
      };
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-123';

      mockJwtService.sign
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      const result = service.generateTokenPair(payload);

      expect(result).toEqual({ accessToken, refreshToken });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const phone = '+1234567890';
      const password = 'testPassword123';
      const mockUser = {
        id: 'user-123',
        phone,
        password_hash: 'hashedPassword',
        name: 'John Doe',
        email: 'test@example.com',
        role: UserRole.CAREGIVER,
        is_active: true,
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(phone, password);

      expect(result).toEqual({
        id: 'user-123',
        phone,
        name: 'John Doe',
        email: 'test@example.com',
        role: UserRole.CAREGIVER,
        is_active: true,
      });
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { phone },
      });
    });

    it('should return null when user does not exist', async () => {
      const phone = '+1234567890';
      const password = 'testPassword123';

      mockPrismaService.users.findUnique.mockResolvedValue(null);

      const result = await service.validateUser(phone, password);

      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const phone = '+1234567890';
      const password = 'wrongPassword';
      const mockUser = {
        id: 'user-123',
        phone,
        password_hash: 'hashedPassword',
        name: 'John Doe',
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(phone, password);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return user and tokens when credentials are valid', async () => {
      const phone = '+1234567890';
      const password = 'testPassword123';
      const mockUser = {
        id: 'user-123',
        phone,
        password_hash: 'hashedPassword',
        name: 'John Doe',
        email: 'test@example.com',
        role: UserRole.CAREGIVER,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');
      mockPrismaService.users.update.mockResolvedValue(mockUser);

      const result = await service.login(phone, password);

      expect(result).toEqual({
        user: expect.objectContaining({
          id: 'user-123',
          phone,
          name: 'John Doe',
        }),
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      });
      expect(mockPrismaService.users.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { last_login_at: expect.any(Date) },
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const phone = '+1234567890';
      const password = 'wrongPassword';

      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(service.login(phone, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(phone, password)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException when account is deactivated', async () => {
      const phone = '+1234567890';
      const password = 'testPassword123';
      const mockUser = {
        id: 'user-123',
        phone,
        password_hash: 'hashedPassword',
        name: 'John Doe',
        role: UserRole.CAREGIVER,
        is_active: false,
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.login(phone, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(phone, password)).rejects.toThrow(
        'Account is deactivated',
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new token pair when refresh token is valid', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockPayload = { userId: 'user-123', role: UserRole.CAREGIVER };
      const mockUser = {
        id: 'user-123',
        phone: '+1234567890',
        name: 'John Doe',
        email: 'test@example.com',
        role: UserRole.CAREGIVER,
        is_active: true,
      };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');

      const result = await service.refreshToken(refreshToken);

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      expect(mockJwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockPayload = { userId: 'user-123', role: UserRole.CAREGIVER };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockPayload = { userId: 'user-123', role: UserRole.CAREGIVER };
      const mockUser = {
        id: 'user-123',
        is_active: false,
      };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should create user and return user with tokens when phone is unique', async () => {
      const userData = {
        phone: '+1234567890',
        password: 'testPassword123',
        name: 'John Doe',
        email: 'test@example.com',
        role: UserRole.CAREGIVER,
      };
      const hashedPassword = 'hashedPassword123';
      const mockCreatedUser = {
        id: 'user-123',
        phone: userData.phone,
        password_hash: hashedPassword,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        is_active: true,
        kyc_status: 'PENDING',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaService.users.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.users.create.mockResolvedValue(mockCreatedUser);
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.register(userData);

      expect(result).toEqual({
        user: expect.objectContaining({
          id: 'user-123',
          phone: userData.phone,
          name: userData.name,
        }),
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      });
      expect(result.user).not.toHaveProperty('password_hash');
      expect(mockPrismaService.users.create).toHaveBeenCalledWith({
        data: {
          phone: userData.phone,
          password_hash: hashedPassword,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          is_active: true,
          kyc_status: 'PENDING',
        },
      });
    });

    it('should throw UnauthorizedException when phone number already exists', async () => {
      const userData = {
        phone: '+1234567890',
        password: 'testPassword123',
        name: 'John Doe',
        role: UserRole.CAREGIVER,
      };
      const existingUser = {
        id: 'existing-user',
        phone: userData.phone,
      };

      mockPrismaService.users.findUnique.mockResolvedValue(existingUser);

      await expect(service.register(userData)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.register(userData)).rejects.toThrow(
        'User with this phone number already exists',
      );
      expect(mockPrismaService.users.create).not.toHaveBeenCalled();
    });

    it('should handle registration without email', async () => {
      const userData = {
        phone: '+1234567890',
        password: 'testPassword123',
        name: 'John Doe',
        role: UserRole.CLIENT,
      };
      const hashedPassword = 'hashedPassword123';
      const mockCreatedUser = {
        id: 'user-123',
        phone: userData.phone,
        password_hash: hashedPassword,
        name: userData.name,
        email: null,
        role: userData.role,
        is_active: true,
        kyc_status: 'PENDING',
      };

      mockPrismaService.users.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.users.create.mockResolvedValue(mockCreatedUser);
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.register(userData);

      // Email is null in the database, which gets returned as null (not undefined)
      expect(result.user.email).toBeNull();
    });
  });

  describe('generateOTP', () => {
    it('should generate 6-digit OTP and store in database', async () => {
      const phone = '+1234567890';
      const mockVerificationCode = {
        id: 'code-123',
        userId: phone,
        code: '123456',
        type: 'OTP',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        isUsed: false,
      };

      mockPrismaService.verification_codes.create.mockResolvedValue(
        mockVerificationCode,
      );

      const result = await service.generateOTP(phone);

      expect(result).toMatch(/^\d{6}$/); // Should be 6 digits
      expect(mockPrismaService.verification_codes.create).toHaveBeenCalledWith({
        data: {
          userId: phone,
          code: expect.stringMatching(/^\d{6}$/),
          type: 'OTP',
          expiresAt: expect.any(Date),
          isUsed: false,
        },
      });
    });

    it('should generate OTP with 10 minute expiration', async () => {
      const phone = '+1234567890';

      mockPrismaService.verification_codes.create.mockImplementation((args) => {
        const expiresAt = args.data.expiresAt as Date;
        const now = new Date();
        const diffMinutes = (expiresAt.getTime() - now.getTime()) / 60000;
        
        expect(diffMinutes).toBeCloseTo(10, 0);
        return Promise.resolve({ id: 'code-123' } as any);
      });

      await service.generateOTP(phone);
    });
  });

  describe('verifyOTP', () => {
    it('should return true and mark OTP as used when valid', async () => {
      const phone = '+1234567890';
      const otp = '123456';
      const mockVerificationCode = {
        id: 'code-123',
        userId: phone,
        code: otp,
        type: 'OTP',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        isUsed: false,
      };

      mockPrismaService.verification_codes.findFirst.mockResolvedValue(
        mockVerificationCode,
      );
      mockPrismaService.verification_codes.update.mockResolvedValue({
        ...mockVerificationCode,
        isUsed: true,
      });

      const result = await service.verifyOTP(phone, otp);

      expect(result).toBe(true);
      expect(mockPrismaService.verification_codes.update).toHaveBeenCalledWith({
        where: { id: 'code-123' },
        data: {
          isUsed: true,
          usedAt: expect.any(Date),
        },
      });
    });

    it('should return false when OTP does not exist', async () => {
      const phone = '+1234567890';
      const otp = '123456';

      mockPrismaService.verification_codes.findFirst.mockResolvedValue(null);

      const result = await service.verifyOTP(phone, otp);

      expect(result).toBe(false);
      expect(mockPrismaService.verification_codes.update).not.toHaveBeenCalled();
    });

    it('should return false when OTP is expired', async () => {
      const phone = '+1234567890';
      const otp = '123456';

      mockPrismaService.verification_codes.findFirst.mockResolvedValue(null);

      const result = await service.verifyOTP(phone, otp);

      expect(result).toBe(false);
    });

    it('should return false when OTP is already used', async () => {
      const phone = '+1234567890';
      const otp = '123456';

      mockPrismaService.verification_codes.findFirst.mockResolvedValue(null);

      const result = await service.verifyOTP(phone, otp);

      expect(result).toBe(false);
    });

    it('should verify OTP with correct query parameters', async () => {
      const phone = '+1234567890';
      const otp = '123456';

      mockPrismaService.verification_codes.findFirst.mockResolvedValue(null);

      await service.verifyOTP(phone, otp);

      expect(
        mockPrismaService.verification_codes.findFirst,
      ).toHaveBeenCalledWith({
        where: {
          userId: phone,
          code: otp,
          type: 'OTP',
          isUsed: false,
          expiresAt: {
            gte: expect.any(Date),
          },
        },
      });
    });
  });
});
