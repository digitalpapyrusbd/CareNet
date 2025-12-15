# Backend Documentation 18 - Subscription Management

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Modules**: Subscriptions  
**Priority**: 🟡 High

---

## 📋 Overview

The Subscription Management System handles **premium memberships** for agencies and caregivers with tiered plans, auto-renewal, billing cycles, and feature access control.

### **Key Features**
- Multi-tier subscription plans
- Monthly/Yearly billing cycles
- Auto-renewal with bKash/Nagad
- Feature access control
- Subscription upgrades/downgrades
- Grace period for expired subscriptions
- Subscription history
- Invoice generation

**Module Path**: `/backend/src/subscriptions/`

---

## 📁 Module Structure

```
subscriptions/
├── subscriptions.module.ts          # Module configuration
├── subscriptions.service.ts         # Business logic
├── subscriptions.controller.ts      # HTTP endpoints
├── plans/
│   └── subscription-plans.ts       # Plan definitions
└── dto/
    ├── subscribe.dto.ts            # Subscription validation
    └── upgrade.dto.ts              # Upgrade validation
```

---

## 💎 Subscription Plans

### **Caregiver Plans**

```typescript
const CAREGIVER_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    billingCycle: null,
    features: {
      jobApplications: 5,        // per month
      profileVisibility: 'BASIC',
      featuredListing: false,
      prioritySupport: false,
      analytics: false,
      verifiedBadge: false
    }
  },
  
  PREMIUM: {
    name: 'Premium',
    price: 500,                   // BDT per month
    yearlyPrice: 5000,            // BDT per year (2 months free)
    features: {
      jobApplications: 20,
      profileVisibility: 'ENHANCED',
      featuredListing: true,
      prioritySupport: true,
      analytics: 'BASIC',
      verifiedBadge: true
    }
  },
  
  PRO: {
    name: 'Pro',
    price: 1000,                  // BDT per month
    yearlyPrice: 10000,           // BDT per year
    features: {
      jobApplications: 'UNLIMITED',
      profileVisibility: 'PREMIUM',
      featuredListing: true,
      prioritySupport: true,
      analytics: 'ADVANCED',
      verifiedBadge: true,
      customProfileUrl: true
    }
  }
};
```

### **Agency Plans**

```typescript
const AGENCY_PLANS = {
  FREE: {
    name: 'Free Trial',
    price: 0,
    billingCycle: null,
    features: {
      activeCaregivers: 3,
      jobPostings: 5,
      analytics: false,
      bulkOperations: false,
      apiAccess: false
    }
  },
  
  BUSINESS: {
    name: 'Business',
    price: 2000,                  // BDT per month
    yearlyPrice: 20000,           // BDT per year
    features: {
      activeCaregivers: 15,
      jobPostings: 50,
      analytics: 'BASIC',
      bulkOperations: true,
      apiAccess: false,
      prioritySupport: true
    }
  },
  
  ENTERPRISE: {
    name: 'Enterprise',
    price: 5000,                  // BDT per month
    yearlyPrice: 50000,           // BDT per year
    features: {
      activeCaregivers: 'UNLIMITED',
      jobPostings: 'UNLIMITED',
      analytics: 'ADVANCED',
      bulkOperations: true,
      apiAccess: true,
      prioritySupport: true,
      dedicatedAccountManager: true
    }
  }
};
```

---

## 🎯 Core Features

### **1. Get Available Plans**

```typescript
GET /api/subscriptions/plans
Authorization: Bearer {accessToken}

Query Parameters:
- userType: "CAREGIVER" | "AGENCY"

Response:
{
  "success": true,
  "data": [
    {
      "id": "PREMIUM",
      "name": "Premium",
      "description": "Perfect for active caregivers",
      "price": 500,
      "yearlyPrice": 5000,
      "currency": "BDT",
      "features": {
        "jobApplications": 20,
        "profileVisibility": "ENHANCED",
        "featuredListing": true,
        "prioritySupport": true,
        "analytics": "BASIC",
        "verifiedBadge": true
      },
      "popular": true
    },
    {
      "id": "PRO",
      "name": "Pro",
      "description": "For professional caregivers",
      "price": 1000,
      "yearlyPrice": 10000,
      "features": {...},
      "popular": false
    }
  ]
}
```

---

### **2. Subscribe to Plan**

```typescript
POST /api/subscriptions/subscribe
Authorization: Bearer {accessToken}

Request Body:
{
  "planId": "PREMIUM",
  "billingCycle": "MONTHLY" | "YEARLY",
  "paymentMethod": "BKASH" | "NAGAD"
}

Response:
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "subscriptionId": "sub-uuid",
    "planId": "PREMIUM",
    "planName": "Premium",
    "amount": 500,
    "billingCycle": "MONTHLY",
    "status": "ACTIVE",
    "startDate": "2025-12-11T00:00:00Z",
    "endDate": "2026-01-11T00:00:00Z",
    "nextBillingDate": "2026-01-11T00:00:00Z",
    "autoRenewal": true,
    "features": {...}
  }
}
```

---

### **3. Get My Subscription**

```typescript
GET /api/subscriptions/my-subscription
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": {
    "id": "sub-uuid",
    "plan": {
      "id": "PREMIUM",
      "name": "Premium",
      "price": 500
    },
    "billingCycle": "MONTHLY",
    "status": "ACTIVE",
    "startDate": "2025-12-11T00:00:00Z",
    "endDate": "2026-01-11T00:00:00Z",
    "nextBillingDate": "2026-01-11T00:00:00Z",
    "autoRenewal": true,
    "daysRemaining": 31,
    "features": {
      "jobApplications": {
        "limit": 20,
        "used": 8,
        "remaining": 12
      },
      "profileVisibility": "ENHANCED",
      "featuredListing": true,
      "prioritySupport": true,
      "analytics": "BASIC",
      "verifiedBadge": true
    }
  }
}
```

---

### **4. Upgrade/Downgrade Plan**

```typescript
POST /api/subscriptions/change-plan
Authorization: Bearer {accessToken}

Request Body:
{
  "newPlanId": "PRO",
  "billingCycle": "YEARLY"
}

Response:
{
  "success": true,
  "message": "Plan upgraded successfully",
  "data": {
    "subscriptionId": "sub-uuid",
    "oldPlan": "PREMIUM",
    "newPlan": "PRO",
    "proratedAmount": 500,      // Amount charged for upgrade
    "nextBillingDate": "2026-12-11T00:00:00Z",
    "features": {...}
  }
}

// Upgrade: Immediate activation + prorated charge
// Downgrade: Takes effect at end of current billing period
```

---

### **5. Cancel Subscription**

```typescript
POST /api/subscriptions/cancel
Authorization: Bearer {accessToken}

Request Body:
{
  "reason": "Too expensive" | "Not using features" | "Found alternative" | "Other",
  "feedback": "Optional feedback text"
}

Response:
{
  "success": true,
  "message": "Subscription cancelled",
  "data": {
    "subscriptionId": "sub-uuid",
    "status": "CANCELLED",
    "endDate": "2026-01-11T00:00:00Z",
    "accessUntil": "2026-01-11T00:00:00Z",
    "message": "You will retain access to premium features until Jan 11, 2026"
  }
}

// User retains access until end of paid period
// No refunds for partial periods
```

---

### **6. Resume Subscription**

```typescript
POST /api/subscriptions/resume
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "message": "Subscription resumed",
  "data": {
    "subscriptionId": "sub-uuid",
    "status": "ACTIVE",
    "autoRenewal": true,
    "nextBillingDate": "2026-01-11T00:00:00Z"
  }
}

// Only works if subscription is in grace period or recently cancelled
```

---

### **7. Get Subscription History**

```typescript
GET /api/subscriptions/history
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": [
    {
      "id": "payment-uuid",
      "subscriptionId": "sub-uuid",
      "planName": "Premium",
      "amount": 500,
      "billingCycle": "MONTHLY",
      "paymentMethod": "BKASH",
      "status": "PAID",
      "paidAt": "2025-12-11T10:00:00Z",
      "periodStart": "2025-12-11T00:00:00Z",
      "periodEnd": "2026-01-11T00:00:00Z",
      "invoiceUrl": "https://r2.com/invoices/invoice-123.pdf"
    }
  ]
}
```

---

## ⚙️ Auto-Renewal System

### **Renewal Cron Job**

```typescript
@Cron('0 0 * * *')  // Run daily at midnight
async handleSubscriptionRenewals() {
  // Get subscriptions expiring tomorrow
  const expiringSubscriptions = await this.prisma.subscription.findMany({
    where: {
      endDate: {
        lte: new Date(Date.now() + 24 * 60 * 60 * 1000),
        gte: new Date()
      },
      autoRenewal: true,
      status: 'ACTIVE'
    }
  });

  for (const subscription of expiringSubscriptions) {
    try {
      // Attempt payment
      const payment = await this.processRenewalPayment(subscription);
      
      if (payment.success) {
        // Extend subscription
        await this.renewSubscription(subscription.id);
        
        // Send success notification
        await this.notifyRenewalSuccess(subscription.userId);
      } else {
        // Payment failed
        await this.handleFailedRenewal(subscription.id);
      }
    } catch (error) {
      // Log error and notify admin
      await this.notifyRenewalError(subscription.id, error);
    }
  }
}

async handleFailedRenewal(subscriptionId: string) {
  // Update status to PAYMENT_FAILED
  await this.prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: 'PAYMENT_FAILED' }
  });
  
  // Send payment failure notification
  await this.notifyPaymentFailed(subscriptionId);
  
  // Start 3-day grace period
  await this.startGracePeriod(subscriptionId);
}
```

---

## 📊 Database Schema

```prisma
model Subscription {
  id                  String              @id @default(uuid())
  userId              String
  
  planId              String
  planName            String
  billingCycle        BillingCycle
  
  status              SubscriptionStatus  @default(ACTIVE)
  
  // Pricing
  amount              Int
  currency            String              @default("BDT")
  
  // Dates
  startDate           DateTime
  endDate             DateTime
  nextBillingDate     DateTime?
  cancelledAt         DateTime?
  
  autoRenewal         Boolean             @default(true)
  
  // Features (JSON)
  features            Json
  
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt
  
  user                User                @relation(fields: [userId], references: [id])
  payments            SubscriptionPayment[]
}

model SubscriptionPayment {
  id                  String      @id @default(uuid())
  subscriptionId      String
  
  amount              Int
  currency            String      @default("BDT")
  paymentMethod       String
  
  status              PaymentStatus
  transactionId       String?
  
  periodStart         DateTime
  periodEnd           DateTime
  
  paidAt              DateTime?
  invoiceUrl          String?
  
  createdAt           DateTime    @default(now())
  
  subscription        Subscription @relation(fields: [subscriptionId], references: [id])
}

enum BillingCycle {
  MONTHLY
  YEARLY
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PAYMENT_FAILED
  GRACE_PERIOD
}
```

---

## 🔐 Feature Access Control

```typescript
// Guard for premium features
@Injectable()
export class PremiumFeatureGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    const subscription = await this.subscriptionService.getUserSubscription(
      user.id
    );
    
    if (!subscription || subscription.status !== 'ACTIVE') {
      throw new ForbiddenException('Premium subscription required');
    }
    
    // Check specific feature
    const requiredFeature = this.reflector.get<string>(
      'feature',
      context.getHandler()
    );
    
    if (!subscription.features[requiredFeature]) {
      throw new ForbiddenException(
        `This feature requires ${requiredFeature}`
      );
    }
    
    return true;
  }
}

// Usage
@Post('featured-listing')
@UseGuards(JwtAuthGuard, PremiumFeatureGuard)
@RequireFeature('featuredListing')
async createFeaturedListing() {
  // Only accessible with premium subscription
}
```

---

## 🧪 Testing

```typescript
describe('SubscriptionsService', () => {
  it('should subscribe to plan');
  it('should get my subscription');
  it('should upgrade plan');
  it('should downgrade plan');
  it('should cancel subscription');
  it('should resume subscription');
  it('should auto-renew subscription');
  it('should handle failed renewal');
  it('should enforce feature access');
});
```

---

## 🔧 Environment Variables

```env
# No specific environment variables
# Uses shared JWT, Database, and Payment configs
```

---

## 📚 Related Documentation

- [02 Backend 11.md](02%20Backend%2011.md) - Payment Processing
- [02 Backend 02.md](02%20Backend%2002.md) - Authentication & User Management

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
