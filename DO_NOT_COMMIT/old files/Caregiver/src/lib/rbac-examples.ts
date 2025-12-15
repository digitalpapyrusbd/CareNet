import { NextRequest, NextResponse } from 'next/server';
import { 
  authenticate, 
  authorize, 
  authorizeResource, 
  authorizeOwnResource,
  authorizeRoleHierarchy,
  getCurrentUser 
} from '@/lib/middleware/auth';
import { UserRole } from '@prisma/client';
import { 
  hasResourcePermission, 
  canPerformAction, 
  getRolePermissions,
  getRoleDisplayName 
} from '@/lib/rbac';

// EXAMPLE 1: Basic Role-based Authorization
export async function exampleBasicRoleAuth(request: NextRequest) {
  // Only allow Super Admin and Moderator
  const authResult = await authorize([UserRole.SUPER_ADMIN, UserRole.MODERATOR])(request);
  if (authResult) return authResult;
  
  const user = getCurrentUser(request);
  return NextResponse.json({ message: `Welcome ${user.name}!` });
}

// EXAMPLE 2: Resource-based Authorization
export async function exampleResourceAuth(request: NextRequest) {
  // Only users who can write to companies resource
  const authResult = await authorizeResource('companies', 'write')(request);
  if (authResult) return authResult;
  
  const user = getCurrentUser(request);
  return NextResponse.json({ message: 'You can manage companies' });
}

// EXAMPLE 3: Own Resource Authorization
export async function exampleOwnResourceAuth(request: NextRequest) {
  // Users can only manage their own profile
  const authResult = await authorizeOwnResource('users', 'write', 'userId')(request);
  if (authResult) return authResult;
  
  const user = getCurrentUser(request);
  return NextResponse.json({ message: 'You can manage your own profile' });
}

// EXAMPLE 4: Role Hierarchy Authorization
export async function exampleRoleHierarchyAuth(request: NextRequest) {
  // Only users with Moderator role or higher
  const authResult = await authorizeRoleHierarchy(UserRole.MODERATOR)(request);
  if (authResult) return authResult;
  
  const user = getCurrentUser(request);
  return NextResponse.json({ message: 'You have moderator privileges or higher' });
}

// EXAMPLE 5: Custom Authorization Logic
export async function exampleCustomAuth(request: NextRequest) {
  const authResult = await authenticate(request);
  if (authResult) return authResult;
  
  const user = getCurrentUser(request);
  const url = new URL(request.url);
  const targetUserId = url.searchParams.get('targetUserId');
  
  // Custom logic: Users can only view profiles of users in same company
  const canViewProfile = async (user: any, request: NextRequest) => {
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MODERATOR) {
      return true; // Admins can view any profile
    }
    
    // For companies, check if target user belongs to their company
    if (user.role === UserRole.COMPANY) {
      // This would typically involve a database query
      // For demo purposes, we'll assume a function exists
      // const targetUser = await getUserById(targetUserId);
      // return targetUser?.companyId === user.companyId;
      return true; // Simplified for demo
    }
    
    return false;
  };
  
  if (!await canViewProfile(user, request)) {
    return NextResponse.json(
      { error: 'You cannot view this user profile' },
      { status: 403 }
    );
  }
  
  return NextResponse.json({ message: 'Profile access granted' });
}

// EXAMPLE 6: API Route with Multiple Authorization Checks
export async function exampleComplexApiRoute(request: NextRequest) {
  // First, authenticate the user
  const authResult = await authenticate(request);
  if (authResult) return authResult;
  
  const user = getCurrentUser(request);
  const url = new URL(request.url);
  const action = url.searchParams.get('action') || 'read';
  const resourceType = url.searchParams.get('resource') || 'users';
  const isOwner = url.searchParams.get('isOwner') === 'true';
  
  // Check if user can perform the action on the resource
  if (!canPerformAction(user.role, action, resourceType, isOwner)) {
    return NextResponse.json(
      { 
        error: `Insufficient permissions to ${action} ${resourceType}`,
        requiredPermissions: getRolePermissions(user.role),
        userRole: getRoleDisplayName(user.role)
      },
      { status: 403 }
    );
  }
  
  return NextResponse.json({ 
    message: `Successfully authorized to ${action} ${resourceType}`,
    userRole: user.role,
    permissions: getRolePermissions(user.role)
  });
}

// EXAMPLE 7: Permission Checking Helper Functions
export function examplePermissionChecks(userRole: UserRole) {
  console.log(`=== Permission Check for ${getRoleDisplayName(userRole)} ===`);
  
  // Check specific permissions
  const canManageUsers = hasResourcePermission(userRole, 'users:write');
  const canVerifyCaregivers = hasResourcePermission(userRole, 'caregivers:verify');
  const canCreateJobs = hasResourcePermission(userRole, 'jobs:write');
  const canViewAnalytics = hasResourcePermission(userRole, 'analytics:read');
  
  console.log(`Can manage users: ${canManageUsers}`);
  console.log(`Can verify caregivers: ${canVerifyCaregivers}`);
  console.log(`Can create jobs: ${canCreateJobs}`);
  console.log(`Can view analytics: ${canViewAnalytics}`);
  
  // Get all permissions for the role
  const allPermissions = getRolePermissions(userRole);
  console.log(`All permissions:`, allPermissions);
  
  return {
    canManageUsers,
    canVerifyCaregivers,
    canCreateJobs,
    canViewAnalytics,
    allPermissions
  };
}

// EXAMPLE 8: Frontend Permission Checking (for UI components)
export function exampleFrontendPermissions(user: { role: UserRole; id: string }) {
  // These functions can be used in React components to conditionally render UI
  
  const canEditProfile = (profileUserId: string) => {
    return canPerformAction(user.role, 'write', 'users', user.id === profileUserId);
  };
  
  const canViewJobDetails = (jobGuardianId: string) => {
    return canPerformAction(user.role, 'read', 'jobs', user.id === jobGuardianId);
  };
  
  const canManageCompany = (companyId: string) => {
    return hasResourcePermission(user.role, 'companies:write') && 
           (user.role === UserRole.SUPER_ADMIN || user.companyId === companyId);
  };
  
  return {
    canEditProfile,
    canViewJobDetails,
    canManageCompany
  };
}

// EXAMPLE 9: Database Query Filtering Based on Permissions
export async function exampleDatabaseFiltering(user: { role: UserRole; id: string; companyId?: string }) {
  // This shows how to filter database queries based on user permissions
  
  let whereClause = {};
  
  if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MODERATOR) {
    // Admins can see all records
    whereClause = {};
  } else if (user.role === UserRole.COMPANY) {
    // Companies can only see their own records
    whereClause = { companyId: user.companyId };
  } else if (user.role === UserRole.GUARDIAN) {
    // Guardians can only see their own records
    whereClause = { guardianId: user.id };
  } else if (user.role === UserRole.CAREGIVER) {
    // Caregivers can only see assigned jobs
    whereClause = { assignments: { some: { caregiverId: user.id } } };
  } else if (user.role === UserRole.PATIENT) {
    // Patients can only see their own records
    whereClause = { patientId: user.id };
  }
  
  // This whereClause would be used in Prisma queries
  // const jobs = await prisma.job.findMany({ where: whereClause });
  
  return whereClause;
}

// EXAMPLE 10: Audit Trail for Permission Checks
export async function exampleAuditTrail(
  user: { role: UserRole; id: string; name: string },
  action: string,
  resource: string,
  resourceId: string,
  granted: boolean
) {
  // Log permission checks for audit purposes
  const auditLog = {
    userId: user.id,
    userRole: user.role,
    userName: user.name,
    action,
    resource,
    resourceId,
    granted,
    timestamp: new Date(),
    ipAddress: '', // Would be extracted from request
    userAgent: '', // Would be extracted from request
  };
  
  // Save to audit logs table
  // await prisma.audit_log.create({ data: auditLog });
  
  console.log('Audit Log:', auditLog);
  return auditLog;
}