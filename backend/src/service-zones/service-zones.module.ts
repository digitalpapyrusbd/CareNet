import { Module } from '@nestjs/common';
import { ServiceZonesService } from './service-zones.service';
import { ServiceZonesController } from './service-zones.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ServiceZonesController],
  providers: [ServiceZonesService],
  exports: [ServiceZonesService],
})
export class ServiceZonesModule {}
