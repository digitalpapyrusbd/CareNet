import { Module } from '@nestjs/common';
import { LockoutService } from './lockout.service';
import { LockoutController } from './lockout.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [LockoutController],
  providers: [LockoutService],
  exports: [LockoutService],
})
export class LockoutModule {}
