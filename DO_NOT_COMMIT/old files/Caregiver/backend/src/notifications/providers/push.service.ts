import { Injectable } from '@nestjs/common';
import * as webpush from 'web-push';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PushService {
  private vapidPublicKey: string | undefined;
  private vapidPrivateKey: string | undefined;

  constructor(private readonly prisma: PrismaService) {
    this.vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    this.vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@caregiver-platform.com';

    if (this.vapidPublicKey && this.vapidPrivateKey) {
      webpush.setVapidDetails(vapidSubject, this.vapidPublicKey, this.vapidPrivateKey);
    } else {
      console.warn('VAPID keys not configured. Push notifications will be mocked.');
    }
  }

  /**
   * Store push subscription for user (mock implementation)
   * TODO: Add push subscription fields to user_devices table in schema
   */
  async subscribe(userId: string, subscription: any): Promise<void> {
    console.log(`[PUSH] Subscription stored for user ${userId}`);
    return;
  }

  /**
   * Remove push subscription
   */
  async unsubscribe(userId: string, endpoint: string): Promise<void> {
    console.log(`[PUSH] Unsubscribed user ${userId} from endpoint ${endpoint}`);
    return;
  }

  /**
   * Send push notification to user (mock implementation)
   */
  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: any,
  ): Promise<void> {
    if (!this.vapidPublicKey) {
      console.log(`[MOCK PUSH] To: ${userId}, Title: ${title}, Body: ${body}`);
      return;
    }

    console.log(`[PUSH] Notification sent to ${userId}: ${title}`);
    // TODO: Implement actual push notification once schema includes push subscription fields
  }

  /**
   * Send medication reminder
   */
  async sendMissedMedicationAlert(
    userId: string,
    medicationName: string,
    scheduledTime: string,
  ): Promise<void> {
    await this.sendPushNotification(
      userId,
      'Missed Medication',
      `${medicationName} was scheduled for ${scheduledTime}`,
      { type: 'MEDICATION_MISSED', medicationName, scheduledTime },
    );
  }

  /**
   * Send job assignment notification
   */
  async sendJobAssignmentNotification(
    userId: string,
    patientName: string,
    startTime: string,
  ): Promise<void> {
    await this.sendPushNotification(
      userId,
      'New Job Assigned',
      `You have been assigned to care for ${patientName} starting ${startTime}`,
      { type: 'JOB_ASSIGNED', patientName, startTime },
    );
  }

  /**
   * Send payment notification
   */
  async sendPaymentReceivedNotification(
    userId: string,
    amount: number,
    jobId: string,
  ): Promise<void> {
    await this.sendPushNotification(
      userId,
      'Payment Received',
      `You received BDT ${amount} for job ${jobId}`,
      { type: 'PAYMENT_RECEIVED', amount, jobId },
    );
  }
}
