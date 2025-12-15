import { NextRequest, NextResponse } from 'next/server';
import { POST as bkashPaymentHandler } from '../payments/bkash/route';
import { POST as nagadPaymentHandler } from '../payments/nagad/route';
import { POST as createPaymentHandler } from '../payments/create/route';
import { PrismaClient } from '@prisma/client';
import { UserRole } from '@/lib/auth';

// Define mock first
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
  },
  job: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  payment: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
  company: {
    findUnique: jest.fn(),
  },
  $disconnect: jest.fn(),
};

// Mock payment gateways
jest.mock('@/lib/payment-gateways/bkash', () => ({
  BkashPaymentGateway: jest.fn().mockImplementation(() => ({
    isEnvironmentValid: jest.fn().mockReturnValue(true),
    createPayment: jest.fn().mockResolvedValue({
      paymentID: 'bkash_test_id',
      transactionStatus: 'Completed',
      amount: '1000',
      currency: 'BDT',
    }),
  })),
}));

jest.mock('@/lib/payment-gateways/nagad', () => ({
  NagadPaymentGateway: jest.fn().mockImplementation(() => ({
    isEnvironmentValid: jest.fn().mockReturnValue(true),
    createPayment: jest.fn().mockResolvedValue({
      order_id: 'nagad_test_id',
      payment_ref_id: 'nagad_ref_id',
      transaction_status: 'Success',
      amount: '1000',
      currency: 'BDT',
    }),
  })),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn().mockReturnValue({ userId: 'user1', role: 'GUARDIAN' }),
}));

// Mock @/lib/session
jest.mock('@/lib/session', () => ({
  createSession: jest.fn(),
  getSession: jest.fn(),
  validateSession: jest.fn().mockResolvedValue({ 
    valid: true, 
    session: { userId: 'user1', userRole: 'GUARDIAN' } 
  }),
}));

// Helper to create NextRequest mock with user from middleware
function createMockRequest(body: any, user: any = { id: 'user1', role: 'GUARDIAN' }): NextRequest {
  return {
    json: jest.fn().mockResolvedValue(body),
    headers: new Headers({ 'Authorization': 'Bearer mock-token' }),
    method: 'POST',
    url: 'http://localhost:3000/api/payments',
    user,
  } as any;
}

describe('Payments API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/payments/bkash', () => {
    it('processes bKash payment successfully', async () => {
      const mockUser = {
        id: 'user1',
        role: 'GUARDIAN',
        name: 'Test User',
        phone: '+8801712345678',
        email: 'test@example.com',
      };

      const mockJob = {
        id: 'job1',
        guardian: { id: 'user1' },
        company: { id: 'company1' },
        status: 'PENDING_ASSIGNMENT',
      };

      const mockPayment = {
        id: 'payment1',
        jobId: 'job1',
        payerId: 'user1',
        amount: 1000,
        status: 'COMPLETED',
        invoiceNumber: 'INV_test123',
      };

      // Mock user from middleware
      const mockRequest = createMockRequest(
        {
          jobId: 'job1',
          amount: 1000,
        },
        mockUser
      );

      mockPrismaClient.job.findUnique.mockResolvedValue(mockJob);
      mockPrismaClient.payment.create.mockResolvedValue(mockPayment);
      mockPrismaClient.payment.update.mockResolvedValue(mockPayment);

      const response = await bkashPaymentHandler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Payment completed successfully');
    });

    it('returns error for missing fields', async () => {
      const mockRequest = createMockRequest({}, { id: 'user1', role: UserRole.GUARDIAN });

      const response = await bkashPaymentHandler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Missing required fields: jobId, amount');
    });

    it('returns error for invalid job', async () => {
      const mockRequest = createMockRequest(
        {
          jobId: 'invalid_job',
          amount: 1000,
        },
        { id: 'user1', role: UserRole.GUARDIAN }
      );

      mockPrismaClient.job.findUnique.mockResolvedValue(null);

      const response = await bkashPaymentHandler(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid job ID');
    });
  });

  describe('POST /api/payments/nagad', () => {
    it('processes Nagad payment successfully', async () => {
      const mockUser = {
        id: 'user1',
        role: 'GUARDIAN',
        name: 'Test User',
        phone: '+8801712345678',
        email: 'test@example.com',
      };

      const mockJob = {
        id: 'job1',
        guardian: { id: 'user1' },
        company: { id: 'company1' },
        status: 'PENDING_ASSIGNMENT',
      };

      const mockPayment = {
        id: 'payment1',
        jobId: 'job1',
        payerId: 'user1',
        amount: 1000,
        status: 'COMPLETED',
        invoiceNumber: 'INV_test123',
      };

      const mockRequest = createMockRequest(
        {
          jobId: 'job1',
          amount: 1000,
        },
        mockUser
      );

      mockPrismaClient.job.findUnique.mockResolvedValue(mockJob);
      mockPrismaClient.payment.create.mockResolvedValue(mockPayment);
      mockPrismaClient.payment.update.mockResolvedValue(mockPayment);

      const response = await nagadPaymentHandler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Payment completed successfully');
    });
  });

  describe('POST /api/payments/create', () => {
    it('creates payment with valid data', async () => {
      const mockUser = {
        id: 'user1',
        role: 'GUARDIAN',
      };

      const mockPayment = {
        id: 'payment1',
        payerId: 'user1',
        amount: 1000,
        method: 'BKASH',
        status: 'PENDING',
        transactionId: 'TEMP_test123',
        invoiceNumber: 'INV_test123',
      };

      const mockRequest = createMockRequest(
        {
          amount: 1000,
          method: 'BKASH',
          jobId: 'job1',
          customerInfo: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+8801712345678',
          },
        },
        mockUser
      );

      mockPrismaClient.payment.create.mockResolvedValue(mockPayment);
      mockPrismaClient.payment.update.mockResolvedValue(mockPayment);

      const response = await createPaymentHandler(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.payment.status).toBe('PENDING');
    });

    it('returns error for invalid payment method', async () => {
      const mockUser = {
        id: 'user1',
        role: 'GUARDIAN',
      };

      const mockRequest = createMockRequest(
        {
          amount: 1000,
          method: 'INVALID_METHOD',
          customerInfo: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+8801712345678',
          },
        },
        mockUser
      );

      const response = await createPaymentHandler(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });
});