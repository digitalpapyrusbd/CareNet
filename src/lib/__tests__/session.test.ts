import { kv } from '@vercel/kv';
import { UserRole } from '@prisma/client';
import {
  createSession,
  getSession,
  updateSessionActivity,
  verifySessionMFA,
  deactivateSession,
  deleteSession,
  getUserSessions,
  deleteUserSessions,
  cleanupExpiredSessions,
  getSessionStats,
  extendSession,
  sessionRequiresMFA,
  createMFASession,
  validateSession,
  createSessionCookie,
  clearSessionCookie,
  Session,
  CreateSessionOptions,
} from '../session';

// Mock @vercel/kv
jest.mock('@vercel/kv', () => ({
  kv: {
    setex: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    sadd: jest.fn(),
    srem: jest.fn(),
    smembers: jest.fn(),
    expire: jest.fn(),
  },
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-1234'),
}));

describe('session.ts', () => {
  const mockKv = kv as jest.Mocked<typeof kv>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('createSession', () => {
    const options: CreateSessionOptions = {
      userId: 'user123',
      userRole: UserRole.CAREGIVER,
      phone: '+8801712345678',
      email: 'test@example.com',
      name: 'Test User',
    };

    it('should create a session with default TTL', async () => {
      const session = await createSession(options);

      expect(session.id).toBe('mock-uuid-1234');
      expect(session.userId).toBe('user123');
      expect(session.userRole).toBe(UserRole.CAREGIVER);
      expect(session.isActive).toBe(true);
      expect(session.mfaVerified).toBe(false);
      expect(mockKv.setex).toHaveBeenCalled();
      expect(mockKv.sadd).toHaveBeenCalledTimes(2);
    });

    it('should create session with extended TTL when rememberMe is true', async () => {
      await createSession({ ...options, rememberMe: true });

      const expectedTTL = 30 * 24 * 60 * 60; // 30 days
      expect(mockKv.setex).toHaveBeenCalledWith(
        expect.stringContaining('session:'),
        expectedTTL,
        expect.any(String)
      );
    });

    it('should include device info in session', async () => {
      const deviceInfo = {
        userAgent: 'Mozilla/5.0',
        ip: '192.168.1.1',
        platform: 'Linux',
      };

      const session = await createSession({ ...options, deviceInfo });

      expect(session.deviceInfo).toEqual(deviceInfo);
    });

    it('should add session to user sessions set', async () => {
      await createSession(options);

      expect(mockKv.sadd).toHaveBeenCalledWith(
        'user_sessions:user123',
        'mock-uuid-1234'
      );
    });

    it('should add session to active sessions set', async () => {
      await createSession(options);

      expect(mockKv.sadd).toHaveBeenCalledWith(
        'active_sessions:',
        'mock-uuid-1234'
      );
    });
  });

  describe('getSession', () => {
    const mockSession: Session = {
      id: 'session123',
      userId: 'user123',
      userRole: UserRole.CAREGIVER,
      phone: '+8801712345678',
      isActive: true,
      mfaVerified: true,
      lastActivity: new Date('2025-11-23T10:00:00Z'),
      createdAt: new Date('2025-11-23T09:00:00Z'),
      expiresAt: new Date('2025-11-24T09:00:00Z'),
    };

    it('should retrieve session from KV', async () => {
      mockKv.get.mockResolvedValue(JSON.stringify(mockSession));

      const session = await getSession('session123');

      expect(mockKv.get).toHaveBeenCalledWith('session:session123');
      expect(session?.id).toBe('session123');
      expect(session?.userId).toBe('user123');
    });

    it('should return null if session not found', async () => {
      mockKv.get.mockResolvedValue(null);

      const session = await getSession('nonexistent');

      expect(session).toBeNull();
    });

    it.skip('should return null and delete if session expired', async () => {
      const expiredSession = {
        ...mockSession,
        expiresAt: new Date('2020-01-01T00:00:00Z'),
      };
      mockKv.get.mockResolvedValue(JSON.stringify(expiredSession));

      const session = await getSession('session123');

      expect(session).toBeNull();
      expect(mockKv.del).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockKv.get.mockRejectedValue(new Error('KV error'));

      const session = await getSession('session123');

      expect(session).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateSessionActivity', () => {
    const mockSession: Session = {
      id: 'session123',
      userId: 'user123',
      userRole: UserRole.CAREGIVER,
      phone: '+8801712345678',
      isActive: true,
      mfaVerified: true,
      lastActivity: new Date('2025-11-23T10:00:00Z'),
      createdAt: new Date('2025-11-23T09:00:00Z'),
      expiresAt: new Date('2025-11-24T09:00:00Z'),
    };

    it.skip('should update lastActivity timestamp', async () => {
      mockKv.get.mockResolvedValue(JSON.stringify(mockSession));
      mockKv.setex.mockResolvedValue('OK');

      await updateSessionActivity('session123');

      expect(mockKv.setex).toHaveBeenCalled();
      const updatedSession = JSON.parse(
        (mockKv.setex as jest.Mock).mock.calls[0][2]
      );
      expect(new Date(updatedSession.lastActivity).getTime()).toBeGreaterThan(
        mockSession.lastActivity.getTime()
      );
    });

    it('should not update if session not found', async () => {
      mockKv.get.mockResolvedValue(null);

      await updateSessionActivity('nonexistent');

      expect(mockKv.setex).not.toHaveBeenCalled();
    });
  });

  describe('verifySessionMFA', () => {
    const mockSession: Session = {
      id: 'session123',
      userId: 'user123',
      userRole: UserRole.COMPANY,
      phone: '+8801712345678',
      isActive: true,
      mfaVerified: false,
      lastActivity: new Date('2025-11-23T10:00:00Z'),
      createdAt: new Date('2025-11-23T09:00:00Z'),
      expiresAt: new Date('2025-11-24T09:00:00Z'),
    };

    it.skip('should set mfaVerified to true', async () => {
      mockKv.get.mockResolvedValue(JSON.stringify(mockSession));

      const result = await verifySessionMFA('session123');

      expect(result).toBe(true);
      expect(mockKv.setex).toHaveBeenCalled();
      const updatedSession = JSON.parse(
        (mockKv.setex as jest.Mock).mock.calls[0][2]
      );
      expect(updatedSession.mfaVerified).toBe(true);
    });

    it('should return false if session not found', async () => {
      mockKv.get.mockResolvedValue(null);

      const result = await verifySessionMFA('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('deactivateSession', () => {
    const mockSession: Session = {
      id: 'session123',
      userId: 'user123',
      userRole: UserRole.CAREGIVER,
      phone: '+8801712345678',
      isActive: true,
      mfaVerified: true,
      lastActivity: new Date('2025-11-23T10:00:00Z'),
      createdAt: new Date('2025-11-23T09:00:00Z'),
      expiresAt: new Date('2025-11-24T09:00:00Z'),
    };

    it.skip('should set isActive to false', async () => {
      mockKv.get.mockResolvedValue(JSON.stringify(mockSession));
      mockKv.setex.mockResolvedValue('OK');

      await deactivateSession('session123');

      expect(mockKv.setex).toHaveBeenCalled();
      const updatedSession = JSON.parse(
        (mockKv.setex as jest.Mock).mock.calls[0][2]
      );
      expect(updatedSession.isActive).toBe(false);
    });
  });

  describe('deleteSession', () => {
    const mockSession: Session = {
      id: 'session123',
      userId: 'user123',
      userRole: UserRole.CAREGIVER,
      phone: '+8801712345678',
      isActive: true,
      mfaVerified: true,
      lastActivity: new Date('2025-11-23T10:00:00Z'),
      createdAt: new Date('2025-11-23T09:00:00Z'),
      expiresAt: new Date('2025-11-24T09:00:00Z'),
    };

    it('should delete session from KV', async () => {
      mockKv.get.mockResolvedValue(JSON.stringify(mockSession));

      await deleteSession('session123');

      expect(mockKv.del).toHaveBeenCalledWith('session:session123');
    });

    it('should remove from user sessions set', async () => {
      mockKv.get.mockResolvedValue(JSON.stringify(mockSession));

      await deleteSession('session123');

      expect(mockKv.srem).toHaveBeenCalledWith(
        'user_sessions:user123',
        'session123'
      );
    });

    it('should remove from active sessions set', async () => {
      mockKv.get.mockResolvedValue(JSON.stringify(mockSession));

      await deleteSession('session123');

      expect(mockKv.srem).toHaveBeenCalledWith('active_sessions:', 'session123');
    });
  });

  describe('getUserSessions', () => {
    it('should return empty array if no sessions', async () => {
      mockKv.smembers.mockResolvedValue([]);

      const sessions = await getUserSessions('user123');

      expect(sessions).toEqual([]);
    });

    it.skip('should return user active sessions sorted by lastActivity', async () => {
      const session1: Session = {
        id: 'session1',
        userId: 'user123',
        userRole: UserRole.CAREGIVER,
        phone: '+8801712345678',
        isActive: true,
        mfaVerified: true,
        lastActivity: new Date('2025-11-23T10:00:00Z'),
        createdAt: new Date('2025-11-23T09:00:00Z'),
        expiresAt: new Date('2099-11-24T09:00:00Z'), // Far future to avoid expiry check
      };

      const session2: Session = {
        ...session1,
        id: 'session2',
        lastActivity: new Date('2025-11-23T11:00:00Z'),
      };

      mockKv.smembers.mockResolvedValue(['session1', 'session2']);
      // Mock getSession calls - one for each session
      mockKv.get
        .mockResolvedValueOnce(JSON.stringify(session1))
        .mockResolvedValueOnce(JSON.stringify(session2));

      const sessions = await getUserSessions('user123');

      expect(sessions).toHaveLength(2);
      expect(sessions[0].id).toBe('session2'); // Most recent first
      expect(sessions[1].id).toBe('session1');
    });

    it('should filter out inactive sessions', async () => {
      const activeSession: Session = {
        id: 'active',
        userId: 'user123',
        userRole: UserRole.CAREGIVER,
        phone: '+8801712345678',
        isActive: true,
        mfaVerified: true,
        lastActivity: new Date(),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 86400000),
      };

      const inactiveSession: Session = {
        ...activeSession,
        id: 'inactive',
        isActive: false,
      };

      mockKv.smembers.mockResolvedValue(['active', 'inactive']);
      mockKv.get
        .mockResolvedValueOnce(JSON.stringify(activeSession))
        .mockResolvedValueOnce(JSON.stringify(inactiveSession));
      mockKv.setex.mockResolvedValue('OK'); // For updateActivity call

      const sessions = await getUserSessions('user123');

      expect(sessions).toHaveLength(1);
      expect(sessions[0].id).toBe('active');
    });
  });

  describe('sessionRequiresMFA', () => {
    it('should return true for unverified SUPER_ADMIN', () => {
      const session = {
        userRole: UserRole.SUPER_ADMIN,
        mfaVerified: false,
      } as Session;

      expect(sessionRequiresMFA(session)).toBe(true);
    });

    it('should return true for unverified MODERATOR', () => {
      const session = {
        userRole: UserRole.MODERATOR,
        mfaVerified: false,
      } as Session;

      expect(sessionRequiresMFA(session)).toBe(true);
    });

    it('should return true for unverified COMPANY', () => {
      const session = {
        userRole: UserRole.COMPANY,
        mfaVerified: false,
      } as Session;

      expect(sessionRequiresMFA(session)).toBe(true);
    });

    it('should return false for verified COMPANY', () => {
      const session = {
        userRole: UserRole.COMPANY,
        mfaVerified: true,
      } as Session;

      expect(sessionRequiresMFA(session)).toBe(false);
    });

    it('should return false for CAREGIVER (no MFA required)', () => {
      const session = {
        userRole: UserRole.CAREGIVER,
        mfaVerified: false,
      } as Session;

      expect(sessionRequiresMFA(session)).toBe(false);
    });

    it('should return false for GUARDIAN (no MFA required)', () => {
      const session = {
        userRole: UserRole.GUARDIAN,
        mfaVerified: false,
      } as Session;

      expect(sessionRequiresMFA(session)).toBe(false);
    });
  });

  describe('validateSession', () => {
    const mockSession: Session = {
      id: 'session123',
      userId: 'user123',
      userRole: UserRole.CAREGIVER,
      phone: '+8801712345678',
      isActive: true,
      mfaVerified: true,
      lastActivity: new Date('2025-11-23T10:00:00Z'),
      createdAt: new Date('2025-11-23T09:00:00Z'),
      expiresAt: new Date('2025-11-24T09:00:00Z'),
    };

    it('should return invalid if no sessionId provided', async () => {
      const result = await validateSession('');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('No session provided');
    });

    it('should return invalid if session not found', async () => {
      mockKv.get.mockResolvedValue(null);

      const result = await validateSession('nonexistent');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Session not found or expired');
    });

    it('should return invalid if session is inactive', async () => {
      const inactiveSession = { ...mockSession, isActive: false };
      mockKv.get.mockResolvedValue(JSON.stringify(inactiveSession));

      const result = await validateSession('session123');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Session is inactive');
    });

    it('should return requiresMFA for unverified privileged roles', async () => {
      const companySession = {
        ...mockSession,
        userRole: UserRole.COMPANY,
        mfaVerified: false,
      };
      mockKv.get.mockResolvedValue(JSON.stringify(companySession));

      const result = await validateSession('session123');

      expect(result.valid).toBe(false);
      expect(result.requiresMFA).toBe(true);
      expect(result.error).toBe('MFA verification required');
    });

    it.skip('should return valid for valid session', async () => {
      mockKv.get.mockResolvedValue(JSON.stringify(mockSession));
      mockKv.setex.mockResolvedValue('OK');

      const result = await validateSession('session123');

      expect(result.valid).toBe(true);
      expect(result.session).toBeDefined();
      expect(mockKv.setex).toHaveBeenCalled(); // Activity updated
    });
  });

  describe('createSessionCookie', () => {
    it('should create cookie with default TTL', () => {
      const cookie = createSessionCookie('session123');

      expect(cookie).toContain('session=session123');
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain('Secure');
      expect(cookie).toContain('SameSite=Strict');
      expect(cookie).toContain('Max-Age=86400'); // 24 hours
    });

    it('should create cookie with extended TTL for rememberMe', () => {
      const cookie = createSessionCookie('session123', true);

      expect(cookie).toContain('Max-Age=2592000'); // 30 days
    });
  });

  describe('clearSessionCookie', () => {
    it('should create cookie with Max-Age=0', () => {
      const cookie = clearSessionCookie();

      expect(cookie).toContain('session=');
      expect(cookie).toContain('Max-Age=0');
      expect(cookie).toContain('HttpOnly');
    });
  });

  describe('extendSession', () => {
    const mockSession: Session = {
      id: 'session123',
      userId: 'user123',
      userRole: UserRole.CAREGIVER,
      phone: '+8801712345678',
      isActive: true,
      mfaVerified: true,
      lastActivity: new Date('2025-11-23T10:00:00Z'),
      createdAt: new Date('2025-11-23T09:00:00Z'),
      expiresAt: new Date('2025-11-24T09:00:00Z'),
    };

    it('should extend session with default TTL', async () => {
      mockKv.get.mockResolvedValue(JSON.stringify(mockSession));

      const result = await extendSession('session123');

      expect(result).toBe(true);
      expect(mockKv.setex).toHaveBeenCalledWith(
        'session:session123',
        86400, // 24 hours
        expect.any(String)
      );
    });

    it('should extend session with extended TTL for rememberMe', async () => {
      mockKv.get.mockResolvedValue(JSON.stringify(mockSession));

      const result = await extendSession('session123', true);

      expect(result).toBe(true);
      expect(mockKv.setex).toHaveBeenCalledWith(
        'session:session123',
        2592000, // 30 days
        expect.any(String)
      );
    });

    it('should return false if session not found', async () => {
      mockKv.get.mockResolvedValue(null);

      const result = await extendSession('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('createMFASession', () => {
    it('should create temporary MFA session', async () => {
      const sessionId = await createMFASession('user123', UserRole.COMPANY);

      expect(sessionId).toBe('mock-uuid-1234');
      expect(mockKv.setex).toHaveBeenCalledWith(
        'session:mock-uuid-1234',
        600, // 10 minutes
        expect.any(String)
      );
    });
  });
});
