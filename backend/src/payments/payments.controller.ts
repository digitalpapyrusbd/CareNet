import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  CreatePaymentDto,
  ProcessPaymentDto,
  RefundPaymentDto,
} from './dto/payment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.GUARDIAN)
  create(
    @CurrentUser('id') userId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.createPayment(userId, createPaymentDto);
  }

  @Get()
  getMyPayments(
    @CurrentUser('id') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.paymentsService.getUserPayments(userId, +page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.paymentsService.findOne(id, userId);
  }

  @Patch(':id/refund')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  refund(@Param('id') id: string, @Body() refundDto: RefundPaymentDto) {
    return this.paymentsService.refundPayment(id, refundDto);
  }

  @Patch(':id/release-escrow')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  releaseEscrow(@Param('id') id: string) {
    return this.paymentsService.releaseEscrow(id);
  }

  @Public()
  @Post('webhook/:provider')
  handleWebhook(@Param('provider') provider: string, @Body() payload: any) {
    return this.paymentsService.handleWebhook(provider, payload);
  }
}
