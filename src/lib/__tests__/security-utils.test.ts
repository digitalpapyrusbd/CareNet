import {
  SECURITY_CONFIG,
  validatePassword,
  validateBangladeshPhone,
  generateSecureToken,
  generateOTP,
  hashPassword,
  verifyPassword,
  generateTokens,
  verifyToken,
  sanitizeInput,
  generateCSRFToken,
  validateFileUpload,
  RateLimiter,
  authRateLimiter,
  generalRateLimiter,
  passwordResetRateLimiter,
} from '../security';

// Unmock bcryptjs for real password testing
jest.unmock('bcryptjs');

describe('security.ts', () => {
  describe('SECURITY_CONFIG', () => {
    it('should have password requirements', () => {
      expect(SECURITY_CONFIG.password.minLength).toBe(8);
      expect(SECURITY_CONFIG.password.maxLength).toBe(128);
      expect(SECURITY_CONFIG.password.saltRounds).toBe(12);
    });

    it('should have JWT configuration', () => {
      expect(SECURITY_CONFIG.jwt.accessTokenExpiry).toBe('15m');
      expect(SECURITY_CONFIG.jwt.refreshTokenExpiry).toBe('7d');
      expect(SECURITY_CONFIG.jwt.algorithm).toBe('HS256');
    });

    it('should have rate limit configuration', () => {
      expect(SECURITY_CONFIG.rateLimit.windowMs).toBe(15 * 60 * 1000);
      expect(SECURITY_CONFIG.rateLimit.maxRequests).toBe(100);
    });

    it('should have file upload configuration', () => {
      expect(SECURITY_CONFIG.fileUpload.maxFileSize).toBe(10 * 1024 * 1024);
      expect(SECURITY_CONFIG.fileUpload.allowedMimeTypes).toContain('image/jpeg');
    });
  });

  describe('validatePassword', () => {
    it('should accept valid password', () => {
      const result = validatePassword('ValidPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password too short', () => {
      const result = validatePassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password too long', () => {
      const longPassword = 'A'.repeat(129) + '1!';
      const result = validatePassword(longPassword);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must not exceed 128 characters');
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('lowercase123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('UPPERCASE123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without numbers', () => {
      const result = validatePassword('NoNumbersHere!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special characters', () => {
      const result = validatePassword('NoSpecialChar123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should return multiple errors for invalid password', () => {
      const result = validatePassword('short');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    it('should accept password with various special characters', () => {
      const passwords = ['Valid123!', 'Valid123@', 'Valid123#', 'Valid123$', 'Valid123%'];
      passwords.forEach(pwd => {
        expect(validatePassword(pwd).isValid).toBe(true);
      });
    });
  });

  describe('validateBangladeshPhone', () => {
    it('should accept valid Bangladesh phone numbers', () => {
      expect(validateBangladeshPhone('+8801712345678')).toBe(true);
      expect(validateBangladeshPhone('+8801812345678')).toBe(true);
      expect(validateBangladeshPhone('+8801912345678')).toBe(true);
    });

    it('should accept phone with spaces and dashes', () => {
      expect(validateBangladeshPhone('+880 171 234 5678')).toBe(true);
      expect(validateBangladeshPhone('+880-171-234-5678')).toBe(true);
      expect(validateBangladeshPhone('+880 (171) 234-5678')).toBe(true);
    });

    it('should reject invalid Bangladesh phone numbers', () => {
      expect(validateBangladeshPhone('+8801012345678')).toBe(false); // starts with 0
      expect(validateBangladeshPhone('+8801112345678')).toBe(false); // starts with 1
      expect(validateBangladeshPhone('+8801212345678')).toBe(false); // starts with 2
    });

    it('should reject phone numbers with wrong length', () => {
      expect(validateBangladeshPhone('+880171234567')).toBe(false); // too short
      expect(validateBangladeshPhone('+88017123456789')).toBe(false); // too long
    });

    it('should reject phone numbers without +880 prefix', () => {
      expect(validateBangladeshPhone('01712345678')).toBe(false);
      expect(validateBangladeshPhone('8801712345678')).toBe(false);
    });

    it('should reject non-Bangladesh country codes', () => {
      expect(validateBangladeshPhone('+1234567890')).toBe(false);
      expect(validateBangladeshPhone('+919876543210')).toBe(false);
    });
  });

  describe('generateSecureToken', () => {
    it('should generate token with default length', () => {
      const token = generateSecureToken();
      expect(token).toBeTruthy();
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
    });

    it('should generate token with custom length', () => {
      const token = generateSecureToken(16);
      expect(token.length).toBe(32); // 16 bytes = 32 hex chars
    });

    it('should generate unique tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateSecureToken());
      }
      expect(tokens.size).toBe(100);
    });

    it('should generate hexadecimal string', () => {
      const token = generateSecureToken();
      expect(/^[0-9a-f]+$/.test(token)).toBe(true);
    });
  });

  describe('generateOTP', () => {
    it('should generate 6-digit OTP by default', () => {
      const otp = generateOTP();
      expect(otp.length).toBe(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('should generate OTP with custom length', () => {
      const otp = generateOTP(4);
      expect(otp.length).toBe(4);
      expect(/^\d{4}$/.test(otp)).toBe(true);
    });

    it('should generate different OTPs', () => {
      const otps = new Set();
      for (let i = 0; i < 50; i++) {
        otps.add(generateOTP());
      }
      // Should be mostly unique (allow some collisions)
      expect(otps.size).toBeGreaterThan(45);
    });
  });

  describe('Password Hashing', () => {
    it('should hash password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeTruthy();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should verify correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword456!';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
      expect(await verifyPassword(password, hash1)).toBe(true);
      expect(await verifyPassword(password, hash2)).toBe(true);
    });
  });

  describe('JWT Token Operations', () => {
    it('should generate access and refresh tokens', () => {
      const tokens = generateTokens('user123', 'CAREGIVER');

      expect(tokens.accessToken).toBeTruthy();
      expect(tokens.refreshToken).toBeTruthy();
      expect(tokens.accessToken.split('.').length).toBe(3);
      expect(tokens.refreshToken.split('.').length).toBe(3);
    });

    it('should verify valid access token', () => {
      const tokens = generateTokens('user123', 'CAREGIVER');
      const decoded = verifyToken(tokens.accessToken);

      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe('user123');
      expect(decoded.role).toBe('CAREGIVER');
      expect(decoded.type).toBe('access');
    });

    it('should verify valid refresh token', () => {
      const tokens = generateTokens('user123', 'CAREGIVER');
      const decoded = verifyToken(tokens.refreshToken, true);

      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe('user123');
      expect(decoded.type).toBe('refresh');
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid.token.here');
      expect(decoded).toBeNull();
    });

    it('should return null when verifying access token as refresh', () => {
      const tokens = generateTokens('user123', 'CAREGIVER');
      const decoded = verifyToken(tokens.accessToken, true);
      expect(decoded).toBeNull();
    });

    it('should return null when verifying refresh token as access', () => {
      const tokens = generateTokens('user123', 'CAREGIVER');
      const decoded = verifyToken(tokens.refreshToken, false);
      expect(decoded).toBeNull();
    });
  });

  describe('sanitizeInput', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const sanitized = sanitizeInput(input);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;');
      expect(sanitized).toContain('&gt;');
    });

    it('should escape quotes', () => {
      const input = 'He said "Hello" and she said \'Hi\'';
      const sanitized = sanitizeInput(input);

      expect(sanitized).toContain('&quot;');
      expect(sanitized).toContain('&#x27;');
    });

    it('should escape forward slashes', () => {
      const input = '</script>';
      const sanitized = sanitizeInput(input);

      expect(sanitized).toContain('&#x2F;');
    });

    it('should handle empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should handle null/undefined gracefully', () => {
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
    });

    it('should preserve safe text', () => {
      const input = 'This is safe text 123';
      const sanitized = sanitizeInput(input);

      expect(sanitized).toBe(input);
    });
  });

  describe('generateCSRFToken', () => {
    it('should generate CSRF token', () => {
      const token = generateCSRFToken();

      expect(token).toBeTruthy();
      expect(token.length).toBe(64);
    });

    it('should generate unique CSRF tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateCSRFToken());
      }
      expect(tokens.size).toBe(100);
    });
  });

  describe('validateFileUpload', () => {
    const createMockFile = (size: number, type: string): File => {
      return {
        size,
        type,
        name: 'test-file',
      } as File;
    };

    it('should accept valid file', () => {
      const file = createMockFile(5 * 1024 * 1024, 'image/jpeg');
      const result = validateFileUpload(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject file exceeding max size', () => {
      const file = createMockFile(11 * 1024 * 1024, 'image/jpeg');
      const result = validateFileUpload(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds maximum allowed size');
    });

    it('should reject disallowed file type', () => {
      const file = createMockFile(1 * 1024 * 1024, 'application/x-executable');
      const result = validateFileUpload(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File type not allowed');
    });

    it('should accept all allowed mime types', () => {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      allowedTypes.forEach(type => {
        const file = createMockFile(1024, type);
        const result = validateFileUpload(file);
        expect(result.isValid).toBe(true);
      });
    });

    it('should accept file at exactly max size', () => {
      const file = createMockFile(10 * 1024 * 1024, 'image/jpeg');
      const result = validateFileUpload(file);

      expect(result.isValid).toBe(true);
    });
  });

  describe('RateLimiter', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should allow requests under the limit', () => {
      const limiter = new RateLimiter(60000, 5); // 5 requests per minute

      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(true);
    });

    it('should block requests over the limit', () => {
      const limiter = new RateLimiter(60000, 3); // 3 requests per minute

      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(false); // Over limit
    });

    it('should track different keys separately', () => {
      const limiter = new RateLimiter(60000, 2);

      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user2')).toBe(true); // Different key
      expect(limiter.isAllowed('user2')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(false); // user1 over limit
      expect(limiter.isAllowed('user2')).toBe(false); // user2 over limit
    });

    it('should allow requests after window expires', () => {
      const limiter = new RateLimiter(1000, 2); // 2 requests per second

      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(false); // Over limit

      // Advance time past the window
      jest.advanceTimersByTime(1001);

      expect(limiter.isAllowed('user1')).toBe(true); // Should be allowed again
    });

    it('should reset specific key', () => {
      const limiter = new RateLimiter(60000, 2);

      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(false); // Over limit

      limiter.reset('user1');

      expect(limiter.isAllowed('user1')).toBe(true); // Allowed after reset
    });

    it('should reset all keys', () => {
      const limiter = new RateLimiter(60000, 1);

      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user2')).toBe(true);
      expect(limiter.isAllowed('user1')).toBe(false);
      expect(limiter.isAllowed('user2')).toBe(false);

      limiter.reset();

      expect(limiter.isAllowed('user1')).toBe(true);
      expect(limiter.isAllowed('user2')).toBe(true);
    });
  });

  describe('Predefined Rate Limiters', () => {
    it('should have authRateLimiter configured', () => {
      expect(authRateLimiter).toBeInstanceOf(RateLimiter);
    });

    it('should have generalRateLimiter configured', () => {
      expect(generalRateLimiter).toBeInstanceOf(RateLimiter);
    });

    it('should have passwordResetRateLimiter configured', () => {
      expect(passwordResetRateLimiter).toBeInstanceOf(RateLimiter);
    });
  });
});
