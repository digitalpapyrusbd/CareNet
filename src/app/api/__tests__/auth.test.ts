import { NextRequest } from 'next/server';
import { POST as loginHandler } from '../auth/login/route';
import { POST as registerHandler } from '../auth/register/route';
import { PrismaClient, UserRole } from '@prisma/client';

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

// Mock bcrypt - create a simple mock since the module isn't installed
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
  genSalt: jest.fn(),
}));

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    caregiver: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
  UserRole: {
    COMPANY: 'COMPANY',
    CAREGIVER: 'CAREGIVER',
    GUARDIAN: 'GUARDIAN',
    PATIENT: 'PATIENT',
    SUPER_ADMIN: 'SUPER_ADMIN',
    MODERATOR: 'MODERATOR',
  },
}));

describe('Authentication API', () => {
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  describe('POST /api/auth/login', () => {
    it('returns error for missing credentials', async () => {
      const request = {
        json: jest.fn().mockResolvedValue({}),
      } as unknown as NextRequest;

      const response = await loginHandler(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toBe('Missing required fields');
    });

    it('returns error for invalid phone format', async () => {
      const request = {
        json: jest.fn().mockResolvedValue({
          phone: 'invalid',
          password: 'password123',
        }),
      } as unknown as NextRequest;

      const response = await loginHandler(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toContain('Invalid phone number format');
    });

    it('returns error for user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const request = {
        json: jest.fn().mockResolvedValue({
          phone: '+8801712345678',
          password: 'password123',
        }),
      } as unknown as NextRequest;

      const response = await loginHandler(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid credentials');
    });

    it('returns error for incorrect password', async () => {
      const mockUser = {
        id: '1',
        phone: '+8801712345678',
        password: 'hashedpassword',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Mock bcrypt.compare to return false
      const bcrypt = require('bcrypt');
      bcrypt.compare.mockResolvedValue(false);

      const request = {
        json: jest.fn().mockResolvedValue({
          phone: '+8801712345678',
          password: 'wrongpassword',
        }),
      } as unknown as NextRequest;

      const response = await loginHandler(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid credentials');
    });

    it('returns success for valid credentials', async () => {
      const mockUser = {
        id: '1',
        phone: '+8801712345678',
        password: 'hashedpassword',
        isActive: true,
        role: 'GUARDIAN',
        name: 'Test User',
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Mock bcrypt.compare to return true
      const bcrypt = require('bcrypt');
      bcrypt.compare.mockResolvedValue(true);

      // Mock jwt.sign
      const jsonwebtoken = require('jsonwebtoken');
      jsonwebtoken.sign.mockReturnValue('mock-access-token');

      const request = {
        json: jest.fn().mockResolvedValue({
          phone: '+8801712345678',
          password: 'correctpassword',
        }),
      } as unknown as NextRequest;

      const response = await loginHandler(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data.accessToken).toBe('mock-access-token');
    });
  });

  describe('POST /api/auth/register', () => {
    it('returns error for missing fields', async () => {
      const request = {
        json: jest.fn().mockResolvedValue({}),
      } as unknown as NextRequest;

      const response = await registerHandler(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toBe('Missing required fields');
    });

    it('returns error for invalid phone format', async () => {
      const request = {
        json: jest.fn().mockResolvedValue({
          phone: 'invalid',
          password: 'password123',
          name: 'Test User',
          role: 'GUARDIAN',
        }),
      } as unknown as NextRequest;

      const response = await registerHandler(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toContain('Invalid phone number format');
    });

    it('returns error for weak password', async () => {
      const request = {
        json: jest.fn().mockResolvedValue({
          phone: '+8801712345678',
          password: '123',
          name: 'Test User',
          role: 'GUARDIAN',
        }),
      } as unknown as NextRequest;

      const response = await registerHandler(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toContain('Password must be at least 8 characters');
    });

    it('creates user successfully with valid data', async () => {
      const mockUser = {
        id: '1',
        phone: '+8801712345678',
        name: 'Test User',
        role: 'GUARDIAN',
        isActive: true,
      };

      mockPrisma.user.create.mockResolvedValue(mockUser);

      // Mock bcrypt.hash
      const bcrypt = require('bcrypt');
      bcrypt.hash.mockResolvedValue('hashedpassword');
      bcrypt.genSalt.mockReturnValue('salt');

      // Mock jwt.sign
      const jsonwebtoken = require('jsonwebtoken');
      jsonwebtoken.sign.mockReturnValue('mock-access-token');

      const request = {
        json: jest.fn().mockResolvedValue({
          phone: '+8801712345678',
          password: 'strongpassword123',
          name: 'Test User',
          role: 'GUARDIAN',
        }),
      } as unknown as NextRequest;

      const response = await registerHandler(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data.accessToken).toBe('mock-access-token');
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          phone: '+8801712345678',
          name: 'Test User',
          role: 'GUARDIAN',
          password: 'hashedpassword',
        }),
      });
    });
  });
});