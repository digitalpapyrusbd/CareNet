import { Module } from '@nestjs/common';
import { CareLogsService } from './care-logs.service';
import { CareLogsController } from './care-logs.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [CareLogsController],
  providers: [CareLogsService],
  exports: [CareLogsService],
})
export class CareLogsModule {}
