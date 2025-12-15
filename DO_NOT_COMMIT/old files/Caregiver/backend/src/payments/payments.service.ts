import { Injectable } from '@nestjs/common';
import { BkashService } from './providers/bkash.service';
import { NagadService } from './providers/nagad.service';
import { EscrowService } from './escrow/escrow.service';
import { PrismaService } from '../common/prisma/prisma.service';

export type CreatePaymentDto = {
  job_id?: string;
  package_id?: string;
  payment_method: 'BKASH' | 'NAGAD';
  amount: number;
  currency?: string;
  reference?: string;
};

export type RefundPaymentDto = {
  transactionId: string;
  amount?: number;
  reason?: string;
};

@Injectable()
export class PaymentsService {
  constructor(
    private bkashService: BkashService,
    private nagadService: NagadService,
    private escrowService: EscrowService,
    private prisma: PrismaService,
  ) {}

  async createPayment(dto: CreatePaymentDto, userId?: string) {
    const provider = dto.payment_method.toLowerCase() as 'bkash' | 'nagad';
    const reference = dto.job_id || dto.package_id || dto.reference || 'payment';

    let paymentUrl: string;
    let transactionId: string;

    if (provider === 'bkash') {
      const result = await this.bkashService.createCheckout({
        amount: dto.amount,
        currency: dto.currency || 'BDT',
        reference,
      });
      paymentUrl = result.checkoutUrl;
      transactionId = result.transactionId;
    } else if (provider === 'nagad') {
      const result = await this.nagadService.createCheckout({
        amount: dto.amount,
        currency: dto.currency || 'BDT',
        reference,
      });
      paymentUrl = result.checkoutUrl;
      transactionId = result.transactionId;
    } else {
      throw new Error('Invalid payment provider');
    }

    // Store payment in database
    // Only include job_id if it's a valid cuid (not 'test-job-id' or similar)
    const jobIdToUse = dto.job_id && dto.job_id.startsWith('cm') ? dto.job_id : null;
    
    const payment = await this.prisma.payments.create({
      data: {
        job_id: jobIdToUse,
        payer_id: userId || 'system', // Use authenticated user ID
        amount: dto.amount,
        method: dto.payment_method,
        transaction_id: transactionId,
        status: 'PENDING',
        invoice_number: `INV-${Date.now()}`,
      },
    });

    return {
      statusCode: 201,
      message: 'Payment initiated successfully',
      data: {
        payment_url: paymentUrl,
        transaction_id: transactionId,
        amount: dto.amount,
        currency: dto.currency || 'BDT',
      },
    };
  }

  async verifyPayment(provider: 'bkash' | 'nagad', transactionId: string) {
    if (provider === 'bkash') {
      return this.bkashService.verifyPayment(transactionId);
    } else if (provider === 'nagad') {
      return this.nagadService.verifyPayment(transactionId);
    } else {
      throw new Error('Invalid payment provider');
    }
  }

  async getTransaction(transactionId: string) {
    // Try both providers
    const bkashTx = await this.bkashService.getTransaction(transactionId);
    if (bkashTx) return { ...bkashTx, provider: 'bkash' };

    const nagadTx = await this.nagadService.getTransaction(transactionId);
    if (nagadTx) return { ...nagadTx, provider: 'nagad' };

    return null;
  }

  async listTransactions(provider?: 'bkash' | 'nagad') {
    if (provider === 'bkash') {
      return this.bkashService.listTransactions();
    } else if (provider === 'nagad') {
      return this.nagadService.listTransactions();
    } else {
      // Return all
      const bkashTxs = await this.bkashService.listTransactions();
      const nagadTxs = await this.nagadService.listTransactions();
      return [...bkashTxs, ...nagadTxs].sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime(),
      );
    }
  }

  async refundPayment(dto: RefundPaymentDto) {
    const tx = await this.getTransaction(dto.transactionId);
    if (!tx) {
      throw new Error('Transaction not found');
    }

    if (tx.escrow_id) {
      await this.escrowService.refundEscrow(tx.escrow_id, dto.amount);
    }

    // Update provider transaction status
    await this.prisma.provider_transactions.update({
      where: { provider_tx_id: dto.transactionId },
      data: { status: 'REFUNDED' },
    });

    await this.prisma.transaction_logs.create({
      data: {
        provider_transaction_id: tx.id,
        action: 'REFUND',
        previous_status: tx.status,
        new_status: 'REFUNDED',
        note: dto.reason || 'Refund processed',
      },
    });

    return {
      transactionId: dto.transactionId,
      refundedAmount: dto.amount || Number(tx.amount as any),
      status: 'REFUNDED',
    };
  }

  async getEscrow(escrowId: string) {
    return this.escrowService.getEscrow(escrowId);
  }

  async listEscrows() {
    return this.escrowService.listEscrows();
  }
}
