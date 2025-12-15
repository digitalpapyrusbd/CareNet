import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SmsService } from './providers/sms.service';
import { EmailService } from './providers/email.service';
import { PushService } from './providers/push.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    SmsService,
    EmailService,
    PushService,
  ],
  exports: [
    NotificationsService,
    SmsService,
    EmailService,
    PushService,
  ],
})
export class NotificationsModule {}
