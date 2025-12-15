import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BkashService } from './providers/bkash.service';
import { NagadService } from './providers/nagad.service';
import { EscrowService } from './escrow/escrow.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, BkashService, NagadService, EscrowService],
  exports: [PaymentsService, EscrowService],
})
export class PaymentsModule {}
