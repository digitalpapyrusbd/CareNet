# Backend Documentation 13 - Lockout & Payment Enforcement

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Module**: Lockout  
**Priority**: 🔴 Critical

---

## 📋 Overview

The Lockout System enforces **7-day payment rules** with automated account lockout for overdue invoices, featuring a progressive reminder system and grace period management.

### **Key Features**
- 7-day payment enforcement flow
- Day 3, 5, 6 reminder system
- Automatic account lockout on Day 7
- Feature restriction management
- Auto-unlock on payment
- Grace period extension
- Cron-based monitoring

**Module Path**: `/backend/src/lockout/`

---

## 📁 Module Structure

```
lockout/
├── lockout.module.ts           # Module configuration
├── lockout.service.ts          # Business logic
├── lockout.controller.ts       # HTTP endpoints
└── dto/
    └── lockout.dto.ts          # Validation schemas
```

---

## ⏱️ 7-Day Payment Enforcement Timeline

```
Day 0: Invoice generated (Due date set to Day 7)
Day 3: First reminder (Email + SMS + Push)
Day 5: Second warning (Email + SMS + Push)
Day 6: Final warning (24 hours remaining)
Day 7: ACCOUNT LOCKED
Payment: Auto-unlock within 1 hour
```

---

## 🎯 Core Features

### **1. Check Account Status**

```typescript
GET /api/lockout/status
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": {
    "isLocked": false,
    "reason": null,
    "overdueInvoices": [],
    "warningLevel": 0,
    "daysUntilLockout": null
  }
}

// If locked
Response:
{
  "success": true,
  "data": {
    "isLocked": true,
    "reason": "PAYMENT_OVERDUE",
    "lockedAt": "2025-12-18T00:00:00Z",
    "overdueInvoices": [
      {
        "id": "invoice-uuid",
        "invoiceNumber": "INV-1702302000000-ABC123",
        "amount": 15000.00,
        "dueDate": "2025-12-11T23:59:59Z",
        "daysOverdue": 7
      }
    ],
    "lockedFeatures": {
      "createJobs": false,
      "createPackages": false,
      "assignCaregivers": false,
      "messaging": false
    },
    "activeFeatures": {
      "viewProfile": true,
      "viewInvoices": true,
      "makePayment": true,
      "contactSupport": true
    }
  }
}
```

---

### **2. Cron Job: Daily Invoice Check**

```typescript
// Runs every day at midnight
@Cron('0 0 * * *')
async checkOverdueInvoices() {
  const now = new Date();
  
  // Find all unpaid invoices
  const invoices = await prisma.invoices.findMany({
    where: {
      status: 'PENDING',
      dueDate: { lt: now }
    },
    include: { recipient: true }
  });
  
  for (const invoice of invoices) {
    const daysOverdue = Math.floor(
      (now.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysOverdue === 3) {
      // Day 3: First reminder
      await sendReminder(invoice.recipientId, 'FIRST_REMINDER', invoice);
    } else if (daysOverdue === 5) {
      // Day 5: Second warning
      await sendReminder(invoice.recipientId, 'SECOND_WARNING', invoice);
    } else if (daysOverdue === 6) {
      // Day 6: Final warning
      await sendReminder(invoice.recipientId, 'FINAL_WARNING', invoice);
    } else if (daysOverdue >= 7) {
      // Day 7+: Lock account
      await lockAccount(invoice.recipientId, 'PAYMENT_OVERDUE', {
        invoiceId: invoice.id,
        daysOverdue
      });
      
      // Update invoice status
      await prisma.invoices.update({
        where: { id: invoice.id },
        data: { status: 'OVERDUE' }
      });
    }
  }
}
```

---

### **3. Lock Account**

```typescript
POST /api/lockout/lock
Authorization: Bearer {accessToken}
Roles: PLATFORM_ADMIN, SUPER_ADMIN

Request Body:
{
  "userId": "user-uuid",
  "reason": "PAYMENT_OVERDUE" | "SECURITY_VIOLATION" | "POLICY_BREACH",
  "details": {
    "invoiceId": "invoice-uuid",
    "daysOverdue": 7,
    "notes": "Payment 7 days overdue"
  },
  "lockedFeatures": {
    "createJobs": false,
    "createPackages": false,
    "assignCaregivers": false,
    "messaging": false
  }
}

Response:
{
  "success": true,
  "message": "Account locked successfully",
  "data": {
    "lockoutId": "lockout-uuid",
    "userId": "user-uuid",
    "reason": "PAYMENT_OVERDUE",
    "lockedAt": "2025-12-18T00:00:00Z",
    "lockedFeatures": {...},
    "activeFeatures": {
      "viewProfile": true,
      "viewInvoices": true,
      "makePayment": true,
      "contactSupport": true
    }
  }
}
```

---

### **4. Unlock Account**

```typescript
POST /api/lockout/unlock
Authorization: Bearer {accessToken}
Roles: PLATFORM_ADMIN, SUPER_ADMIN

Request Body:
{
  "userId": "user-uuid",
  "reason": "Payment received",
  "notes": "Invoice INV-1702302000000-ABC123 paid"
}

Response:
{
  "success": true,
  "message": "Account unlocked successfully",
  "data": {
    "userId": "user-uuid",
    "unlockedAt": "2025-12-18T14:30:00Z",
    "unlockedBy": "admin-uuid",
    "reason": "Payment received"
  }
}
```

**Auto-Unlock**: Triggered when overdue invoice is paid

```typescript
// Webhook handler after payment
async function onPaymentReceived(invoiceId: string) {
  const invoice = await getInvoice(invoiceId);
  
  // Check if user is locked due to this invoice
  const lockout = await prisma.accountLockouts.findFirst({
    where: {
      userId: invoice.recipientId,
      isActive: true,
      reason: 'PAYMENT_OVERDUE',
      triggeringInvoiceId: invoiceId
    }
  });
  
  if (lockout) {
    // Auto-unlock
    await unlockAccount(invoice.recipientId, 'SYSTEM', 'Payment received');
    
    // Notify user
    await notificationService.send({
      userId: invoice.recipientId,
      title: 'Account Unlocked',
      message: 'Your payment has been received. Account access restored.'
    });
  }
}
```

---

### **5. Grant Grace Period**

```typescript
POST /api/lockout/grace-period
Authorization: Bearer {accessToken}
Roles: PLATFORM_ADMIN, SUPER_ADMIN

Request Body:
{
  "userId": "user-uuid",
  "days": 3,
  "reason": "Customer requested extension due to bank transfer delay"
}

Response:
{
  "success": true,
  "message": "Grace period granted",
  "data": {
    "userId": "user-uuid",
    "originalDueDate": "2025-12-11T23:59:59Z",
    "newDueDate": "2025-12-14T23:59:59Z",
    "graceDays": 3,
    "grantedBy": "admin-uuid",
    "grantedAt": "2025-12-10T15:00:00Z"
  }
}
```

---

### **6. Get Lockout History**

```typescript
GET /api/lockout/history/:userId
Authorization: Bearer {accessToken}
Roles: PLATFORM_ADMIN, SUPER_ADMIN

Response:
{
  "success": true,
  "data": [
    {
      "id": "lockout-uuid",
      "userId": "user-uuid",
      "reason": "PAYMENT_OVERDUE",
      "lockedAt": "2025-12-18T00:00:00Z",
      "unlockedAt": "2025-12-18T14:30:00Z",
      "unlockedBy": "admin-uuid",
      "duration": "14.5 hours",
      "triggeringInvoice": {
        "invoiceNumber": "INV-1702302000000-ABC123",
        "amount": 15000.00
      }
    }
  ]
}
```

---

## 📧 Reminder System

### **Day 3: First Reminder**

```typescript
Email Subject: Payment Reminder - Invoice INV-ABC123
Email Body:
Dear [Name],

This is a friendly reminder that your invoice INV-ABC123 for BDT 15,000 
is due on December 11, 2025.

Please make payment to avoid any service interruption.

Due Date: December 11, 2025
Amount: BDT 15,000
Days Remaining: 4

[Pay Now Button]

SMS:
"Payment reminder: Invoice INV-ABC123 (BDT 15,000) due in 4 days. 
Pay now: [link]"

Push Notification:
"Payment Due in 4 Days"
"Invoice INV-ABC123 - BDT 15,000"
```

### **Day 5: Second Warning**

```typescript
Email Subject: URGENT: Payment Due in 2 Days - Invoice INV-ABC123
Email Body:
Dear [Name],

URGENT: Your payment of BDT 15,000 is due in 2 days.

Failure to pay by December 11, 2025 will result in:
- Account suspension
- Loss of access to key features
- Service interruption

Amount Due: BDT 15,000
Days Remaining: 2

[Pay Now Button]

SMS:
"URGENT: Invoice INV-ABC123 (BDT 15,000) due in 2 days. 
Account will be locked if unpaid. Pay now: [link]"

Push Notification:
"⚠️ URGENT: Payment Due in 2 Days"
"Account will be locked if unpaid"
```

### **Day 6: Final Warning**

```typescript
Email Subject: FINAL WARNING: Payment Due in 24 Hours - Account Lockout
Email Body:
Dear [Name],

FINAL WARNING: You have 24 hours to make payment.

Your account will be LOCKED tomorrow if payment is not received.

Amount Due: BDT 15,000
Lockout Time: December 18, 2025 at 12:00 AM

After lockout, you will lose access to:
✗ Job creation
✗ Package management
✗ Caregiver assignment
✗ Messaging

You will still be able to:
✓ View invoices
✓ Make payment
✓ Contact support

[Pay Now Immediately]

SMS:
"FINAL WARNING: Pay BDT 15,000 in 24 hours or account locks. 
Pay now: [link]"

Push Notification:
"🚨 FINAL WARNING: 24 Hours Until Lockout"
"Pay BDT 15,000 immediately"
```

---

## 🚫 Feature Restrictions

### **Locked Features**

When account is locked due to payment:

```typescript
const lockedFeatures = {
  // Core Business Operations
  createJobs: false,
  acceptJobs: false,
  createPackages: false,
  editPackages: false,
  assignCaregivers: false,
  createNegotiations: false,
  
  // Communication
  sendMessages: false,
  createDisputes: false,
  
  // Financial
  withdrawEarnings: false,
  createInvoices: false,
  
  // Profile
  editCompanyProfile: false,
  addCaregivers: false
};
```

### **Active Features**

```typescript
const activeFeatures = {
  // View Access
  viewProfile: true,
  viewDashboard: true,
  viewInvoices: true,
  viewJobs: true,
  viewMessages: true,
  
  // Payment
  makePayment: true,
  viewPaymentMethods: true,
  
  // Support
  contactSupport: true,
  createSupportTicket: true,
  
  // Account Management
  changePassword: true,
  updateContactInfo: true
};
```

---

## 📊 Database Schema

```prisma
model AccountLockout {
  id                    String      @id @default(uuid())
  userId                String
  
  reason                AccountLockReason
  details               Json?
  
  // Features
  lockedFeatures        Json
  activeFeatures        Json
  
  // Status
  isActive              Boolean     @default(true)
  
  // Invoice reference
  triggeringInvoiceId   String?
  
  // Timestamps
  lockedAt              DateTime    @default(now())
  unlockedAt            DateTime?
  unlockedBy            String?
  
  // Relations
  user                  User        @relation(fields: [userId], references: [id])
  triggeringInvoice     Invoice?    @relation(fields: [triggeringInvoiceId], references: [id])
  unlocker              User?       @relation("UnlockedBy", fields: [unlockedBy], references: [id])
}

enum AccountLockReason {
  PAYMENT_OVERDUE
  SECURITY_VIOLATION
  POLICY_BREACH
  FRAUD_SUSPECTED
  ADMIN_LOCK
}
```

---

## 🔒 Middleware: Check Lockout

```typescript
// lockout.guard.ts
@Injectable()
export class LockoutGuard implements CanActivate {
  constructor(private lockoutService: LockoutService) {}
  
  async canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) return true;
    
    const lockout = await this.lockoutService.checkAccountStatus(user.id);
    
    if (lockout.isLocked) {
      // Check if current route is allowed
      const route = request.route.path;
      const allowedRoutes = [
        '/api/invoices',
        '/api/payments',
        '/api/profile',
        '/api/support'
      ];
      
      const isAllowed = allowedRoutes.some(r => route.startsWith(r));
      
      if (!isAllowed) {
        throw new ForbiddenException({
          message: 'Account locked due to overdue payment',
          reason: lockout.reason,
          lockedAt: lockout.details.lockedAt,
          overdueInvoices: lockout.details.overdueInvoices
        });
      }
    }
    
    return true;
  }
}
```

---

## 🧪 Testing

### **Unit Tests**

```typescript
describe('LockoutService', () => {
  it('should check account status');
  it('should lock account for overdue payment');
  it('should unlock account manually');
  it('should auto-unlock on payment');
  it('should grant grace period');
  it('should send reminders on Day 3, 5, 6');
  it('should lock on Day 7');
  it('should restrict locked features');
  it('should allow active features');
});
```

### **E2E Tests**

```typescript
describe('Lockout System', () => {
  it('should allow access when not locked');
  it('should block restricted features when locked');
  it('should allow payment when locked');
  it('should auto-unlock after payment');
  it('should enforce grace period extension');
});
```

---

## 📈 Lockout Statistics

```typescript
GET /api/lockout/stats
Authorization: Bearer {accessToken}
Roles: PLATFORM_ADMIN

Response:
{
  "success": true,
  "data": {
    "currentlyLocked": 15,
    "lockedToday": 8,
    "lockedThisWeek": 42,
    "lockedThisMonth": 156,
    "averageLockoutDuration": "18.5 hours",
    "autoUnlocksToday": 12,
    "manualUnlocksToday": 3,
    "byReason": {
      "PAYMENT_OVERDUE": 145,
      "SECURITY_VIOLATION": 8,
      "POLICY_BREACH": 3
    }
  }
}
```

---

## 📚 Related Documentation

- [02 Backend 11.md](02%20Backend%2011.md) - Payment Processing
- [02 Backend 12.md](02%20Backend%2012.md) - Invoicing System (3-Tier)
- [02 Backend 15.md](02%20Backend%2015.md) - Notification System

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
