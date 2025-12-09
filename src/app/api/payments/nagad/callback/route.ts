import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { NagadPaymentGateway } from '@/lib/payment-gateways/nagad';
import { prisma } from '@/lib/db';
import rateLimitRequest from '@/lib/middleware/rateLimit'

// Validation schema
const callbackSchema = z.object({
  order_id: z.string(),
  payment_ref_id: z.string(),
  amount: z.string(),
  currency: z.string(),
  status: z.string(),
  transaction_status: z.string(),
  verify_signature: z.string(),
  date_time: z.string(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rl = await rateLimitRequest(request as unknown as Request, { key: 'nagad_callback', limit: 60, windowSeconds: 60 })
    if (rl) return rl
    const body = await request.json();
    const validatedData = callbackSchema.parse(body);

    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { transactionId: validatedData.payment_ref_id },
    });

    if (!payment) {
      console.error('Payment not found:', validatedData.payment_ref_id);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Verify signature
    const nagadGateway = new NagadPaymentGateway({
      merchantId: process.env.NAGAD_MERCHANT_ID || '',
      merchantKey: process.env.NAGAD_MERCHANT_KEY || '',
      isProduction: process.env.NODE_ENV === 'production',
      baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    });

    const isValidSignature = nagadGateway.verifySignature(
      {
        order_id: validatedData.order_id,
        payment_ref_id: validatedData.payment_ref_id,
        amount: validatedData.amount,
        currency: validatedData.currency,
        status: validatedData.status,
        transaction_status: validatedData.transaction_status,
        date_time: validatedData.date_time,
      },
      validatedData.verify_signature
    );

    if (!isValidSignature) {
      console.error('Invalid signature for Nagad payment');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Update payment status
    const updateData: any = {
      status: validatedData.status === 'Success' ? 'COMPLETED' as const : 'FAILED' as const,
      gatewayResponse: validatedData as any,
    };

    await prisma.payment.update({
      where: { id: payment.id },
      data: updateData,
    });

    // If payment is successful, update job status if applicable
    if (validatedData.status === 'Success' && payment.jobId) {
      await prisma.job.update({
        where: { id: payment.jobId },
        data: { status: 'ACTIVE' as const },
      });
    }

    // Return success response
    return NextResponse.json({
      message: 'Payment processed successfully',
      payment: {
        id: payment.id,
        status: updateData.status,
        transactionId: validatedData.payment_ref_id,
      },
    });

  } catch (error) {
    console.error('Nagad callback error:', error);
    
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