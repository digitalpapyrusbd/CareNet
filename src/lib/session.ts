import { v4 as uuidv4 } from "uuid";
import { UserRole } from "@prisma/client";
import { kvMock } from "./kv-mock";

// Use KV mock for development if no real KV configured
const hasRealKV = process.env.KV_REST_API_URL &&
  process.env.KV_REST_API_URL !== 'https://localhost:8079' &&
  process.env.KV_REST_API_TOKEN &&
  process.env.KV_REST_API_TOKEN !== 'dev-token-dummy';

let kv: any;
if (hasRealKV) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const vercelKv = require('@vercel/kv');
  kv = vercelKv.kv;
} else {
  console.log("Using KV Mock for session storage");
  kv = kvMock;
}

// Session interface
export interface Session {
  id: string;
  userId: string;
  userRole: UserRole;
  phone: string;
  email?: string;
  name?: string;
  isActive: boolean;
  deviceInfo?: {
    userAgent: string;
    ip: string;
    platform?: string;
    deviceId?: string;
  };
  mfaVerified: boolean;
  lastActivity: Date;
  createdAt: Date;
  expiresAt: Date;
}

// Session creation options
export interface CreateSessionOptions {
  userId: string;
  userRole: UserRole;
  phone: string;
  email?: string;
  name?: string;
  deviceInfo?: {
    userAgent: string;
    ip: string;
    platform?: string;
    deviceId?: string;
  };
  expiresIn?: number; // in seconds, default 24 hours
  rememberMe?: boolean; // if true, extends to 30 days
}

// Session storage keys
const SESSION_PREFIX = "session:";
const USER_SESSIONS_PREFIX = "user_sessions:";
const ACTIVE_SESSIONS_PREFIX = "active_sessions:";

// Default session durations (in seconds)
const DEFAULT_SESSION_TTL = 24 * 60 * 60; // 24 hours
const EXTENDED_SESSION_TTL = 30 * 24 * 60 * 60; // 30 days
const MFA_SESSION_TTL = 10 * 60; // 10 minutes for MFA verification

// Create a new session
export async function createSession(
  options: CreateSessionOptions,
): Promise<Session> {
  const sessionId = uuidv4();
  const now = new Date();
  const expiresIn = options.rememberMe
    ? EXTENDED_SESSION_TTL
    : options.expiresIn || DEFAULT_SESSION_TTL;
  const expiresAt = new Date(now.getTime() + expiresIn * 1000);

  const session: Session = {
    id: sessionId,
    userId: options.userId,
    userRole: options.userRole,
    phone: options.phone,
    email: options.email,
    name: options.name,
    isActive: true,
    deviceInfo: options.deviceInfo,
    mfaVerified: false, // Requires MFA verification initially
    lastActivity: now,
    createdAt: now,
    expiresAt,
  };

  // Store session in KV
  await kv.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(session), {
    ex: expiresIn,
  });

  // Add to user's active sessions
  await kv.sadd(`${USER_SESSIONS_PREFIX}${options.userId}`, sessionId);
  await kv.expire(`${USER_SESSIONS_PREFIX}${options.userId}`, expiresIn);

  // Add to active sessions set (for monitoring)
  await kv.sadd(ACTIVE_SESSIONS_PREFIX, sessionId);
  await kv.expire(ACTIVE_SESSIONS_PREFIX, expiresIn);

  return session;
}

// Get session by ID
export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    const sessionData = await kv.get(`${SESSION_PREFIX}${sessionId}`);
    if (!sessionData) return null;

    const session: Session = JSON.parse(sessionData as string);

    // Check if session is expired
    if (new Date() > session.expiresAt) {
      await deleteSession(sessionId);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

// Update session activity
export async function updateSessionActivity(sessionId: string): Promise<void> {
  try {
    const session = await getSession(sessionId);
    if (!session) return;

    session.lastActivity = new Date();

    // Update session with new TTL
    const ttl = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000);
    if (ttl > 0) {
      await kv.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(session), {
        ex: ttl,
      });
    }
  } catch (error) {
    console.error("Error updating session activity:", error);
  }
}

// Verify MFA for session
export async function verifySessionMFA(sessionId: string): Promise<boolean> {
  try {
    const session = await getSession(sessionId);
    if (!session) return false;

    session.mfaVerified = true;

    // Update session with new TTL
    const ttl = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000);
    if (ttl > 0) {
      await kv.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(session), {
        ex: ttl,
      });
    }

    return true;
  } catch (error) {
    console.error("Error verifying session MFA:", error);
    return false;
  }
}

// Deactivate session
export async function deactivateSession(sessionId: string): Promise<void> {
  try {
    const session = await getSession(sessionId);
    if (!session) return;

    session.isActive = false;

    // Update session
    const ttl = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000);
    if (ttl > 0) {
      await kv.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(session), {
        ex: ttl,
      });
    }
  } catch (error) {
    console.error("Error deactivating session:", error);
  }
}

// Delete session
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    const session = await getSession(sessionId);
    if (!session) return;

    // Remove from KV
    await kv.del(`${SESSION_PREFIX}${sessionId}`);

    // Remove from user's active sessions
    await kv.srem(`${USER_SESSIONS_PREFIX}${session.userId}`, sessionId);

    // Remove from active sessions set
    await kv.srem(ACTIVE_SESSIONS_PREFIX, sessionId);
  } catch (error) {
    console.error("Error deleting session:", error);
  }
}

// Get all active sessions for a user
export async function getUserSessions(userId: string): Promise<Session[]> {
  try {
    const sessionIds = await kv.smembers(`${USER_SESSIONS_PREFIX}${userId}`);
    if (!sessionIds.length) return [];

    const sessions: Session[] = [];
    for (const sessionId of sessionIds) {
      const session = await getSession(sessionId);
      if (session && session.isActive) {
        sessions.push(session);
      }
    }

    return sessions.sort(
      (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime(),
    );
  } catch (error) {
    console.error("Error getting user sessions:", error);
    return [];
  }
}

// Delete all sessions for a user (except current session)
export async function deleteUserSessions(
  userId: string,
  exceptSessionId?: string,
): Promise<void> {
  try {
    const sessions = await getUserSessions(userId);

    for (const session of sessions) {
      if (session.id !== exceptSessionId) {
        await deleteSession(session.id);
      }
    }
  } catch (error) {
    console.error("Error deleting user sessions:", error);
  }
}

// Delete all inactive/expired sessions
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    const sessionIds = await kv.smembers(ACTIVE_SESSIONS_PREFIX);
    if (!sessionIds.length) return;

    for (const sessionId of sessionIds) {
      const session = await getSession(sessionId);
      if (!session || new Date() > session.expiresAt) {
        await deleteSession(sessionId);
      }
    }
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error);
  }
}

// Get session statistics
export async function getSessionStats(): Promise<{
  totalActive: number;
  totalUsers: number;
  sessionsByRole: Record<UserRole, number>;
}> {
  try {
    const sessionIds = await kv.smembers(ACTIVE_SESSIONS_PREFIX);
    const sessions: Session[] = [];
    const uniqueUsers = new Set<string>();
    const sessionsByRole: Record<UserRole, number> = {
      [UserRole.SUPER_ADMIN]: 0,
      [UserRole.MODERATOR]: 0,
      [UserRole.COMPANY]: 0,
      [UserRole.CAREGIVER]: 0,
      [UserRole.GUARDIAN]: 0,
      [UserRole.PATIENT]: 0,
    };

    for (const sessionId of sessionIds) {
      const session = await getSession(sessionId);
      if (session && session.isActive) {
        sessions.push(session);
        uniqueUsers.add(session.userId);
        sessionsByRole[session.userRole]++;
      }
    }

    return {
      totalActive: sessions.length,
      totalUsers: uniqueUsers.size,
      sessionsByRole,
    };
  } catch (error) {
    console.error("Error getting session stats:", error);
    return {
      totalActive: 0,
      totalUsers: 0,
      sessionsByRole: {
        [UserRole.SUPER_ADMIN]: 0,
        [UserRole.MODERATOR]: 0,
        [UserRole.COMPANY]: 0,
        [UserRole.CAREGIVER]: 0,
        [UserRole.GUARDIAN]: 0,
        [UserRole.PATIENT]: 0,
      },
    };
  }
}

// Extend session TTL
export async function extendSession(
  sessionId: string,
  rememberMe: boolean = false,
): Promise<boolean> {
  try {
    const session = await getSession(sessionId);
    if (!session) return false;

    const newTTL = rememberMe ? EXTENDED_SESSION_TTL : DEFAULT_SESSION_TTL;
    session.expiresAt = new Date(Date.now() + newTTL * 1000);

    await kv.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(session), ttl);
    await kv.expire(`${USER_SESSIONS_PREFIX}${session.userId}`, ttl);
    await kv.expire(ACTIVE_SESSIONS_PREFIX, newTTL);

    return true;
  } catch (error) {
    console.error("Error extending session:", error);
    return false;
  }
}

// Check if session requires MFA
export function sessionRequiresMFA(session: Session): boolean {
  return (
    !session.mfaVerified &&
    (session.userRole === UserRole.COMPANY ||
      session.userRole === UserRole.MODERATOR ||
      session.userRole === UserRole.SUPER_ADMIN)
  );
}

// Create temporary MFA session
export async function createMFASession(
  userId: string,
  userRole: UserRole,
): Promise<string> {
  const sessionId = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + MFA_SESSION_TTL * 1000);

  const tempSession: Session = {
    id: sessionId,
    userId,
    userRole,
    phone: "",
    isActive: true,
    mfaVerified: false,
    lastActivity: now,
    createdAt: now,
    expiresAt,
  };

  await kv.set(
    `${SESSION_PREFIX}${sessionId}`,
    JSON.stringify(tempSession, { ex: MFA_SESSION_TTL }),
  );

  return sessionId;
}

// Validate session for API requests
export async function validateSession(sessionId: string): Promise<{
  valid: boolean;
  session?: Session;
  requiresMFA?: boolean;
  error?: string;
}> {
  if (!sessionId) {
    return { valid: false, error: "No session provided" };
  }

  const session = await getSession(sessionId);
  if (!session) {
    return { valid: false, error: "Session not found or expired" };
  }

  if (!session.isActive) {
    return { valid: false, error: "Session is inactive" };
  }

  if (sessionRequiresMFA(session)) {
    return {
      valid: false,
      requiresMFA: true,
      session,
      error: "MFA verification required",
    };
  }

  // Update activity
  await updateSessionActivity(sessionId);

  return { valid: true, session };
}

// Session middleware helper
export function createSessionCookie(
  sessionId: string,
  rememberMe: boolean = false,
): string {
  const maxAge = rememberMe ? EXTENDED_SESSION_TTL : DEFAULT_SESSION_TTL;
  return `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

// Clear session cookie
export function clearSessionCookie(): string {
  return "session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0";
}
