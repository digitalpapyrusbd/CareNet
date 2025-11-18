/**
 * Escrow Service
 * Manages secure payment holding and release for caregiver platform
 * 
 * Features:
 * - Payment holding in escrow
 * - Conditional release based on service completion
 * - Dispute handling and resolution
 * - Refund processing
 * - Transaction tracking and audit trail
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface EscrowTransaction {
  id: string;
  paymentId: string;
  jobId: string;
  amount: number;
  currency: string;
  status: 'HELD' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';
  heldAt: Date;
  releaseDate?: Date;
  refundDate?: Date;
  disputeId?: string;
  releaseReason?: string;
  refundReason?: string;
  metadata?: Record<string, any>;
}

export interface CreateEscrowRequest {
  paymentId: string;
  jobId: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

export interface ReleaseEscrowRequest {
  escrowId: string;
  reason: string;
  releasedBy: string;
  evidence?: string[];
}

export interface RefundEscrowRequest {
  escrowId: string;
  reason: string;
  refundedBy: string;
  evidence?: string[];
}

export interface DisputeEscrowRequest {
  escrowId: string;
  reason: string;
  disputedBy: string;
  description: string;
  evidence?: string[];
}

export class EscrowService {
  /**
   * Create escrow transaction for a payment
   */
  async createEscrow(request: CreateEscrowRequest): Promise<EscrowTransaction> {
    try {
      // Verify payment exists and is completed
      const payment = await prisma.payment.findUnique({
        where: { id: request.paymentId },
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'COMPLETED') {
        throw new Error('Payment must be completed before creating escrow');
      }

      // Check if escrow already exists for this payment
      const existingEscrow = await prisma.escrowTransaction.findFirst({
        where: { paymentId: request.paymentId },
      });

      if (existingEscrow) {
        throw new Error('Escrow already exists for this payment');
      }

      // Create escrow transaction
      const escrow = await prisma.escrowTransaction.create({
        data: {
          paymentId: request.paymentId,
          jobId: request.jobId,
          amount: request.amount,
          currency: request.currency,
          status: 'HELD',
          heldAt: new Date(),
          metadata: request.metadata || {},
        },
      });

      // Update payment status to indicate it's in escrow
      await prisma.payment.update({
        where: { id: request.paymentId },
        data: { status: 'ESCROW' },
      });

      // Log the escrow creation
      await this.logEscrowAction(escrow.id, 'CREATED', 'Escrow transaction created', {
        paymentId: request.paymentId,
        amount: request.amount,
      });

      return escrow;
    } catch (error) {
      console.error('Escrow creation error:', error);
      throw new Error(`Failed to create escrow: ${error.message}`);
    }
  }

  /**
   * Release funds from escrow to caregiver
   */
  async releaseEscrow(request: ReleaseEscrowRequest): Promise<EscrowTransaction> {
    try {
      const escrow = await prisma.escrowTransaction.findUnique({
        where: { id: request.escrowId },
        include: {
          payment: true,
          job: {
            include: {
              caregiver: true,
              company: true,
            },
          },
        },
      });

      if (!escrow) {
        throw new Error('Escrow transaction not found');
      }

      if (escrow.status !== 'HELD') {
        throw new Error('Only held escrow transactions can be released');
      }

      // Update escrow status
      const updatedEscrow = await prisma.escrowTransaction.update({
        where: { id: request.escrowId },
        data: {
          status: 'RELEASED',
          releaseDate: new Date(),
          releaseReason: request.reason,
          metadata: {
            ...escrow.metadata,
            releasedBy: request.releasedBy,
            evidence: request.evidence,
          },
        },
      });

      // Update payment status
      await prisma.payment.update({
        where: { id: escrow.paymentId },
        data: { status: 'RELEASED' },
      });

      // Create caregiver payment record
      if (escrow.job?.caregiver) {
        await prisma.caregiverPayment.create({
          data: {
            caregiverId: escrow.job.caregiverId,
            paymentId: escrow.paymentId,
            amount: escrow.amount,
            currency: escrow.currency,
            status: 'PAID',
            paidAt: new Date(),
            escrowId: escrow.id,
          },
        });
      }

      // Log the release
      await this.logEscrowAction(escrow.id, 'RELEASED', request.reason, {
        releasedBy: request.releasedBy,
        evidence: request.evidence,
      });

      return updatedEscrow;
    } catch (error) {
      console.error('Escrow release error:', error);
      throw new Error(`Failed to release escrow: ${error.message}`);
    }
  }

  /**
   * Refund funds from escrow to guardian
   */
  async refundEscrow(request: RefundEscrowRequest): Promise<EscrowTransaction> {
    try {
      const escrow = await prisma.escrowTransaction.findUnique({
        where: { id: request.escrowId },
        include: {
          payment: true,
          job: {
            include: {
              guardian: true,
            },
          },
        },
      });

      if (!escrow) {
        throw new Error('Escrow transaction not found');
      }

      if (escrow.status !== 'HELD') {
        throw new Error('Only held escrow transactions can be refunded');
      }

      // Process refund through payment gateway
      const refundResult = await this.processRefund(escrow.paymentId, escrow.amount, request.reason);

      // Update escrow status
      const updatedEscrow = await prisma.escrowTransaction.update({
        where: { id: request.escrowId },
        data: {
          status: 'REFUNDED',
          refundDate: new Date(),
          refundReason: request.reason,
          metadata: {
            ...escrow.metadata,
            refundedBy: request.refundedBy,
            evidence: request.evidence,
            refundTransactionId: refundResult.transactionId,
          },
        },
      });

      // Update payment status
      await prisma.payment.update({
        where: { id: escrow.paymentId },
        data: { status: 'REFUNDED' },
      });

      // Log the refund
      await this.logEscrowAction(escrow.id, 'REFUNDED', request.reason, {
        refundedBy: request.refundedBy,
        evidence: request.evidence,
        refundTransactionId: refundResult.transactionId,
      });

      return updatedEscrow;
    } catch (error) {
      console.error('Escrow refund error:', error);
      throw new Error(`Failed to refund escrow: ${error.message}`);
    }
  }

  /**
   * Create dispute for escrow transaction
   */
  async createDispute(request: DisputeEscrowRequest): Promise<EscrowTransaction> {
    try {
      const escrow = await prisma.escrowTransaction.findUnique({
        where: { id: request.escrowId },
      });

      if (!escrow) {
        throw new Error('Escrow transaction not found');
      }

      if (escrow.status !== 'HELD') {
        throw new Error('Only held escrow transactions can be disputed');
      }

      // Create dispute record
      const dispute = await prisma.dispute.create({
        data: {
          escrowId: request.escrowId,
          jobId: escrow.jobId,
          status: 'OPEN',
          disputedBy: request.disputedBy,
          reason: request.reason,
          description: request.description,
          evidence: request.evidence || [],
          createdAt: new Date(),
        },
      });

      // Update escrow status
      const updatedEscrow = await prisma.escrowTransaction.update({
        where: { id: request.escrowId },
        data: {
          status: 'DISPUTED',
          disputeId: dispute.id,
          metadata: {
            ...escrow.metadata,
            disputedBy: request.disputedBy,
            disputeReason: request.reason,
          },
        },
      });

      // Log the dispute creation
      await this.logEscrowAction(escrow.id, 'DISPUTED', request.reason, {
        disputedBy: request.disputedBy,
        disputeId: dispute.id,
      });

      return updatedEscrow;
    } catch (error) {
      console.error('Escrow dispute creation error:', error);
      throw new Error(`Failed to create dispute: ${error.message}`);
    }
  }

  /**
   * Get escrow transaction by ID
   */
  async getEscrowTransaction(escrowId: string): Promise<EscrowTransaction | null> {
    try {
      return await prisma.escrowTransaction.findUnique({
        where: { id: escrowId },
        include: {
          payment: true,
          job: {
            include: {
              caregiver: true,
              guardian: true,
              company: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Get escrow transaction error:', error);
      throw new Error(`Failed to get escrow transaction: ${error.message}`);
    }
  }

  /**
   * Get escrow transactions for a user
   */
  async getUserEscrowTransactions(
    userId: string,
    userRole: 'GUARDIAN' | 'CAREGIVER' | 'COMPANY',
    status?: string
  ): Promise<EscrowTransaction[]> {
    try {
      const whereClause: any = {};
      
      if (status) {
        whereClause.status = status;
      }

      // Filter based on user role
      if (userRole === 'GUARDIAN') {
        whereClause.job = {
          guardianId: userId,
        };
      } else if (userRole === 'CAREGIVER') {
        whereClause.job = {
          caregiverId: userId,
        };
      } else if (userRole === 'COMPANY') {
        whereClause.job = {
          companyId: userId,
        };
      }

      return await prisma.escrowTransaction.findMany({
        where: whereClause,
        include: {
          payment: true,
          job: {
            include: {
              caregiver: true,
              guardian: true,
              company: true,
            },
          },
        },
        orderBy: {
          heldAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Get user escrow transactions error:', error);
      throw new Error(`Failed to get user escrow transactions: ${error.message}`);
    }
  }

  /**
   * Process refund through payment gateway
   */
  private async processRefund(paymentId: string, amount: number, reason: string): Promise<any> {
    try {
      // Get payment details to determine gateway
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Process refund based on payment gateway
      if (payment.gateway === 'BKASH') {
        const { bkashGateway } = await import('@/lib/payment-gateways/bkash');
        return await bkashGateway.processRefund(payment.gatewayTransactionId, amount, reason);
      } else if (payment.gateway === 'NAGAD') {
        const { nagadGateway } = await import('@/lib/payment-gateways/nagad');
        return await nagadGateway.processRefund(payment.gatewayTransactionId, amount, reason);
      } else {
        throw new Error('Unsupported payment gateway for refund');
      }
    } catch (error) {
      console.error('Refund processing error:', error);
      throw new Error(`Refund processing failed: ${error.message}`);
    }
  }

  /**
   * Log escrow actions for audit trail
   */
  private async logEscrowAction(
    escrowId: string,
    action: string,
    description: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          entityType: 'ESCROW',
          entityId: escrowId,
          action,
          description,
          metadata: metadata || {},
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Escrow action logging error:', error);
      // Don't throw here to avoid breaking main flow
    }
  }
}

// Create singleton instance
export const escrowService = new EscrowService();

export default escrowService;