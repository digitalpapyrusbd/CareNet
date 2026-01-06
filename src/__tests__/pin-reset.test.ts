import { describe, it, expect, beforeEach } from '@jest/globals';
import { hashToken, generateResetToken, validatePin, isValidPhone } from '@/lib/pin-reset-service';

describe('PIN Reset Service', () => {
  describe('hashToken', () => {
    it('should hash a token using bcrypt', async () => {
      const token = 'test-token-123';
      const hashed = await hashToken(token);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(token);
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for the same token (salted)', async () => {
      const token = 'test-token-123';
      const hash1 = await hashToken(token);
      const hash2 = await hashToken(token);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateResetToken', () => {
    it('should generate a 64-character hex string', () => {
      const token = generateResetToken();

      expect(token).toBeDefined();
      expect(token.length).toBe(64);
      expect(token).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate unique tokens', () => {
      const token1 = generateResetToken();
      const token2 = generateResetToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('validatePin', () => {
    it('should validate 6-digit PINs', () => {
      expect(validatePin('123456')).toBe(true);
      expect(validatePin('000000')).toBe(true);
      expect(validatePin('999999')).toBe(true);
    });

    it('should reject non-6-digit PINs', () => {
      expect(validatePin('12345')).toBe(false);
      expect(validatePin('1234567')).toBe(false);
      expect(validatePin('12345a')).toBe(false);
      expect(validatePin('')).toBe(false);
      expect(validatePin('12345 ')).toBe(false);
    });

    it('should reject non-numeric PINs', () => {
      expect(validatePin('12345a')).toBe(false);
      expect(validatePin('abcdef')).toBe(false);
      expect(validatePin('12 345')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate Bangladeshi phone numbers', () => {
      expect(isValidPhone('+8801712345678')).toBe(true);
      expect(isValidPhone('+8801812345678')).toBe(true);
      expect(isValidPhone('01712345678')).toBe(true);
      expect(isValidPhone('01812345678')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('1234567890')).toBe(false);
      expect(isValidPhone('+880123456789')).toBe(false); // Wrong operator
      expect(isValidPhone('+880171234567')).toBe(false); // Too short
      expect(isValidPhone('+88017123456789')).toBe(false); // Too long
      expect(isValidPhone('')).toBe(false);
    });
  });
});
```
</tool_response>
