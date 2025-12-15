import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BkashPaymentGateway } from '@/lib/payment-gateways/bkash';
import { prisma } from '@/lib/db';
import { authenticate, AuthenticatedRequest } from '@/lib/middleware/auth';
import rateLimitRequest from '@/lib/middleware/rateLimit'

// Validation schema
const createPaymentSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1 BDT'),
  jobId: z.string().optional(),
  merchantInvoiceNumber: z.string().optional(),
  intent: z.enum(['sale', 'authorization']).default('sale'),
  currency: z.enum(['BDT']).default('BDT'),
  merchantAssociationInfo: z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string().optional(),
    url: z.string().optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rl = await rateLimitRequest(request as unknown as Request, { key: 'bkash_create', limit: 20, windowSeconds: 60 })
    if (rl) return rl
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult) {
      return authResult;
    }
    
    const user = (request as AuthenticatedRequest).user;

    const body = await request.json();
    const validatedData = createPaymentSchema.parse(body);

    // Initialize bKash gateway
    const bkashGateway = new BkashPaymentGateway({
      apiKey: process.env.BKASH_API_KEY || '',
      username: process.env.BKASH_USERNAME || '',
      password: process.env.BKASH_PASSWORD || '',
      isProduction: process.env.NODE_ENV === 'production',
    });

    // Check if gateway is properly configured
    if (!bkashGateway.isEnvironmentValid()) {
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
        method: 'BKASH',
        status: 'PENDING',
        userId: user.id,
        jobId: validatedData.jobId,
        transactionId: '', // Will be filled after bKash response
        gatewayResponse: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create bKash payment
    const bkashPayment = await bkashGateway.createPayment({
      amount: validatedData.amount,
      merchantInvoiceNumber: validatedData.merchantInvoiceNumber || `INV-${payment.id}`,
      intent: validatedData.intent,
      currency: validatedData.currency,
      merchantAssociationInfo: validatedData.merchantAssociationInfo,
    });

    // Update payment record with bKash payment ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        transactionId: bkashPayment.paymentID,
        gatewayResponse: JSON.stringify(bkashPayment),
      },
    });

    // Generate payment URL for redirect
    const paymentURL = bkashGateway.generatePaymentURL(bkashPayment.paymentID);

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        transactionId: bkashPayment.paymentID,
        paymentURL,
        bkashResponse: bkashPayment,
      },
    });

  } catch (error) {
    console.error('bKash payment creation error:', error);
    
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
    
    const user = (request as AuthenticatedRequest).user;

    // Get payment ID from query params
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Initialize bKash gateway
    const bkashGateway = new BkashPaymentGateway({
      apiKey: process.env.BKASH_API_KEY || '',
      username: process.env.BKASH_USERNAME || '',
      password: process.env.BKASH_PASSWORD || '',
      isProduction: process.env.NODE_ENV === 'production',
    });

    // Query payment status from bKash
    const paymentStatus = await bkashGateway.queryPayment(paymentId);

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
        bkashStatus: paymentStatus,
      },
    });

  } catch (error) {
    console.error('bKash payment query error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}