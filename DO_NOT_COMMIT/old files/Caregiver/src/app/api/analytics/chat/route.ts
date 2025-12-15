import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/middleware/auth';
import { UserRole } from '@/lib/middleware/auth';
import { chatAnalyticsService } from '@/lib/chat-analytics';
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

const getMetricsSchema = z.object({
  userId: z.string().optional(),
  dateRange: z.object({
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional(),
  }).optional(),
});

// Only authenticated and authorized users can access analytics
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    // Authorize specific roles to access analytics
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
    const validatedData = getMetricsSchema.parse(body);

    // Get chat metrics
    const dateRange = validatedData.dateRange ? {
      start: validatedData.dateRange.start ? new Date(validatedData.dateRange.start) : undefined,
      end: validatedData.dateRange.end ? new Date(validatedData.dateRange.end) : undefined,
    } : undefined;

    const metrics = await chatAnalyticsService.getChatMetrics(
      validatedData.userId,
      dateRange
    );

    return NextResponse.json(
      {
        success: true,
        data: metrics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Chat analytics error:', error);
    
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

// Get user's chat sessions
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    // Authorize specific roles to access analytics
    const authzResult = await authorize([
      UserRole.SUPER_ADMIN,
      UserRole.MODERATOR,
      UserRole.COMPANY
    ])(request);
    
    if (authzResult) {
      return authzResult;
    }

    const user = (request as any).user;

    // Get user ID from query or use authenticated user
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId') || user.id;

    // Get chat sessions for user
    const sessions = await chatAnalyticsService.getUserSessions(userId);

    return NextResponse.json(
      {
        success: true,
        data: sessions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get chat sessions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get detailed session information
export async function GET_SESSION(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    // Authorize specific roles to access analytics
    const authzResult = await authorize([
      UserRole.SUPER_ADMIN,
      UserRole.MODERATOR,
      UserRole.COMPANY
    ])(request);
    
    if (authzResult) {
      return authzResult;
    }

    // Get session ID from query
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get detailed session information
    const session = await chatAnalyticsService.getSession(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get platform-wide analytics
export async function GET_PLATFORM(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    // Authorize admin roles only
    const authzResult = await authorize([
      UserRole.SUPER_ADMIN,
      UserRole.MODERATOR
    ])(request);
    
    if (authzResult) {
      return authzResult;
    }

    // Get platform-wide metrics
    const metrics = await chatAnalyticsService.getChatMetrics();

    return NextResponse.json(
      {
        success: true,
        data: metrics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Platform analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}