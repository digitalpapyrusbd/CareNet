import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  extractTokenFromHeader,
  hasRole,
  hasAnyRole,
  hasPermission,
  generateOTP,
  generateMFASecret,
  UserRole,
  JWTPayload,
} from '../auth';
import jwt from 'jsonwebtoken';

// Unmock bcryptjs for real password testing
jest.unmock('bcryptjs');

// Mock environment variables
const originalEnv = process.env;

describe('auth.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Password Hashing', () => {
    it('should hash a password', async () => {
      const password = 'mySecurePassword123';
      const hash = await hashPassword(password);

      expect(hash).toBeTruthy();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThanOrEqual(50); // bcrypt hashes are ~60 chars
    });

    it('should verify correct password', async () => {
      const password = 'mySecurePassword123';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'mySecurePassword123';
      const wrongPassword = 'wrongPassword456';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'mySecurePassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
      // Both should still be valid
      expect(await verifyPassword(password, hash1)).toBe(true);
      expect(await verifyPassword(password, hash2)).toBe(true);
    });
  });

  describe('JWT Token Generation', () => {
    const mockPayload: JWTPayload = {
      userId: '123',
      role: UserRole.CAREGIVER,
      phone: '+8801234567890',
      email: 'test@example.com',
      name: 'Test User',
    };

    it('should generate access token', () => {
      const token = generateAccessToken(mockPayload);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should generate refresh token', () => {
      const token = generateRefreshToken({
        userId: mockPayload.userId,
        role: mockPayload.role,
      });

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('should generate token pair', () => {
      const tokens = generateTokenPair(mockPayload);

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(tokens.accessToken).toBeTruthy();
      expect(tokens.refreshToken).toBeTruthy();
    });

    it('should include payload data in access token', () => {
      const token = generateAccessToken(mockPayload);
      const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const decoded = jwt.verify(token, secret) as JWTPayload;

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.role).toBe(mockPayload.role);
      expect(decoded.phone).toBe(mockPayload.phone);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.name).toBe(mockPayload.name);
    });

    it('should include minimal payload in refresh token', () => {
      const token = generateRefreshToken({
        userId: mockPayload.userId,
        role: mockPayload.role,
      });
      const secret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
      const decoded = jwt.verify(token, secret) as any;

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.role).toBe(mockPayload.role);
      expect(decoded.phone).toBeUndefined();
      expect(decoded.email).toBeUndefined();
    });
  });

  describe('JWT Token Verification', () => {
    const mockPayload: JWTPayload = {
      userId: '123',
      role: UserRole.CAREGIVER,
      phone: '+8801234567890',
      email: 'test@example.com',
      name: 'Test User',
    };

    it('should verify valid access token', () => {
      const token = generateAccessToken(mockPayload);
      const decoded = verifyAccessToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.role).toBe(mockPayload.role);
      expect(decoded.phone).toBe(mockPayload.phone);
    });

    it('should verify valid refresh token', () => {
      const token = generateRefreshToken({
        userId: mockPayload.userId,
        role: mockPayload.role,
      });
      const decoded = verifyRefreshToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it('should throw error for invalid access token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        verifyAccessToken(invalidToken);
      }).toThrow('Invalid access token');
    });

    it('should throw error for invalid refresh token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        verifyRefreshToken(invalidToken);
      }).toThrow('Invalid refresh token');
    });

    it('should throw error for expired access token', () => {
      const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const expiredToken = jwt.sign(mockPayload, secret, { expiresIn: '0s' });

      expect(() => {
        verifyAccessToken(expiredToken);
      }).toThrow('Invalid access token');
    });

    it('should throw error for wrong secret', () => {
      const wrongSecret = 'wrong-secret-key';
      const token = jwt.sign(mockPayload, wrongSecret);

      expect(() => {
        verifyAccessToken(token);
      }).toThrow('Invalid access token');
    });
  });

  describe('Token Extraction', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature';
      const header = `Bearer ${token}`;

      const extracted = extractTokenFromHeader(header);
      expect(extracted).toBe(token);
    });

    it('should return null for missing header', () => {
      const extracted = extractTokenFromHeader(undefined);
      expect(extracted).toBeNull();
    });

    it('should return null for empty header', () => {
      const extracted = extractTokenFromHeader('');
      expect(extracted).toBeNull();
    });

    it('should return null for invalid format (no Bearer)', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature';
      const extracted = extractTokenFromHeader(token);
      expect(extracted).toBeNull();
    });

    it('should return null for invalid format (wrong scheme)', () => {
      const header = 'Basic sometoken123';
      const extracted = extractTokenFromHeader(header);
      expect(extracted).toBeNull();
    });

    it('should return null for malformed header (too many parts)', () => {
      const header = 'Bearer token extra';
      const extracted = extractTokenFromHeader(header);
      expect(extracted).toBeNull();
    });
  });

  describe('Role Checking', () => {
    it('should return true when user has required role', () => {
      const result = hasRole(UserRole.CAREGIVER, [UserRole.CAREGIVER, UserRole.COMPANY]);
      expect(result).toBe(true);
    });

    it('should return false when user lacks required role', () => {
      const result = hasRole(UserRole.PATIENT, [UserRole.CAREGIVER, UserRole.COMPANY]);
      expect(result).toBe(false);
    });

    it('should return true for SUPER_ADMIN in admin roles', () => {
      const result = hasRole(UserRole.SUPER_ADMIN, [UserRole.SUPER_ADMIN, UserRole.MODERATOR]);
      expect(result).toBe(true);
    });

    it('should work with hasAnyRole alias', () => {
      expect(hasAnyRole(UserRole.GUARDIAN, [UserRole.GUARDIAN, UserRole.PATIENT])).toBe(true);
      expect(hasAnyRole(UserRole.CAREGIVER, [UserRole.GUARDIAN, UserRole.PATIENT])).toBe(false);
    });

    it('should return false for empty role list', () => {
      const result = hasRole(UserRole.CAREGIVER, []);
      expect(result).toBe(false);
    });
  });

  describe('Permission Checking', () => {
    it('should grant SUPER_ADMIN all permissions', () => {
      expect(hasPermission(UserRole.SUPER_ADMIN, 'manage:users')).toBe(true);
      expect(hasPermission(UserRole.SUPER_ADMIN, 'manage:payments')).toBe(true);
      expect(hasPermission(UserRole.SUPER_ADMIN, 'view:analytics')).toBe(true);
    });

    it('should grant MODERATOR moderation permissions', () => {
      expect(hasPermission(UserRole.MODERATOR, 'verify:companies')).toBe(true);
      expect(hasPermission(UserRole.MODERATOR, 'manage:disputes')).toBe(true);
      expect(hasPermission(UserRole.MODERATOR, 'moderate:content')).toBe(true);
    });

    it('should deny MODERATOR admin permissions', () => {
      expect(hasPermission(UserRole.MODERATOR, 'manage:users')).toBe(false);
      expect(hasPermission(UserRole.MODERATOR, 'manage:system')).toBe(false);
    });

    it('should grant COMPANY company permissions', () => {
      expect(hasPermission(UserRole.COMPANY, 'manage:own:caregivers')).toBe(true);
      expect(hasPermission(UserRole.COMPANY, 'create:packages')).toBe(true);
      expect(hasPermission(UserRole.COMPANY, 'manage:own:jobs')).toBe(true);
    });

    it('should deny COMPANY global permissions', () => {
      expect(hasPermission(UserRole.COMPANY, 'manage:users')).toBe(false);
      expect(hasPermission(UserRole.COMPANY, 'verify:companies')).toBe(false);
    });

    it('should grant CAREGIVER own profile permissions', () => {
      expect(hasPermission(UserRole.CAREGIVER, 'view:own:profile')).toBe(true);
      expect(hasPermission(UserRole.CAREGIVER, 'view:assigned:jobs')).toBe(true);
      expect(hasPermission(UserRole.CAREGIVER, 'create:care:logs')).toBe(true);
    });

    it('should deny CAREGIVER management permissions', () => {
      expect(hasPermission(UserRole.CAREGIVER, 'manage:users')).toBe(false);
      expect(hasPermission(UserRole.CAREGIVER, 'create:packages')).toBe(false);
    });

    it('should grant GUARDIAN patient management permissions', () => {
      expect(hasPermission(UserRole.GUARDIAN, 'manage:own:patients')).toBe(true);
      expect(hasPermission(UserRole.GUARDIAN, 'create:jobs')).toBe(true);
      expect(hasPermission(UserRole.GUARDIAN, 'make:payments')).toBe(true);
    });

    it('should grant PATIENT view permissions', () => {
      expect(hasPermission(UserRole.PATIENT, 'view:own:profile')).toBe(true);
      expect(hasPermission(UserRole.PATIENT, 'view:own:care:logs')).toBe(true);
    });

    it('should deny PATIENT all other permissions', () => {
      expect(hasPermission(UserRole.PATIENT, 'create:jobs')).toBe(false);
      expect(hasPermission(UserRole.PATIENT, 'manage:own:patients')).toBe(false);
    });

    it('should return false for unknown role', () => {
      expect(hasPermission('UNKNOWN_ROLE' as any, 'manage:users')).toBe(false);
    });

    it('should return false for unknown permission', () => {
      expect(hasPermission(UserRole.SUPER_ADMIN, 'unknown:permission')).toBe(false);
    });
  });

  describe('OTP Generation', () => {
    it('should generate 6-digit OTP', () => {
      const otp = generateOTP();

      expect(otp).toBeTruthy();
      expect(otp.length).toBe(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('should generate different OTPs', () => {
      const otps = new Set();
      for (let i = 0; i < 100; i++) {
        otps.add(generateOTP());
      }

      // Should have generated mostly unique OTPs (allow some collisions due to randomness)
      expect(otps.size).toBeGreaterThan(95);
    });

    it('should generate OTP within valid range', () => {
      for (let i = 0; i < 20; i++) {
        const otp = generateOTP();
        const num = parseInt(otp, 10);

        expect(num).toBeGreaterThanOrEqual(100000);
        expect(num).toBeLessThanOrEqual(999999);
      }
    });
  });

  describe('MFA Secret Generation', () => {
    it('should generate 32-character secret', () => {
      const secret = generateMFASecret();

      expect(secret).toBeTruthy();
      expect(secret.length).toBe(32);
    });

    it('should use valid Base32 characters', () => {
      const secret = generateMFASecret();

      // Base32 uses A-Z and 2-7
      expect(/^[A-Z2-7]+$/.test(secret)).toBe(true);
    });

    it('should generate different secrets', () => {
      const secrets = new Set();
      for (let i = 0; i < 100; i++) {
        secrets.add(generateMFASecret());
      }

      // All should be unique
      expect(secrets.size).toBe(100);
    });

    it('should not contain invalid Base32 characters', () => {
      for (let i = 0; i < 20; i++) {
        const secret = generateMFASecret();

        // Should not contain 0, 1, 8, 9
        expect(secret).not.toMatch(/[018]/);
        // Should not contain lowercase
        expect(secret).not.toMatch(/[a-z]/);
      }
    });
  });
});
