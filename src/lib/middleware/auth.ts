import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, extractTokenFromHeader, UserRole } from '@/lib/auth';
import { getUserById } from '@/lib/db-utils';
import {
  hasResourcePermission,
  canPerformAction,
  canAccessResource,
  canAccessOwnResource,
  isRoleHigherOrEqual
} from '@/lib/rbac';

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
    role: UserRole;
    phone: string;
    email?: string;
    name?: string;
  };
}

export async function authenticate(request: NextRequest): Promise<NextResponse | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || undefined);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 401 }
      );
    }
    
    // Verify token
    const payload = verifyAccessToken(token);
    
    // Get user from database to ensure they still exist and are active
    const user = await getUserById(payload.userId);
    
    if (!user || !user.is_active) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Attach user to request for use in route handlers
    (request as any).user = {
      id: user.id,
      role: user.role as UserRole,
      phone: user.phone,
      email: user.email || undefined,
      name: user.name,
    };
    
    return null; // Continue to the actual route handler
    
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

export function authorize(allowedRoles: UserRole[]) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const authResult = await authenticate(request);
    
    if (authResult) {
      return authResult; // Authentication failed
    }
    
    const user = (request as any).user;
    
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return null; // User is authorized
  };
}

export function authorizePermission(permission: string) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const authResult = await authenticate(request);
    
    if (authResult) {
      return authResult; // Authentication failed
    }
    
    const user = (request as any).user;
    
    // Import hasPermission function
    const { hasPermission } = await import('@/lib/auth');
    
    if (!hasPermission(user.role, permission)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return null; // User is authorized
  };
}

// Helper function to get current user from request
export function getCurrentUser(request: NextRequest) {
  return (request as any).user;
}

// Enhanced RBAC middleware functions
export function authorizeResource(resource: string, action: 'read' | 'write' | 'delete' | 'manage') {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const authResult = await authenticate(request);
    
    if (authResult) {
      return authResult; // Authentication failed
    }
    
    const user = (request as any).user;
    
    if (!canAccessResource(user.role, resource, action)) {
      return NextResponse.json(
        { error: `Insufficient permissions to ${action} ${resource}` },
        { status: 403 }
      );
    }
    
    return null; // User is authorized
  };
}

export function authorizeOwnResource(resource: string, action: 'read' | 'write' | 'delete' | 'manage', ownerIdField: string = 'userId') {
  return async (request: NextRequest, resourceId?: string): Promise<NextResponse | null> => {
    const authResult = await authenticate(request);
    
    if (authResult) {
      return authResult; // Authentication failed
    }
    
    const user = (request as any).user;
    
    // Check if user has general permission first
    if (canAccessResource(user.role, resource, action)) {
      return null; // User is authorized via general permission
    }
    
    // Check if user has own resource permission
    if (canAccessOwnResource(user.role, resource, action)) {
      // For own resources, we need to verify ownership
      // This would typically involve checking the resource owner from the database
      // For now, we'll assume the URL parameter or request body contains the owner info
      const url = new URL(request.url);
      const resourceUserId = url.searchParams.get(ownerIdField) ||
                             (request.body && JSON.parse(request.body)[ownerIdField]);
      
      if (resourceUserId === user.id) {
        return null; // User is authorized for their own resource
      }
    }
    
    return NextResponse.json(
      { error: `Insufficient permissions to ${action} ${resource}` },
      { status: 403 }
    );
  };
}

export function authorizeRoleHierarchy(minimumRole: UserRole) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const authResult = await authenticate(request);
    
    if (authResult) {
      return authResult; // Authentication failed
    }
    
    const user = (request as any).user;
    
    if (!isRoleHigherOrEqual(user.role, minimumRole)) {
      return NextResponse.json(
        { error: `Insufficient role privileges. Required: ${minimumRole}` },
        { status: 403 }
      );
    }
    
    return null; // User is authorized
  };
}

export function authorizeCustom(permissionChecker: (user: any, request: NextRequest) => boolean | Promise<boolean>) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const authResult = await authenticate(request);
    
    if (authResult) {
      return authResult; // Authentication failed
    }
    
    const user = (request as any).user;
    
    const isAuthorized = await permissionChecker(user, request);
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return null; // User is authorized
  };
}

// Utility function to check if user can perform action on entity
export function canUserPerformAction(user: any, action: string, entityType: string, isOwner: boolean = false): boolean {
  return canPerformAction(user.role, action, entityType, isOwner);
}

// Utility function to get user permissions
export function getUserPermissions(userRole: UserRole): string[] {
  const { getRolePermissions } = require('@/lib/rbac');
  return getRolePermissions(userRole);
}