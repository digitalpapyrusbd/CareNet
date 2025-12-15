import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock IORedis
const mockRedis = {
  setex: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
};

jest.mock('ioredis', () => {
  return {
    __esModule: true,
    Redis: jest.fn(() => mockRedis),
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockPrismaService = {
    users: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mock_token'),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key) => {
      if (key === 'REDIS_HOST') return 'localhost';
      if (key === 'REDIS_PORT') return 6379;
      if (key === 'JWT_SECRET') return 'test_secret';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      phone: '1234567890',
      password: 'password123',
      name: 'Test User',
      role: 'CAREGIVER' as any,
    };

    it('should throw ConflictException if user already exists', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing',
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should generate OTP and return success message', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pw');

      const result = await service.register(registerDto);

      expect(result.phone).toBe(registerDto.phone);
      expect(result.message).toBeDefined();
      expect(mockRedis.setex).toHaveBeenCalled();
    });
  });

  describe('verifyOtp', () => {
    const verifyDto = {
      phone: '1234567890',
      code: '123456',
    };

    const mockUserData = {
      phone: '1234567890',
      password_hash: 'hashed',
      name: 'Test',
      role: 'CAREGIVER',
    };

    it('should throw BadRequestException if OTP is invalid', async () => {
      // Mock return value directly
      mockRedis.get.mockResolvedValue('wrong_code');

      await expect(service.verifyOtp(verifyDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create user and return tokens if OTP is valid', async () => {
      mockRedis.get.mockImplementation(async (key: string) => {
        if (key.includes('otp')) return verifyDto.code;
        if (key.includes('registration')) return JSON.stringify(mockUserData);
        return null;
      });

      (prisma.users.create as jest.Mock).mockResolvedValue({
        id: 'new_id',
        ...mockUserData,
      });

      const result = await service.verifyOtp(verifyDto);

      expect(prisma.users.create).toHaveBeenCalled();
      // result is { user, access_token... } but we need to check properties
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('login', () => {
    const loginDto = {
      phone: '1234567890',
      password: 'password123',
    };

    const mockUser = {
      id: 'u1',
      phone: '1234567890',
      password_hash: 'hashed_pw',
      is_active: true,
      role: 'CAREGIVER',
    };

    it('should throw UnauthorizedException if user not found', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password invalid', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return tokens if login successful', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = (await service.login(loginDto)) as any;

      expect(result.access_token).toBeDefined();
      expect(result.user.id).toBe(mockUser.id);
    });
  });
});
