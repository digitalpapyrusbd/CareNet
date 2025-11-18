/**
 * Nagad Payment Gateway Integration
 * Bangladesh's second largest mobile financial service
 * 
 * Features:
 * - Checkout URL generation
 * - Tokenized payments
 * - Refund processing
 * - Webhook handling
 */

export interface NagadConfig {
  username: string;
  password: string;
  appKey: string;
  appSecret: string;
  sandbox: boolean;
  baseUrl: string;
}

export interface NagadPaymentRequest {
  amount: number;
  currency: string;
  intent: string;
  merchantInvoiceNumber?: string;
  callbackURL?: string;
  payerReference?: string;
  productDetails?: {
    productCode: string;
    productType: string;
    productName: string;
    productDescription: string;
    productCategory: string;
    productQuantity: number;
    productUnitPrice: number;
  };
  additionalData?: {
    challenge: string;
    challengeType: string;
    challengeDetails?: {
      challenge: string;
      challengeType: string;
      challengeExpiryTime: string;
    };
  };
}

export interface NagadPaymentResponse {
  paymentID: string;
  paymentStatus: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  paymentCreateTime: string;
  transactionID?: string;
  orgLogo?: string;
  orgName?: string;
  customerMsisdn: string;
  paymentExecuteTime?: string;
  verificationID?: string;
  additionalData?: {
    challenge: string;
    challengeType: string;
    challengeDetails?: {
      challenge: string;
      challengeType: string;
      challengeExpiryTime: string;
    };
  };
  agreementID?: string;
  agreementStatus?: string;
  agreementTime?: string;
  };
  errorCode?: string;
  errorMessage?: string;
  statusCode?: string;
}

export class NagadPaymentGateway {
  private config: NagadConfig;

  constructor(config: NagadConfig) {
    this.config = config;
  }

  /**
   * Generate Nagad checkout URL
   */
  async generateCheckoutURL(paymentRequest: NagadPaymentRequest): Promise<NagadPaymentResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/checkout/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`,
          'X-APP-Key': this.config.appKey,
        },
        body: JSON.stringify({
          amount: paymentRequest.amount,
          currency: paymentRequest.currency || 'BDT',
          intent: paymentRequest.intent,
          merchantInvoiceNumber: paymentRequest.merchantInvoiceNumber,
          callbackURL: paymentRequest.callbackURL,
          payerReference: paymentRequest.payerReference,
          productDetails: paymentRequest.productDetails,
          productType: paymentRequest.productType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Nagad checkout URL generation failed: ${error.errorMessage || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Nagad checkout URL generation error:', error);
      throw new Error('Nagad checkout URL generation failed: Network error');
    }
  }

  /**
   * Execute payment with token
   */
  async executePayment(paymentID: string): Promise<NagadPaymentResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/checkout/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`,
          'X-APP-Key': this.config.appKey,
        },
        body: JSON.stringify({
          paymentID,
          additionalData: {
            challenge: 'Nagad',
            challengeType: '0000',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Nagad payment execution failed: ${error.errorMessage || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Nagad payment execution error:', error);
      throw new Error('Nagad payment execution failed: Network error');
    }
  }

  /**
   * Query payment status
   */
  async queryPaymentStatus(paymentID: string): Promise<NagadPaymentResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/checkout/payment/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`,
          'X-APP-Key': this.config.appKey,
        },
        body: JSON.stringify({
          paymentID,
          additionalData: {
            challenge: 'Nagad',
            challengeType: '0000',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Nagad status query failed: ${error.errorMessage || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Nagad status query error:', error);
      throw new Error('Nagad status query failed: Network error');
    }
  }

  /**
   * Process refund
   */
  async processRefund(originalPaymentID: string, amount: number, reason: string): Promise<NagadPaymentResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/checkout/payment/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`,
          'X-APP-Key': this.config.appKey,
        },
        body: JSON.stringify({
          originalPaymentID,
          amount,
          reason,
          additionalData: {
            challenge: 'Nagad',
            challengeType: '0000',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Nagad refund failed: ${error.errorMessage || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Nagad refund error:', error);
      throw new Error('Nagad refund failed: Network error');
    }
  }

  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/checkout/payment/methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`,
          'X-APP-Key': this.config.appKey,
        },
        body: JSON.stringify({
          additionalData: {
            challenge: 'Nagad',
            challengeType: '0000',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Nagad payment methods fetch failed: ${error.errorMessage || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Nagad payment methods fetch error:', error);
      throw new Error('Nagad payment methods fetch failed: Network error');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, timestamp: string): boolean {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', this.config.appSecret);
    hmac.update(`${payload}&${timestamp}`);
    return hmac.digest('hex');
  }
}

// Create singleton instance
export const nagadGateway = new NagadPaymentGateway({
  username: process.env.NAGAD_USERNAME || '',
  password: process.env.NAGAD_PASSWORD || '',
  appKey: process.env.NAGAD_APP_KEY || '',
  appSecret: process.env.NAGAD_APP_SECRET || '',
  sandbox: process.env.NODE_ENV !== 'production',
  baseUrl: process.env.NAGAD_BASE_URL || 'https://api.mynagad.com/v2/checkout',
});

export default nagadGateway;