import { NextRequest, NextResponse } from 'next/server';

// Generate API documentation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json'; // 'json' or 'yaml'

  // Get base URL from request
  const baseUrl = request.headers.get('host') 
    ? `${request.headers.get('x-forwarded-proto') === 'https' ? 'https' : 'http'}://${request.headers.get('host')}`
    : 'http://localhost:3000';

  // API Documentation
  const apiDocs = {
    openapi: '3.0.0',
    info: {
      title: 'Caregiver Platform API',
      description: 'API documentation for Caregiver Digital Solution for Bangladesh',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'support@caregiver-platform.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: baseUrl,
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using Bearer scheme. Example: "Authorization: Bearer {token}"',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            role: { type: 'string', enum: ['SUPER_ADMIN', 'MODERATOR', 'COMPANY', 'CAREGIVER', 'GUARDIAN', 'PATIENT'] },
            phone: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            kycStatus: { type: 'string', enum: ['PENDING', 'VERIFIED', 'REJECTED'] },
            mfaEnabled: { type: 'boolean' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        AuthTokens: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            patient: { $ref: '#/components/schemas/Patient' },
            company: { $ref: '#/components/schemas/Company' },
            package: { $ref: '#/components/schemas/Package' },
            startDate: { type: 'string' },
            endDate: { type: 'string' },
            status: { type: 'string', enum: ['PENDING_ASSIGNMENT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED'] },
            totalPrice: { type: 'number' },
          },
        },
        Patient: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            dateOfBirth: { type: 'string' },
            gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'] },
          },
        },
        Company: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            companyName: { type: 'string' },
            isVerified: { type: 'boolean' },
            ratingAvg: { type: 'number' },
          },
        },
        Package: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            category: { type: 'string' },
            price: { type: 'number' },
            durationDays: { type: 'integer' },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            invoiceNumber: { type: 'string' },
            transactionId: { type: 'string' },
            amount: { type: 'number' },
            method: { type: 'string', enum: ['BKASH', 'NAGAD', 'CARD', 'BANK_TRANSFER'] },
            status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'FROZEN'] },
            paidAt: { type: 'string' },
            createdAt: { type: 'string' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
            hasNextPage: { type: 'boolean' },
            hasPreviousPage: { type: 'boolean' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'object' },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    paths: {
      // Authentication endpoints
      '/api/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'User login',
          description: 'Authenticate user with phone and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['phone', 'password'],
                  properties: {
                    phone: {
                      type: 'string',
                      description: 'Bangladeshi phone number (+8801xxxxxxxxx)',
                      example: '+8801712345678',
                    },
                    password: {
                      type: 'string',
                      description: 'User password',
                      example: 'password123',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/User' },
                      tokens: { $ref: '#/components/schemas/AuthTokens' },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'User registration',
          description: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['role', 'phone', 'password', 'name'],
                  properties: {
                    role: {
                      type: 'string',
                      enum: ['SUPER_ADMIN', 'MODERATOR', 'COMPANY', 'CAREGIVER', 'GUARDIAN', 'PATIENT'],
                      description: 'User role',
                    },
                    phone: {
                      type: 'string',
                      description: 'Bangladeshi phone number (+8801xxxxxxxxx)',
                    },
                    password: {
                      type: 'string',
                      description: 'User password (min 8 characters)',
                    },
                    name: {
                      type: 'string',
                      description: 'Full name',
                    },
                    email: {
                      type: 'string',
                      description: 'Email address (optional)',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Registration successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid input data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // User management endpoints
      '/api/users': {
        get: {
          tags: ['Users'],
          summary: 'Get users',
          description: 'Get list of users (Admin/Moderator only)',
          parameters: [
            {
              name: 'page',
              in: 'query',
              description: 'Page number',
              schema: { type: 'integer', default: 1 },
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Items per page',
              schema: { type: 'integer', default: 10 },
            },
            {
              name: 'role',
              in: 'query',
              description: 'Filter by user role',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Users retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/User' },
                      },
                      pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // Job management endpoints
      '/api/jobs': {
        get: {
          tags: ['Jobs'],
          summary: 'Get jobs',
          description: 'Get list of jobs with filtering and pagination',
          parameters: [
            {
              name: 'page',
              in: 'query',
              description: 'Page number',
              schema: { type: 'integer', default: 1 },
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Items per page',
              schema: { type: 'integer', default: 10 },
            },
            {
              name: 'status',
              in: 'query',
              description: 'Filter by job status',
              schema: { type: 'string' },
            },
            {
              name: 'search',
              in: 'query',
              description: 'Search term',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Jobs retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Job' },
                      },
                      pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // Payment endpoints
      '/api/payments': {
        get: {
          tags: ['Payments'],
          summary: 'Get payments',
          description: 'Get list of payments with filtering and pagination',
          parameters: [
            {
              name: 'page',
              in: 'query',
              description: 'Page number',
              schema: { type: 'integer', default: 1 },
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Items per page',
              schema: { type: 'integer', default: 10 },
            },
            {
              name: 'status',
              in: 'query',
              description: 'Filter by payment status',
              schema: { type: 'string' },
            },
            {
              name: 'method',
              in: 'query',
              description: 'Filter by payment method',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Payments retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Payment' },
                      },
                      pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // Analytics endpoints
      '/api/analytics': {
        get: {
          tags: ['Analytics'],
          summary: 'Get analytics data',
          description: 'Get comprehensive analytics data for platform',
          parameters: [
            {
              name: 'period',
              in: 'query',
              description: 'Time period (7d, 30d, 90d, 1y)',
              schema: { type: 'string', default: '30d' },
            },
            {
              name: 'type',
              in: 'query',
              description: 'Analytics type (overview, users, jobs, payments, disputes)',
              schema: { type: 'string', default: 'overview' },
            },
          ],
          responses: {
            '200': {
              description: 'Analytics data retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        description: 'Analytics data structure varies based on type parameter',
                      },
                      period: { type: 'string' },
                      type: { type: 'string' },
                      dateRange: {
                        type: 'object',
                        properties: {
                          start: { type: 'string' },
                          end: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Jobs',
        description: 'Job management and operations',
      },
      {
        name: 'Payments',
        description: 'Payment processing and management',
      },
      {
        name: 'Analytics',
        description: 'Platform analytics and reporting',
      },
    ],
  };

  // Return documentation in requested format
  if (format === 'yaml') {
    // Convert to YAML format (simplified for this example)
    const yamlDocs = `
# Caregiver Platform API Documentation

## Overview
This is the REST API for the Caregiver Digital Solution for Bangladesh.

## Base URL
\`${baseUrl}\`

## Authentication
All API endpoints require JWT authentication using the Authorization header:
Authorization: Bearer <token>

## Endpoints

### Authentication
- POST /api/auth/login - User login
- POST /api/auth/register - User registration

### Users
- GET /api/users - Get users (Admin/Moderator only)

### Jobs
- GET /api/jobs - Get jobs with filtering

### Payments
- GET /api/payments - Get payments with filtering

### Analytics
- GET /api/analytics - Get platform analytics

## Data Models

### User
- id (string): Unique identifier
- role (string): User role
- phone (string): Phone number
- email (string): Email address
- name (string): Full name
- kycStatus (string): KYC verification status
- mfaEnabled (boolean): MFA enabled
- isActive (boolean): Account active status
- createdAt (string): Creation timestamp
- updatedAt (string): Last update timestamp

### Job
- id (string): Unique identifier
- patient (object): Patient information
- company (object): Company information
- package (object): Package details
- startDate (string): Start date
- endDate (string): End date
- status (string): Job status
- totalPrice (number): Total price

### Payment
- id (string): Unique identifier
- invoiceNumber (string): Invoice number
- transactionId (string): Transaction ID
- amount (number): Payment amount
- method (string): Payment method
- status (string): Payment status
- paidAt (string): Payment date
- createdAt (string): Creation timestamp

## Error Responses
All error responses follow this format:
{
  "error": "Error message",
  "details": {}
}

## Pagination
List responses include pagination metadata:
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
    `;

    return new Response(yamlDocs, {
      headers: {
        'Content-Type': 'text/yaml',
      },
    });
  }

  // Default to JSON format
  return new Response(JSON.stringify(apiDocs, null, 2), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}