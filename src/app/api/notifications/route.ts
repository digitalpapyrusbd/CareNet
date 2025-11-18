import { NextRequest, NextResponse } from 'next/server';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const currentUser = getCurrentUser(request);
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const unreadOnly = searchParams.get('unreadOnly') === 'true';
  
  try {
    // Build where clause
    const where: any = {
      userId: currentUser.id,
    };
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (unreadOnly) {
      where.readAt = null;
    }
    
    // Get total count
    const total = await prisma.notification.count({ where });
    
    // Get notifications with pagination
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    // Mark notifications as read if requested
    if (searchParams.get('markAsRead') === 'true') {
      await prisma.notification.updateMany({
        where: {
          ...where,
          readAt: null,
        },
        data: {
          readAt: new Date(),
        },
      });
    }
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Get notifications error:', error);
    await prisma.$disconnect();
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const currentUser = getCurrentUser(request);

  // Only companies and moderators can create notifications
  if (currentUser.role !== 'COMPANY' && currentUser.role !== 'MODERATOR' && currentUser.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Only companies and moderators can create notifications' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { userId, type, channel, title, body: notificationBody, data } = body;
    
    // Validate required fields
    if (!userId || !type || !notificationBody) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, type, body' },
        { status: 400 }
      );
    }
    
    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        channel: channel || type,
        title,
        body: notificationBody,
        data: data || {},
        status: 'PENDING',
      },
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Notification created successfully',
    });
    
  } catch (error) {
    console.error('Create notification error:', error);
    await prisma.$disconnect();
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}