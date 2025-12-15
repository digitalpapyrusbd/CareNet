import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class EscrowService {
  constructor(private prisma: PrismaService) {}

  async holdFunds(
    orderId: string | undefined,
    amount: number,
    currency = 'BDT',
  ) {
    const created = await this.prisma.escrow_records.create({
      data: {
        external_ref: orderId ?? undefined,
        amount: amount as any,
        currency,
        status: 'HELD',
      },
    });

    // ledger entry
    await this.prisma.escrow_ledger.create({
      data: {
        escrow_id: created.id,
        action: 'HOLD',
        amount: amount as any,
        note: orderId ? `Hold for ${orderId}` : 'Hold funds',
      },
    });

    return created;
  }

  async releaseEscrow(escrowId: string) {
    const found = await this.prisma.escrow_records.findUnique({
      where: { id: escrowId },
    });
    if (!found) throw new Error('escrow_not_found');

    const updated = await this.prisma.escrow_records.update({
      where: { id: escrowId },
      data: { status: 'RELEASED', released_at: new Date() },
    });

    await this.prisma.escrow_ledger.create({
      data: {
        escrow_id: escrowId,
        action: 'RELEASE',
        amount: updated.amount as any,
        note: 'Released to provider/payer',
      },
    });

    return updated;
  }

  async refundEscrow(escrowId: string, amount?: number) {
    const found = await this.prisma.escrow_records.findUnique({
      where: { id: escrowId },
    });
    if (!found) throw new Error('escrow_not_found');

    const refundAmount = amount ?? Number(found.amount as any);
    const updated = await this.prisma.escrow_records.update({
      where: { id: escrowId },
      data: { status: 'REFUNDED', released_at: new Date() },
    });

    await this.prisma.escrow_ledger.create({
      data: {
        escrow_id: escrowId,
        action: 'REFUND',
        amount: refundAmount as any,
        note: 'Refund processed',
      },
    });

    return { escrowId, refundedAmount: refundAmount };
  }

  async getEscrow(escrowId: string) {
    return this.prisma.escrow_records.findUnique({
      where: { id: escrowId },
      include: { ledger_entries: true },
    });
  }

  async listEscrows() {
    return this.prisma.escrow_records.findMany({
      include: { ledger_entries: true },
      orderBy: { created_at: 'desc' },
    });
  }
}
