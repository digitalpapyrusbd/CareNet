import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AccountLockReason, InvoiceStatus } from '@prisma/client';

@Injectable()
export class LockoutService {
  constructor(private prisma: PrismaService) {}

  async checkAccountStatus(userId: string) {
    const lockout = await this.prisma.account_lockouts.findFirst({
      where: {
        user_id: userId,
        is_active: true,
      },
    });

    return {
      isLocked: !!lockout,
      reason: lockout?.reason,
      details: lockout,
    };
  }

  async lockAccount(
    userId: string,
    reason: AccountLockReason,
    details: any = {},
  ) {
    const lockout = await this.prisma.account_lockouts.create({
      data: {
        user_id: userId,
        reason,
        locked_features: details.locked_features || {},
        active_features: details.active_features || {},
        locked_at: new Date(),
        // triggering_invoice_id: details.invoice_id // Optional
      },
    });

    return lockout;
  }

  async unlockAccount(userId: string, unlockedBy: string) {
    await this.prisma.account_lockouts.updateMany({
      where: {
        user_id: userId,
        is_active: true,
      },
      data: {
        is_active: false,
        unlocked_at: new Date(),
        unlocked_by: unlockedBy,
      },
    });

    return { message: 'Account unlocked' };
  }

  async getLockoutStatus(userId: string) {
    return this.checkAccountStatus(userId);
  }

  async grantGracePeriod(userId: string, days: number) {
    // Extend grace period logic
    return { message: `Grace period extended by ${days} days` };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleOverdueInvoices() {
    // Logic to find overdue invoices (7+ days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const overdueInvoices = await this.prisma.invoices.findMany({
      where: {
        status: InvoiceStatus.OVERDUE,
        due_date: { lt: sevenDaysAgo },
        locked_at: null, // Not already processed for lock
      },
    });

    for (const invoice of overdueInvoices) {
      // Lock the payer
      await this.lockAccount(
        invoice.recipient_id,
        AccountLockReason.PAYMENT_OVERDUE,
        {
          invoice_id: invoice.id,
        },
      );

      // Mark invoice as locked processing
      await this.prisma.invoices.update({
        where: { id: invoice.id },
        data: { locked_at: new Date() },
      });
    }
  }
}
