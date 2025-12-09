import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';
import { 
  getUserSessions, 
  deleteUserSessions, 
  deleteSession, 
  getSessionStats,
  extendSession 
} from '@/lib/session';

// Validation schemas
const deleteSessionsSchema = z.object({
  sessionIds: z.array(z.string()).optional(),
  allSessions: z.boolean().optional(),
  exceptCurrent: z.boolean().optional(),
});

const extendSessionSchema = z.object({
  sessionId: z.string(),
  rememberMe: z.boolean().optional(),
});

// GET /api/sessions - Get user's active sessions
export async function GET(request: NextRequest) {
  // Authenticate user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const user = getCurrentUser(request);
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  
  try {
    // Handle different actions
    switch (action) {
      case 'stats':
        // Only admins can get session statistics
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'MODERATOR') {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          );
        }
        
        const stats = await getSessionStats();
        return NextResponse.json({
          message: 'Session statistics retrieved successfully',
          stats
        });
        
      default:
        // Get user's own sessions
        const sessions = await getUserSessions(user.id);
        
        // Sanitize session data for response
        const sanitizedSessions = sessions.map(session => ({
          id: session.id,
          deviceInfo: session.deviceInfo,
          lastActivity: session.lastActivity,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
          isCurrent: false, // Will be set on client side
          mfaVerified: session.mfaVerified,
        }));
        
        return NextResponse.json({
          message: 'Sessions retrieved successfully',
          sessions: sanitizedSessions,
          total: sanitizedSessions.length,
        });
    }
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions - Delete user sessions
export async function DELETE(request: NextRequest) {
  // Authenticate user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const user = getCurrentUser(request);
  
  try {
    const body = await request.json();
    const validatedData = deleteSessionsSchema.parse(body);
    
    if (validatedData.allSessions) {
      // Delete all sessions
      await deleteUserSessions(user.id);
      
      return NextResponse.json({
        message: 'All sessions deleted successfully',
        deletedCount: 'all',
      });
    } else if (validatedData.sessionIds && validatedData.sessionIds.length > 0) {
      // Delete specific sessions
      let deletedCount = 0;
      for (const sessionId of validatedData.sessionIds) {
        await deleteSession(sessionId);
        deletedCount++;
      }
      
      return NextResponse.json({
        message: 'Sessions deleted successfully',
        deletedCount,
        deletedSessionIds: validatedData.sessionIds,
      });
    } else if (validatedData.exceptCurrent) {
      // Delete all sessions except current
      const url = new URL(request.url);
      const currentSessionId = url.searchParams.get('current');
      
      await deleteUserSessions(user.id, currentSessionId || undefined);
      
      return NextResponse.json({
        message: 'Other sessions deleted successfully',
        deletedCount: 'others',
      });
    } else {
      return NextResponse.json(
        { error: 'No valid deletion criteria provided' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Session deletion error:', error);
    
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

// PUT /api/sessions - Extend session or update session properties
export async function PUT(request: NextRequest) {
  // Authenticate user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const user = getCurrentUser(request);
  
  try {
    const body = await request.json();
    const validatedData = extendSessionSchema.parse(body);
    
    // Verify user owns the session
    const userSessions = await getUserSessions(user.id);
    const sessionExists = userSessions.some(s => s.id === validatedData.sessionId);
    
    if (!sessionExists) {
      return NextResponse.json(
        { error: 'Session not found or does not belong to user' },
        { status: 404 }
      );
    }
    
    // Extend session
    const extended = await extendSession(validatedData.sessionId, validatedData.rememberMe);
    
    if (!extended) {
      return NextResponse.json(
        { error: 'Failed to extend session' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Session extended successfully',
      sessionId: validatedData.sessionId,
      rememberMe: validatedData.rememberMe || false,
    });
  } catch (error) {
    console.error('Session extension error:', error);
    
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