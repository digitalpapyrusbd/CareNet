/**
 * Refund Service
 * Manages automated and manual refund processing for caregiver platform
 * 
 * Features:
 * - Automated refund processing
 * - Refund eligibility checking
 * - Refund policy enforcement
 * - Refund tracking and audit trail
 * - Partial refund support
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RefundRequest {
  paymentId: string;
  amount?: number;
  reason: string;
  type: 'FULL' | 'PARTIAL';
  requestedBy: string;
  evidence?: string[];
  metadata?: Record<string, any>;
}

export interface RefundResponse {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REJECTED';
  reason: string;
  type: 'FULL' | 'PARTIAL';
  requestedBy: string;
  processedBy?: string;
  processedAt?: Date;
  gatewayTransactionId?: string;
  failureReason?: string;
  evidence?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefundPolicy {
  id: string;
  name: string;
  description: string;
  conditions: {
    timeLimitHours?: number;
    maxRefundPercentage?: number;
    applicableServices?: string[];
    excludedServices?: string[];
    autoApproval?: boolean;
    requiresEvidence?: boolean;
  };
  isActive: boolean;
  createdAt: Date;
}

export class RefundService {
  /**
   * Create refund request
   */
  async createRefundRequest(request: RefundRequest): Promise<RefundResponse> {
    try {
      // Validate payment exists and is eligible for refund
      const payment = await prisma.payments.findUnique({
        where: { id: request.paymentId },
        include: {
          escrowTransaction: true,
          job: {
            include: {
              guardian: true,
              caregiver: true,
              company: true,
            },
          },
        },
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Check refund eligibility
      const eligibility = await this.checkRefundEligibility(request.paymentId, request.amount);
      
      if (!eligibility.eligible) {
        throw new Error(`Refund not eligible: ${eligibility.reason}`);
      }

      // Calculate refund amount
      const refundAmount = request.amount || payment.amount;

      // Create refund record
      const refund = await prisma.refunds.create({
        data: {
          paymentId: request.paymentId,
          amount: refundAmount,
          currency: payment.currency,
          status: 'PENDING',
          reason: request.reason,
          type: request.type,
          requestedBy: request.requestedBy,
          evidence: request.evidence || [],
          metadata: request.metadata || {},
        },
      });

      // Log the refund request
      await this.logRefundAction(refund.id, 'REQUESTED', request.reason, {
        requestedBy: request.requestedBy,
        amount: refundAmount,
      });

      // Check if refund can be auto-approved
      if (eligibility.autoApprove) {
        await this.processRefund(refund.id, 'SYSTEM');
      }

      return refund;
    } catch (error) {
      console.error('Refund request creation error:', error);
      throw new Error(`Failed to create refund request: ${error.message}`);
    }
  }

  /**
   * Process refund
   */
  async processRefund(refundId: string, processedBy: string): Promise<RefundResponse> {
    try {
      const refund = await prisma.refunds.findUnique({
        where: { id: refundId },
        include: {
          payment: true,
        },
      });

      if (!refund) {
        throw new Error('Refund not found');
      }

      if (refund.status !== 'PENDING') {
        throw new Error('Only pending refunds can be processed');
      }

      // Update refund status to processing
      await prisma.refunds.update({
        where: { id: refundId },
        data: {
          status: 'PROCESSING',
          processedBy,
        },
      });

      // Process refund through payment gateway
      const gatewayResult = await this.processGatewayRefund(
        refund.payment.gatewayTransactionId,
        refund.payment.gateway,
        refund.amount,
        refund.reason
      );

      // Update refund with gateway result
      const updatedRefund = await prisma.refunds.update({
        where: { id: refundId },
        data: {
          status: gatewayResult.success ? 'COMPLETED' : 'FAILED',
          gatewayTransactionId: gatewayResult.transactionId,
          failureReason: gatewayResult.error,
          processedAt: new Date(),
        },
      });

      // Update payment status if refund was successful
      if (gatewayResult.success) {
        await prisma.payments.update({
          where: { id: refund.paymentId },
          data: { status: 'REFUNDED' },
        });

        // Update escrow if exists
        if (refund.payment.escrowTransactionId) {
          await prisma.escrow_transactions.update({
            where: { id: refund.payment.escrowTransactionId },
            data: {
              status: 'REFUNDED',
              refundDate: new Date(),
              refundReason: refund.reason,
            },
          });
        }
      }

      // Log the refund processing
      await this.logRefundAction(refundId, 'PROCESSED', refund.reason, {
        processedBy,
        success: gatewayResult.success,
        transactionId: gatewayResult.transactionId,
        error: gatewayResult.error,
      });

      return updatedRefund;
    } catch (error) {
      console.error('Refund processing error:', error);
      
      // Update refund status to failed
      await prisma.refunds.update({
        where: { id: refundId },
        data: {
          status: 'FAILED',
          failureReason: error.message,
          processedAt: new Date(),
        },
      });

      throw new Error(`Failed to process refund: ${error.message}`);
    }
  }

  /**
   * Reject refund request
   */
  async rejectRefund(refundId: string, reason: string, rejectedBy: string): Promise<RefundResponse> {
    try {
      const refund = await prisma.refunds.findUnique({
        where: { id: refundId },
      });

      if (!refund) {
        throw new Error('Refund not found');
      }

      if (refund.status !== 'PENDING') {
        throw new Error('Only pending refunds can be rejected');
      }

      const updatedRefund = await prisma.refunds.update({
        where: { id: refundId },
        data: {
          status: 'REJECTED',
          failureReason: reason,
          processedBy: rejectedBy,
          processedAt: new Date(),
        },
      });

      // Log the refund rejection
      await this.logRefundAction(refundId, 'REJECTED', reason, {
        rejectedBy,
      });

      return updatedRefund;
    } catch (error) {
      console.error('Refund rejection error:', error);
      throw new Error(`Failed to reject refund: ${error.message}`);
    }
  }

  /**
   * Get refund by ID
   */
  async getRefund(refundId: string): Promise<RefundResponse | null> {
    try {
      return await prisma.refunds.findUnique({
        where: { id: refundId },
        include: {
          payment: {
            include: { jobs: {
                include: {
                  guardian: true,
                  caregiver: true,
                  company: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Get refund error:', error);
      throw new Error(`Failed to get refund: ${error.message}`);
    }
  }

  /**
   * Get refunds for a user
   */
  async getUserRefunds(
    userId: string,
    userRole: 'GUARDIAN' | 'CAREGIVER' | 'COMPANY',
    status?: string
  ): Promise<RefundResponse[]> {
    try {
      const whereClause: any = {};
      
      if (status) {
        whereClause.status = status;
      }

      // Filter based on user role
      if (userRole === 'GUARDIAN') {
        whereClause.payment = {
          job: {
            guardianId: user_id,
          },
        };
      } else if (userRole === 'CAREGIVER') {
        whereClause.payment = {
          job: {
            caregiverId: user_id,
          },
        };
      } else if (userRole === 'COMPANY') {
        whereClause.payment = {
          job: {
            companyId: user_id,
          },
        };
      }

      return await prisma.refunds.findMany({
        where: whereClause,
        include: {
          payment: {
            include: { jobs: {
                include: {
                  guardian: true,
                  caregiver: true,
                  company: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      console.error('Get user refunds error:', error);
      throw new Error(`Failed to get user refunds: ${error.message}`);
    }
  }

  /**
   * Check refund eligibility
   */
  async checkRefundEligibility(
    paymentId: string,
    refundAmount?: number
  ): Promise<{
    eligible: boolean;
    reason?: string;
    autoApprove?: boolean;
  }> {
    try {
      const payment = await prisma.payments.findUnique({
        where: { id: paymentId },
        include: {
          escrowTransaction: true,
          job: {
            include: {
              package: true,
            },
          },
        },
      });

      if (!payment) {
        return { eligible: false, reason: 'Payment not found' };
      }

      // Check if payment is already refunded
      if (payment.status === 'REFUNDED') {
        return { eligible: false, reason: 'Payment already refunded' };
      }

      // Check if payment is completed
      if (payment.status !== 'COMPLETED' && payment.status !== 'ESCROW') {
        return { eligible: false, reason: 'Payment not completed' };
      }

      // Check time limit
      const paymentTime = new Date(payment.createdAt);
      const currentTime = new Date();
      const hoursDifference = (currentTime.getTime() - paymentTime.getTime()) / (1000 * 60 * 60);

      // Default 48-hour refund window
      const refundTimeLimit = 48;
      
      if (hoursDifference > refundTimeLimit) {
        return { eligible: false, reason: 'Refund time limit exceeded' };
      }

      // Check refund amount
      const requestedAmount = refundAmount || payment.amount;
      
      if (requestedAmount > payment.amount) {
        return { eligible: false, reason: 'Refund amount exceeds payment amount' };
      }

      // Check if there's already a pending refund
      const existingRefund = await prisma.refunds.findFirst({
        where: {
          paymentId,
          status: 'PENDING',
        },
      });

      if (existingRefund) {
        return { eligible: false, reason: 'Refund already in progress' };
      }

      // Check for auto-approval conditions
      const autoApprove = 
        hoursDifference <= 24 && // Auto-approve for refunds within 24 hours
        requestedAmount <= payment.amount * 0.5; // Auto-approve for partial refunds up to 50%

      return { eligible: true, autoApprove };
    } catch (error) {
      console.error('Refund eligibility check error:', error);
      return { eligible: false, reason: 'Eligibility check failed' };
    }
  }

  /**
   * Process refund through payment gateway
   */
  private async processGatewayRefund(
    gatewayTransactionId: string,
    gateway: string,
    amount: number,
    reason: string
  ): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }> {
    try {
      if (gateway === 'BKASH') {
        const { bkashGateway } = await import('@/lib/payment-gateways/bkash');
        const result = await bkashGateway.processRefund(gatewayTransactionId, amount, reason);
        return {
          success: true,
          transactionId: result.transactionID,
        };
      } else if (gateway === 'NAGAD') {
        const { nagadGateway } = await import('@/lib/payment-gateways/nagad');
        const result = await nagadGateway.processRefund(gatewayTransactionId, amount, reason);
        return {
          success: true,
          transactionId: result.transactionID,
        };
      } else {
        return {
          success: false,
          error: 'Unsupported payment gateway for refund',
        };
      }
    } catch (error) {
      console.error('Gateway refund processing error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Log refund actions for audit trail
   */
  private async logRefundAction(
    refundId: string,
    action: string,
    description: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await prisma.audit_logs.create({
        data: {
          entity_type: 'REFUND',
          entity_id: refundId,
          action,
          description,
          metadata: metadata || {},
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Refund action logging error:', error);
      // Don't throw here to avoid breaking main flow
    }
  }

  /**
   * Get refund statistics
   */
  async getRefundStatistics(
    userId?: string,
    userRole?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalRefunds: number;
    totalAmount: number;
    successfulRefunds: number;
    failedRefunds: number;
    pendingRefunds: number;
    averageProcessingTime: number;
  }> {
    try {
      const whereClause: any = {};
      
      if (userId && userRole) {
        if (userRole === 'GUARDIAN') {
          whereClause.payment = {
            job: {
              guardianId: user_id,
            },
          };
        } else if (userRole === 'CAREGIVER') {
          whereClause.payment = {
            job: {
              caregiverId: user_id,
            },
          };
        } else if (userRole === 'COMPANY') {
          whereClause.payment = {
            job: {
              companyId: user_id,
            },
          };
        }
      }

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = startDate;
        if (endDate) whereClause.createdAt.lte = endDate;
      }

      const refunds = await prisma.refunds.findMany({
        where: whereClause,
      });

      const totalRefunds = refunds.length;
      const totalAmount = refunds.reduce((sum, refund) => sum + refund.amount, 0);
      const successfulRefunds = refunds.filter(r => r.status === 'COMPLETED').length;
      const failedRefunds = refunds.filter(r => r.status === 'FAILED').length;
      const pendingRefunds = refunds.filter(r => r.status === 'PENDING').length;

      // Calculate average processing time
      const processedRefunds = refunds.filter(r => r.processedAt);
      const averageProcessingTime = processedRefunds.length > 0
        ? processedRefunds.reduce((sum, refund) => {
            const processingTime = refund.processedAt!.getTime() - refund.createdAt.getTime();
            return sum + processingTime;
          }, 0) / processedRefunds.length / (1000 * 60 * 60) // Convert to hours
        : 0;

      return {
        totalRefunds,
        totalAmount,
        successfulRefunds,
        failedRefunds,
        pendingRefunds,
        averageProcessingTime,
      };
    } catch (error) {
      console.error('Refund statistics error:', error);
      throw new Error(`Failed to get refund statistics: ${error.message}`);
    }
  }
}

// Create singleton instance
export const refundService = new RefundService();

export default refundService;