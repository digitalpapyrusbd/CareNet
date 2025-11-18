/**
 * Security penetration testing suite
 * Tests application against common security vulnerabilities
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { NextRequest } from 'next/server';

describe('Security Penetration Tests', () => {
  // Test data for security testing
  const maliciousInputs = [
    '<script>alert("XSS")</script>',
    'javascript:alert("XSS")',
    '"><script>alert("XSS")</script>',
    '\'; DROP TABLE users; --',
    ' OR 1=1 --',
    '../../../etc/passwd',
    '{{7*7}}',
    '${7*7}',
    '<img src=x onerror=alert("XSS")>',
    '"><svg onload=alert("XSS")>',
    '%3Cscript%3Ealert%28%22XSS%22%29%3C%2Fscript%3E',
  ];

  const sqlInjectionPayloads = [
    "' OR '1'='1",
    "' OR 1=1--",
    "' UNION SELECT * FROM users--",
    "'; DROP TABLE users; --",
    "' OR 1=1#",
    "' OR 'x'='x",
    "1' OR '1'='1' --",
    "x'; DELETE FROM users WHERE 't'='t",
  ];

  const pathTraversalPayloads = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32\\config\\system',
    '....//....//....//etc//passwd',
    '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
    '..%252f..%252f..%252fetc%252fpasswd',
  ];

  describe('Input Validation & Sanitization', () => {
    it('should reject XSS attempts in user registration', async () => {
      for (const payload of maliciousInputs) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: payload,
            email: `test-${Date.now()}@example.com`,
            phone: '+8801700000000',
            password: 'ValidPassword123!',
            role: 'GUARDIAN',
          }),
        });

        // Should either reject or sanitize the input
        if (response.ok) {
          const data = await response.json();
          // If successful, ensure data is sanitized
          expect(data.user?.name).not.toContain('<script>');
          expect(data.user?.name).not.toContain('javascript:');
        } else {
          // Rejection is also acceptable
          expect(response.status).toBeGreaterThanOrEqual(400);
        }
      }
    });

    it('should prevent SQL injection in login', async () => {
      for (const payload of sqlInjectionPayloads) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: payload,
            password: 'password',
          }),
        });

        // Should not authenticate with SQL injection
        expect(response.status).toBe(401);
        
        const data = await response.json();
        expect(data.error).toBeDefined();
        expect(data.token).toBeUndefined();
      }
    });

    it('should prevent path traversal attacks', async () => {
      for (const payload of pathTraversalPayloads) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${payload}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer fake-token',
          },
        });

        // Should return 404 or 403, not file contents
        expect([404, 403, 401]).toContain(response.status);
        
        // Should not return file system content
        const text = await response.text();
        expect(text).not.toContain('root:');
        expect(text).not.toContain('bin/bash');
      }
    });
  });

  describe('Authentication & Authorization', () => {
    it('should enforce proper authentication', async () => {
      const protectedEndpoints = [
        '/api/users',
        '/api/patients',
        '/api/jobs',
        '/api/companies',
        '/api/dashboard/stats',
      ];

      for (const endpoint of protectedEndpoints) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${endpoint}`, {
          method: 'GET',
        });

        expect(response.status).toBe(401);
        
        const data = await response.json();
        expect(data.error).toBeDefined();
      }
    });

    it('should reject invalid JWT tokens', async () => {
      const invalidTokens = [
        'invalid.token.here',
        'Bearer invalid',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature',
        '',
      ];

      for (const token of invalidTokens) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        expect(response.status).toBe(401);
      }
    });

    it('should enforce role-based access control', async () => {
      // Test with different user roles
      const roles = ['GUARDIAN', 'COMPANY', 'CAREGIVER', 'MODERATOR'];
      
      for (const role of roles) {
        // Mock authentication with specific role
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer mock-${role}-token`,
          },
        });

        // Only MODERATOR and SUPER_ADMIN should access admin endpoints
        if (['MODERATOR', 'SUPER_ADMIN'].includes(role)) {
          expect([200, 401]).toContain(response.status);
        } else {
          expect([401, 403]).toContain(response.status);
        }
      }
    });
  });

  describe('Rate Limiting', () => {
    it('should limit excessive requests', async () => {
      const endpoint = '/api/auth/login';
      const requests = Array.from({ length: 20 }, () =>
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: '+8801700000000',
            password: 'wrongpassword',
          }),
        })
      );

      const responses = await Promise.allSettled(requests);
      const rateLimitedResponses = responses.filter(
        (r): r is PromiseFulfilledResult<Response> =>
          r.status === 'fulfilled' && r.value.status === 429
      );

      // Should rate limit after certain number of requests
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it('should implement progressive rate limiting', async () => {
      // Test that rate limiting becomes more strict with repeated violations
      let blockedCount = 0;
      
      for (let i = 0; i < 10; i++) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: '+8801700000000',
            password: 'wrongpassword',
          }),
        });

        if (response.status === 429) {
          blockedCount++;
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Should block more aggressively with repeated attempts
      expect(blockedCount).toBeGreaterThan(2);
    });
  });

  describe('Data Exposure', () => {
    it('should not expose sensitive information in error messages', async () => {
      const endpoints = [
        '/api/users/invalid-id',
        '/api/patients/nonexistent',
        '/api/jobs/999999',
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer valid-token-format',
          },
        });

        const text = await response.text();
        
        // Should not expose database errors, stack traces, or internal paths
        expect(text).not.toContain('Error: ER_NO_SUCH_TABLE');
        expect(text).not.toContain('Stack trace:');
        expect(text).not.toContain('/var/www/');
        expect(text).not.toContain('prisma');
        expect(text).not.toContain('node_modules');
      }
    });

    it('should not expose sensitive data in API responses', async () => {
      // Test user endpoint to ensure password hashes are not exposed
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer mock-valid-token',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Should not expose sensitive fields
        expect(data.password).toBeUndefined();
        expect(data.passwordHash).toBeUndefined();
        expect(data.salt).toBeUndefined();
        expect(data.twoFactorSecret).toBeUndefined();
      }
    });
  });

  describe('HTTP Security Headers', () => {
    it('should include security headers', async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
        method: 'GET',
      });

      // Check for important security headers
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection',
        'strict-transport-security',
      ];

      for (const header of securityHeaders) {
        const headerValue = response.headers.get(header);
        // Headers should be present (in production)
        if (process.env.NODE_ENV === 'production') {
          expect(headerValue).toBeDefined();
        }
      }
    });
  });

  describe('File Upload Security', () => {
    it('should validate file types and sizes', async () => {
      const maliciousFiles = [
        { name: 'malicious.exe', type: 'application/octet-stream', size: 1024 * 1024 },
        { name: 'script.php', type: 'application/x-php', size: 1024 },
        { name: 'huge.jpg', type: 'image/jpeg', size: 10 * 1024 * 1024 }, // 10MB
      ];

      for (const file of maliciousFiles) {
        const formData = new FormData();
        const blob = new Blob(['fake content'], { type: file.type });
        formData.append('file', blob, file.name);

        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        // Should reject malicious or oversized files
        expect([400, 413, 415]).toContain(response.status);
      }
    });
  });

  describe('Cross-Origin Resource Sharing (CORS)', () => {
    it('should handle CORS properly', async () => {
      const origins = [
        'https://malicious-site.com',
        'https://phishing-site.net',
        'null',
      ];

      for (const origin of origins) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users`, {
          method: 'GET',
          headers: {
            'Origin': origin,
          },
        });

        const corsHeader = response.headers.get('Access-Control-Allow-Origin');
        
        // Should not allow arbitrary origins in production
        if (process.env.NODE_ENV === 'production') {
          expect(corsHeader).not.toBe('*');
          expect(corsHeader).not.toBe(origin);
        }
      }
    });
  });

  describe('Session Management', () => {
    it('should generate secure session tokens', async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: '+8801700000000',
          password: 'ValidPassword123!',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        
        // JWT tokens should have proper structure
        expect(token).toBeDefined();
        expect(token.split('.')).toHaveLength(3); // header.payload.signature
        
        // Should be reasonably long (secure)
        expect(token.length).toBeGreaterThan(100);
      }
    });

    it('should invalidate sessions on logout', async () => {
      // First login
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: '+8801700000000',
          password: 'ValidPassword123!',
        }),
      });

      const { token } = await loginResponse.json();

      // Then logout
      const logoutResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      expect(logoutResponse.status).toBe(200);

      // Token should no longer be valid
      const testResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      expect(testResponse.status).toBe(401);
    });
  });

  describe('Password Security', () => {
    it('should enforce strong password requirements', async () => {
      const weakPasswords = [
        '123456',
        'password',
        'qwerty',
        '111111',
        'abc123',
        'password123',
        'admin',
        'letmein',
      ];

      for (const password of weakPasswords) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Test User',
            email: `test-${Date.now()}@example.com`,
            phone: '+8801700000000',
            password: password,
            role: 'GUARDIAN',
          }),
        });

        // Should reject weak passwords
        expect(response.status).toBe(400);
        
        const data = await response.json();
        expect(data.error).toBeDefined();
        expect(data.error.toLowerCase()).toContain('password');
      }
    });

    it('should require password confirmation', async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: `test-${Date.now()}@example.com`,
          phone: '+8801700000000',
          password: 'ValidPassword123!',
          passwordConfirm: 'DifferentPassword456!',
          role: 'GUARDIAN',
        }),
      });

      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBeDefined();
      expect(data.error.toLowerCase()).toContain('match');
    });
  });
});