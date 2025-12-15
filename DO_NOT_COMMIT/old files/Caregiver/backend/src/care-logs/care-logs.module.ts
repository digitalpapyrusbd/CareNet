import { Module } from '@nestjs/common';
import { CareLogsController } from './care-logs.controller';
import { CareLogsService } from './care-logs.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CareLogsController],
  providers: [CareLogsService],
  exports: [CareLogsService],
})
export class CareLogsModule {}
