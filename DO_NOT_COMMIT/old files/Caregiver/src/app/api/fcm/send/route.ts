import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { fcmService } from '@/lib/fcm-service';
import { z } from 'zod';

// Define UserRole enum locally since it's not exported from @prisma/client
enum UserRole {
  SUPER_ADMIN,
  MODERATOR,
  COMPANY,
  CAREGIVER,
  GUARDIAN,
  PATIENT
}

const sendNotificationSchema = z.object({
  userId: z.string().optional(),
  topic: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  data: z.record(z.string()).optional(),
  priority: z.enum(['high', 'normal']).default('normal'),
  imageUrl: z.string().url().optional(),
});

// Only authenticated and authorized users can send notifications
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    // Authorize specific roles to send notifications
    const authzResult = await authorize([
      UserRole.SUPER_ADMIN,
      UserRole.MODERATOR,
      UserRole.COMPANY
    ])(request);
    
    if (authzResult) {
      return authzResult;
    }

    const user = (request as any).user;

    // Parse request body
    const body = await request.json();
    const validatedData = sendNotificationSchema.parse(body);

    // Validate that either userId or topic is provided
    if (!validatedData.userId && !validatedData.topic) {
      return NextResponse.json(
        { error: 'Either userId or topic must be provided' },
        { status: 400 }
      );
    }

    let result;

    if (validatedData.userId) {
      // Send to specific user
      result = await fcmService.sendToUser(validatedData.userId, {
        notification: {
          title: validatedData.title,
          body: validatedData.body,
          imageUrl: validatedData.imageUrl,
        },
        data: validatedData.data || {},
        android: {
          priority: validatedData.priority,
          notification: {
            clickAction: 'OPEN_APP',
            channelId: 'general_notifications',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              category: 'GENERAL_NOTIFICATION',
            },
          },
        },
      });
    } else if (validatedData.topic) {
      // Send to topic
      result = await fcmService.sendToTopic(validatedData.topic, {
        notification: {
          title: validatedData.title,
          body: validatedData.body,
          imageUrl: validatedData.imageUrl,
        },
        data: validatedData.data || {},
        android: {
          priority: validatedData.priority,
          notification: {
            clickAction: 'OPEN_APP',
            channelId: 'general_notifications',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              category: 'GENERAL_NOTIFICATION',
            },
          },
        },
      });
    }

    if (!result || !result.success) {
      return NextResponse.json(
        { error: (result && result.error) || 'Failed to send notification' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messageId: (result && result.messageId) || '',
        failureCount: (result && result.failureCount) || 0
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('FCM send notification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}