# CareNet Backend Development - Complete Implementation Plan

**Version:** 2.0 (Fresh Build)  
**Date:** December 2024  
**Status:** Planning  

---

## Executive Summary

This is a **complete greenfield backend implementation** for the CareNet caregiver marketplace platform. The plan covers **25 modules** supporting 10 user roles and 210+ frontend pages.

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | NestJS (TypeScript) |
| Database | PostgreSQL |
| ORM | Prisma |
| Cache/OTP | Redis |
| File Storage | Cloudflare R2 |
| Payments | bKash, Nagad APIs |
| Notifications | Twilio (SMS), SendGrid (Email), FCM (Push) |
| Real-time | WebSocket (Socket.io) |
| Auth | JWT + MFA (speakeasy) |
| Docs | Swagger/OpenAPI |

---

## User Roles (10 Total)

```prisma
enum UserRole {
  SUPER_ADMIN       // Supreme platform authority
  PLATFORM_ADMIN    // Platform operations
  MODERATOR         // First-line quality control
  AGENCY_ADMIN      // Agency owner/admin
  AGENCY_MANAGER    // Delegated QA role
  CAREGIVER         // Care providers
  GUARDIAN          // Family purchasing care
  PATIENT           // Care recipients
  SHOP_ADMIN        // Shop owner
  SHOP_MANAGER      // Shop operations
}
```

---

## Module Overview (25 Modules)

### Core (6 Modules)
| Module | Priority | Description |
|--------|----------|-------------|
| Auth | 🔴 Critical | Login, register, MFA, password reset, OTP |
| Users | 🔴 Critical | User profiles, role management |
| Common | 🔴 Critical | Prisma, guards, decorators, filters |
| Notifications | 🟠 High | SMS, email, push, in-app |
| Files | 🟠 High | R2 uploads, signed URLs |
| Audit | 🟡 Medium | Activity logging |

### Business Entities (5 Modules)
| Module | Priority | Description |
|--------|----------|-------------|
| Companies | 🔴 Critical | Agency profiles, service zones |
| Caregivers | 🔴 Critical | Caregiver profiles, availability |
| Patients | 🔴 Critical | Patient records, health data |
| Packages | 🔴 Critical | Care packages, pricing |
| Shops | 🟠 High | Shop profiles, products, orders |

### Workflow (8 Modules)
| Module | Priority | Description |
|--------|----------|-------------|
| Jobs | 🔴 Critical | Job creation, assignment, status |
| Care Logs | 🔴 Critical | Vitals, medications, activities |
| Verification | 🔴 Critical | 6-step caregiver, 2-step agency pipeline |
| Negotiations | 🔴 Critical | Package counter-offers |
| Moderator | 🔴 Critical | Two-tier approval queues |
| Payments | 🔴 Critical | bKash/Nagad, escrow |
| Invoicing | 🔴 Critical | 3-tier billing |
| Lockout | 🔴 Critical | 7-day payment enforcement |

### Support (4 Modules)
| Module | Priority | Description |
|--------|----------|-------------|
| Subscriptions | 🟠 High | Plans, billing cycles |
| Disputes | 🟠 High | Dispute resolution |
| Feedback | 🟡 Medium | Ratings, reviews |
| Analytics | 🟡 Medium | Reports, dashboards |

### Communication (2 Modules)
| Module | Priority | Description |
|--------|----------|-------------|
| Messages | 🟠 High | Chat, conversations |
| Messages Gateway | 🟠 High | WebSocket real-time |

---

## Database Schema

### Complete Prisma Schema (New Models)

<details>
<summary>Click to expand full schema additions</summary>

```prisma
// ========== NEW ENUMS ==========

enum InvoiceType {
  CAREGIVER_TO_AGENCY
  AGENCY_TO_GUARDIAN
  PLATFORM_SUBSCRIPTION
  PLATFORM_COMMISSION
}

enum InvoiceStatus {
  DRAFT
  SENT
  PENDING
  PAID
  OVERDUE
  DISPUTED
}

enum AccountLockReason {
  PAYMENT_OVERDUE
  MANUAL_ADMIN_LOCK
  VERIFICATION_FAILED
  TOS_VIOLATION
}

enum NegotiationStatus {
  PENDING_AGENCY_RESPONSE
  PENDING_GUARDIAN_DECISION
  ACCEPTED
  DECLINED
  COUNTER_OFFERED
}

enum VerificationStepType {
  CERTIFICATES
  POLICE_CLEARANCE
  INTERVIEW
  PSYCHOLOGICAL_ANALYSIS
  DOCUMENT_CHECK
  FINAL_APPROVAL
}

enum VerificationDecision {
  PENDING
  MODERATOR_APPROVED
  ADMIN_APPROVED
  SENT_BACK
  REJECTED
}

// ========== NEW MODELS ==========

model invoices {
  id               String        @id @default(cuid())
  invoice_number   String        @unique
  invoice_type     InvoiceType
  issuer_id        String
  recipient_id     String
  job_id           String?
  amount           Decimal
  commission_fee   Decimal?
  subscription_id  String?
  description      String?
  due_date         DateTime
  status           InvoiceStatus @default(SENT)
  paid_at          DateTime?
  payment_method   PaymentMethod?
  transaction_id   String?
  reminder_sent    Json?         // {day3: bool, day5: bool, day6: bool}
  locked_at        DateTime?
  created_at       DateTime      @default(now())
  updated_at       DateTime      @updatedAt

  @@index([recipient_id, status])
  @@index([due_date, status])
}

model account_lockouts {
  id                    String           @id @default(cuid())
  user_id               String
  reason                AccountLockReason
  triggering_invoice_id String?
  locked_features       Json
  active_features       Json
  locked_at             DateTime
  unlocked_at           DateTime?
  unlocked_by           String?
  unlock_reason         String?
  is_active             Boolean          @default(true)
  created_at            DateTime         @default(now())

  @@index([user_id, is_active])
}

model package_negotiations {
  id                    String              @id @default(cuid())
  package_id            String
  guardian_id           String
  original_price        Decimal
  proposed_price        Decimal?
  proposed_changes      Json?
  guardian_message      String?
  agency_response       String?
  counter_price         Decimal?
  additional_services   Json?
  status                NegotiationStatus   @default(PENDING_AGENCY_RESPONSE)
  round_number          Int                 @default(1)
  parent_id             String?
  expires_at            DateTime
  created_at            DateTime            @default(now())
  updated_at            DateTime            @updatedAt

  @@index([guardian_id, status])
  @@index([package_id])
}

model subscriptions {
  id                   String           @id @default(cuid())
  user_id              String
  plan_type            String
  tier                 SubscriptionTier
  price                Decimal
  billing_cycle        String           // MONTHLY, YEARLY
  current_period_start DateTime
  current_period_end   DateTime
  is_active            Boolean          @default(true)
  auto_renew           Boolean          @default(true)
  cancelled_at         DateTime?
  created_at           DateTime         @default(now())
  updated_at           DateTime         @updatedAt

  @@index([user_id, is_active])
}

model verification_steps {
  id                 String                @id @default(cuid())
  user_id            String
  step_type          VerificationStepType
  step_order         Int
  document_urls      Json?
  moderator_id       String?
  moderator_notes    String?
  moderator_decision DateTime?
  admin_id           String?
  admin_notes        String?
  admin_decision     VerificationDecision  @default(PENDING)
  admin_decided_at   DateTime?
  resubmit_reason    String?
  created_at         DateTime              @default(now())
  updated_at         DateTime              @updatedAt

  @@unique([user_id, step_type])
  @@index([admin_decision])
}

model conversations {
  id              String    @id @default(cuid())
  participant_ids Json
  type            String    // DIRECT, SUPPORT, GROUP
  last_message_at DateTime?
  created_at      DateTime  @default(now())

  @@index([last_message_at])
}

model messages {
  id              String    @id @default(cuid())
  conversation_id String
  sender_id       String
  content         String
  attachment_urls Json?
  is_read         Boolean   @default(false)
  read_at         DateTime?
  created_at      DateTime  @default(now())

  @@index([conversation_id, created_at])
}

model shops {
  id          String   @id @default(cuid())
  user_id     String   @unique
  shop_name   String
  description String?
  logo_url    String?
  address     String
  is_verified Boolean  @default(false)
  is_active   Boolean  @default(true)
  rating_avg  Decimal  @default(0.0)
  rating_count Int     @default(0)
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
}

model products {
  id             String   @id @default(cuid())
  shop_id        String
  name           String
  description    String
  category       String
  price          Decimal
  stock_quantity Int
  image_urls     Json?
  is_active      Boolean  @default(true)
  created_at     DateTime @default(now())
  updated_at     DateTime @updatedAt

  @@index([shop_id, is_active])
}

model orders {
  id               String   @id @default(cuid())
  shop_id          String
  customer_id      String
  items            Json
  total_amount     Decimal
  status           String   // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  shipping_address String
  tracking_number  String?
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt

  @@index([shop_id, status])
}
```

</details>

---

## Implementation Phases

### Phase 0: Project Scaffolding (3 days)

**Deliverables:**
- [ ] Fresh NestJS project with TypeScript strict mode
- [ ] Prisma setup with complete schema (existing + new models)
- [ ] Redis connection module
- [ ] Environment configuration (.env template)
- [ ] ESLint + Prettier configuration
- [ ] Jest test setup

**Commands:**
```bash
nest new backend --strict
cd backend
npm install @prisma/client prisma @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs ioredis
npx prisma init
```

---

### Phase 1: Core Infrastructure (Week 1-2)

#### Auth Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | Public | Phone + password registration |
| `/auth/verify-otp` | POST | Public | OTP verification |
| `/auth/login` | POST | Public | Login (returns JWT) |
| `/auth/mfa/setup` | POST | User | Setup MFA |
| `/auth/mfa/verify` | POST | Public | Verify MFA during login |
| `/auth/password-reset/*` | POST | Public | 3-step password reset |
| `/auth/refresh` | POST | Public | Refresh token |
| `/auth/logout` | POST | User | Logout |

#### Users Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/users` | GET | Admin | List all users |
| `/users/:id` | GET | User | Get user profile |
| `/users/me` | GET | User | Get own profile |
| `/users/me` | PATCH | User | Update own profile |
| `/users/:id/status` | PATCH | Admin | Activate/deactivate |

#### Common Module
- `PrismaService` - Database connection
- `JwtAuthGuard` - Authentication guard
- `RolesGuard` - Role-based access
- `FeatureAccessGuard` - Lockout check (NEW)
- `@CurrentUser()` decorator
- `@Roles()` decorator
- `@Public()` decorator
- HTTP exception filter
- Prisma exception filter
- Logging interceptor

---

### Phase 2: Business Entities (Week 3-4)

#### Companies Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/companies` | POST | Agency | Create company |
| `/companies` | GET | Public | List (filters) |
| `/companies/:id` | GET | Public | Details |
| `/companies/:id` | PATCH | Agency | Update |
| `/companies/:id/caregivers` | GET | Agency | Roster |
| `/companies/:id/packages` | GET | Public | Packages |

#### Caregivers Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/caregivers` | POST | Caregiver | Create profile |
| `/caregivers` | GET | Agency/Admin | List/search pool |
| `/caregivers/:id` | GET | Public | Profile |
| `/caregivers/:id/availability` | PATCH | Caregiver | Update availability |
| `/caregivers/:id/jobs` | GET | Caregiver | My jobs |
| `/caregivers/:id/earnings` | GET | Caregiver | Earnings summary |

#### Patients Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/patients` | POST | Guardian | Add patient |
| `/patients` | GET | Guardian | My patients |
| `/patients/:id` | GET | Guardian | Details |
| `/patients/:id` | PATCH | Guardian | Update |
| `/patients/:id/health-records` | POST | Guardian | Add record |
| `/patients/:id/care-history` | GET | Guardian | Care logs |

#### Packages Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/packages` | POST | Agency | Create package |
| `/packages` | GET | Public | Browse packages |
| `/packages/:id` | GET | Public | Details |
| `/packages/:id` | PATCH | Agency | Update |
| `/packages/:id/negotiate` | POST | Guardian | Counter-offer |

---

### Phase 3: Critical Workflows (Week 5-7)

#### Verification Module (Two-Tier)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/verification/status` | GET | User | My verification status |
| `/verification/submit/:step` | POST | User | Submit documents |
| `/verification/queue` | GET | Moderator | Pending items |
| `/verification/:id/review` | POST | Moderator | Submit to admin |
| `/verification/admin-queue` | GET | Admin | Awaiting decision |
| `/verification/:id/decision` | POST | Admin | Approve/Reject/SendBack |

#### Jobs Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/jobs` | POST | System | Create from purchase |
| `/jobs` | GET | Filtered | List jobs |
| `/jobs/inbox` | GET | Agency | Awaiting assignment |
| `/jobs/:id/assign` | POST | Agency | Assign caregiver |
| `/jobs/:id/accept` | POST | Caregiver | Accept job |
| `/jobs/:id/decline` | POST | Caregiver | Decline job |
| `/jobs/:id/check-in` | POST | Caregiver | GPS check-in |
| `/jobs/:id/check-out` | POST | Caregiver | Check-out |

#### Negotiations Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/negotiations` | GET | Filtered | My negotiations |
| `/negotiations/:id` | GET | User | Details |
| `/negotiations/:id/respond` | PATCH | Agency | Counter-offer response |
| `/negotiations/:id/decision` | PATCH | Guardian | Accept/Counter/Decline |

#### Invoicing Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/invoices` | POST | User | Create invoice |
| `/invoices` | GET | User | My invoices |
| `/invoices/:id` | GET | User | Details |
| `/invoices/:id/pdf` | GET | User | Download PDF |
| `/invoices/:id/pay` | PATCH | User | Mark paid |

#### Lockout Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/lockout/status` | GET | User | My lockout status |
| `/lockout/accounts` | GET | Admin | All locked accounts |
| `/lockout/:id/grace-period` | POST | Admin | Grant extension |
| `/lockout/:id/unlock` | POST | Admin | Manual unlock |

**Cron Jobs:**
- Every hour: Check Day 7 invoices → Lock accounts
- Daily 9 AM: Send Day 3, 5, 6 reminders

---

### Phase 4: Payments & Communication (Week 8-9)

#### Payments Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/payments` | POST | User | Initiate payment |
| `/payments/:id/initiate` | POST | User | Get gateway URL |
| `/payments` | GET | User | Payment history |
| `/payments/:id/refund` | POST | Admin | Process refund |
| `/payments/webhooks/bkash` | POST | Public | bKash webhook |
| `/payments/webhooks/nagad` | POST | Public | Nagad webhook |

#### Messages Module (REST + WebSocket)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/conversations` | GET | User | My conversations |
| `/conversations` | POST | User | Start conversation |
| `/conversations/:id/messages` | GET | User | Message history |
| `/conversations/:id/messages` | POST | User | Send message |

**WebSocket Events:**
- `message:new` - Real-time message
- `message:read` - Read receipt
- `user:typing` - Typing indicator

---

### Phase 5: Support Modules (Week 10-11)

#### Subscriptions Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/subscriptions/plans` | GET | Public | Available plans |
| `/subscriptions/current` | GET | User | My subscription |
| `/subscriptions` | POST | User | Subscribe |
| `/subscriptions/:id/cancel` | PATCH | User | Cancel |

#### Disputes Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/disputes` | POST | User | Create dispute |
| `/disputes` | GET | Filtered | List disputes |
| `/disputes/:id/evidence` | POST | User | Add evidence |
| `/disputes/:id/resolve` | PATCH | Moderator | Submit resolution |
| `/disputes/:id/decision` | POST | Admin | Final decision |

#### Shops Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/shops` | POST | Shop | Register shop |
| `/shops/:id/products` | GET/POST | Shop | Product CRUD |
| `/orders` | POST | Customer | Create order |
| `/orders/:id/status` | PATCH | Shop | Update status |

---

### Phase 6: Analytics & Polish (Week 12)

#### Analytics Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/analytics/dashboard` | GET | Admin | Platform stats |
| `/analytics/company/:id` | GET | Agency | Company stats |
| `/analytics/revenue` | GET | Admin | Revenue report |

#### Care Logs Module
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/care-logs` | POST | Caregiver | Create log |
| `/care-logs/:id/vitals` | POST | Caregiver | Add vitals |
| `/care-logs/:id/medication` | POST | Caregiver | Log medication |
| `/care-logs/:id/incident` | POST | Caregiver | Log incident |

---

## Key Business Rules

### 7-Day Payment Lockout
```
Day 0: Invoice generated
Day 3: First reminder (Email + SMS + Push)
Day 5: Second warning
Day 6: Final warning (24 hours)
Day 7: ACCOUNT LOCKED
Payment: Auto-unlock within 1 hour
```

### Two-Tier Authority
```
ALL verifications, disputes, tickets require:
1. Moderator reviews → Recommends
2. Admin decides: Approve | Send Back | Reject
```

### Package Negotiation (48-hour timeout)
```
Guardian sends counter-offer → 
Agency responds (Discount/Add Services/Decline) →
Guardian accepts/counters again →
On Accept: Package → Job (auto-converted)
```

### Caregiver Verification (6 Steps)
```
1. Certificates → Mod + Admin
2. Police Clearance → Mod + Admin
3. Interview → Mod + Admin
4. Psychological Test → Mod + Admin
5. Document Check → Mod + Admin
6. Final Approval → Admin ONLY
```

---

## Testing Strategy

### Unit Tests (80% coverage target)
```bash
npm run test           # All unit tests
npm run test:cov       # With coverage
npm run test -- auth   # Specific module
```

### Integration Tests
```bash
npm run test:e2e                    # All E2E
npm run test:e2e -- lockout         # Lockout flow
npm run test:e2e -- negotiation     # Negotiation flow
```

### Critical Test Scenarios
1. **Lockout Flow**: Invoice → Day 7 → Lock → Pay → Unlock
2. **Negotiation**: Counter-offer → Response → Accept → Job created
3. **Verification**: 6-step pipeline with Mod + Admin approval
4. **Job Deployment**: Package → Job → Assign → Accept → Check-in

---

## Timeline Summary

| Phase | Duration | Focus |
|-------|----------|-------|
| 0 | 3 days | Project scaffolding, Prisma schema |
| 1 | 2 weeks | Auth, Users, Common |
| 2 | 2 weeks | Companies, Caregivers, Patients, Packages |
| 3 | 3 weeks | Verification, Jobs, Negotiations, Invoicing, Lockout |
| 4 | 2 weeks | Payments, Messages (WebSocket) |
| 5 | 2 weeks | Subscriptions, Disputes, Shops |
| 6 | 1 week | Analytics, Care Logs, Polish |

**Total: ~12 weeks**

---

## Success Criteria

- [ ] 25 modules implemented
- [ ] 100+ API endpoints functional
- [ ] 7-day lockout working
- [ ] 3-tier billing operational
- [ ] 6-step verification functional
- [ ] WebSocket messaging working
- [ ] 80%+ test coverage
- [ ] Swagger documentation complete
