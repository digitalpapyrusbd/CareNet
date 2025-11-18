import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EscrowService } from '../escrow/escrow.service';

export type BkashCheckoutParams = {
  amount: number;
  currency?: string;
  reference?: string;
};

@Injectable()
export class BkashService {
  constructor(
    private prisma: PrismaService,
    private escrowService: EscrowService,
  ) {}

  async createCheckout({ amount, currency = 'BDT', reference }: BkashCheckoutParams) {
    const txId = `bk_${Date.now()}`;
    
    // Hold funds in escrow
    const escrow = await this.escrowService.holdFunds(reference, Number(amount), currency);

    // Persist provider transaction
    const prov = await this.prisma.provider_transactions.create({
      data: {
        provider: 'bkash',
        provider_tx_id: txId,
        status: 'PENDING',
        amount: amount as any,
        currency,
        payload: {},
        escrow_id: escrow.id,
      },
    });

    // Create initial log
    await this.prisma.transaction_logs.create({
      data: {
        provider_transaction_id: prov.id,
        action: 'CREATE',
        previous_status: null,
        new_status: 'PENDING',
        note: 'Checkout created',
      },
    });

    return {
      checkoutUrl: `https://sandbox.bkash.com/checkout/${txId}`,
      transactionId: txId,
      amount: Number(amount),
      currency,
      reference: reference || txId,
      escrowId: escrow.id,
    };
  }

  async verifyPayment(transactionId: string) {
    // Update provider transaction record in DB
    const prov = await this.prisma.provider_transactions.findUnique({
      where: { provider_tx_id: transactionId },
    });
    
    if (!prov) {
      return { transactionId, status: 'NOT_FOUND' };
    }

    const updated = await this.prisma.provider_transactions.update({
      where: { id: prov.id },
      data: { status: 'SUCCESS' },
    });
    
    await this.prisma.transaction_logs.create({
      data: {
        provider_transaction_id: prov.id,
        action: 'VERIFY',
        previous_status: prov.status,
        new_status: 'SUCCESS',
        note: 'Verified by callback',
      },
    });

    // Release escrow if present
    if (prov.escrow_id) {
      try {
        await this.escrowService.releaseEscrow(prov.escrow_id);
      } catch (e) {
        // ignore
      }
    }

    return {
      transactionId: updated.provider_tx_id,
      status: updated.status,
      provider: 'bkash',
      amount: Number(updated.amount as any),
      escrowId: updated.escrow_id,
    };
  }

  async getTransaction(transactionId: string) {
    return this.prisma.provider_transactions.findUnique({
      where: { provider_tx_id: transactionId },
      include: { logs: true },
    });
  }

  async listTransactions() {
    return this.prisma.provider_transactions.findMany({
      where: { provider: 'bkash' },
      orderBy: { created_at: 'desc' },
    });
  }
}
