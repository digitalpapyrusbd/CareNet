# Backend Documentation 11 - Payment Processing

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Module**: Payments  
**Priority**: 🔴 Critical

---

## 📋 Overview

The Payments module handles all financial transactions on the platform, integrating with **bKash** and **Nagad** payment gateways for Bangladesh, with escrow management for secure fund holding.

### **Key Features**
- bKash payment integration
- Nagad payment integration
- Payment gateway webhooks
- Escrow management
- Payment status tracking
- Refund processing
- Transaction history
- Auto-payment verification

**Module Path**: `/backend/src/payments/`

---

## 📁 Module Structure

```
payments/
├── payments.module.ts           # Module configuration
├── payments.service.ts          # Business logic
├── payments.controller.ts       # HTTP endpoints
├── dto/
│   ├── create-payment.dto.ts   # Creation validation
│   ├── process-payment.dto.ts  # Webhook validation
│   └── refund-payment.dto.ts   # Refund validation
└── providers/
    ├── bkash.service.ts        # bKash integration
    └── nagad.service.ts        # Nagad integration
```

---

## 🎯 Core Features

### **1. Create Payment Intent**

```typescript
POST /api/payments
Authorization: Bearer {accessToken}
Role: GUARDIAN

Request Body:
{
  "jobId": "job-uuid",
  "amount": 15000.00,
  "method": "BKASH" | "NAGAD" | "CARD",
  "currency": "BDT"
}

Response:
{
  "success": true,
  "message": "Payment intent created",
  "data": {
    "id": "payment-uuid",
    "jobId": "job-uuid",
    "payerId": "guardian-uuid",
    "amount": 15000.00,
    "method": "BKASH",
    "currency": "BDT",
    "status": "PENDING",
    "transactionId": "TXN-1702302000000",
    "invoiceNumber": "INV-1702302000000-ABC123",
    
    // Payment gateway details
    "paymentUrl": "https://bkash.com/payment/abc123",
    "qrCode": "data:image/png;base64...",
    
    // Escrow
    "escrow": {
      "id": "escrow-uuid",
      "amount": 15000.00,
      "platformFee": 750.00,  // 5%
      "status": "HELD"
    },
    
    "createdAt": "2025-12-11T10:00:00Z",
    "expiresAt": "2025-12-11T10:15:00Z"  // 15 minutes
  }
}
```

**Implementation**:
- Create payment record with `PENDING` status
- Generate unique transaction ID and invoice number
- Create escrow entry with held funds
- Calculate platform fee (5%)
- Generate payment URL/QR for bKash/Nagad
- Set 15-minute expiration

---

### **2. bKash Payment Flow**

#### **Step 1: Initialize bKash Payment**
```typescript
POST /api/payments/bkash/create
Authorization: Bearer {accessToken}

Request Body:
{
  "paymentId": "payment-uuid",
  "amount": 15000.00,
  "callbackUrl": "https://yourapp.com/payment/callback"
}

Response:
{
  "success": true,
  "data": {
    "bkashURL": "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create",
    "paymentID": "TR0011abc123def",
    "createTime": "2025-12-11T10:00:00Z",
    "orgLogo": "https://...",
    "orgName": "CareNet Platform",
    "transactionStatus": "Initiated"
  }
}
```

#### **Step 2: Execute bKash Payment** User redirects to bKash, completes payment, returns to callback URL

```typescript
POST /api/payments/bkash/execute
Authorization: Bearer {accessToken}

Request Body:
{
  "paymentId": "payment-uuid",
  "paymentID": "TR0011abc123def"
}

Response:
{
  "success": true,
  "message": "Payment successful",
  "data": {
    "paymentId": "payment-uuid",
    "status": "COMPLETED",
    "trxID": "8E9AG4D2B7",
    "transactionStatus": "Completed",
    "amount": "15000.00",
    "currency": "BDT",
    "paidAt": "2025-12-11T10:05:23Z"
  }
}
```

---

### **3. Nagad Payment Flow**

#### **Step 1: Create Nagad Order**
```typescript
POST /api/payments/nagad/create
Authorization: Bearer {accessToken}

Request Body:
{
  "paymentId": "payment-uuid",
  "amount": 15000.00
}

Response:
{
  "success": true,
  "data": {
    "paymentReferenceId": "MC1234567890",
    "callBackUrl": "https://yourapp.com/payment/callback",
    "challenge": "encrypted-challenge-string"
  }
}
```

#### **Step 2: Complete Nagad Payment**
```typescript
POST /api/payments/nagad/verify
Authorization: Bearer {accessToken}

Request Body:
{
  "paymentId": "payment-uuid",
  "paymentReferenceId": "MC1234567890"
}

Response:
{
  "success": true,
  "message": "Payment verified",
  "data": {
    "paymentId": "payment-uuid",
    "status": "COMPLETED",
    "orderId": "MC1234567890",
    "issuerPaymentRefNo": "NAG-123456",
    "amount": "15000.00",
    "paidAt": "2025-12-11T10:06:00Z"
  }
}
```

---

### **4. Payment Webhook (Gateway Callback)**

```typescript
POST /api/payments/webhook
Headers:
- X-Webhook-Signature: gateway-signature

Request Body:
{
  "paymentId": "payment-uuid",
  "transactionId": "8E9AG4D2B7",
  "status": "SUCCESS" | "FAILED",
  "amount": "15000.00",
  "currency": "BDT",
  "gatewayResponse": {
    "merchantInvoiceNumber": "INV-1702302000000-ABC123",
    "paymentMode": "0011",
    "statusCode": "0000",
    "statusMessage": "Successful"
  }
}

Response:
{
  "success": true,
  "message": "Webhook processed"
}
```

**Implementation**:
- Verify webhook signature
- Update payment status to `COMPLETED` or `FAILED`
- Update escrow status
- Trigger invoice generation (3-tier)
- Send notifications to all parties
- Update job status to `IN_PROGRESS`

---

### **5. Get Payment by ID**

```typescript
GET /api/payments/:id
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": {
    "id": "payment-uuid",
    "job": {
      "id": "job-uuid",
      "packageName": "24-Hour Elderly Care",
      "guardian": {
        "fullName": "Ahmed Hassan"
      },
      "caregiver": {
        "fullName": "Fatima Rahman"
      },
      "agency": {
        "companyName": "Care First Agency"
      }
    },
    "payerId": "guardian-uuid",
    "amount": 15000.00,
    "method": "BKASH",
    "currency": "BDT",
    "status": "COMPLETED",
    "transactionId": "8E9AG4D2B7",
    "invoiceNumber": "INV-1702302000000-ABC123",
    "paidAt": "2025-12-11T10:05:23Z",
    
    // Escrow details
    "escrow": {
      "id": "escrow-uuid",
      "amount": 15000.00,
      "platformFee": 750.00,
      "netAmount": 14250.00,
      "status": "HELD",
      "releasedAt": null
    },
    
    // Gateway response
    "gatewayResponse": {
      "statusCode": "0000",
      "statusMessage": "Successful"
    },
    
    "createdAt": "2025-12-11T10:00:00Z"
  }
}
```

---

### **6. Get User Payments**

```typescript
GET /api/payments
Authorization: Bearer {accessToken}

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- status: PaymentStatus
- method: PaymentMethod
- startDate: date
- endDate: date

Response:
{
  "success": true,
  "data": [
    {
      "id": "payment-uuid",
      "job": {
        "packageName": "24-Hour Elderly Care"
      },
      "amount": 15000.00,
      "method": "BKASH",
      "status": "COMPLETED",
      "invoiceNumber": "INV-1702302000000-ABC123",
      "paidAt": "2025-12-11T10:05:23Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### **7. Refund Payment**

```typescript
POST /api/payments/:id/refund
Authorization: Bearer {accessToken}
Roles: PLATFORM_ADMIN, SUPER_ADMIN

Request Body:
{
  "reason": "Job cancelled by agency",
  "amount": 15000.00,  // Full or partial refund
  "notes": "Full refund due to caregiver unavailability"
}

Response:
{
  "success": true,
  "message": "Refund initiated",
  "data": {
    "refundId": "refund-uuid",
    "paymentId": "payment-uuid",
    "amount": 15000.00,
    "reason": "Job cancelled by agency",
    "status": "PROCESSING",
    "initiatedBy": "admin-uuid",
    "initiatedAt": "2025-12-11T11:00:00Z",
    "expectedCompletionTime": "2025-12-14T11:00:00Z"  // 3 days
  }
}
```

**Refund Flow**:
1. Admin initiates refund
2. System calls gateway refund API
3. Funds returned to guardian within 3-7 days
4. Escrow status updated to `REFUNDED`
5. Notifications sent to all parties

---

### **8. Escrow Release**

```typescript
POST /api/payments/:id/release-escrow
Authorization: Bearer {accessToken}
Roles: PLATFORM_ADMIN

Response:
{
  "success": true,
  "message": "Escrow funds released",
  "data": {
    "escrowId": "escrow-uuid",
    "amount": 15000.00,
    "platformFee": 750.00,
    "netAmount": 14250.00,
    "status": "RELEASED",
    "releasedTo": {
      "agency": {
        "amount": 13500.00,  // 90%
        "companyName": "Care First Agency"
      },
      "caregiver": {
        "amount": 750.00,  // 5%
        "fullName": "Fatima Rahman"
      }
    },
    "releasedAt": "2025-12-18T10:00:00Z"
  }
}
```

**Auto-Release Trigger**: Job completion + 48-hour hold period

---

## 💰 Payment Gateway Integration

### **bKash Configuration**

```typescript
// providers/bkash.service.ts
export class BKashService {
  private readonly baseUrl = process.env.BKASH_BASE_URL;
  private readonly appKey = process.env.BKASH_APP_KEY;
  private readonly appSecret = process.env.BKASH_APP_SECRET;
  private readonly username = process.env.BKASH_USERNAME;
  private readonly password = process.env.BKASH_PASSWORD;
  
  async createPayment(amount: number, invoiceNumber: string) {
    // Get bKash token
    const token = await this.getToken();
    
    // Create payment
    const response = await axios.post(
      `${this.baseUrl}/checkout/payment/create`,
      {
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: invoiceNumber
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-APP-Key': this.appKey
        }
      }
    );
    
    return response.data;
  }
  
  async executePayment(paymentID: string) {
    const token = await this.getToken();
    
    const response = await axios.post(
      `${this.baseUrl}/checkout/payment/execute`,
      { paymentID },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-APP-Key': this.appKey
        }
      }
    );
    
    return response.data;
  }
  
  async queryPayment(paymentID: string) {
    const token = await this.getToken();
    
    const response = await axios.get(
      `${this.baseUrl}/checkout/payment/query/${paymentID}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-APP-Key': this.appKey
        }
      }
    );
    
    return response.data;
  }
}
```

### **Nagad Configuration**

```typescript
// providers/nagad.service.ts
export class NagadService {
  private readonly baseUrl = process.env.NAGAD_BASE_URL;
  private readonly merchantId = process.env.NAGAD_MERCHANT_ID;
  private readonly merchantNumber = process.env.NAGAD_MERCHANT_NUMBER;
  private readonly publicKey = process.env.NAGAD_PUBLIC_KEY;
  private readonly privateKey = process.env.NAGAD_PRIVATE_KEY;
  
  async createPayment(amount: number, orderId: string) {
    const sensitive = this.generateSensitiveData(orderId, amount);
    const signature = this.generateSignature(sensitive);
    
    const response = await axios.post(
      `${this.baseUrl}/remote-payment-gateway-1.0/api/dfs/check-out/initialize/${this.merchantId}/${orderId}`,
      {
        merchantId: this.merchantId,
        datetime: new Date().getTime(),
        orderId: orderId,
        challenge: signature
      },
      {
        headers: {
          'X-KM-Api-Version': 'v-0.2.0',
          'X-KM-IP-V4': '103.70.140.100',
          'X-KM-Client-Type': 'PC_WEB'
        }
      }
    );
    
    return response.data;
  }
  
  async verifyPayment(paymentReferenceId: string) {
    const response = await axios.get(
      `${this.baseUrl}/remote-payment-gateway-1.0/api/dfs/verify/payment/${paymentReferenceId}`,
      {
        headers: {
          'X-KM-Api-Version': 'v-0.2.0'
        }
      }
    );
    
    return response.data;
  }
}
```

---

## 📊 Database Schema

```prisma
model Payment {
  id                String      @id @default(uuid())
  jobId             String
  payerId           String
  
  amount            Decimal
  currency          String      @default("BDT")
  method            PaymentMethod
  
  status            PaymentStatus @default(PENDING)
  transactionId     String      @unique
  invoiceNumber     String      @unique
  
  // Gateway details
  gatewayResponse   Json?
  gatewayPaymentId  String?
  
  // Timestamps
  createdAt         DateTime    @default(now())
  paidAt            DateTime?
  failedAt          DateTime?
  
  // Relations
  job               Job         @relation(fields: [jobId], references: [id])
  payer             User        @relation(fields: [payerId], references: [id])
  escrow            Escrow?
  refund            Refund?
}

model Escrow {
  id                String      @id @default(uuid())
  paymentId         String      @unique
  
  amount            Decimal
  platformFee       Decimal
  netAmount         Decimal
  
  status            EscrowStatus @default(HELD)
  
  // Release details
  releasedAt        DateTime?
  releasedBy        String?
  
  // Timestamps
  createdAt         DateTime    @default(now())
  
  // Relations
  payment           Payment     @relation(fields: [paymentId], references: [id])
}

model Refund {
  id                String      @id @default(uuid())
  paymentId         String      @unique
  
  amount            Decimal
  reason            String
  notes             String?
  
  status            RefundStatus @default(PROCESSING)
  
  initiatedBy       String
  processedAt       DateTime?
  completedAt       DateTime?
  
  createdAt         DateTime    @default(now())
  
  payment           Payment     @relation(fields: [paymentId], references: [id])
  initiator         User        @relation(fields: [initiatedBy], references: [id])
}

enum PaymentMethod {
  BKASH
  NAGAD
  CARD
  BANK_TRANSFER
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

enum EscrowStatus {
  HELD
  RELEASED
  REFUNDED
}

enum RefundStatus {
  PROCESSING
  COMPLETED
  FAILED
}
```

---

## 🔧 Environment Variables

```env
# bKash Credentials
BKASH_BASE_URL=https://checkout.sandbox.bka.sh/v1.2.0-beta
BKASH_APP_KEY=your-app-key
BKASH_APP_SECRET=your-app-secret
BKASH_USERNAME=your-username
BKASH_PASSWORD=your-password

# Nagad Credentials
NAGAD_BASE_URL=http://sandbox.mynagad.com:10080
NAGAD_MERCHANT_ID=your-merchant-id
NAGAD_MERCHANT_NUMBER=your-merchant-number
NAGAD_PUBLIC_KEY=path/to/public.key
NAGAD_PRIVATE_KEY=path/to/private.key

# Webhook
PAYMENT_WEBHOOK_SECRET=your-webhook-secret
```

---

## 🧪 Testing

### **Unit Tests**
```typescript
describe('PaymentsService', () => {
  it('should create payment intent');
  it('should create escrow on payment creation');
  it('should process bKash payment');
  it('should process Nagad payment');
  it('should handle webhook verification');
  it('should refund payment');
  it('should release escrow');
});
```

---

## 📚 Related Documentation

- [02 Backend 07.md](02%20Backend%2007.md) - Job Lifecycle Management
- [02 Backend 12.md](02%20Backend%2012.md) - Invoicing System (3-Tier)
- [02 Backend 13.md](02%20Backend%2013.md) - Lockout & Payment Enforcement

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
