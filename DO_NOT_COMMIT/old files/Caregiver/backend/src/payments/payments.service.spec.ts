import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { BkashService } from './providers/bkash.service';
import { NagadService } from './providers/nagad.service';
import { EscrowService } from './escrow/escrow.service';
import { PrismaService } from '../common/prisma/prisma.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let bkashService: BkashService;
  let nagadService: NagadService;
  let escrowService: EscrowService;
  let prismaService: PrismaService;

  const mockBkashService = {
    createCheckout: jest.fn(),
    verifyPayment: jest.fn(),
    getTransaction: jest.fn(),
    listTransactions: jest.fn(),
  };

  const mockNagadService = {
    createCheckout: jest.fn(),
    verifyPayment: jest.fn(),
    getTransaction: jest.fn(),
    listTransactions: jest.fn(),
  };

  const mockEscrowService = {
    holdFunds: jest.fn(),
    releaseEscrow: jest.fn(),
    refundEscrow: jest.fn(),
    getEscrow: jest.fn(),
    listEscrows: jest.fn(),
  };

  const mockPrismaService = {
    provider_transactions: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    transaction_logs: {
      create: jest.fn(),
    },
    escrow_records: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    escrow_ledger: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: BkashService,
          useValue: mockBkashService,
        },
        {
          provide: NagadService,
          useValue: mockNagadService,
        },
        {
          provide: EscrowService,
          useValue: mockEscrowService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    bkashService = module.get<BkashService>(BkashService);
    nagadService = module.get<NagadService>(NagadService);
    escrowService = module.get<EscrowService>(EscrowService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create payment with bKash provider', async () => {
      const dto = {
        provider: 'bkash' as const,
        amount: 1000,
        currency: 'BDT',
        reference: 'order-123',
      };

      const mockResponse = {
        checkoutUrl: 'https://sandbox.bkash.com/checkout/bk_123',
        transactionId: 'bk_123',
        amount: 1000,
        currency: 'BDT',
        reference: 'order-123',
        escrowId: 'escrow-123',
      };

      mockBkashService.createCheckout.mockResolvedValue(mockResponse);

      const result = await service.createPayment(dto);

      expect(result).toEqual(mockResponse);
      expect(mockBkashService.createCheckout).toHaveBeenCalledWith({
        amount: 1000,
        currency: 'BDT',
        reference: 'order-123',
      });
      expect(mockNagadService.createCheckout).not.toHaveBeenCalled();
    });

    it('should create payment with Nagad provider', async () => {
      const dto = {
        provider: 'nagad' as const,
        amount: 2000,
        currency: 'BDT',
        reference: 'order-456',
      };

      const mockResponse = {
        checkoutUrl: 'https://sandbox.nagad.com/checkout/ng_456',
        transactionId: 'ng_456',
        amount: 2000,
        currency: 'BDT',
        reference: 'order-456',
        escrowId: 'escrow-456',
      };

      mockNagadService.createCheckout.mockResolvedValue(mockResponse);

      const result = await service.createPayment(dto);

      expect(result).toEqual(mockResponse);
      expect(mockNagadService.createCheckout).toHaveBeenCalledWith({
        amount: 2000,
        currency: 'BDT',
        reference: 'order-456',
      });
      expect(mockBkashService.createCheckout).not.toHaveBeenCalled();
    });

    it('should throw error for invalid payment provider', async () => {
      const dto = {
        provider: 'stripe' as any,
        amount: 1000,
      };

      await expect(service.createPayment(dto)).rejects.toThrow(
        'Invalid payment provider',
      );
    });

    it('should handle payment creation without optional fields', async () => {
      const dto = {
        provider: 'bkash' as const,
        amount: 500,
      };

      const mockResponse = {
        checkoutUrl: 'https://sandbox.bkash.com/checkout/bk_789',
        transactionId: 'bk_789',
        amount: 500,
        currency: 'BDT',
        escrowId: 'escrow-789',
      };

      mockBkashService.createCheckout.mockResolvedValue(mockResponse);

      const result = await service.createPayment(dto);

      expect(result).toEqual(mockResponse);
      expect(mockBkashService.createCheckout).toHaveBeenCalledWith({
        amount: 500,
        currency: undefined,
        reference: undefined,
      });
    });
  });

  describe('verifyPayment', () => {
    it('should verify payment with bKash provider', async () => {
      const transactionId = 'bk_123';
      const mockVerification = {
        transactionId: 'bk_123',
        status: 'COMPLETED',
        amount: 1000,
        verified: true,
      };

      mockBkashService.verifyPayment.mockResolvedValue(mockVerification);

      const result = await service.verifyPayment('bkash', transactionId);

      expect(result).toEqual(mockVerification);
      expect(mockBkashService.verifyPayment).toHaveBeenCalledWith(
        transactionId,
      );
      expect(mockNagadService.verifyPayment).not.toHaveBeenCalled();
    });

    it('should verify payment with Nagad provider', async () => {
      const transactionId = 'ng_456';
      const mockVerification = {
        transactionId: 'ng_456',
        status: 'COMPLETED',
        amount: 2000,
        verified: true,
      };

      mockNagadService.verifyPayment.mockResolvedValue(mockVerification);

      const result = await service.verifyPayment('nagad', transactionId);

      expect(result).toEqual(mockVerification);
      expect(mockNagadService.verifyPayment).toHaveBeenCalledWith(
        transactionId,
      );
      expect(mockBkashService.verifyPayment).not.toHaveBeenCalled();
    });

    it('should throw error for invalid provider during verification', async () => {
      await expect(
        service.verifyPayment('stripe' as any, 'tx_123'),
      ).rejects.toThrow('Invalid payment provider');
    });
  });

  describe('getTransaction', () => {
    it('should return bKash transaction if found', async () => {
      const transactionId = 'bk_123';
      const mockTransaction = {
        id: 'tx_1',
        provider_tx_id: transactionId,
        status: 'COMPLETED',
        amount: 1000,
        currency: 'BDT',
        created_at: new Date(),
      };

      mockBkashService.getTransaction.mockResolvedValue(mockTransaction);

      const result = await service.getTransaction(transactionId);

      expect(result).toEqual({
        ...mockTransaction,
        provider: 'bkash',
      });
      expect(mockBkashService.getTransaction).toHaveBeenCalledWith(
        transactionId,
      );
      expect(mockNagadService.getTransaction).not.toHaveBeenCalled();
    });

    it('should check Nagad if bKash transaction not found', async () => {
      const transactionId = 'ng_456';
      const mockTransaction = {
        id: 'tx_2',
        provider_tx_id: transactionId,
        status: 'COMPLETED',
        amount: 2000,
        currency: 'BDT',
        created_at: new Date(),
      };

      mockBkashService.getTransaction.mockResolvedValue(null);
      mockNagadService.getTransaction.mockResolvedValue(mockTransaction);

      const result = await service.getTransaction(transactionId);

      expect(result).toEqual({
        ...mockTransaction,
        provider: 'nagad',
      });
      expect(mockBkashService.getTransaction).toHaveBeenCalledWith(
        transactionId,
      );
      expect(mockNagadService.getTransaction).toHaveBeenCalledWith(
        transactionId,
      );
    });

    it('should return null if transaction not found in any provider', async () => {
      mockBkashService.getTransaction.mockResolvedValue(null);
      mockNagadService.getTransaction.mockResolvedValue(null);

      const result = await service.getTransaction('unknown_tx');

      expect(result).toBeNull();
      expect(mockBkashService.getTransaction).toHaveBeenCalled();
      expect(mockNagadService.getTransaction).toHaveBeenCalled();
    });
  });

  describe('listTransactions', () => {
    it('should list only bKash transactions when provider specified', async () => {
      const mockBkashTxs = [
        {
          id: 'tx_1',
          provider_tx_id: 'bk_123',
          status: 'COMPLETED',
          created_at: new Date(),
        },
        {
          id: 'tx_2',
          provider_tx_id: 'bk_456',
          status: 'PENDING',
          created_at: new Date(),
        },
      ];

      mockBkashService.listTransactions.mockResolvedValue(mockBkashTxs);

      const result = await service.listTransactions('bkash');

      expect(result).toEqual(mockBkashTxs);
      expect(mockBkashService.listTransactions).toHaveBeenCalled();
      expect(mockNagadService.listTransactions).not.toHaveBeenCalled();
    });

    it('should list only Nagad transactions when provider specified', async () => {
      const mockNagadTxs = [
        {
          id: 'tx_3',
          provider_tx_id: 'ng_789',
          status: 'COMPLETED',
          created_at: new Date(),
        },
      ];

      mockNagadService.listTransactions.mockResolvedValue(mockNagadTxs);

      const result = await service.listTransactions('nagad');

      expect(result).toEqual(mockNagadTxs);
      expect(mockNagadService.listTransactions).toHaveBeenCalled();
      expect(mockBkashService.listTransactions).not.toHaveBeenCalled();
    });

    it('should list all transactions sorted by date when no provider specified', async () => {
      const now = new Date();
      const earlier = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour ago

      const mockBkashTxs = [
        {
          id: 'tx_1',
          provider_tx_id: 'bk_123',
          created_at: earlier,
        },
      ];

      const mockNagadTxs = [
        {
          id: 'tx_2',
          provider_tx_id: 'ng_456',
          created_at: now,
        },
      ];

      mockBkashService.listTransactions.mockResolvedValue(mockBkashTxs);
      mockNagadService.listTransactions.mockResolvedValue(mockNagadTxs);

      const result = await service.listTransactions();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('tx_2'); // Most recent first
      expect(result[1].id).toBe('tx_1');
      expect(mockBkashService.listTransactions).toHaveBeenCalled();
      expect(mockNagadService.listTransactions).toHaveBeenCalled();
    });
  });

  describe('refundPayment', () => {
    it('should process full refund with escrow', async () => {
      const dto = {
        transactionId: 'bk_123',
        reason: 'Customer request',
      };

      const mockTransaction = {
        id: 'tx_1',
        provider_tx_id: 'bk_123',
        status: 'COMPLETED',
        amount: 1000,
        escrow_id: 'escrow_123',
      };

      const mockUpdatedTx = {
        ...mockTransaction,
        status: 'REFUNDED',
      };

      const mockRefundResponse = {
        escrowId: 'escrow_123',
        refundedAmount: 1000,
      };

      mockBkashService.getTransaction.mockResolvedValue(mockTransaction);
      mockNagadService.getTransaction.mockResolvedValue(null);
      mockEscrowService.refundEscrow.mockResolvedValue(mockRefundResponse);
      mockPrismaService.provider_transactions.update.mockResolvedValue(
        mockUpdatedTx,
      );
      mockPrismaService.transaction_logs.create.mockResolvedValue({});

      const result = await service.refundPayment(dto);

      expect(result).toEqual({
        transactionId: 'bk_123',
        refundedAmount: 1000,
        status: 'REFUNDED',
      });

      expect(mockEscrowService.refundEscrow).toHaveBeenCalledWith(
        'escrow_123',
        undefined,
      );
      expect(mockPrismaService.provider_transactions.update).toHaveBeenCalledWith({
        where: { provider_tx_id: 'bk_123' },
        data: { status: 'REFUNDED' },
      });
      expect(mockPrismaService.transaction_logs.create).toHaveBeenCalledWith({
        data: {
          provider_transaction_id: 'tx_1',
          action: 'REFUND',
          previous_status: 'COMPLETED',
          new_status: 'REFUNDED',
          note: 'Customer request',
        },
      });
    });

    it('should process partial refund', async () => {
      const dto = {
        transactionId: 'ng_456',
        amount: 500,
        reason: 'Partial refund',
      };

      const mockTransaction = {
        id: 'tx_2',
        provider_tx_id: 'ng_456',
        status: 'COMPLETED',
        amount: 2000,
        escrow_id: 'escrow_456',
      };

      mockBkashService.getTransaction.mockResolvedValue(null);
      mockNagadService.getTransaction.mockResolvedValue(mockTransaction);
      mockEscrowService.refundEscrow.mockResolvedValue({
        escrowId: 'escrow_456',
        refundedAmount: 500,
      });
      mockPrismaService.provider_transactions.update.mockResolvedValue({});
      mockPrismaService.transaction_logs.create.mockResolvedValue({});

      const result = await service.refundPayment(dto);

      expect(result).toEqual({
        transactionId: 'ng_456',
        refundedAmount: 500,
        status: 'REFUNDED',
      });

      expect(mockEscrowService.refundEscrow).toHaveBeenCalledWith(
        'escrow_456',
        500,
      );
    });

    it('should process refund without escrow', async () => {
      const dto = {
        transactionId: 'bk_789',
        reason: 'No escrow refund',
      };

      const mockTransaction = {
        id: 'tx_3',
        provider_tx_id: 'bk_789',
        status: 'COMPLETED',
        amount: 1500,
        escrow_id: null,
      };

      mockBkashService.getTransaction.mockResolvedValue(mockTransaction);
      mockNagadService.getTransaction.mockResolvedValue(null);
      mockPrismaService.provider_transactions.update.mockResolvedValue({});
      mockPrismaService.transaction_logs.create.mockResolvedValue({});

      const result = await service.refundPayment(dto);

      expect(result).toEqual({
        transactionId: 'bk_789',
        refundedAmount: 1500,
        status: 'REFUNDED',
      });

      expect(mockEscrowService.refundEscrow).not.toHaveBeenCalled();
      expect(mockPrismaService.provider_transactions.update).toHaveBeenCalled();
    });

    it('should throw error when transaction not found for refund', async () => {
      const dto = {
        transactionId: 'unknown_tx',
        reason: 'Test refund',
      };

      mockBkashService.getTransaction.mockResolvedValue(null);
      mockNagadService.getTransaction.mockResolvedValue(null);

      await expect(service.refundPayment(dto)).rejects.toThrow(
        'Transaction not found',
      );

      expect(mockEscrowService.refundEscrow).not.toHaveBeenCalled();
      expect(mockPrismaService.provider_transactions.update).not.toHaveBeenCalled();
    });
  });

  describe('getEscrow', () => {
    it('should get escrow details', async () => {
      const escrowId = 'escrow_123';
      const mockEscrow = {
        id: escrowId,
        amount: 1000,
        status: 'HELD',
        currency: 'BDT',
        created_at: new Date(),
        ledger_entries: [],
      };

      mockEscrowService.getEscrow.mockResolvedValue(mockEscrow);

      const result = await service.getEscrow(escrowId);

      expect(result).toEqual(mockEscrow);
      expect(mockEscrowService.getEscrow).toHaveBeenCalledWith(escrowId);
    });
  });

  describe('listEscrows', () => {
    it('should list all escrows', async () => {
      const mockEscrows = [
        {
          id: 'escrow_1',
          amount: 1000,
          status: 'HELD',
          created_at: new Date(),
        },
        {
          id: 'escrow_2',
          amount: 2000,
          status: 'RELEASED',
          created_at: new Date(),
        },
      ];

      mockEscrowService.listEscrows.mockResolvedValue(mockEscrows);

      const result = await service.listEscrows();

      expect(result).toEqual(mockEscrows);
      expect(mockEscrowService.listEscrows).toHaveBeenCalled();
    });
  });
});
