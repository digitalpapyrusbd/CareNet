import { UserRole } from '@prisma/client';

// Role hierarchy for permission inheritance
export const roleHierarchy: Record<UserRole, UserRole[]> = {
  [UserRole.SUPER_ADMIN]: [],
  [UserRole.MODERATOR]: [UserRole.SUPER_ADMIN],
  [UserRole.COMPANY]: [UserRole.MODERATOR, UserRole.SUPER_ADMIN],
  [UserRole.CAREGIVER]: [UserRole.COMPANY, UserRole.MODERATOR, UserRole.SUPER_ADMIN],
  [UserRole.GUARDIAN]: [UserRole.COMPANY, UserRole.MODERATOR, UserRole.SUPER_ADMIN],
  [UserRole.PATIENT]: [UserRole.GUARDIAN, UserRole.COMPANY, UserRole.MODERATOR, UserRole.SUPER_ADMIN],
};

// Role display names for UI
export const roleDisplayNames: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.MODERATOR]: 'Moderator',
  [UserRole.COMPANY]: 'Company',
  [UserRole.CAREGIVER]: 'Caregiver',
  [UserRole.GUARDIAN]: 'Guardian',
  [UserRole.PATIENT]: 'Patient',
};

// Role descriptions for onboarding/help
export const roleDescriptions: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Full system access with platform management capabilities',
  [UserRole.MODERATOR]: 'Can verify companies/caregivers and manage disputes',
  [UserRole.COMPANY]: 'Can manage caregivers, create packages, and handle jobs',
  [UserRole.CAREGIVER]: 'Can view assigned jobs, log care activities, and manage profile',
  [UserRole.GUARDIAN]: 'Can manage patients, create jobs, and make payments',
  [UserRole.PATIENT]: 'Can view own profile and care logs',
};

// Resource-based permissions
export const resourcePermissions = {
  // User management
  'users:read': [UserRole.SUPER_ADMIN, UserRole.MODERATOR],
  'users:write': [UserRole.SUPER_ADMIN],
  'users:delete': [UserRole.SUPER_ADMIN],
  
  // Company management
  'companies:read': [UserRole.SUPER_ADMIN, UserRole.MODERATOR],
  'companies:write': [UserRole.SUPER_ADMIN, UserRole.COMPANY],
  'companies:verify': [UserRole.SUPER_ADMIN, UserRole.MODERATOR],
  
  // Caregiver management
  'caregivers:read': [UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY],
  'caregivers:write': [UserRole.SUPER_ADMIN, UserRole.COMPANY],
  'caregivers:verify': [UserRole.SUPER_ADMIN, UserRole.MODERATOR],
  'caregivers:assign': [UserRole.SUPER_ADMIN, UserRole.COMPANY],
  
  // Patient management
  'patients:read': [UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY, UserRole.GUARDIAN, UserRole.CAREGIVER],
  'patients:write': [UserRole.SUPER_ADMIN, UserRole.COMPANY, UserRole.GUARDIAN],
  'patients:own:read': [UserRole.GUARDIAN, UserRole.PATIENT, UserRole.CAREGIVER],
  'patients:own:write': [UserRole.GUARDIAN],
  
  // Job management
  'jobs:read': [UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY, UserRole.GUARDIAN, UserRole.CAREGIVER],
  'jobs:write': [UserRole.SUPER_ADMIN, UserRole.COMPANY, UserRole.GUARDIAN],
  'jobs:assign': [UserRole.SUPER_ADMIN, UserRole.COMPANY],
  'jobs:own:read': [UserRole.GUARDIAN, UserRole.CAREGIVER],
  'jobs:assigned:read': [UserRole.CAREGIVER],
  
  // Payment management
  'payments:read': [UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY, UserRole.GUARDIAN],
  'payments:write': [UserRole.SUPER_ADMIN, UserRole.COMPANY, UserRole.GUARDIAN],
  'payments:own:read': [UserRole.GUARDIAN, UserRole.CAREGIVER],
  'payments:process': [UserRole.SUPER_ADMIN, UserRole.COMPANY],
  
  // Care logs
  'care_logs:read': [UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY, UserRole.GUARDIAN, UserRole.CAREGIVER],
  'care_logs:write': [UserRole.SUPER_ADMIN, UserRole.COMPANY, UserRole.GUARDIAN, UserRole.CAREGIVER],
  'care_logs:own:read': [UserRole.GUARDIAN, UserRole.PATIENT, UserRole.CAREGIVER],
  'care_logs:create': [UserRole.CAREGIVER],
  
  // Feedback and ratings
  'feedback:read': [UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY, UserRole.GUARDIAN, UserRole.CAREGIVER],
  'feedback:write': [UserRole.SUPER_ADMIN, UserRole.COMPANY, UserRole.GUARDIAN, UserRole.CAREGIVER],
  'feedback:moderate': [UserRole.SUPER_ADMIN, UserRole.MODERATOR],
  
  // Dispute management
  'disputes:read': [UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY, UserRole.GUARDIAN, UserRole.CAREGIVER],
  'disputes:write': [UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY, UserRole.GUARDIAN, UserRole.CAREGIVER],
  'disputes:resolve': [UserRole.SUPER_ADMIN, UserRole.MODERATOR],
  
  // Analytics and reports
  'analytics:read': [UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.COMPANY],
  'analytics:own:read': [UserRole.COMPANY],
  
  // System management
  'system:read': [UserRole.SUPER_ADMIN],
  'system:write': [UserRole.SUPER_ADMIN],
  'system:config': [UserRole.SUPER_ADMIN],
};

// Helper functions
export function hasResourcePermission(userRole: UserRole, permission: string): boolean {
  return resourcePermissions[permission as keyof typeof resourcePermissions]?.includes(userRole) || false;
}

export function hasAnyResourcePermission(userRole: UserRole, permissions: string[]): boolean {
  return permissions.some(permission => hasResourcePermission(userRole, permission));
}

export function hasAllResourcePermissions(userRole: UserRole, permissions: string[]): boolean {
  return permissions.every(permission => hasResourcePermission(userRole, permission));
}

export function canAccessResource(userRole: UserRole, resource: string, action: 'read' | 'write' | 'delete' | 'manage'): boolean {
  const permission = `${resource}:${action}`;
  return hasResourcePermission(userRole, permission);
}

export function canAccessOwnResource(userRole: UserRole, resource: string, action: 'read' | 'write' | 'delete' | 'manage'): boolean {
  const permission = `${resource}:own:${action}`;
  return hasResourcePermission(userRole, permission);
}

export function isRoleHigherOrEqual(userRole: UserRole, targetRole: UserRole): boolean {
  if (userRole === targetRole) return true;
  
  const higherRoles = roleHierarchy[userRole];
  return higherRoles.includes(targetRole);
}

export function getAccessibleRoles(userRole: UserRole): UserRole[] {
  const allRoles = Object.values(UserRole);
  return allRoles.filter(role => isRoleHigherOrEqual(userRole, role));
}

export function getRoleDisplayName(role: UserRole): string {
  return roleDisplayNames[role] || role;
}

export function getRoleDescription(role: UserRole): string {
  return roleDescriptions[role] || '';
}

// Function to check if a user can perform an action on a specific entity
export function canPerformAction(
  userRole: UserRole,
  action: string,
  entityType: string,
  isOwner: boolean = false
): boolean {
  // First check if they have general permission
  const generalPermission = `${entityType}:${action}`;
  if (hasResourcePermission(userRole, generalPermission)) {
    return true;
  }
  
  // Then check if they have owner-specific permission (and they are the owner)
  if (isOwner) {
    const ownerPermission = `${entityType}:own:${action}`;
    if (hasResourcePermission(userRole, ownerPermission)) {
      return true;
    }
  }
  
  return false;
}

// Function to get all permissions for a role
export function getRolePermissions(userRole: UserRole): string[] {
  const permissions: string[] = [];
  
  for (const [permission, roles] of Object.entries(resourcePermissions)) {
    if (roles.includes(userRole)) {
      permissions.push(permission);
    }
  }
  
  return permissions;
}

// Function to validate role transition (for role changes by admins)
export function canChangeRole(
  adminRole: UserRole,
  currentRole: UserRole,
  newRole: UserRole
): boolean {
  // Super Admin can change any role
  if (adminRole === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // Moderators can only change to roles lower than them
  if (adminRole === UserRole.MODERATOR) {
    const allowedRoles = [UserRole.COMPANY, UserRole.CAREGIVER, UserRole.GUARDIAN, UserRole.PATIENT];
    return allowedRoles.includes(newRole) && isRoleHigherOrEqual(adminRole, currentRole);
  }
  
  return false;
}

// Export type for permission checking
export type PermissionChecker = (permission: string) => boolean;
export type ResourcePermissionChecker = (resource: string, action: string) => boolean;