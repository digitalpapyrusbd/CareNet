import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentStatus, PaymentMethod } from '@prisma/client';

const mockPrismaService = {
  jobs: {
    findUnique: jest.fn(),
  },
  payments: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  escrows: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    const createDto = {
      job_id: 'job1',
      amount: 1000,
      method: PaymentMethod.CARD,
    };
    const userId = 'user1';

    it('should create payment and escrow if job exists and user is authorized', async () => {
      mockPrismaService.jobs.findUnique.mockResolvedValue({
        id: 'job1',
        guardian_id: userId,
      });
      mockPrismaService.payments.create.mockResolvedValue({
        id: 'pay1',
        ...createDto,
        status: PaymentStatus.PENDING,
      });
      mockPrismaService.escrows.create.mockResolvedValue({
        id: 'esc1',
        status: 'HELD',
      });

      const result = await service.createPayment(userId, createDto);

      expect(result.id).toBe('pay1');
      expect(prisma.payments.create).toHaveBeenCalled();
      expect(prisma.escrows.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if job does not exist', async () => {
      mockPrismaService.jobs.findUnique.mockResolvedValue(null);

      await expect(service.createPayment(userId, createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if user is not the guardian', async () => {
      mockPrismaService.jobs.findUnique.mockResolvedValue({
        id: 'job1',
        guardian_id: 'other-user',
      });

      await expect(service.createPayment(userId, createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('processPayment', () => {
    const processDto = {
      payment_id: 'pay1',
      gateway_response: {},
    };

    it('should update payment status to COMPLETED', async () => {
      mockPrismaService.payments.findUnique.mockResolvedValue({
        id: 'pay1',
        status: PaymentStatus.PENDING,
      });
      mockPrismaService.payments.update.mockResolvedValue({
        id: 'pay1',
        status: PaymentStatus.COMPLETED,
      });

      const result = await service.processPayment(processDto);

      expect(result.status).toBe(PaymentStatus.COMPLETED);
      expect(prisma.payments.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if payment does not exist', async () => {
      mockPrismaService.payments.findUnique.mockResolvedValue(null);

      await expect(service.processPayment(processDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('refundPayment', () => {
    const refundDto = {
      amount: 500,
      reason: 'Returned service',
    };

    it('should refund payment if status is COMPLETED', async () => {
      mockPrismaService.payments.findUnique.mockResolvedValue({
        id: 'pay1',
        status: PaymentStatus.COMPLETED,
      });
      mockPrismaService.payments.update.mockResolvedValue({
        id: 'pay1',
        status: PaymentStatus.REFUNDED,
      });

      const result = await service.refundPayment('pay1', refundDto);

      expect(result.status).toBe(PaymentStatus.REFUNDED);
    });

    it('should throw BadRequestException if payment is not COMPLETED', async () => {
      mockPrismaService.payments.findUnique.mockResolvedValue({
        id: 'pay1',
        status: PaymentStatus.PENDING,
      });

      await expect(service.refundPayment('pay1', refundDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('releaseEscrow', () => {
    it('should release escrow if found', async () => {
      mockPrismaService.escrows.findUnique.mockResolvedValue({
        id: 'esc1',
        payment_id: 'pay1',
        status: 'HELD',
      });
      mockPrismaService.escrows.update.mockResolvedValue({
        id: 'esc1',
        status: 'RELEASED',
      });

      const result = await service.releaseEscrow('pay1');

      expect(result.status).toBe('RELEASED');
    });

    it('should throw NotFoundException if escrow not found', async () => {
      mockPrismaService.escrows.findUnique.mockResolvedValue(null);

      await expect(service.releaseEscrow('pay1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
