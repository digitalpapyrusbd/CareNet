/**
 * bKash Payment Gateway Integration
 * Bangladesh's leading mobile payment service
 * 
 * Features:
 * - Checkout URL generation
 * - Tokenized payments
 * - Refund processing
 * - Webhook handling
 */

export interface BkashConfig {
  username: string;
  password: string;
  appKey: string;
  appSecret: string;
  sandbox: boolean;
  baseUrl: string;
}

export interface BkashPaymentRequest {
  amount: number;
  currency: string;
  intent: string;
  merchantInvoiceNumber?: string;
  callbackURL?: string;
  payerReference?: string;
  agreementID?: string;
  productDetails?: {
    productCode: string;
    productType: string;
    productName: string;
    productDescription: string;
    productCategory: string;
    productQuantity: number;
    productUnitPrice: number;
  };
  productType?: string;
}

export interface BkashPaymentResponse {
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
    challenge?: string;
    challengeType?: string;
    challengeDetails?: {
      challenge: string;
      challengeType: string;
      challengeExpiryTime: string;
    };
  };
  agreementID?: string;
  agreementStatus?: string;
  agreementTime?: string;
  errorCode?: string;
  errorMessage?: string;
  statusCode?: string;
}

export class BkashPaymentGateway {
  private config: BkashConfig;

  constructor(config: BkashConfig) {
    this.config = config;
  }

  /**
   * Generate bKash checkout URL
   */
  async generateCheckoutURL(paymentRequest: BkashPaymentRequest): Promise<BkashPaymentResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/checkout/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`,
          'X-APP-Key': this.config.appKey,
        },
        body: JSON.stringify({
          mode: '0011',
          payerReference: paymentRequest.payerReference,
          callbackURL: paymentRequest.callbackURL,
          amount: paymentRequest.amount,
          currency: paymentRequest.currency,
          intent: paymentRequest.intent,
          merchantInvoiceNumber: paymentRequest.merchantInvoiceNumber,
          productDetails: paymentRequest.productDetails,
          productType: paymentRequest.productType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`bKash checkout URL generation failed: ${error.errorMessage || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('bKash checkout URL generation error:', error);
      throw new Error('bKash checkout URL generation failed: Network error');
    }
  }

  /**
   * Execute payment with token
   */
  async executePayment(paymentID: string): Promise<BkashPaymentResponse> {
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
          mode: '0011',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`bKash payment execution failed: ${error.errorMessage || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('bKash payment execution error:', error);
      throw new Error('bKash payment execution failed: Network error');
    }
  }

  /**
   * Query payment status
   */
  async queryPaymentStatus(paymentID: string): Promise<BkashPaymentResponse> {
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
          mode: '0011',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`bKash status query failed: ${error.errorMessage || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('bKash status query error:', error);
      throw new Error('bKash status query failed: Network error');
    }
  }

  /**
   * Process refund
   */
  async processRefund(originalPaymentID: string, amount: number, reason: string): Promise<BkashPaymentResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/checkout/payment/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`,
          'X-APP-Key': this.config.appKey,
        },
        body: JSON.stringify({
          paymentID: originalPaymentID,
          amount,
          reason,
          mode: '0011',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`bKash refund failed: ${error.errorMessage || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('bKash refund error:', error);
      throw new Error('bKash refund failed: Network error');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, timestamp: string): boolean {
    const expectedSignature = this.generateSignature(payload, timestamp);
    return signature === expectedSignature;
  }

  /**
   * Generate signature for webhook verification
   */
  private generateSignature(payload: string, timestamp: string): string {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', this.config.appSecret);
    hmac.update(`${payload}&${timestamp}`);
    return hmac.digest('hex');
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
          mode: '0011',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`bKash payment methods fetch failed: ${error.errorMessage || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('bKash payment methods fetch error:', error);
      throw new Error('bKash payment methods fetch failed: Network error');
    }
  }

  /**
   * Create agreement for recurring payments
   */
  async createAgreement(
    agreementID: string,
    amount: number,
    frequency: string,
    duration: string,
    maxAmount: number
  ): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/checkout/agreement/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`,
          'X-APP-Key': this.config.appKey,
        },
        body: JSON.stringify({
          mode: '0011',
          agreementID,
          amount,
          frequency,
          duration,
          maxAmount,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`bKash agreement creation failed: ${error.errorMessage || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('bKash agreement creation error:', error);
      throw new Error('bKash agreement creation failed: Network error');
    }
  }

  /**
   * Execute agreement payment
   */
  async executeAgreementPayment(agreementID: string): Promise<BkashPaymentResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/checkout/agreement/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')}`,
          'X-APP-Key': this.config.appKey,
        },
        body: JSON.stringify({
          mode: '0011',
          agreementID,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`bKash agreement execution failed: ${error.errorMessage || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('bKash agreement execution error:', error);
      throw new Error('bKash agreement execution failed: Network error');
    }
  }
}

// Create singleton instance
export const bkashGateway = new BkashPaymentGateway({
  username: process.env.BKASH_USERNAME || '',
  password: process.env.BKASH_PASSWORD || '',
  appKey: process.env.BKASH_APP_KEY || '',
  appSecret: process.env.BKASH_APP_SECRET || '',
  sandbox: process.env.NODE_ENV !== 'production',
  baseUrl: process.env.BKASH_BASE_URL || 'https://checkout.pay.bka.sh/v1.2.0-beta',
});

export default bkashGateway;