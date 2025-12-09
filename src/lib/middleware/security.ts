import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/security';
import { authRateLimiter, generalRateLimiter } from '@/lib/security';

/**
 * Security middleware for Next.js API routes
 * Implements authentication, authorization, rate limiting, and security headers
 */

export async function securityMiddleware(
  request: NextRequest,
  requiredRole?: string[]
): Promise<NextResponse | null> {
  // 1. Rate limiting
  const clientIp = request.ip || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check rate limits
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

  // 4. Security headers
  const securityHeaders = {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Content Security Policy
    'Content-Security-Policy': [
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
    
    // HSTS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // Permissions policy
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };

  // 5. Request validation
  const url = request.url;
  const method = request.method;
  
  // Block suspicious user agents
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /scanner/i,
    /sqlmap/i,
    /nmap/i,
  ];
  
  const isSuspiciousUA = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  if (isSuspiciousUA && !url.includes('/api/health')) {
    console.warn(`Suspicious user agent detected: ${userAgent} from IP: ${clientIp}`);
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    );
  }

  // 6. Request size limits
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
    return NextResponse.json(
      { error: 'Request entity too large' },
      { status: 413 }
    );
  }

  // 7. Add security context to request
  (request as any).user = user;
  (request as any).userRole = userRole;
  (request as any).clientIp = clientIp;

  // Return null to continue to the actual handler
  return null;
}

/**
 * CSRF protection middleware
 */
export async function csrfProtection(request: NextRequest): Promise<NextResponse | null> {
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

/**
 * Input validation middleware
 */
export function validateInput(request: NextRequest): NextResponse | null {
  const url = request.url;
  const method = request.method;

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

/**
 * Comprehensive security middleware that combines all security measures
 */
export async function comprehensiveSecurity(
  request: NextRequest,
  options: {
    requireAuth?: boolean;
    requiredRole?: string[];
    enableCSRF?: boolean;
    enableInputValidation?: boolean;
  } = {}
): Promise<NextResponse | null> {
  // 1. Input validation
  if (options.enableInputValidation) {
    const validationResult = validateInput(request);
    if (validationResult) {
      return validationResult;
    }
  }

  // 2. CSRF protection
  if (options.enableCSRF) {
    const csrfResult = await csrfProtection(request);
    if (csrfResult) {
      return csrfResult;
    }
  }

  // 3. Authentication and authorization
  if (options.requireAuth) {
    const authResult = await securityMiddleware(request, options.requiredRole);
    if (authResult) {
      return authResult;
    }
  }

  // 4. Add security headers to all responses
  const response = NextResponse.next();
  
  // Set security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'"
  );
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Return null to continue to the actual handler
  return null;
}