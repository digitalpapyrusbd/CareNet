import { NextRequest, NextResponse } from 'next/server';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get notification settings for the current user
export async function GET(request: NextRequest) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const currentUser = getCurrentUser(request);

  try {
    // For now, return default notification settings
    // In a real implementation, you might have a separate table for notification settings
    const defaultSettings = {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      inAppNotifications: true,
      jobUpdates: true,
      paymentUpdates: true,
      careLogUpdates: true,
      systemUpdates: true,
      marketingEmails: false,
    };

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: defaultSettings,
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    await prisma.$disconnect();

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update notification settings for the current user
export async function PUT(request: NextRequest) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const currentUser = getCurrentUser(request);

  try {
    const body = await request.json();
    
    // Validate settings
    const allowedSettings = [
      'emailNotifications',
      'smsNotifications',
      'pushNotifications',
      'inAppNotifications',
      'jobUpdates',
      'paymentUpdates',
      'careLogUpdates',
      'systemUpdates',
      'marketingEmails',
    ];

    const settings: any = {};
    
    for (const key of allowedSettings) {
      if (body.hasOwnProperty(key)) {
        settings[key] = Boolean(body[key]);
      }
    }

    // For now, just return success
    // In a real implementation, you would save these settings to a database
    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Notification settings updated successfully',
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    await prisma.$disconnect();

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}