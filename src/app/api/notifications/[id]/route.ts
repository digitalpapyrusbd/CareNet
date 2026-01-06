import { NextRequest, NextResponse } from 'next/server';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get a single notification
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const currentUser = getCurrentUser(request);
  const notificationId = (await params).id;

  try {
    const notification = await prisma.notifications.findFirst({
      where: {
        id: notificationId,
        userId: currentUser.id,
      },
    });

    if (!notification) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error('Get notification error:', error);
    await prisma.$disconnect();

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mark notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const currentUser = getCurrentUser(request);
  const notificationId = (await params).id;

  try {
    const body = await request.json();
    const { read } = body;

    // Check if notification belongs to current user
    const notification = await prisma.notifications.findFirst({
      where: {
        id: notificationId,
        userId: currentUser.id,
      },
    });

    if (!notification) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    // Update notification
    const updatedNotification = await prisma.notifications.update({
      where: { id: notificationId },
      data: {
        read_at: read === true ? new Date() : null,
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: updatedNotification,
      message: read === true ? 'Notification marked as read' : 'Notification marked as unread',
    });
  } catch (error) {
    console.error('Update notification error:', error);
    await prisma.$disconnect();

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const currentUser = getCurrentUser(request);
  const notificationId = (await params).id;

  try {
    // Check if notification belongs to current user
    const notification = await prisma.notifications.findFirst({
      where: {
        id: notificationId,
        userId: currentUser.id,
      },
    });

    if (!notification) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    // Delete notification
    await prisma.notifications.delete({
      where: { id: notificationId },
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    await prisma.$disconnect();

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}