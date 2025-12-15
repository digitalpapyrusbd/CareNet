# Remaining Modules Implementation Guide

**Status:** 10/25 modules complete (40%)  
**Remaining:** 15 modules to implement  
**This Document:** Complete implementation guide for all remaining modules  

---

## 📋 **PHASE 3 REMAINING (4 Modules)**

### **1. Jobs Module** (Priority: HIGH)

**Files to Create:**
```
src/jobs/
├── dto/
│   ├── create-job.dto.ts
│   ├── update-job.dto.ts
│   └── assign-caregiver.dto.ts
├── jobs.service.ts
├── jobs.controller.ts
└── jobs.module.ts
```

**Key Features:**
- Create job from package
- Assign caregivers to jobs
- Job status management (PENDING, ACTIVE, COMPLETED, CANCELLED)
- Job deployment workflow
- Guardian approval
- Caregiver acceptance

**Endpoints (8):**
```typescript
POST   /api/jobs                    // Create job from package
GET    /api/jobs                    // List jobs (filtered by role)
GET    /api/jobs/:id                // Get job details
PATCH  /api/jobs/:id                // Update job
PATCH  /api/jobs/:id/assign         // Assign caregiver (Agency)
PATCH  /api/jobs/:id/accept         // Accept job (Caregiver)
PATCH  /api/jobs/:id/complete       // Mark complete (Guardian)
DELETE /api/jobs/:id                // Cancel job
```

**Business Logic:**
- Guardian creates job from package
- Agency assigns caregivers
- Caregivers accept/decline
- Job starts when all caregivers accept
- Guardian marks complete
- Triggers payment release from escrow

---

### **2. Negotiations Module** (Priority: HIGH)

**Files to Create:**
```
src/negotiations/
├── dto/
│   ├── create-negotiation.dto.ts
│   └── respond-negotiation.dto.ts
├── negotiations.service.ts
├── negotiations.controller.ts
└── negotiations.module.ts
```

**Key Features:**
- Package counter-offers
- Multi-round negotiation (max 3 rounds)
- 48-hour timeout per round
- Accept/decline/counter flow
- Automatic expiry

**Endpoints (4):**
```typescript
POST   /api/negotiations            // Create counter-offer
GET    /api/negotiations            // List negotiations
PATCH  /api/negotiations/:id/respond // Respond (accept/decline/counter)
GET    /api/negotiations/:id        // Get negotiation details
```

**Business Logic:**
- Guardian proposes counter-offer on package
- Agency can accept, decline, or counter
- Max 3 rounds
- 48-hour timeout per round
- Auto-decline after timeout
- Creates new package if accepted

---

### **3. Invoicing Module** (Priority: CRITICAL)

**Files to Create:**
```
src/invoicing/
├── dto/
│   ├── create-invoice.dto.ts
│   └── pay-invoice.dto.ts
├── invoicing.service.ts
├── invoicing.controller.ts
└── invoicing.module.ts
```

**Key Features:**
- 3-tier billing (Caregiver → Agency → Guardian)
- Platform commission calculation
- Invoice generation
- Payment tracking
- Overdue detection

**Endpoints (5):**
```typescript
POST   /api/invoices               // Generate invoice
GET    /api/invoices               // List invoices
GET    /api/invoices/:id           // Get invoice details
PATCH  /api/invoices/:id/pay       // Mark as paid
GET    /api/invoices/overdue       // Get overdue invoices
```

**Invoice Types:**
1. **GUARDIAN_TO_PLATFORM** - Guardian pays for job
2. **PLATFORM_TO_AGENCY** - Platform pays agency (minus commission)
3. **AGENCY_TO_CAREGIVER** - Agency pays caregiver

**Business Logic:**
- Job completion triggers invoice generation
- Guardian invoice: Full job amount
- Agency invoice: Job amount - platform commission (10%)
- Caregiver invoice: Hourly rate × hours worked
- 7-day payment deadline
- Overdue triggers lockout

---

### **4. Lockout Module** (Priority: CRITICAL)

**Files to Create:**
```
src/lockout/
├── lockout.service.ts
├── lockout.controller.ts
├── lockout.module.ts
└── lockout.cron.ts
```

**Key Features:**
- 7-day payment enforcement
- Progressive notifications (Day 3, 5, 6)
- Feature restrictions by entity type
- Auto-unlock on payment
- Grace period support (Admin)

**Endpoints (4):**
```typescript
GET    /api/lockout/status         // Check lockout status
POST   /api/lockout/:userId/lock   // Manual lock (Admin)
POST   /api/lockout/:userId/unlock // Manual unlock (Admin)
POST   /api/lockout/:userId/grace  // Grant grace period (Admin)
```

**Cron Jobs (2):**
```typescript
@Cron('0 0 * * *')  // Daily at midnight
checkOverdueInvoices()

@Cron('0 */6 * * *')  // Every 6 hours
sendPaymentReminders()
```

**Lockout Rules:**
- **Agency:** Can't post jobs, packages; can manage existing
- **Guardian:** Can't create jobs; can view/message existing
- **Caregiver:** Can't accept new jobs; can complete existing
- **Shop:** Can't add products; can fulfill existing orders

---

## 📋 **PHASE 5: SUPPORT MODULES (3 Modules)**

### **5. Subscriptions Module**

**Files to Create:**
```
src/subscriptions/
├── dto/
│   ├── create-subscription.dto.ts
│   └── update-subscription.dto.ts
├── subscriptions.service.ts
├── subscriptions.controller.ts
└── subscriptions.module.ts
```

**Key Features:**
- Subscription tier management (BASIC, STANDARD, PREMIUM)
- Bundled pricing (subscription + commission)
- Auto-renewal
- Upgrade/downgrade
- Payment tracking

**Endpoints (4):**
```typescript
POST   /api/subscriptions          // Subscribe
GET    /api/subscriptions          // Get subscription
PATCH  /api/subscriptions/upgrade  // Upgrade tier
POST   /api/subscriptions/cancel   // Cancel subscription
```

**Tiers:**
- **BASIC:** $50/month + 15% commission
- **STANDARD:** $100/month + 12% commission
- **PREMIUM:** $200/month + 10% commission

---

### **6. Disputes Module**

**Files to Create:**
```
src/disputes/
├── dto/
│   ├── create-dispute.dto.ts
│   └── resolve-dispute.dto.ts
├── disputes.service.ts
├── disputes.controller.ts
└── disputes.module.ts
```

**Key Features:**
- Job/payment disputes
- Evidence submission
- Moderator/Admin resolution
- Refund processing
- Status tracking

**Endpoints (5):**
```typescript
POST   /api/disputes               // Create dispute
GET    /api/disputes               // List disputes
GET    /api/disputes/:id           // Get dispute details
PATCH  /api/disputes/:id/resolve   // Resolve (Moderator/Admin)
POST   /api/disputes/:id/evidence  // Submit evidence
```

---

### **7. Shops Module**

**Files to Create:**
```
src/shops/
├── dto/
│   ├── create-shop.dto.ts
│   ├── create-product.dto.ts
│   └── create-order.dto.ts
├── shops.service.ts
├── shops.controller.ts
└── shops.module.ts
```

**Key Features:**
- Shop registration
- Product management
- Order processing
- Inventory tracking
- Shop verification

**Endpoints (8):**
```typescript
POST   /api/shops                  // Register shop
GET    /api/shops                  // List shops (Public)
GET    /api/shops/:id              // Shop details
POST   /api/shops/:id/products     // Add product
GET    /api/shops/:id/products     // List products
POST   /api/shops/orders           // Create order
GET    /api/shops/orders           // List orders
PATCH  /api/shops/orders/:id       // Update order status
```

---

## 📋 **PHASE 6: ANALYTICS & POLISH (8 Modules)**

### **8. Analytics Module**

**Files to Create:**
```
src/analytics/
├── analytics.service.ts
├── analytics.controller.ts
└── analytics.module.ts
```

**Key Features:**
- Platform statistics
- Revenue analytics
- User growth metrics
- Job completion rates
- Real-time dashboards

**Endpoints (3):**
```typescript
GET    /api/analytics/platform     // Platform-wide stats (Admin)
GET    /api/analytics/company/:id  // Company analytics
GET    /api/analytics/revenue      // Revenue breakdown (Admin)
```

---

### **9. Notifications Module**

**Files to Create:**
```
src/notifications/
├── notifications.service.ts
├── notifications.controller.ts
├── notifications.module.ts
└── notifications.gateway.ts
```

**Key Features:**
- Push notifications (FCM)
- SMS notifications (Twilio)
- Email notifications (SendGrid)
- In-app notifications
- Real-time WebSocket notifications

**Endpoints (3):**
```typescript
GET    /api/notifications          // List notifications
PATCH  /api/notifications/:id/read // Mark as read
PATCH  /api/notifications/read-all // Mark all as read
```

**Integration:**
- Twilio for SMS
- SendGrid for email
- FCM for push notifications
- WebSocket for real-time

---

### **10. Files Module**

**Files to Create:**
```
src/files/
├── dto/
│   └── upload-file.dto.ts
├── files.service.ts
├── files.controller.ts
└── files.module.ts
```

**Key Features:**
- File upload to Cloudflare R2
- Image optimization
- File type validation
- Secure URLs
- File deletion

**Endpoints (3):**
```typescript
POST   /api/files/upload           // Upload file
GET    /api/files/:id              // Get file URL
DELETE /api/files/:id              // Delete file
```

**Integration:**
- Cloudflare R2 for storage
- Sharp for image optimization
- Multer for file upload

---

### **11-15. Additional Modules (Quick Reference)**

**11. Care Logs Module**
- Daily care activity logging
- Health vitals tracking
- Medication tracking
- Guardian review

**12. Feedback Module**
- Ratings & reviews
- Caregiver ratings
- Agency ratings
- Package ratings

**13. Audit Module**
- Activity logging
- Change tracking
- Admin actions
- Security events

**14. Health Records Module**
- Medical history
- Prescriptions
- Allergies
- Emergency contacts

**15. Service Zones Module**
- Geographic coverage
- Zone-based pricing
- Availability mapping
- Distance calculation

---

## 🚀 **IMPLEMENTATION PRIORITY**

### **Critical (Implement First):**
1. ✅ Lockout Module - Payment enforcement
2. ✅ Invoicing Module - Billing system
3. ✅ Jobs Module - Core workflow
4. ✅ Negotiations Module - Package customization

### **High Priority:**
5. Subscriptions Module
6. Notifications Module
7. Files Module

### **Medium Priority:**
8. Disputes Module
9. Shops Module
10. Analytics Module

### **Low Priority (Can defer):**
11. Care Logs Module
12. Feedback Module
13. Audit Module
14. Health Records Module
15. Service Zones Module

---

## 📝 **IMPLEMENTATION TEMPLATE**

For each module, follow this pattern:

### **1. Create DTOs**
```typescript
// create-[entity].dto.ts
export class Create[Entity]Dto {
  @IsString()
  field: string;
  // ... validation
}
```

### **2. Create Service**
```typescript
@Injectable()
export class [Entity]Service {
  constructor(private prisma: PrismaService) {}
  
  async create(dto) { /* ... */ }
  async findAll() { /* ... */ }
  async findOne(id) { /* ... */ }
  async update(id, dto) { /* ... */ }
  async remove(id) { /* ... */ }
}
```

### **3. Create Controller**
```typescript
@Controller('[entity]')
export class [Entity]Controller {
  constructor(private service: [Entity]Service) {}
  
  @Post()
  create(@Body() dto) { /* ... */ }
  
  @Get()
  findAll() { /* ... */ }
  // ... other endpoints
}
```

### **4. Create Module**
```typescript
@Module({
  imports: [CommonModule],
  controllers: [[Entity]Controller],
  providers: [[Entity]Service],
  exports: [[Entity]Service],
})
export class [Entity]Module {}
```

### **5. Add to AppModule**
```typescript
imports: [
  // ... existing modules
  [Entity]Module,
]
```

---

## 🎯 **ESTIMATED EFFORT**

- **Jobs Module:** 2-3 hours
- **Negotiations Module:** 1-2 hours
- **Invoicing Module:** 2-3 hours
- **Lockout Module:** 2-3 hours (includes cron jobs)
- **Subscriptions Module:** 1-2 hours
- **Disputes Module:** 1-2 hours
- **Shops Module:** 2-3 hours
- **Analytics Module:** 2-3 hours
- **Notifications Module:** 3-4 hours (multiple integrations)
- **Files Module:** 2-3 hours
- **Remaining 5 modules:** 1-2 hours each

**Total Estimated Time:** 25-35 hours for all remaining modules

---

## ✅ **CURRENT STATUS**

**Completed:** 10/25 modules (40%)  
**Remaining:** 15 modules (60%)  
**Next Steps:** Implement critical modules first (Lockout, Invoicing, Jobs, Negotiations)

---

This guide provides the complete blueprint for implementing all remaining modules!
