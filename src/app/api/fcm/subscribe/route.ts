import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { fcmService } from '@/lib/fcm-service';
import { z } from 'zod';

// Define UserRole enum locally
enum UserRole {
  SUPER_ADMIN,
  MODERATOR,
  COMPANY,
  CAREGIVER,
  GUARDIAN,
  PATIENT
}

const subscribeSchema = z.object({
  topic: z.string().min(1, 'Topic name is required'),
});

// Only authenticated users can subscribe to topics
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    const user = (request as any).user;

    // Parse request body
    const body = await request.json();
    const validatedData = subscribeSchema.parse(body);

    // Subscribe user to topic
    const success = await fcmService.subscribeToTopic(validatedData.topic, user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to subscribe to topic' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Successfully subscribed to topic: ${validatedData.topic}` 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('FCM subscribe error:', error);
    
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

// Only authenticated users can unsubscribe from topics
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    const user = (request as any).user;

    // Get topic from query or body
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic');
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic name is required' },
        { status: 400 }
      );
    }

    // Unsubscribe user from topic
    const success = await fcmService.unsubscribeFromTopic(topic, user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to unsubscribe from topic' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Successfully unsubscribed from topic: ${topic}` 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('FCM unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}