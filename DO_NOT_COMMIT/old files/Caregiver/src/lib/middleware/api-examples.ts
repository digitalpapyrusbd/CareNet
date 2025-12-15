import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import {
  withAuth,
  withRoles,
  withResourceAuth,
  withOwnResourceAuth,
  withAuthAndPermissions,
  withOptionalAuth,
  withUserContext,
  withRateLimit,
  withCors,
  withErrorHandler,
  withRequestLogging,
} from '@/lib/middleware/api-auth';
import { getCurrentUser } from '@/lib/middleware/auth';

// EXAMPLE 1: Basic Authentication
export const GET_withAuth = withAuth(async (request: NextRequest) => {
  const user = getCurrentUser(request);
  return NextResponse.json({ 
    message: 'Authenticated user data',
    user 
  });
});

// EXAMPLE 2: Role-based Authorization
export const GET_adminOnly = withRoles([UserRole.SUPER_ADMIN, UserRole.MODERATOR])(
  withErrorHandler(async (request: NextRequest) => {
    const user = getCurrentUser(request);
    return NextResponse.json({ 
      message: 'Admin access granted',
      user 
    });
  })
);

// EXAMPLE 3: Resource-based Authorization
export const POST_manageCompanies = withResourceAuth('companies', 'write')(
  withErrorHandler(async (request: NextRequest) => {
    const user = getCurrentUser(request);
    const body = await request.json();
    
    // Create or update company logic here
    return NextResponse.json({ 
      message: 'Company management action performed',
      user,
      data: body
    });
  })
);

// EXAMPLE 4: Own Resource Authorization
export const PUT_updateProfile = withOwnResourceAuth('users', 'write', 'userId')(
  withErrorHandler(async (request: NextRequest) => {
    const user = getCurrentUser(request);
    const body = await request.json();
    
    // Update user profile logic here
    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user,
      data: body
    });
  })
);

// EXAMPLE 5: Combined Authorization
export const DELETE_manageUser = withAuthAndPermissions({
  roles: [UserRole.SUPER_ADMIN, UserRole.MODERATOR],
  resource: { resource: 'users', action: 'delete' }
})(
  withErrorHandler(async (request: NextRequest) => {
    const user = getCurrentUser(request);
    const url = new URL(request.url);
    const targetUserId = url.searchParams.get('userId');
    
    // Delete user logic here
    return NextResponse.json({ 
      message: 'User deleted successfully',
      deletedBy: user.id,
      deletedUser: targetUserId
    });
  })
);

// EXAMPLE 6: Optional Authentication (public endpoint with user context)
export const GET_publicData = withOptionalAuth(
  withUserContext(async (request: NextRequest) => {
    const userContext = (request as any).userContext;
    
    // Return different data based on authentication status
    if (userContext.isAuthenticated) {
      return NextResponse.json({ 
        message: 'Authenticated user data',
        user: userContext.user,
        additionalData: 'premium content for authenticated users'
      });
    } else {
      return NextResponse.json({ 
        message: 'Public data',
        additionalData: 'basic content for anonymous users'
      });
    }
  })
);

// EXAMPLE 7: Rate Limited Endpoint
export const POST_rateLimited = withRateLimit(5, 60000)(
  withAuth(
    withErrorHandler(async (request: NextRequest) => {
      const user = getCurrentUser(request);
      const body = await request.json();
      
      // Process rate-limited action (e.g., sending notifications)
      return NextResponse.json({ 
        message: 'Rate-limited action performed',
        user,
        data: body
      });
    })
  )
);

// EXAMPLE 8: CORS-enabled Endpoint
export const OPTIONS_cors = withCors({
  origins: ['https://caregiver-platform.com', 'https://admin.caregiver-platform.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
})(async (request: NextRequest) => {
  return new NextResponse(null, { status: 200 });
});

export const GET_corsData = withCors({
  origins: ['https://caregiver-platform.com', 'https://admin.caregiver-platform.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
})(
  withAuth(async (request: NextRequest) => {
    const user = getCurrentUser(request);
    return NextResponse.json({ 
      message: 'CORS-enabled data',
      user 
    });
  })
);

// EXAMPLE 9: Complex Middleware Chain
export const GET_complexEndpoint = withRequestLogging(
  withRateLimit(100, 60000)(
    withCors({
      origins: ['*'],
      methods: ['GET'],
    })(
      withAuthAndPermissions({
        roles: [UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY],
      })(
        withErrorHandler(async (request: NextRequest) => {
          const user = getCurrentUser(request);
          const url = new URL(request.url);
          const filter = url.searchParams.get('filter') || 'all';
          
          // Complex business logic here
          return NextResponse.json({ 
            message: 'Complex endpoint executed successfully',
            user,
            filter,
            timestamp: new Date().toISOString()
          });
        })
      )
    )
  )
);

// EXAMPLE 10: File Upload with Multiple Authorizations
export const POST_uploadFile = withAuthAndPermissions({
  roles: [UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY, UserRole.CAREGIVER, UserRole.GUARDIAN],
  ownResource: { resource: 'files', action: 'write', ownerIdField: 'userId' }
})(
  withRateLimit(10, 60000)(
    withErrorHandler(async (request: NextRequest) => {
      const user = getCurrentUser(request);
      
      // Handle file upload logic here
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }
      
      // Process file upload
      const fileUrl = `/uploads/${user.id}/${file.name}`;
      
      return NextResponse.json({ 
        message: 'File uploaded successfully',
        user,
        fileName: file.name,
        fileUrl,
        fileSize: file.size
      });
    })
  )
);

// EXAMPLE 11: Dynamic Authorization based on Request
export const GET_dynamicAuth = withAuth(
  withErrorHandler(async (request: NextRequest) => {
    const user = getCurrentUser(request);
    const url = new URL(request.url);
    const resourceType = url.searchParams.get('resource') || 'users';
    const action = url.searchParams.get('action') || 'read';
    
    // Dynamic permission checking based on request parameters
    const { canPerformAction } = await import('@/lib/rbac');
    
    if (!canPerformAction(user.role, action, resourceType)) {
      return NextResponse.json(
        { error: `Insufficient permissions to ${action} ${resourceType}` },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ 
      message: `Successfully authorized to ${action} ${resourceType}`,
      user,
      resourceType,
      action
    });
  })
);

// EXAMPLE 12: Multi-tenant Authorization
export const GET_tenantData = withAuth(
  withErrorHandler(async (request: NextRequest) => {
    const user = getCurrentUser(request);
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    
    // Multi-tenant logic: users can only access their own tenant data
    if (user.role === UserRole.COMPANY && user.companyId !== tenantId) {
      return NextResponse.json(
        { error: 'Cannot access data from different tenant' },
        { status: 403 }
      );
    }
    
    if (user.role === UserRole.CAREGIVER && user.companyId !== tenantId) {
      return NextResponse.json(
        { error: 'Cannot access data from different company' },
        { status: 403 }
      );
    }
    
    // Admins and moderators can access any tenant data
    return NextResponse.json({ 
      message: 'Tenant data accessed successfully',
      user,
      tenantId,
      data: `Data for tenant ${tenantId}`
    });
  })
);

// EXAMPLE 13: Conditional Middleware based on Environment
const isDevelopment = process.env.NODE_ENV === 'development';

export const GET_debugEndpoint = withErrorHandler(
  isDevelopment ? withAuth(async (request: NextRequest) => {
    const user = getCurrentUser(request);
    const url = new URL(request.url);
    
    // Debug information (only in development)
    return NextResponse.json({ 
      message: 'Debug information',
      user,
      headers: Object.fromEntries(request.headers.entries()),
      searchParams: Object.fromEntries(url.searchParams.entries()),
      timestamp: new Date().toISOString()
    });
  }) : async (request: NextRequest) => {
    return NextResponse.json(
      { error: 'Debug endpoint not available in production' },
      { status: 404 }
    );
  }
);

// EXAMPLE 14: API Versioning with Middleware
export const GET_v1Data = withAuth(
  withRequestLogging(async (request: NextRequest) => {
    const user = getCurrentUser(request);
    
    return NextResponse.json({ 
      message: 'API v1 data',
      version: 'v1',
      user,
      data: 'Legacy API response'
    });
  })
);

export const GET_v2Data = withAuth(
  withRequestLogging(async (request: NextRequest) => {
    const user = getCurrentUser(request);
    
    return NextResponse.json({ 
      message: 'API v2 data',
      version: 'v2',
      user,
      data: 'Enhanced API response with additional fields',
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      }
    });
  })
);

// EXAMPLE 15: Health Check with Optional Auth
export const GET_health = withOptionalAuth(
  withUserContext(async (request: NextRequest) => {
    const userContext = (request as any).userContext;
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      authenticated: userContext.isAuthenticated,
      user: userContext.isAuthenticated ? {
        id: userContext.user.id,
        role: userContext.user.role,
      } : null,
    };
    
    return NextResponse.json(healthStatus);
  })
);