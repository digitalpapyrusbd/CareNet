import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { NextResponse } from 'next/server';

// Validation schemas
import {
  userRegistrationSchema,
  userLoginSchema,
  userUpdateSchema,
  passwordResetSchema,
  passwordResetConfirmSchema,
  otpVerificationSchema,
  sendOTPSchema,
  companyCreateSchema,
  companyUpdateSchema,
  caregiverCreateSchema,
  caregiverUpdateSchema,
  patientCreateSchema,
  patientUpdateSchema,
  packageCreateSchema,
  packageUpdateSchema,
  jobCreateSchema,
  jobUpdateSchema,
  paymentCreateSchema,
  careLogCreateSchema,
  feedbackCreateSchema,
  healthRecordCreateSchema,
  healthRecordUpdateSchema,
  marketplaceJobCreateSchema,
  marketplaceJobApplicationSchema,
  notificationCreateSchema,
  notificationUpdateSchema,
  paginationSchema,
} from '@/lib/validations/schemas';

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

// Generic validation function
export function validateRequest<T>(schema: any, data: any) {
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: createValidationError(error) };
    }
    return { success: false, error: NextResponse.json({ error: 'Invalid data format' }, { status: 400 }) };
  }
}

// Request validation middleware
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

// Query parameter validation
export function validateQuery(schema: any) {
  return (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const query: any = {};
    
    // Convert all search params to appropriate types
    for (const [key, value] of searchParams.entries()) {
      if (value === null || value === undefined) continue;
      
      // Handle array parameters
      if (key.endsWith('[]')) {
        const arrayKey = key.slice(0, -2);
        if (!query[arrayKey]) query[arrayKey] = [];
        query[arrayKey].push(value);
      } else {
        query[key] = value;
      }
    }
    
    const validation = validateRequest(schema, query);
    
    if (!validation.success) {
      return validation.error;
    }
    
    return null;
  };
}

// Pagination validation
export function validatePagination(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const validation = validateRequest(paginationSchema, {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    search: searchParams.get('search'),
  });
  
  if (!validation.success) {
    return validation.error;
  }
  
  const { page = 1, limit = 10, search = '' } = validation.data;
  const skip = (page - 1) * limit;
  
  return { page, limit, search, skip };
}