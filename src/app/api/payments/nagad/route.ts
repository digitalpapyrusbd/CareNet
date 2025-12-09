/**
 * Nagad Payment Gateway API Routes
 * Handles all Nagad payment operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { nagadGateway, NagadPaymentRequest } from '@/lib/payment-gateways/nagad';
import { z } from 'zod';

// Validation schemas
const createPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('BDT'),
  intent: z.string(),
  merchantInvoiceNumber: z.string().optional(),
  callbackURL: z.string().url().optional(),
  payerReference: z.string().optional(),
  productDetails: z.object({
    productCode: z.string(),
    productType: z.string(),
    productName: z.string(),
    productDescription: z.string(),
    productCategory: z.string(),
    productQuantity: z.number().positive(),
    productUnitPrice: z.number().positive(),
  }).optional(),
});

const executePaymentSchema = z.object({
  paymentID: z.string(),
});

const statusQuerySchema = z.object({
  paymentID: z.string(),
});

const refundSchema = z.object({
  originalPaymentID: z.string(),
  amount: z.number().positive(),
  reason: z.string(),
});

/**
 * POST /api/payments/nagad/create
 * Create Nagad payment and generate checkout URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Route to specific handler based on action
    const { action } = body;
    
    switch (action) {
      case 'create':
        return handleCreatePayment(body);
      case 'execute':
        return handleExecutePayment(body);
      case 'status':
        return handleStatusQuery(body);
      case 'refund':
        return handleRefund(body);
      case 'methods':
        return handleGetPaymentMethods();
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Nagad payment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle payment creation
 */
async function handleCreatePayment(body: any) {
  try {
    const validatedData = createPaymentSchema.parse(body);
    
    const paymentRequest: NagadPaymentRequest = {
      amount: validatedData.amount,
      currency: validatedData.currency,
      intent: validatedData.intent,
      merchantInvoiceNumber: validatedData.merchantInvoiceNumber,
      callbackURL: validatedData.callbackURL,
      payerReference: validatedData.payerReference,
      productDetails: validatedData.productDetails,
    };

    const result = await nagadGateway.generateCheckoutURL(paymentRequest);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Nagad payment creation error:', error);
    return NextResponse.json(
      { error: 'Payment creation failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle payment execution
 */
async function handleExecutePayment(body: any) {
  try {
    const validatedData = executePaymentSchema.parse(body);
    
    const result = await nagadGateway.executePayment(validatedData.paymentID);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Nagad payment execution error:', error);
    return NextResponse.json(
      { error: 'Payment execution failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle payment status query
 */
async function handleStatusQuery(body: any) {
  try {
    const validatedData = statusQuerySchema.parse(body);
    
    const result = await nagadGateway.queryPaymentStatus(validatedData.paymentID);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Nagad status query error:', error);
    return NextResponse.json(
      { error: 'Status query failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle refund processing
 */
async function handleRefund(body: any) {
  try {
    const validatedData = refundSchema.parse(body);
    
    const result = await nagadGateway.processRefund(
      validatedData.originalPaymentID,
      validatedData.amount,
      validatedData.reason
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Nagad refund error:', error);
    return NextResponse.json(
      { error: 'Refund processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle payment methods fetch
 */
async function handleGetPaymentMethods() {
  try {
    const result = await nagadGateway.getPaymentMethods();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Nagad payment methods fetch error:', error);
    return NextResponse.json(
      { error: 'Payment methods fetch failed' },
      { status: 500 }
    );
  }
}