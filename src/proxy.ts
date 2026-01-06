import { NextRequest, NextResponse } from 'next/server';

// Lightweight, permissive CORS proxy used during tests and local development.
// Applies to API routes via the matcher config below.
export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin') || '*';

  const corsHeaders = {
    // Use wildcard to avoid strict origin mismatches in test/jsdom environments
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, x-bkash-signature, x-bkash-timestamp',
    'Access-Control-Allow-Credentials': 'true',
  };

  // Respond to preflight requests immediately
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // For all other requests, continue and attach CORS headers on the response
  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v as string));
  return response;
}

export const config = {
  matcher: '/api/:path*',
};

