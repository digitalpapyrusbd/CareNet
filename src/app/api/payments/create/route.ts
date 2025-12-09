import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate, getCurrentUser } from '@/lib/middleware/auth';
import { PaymentService } from '@/lib/payment-service';
import { PaymentMethod } from '@/types';
import { prisma } from '@/lib/db';
import rateLimitRequest from '@/lib/middleware/rateLimit'

// Validation schema
const createPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  method: z.nativeEnum(PaymentMethod),
  jobId: z.string().optional(),
  description: z.string().optional(),
  customerInfo: z.object({
    name: z.string().min(1, 'Customer name is required'),
    email: z.string().email('Invalid email format').optional(),
    phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number').optional(),
  }),
});

export async function POST(request: NextRequest) {
  const rl = await rateLimitRequest(request as unknown as Request, { key: 'payments_generic_create', limit: 20, windowSeconds: 60 })
  if (rl) return rl
  // Authenticate the user
  const authResult = await authenticate(request);
  if (authResult) {
    return authResult;
  }
  
  const user = getCurrentUser(request);

  try {
    const body = await request.json();
    const validatedData = createPaymentSchema.parse(body);

    // Check if user has permission to create payment
    if (user.role !== 'GUARDIAN' && user.role !== 'COMPANY') {
      return NextResponse.json(
        { error: 'Only guardians and companies can create payments' },
        { status: 403 }
      );
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        payerId: user.id,
        jobId: validatedData.jobId,
        amount: validatedData.amount,
        method: validatedData.method,
        status: 'PENDING' as const,
        transactionId: `TEMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        invoiceNumber: `INV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    // Initialize payment service
    const paymentService = new PaymentService();

    // Create payment with gateway
    const paymentRequest = {
      amount: validatedData.amount,
      method: validatedData.method,
      description: validatedData.description,
      customerInfo: validatedData.customerInfo,
    };

    const paymentResponse = await paymentService.createPayment(paymentRequest);

    if (paymentResponse.success) {
      // Update payment record with gateway response
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          transactionId: paymentResponse.paymentId,
          gatewayResponse: paymentResponse as any,
          status: 'PENDING' as const,
        },
      });

      return NextResponse.json({
        success: true,
        payment: {
          id: payment.id,
          paymentId: paymentResponse.paymentId,
          paymentUrl: paymentResponse.paymentUrl,
          status: 'PENDING',
        },
        message: paymentResponse.message,
      });
    } else {
      // Update payment record as failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED' as const,
          gatewayResponse: paymentResponse as any,
        },
      });

      return NextResponse.json({
        success: false,
        error: paymentResponse.error || 'Payment creation failed',
        payment: {
          id: payment.id,
          status: 'FAILED',
        },
      });
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}