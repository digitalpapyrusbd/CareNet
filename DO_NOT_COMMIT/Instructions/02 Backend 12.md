# Backend Documentation 12 - Invoicing System (3-Tier)

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Module**: Invoicing  
**Priority**: 🔴 Critical

---

## 📋 Overview

The Invoicing System implements a **3-tier billing structure**: Caregiver → Agency → Guardian, with platform commission automatically calculated and tracked.

### **Key Features**
- 3-tier invoice generation
- Automatic invoice creation on job completion
- 7-day payment grace period
- Invoice PDF generation
- Payment tracking
- Overdue invoice management
- Commission calculation

**Module Path**: `/backend/src/invoicing/`

---

## 📁 Module Structure

```
invoicing/
├── invoicing.module.ts          # Module configuration
├── invoicing.service.ts         # Business logic
├── invoicing.controller.ts      # HTTP endpoints
└── dto/
    ├── create-invoice.dto.ts   # Creation validation
    └── pay-invoice.dto.ts      # Payment validation
```

---

## 🎯 3-Tier Invoice Flow

### **Tier 1: Caregiver → Agency**
When a job is completed, the caregiver bills the agency for their services.

```typescript
POST /api/invoices
Authorization: Bearer {accessToken}
Role: SYSTEM (Auto-generated)

Request Body:
{
  "jobId": "job-uuid",
  "type": "CAREGIVER_TO_AGENCY",
  "amount": 12000.00,
  "dueDate": "2025-12-18T23:59:59Z"
}

Response:
{
  "success": true,
  "message": "Caregiver invoice created",
  "data": {
    "id": "invoice-uuid-1",
    "invoiceNumber": "INV-1702302000000-ABC123",
    "jobId": "job-uuid",
    "type": "CAREGIVER_TO_AGENCY",
    "issuer": {
      "id": "caregiver-uuid",
      "fullName": "Fatima Rahman"
    },
    "recipient": {
      "id": "agency-uuid",
      "companyName": "Care First Agency"
    },
    "amount": 12000.00,
    "status": "PENDING",
    "dueDate": "2025-12-18T23:59:59Z",  // 7 days
    "createdAt": "2025-12-11T10:00:00Z"
  }
}
```

### **Tier 2: Agency → Guardian**
The agency bills the guardian for the full service amount.

```typescript
POST /api/invoices
Authorization: Bearer {accessToken}
Role: SYSTEM (Auto-generated)

Request Body:
{
  "jobId": "job-uuid",
  "type": "AGENCY_TO_GUARDIAN",
  "amount": 15000.00,
  "dueDate": "2025-12-18T23:59:59Z"
}

Response:
{
  "success": true,
  "message": "Agency invoice created",
  "data": {
    "id": "invoice-uuid-2",
    "invoiceNumber": "INV-1702302000001-DEF456",
    "jobId": "job-uuid",
    "type": "AGENCY_TO_GUARDIAN",
    "issuer": {
      "id": "agency-uuid",
      "companyName": "Care First Agency"
    },
    "recipient": {
      "id": "guardian-uuid",
      "fullName": "Ahmed Hassan"
    },
    "amount": 15000.00,
    "status": "PENDING",
    "dueDate": "2025-12-18T23:59:59Z",
    "createdAt": "2025-12-11T10:00:00Z"
  }
}
```

### **Tier 3: Platform Commission**
The platform bills the agency for commission (typically 15% of job amount).

```typescript
POST /api/invoices
Authorization: Bearer {accessToken}
Role: SYSTEM (Auto-generated)

Request Body:
{
  "jobId": "job-uuid",
  "type": "PLATFORM_COMMISSION",
  "amount": 2250.00,  // 15% of 15000
  "dueDate": "2025-12-18T23:59:59Z"
}

Response:
{
  "success": true,
  "message": "Platform commission invoice created",
  "data": {
    "id": "invoice-uuid-3",
    "invoiceNumber": "INV-1702302000002-GHI789",
    "jobId": "job-uuid",
    "type": "PLATFORM_COMMISSION",
    "issuer": {
      "id": "platform",
      "name": "CareNet Platform"
    },
    "recipient": {
      "id": "agency-uuid",
      "companyName": "Care First Agency"
    },
    "amount": 2250.00,
    "commissionRate": 15.0,
    "status": "PENDING",
    "dueDate": "2025-12-18T23:59:59Z",
    "createdAt": "2025-12-11T10:00:00Z"
  }
}
```

---

## 💸 Auto-Generation on Job Completion

```typescript
// Triggered when job status = 'COMPLETED'
async function onJobCompletion(jobId: string) {
  const job = await getJob(jobId);
  
  // Tier 1: Caregiver → Agency
  await createInvoice({
    jobId,
    type: 'CAREGIVER_TO_AGENCY',
    amount: job.caregiverAmount,  // e.g., 12000
    dueDate: addDays(new Date(), 7)
  });
  
  // Tier 2: Agency → Guardian
  await createInvoice({
    jobId,
    type: 'AGENCY_TO_GUARDIAN',
    amount: job.totalAmount,  // e.g., 15000
    dueDate: addDays(new Date(), 7)
  });
  
  // Tier 3: Platform → Agency
  const commission = job.totalAmount * (job.agency.commissionRate / 100);
  await createInvoice({
    jobId,
    type: 'PLATFORM_COMMISSION',
    amount: commission,  // e.g., 2250 (15%)
    dueDate: addDays(new Date(), 7)
  });
}
```

---

## 📄 Get Invoice by ID

```typescript
GET /api/invoices/:id
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": {
    "id": "invoice-uuid",
    "invoiceNumber": "INV-1702302000000-ABC123",
    "job": {
      "id": "job-uuid",
      "packageName": "24-Hour Elderly Care",
      "completedAt": "2025-12-11T09:00:00Z"
    },
    "type": "AGENCY_TO_GUARDIAN",
    "issuer": {
      "id": "agency-uuid",
      "companyName": "Care First Agency",
      "address": "123 Gulshan Avenue, Dhaka"
    },
    "recipient": {
      "id": "guardian-uuid",
      "fullName": "Ahmed Hassan",
      "address": "456 Banani, Dhaka"
    },
    "amount": 15000.00,
    "tax": 0.00,
    "totalAmount": 15000.00,
    "status": "PENDING",
    "dueDate": "2025-12-18T23:59:59Z",
    "paidAt": null,
    "pdfUrl": "https://r2.com/invoices/INV-1702302000000-ABC123.pdf",
    "createdAt": "2025-12-11T10:00:00Z"
  }
}
```

---

## 📋 Get User Invoices

```typescript
GET /api/invoices
Authorization: Bearer {accessToken}

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- type: InvoiceType
- status: InvoiceStatus
- startDate: date
- endDate: date

Response:
{
  "success": true,
  "data": [
    {
      "id": "invoice-uuid",
      "invoiceNumber": "INV-1702302000000-ABC123",
      "job": {
        "packageName": "24-Hour Elderly Care"
      },
      "type": "AGENCY_TO_GUARDIAN",
      "issuerName": "Care First Agency",
      "amount": 15000.00,
      "status": "PENDING",
      "dueDate": "2025-12-18T23:59:59Z",
      "createdAt": "2025-12-11T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2
  }
}
```

---

## 💳 Pay Invoice

```typescript
POST /api/invoices/:id/pay
Authorization: Bearer {accessToken}

Request Body:
{
  "paymentMethod": "BKASH",
  "transactionId": "8E9AG4D2B7"
}

Response:
{
  "success": true,
  "message": "Invoice paid successfully",
  "data": {
    "invoiceId": "invoice-uuid",
    "invoiceNumber": "INV-1702302000000-ABC123",
    "amount": 15000.00,
    "status": "PAID",
    "paymentMethod": "BKASH",
    "transactionId": "8E9AG4D2B7",
    "paidAt": "2025-12-15T14:30:00Z"
  }
}
```

---

## 📊 Database Schema

```prisma
model Invoice {
  id              String        @id @default(uuid())
  invoiceNumber   String        @unique
  jobId           String?
  
  type            InvoiceType
  issuerId        String
  recipientId     String
  
  amount          Decimal
  tax             Decimal       @default(0)
  totalAmount     Decimal
  commissionRate  Decimal?
  
  status          InvoiceStatus @default(PENDING)
  dueDate         DateTime
  paidAt          DateTime?
  
  pdfUrl          String?
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  job             Job?          @relation(fields: [jobId], references: [id])
}

enum InvoiceType {
  CAREGIVER_TO_AGENCY
  AGENCY_TO_GUARDIAN
  PLATFORM_COMMISSION
  SUBSCRIPTION
}

enum InvoiceStatus {
  PENDING
  PAID
  OVERDUE
  CANCELLED
}
```

---

## 📚 Related Documentation

- [02 Backend 07.md](02%20Backend%2007.md) - Job Lifecycle Management
- [02 Backend 11.md](02%20Backend%2011.md) - Payment Processing
- [02 Backend 13.md](02%20Backend%2013.md) - Lockout & Payment Enforcement

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
