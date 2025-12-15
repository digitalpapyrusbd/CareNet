import admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App | null = null;

export interface FCMMessage {
  token?: string;
  topic?: string;
  condition?: string;
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
  };
  data?: Record<string, string>;
  android?: {
    priority?: 'high' | 'normal';
    notification?: {
      sound?: string;
      clickAction?: string;
      channelId?: string;
    };
  };
  apns?: {
    payload?: {
      aps?: {
        sound?: string;
        category?: string;
        'content-available'?: number;
      };
    };
  };
}

export interface FCMResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  failureCount?: number;
  results?: any[];
}

export class FCMService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    if (firebaseApp) {
      return;
    }

    try {
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      
      if (!serviceAccountKey) {
        console.warn('Firebase service account key not provided. Push notifications will be disabled.');
        return;
      }

      const serviceAccount = JSON.parse(serviceAccountKey);
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });

      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error);
    }
  }

  async sendToUser(userId: string, message: FCMMessage): Promise<FCMResponse> {
    if (!firebaseApp) {
      return {
        success: false,
        error: 'Firebase not initialized',
      };
    }

    try {
      // Get user's FCM tokens from database
      const userTokens = await this.prisma.userDevice.findMany({
        where: {
          userId,
          isActive: true,
        },
        select: {
          fcmToken: true,
        },
      });

      if (userTokens.length === 0) {
        return {
          success: false,
          error: 'No active device tokens found for user',
        };
      }

      const tokens = userTokens.map((ut: any) => ut.fcmToken);
      
      // Send multicast message to all user devices
      const response = await admin.messaging().sendMulticast({
        tokens,
        notification: message.notification,
        data: message.data,
        android: message.android,
        apns: message.apns as any,
      });

      // Handle invalid tokens
      if (response.failureCount > 0) {
        await this.handleInvalidTokens(response.results, tokens);
      }

      return {
        success: response.failureCount === 0,
        messageId: (response.responses[0] as any)?.messageId,
        failureCount: response.failureCount,
        results: response.results,
      };
    } catch (error) {
      console.error('Error sending push notification to user:', error);
      return {
        success: false,
        error: 'Failed to send push notification',
      };
    }
  }

  async sendToTopic(topic: string, message: FCMMessage): Promise<FCMResponse> {
    if (!firebaseApp) {
      return {
        success: false,
        error: 'Firebase not initialized',
      };
    }

    try {
      const response = await admin.messaging().send({
        topic,
        notification: message.notification,
        data: message.data,
        android: message.android,
        apns: message.apns as any,
      });

      return {
        success: true,
        messageId: response as string,
      };
    } catch (error) {
      console.error('Error sending push notification to topic:', error);
      return {
        success: false,
        error: 'Failed to send push notification to topic',
      };
    }
  }

  async subscribeToTopic(topic: string, userId: string): Promise<boolean> {
    if (!firebaseApp) {
      return false;
    }

    try {
      const userTokens = await this.prisma.userDevice.findMany({
        where: {
          userId,
          isActive: true,
        },
        select: {
          fcmToken: true,
        },
      });

      if (userTokens.length === 0) {
        return false;
      }

      const tokens = userTokens.map((ut: any) => ut.fcmToken);
      
      const response = await admin.messaging().subscribeToTopic(tokens, topic);
      
      return response.failureCount === 0;
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      return false;
    }
  }

  async unsubscribeFromTopic(topic: string, userId: string): Promise<boolean> {
    if (!firebaseApp) {
      return false;
    }

    try {
      const userTokens = await this.prisma.userDevice.findMany({
        where: {
          userId,
          isActive: true,
        },
        select: {
          fcmToken: true,
        },
      });

      if (userTokens.length === 0) {
        return false;
      }

      const tokens = userTokens.map((ut: any) => ut.fcmToken);
      
      const response = await admin.messaging().unsubscribeFromTopic(tokens, topic);
      
      return response.failureCount === 0;
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      return false;
    }
  }

  async registerDevice(userId: string, fcmToken: string, deviceInfo: {
    deviceId: string;
    platform: 'android' | 'ios' | 'web';
    appVersion?: string;
  }): Promise<boolean> {
    try {
      // Upsert device token
      await this.prisma.userDevice.upsert({
        where: {
          deviceId: deviceInfo.deviceId,
        },
        update: {
          fcmToken,
          isActive: true,
          lastSeenAt: new Date(),
          appVersion: deviceInfo.appVersion,
        },
        create: {
          userId,
          deviceId: deviceInfo.deviceId,
          fcmToken,
          platform: deviceInfo.platform,
          isActive: true,
          appVersion: deviceInfo.appVersion,
        },
      });

      return true;
    } catch (error) {
      console.error('Error registering device:', error);
      return false;
    }
  }

  async unregisterDevice(deviceId: string): Promise<boolean> {
    try {
      await this.prisma.userDevice.update({
        where: {
          deviceId,
        },
        data: {
          isActive: false,
        },
      });

      return true;
    } catch (error) {
      console.error('Error unregistering device:', error);
      return false;
    }
  }

  private async handleInvalidTokens(results: any[], tokens: string[]): Promise<void> {
    const invalidTokens: string[] = [];
    
    results.forEach((result, index) => {
      if (result.error && 
          (result.error.code === 'messaging/registration-token-not-registered' ||
           result.error.code === 'messaging/invalid-registration-token')) {
        invalidTokens.push(tokens[index]);
      }
    });

    if (invalidTokens.length > 0) {
      await this.prisma.userDevice.updateMany({
        where: {
          fcmToken: {
            in: invalidTokens,
          },
        },
        data: {
          isActive: false,
        },
      });
    }
  }

  async createTopic(topicName: string): Promise<boolean> {
    if (!firebaseApp) {
      return false;
    }

    try {
      // Firebase automatically creates topics when they're first used
      // So we just need to verify the topic name format
      if (!/^[a-zA-Z0-9-_.~%]+$/.test(topicName)) {
        throw new Error('Invalid topic name format');
      }

      return true;
    } catch (error) {
      console.error('Error creating topic:', error);
      return false;
    }
  }

  isInitialized(): boolean {
    return firebaseApp !== null;
  }

  // Predefined notification templates
  async sendJobAssignmentNotification(userId: string, jobData: any): Promise<FCMResponse> {
    return this.sendToUser(userId, {
      notification: {
        title: 'New Job Assignment',
        body: `You have been assigned a new job: ${jobData.title}`,
      },
      data: {
        type: 'job_assignment',
        jobId: jobData.id,
        action: 'view_job',
      },
      android: {
        priority: 'high',
        notification: {
          clickAction: 'VIEW_JOB',
          channelId: 'job_assignments',
        },
      },
    });
  }

  async sendPaymentNotification(userId: string, paymentData: any): Promise<FCMResponse> {
    return this.sendToUser(userId, {
      notification: {
        title: 'Payment Received',
        body: `You have received a payment of ${paymentData.amount} BDT`,
      },
      data: {
        type: 'payment',
        paymentId: paymentData.id,
        amount: paymentData.amount.toString(),
        action: 'view_payment',
      },
      android: {
        priority: 'normal',
        notification: {
          clickAction: 'VIEW_PAYMENT',
          channelId: 'payments',
        },
      },
    });
  }

  async sendEmergencyAlert(userId: string, alertData: any): Promise<FCMResponse> {
    return this.sendToUser(userId, {
      notification: {
        title: 'Emergency Alert',
        body: alertData.message,
      },
      data: {
        type: 'emergency',
        alertId: alertData.id,
        severity: alertData.severity,
        action: 'view_alert',
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'emergency',
          clickAction: 'VIEW_EMERGENCY',
          channelId: 'emergency_alerts',
        },
      },
    });
  }
}

export const fcmService = new FCMService();