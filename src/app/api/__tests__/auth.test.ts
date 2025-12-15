import { NextRequest, NextResponse } from 'next/server';
import { POST as loginHandler } from '../auth/login/route';
import { POST as registerHandler } from '../auth/register/route';
import { PrismaClient, UserRole } from '@prisma/client';

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

// Mock bcryptjs (the actual package used)
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
  genSalt: jest.fn(),
}));

// Mock @/lib/auth
jest.mock('@/lib/auth', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

// Mock @/lib/session to avoid @vercel/kv dependency
jest.mock('@/lib/session', () => ({
  createSession: jest.fn().mockResolvedValue({
    id: 'mock-session-id',
    userId: 'mock-user-id',
    userRole: 'GUARDIAN',
    phone: '+8801712345678',
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    active: true,
    mfaVerified: true,
  }),
  getSession: jest.fn(),
  updateSessionActivity: jest.fn(),
  verifySessionMFA: jest.fn(),
  deactivateSession: jest.fn(),
  deleteSession: jest.fn(),
  getUserSessions: jest.fn(),
  deleteUserSessions: jest.fn(),
  cleanupExpiredSessions: jest.fn(),
  getSessionStats: jest.fn(),
  extendSession: jest.fn(),
  sessionRequiresMFA: jest.fn(),
  createMFASession: jest.fn(),
  validateSession: jest.fn(),
  createSessionCookie: jest.fn(),
  clearSessionCookie: jest.fn(),
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

// Helper to create NextRequest mock
function createMockRequest(body: any, headers: Record<string, string> = {}): NextRequest {
  return {
    json: jest.fn().mockResolvedValue(body),
    headers: new Headers(headers),
    method: 'POST',
    url: 'http://localhost:3000/api/auth',
  } as unknown as NextRequest;
}

describe('Authentication API', () => {
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  describe('POST /api/auth/login', () => {
    it('returns error for missing credentials', async () => {
      const request = createMockRequest({});

      const response = await loginHandler(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toBe('Missing required fields');
    });

    it('returns error for invalid phone format', async () => {
      const request = createMockRequest({
        phone: 'invalid',
        password: 'password123',
      });

      const response = await loginHandler(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toContain('Invalid phone number format');
    });

    it('returns error for user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const request = createMockRequest({
        phone: '+8801712345678',
        password: 'password123',
      });

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
      const { comparePassword } = require('@/lib/auth');
      comparePassword.mockResolvedValue(false);

      const request = createMockRequest({
        phone: '+8801712345678',
        password: 'wrongpassword',
      });

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
      const { comparePassword } = require('@/lib/auth');
      comparePassword.mockResolvedValue(true);

      // Mock jwt.sign
      const jsonwebtoken = require('jsonwebtoken');
      jsonwebtoken.sign.mockReturnValue('mock-access-token');

      const request = createMockRequest({
        phone: '+8801712345678',
        password: 'correctpassword',
      });

      const response = await loginHandler(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data.accessToken).toBe('mock-access-token');
    });
  });

  describe('POST /api/auth/register', () => {
    it('returns error for missing fields', async () => {
      const request = createMockRequest({});

      const response = await registerHandler(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toBe('Missing required fields');
    });

    it('returns error for invalid phone format', async () => {
      const request = createMockRequest({
        phone: 'invalid',
        password: 'password123',
        name: 'Test User',
        role: 'GUARDIAN',
      });

      const response = await registerHandler(request);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toContain('Invalid phone number format');
    });

    it('returns error for weak password', async () => {
      const request = createMockRequest({
        phone: '+8801712345678',
        password: '123',
        name: 'Test User',
        role: 'GUARDIAN',
      });

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

      // Mock password hashing
      const { hashPassword } = require('@/lib/auth');
      hashPassword.mockResolvedValue('hashedpassword');

      // Mock jwt.sign
      const jsonwebtoken = require('jsonwebtoken');
      jsonwebtoken.sign.mockReturnValue('mock-access-token');

      const request = createMockRequest({
        phone: '+8801712345678',
        password: 'strongpassword123',
        name: 'Test User',
        role: 'GUARDIAN',
      });

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