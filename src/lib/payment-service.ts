import { BkashPaymentGateway, BkashPaymentRequest, BkashPaymentResponse } from './payment-gateways/bkash';
import { NagadPaymentGateway, NagadPaymentRequest, NagadPaymentResponse } from './payment-gateways/nagad';
import { PaymentMethod } from '@/types';

export interface PaymentRequest {
  amount: number;
  method: PaymentMethod;
  jobId?: string;
  description?: string;
  customerInfo?: {
    name: string;
    email?: string;
    phone?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  paymentUrl?: string;
  message?: string;
  error?: string;
}

export class PaymentService {
  private bkashGateway: BkashPaymentGateway;
  private nagadGateway: NagadPaymentGateway;

  constructor() {
    this.bkashGateway = new BkashPaymentGateway({
      apiKey: process.env.BKASH_API_KEY || '',
      username: process.env.BKASH_USERNAME || '',
      password: process.env.BKASH_PASSWORD || '',
      isProduction: process.env.NODE_ENV === 'production',
    });

    this.nagadGateway = new NagadPaymentGateway({
      merchantId: process.env.NAGAD_MERCHANT_ID || '',
      merchantKey: process.env.NAGAD_MERCHANT_KEY || '',
      isProduction: process.env.NODE_ENV === 'production',
    });
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      switch (request.method) {
        case PaymentMethod.BKASH:
          const bkashRequest: BkashPaymentRequest = {
            amount: request.amount,
            intent: 'sale',
            currency: 'BDT',
            merchantAssociationInfo: {
              id: 'caregiver_platform',
              name: 'Caregiver Platform',
              logo: '/logo_only.png',
              url: 'https://caregiver-platform.com',
            },
          };

          const bkashResponse = await this.bkashGateway.createPayment(bkashRequest);
          
          if (bkashResponse.transactionStatus === 'Initiated') {
            return {
              success: true,
              paymentId: bkashResponse.paymentID,
              paymentUrl: this.bkashGateway.generatePaymentURL(bkashResponse.paymentID),
              message: 'Payment initiated. Please complete the payment.',
            };
          } else {
            return {
              success: false,
              error: bkashResponse.statusMessage || 'Payment failed',
            };
          }

        case PaymentMethod.NAGAD:
          const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          const nagadRequest: NagadPaymentRequest = {
            amount: request.amount,
            order_id: orderId,
            currency: 'BDT',
            details: request.description,
            customer_name: request.customerInfo?.name,
            customer_email: request.customerInfo?.email,
            customer_phone: request.customerInfo?.phone,
          };

          const nagadResponse = await this.nagadGateway.createPayment(nagadRequest);
          
          if (nagadResponse.status === 'Pending') {
            return {
              success: true,
              paymentId: nagadResponse.payment_ref_id,
              paymentUrl: this.nagadGateway.generatePaymentURL(orderId),
              message: 'Payment initiated. Please complete the payment.',
            };
          } else {
            return {
              success: false,
              error: nagadResponse.message || 'Payment failed',
            };
          }

        default:
          return {
            success: false,
            error: 'Unsupported payment method',
          };
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      return {
        success: false,
        error: 'Payment service temporarily unavailable',
      };
    }
  }

  async verifyPayment(paymentId: string, method: PaymentMethod): Promise<PaymentResponse> {
    try {
      switch (method) {
        case PaymentMethod.BKASH:
          const bkashResponse = await this.bkashGateway.queryPayment(paymentId);
          
          if (bkashResponse.transactionStatus === 'Completed') {
            return {
              success: true,
              paymentId: bkashResponse.paymentID,
              transactionId: bkashResponse.trxD,
              message: 'Payment verified successfully',
            };
          } else {
            return {
              success: false,
              error: 'Payment not completed',
            };
          }

        case PaymentMethod.NAGAD:
          const nagadResponse = await this.nagadGateway.verifyPayment(paymentId);
          
          if (nagadResponse.status === 'Success') {
            return {
              success: true,
              paymentId: nagadResponse.payment_ref_id,
              transactionId: nagadResponse.order_id,
              message: 'Payment verified successfully',
            };
          } else {
            return {
              success: false,
              error: nagadResponse.message || 'Payment not completed',
            };
          }

        default:
          return {
            success: false,
            error: 'Unsupported payment method',
          };
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: 'Payment verification failed',
      };
    }
  }

  async processCallback(
    method: PaymentMethod,
    callbackData: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      switch (method) {
        case PaymentMethod.BKASH:
          // bKash callback is handled by the API endpoint
          return { success: true, message: 'bKash callback processed' };
          
        case PaymentMethod.NAGAD:
          // Nagad callback is handled by the API endpoint
          return { success: true, message: 'Nagad callback processed' };
          
        default:
          return { success: false, message: 'Unsupported payment method' };
      }
    } catch (error) {
      console.error('Callback processing error:', error);
      return { success: false, message: 'Callback processing failed' };
    }
  }

  async refundPayment(
    paymentId: string,
    method: PaymentMethod,
    amount?: number
  ): Promise<PaymentResponse> {
    try {
      switch (method) {
        case PaymentMethod.BKASH:
          const bkashResponse = await this.bkashGateway.refundTransaction(paymentId, amount);
          
          if (bkashResponse.transactionStatus === 'Completed') {
            return {
              success: true,
              paymentId: bkashResponse.paymentID,
              transactionId: bkashResponse.trxD,
              message: 'Refund processed successfully',
            };
          } else {
            return {
              success: false,
              error: 'Refund failed',
            };
          }

        case PaymentMethod.NAGAD:
          const nagadResponse = await this.nagadGateway.refundTransaction(paymentId, amount);
          
          if (nagadResponse.status === 'Success') {
            return {
              success: true,
              paymentId: nagadResponse.payment_ref_id,
              transactionId: nagadResponse.order_id,
              message: 'Refund processed successfully',
            };
          } else {
            return {
              success: false,
              error: 'Refund failed',
            };
          }

        default:
          return {
            success: false,
            error: 'Unsupported payment method',
          };
      }
    } catch (error) {
      console.error('Refund processing error:', error);
      return {
        success: false,
        error: 'Refund processing failed',
      };
    }
  }

  isConfigured(): boolean {
    return this.bkashGateway.isEnvironmentValid() || this.nagadGateway.isEnvironmentValid();
  }

  getSupportedMethods(): PaymentMethod[] {
    const methods: PaymentMethod[] = [];
    
    if (this.bkashGateway.isEnvironmentValid()) {
      methods.push(PaymentMethod.BKASH);
    }
    
    if (this.nagadGateway.isEnvironmentValid()) {
      methods.push(PaymentMethod.NAGAD);
    }
    
    return methods;
  }
}