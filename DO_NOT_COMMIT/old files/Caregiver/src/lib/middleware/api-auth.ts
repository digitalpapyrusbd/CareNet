import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize, authorizeResource, authorizeOwnResource, getCurrentUser } from '@/lib/middleware/auth';
import { UserRole } from '@prisma/client';

// Higher-order function to wrap API routes with authentication
export function withAuth(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    // Authenticate the user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult; // Return authentication error response
    }
    
    // If authentication passes, call the original handler
    return handler(request, context);
  };
}

// Higher-order function to wrap API routes with role-based authorization
export function withRoles(allowedRoles: UserRole[]) {
  return function(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
    return async (request: NextRequest, context?: any): Promise<NextResponse> => {
      // First authenticate
      const authResult = await authenticate(request);
      if (authResult) {
        return authResult;
      }
      
      // Then authorize by role
      const roleAuthResult = await authorize(allowedRoles)(request);
      if (roleAuthResult) {
        return roleAuthResult;
      }
      
      // If both pass, call the original handler
      return handler(request, context);
    };
  };
}

// Higher-order function to wrap API routes with resource-based authorization
export function withResourceAuth(resource: string, action: 'read' | 'write' | 'delete' | 'manage') {
  return function(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
    return async (request: NextRequest, context?: any): Promise<NextResponse> => {
      // First authenticate
      const authResult = await authenticate(request);
      if (authResult) {
        return authResult;
      }
      
      // Then authorize by resource
      const resourceAuthResult = await authorizeResource(resource, action)(request);
      if (resourceAuthResult) {
        return resourceAuthResult;
      }
      
      // If both pass, call the original handler
      return handler(request, context);
    };
  };
}

// Higher-order function for own resource authorization
export function withOwnResourceAuth(resource: string, action: 'read' | 'write' | 'delete' | 'manage', ownerIdField: string = 'userId') {
  return function(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
    return async (request: NextRequest, context?: any): Promise<NextResponse> => {
      // First authenticate
      const authResult = await authenticate(request);
      if (authResult) {
        return authResult;
      }
      
      // Then authorize by own resource
      const ownResourceAuthResult = await authorizeOwnResource(resource, action, ownerIdField)(request);
      if (ownResourceAuthResult) {
        return ownResourceAuthResult;
      }
      
      // If both pass, call the original handler
      return handler(request, context);
    };
  };
}

// Combined auth middleware for multiple authorization types
export function withAuthAndPermissions(options: {
  roles?: UserRole[];
  resource?: { resource: string; action: 'read' | 'write' | 'delete' | 'manage' };
  ownResource?: { resource: string; action: 'read' | 'write' | 'delete' | 'manage'; ownerIdField?: string };
}) {
  return function(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
    return async (request: NextRequest, context?: any): Promise<NextResponse> => {
      // Always authenticate first
      const authResult = await authenticate(request);
      if (authResult) {
        return authResult;
      }
      
      // Check role-based authorization if specified
      if (options.roles) {
        const roleAuthResult = await authorize(options.roles)(request);
        if (roleAuthResult) {
          return roleAuthResult;
        }
      }
      
      // Check resource-based authorization if specified
      if (options.resource) {
        const resourceAuthResult = await authorizeResource(options.resource.resource, options.resource.action)(request);
        if (resourceAuthResult) {
          return resourceAuthResult;
        }
      }
      
      // Check own resource authorization if specified
      if (options.ownResource) {
        const ownResourceAuthResult = await authorizeOwnResource(
          options.ownResource.resource, 
          options.ownResource.action, 
          options.ownResource.ownerIdField
        )(request);
        if (ownResourceAuthResult) {
          return ownResourceAuthResult;
        }
      }
      
      // If all checks pass, call the original handler
      return handler(request, context);
    };
  };
}

// Optional auth middleware (doesn't return error if not authenticated)
export function withOptionalAuth(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    // Try to authenticate, but don't fail if no token is provided
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const authResult = await authenticate(request);
      if (!authResult) {
        // Authentication successful, user is attached to request
        return handler(request, context);
      }
    }
    
    // No authentication or failed, but we continue anyway
    return handler(request, context);
  };
}

// Middleware to add user context to request (for logging, analytics, etc.)
export function withUserContext(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    // Try to get user without requiring authentication
    const authHeader = request.headers.get('authorization');
    let user = null;
    
    if (authHeader) {
      const authResult = await authenticate(request);
      if (!authResult) {
        user = getCurrentUser(request);
      }
    }
    
    // Add user context to request metadata
    (request as any).userContext = {
      isAuthenticated: !!user,
      user,
      timestamp: new Date().toISOString(),
    };
    
    return handler(request, context);
  };
}

// Rate limiting middleware (basic implementation)
export function withRateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return function(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
    return async (request: NextRequest, context?: any): Promise<NextResponse> => {
      const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
      const now = Date.now();
      
      // Clean up expired entries
      for (const [ip, data] of requests.entries()) {
        if (now > data.resetTime) {
          requests.delete(ip);
        }
      }
      
      // Check current rate limit
      const current = requests.get(clientIp);
      if (current && current.count >= maxRequests && now < current.resetTime) {
        return NextResponse.json(
          { 
            error: 'Too many requests',
            retryAfter: Math.ceil((current.resetTime - now) / 1000)
          },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': current.resetTime.toString(),
            }
          }
        );
      }
      
      // Update request count
      if (current) {
        current.count++;
      } else {
        requests.set(clientIp, {
          count: 1,
          resetTime: now + windowMs,
        });
      }
      
      const response = await handler(request, context);
      
      // Add rate limit headers
      const rateLimitData = requests.get(clientIp);
      if (rateLimitData) {
        response.headers.set('X-RateLimit-Limit', maxRequests.toString());
        response.headers.set('X-RateLimit-Remaining', Math.max(0, maxRequests - rateLimitData.count).toString());
        response.headers.set('X-RateLimit-Reset', rateLimitData.resetTime.toString());
      }
      
      return response;
    };
  };
}

// CORS middleware for API routes
export function withCors(options: {
  origins?: string[];
  methods?: string[];
  headers?: string[];
  credentials?: boolean;
} = {}) {
  const {
    origins = ['*'],
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers = ['Content-Type', 'Authorization'],
    credentials = true,
  } = options;
  
  return function(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
    return async (request: NextRequest, context?: any): Promise<NextResponse> => {
      // Handle preflight requests
      if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 200 });
        
        response.headers.set('Access-Control-Allow-Origin', origins.join(', '));
        response.headers.set('Access-Control-Allow-Methods', methods.join(', '));
        response.headers.set('Access-Control-Allow-Headers', headers.join(', '));
        response.headers.set('Access-Control-Allow-Credentials', credentials.toString());
        
        return response;
      }
      
      // Handle actual requests
      const response = await handler(request, context);
      
      // Add CORS headers to response
      const origin = request.headers.get('origin');
      if (origins.includes('*') || (origin && origins.includes(origin))) {
        response.headers.set('Access-Control-Allow-Origin', origin || '*');
      }
      response.headers.set('Access-Control-Allow-Methods', methods.join(', '));
      response.headers.set('Access-Control-Allow-Headers', headers.join(', '));
      response.headers.set('Access-Control-Allow-Credentials', credentials.toString());
      
      return response;
    };
  };
}

// Error handling middleware
export function withErrorHandler(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);
      
      // Handle different types of errors
      if (error instanceof Error) {
        // Validation errors
        if (error.message.includes('Validation')) {
          return NextResponse.json(
            { error: 'Validation failed', details: error.message },
            { status: 400 }
          );
        }
        
        // Authentication errors
        if (error.message.includes('Authentication') || error.message.includes('Unauthorized')) {
          return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 401 }
          );
        }
        
        // Authorization errors
        if (error.message.includes('Permission') || error.message.includes('Forbidden')) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          );
        }
        
        // Not found errors
        if (error.message.includes('Not found')) {
          return NextResponse.json(
            { error: 'Resource not found' },
            { status: 404 }
          );
        }
      }
      
      // Default error response
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Request logging middleware
export function withRequestLogging(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const startTime = Date.now();
    const url = new URL(request.url);
    
    // Log request start
    console.log(`🚀 ${request.method} ${url.pathname} - Started`);
    
    try {
      const response = await handler(request, context);
      const duration = Date.now() - startTime;
      
      // Log request completion
      console.log(`✅ ${request.method} ${url.pathname} - ${response.status} (${duration}ms)`);
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Log request error
      console.log(`❌ ${request.method} ${url.pathname} - Error (${duration}ms)`, error);
      
      throw error;
    }
  };
}