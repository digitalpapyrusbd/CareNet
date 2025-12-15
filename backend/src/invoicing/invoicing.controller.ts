import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { InvoicingService } from './invoicing.service';
import { CreateInvoiceDto, PayInvoiceDto } from './dto/invoice.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('invoices')
export class InvoicingController {
  constructor(private readonly invoicingService: InvoicingService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicingService.create(createInvoiceDto);
  }

  @Get()
  findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.invoicingService.findAll(userId, +page, +limit);
  }

  @Get('overdue')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  getOverdue() {
    return this.invoicingService.getOverdueInvoices();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicingService.findOne(id);
  }

  @Patch(':id/pay')
  payInvoice(@Param('id') id: string, @Body() payInvoiceDto: PayInvoiceDto) {
    return this.invoicingService.payInvoice(id, payInvoiceDto);
  }

  @Post('generate/:jobId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  generateJobInvoices(@Param('jobId') jobId: string) {
    return this.invoicingService.generateJobInvoices(jobId);
  }
}
