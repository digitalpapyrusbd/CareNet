import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { CreatePaymentDto, RefundPaymentDto } from './payments.service';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimit, RateLimitTier } from '../common/guards/throttle.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
@RateLimit(RateLimitTier.PAYMENT)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create')
  async createPayment(@Body() dto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.createPayment(dto, req.user?.userId || req.user?.id);
  }

  @Get('bkash/callback')
  async bkashCallback(@Query('transactionId') transactionId: string) {
    const result = await this.paymentsService.verifyPayment(
      'bkash',
      transactionId,
    );
    return {
      success: true,
      message: 'Payment verified',
      data: result,
    };
  }

  @Get('nagad/callback')
  async nagadCallback(@Query('transactionId') transactionId: string) {
    const result = await this.paymentsService.verifyPayment(
      'nagad',
      transactionId,
    );
    return {
      success: true,
      message: 'Payment verified',
      data: result,
    };
  }

  @Post('nagad/webhook')
  @RateLimit(RateLimitTier.WEBHOOK)
  async nagadWebhook(
    @Body()
    webhookData: {
      transactionId: string;
      orderId: string;
      status: string;
      amount: number;
      currency?: string;
      paymentTime: string;
      signature?: string;
    },
  ) {
    const { transactionId, orderId, status, amount, paymentTime } = webhookData;

    // Verify webhook signature (in production, verify against Nagad's public key)
    // For now, just log the webhook
    console.log('[Nagad Webhook] Received:', {
      transactionId,
      orderId,
      status,
      amount,
      paymentTime,
    });

    // Process the payment based on status
    if (status === 'Success') {
      await this.paymentsService.verifyPayment('nagad', transactionId);
    }

    // Return success to acknowledge receipt
    return {
      success: true,
      message: 'Webhook processed',
    };
  }

  @Post('refund')
  async refundPayment(@Body() dto: RefundPaymentDto) {
    return this.paymentsService.refundPayment(dto);
  }

  @Get('transaction/:id')
  async getTransaction(@Param('id') id: string) {
    return this.paymentsService.getTransaction(id);
  }

  @Get('transactions')
  async listTransactions(@Query('provider') provider?: 'bkash' | 'nagad') {
    return this.paymentsService.listTransactions(provider);
  }

  @Get('escrow/:id')
  async getEscrow(@Param('id') id: string) {
    return this.paymentsService.getEscrow(id);
  }

  @Get('escrows')
  async listEscrows() {
    return this.paymentsService.listEscrows();
  }
}
