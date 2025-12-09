import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { NagadPaymentGateway } from '@/lib/payment-gateways/nagad';
import { prisma } from '@/lib/db';
import { authenticate, AuthenticatedRequest } from '@/lib/middleware/auth';
import rateLimitRequest from '@/lib/middleware/rateLimit'

// Validation schema
const createPaymentSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1 BDT'),
  jobId: z.string().optional(),
  order_id: z.string().optional(),
  currency: z.enum(['BDT']).default('BDT'),
  details: z.string().optional(),
  customer_name: z.string().optional(),
  customer_email: z.string().optional(),
  customer_phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rl = await rateLimitRequest(request as unknown as Request, { key: 'nagad_create', limit: 20, windowSeconds: 60 })
    if (rl) return rl
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }
    
    const user = (request as AuthenticatedRequest).user;

    const body = await request.json();
    const validatedData = createPaymentSchema.parse(body);

    // Initialize Nagad gateway
    const nagadGateway = new NagadPaymentGateway({
      merchantId: process.env.NAGAD_MERCHANT_ID || '',
      merchantKey: process.env.NAGAD_MERCHANT_KEY || '',
      isProduction: process.env.NODE_ENV === 'production',
    });

    // Check if gateway is properly configured
    if (!nagadGateway.isEnvironmentValid()) {
      return NextResponse.json(
        { error: 'Payment gateway not properly configured' },
        { status: 500 }
      );
    }

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        amount: validatedData.amount,
        currency: validatedData.currency,
        method: 'NAGAD',
        status: 'PENDING',
        userId: user.id,
        jobId: validatedData.jobId,
        transactionId: '', // Will be filled after Nagad response
        gatewayResponse: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Generate order ID
    const orderId = validatedData.order_id || `ORD-${payment.id}`;

    // Create Nagad payment
    const nagadPayment = await nagadGateway.createPayment({
      order_id: orderId,
      amount: validatedData.amount,
      currency: validatedData.currency,
      details: validatedData.details,
      customer_name: validatedData.customer_name,
      customer_email: validatedData.customer_email,
      customer_phone: validatedData.customer_phone,
    });

    // Update payment record with Nagad payment ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        transactionId: nagadPayment.payment_ref_id,
        gatewayResponse: JSON.stringify(nagadPayment),
      },
    });

    // Generate payment URL for redirect
    const paymentURL = nagadGateway.generatePaymentURL(nagadPayment.order_id);

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        transactionId: nagadPayment.payment_ref_id,
        paymentURL,
        nagadResponse: nagadPayment,
      },
    });

  } catch (error) {
    console.error('Nagad payment creation error:', error);
    
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

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }

    // Get payment ID from query params
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Initialize Nagad gateway
    const nagadGateway = new NagadPaymentGateway({
      merchantId: process.env.NAGAD_MERCHANT_ID || '',
      merchantKey: process.env.NAGAD_MERCHANT_KEY || '',
      isProduction: process.env.NODE_ENV === 'production',
    });

    // Query payment status from Nagad
    const paymentStatus = await nagadGateway.queryTransaction(paymentId);

    // Get payment from our database
    const payment = await prisma.payment.findUnique({
      where: { transactionId: paymentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: {
        ...payment,
        nagadStatus: paymentStatus,
      },
    });

  } catch (error) {
    console.error('Nagad payment query error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}