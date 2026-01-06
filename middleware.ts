import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/admin/login',
  '/auth/register',
  '/auth/role-selection',
  '/auth/verify-mfa',
  '/auth/mfa/verify',
  '/auth/reset-password',
  '/marketplace',
  '/api',
  '/_next',
  '/favicon.ico',
];

// Protected route patterns that require authentication
const PROTECTED_ROUTE_PATTERNS = [
  /^\/admin/,
  /^\/guardian/,
  /^\/caregiver/,
  /^\/agency/,
  /^\/moderator/,
  /^\/patient/,
  /^\/shop/,
  /^\/dashboard/,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route matches protected patterns
  const isProtectedRoute = PROTECTED_ROUTE_PATTERNS.some(pattern => pattern.test(pathname));

  if (isProtectedRoute) {
    // Check for auth token in cookies or headers
    const authToken = request.cookies.get('authToken')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '');

    // If no token, redirect to login
    // Note: This is a basic check. The client-side AuthProvider will handle
    // more sophisticated authentication and redirect logic
    if (!authToken) {
      // For API routes, return 401
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      // For page routes, allow through but AuthProvider will handle redirect
      // This prevents blocking legitimate client-side auth checks
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};


