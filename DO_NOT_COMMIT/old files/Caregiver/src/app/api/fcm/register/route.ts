import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { fcmService } from '@/lib/fcm-service';
import { z } from 'zod';

const registerDeviceSchema = z.object({
  fcmToken: z.string().min(1, 'FCM token is required'),
  deviceId: z.string().min(1, 'Device ID is required'),
  platform: z.enum(['android', 'ios', 'web']),
  appVersion: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }
    
    const user = (request as any).user;
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const validatedData = registerDeviceSchema.parse(body);

    // Register device with FCM service
    const success = await fcmService.registerDevice(
      user.id,
      validatedData.fcmToken,
      {
        deviceId: validatedData.deviceId,
        platform: validatedData.platform,
        appVersion: validatedData.appVersion,
      }
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to register device' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Device registered successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('FCM device registration error:', error);
    
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

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }
    
    const user = (request as any).user;

    // Get device ID from query or body
    const url = new URL(request.url);
    const deviceId = url.searchParams.get('deviceId');
    
    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID is required' },
        { status: 400 }
      );
    }

    // Unregister device
    const success = await fcmService.unregisterDevice(deviceId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to unregister device' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Device unregistered successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('FCM device unregistration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}