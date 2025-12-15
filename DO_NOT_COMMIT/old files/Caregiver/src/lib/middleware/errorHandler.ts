import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Error types
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

// Error handler function
export function handleApiError(error: any): NextResponse {
  console.error('API Error:', error);

  // Handle Prisma errors
  if (error.code) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 503 }
        );
      case 'P2025':
        return NextResponse.json(
          { error: 'Database constraint violation' },
          { status: 400 }
        );
      case 'P2027':
        return NextResponse.json(
          { error: 'Multiple database records found' },
          { status: 409 }
        );
      case 'P2028':
        return NextResponse.json(
          { error: 'Related record not found' },
          { status: 404 }
        );
      case 'P2003':
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 503 }
        );
    }
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
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

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Handle custom application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  // Handle network errors
  if (error.code === 'ECONNREFUSED') {
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 503 }
    );
  }

  // Handle timeout errors
  if (error.code === 'ETIMEDOUT') {
    return NextResponse.json(
      { error: 'Request timeout' },
      { status: 408 }
    );
  }

  // Default error response
  return NextResponse.json(
    { 
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message || 'Unknown error occurred' 
    },
    { status: 500 }
  );
}

// Async error wrapper for API routes
export function withErrorHandler(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Rate limiting error
export function rateLimitExceeded(resetTime?: Date) {
  const message = resetTime 
    ? `Rate limit exceeded. Try again after ${resetTime.toISOString()}`
    : 'Rate limit exceeded';
    
  return NextResponse.json(
    { error: message },
    { 
      status: 429,
      headers: {
        'Retry-After': resetTime ? Math.ceil((resetTime.getTime() - Date.now()) / 1000).toString() : '60',
      },
    }
  );
}

// Not found error
export function notFound(resource: string = 'Resource') {
  return NextResponse.json(
    { error: `${resource} not found` },
    { status: 404 }
  );
}

// Unauthorized error
export function unauthorized(message: string = 'Unauthorized') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

// Forbidden error
export function forbidden(message: string = 'Access denied') {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}

// Bad request error
export function badRequest(message: string = 'Bad request') {
  return NextResponse.json(
    { error: message },
    { status: 400 }
  );
}

// Conflict error
export function conflict(message: string = 'Resource conflict') {
  return NextResponse.json(
    { error: message },
    { status: 409 }
  );
}

// Service unavailable error
export function serviceUnavailable(message: string = 'Service temporarily unavailable') {
  return NextResponse.json(
    { error: message },
    { status: 503 }
  );
}