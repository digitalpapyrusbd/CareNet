import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

// Re-export UserRole for convenience
export { UserRole };

// Runtime fallback in case the Prisma `UserRole` enum isn't available
const RuntimeUserRole: any = (typeof UserRole !== 'undefined' && UserRole) ? UserRole : {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MODERATOR: 'MODERATOR',
  COMPANY: 'COMPANY',
  CAREGIVER: 'CAREGIVER',
  GUARDIAN: 'GUARDIAN',
  PATIENT: 'PATIENT',
  GUEST: 'GUEST',
};

// Role definitions imported from Prisma client

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// JWT Token Types
export interface JWTPayload {
  userId: string;
  role: UserRole;
  phone: string;
  email?: string;
  name?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Password Hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// JWT Token Generation
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function generateRefreshToken(payload: Pick<JWTPayload, 'userId' | 'role'>): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

export function generateTokenPair(payload: JWTPayload): TokenPair {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({
    userId: payload.userId,
    role: payload.role,
  });
  
  return { accessToken, refreshToken };
}

// JWT Token Verification
export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid access token');
  }
}

export function verifyRefreshToken(token: string): Pick<JWTPayload, 'userId' | 'role'> {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as Pick<JWTPayload, 'userId' | 'role'>;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

// Token Extraction from Headers
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

// Role-based Authorization
export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function hasAnyRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

// Permission checking based on roles
export const rolePermissions = {
  [RuntimeUserRole.SUPER_ADMIN]: [
    'manage:users',
    'manage:companies',
    'manage:caregivers',
    'manage:patients',
    'manage:jobs',
    'manage:payments',
    'manage:system',
    'view:analytics',
    'moderate:content',
  ],
  [RuntimeUserRole.MODERATOR]: [
    'verify:companies',
    'verify:caregivers',
    'manage:disputes',
    'view:analytics',
    'moderate:content',
  ],
  [RuntimeUserRole.COMPANY]: [
    'manage:own:caregivers',
    'create:packages',
    'manage:own:jobs',
    'view:own:analytics',
    'manage:own:patients',
  ],
  [RuntimeUserRole.CAREGIVER]: [
    'view:own:profile',
    'update:own:availability',
    'view:assigned:jobs',
    'create:care:logs',
    'view:own:earnings',
  ],
  [RuntimeUserRole.GUARDIAN]: [
    'manage:own:patients',
    'create:jobs',
    'view:own:jobs',
    'make:payments',
    'view:own:payments',
    'give:feedback',
  ],
  [RuntimeUserRole.PATIENT]: [
    'view:own:profile',
    'view:own:care:logs',
  ],
};

export function hasPermission(userRole: UserRole | string, permission: string): boolean {
  const key = (userRole as any) || '';
  return rolePermissions[key]?.includes(permission) || false;
}

// OTP Generation (for phone verification)
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// MFA Secret Generation
export function generateMFASecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}