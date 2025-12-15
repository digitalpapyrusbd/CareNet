import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreatePaymentDto,
  ProcessPaymentDto,
  RefundPaymentDto,
} from './dto/payment.dto';
import { PaymentStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a payment intent
   */
  async createPayment(userId: string, createPaymentDto: CreatePaymentDto) {
    const job = await this.prisma.jobs.findUnique({
      where: { id: createPaymentDto.job_id },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.guardian_id !== userId) {
      throw new BadRequestException(
        'You are not authorized to pay for this job',
      );
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const payment = await this.prisma.payments.create({
      data: {
        job_id: createPaymentDto.job_id,
        payer_id: userId,
        amount: createPaymentDto.amount,
        method: createPaymentDto.method,
        transaction_id: `TXN-${Date.now()}`,
        invoice_number: invoiceNumber,
        status: PaymentStatus.PENDING,
      },
    });

    // Create escrow
    await this.prisma.escrows.create({
      data: {
        payment_id: payment.id,
        amount: createPaymentDto.amount,
        fee: createPaymentDto.amount * 0.05, // 5% platform fee
        status: 'HELD',
      },
    });

    return payment;
  }

  /**
   * Process payment (webhook handler)
   */
  async processPayment(processPaymentDto: ProcessPaymentDto) {
    const payment = await this.prisma.payments.findUnique({
      where: { id: processPaymentDto.payment_id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updatedPayment = await this.prisma.payments.update({
      where: { id: processPaymentDto.payment_id },
      data: {
        status: PaymentStatus.COMPLETED,
        paid_at: new Date(),
        transaction_id:
          processPaymentDto.transaction_id || payment.transaction_id,
        gatewayResponse: processPaymentDto.gateway_response,
      },
    });

    return updatedPayment;
  }

  /**
   * Get payment by ID
   */
  async findOne(id: string, userId: string) {
    const payment = await this.prisma.payments.findUnique({
      where: { id },
      include: {
        jobs: {
          select: {
            id: true,
            guardian_id: true,
            company_id: true,
          },
        },
        escrows: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Check authorization
    if (payment.payer_id !== userId && payment.jobs.guardian_id !== userId) {
      throw new BadRequestException('Unauthorized access to payment');
    }

    return payment;
  }

  /**
   * Get user's payments
   */
  async getUserPayments(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.prisma.payments.findMany({
        where: { payer_id: userId },
        skip,
        take: limit,
        include: {
          jobs: {
            select: {
              id: true,
              packages: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.payments.count({ where: { payer_id: userId } }),
    ]);

    return {
      data: payments,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Refund payment (Admin only)
   */
  async refundPayment(paymentId: string, refundDto: RefundPaymentDto) {
    const payment = await this.prisma.payments.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    const updatedPayment = await this.prisma.payments.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.REFUNDED,
        refund_amount: refundDto.amount,
        refund_reason: refundDto.reason,
      },
    });

    return updatedPayment;
  }

  /**
   * Release escrow (when job is completed)
   */
  async releaseEscrow(paymentId: string) {
    const escrow = await this.prisma.escrows.findUnique({
      where: { payment_id: paymentId },
    });

    if (!escrow) {
      throw new NotFoundException('Escrow not found');
    }

    const updatedEscrow = await this.prisma.escrows.update({
      where: { payment_id: paymentId },
      data: {
        status: 'RELEASED',
        released_at: new Date(),
      },
    });

    return updatedEscrow;
  }

  /**
   * Webhook handler for payment gateways
   */
  async handleWebhook(provider: string, payload: any) {
    // This would handle webhooks from bKash, Nagad, etc.
    // Implementation depends on specific gateway requirements

    console.log(`Webhook received from ${provider}:`, payload);

    // Process the webhook based on provider
    if (provider === 'bkash') {
      return this.handleBkashWebhook(payload);
    } else if (provider === 'nagad') {
      return this.handleNagadWebhook(payload);
    }

    return { success: true };
  }

  private async handleBkashWebhook(payload: any) {
    // bKash-specific webhook handling
    return { success: true };
  }

  private async handleNagadWebhook(payload: any) {
    // Nagad-specific webhook handling
    return { success: true };
  }
}
