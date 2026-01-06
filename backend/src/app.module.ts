import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Phase 1: Core Infrastructure
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Phase 2: Business Entities
import { CaregiversModule } from './caregivers/caregivers.module';
import { PatientsModule } from './patients/patients.module';
import { PackagesModule } from './packages/packages.module';

// Phase 3: Critical Workflows
import { VerificationModule } from './verification/verification.module';
import { JobsModule } from './jobs/jobs.module';
import { NegotiationsModule } from './negotiations/negotiations.module';
import { InvoicingModule } from './invoicing/invoicing.module';
import { LockoutModule } from './lockout/lockout.module';

// Phase 4: Payments & Communication
import { PaymentsModule } from './payments/payments.module';
import { MessagesModule } from './messages/messages.module';

// Phase 5: Support Modules
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { DisputesModule } from './disputes/disputes.module';
import { ShopsModule } from './shops/shops.module';

// Phase 6: Analytics & Polish
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FilesModule } from './files/files.module';
import { CareLogsModule } from './care-logs/care-logs.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AuditModule } from './audit/audit.module';
import { HealthRecordsModule } from './health-records/health-records.module';
import { ServiceZonesModule } from './service-zones/service-zones.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Cron Jobs
    ScheduleModule.forRoot(),

    // Phase 1: Core Infrastructure (3 modules)
    CommonModule,
    AuthModule,
    UsersModule,

    // Phase 2: Business Entities (3 modules)
    CaregiversModule,
    PatientsModule,
    PackagesModule,

    // Phase 3: Critical Workflows (5 modules)
    VerificationModule,
    JobsModule,
    NegotiationsModule,
    InvoicingModule,
    LockoutModule,

    // Phase 4: Payments & Communication (2 modules)
    PaymentsModule,
    MessagesModule,

    // Phase 5: Support Modules (3 modules)
    SubscriptionsModule,
    DisputesModule,
    ShopsModule,

    // Phase 6: Analytics & Polish (8 modules)
    AnalyticsModule,
    NotificationsModule,
    FilesModule,
    CareLogsModule,
    FeedbackModule,
    AuditModule,
    HealthRecordsModule,
    ServiceZonesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
