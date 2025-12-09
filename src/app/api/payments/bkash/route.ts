import { NextRequest, NextResponse } from 'next/server';
import { bkashGateway } from '@/lib/payment-gateways/bkash';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...paymentData } = body;

    let result;
    switch (action) {
      case 'create':
        result = await bkashGateway.generateCheckoutURL({
          amount: paymentData.amount,
          currency: paymentData.currency || 'BDT',
          intent: 'sale',
          payerReference: paymentData.payerReference,
          callbackURL: paymentData.callbackURL,
          productDetails: paymentData.productDetails,
        });

        return NextResponse.json({
          success: true,
          data: result,
        });

      case 'execute':
        result = await bkashGateway.executePayment(paymentData.paymentID);

        return NextResponse.json({
          success: true,
          data: result,
        });

      case 'status':
        result = await bkashGateway.queryPaymentStatus(paymentData.paymentID);

        return NextResponse.json({
          success: true,
          data: result,
        });

      case 'refund':
        result = await bkashGateway.processRefund(
          paymentData.originalPaymentID,
          paymentData.amount,
          paymentData.reason
        );

        return NextResponse.json({
          success: true,
          data: result,
        });

      case 'methods':
        result = await bkashGateway.getPaymentMethods();

        return NextResponse.json({
          success: true,
          data: result,
        });

      case 'agreement-create':
        result = await bkashGateway.createAgreement(
          paymentData.agreementID,
          paymentData.amount,
          paymentData.frequency,
          paymentData.duration,
          paymentData.maxAmount
        );

        return NextResponse.json({
          success: true,
          data: result,
        });

      case 'agreement-execute':
        result = await bkashGateway.executeAgreementPayment(paymentData.agreementID);

        return NextResponse.json({
          success: true,
          data: result,
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
        }, { status: 400 });
    }
  } catch (error) {
    console.error('bKash payment error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Handle bKash callback/webhook
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { paymentID, status, ...additionalData } = body;

      // Verify webhook signature
      const timestamp = request.headers.get('x-bkash-timestamp');
      const signature = request.headers.get('x-bkash-signature');
      const payload = JSON.stringify({ paymentID, status, ...additionalData });

      if (!bkashGateway.verifyWebhookSignature(payload, signature, timestamp)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid webhook signature',
        }, { status: 401 });
      }

      // Process webhook
      // Here you would typically save the payment status to your database
      // and trigger any necessary business logic

      console.log('bKash webhook received:', {
        paymentID,
        status,
        additionalData,
      });

      return NextResponse.json({
        success: true,
        message: 'Webhook processed successfully',
      });
    } catch (error) {
      console.error('bKash webhook processing error:', error);
      return NextResponse.json({
        success: false,
        error: 'Webhook processing failed',
      }, { status: 500 });
    }
  }

// Handle other HTTP methods
return NextResponse.json({
  success: false,
  error: 'Method not allowed',
}, { status: 405 });
}