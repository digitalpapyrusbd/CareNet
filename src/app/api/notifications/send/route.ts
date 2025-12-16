import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';
import notificationServiceInstance from '@/lib/notification-service';

// Validation schema
const sendNotificationSchema = z.object({
  userId: z.string(),
  type: z.enum(['SMS', 'EMAIL', 'PUSH', 'IN_APP']),
  recipient: z.string(),
  subject: z.string(),
  body: z.string(),
  data: z.any().optional(),
});

export async function POST(request: NextRequest) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const currentUser = getCurrentUser(request);

  // Only companies and moderators can send notifications
  if (currentUser.role !== 'COMPANY' && currentUser.role !== 'MODERATOR' && currentUser.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Only companies and moderators can send notifications' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = sendNotificationSchema.parse(body);

    // Send notification
    const notificationRequest = {
      userId: validatedData.userId,
      type: validatedData.type,
      recipient: validatedData.recipient,
      subject: validatedData.subject,
      body: validatedData.body,
      data: validatedData.data,
    };

    const result = await notificationServiceInstance.sendNotification(notificationRequest);

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      message: result.success ? 'Notification sent successfully' : 'Failed to send notification',
    });

  } catch (error) {
    console.error('Send notification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}