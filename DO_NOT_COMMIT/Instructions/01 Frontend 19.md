# Frontend 19: Security Practices

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Related Files**: [TOC](01%20Frontend%20TOC.md) | [01: Architecture](01%20Frontend%2001.md) | [02: Authentication](01%20Frontend%2002.md)

---

## 📋 Table of Contents

1. [Security Overview](#security-overview)
2. [Authentication Security](#authentication-security)
3. [XSS Prevention](#xss-prevention)
4. [CSRF Protection](#csrf-protection)
5. [SQL Injection Prevention](#sql-injection-prevention)
6. [Input Validation](#input-validation)
7. [Rate Limiting](#rate-limiting)
8. [Security Headers](#security-headers)
9. [Data Sanitization](#data-sanitization)
10. [File Upload Security](#file-upload-security)
11. [Debugging Guide](#debugging-guide)
12. [Testing Guide](#testing-guide)
13. [Security Progress Log](#security-progress-log)

---

## 🔒 Security Overview

### **Security Configuration**

**File**: `/src/lib/security.ts`

```typescript
export const SECURITY_CONFIG = {
  // Password requirements
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    saltRounds: 12,
  },
  
  // JWT configuration
  jwt: {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
    algorithm: 'HS256',
    issuer: 'caregiver-platform',
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // Limit each IP to 100 requests per windowMs
    authRequests: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // Limit auth attempts to 5 per windowMs
    },
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3, // Limit password reset to 3 per hour
    },
  },
  
  // Session configuration
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  },
  
  // CORS configuration
  cors: {
    origin: process.env.NEXT_PUBLIC_CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
  },
  
  // File upload security
  fileUpload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    virusScan: process.env.NODE_ENV === 'production',
  },
};
```

---

## 🔐 Authentication Security

### **Password Validation**

**File**: `/src/lib/security.ts`

```typescript
export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const {
    minLength,
    maxLength,
    requireUppercase,
    requireLowercase,
    requireNumbers,
    requireSpecialChars,
  } = SECURITY_CONFIG.password;
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (password.length > maxLength) {
    errors.push(`Password must not exceed ${maxLength} characters`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

### **Password Hashing (bcrypt)**

```typescript
import bcrypt from 'bcryptjs';

// Hash password with salt
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SECURITY_CONFIG.password.saltRounds);
  return bcrypt.hash(password, salt);
};

// Verify password against hash
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
```

### **JWT Token Generation**

```typescript
import jwt, { SignOptions, Algorithm } from 'jsonwebtoken';

export const generateTokens = (
  userId: string,
  userRole: string
): { accessToken: string; refreshToken: string } => {
  const payload = {
    userId,
    role: userRole,
    type: 'access',
  };
  
  const accessTokenOptions: SignOptions = {
    expiresIn: SECURITY_CONFIG.jwt.accessTokenExpiry,
    algorithm: SECURITY_CONFIG.jwt.algorithm as Algorithm,
    issuer: SECURITY_CONFIG.jwt.issuer,
  };
  
  const refreshTokenOptions: SignOptions = {
    expiresIn: SECURITY_CONFIG.jwt.refreshTokenExpiry,
    algorithm: SECURITY_CONFIG.jwt.algorithm as Algorithm,
    issuer: SECURITY_CONFIG.jwt.issuer,
  };
  
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fallback-secret',
    accessTokenOptions
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    refreshTokenOptions
  );
  
  return { accessToken, refreshToken };
};
```

### **JWT Token Verification**

```typescript
export const verifyToken = (token: string, isRefreshToken = false): any => {
  try {
    const secret = isRefreshToken
      ? process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'
      : process.env.JWT_SECRET || 'fallback-secret';
    
    return jwt.verify(token, secret, {
      algorithms: [SECURITY_CONFIG.jwt.algorithm as jwt.Algorithm],
      issuer: SECURITY_CONFIG.jwt.issuer,
    });
  } catch (error) {
    return null;
  }
};
```

---

## 🛡️ XSS Prevention

### **Input Sanitization**

**File**: `/src/lib/security.ts`

```typescript
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')       // < to &lt;
    .replace(/>/g, '&gt;')       // > to &gt;
    .replace(/"/g, '&quot;')     // " to &quot;
    .replace(/'/g, '&#x27;')     // ' to &#x27;
    .replace(/\//g, '&#x2F;');   // / to &#x2F;
};
```

### **XSS Detection in URLs**

**File**: `/src/lib/middleware/security.ts`

```typescript
export function validateInput(request: NextRequest): NextResponse | null {
  const url = request.url;

  // XSS patterns in URL
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]*src[^>]*=javascript:/gi,
    /<iframe[^>]*src[^>]*=javascript:/gi,
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(url)) {
      console.warn(`XSS attempt detected: ${url}`);
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }
  }

  return null;
}
```

### **React dangerouslySetInnerHTML Prevention**

```tsx
// ❌ NEVER use dangerouslySetInnerHTML with user input
function UnsafeComponent({ userInput }) {
  return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
}

// ✅ ALWAYS escape user input
function SafeComponent({ userInput }) {
  return <div>{sanitizeInput(userInput)}</div>;
}

// ✅ Use DOMPurify for rich text (if needed)
import DOMPurify from 'dompurify';

function RichTextComponent({ html }) {
  const cleanHtml = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}
```

---

## 🔐 CSRF Protection

### **CSRF Token Generation**

```typescript
import crypto from 'crypto';

export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
```

### **CSRF Middleware**

**File**: `/src/lib/middleware/security.ts`

```typescript
export async function csrfProtection(
  request: NextRequest
): Promise<NextResponse | null> {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'https://localhost:3000',
  ].filter(Boolean);

  // Check origin for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    if (!origin || !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: 'Invalid origin' },
        { status: 403 }
      );
    }
  }

  // Check CSRF token for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const csrfToken = request.headers.get('x-csrf-token');
    const sessionCsrfToken = request.cookies.get('csrf-token')?.value;

    if (!csrfToken || csrfToken !== sessionCsrfToken) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
  }

  return null;
}
```

### **Client-Side CSRF Token**

```typescript
// Store CSRF token in cookie
export function setCSRFToken(token: string) {
  document.cookie = `csrf-token=${token}; path=/; samesite=strict; secure`;
}

// Attach CSRF token to requests
export async function makeSecureRequest(url: string, options: RequestInit = {}) {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf-token='))
    ?.split('=')[1];

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'X-CSRF-Token': csrfToken || '',
    },
  });
}
```

---

## 💉 SQL Injection Prevention

### **SQL Injection Detection**

**File**: `/src/lib/middleware/security.ts`

```typescript
export function validateInput(request: NextRequest): NextResponse | null {
  const url = request.url;

  // SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /(--|;|\/\*|\/\*|--)/i,
  ];

  // Check URL for SQL injection
  for (const pattern of sqlPatterns) {
    if (pattern.test(url)) {
      console.warn(`SQL injection attempt detected: ${url}`);
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }
  }

  return null;
}
```

### **Parameterized Queries (Prisma)**

```typescript
// ✅ Safe: Prisma uses parameterized queries
const user = await prisma.user.findUnique({
  where: { phone: userInput }, // Automatically escaped
});

// ✅ Safe: Prisma query builder
const users = await prisma.user.findMany({
  where: {
    name: { contains: searchTerm }, // Safely parameterized
  },
});

// ❌ NEVER use raw SQL with user input
const unsafe = await prisma.$queryRaw`
  SELECT * FROM users WHERE name = '${userInput}'
`;

// ✅ If raw SQL is needed, use parameterized version
const safe = await prisma.$queryRaw`
  SELECT * FROM users WHERE name = ${userInput}
`;
```

---

## ✅ Input Validation

### **Zod Schema Validation**

**File**: `/src/lib/validations/schemas.ts`

```typescript
import { z } from 'zod';

// User registration schema
export const userRegistrationSchema = z.object({
  role: z.enum(['COMPANY', 'CAREGIVER', 'GUARDIAN', 'PATIENT']),
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  language: z.string().default('en'),
});

// User login schema
export const userLoginSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  password: z.string().min(1, 'Password is required'),
  mfaCode: z.string().length(6, 'MFA code must be 6 digits').optional(),
});

// Password reset schema
export const passwordResetSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
});
```

### **Validation Middleware**

**File**: `/src/lib/middleware/validation.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Generic validation function
export function validateRequest<T>(schema: any, data: any) {
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: createValidationError(error) };
    }
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      ),
    };
  }
}

// Validation error response
function createValidationError(error: ZodError) {
  return NextResponse.json(
    {
      error: 'Validation failed',
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    },
    { status: 400 }
  );
}

// Request body validation middleware
export function validateBody(schema: any) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json();
      const validation = validateRequest(schema, body);
      
      if (!validation.success) {
        return validation.error;
      }
      
      // Attach validated data to request
      (request as any).validatedBody = validation.data;
      return null;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
  };
}
```

### **Phone Number Validation (Bangladesh)**

```typescript
export const validateBangladeshPhone = (phone: string): boolean => {
  // Remove any spaces, dashes, or parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check for Bangladesh format: +8801[3-9]\d{8}
  const bangladeshRegex = /^\+8801[3-9]\d{8}$/;
  
  return bangladeshRegex.test(cleanPhone);
};
```

---

## ⏱️ Rate Limiting

### **Rate Limiter Class**

**File**: `/src/lib/security.ts`

```typescript
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private windowMs: number,
    private maxRequests: number
  ) {}
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const timestamps = this.requests.get(key)!;
    
    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(
      timestamp => timestamp > windowStart
    );
    
    // Check if under the limit
    if (validTimestamps.length >= this.maxRequests) {
      return false;
    }
    
    // Add current timestamp and update
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    
    return true;
  }
  
  reset(key?: string): void {
    if (key) {
      this.requests.delete(key);
    } else {
      this.requests.clear();
    }
  }
}

// Create rate limiters for different use cases
export const authRateLimiter = new RateLimiter(
  SECURITY_CONFIG.rateLimit.authRequests.windowMs,
  SECURITY_CONFIG.rateLimit.authRequests.maxRequests
);

export const generalRateLimiter = new RateLimiter(
  SECURITY_CONFIG.rateLimit.windowMs,
  SECURITY_CONFIG.rateLimit.maxRequests
);

export const passwordResetRateLimiter = new RateLimiter(
  SECURITY_CONFIG.rateLimit.passwordReset.windowMs,
  SECURITY_CONFIG.rateLimit.passwordReset.maxRequests
);
```

### **Upstash Rate Limiting**

**File**: `/src/lib/middleware/rateLimit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

let upstashRatelimit: any = null;

function getIpKey(req: Request) {
  const auth = req.headers?.get('authorization') ?? '';
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  
  const xfwd = req.headers?.get('x-forwarded-for') || req.headers?.get('x-real-ip');
  if (xfwd) return String(xfwd).split(',')[0].trim();
  
  return 'anonymous';
}

export async function rateLimitRequest(
  req: Request,
  opts?: { key?: string; limit?: number; windowSeconds?: number }
) {
  const limit = opts?.limit ?? 20;
  const windowSeconds = opts?.windowSeconds ?? 60;
  const key = opts?.key ?? getIpKey(req);

  // Prefer Upstash if configured
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (url && token) {
      if (!upstashRatelimit) {
        const redis = new Redis({ url, token });
        upstashRatelimit = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(limit, `${windowSeconds}s`),
        });
      }
      
      const res = await upstashRatelimit.limit(key);
      if (!res.success) {
        return NextResponse.json(
          { error: 'rate_limited', remaining: 0 },
          { status: 429 }
        );
      }
      return undefined;
    }
  } catch (err) {
    console.warn('Upstash rate-limit failed, falling back to local limiter', err);
  }

  // Fallback to local rate limiter
  return undefined;
}
```

---

## 🔒 Security Headers

### **Security Headers Configuration**

**File**: `/next.config.js`

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        // Prevent clickjacking
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        // Prevent MIME type sniffing
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        // Enable XSS protection
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        // Referrer policy
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        // Content Security Policy
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "font-src 'self'",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; '),
        },
        // HSTS
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
        // Permissions policy
        {
          key: 'Permissions-Policy',
          value: 'geolocation=(), microphone=(), camera=()',
        },
      ],
    },
  ];
}
```

### **Security Middleware**

**File**: `/src/lib/middleware/security.ts`

```typescript
export async function securityMiddleware(
  request: NextRequest,
  requiredRole?: string[]
): Promise<NextResponse | null> {
  // 1. Rate limiting
  const clientIp = request.ip || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  
  const isRateLimited = !generalRateLimiter.isAllowed(clientIp);
  if (isRateLimited) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': generalRateLimiter['maxRequests'].toString(),
          'X-RateLimit-Remaining': '0',
        }
      }
    );
  }

  // 2. Authentication and Authorization
  const authHeader = request.headers.get('authorization');
  let user = null;
  let userRole = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decodedToken = verifyToken(token);
    
    if (decodedToken) {
      user = decodedToken;
      userRole = decodedToken.role;
    }
  }

  // 3. Role-based access control
  if (requiredRole && (!user || !requiredRole.includes(userRole))) {
    return NextResponse.json(
      { error: 'Access denied. Insufficient permissions.' },
      { 
        status: 403,
        headers: {
          'WWW-Authenticate': 'Bearer realm="Caregiver Platform"',
        }
      }
    );
  }

  return null;
}
```

---

## 🧹 Data Sanitization

### **Sanitize User Input**

```typescript
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
```

### **Path Traversal Prevention**

```typescript
export function validateInput(request: NextRequest): NextResponse | null {
  const url = request.url;

  // Check for path traversal
  const pathTraversalPatterns = [
    /\.\.\//g,
    /\.\.\\/g,
    /%2e%2f/gi,
    /%2e%5c/gi,
    /\.\.\\/g,
    /\\\\\\\\\\\\\\./g,
  ];

  for (const pattern of pathTraversalPatterns) {
    if (pattern.test(url)) {
      console.warn(`Path traversal attempt detected: ${url}`);
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }
  }

  return null;
}
```

---

## 📁 File Upload Security

### **File Validation**

```typescript
export const validateFileUpload = (
  file: File
): { isValid: boolean; error?: string } => {
  const { maxFileSize, allowedMimeTypes } = SECURITY_CONFIG.fileUpload;
  
  if (file.size > maxFileSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${maxFileSize / (1024 * 1024)}MB`,
    };
  }
  
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not allowed',
    };
  }
  
  return { isValid: true };
};
```

### **Allowed File Types**

```typescript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
```

---

## 🐛 Debugging Guide

### **Issue: CSRF Token Mismatch**

**Problem**: API requests fail with "Invalid CSRF token".

**Solution**:
```typescript
// 1. Check cookie is set
console.log('CSRF Cookie:', document.cookie);

// 2. Check header is sent
console.log('CSRF Header:', request.headers.get('x-csrf-token'));

// 3. Verify tokens match
const cookieToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('csrf-token='))
  ?.split('=')[1];

console.log('Cookie Token:', cookieToken);
console.log('Header Token:', request.headers.get('x-csrf-token'));
```

### **Issue: Rate Limit Exceeded**

**Problem**: Users getting rate limited too quickly.

**Solution**:
```typescript
// Check rate limit status
const rateLimitStatus = {
  limit: response.headers.get('X-RateLimit-Limit'),
  remaining: response.headers.get('X-RateLimit-Remaining'),
  reset: response.headers.get('X-RateLimit-Reset'),
};

console.log('Rate Limit Status:', rateLimitStatus);

// Increase limits for authenticated users
if (user?.role === 'ADMIN') {
  maxRequests = 1000; // Higher limit for admins
}
```

---

## 🧪 Testing Guide

```typescript
describe('Security Tests', () => {
  describe('XSS Prevention', () => {
    it('should sanitize script tags', () => {
      const input = '<script>alert("XSS")</script>';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;');
      expect(sanitized).toContain('&gt;');
    });
  });

  describe('CSRF Protection', () => {
    it('should reject requests without CSRF token', async () => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' }),
      });
      
      expect(response.status).toBe(403);
      expect(await response.json()).toEqual({
        error: 'Invalid CSRF token',
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should block after max requests', async () => {
      const rateLimiter = new RateLimiter(60000, 5);
      
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.isAllowed('test-ip')).toBe(true);
      }
      
      expect(rateLimiter.isAllowed('test-ip')).toBe(false);
    });
  });

  describe('Password Validation', () => {
    it('should validate strong password', () => {
      const result = validatePassword('Test123!@#');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should reject weak password', () => {
      const result = validatePassword('weak');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
```

---

## 📊 Security Progress Log

### **✅ Implemented**
- **Authentication**: JWT with 15min access tokens, 7d refresh tokens
- **Password Security**: bcrypt with 12 salt rounds, strong validation
- **XSS Prevention**: Input sanitization, CSP headers, no dangerouslySetInnerHTML
- **CSRF Protection**: Token-based, origin checking for state-changing requests
- **SQL Injection**: Prisma parameterized queries, no raw SQL with user input
- **Rate Limiting**: 100 req/15min general, 5 req/15min auth, 3 req/hour password reset
- **Security Headers**: X-Frame-Options, CSP, HSTS, X-XSS-Protection, X-Content-Type-Options
- **Input Validation**: Zod schemas for all API endpoints, phone/email regex
- **File Upload**: 10MB limit, MIME type whitelist, virus scan in production

### **❌ TODO**
- [ ] Implement Content Security Policy (CSP) nonce for inline scripts
- [ ] Add security audit logging for sensitive operations
- [ ] Implement IP-based geofencing for Bangladesh
- [ ] Add brute force protection with exponential backoff
- [ ] Implement security incident response workflow
- [ ] Add automated security scanning (Snyk, OWASP ZAP)
- [ ] Implement secrets rotation policy
- [ ] Add honeypot fields for bot detection

---

**Last Updated**: December 11, 2025  
**Maintained By**: Security Team
