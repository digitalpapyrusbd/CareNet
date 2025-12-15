# AI Agent Complete Development Guide
## Caregiver Digital Solution for Bangladesh

**Version:** 2.0 (Updated for Backend Migration)  
**Architecture:** Separated Frontend (Next.js) + Backend (NestJS)  
**Target:** Phase 1 MVP in 12 weeks  
**Last Updated:** January 2025

---

## 🎯 MISSION STATEMENT FOR AI CODING AGENT

You are an autonomous AI coding agent building a **complete caregiver digital solution** for the Bangladesh market. Your goal is to deliver a **production-ready platform** that connects families with verified caregivers through a secure, scalable, and compliant system.

### **Current Architecture Decision:**
✅ **TRANSITIONING TO SEPARATED BACKEND**
- Frontend: Next.js 15 (Vercel)
- Backend: NestJS (Render)
- Database: PostgreSQL (Neon)

**Why this change?**
- Bangladesh payment requirements need background jobs (escrow auto-release, reconciliation)
- Serverless limitations (10s timeout) won't support long-running tasks
- Traditional backend easier for complex payment workflows
- Better prepared for Phase 2 features (cron jobs, WebSockets)

---

## 📚 REFERENCE DOCUMENTS

### **Core Documents (Read These First):**
1. **01_PRD_CaregiverSolution.md** - Business requirements, user roles, success metrics
2. **02_Technical_Architecture.md** - System design, tech stack, deployment strategy
3. **03_Data_Model.md** - Complete database schema (20+ entities)
4. **04_UX_Flow_&_Screens.md** - User workflows, design system
5. **05_File_Architecture.md** - Project structure (frontend + backend)
6. **06_Compliance_&_Metrics.md** - Legal requirements, KPIs

### **When to Reference Each Document:**

| Task Type | Primary Document | Secondary Documents |
|-----------|-----------------|---------------------|
| **Database Schema** | 03_Data_Model.md | 02_Technical_Architecture.md |
| **API Endpoints** | 02_Technical_Architecture.md | 03_Data_Model.md |
| **Frontend Pages** | 04_UX_Flow_&_Screens.md | 05_File_Architecture.md |
| **Authentication** | 02_Technical_Architecture.md | 01_PRD_CaregiverSolution.md |
| **Payment Integration** | 02_Technical_Architecture.md | 03_Data_Model.md |
| **User Roles** | 01_PRD_CaregiverSolution.md | 03_Data_Model.md |
| **File Structure** | 05_File_Architecture.md | All documents |
| **Compliance** | 06_Compliance_&_Metrics.md | 02_Technical_Architecture.md |

---

## 🗂️ PROJECT FILE STRUCTURE

### **Current Monorepo Structure:**
```
/caregiver-platform/
├── /frontend/              # Next.js 15 (Port 3000)
│   ├── /src/
│   │   ├── /app/           # Pages (NO /api folder anymore)
│   │   ├── /components/    # React components
│   │   ├── /lib/           
│   │   │   └── api-client.ts  # NEW: Calls backend API
│   │   └── /hooks/
│   ├── .env.local
│   └── package.json
│
├── /backend/               # NestJS (Port 4000) - TO BE CREATED
│   ├── /src/
│   │   ├── /auth/          # JWT, login, register
│   │   ├── /users/         # User CRUD
│   │   ├── /companies/     # Company management
│   │   ├── /caregivers/    # Caregiver operations
│   │   ├── /patients/      # Patient records
│   │   ├── /jobs/          # Job assignments
│   │   ├── /payments/      # Payment processing
│   │   │   ├── /providers/
│   │   │   │   ├── bkash.service.ts
│   │   │   │   └── nagad.service.ts
│   │   │   └── /escrow/
│   │   └── /common/
│   │       └── /prisma/    # Database service
│   ├── /prisma/
│   │   └── schema.prisma   # MOVE HERE from frontend
│   ├── .env
│   └── package.json
│
├── /docs/                  # All reference documents
└── README.md
```

---

## 🚀 MIGRATION INSTRUCTIONS (CRITICAL - DO THIS FIRST)

### **Phase 0: Backend Separation (Week 7 - Before Continuing)**

**Estimated Time:** 12-14 hours  
**Priority:** CRITICAL - Must complete before Phase 5 continues

#### **Step 0.1: Create NestJS Backend (2 hours)**

**Action:** Create new NestJS project
```bash
cd /caregiver-platform
npx @nestjs/cli new backend
cd backend
```

**Install Dependencies:**
```bash
npm install @prisma/client prisma bcryptjs jsonwebtoken
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install class-validator class-transformer zod
npm install @upstash/ratelimit @upstash/redis
npm install -D @types/bcryptjs @types/jsonwebtoken @types/passport-jwt
```

**Reference:** 05_File_Architecture.md (Backend Structure section)

---

#### **Step 0.2: Move Prisma Schema (30 minutes)**

**Action:** Move database schema to backend
```bash
# From frontend root
cp -r prisma ../backend/
cp .env ../backend/
cd ../backend
npx prisma generate
```

**Update:** All Prisma imports in backend code should work automatically

**Reference:** 03_Data_Model.md (complete schema)

---

#### **Step 0.3: Create Prisma Service (30 minutes)**

**File:** `backend/src/common/prisma/prisma.service.ts`

**Purpose:** Singleton database connection for all modules

**Code Pattern:**
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

**File:** `backend/src/common/prisma/prisma.module.ts`

**Code Pattern:**
```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**Add to:** `backend/src/app.module.ts` imports

**Reference:** 02_Technical_Architecture.md (Backend Architecture section)

---

#### **Step 0.4: Migrate Authentication Module (3 hours)**

**Create Files:**
- `backend/src/auth/auth.module.ts`
- `backend/src/auth/auth.controller.ts`
- `backend/src/auth/auth.service.ts`
- `backend/src/auth/strategies/jwt.strategy.ts`
- `backend/src/auth/guards/jwt-auth.guard.ts`
- `backend/src/auth/guards/roles.guard.ts`

**Copy Logic From Frontend:**
- `frontend/src/lib/auth/jwt.ts` → `auth.service.ts`
- `frontend/src/lib/auth/password.ts` → `auth.service.ts`
- `frontend/src/lib/auth/middleware.ts` → `jwt.strategy.ts`

**Endpoints to Create:**
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refresh`
- `POST /auth/verify-otp`

**Reference:** 02_Technical_Architecture.md (Authentication & Authorization section)

---

#### **Step 0.5: Migrate Payment Module (2 hours)**

**Create Files:**
- `backend/src/payments/payments.module.ts`
- `backend/src/payments/payments.controller.ts`
- `backend/src/payments/payments.service.ts`
- `backend/src/payments/providers/bkash.service.ts`
- `backend/src/payments/providers/nagad.service.ts`
- `backend/src/payments/escrow/escrow.service.ts`

**Copy Files From Frontend:**
- `frontend/src/lib/payments/bkash.ts` → `bkash.service.ts`
- `frontend/src/lib/payments/nagad.ts` → `nagad.service.ts`
- `frontend/src/lib/payments/escrow.ts` → `escrow.service.ts`

**Update to NestJS Pattern:**
- Add `@Injectable()` decorator
- Inject `PrismaService` via constructor
- Use dependency injection (no direct imports)

**Endpoints to Migrate:**
- `POST /payments/create`
- `GET /payments/bkash/callback`
- `GET /payments/nagad/callback`
- `POST /payments/refund`

**Reference:** 02_Technical_Architecture.md (Payment Gateway Integration section)

---

#### **Step 0.6: Configure CORS (15 minutes)**

**File:** `backend/src/main.ts`

**Code:**
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  });
  
  await app.listen(4000);
}
```

**Reference:** 02_Technical_Architecture.md (CORS Configuration section)

---

#### **Step 0.7: Create Frontend API Client (1 hour)**

**File:** `frontend/src/lib/api-client.ts`

**Code:**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiCall(endpoint: string, options?: RequestInit) {
  const token = getAuthToken(); // from localStorage
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new APIError(await response.json());
  }
  
  return response.json();
}
```

**Update All Frontend API Calls:**
- Find: `fetch('/api/users')`
- Replace: `apiCall('/users')`

**Reference:** 05_File_Architecture.md (Frontend Structure section)

---

#### **Step 0.8: Environment Variables (15 minutes)**

**Backend `.env`:**
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
BKASH_BASE_URL="https://checkout.sandbox.bka.sh/v1.2.0-beta"
BKASH_APP_KEY="..."
BKASH_WEBHOOK_SECRET="..."
FRONTEND_URL="http://localhost:3000"
PORT=4000
```

**Frontend `.env.local`:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Reference:** 05_File_Architecture.md (Environment Variables section)

---

#### **Step 0.9: Test Migration (1 hour)**

**Start Both Services:**
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Test Checklist:**
- [ ] Frontend loads at localhost:3000
- [ ] Backend health check at localhost:4000/health
- [ ] Login flow works end-to-end
- [ ] Payment checkout creates transaction
- [ ] CORS allows frontend → backend calls

---

#### **Step 0.10: Deploy Both Services (2 hours)**

**Backend to Render:**
1. Create Render account
2. New Web Service → Connect GitHub
3. Build: `npm install && npx prisma generate`
4. Start: `npm run start:prod`
5. Add environment variables

**Frontend to Vercel:**
1. Connect Vercel to GitHub
2. Add `NEXT_PUBLIC_API_URL` = Render backend URL
3. Deploy automatically

**Reference:** 02_Technical_Architecture.md (Deployment section)

---

## 📋 PHASE-BY-PHASE DEVELOPMENT GUIDE

---

### **PHASE 1: DATABASE & INFRASTRUCTURE** ✅ ~52% Complete

**Reference Document:** 03_Data_Model.md  
**Estimated Time:** 40 hours total (20 hours remaining)  
**Current Status:** Core entities done, supporting entities pending

#### **Remaining Tasks:**

**DB-014: Create CareLog Entity (2 hours)**
- **File:** `backend/prisma/schema.prisma`
- **Reference:** 03_Data_Model.md (CareLog section, page 15)
- **Fields:** id, jobId, caregiverId, patientId, logType, timestamp, location, data, notes, photoUrls
- **Relations:** Links to Job, Caregiver, Patient
- **After:** Run `npx prisma migrate dev --name add_care_logs`

**DB-015: Create Feedback Entity (1.5 hours)**
- **File:** `backend/prisma/schema.prisma`
- **Reference:** 03_Data_Model.md (Feedback section, page 16)
- **Fields:** id, jobId, reviewerId, revieweeId, revieweeType, rating, tags, comments
- **Constraint:** Unique (jobId, reviewerId, revieweeId)
- **After:** Run migration

**DB-016: Create AuditLog Entity (1 hour)**
- **File:** `backend/prisma/schema.prisma`
- **Reference:** 03_Data_Model.md (AuditLog section, page 17)
- **Fields:** id, actorId, actionType, entityType, entityId, changes, ipAddress, timestamp
- **Index:** On actorId, entityType, timestamp
- **After:** Run migration

**DB-017: Create Notification Entity (1 hour)**
- **File:** `backend/prisma/schema.prisma`
- **Reference:** 03_Data_Model.md (Notification section, page 17)
- **Fields:** id, userId, type, channel, title, body, status, sentAt, readAt
- **After:** Run migration

**DB-018: Create ServiceZone Entity (1 hour)**
- **File:** `backend/prisma/schema.prisma`
- **Reference:** 03_Data_Model.md (ServiceZone section, page 18)
- **Purpose:** Define company service areas (Gulshan, Dhanmondi, etc.)
- **After:** Run migration

**DB-019: Create Dispute Entity (1.5 hours)**
- **File:** `backend/prisma/schema.prisma`
- **Reference:** 03_Data_Model.md (Dispute section, page 18)
- **Fields:** id, jobId, raisedBy, against, disputeType, status, resolution
- **After:** Run migration

**DB-020: Add Database Indexes (2 hours)**
- **File:** `backend/prisma/schema.prisma`
- **Reference:** 03_Data_Model.md (Indexes section throughout)
- **Critical Indexes:**
  - `@@index([jobId])` on care_logs, assignments, payments
  - `@@index([userId])` on notifications, audit_logs
  - `@@index([status])` on jobs, payments, disputes
  - `@@index([location])` on caregivers (for proximity search)

**DB-021: Set Up Database Seeding (3 hours)**
- **File:** `backend/prisma/seed.ts`
- **Reference:** 03_Data_Model.md (Seed Data section)
- **Create:**
  - 1 Super Admin user
  - 2 Moderators
  - 5 Companies (verified)
  - 20 Caregivers (10 verified)
  - 10 Guardians with 15 Patients
  - 10 Packages
  - 5 Active Jobs
- **Run:** `npx prisma db seed`

**DB-022: Test Database Relationships (2 hours)**
- **Create Test Script:** `backend/test/database.spec.ts`
- **Test:**
  - User → Company relationship
  - Company → Caregiver relationship
  - Job → Assignment → Caregiver chain
  - Payment → EscrowRecord relationship
  - Soft delete functionality

---

### **PHASE 2: AUTHENTICATION & AUTHORIZATION** ✅ 100% Complete

**Status:** Migrated to NestJS backend during Step 0.4
**No additional work needed** - Move to Phase 3

---

### **PHASE 3: API DEVELOPMENT** 🚧 ~90% Complete

**Reference Document:** 02_Technical_Architecture.md (Backend Architecture section)  
**Current Status:** Core CRUD done, admin APIs and care logs pending

#### **Remaining Tasks:**

**API-008: Care Log Endpoints (3 hours)**
- **Create Module:** `backend/src/care-logs/`
- **Files:**
  - `care-logs.module.ts`
  - `care-logs.controller.ts`
  - `care-logs.service.ts`
  - `dto/create-care-log.dto.ts`
- **Endpoints:**
  - `POST /care-logs` - Create log (caregiver only)
  - `GET /care-logs/job/:jobId` - Get logs for job (guardian, company)
  - `GET /care-logs/:id` - Get single log
  - `PATCH /care-logs/:id` - Update log (caregiver, within 1 hour)
- **Validation:**
  - GPS coordinates required for check-in/check-out
  - Photo URLs optional but validated if provided
  - Log type: check_in, vitals, medication, meal, activity, incident, check_out
- **Reference:** 03_Data_Model.md (CareLog section)

**API-009: Feedback/Rating Endpoints (2.5 hours)**
- **Create Module:** `backend/src/feedback/`
- **Endpoints:**
  - `POST /feedback` - Create rating (guardian rates caregiver, caregiver rates guardian)
  - `GET /feedback/user/:userId` - Get user's ratings
  - `GET /feedback/job/:jobId` - Get job's ratings
  - `PATCH /feedback/:id` - Company responds to feedback
- **Business Rules:**
  - Can only rate after job completion
  - One rating per reviewer-reviewee pair per job
  - Rating must be 1-5 stars
  - Auto-update aggregate ratings on User/Caregiver/Company
- **Reference:** 03_Data_Model.md (Feedback section)

**API-010: Notification Endpoints (2 hours)**
- **Create Module:** `backend/src/notifications/`
- **Endpoints:**
  - `GET /notifications` - Get user's notifications
  - `PATCH /notifications/:id/read` - Mark as read
  - `DELETE /notifications/:id` - Delete notification
- **Internal Service Methods:**
  - `sendSMS(phone, message)` - Twilio integration
  - `sendEmail(email, subject, body)` - SendGrid integration
  - `sendPush(userId, title, body)` - Web Push API
- **Reference:** 02_Technical_Architecture.md (Notification Services)

**API-013: Dispute Management Endpoints (3 hours)**
- **Add to:** `backend/src/admin/` module
- **Endpoints:**
  - `POST /disputes` - Guardian/Caregiver files dispute
  - `GET /disputes` - Moderator views all disputes
  - `GET /disputes/:id` - View dispute details
  - `PATCH /disputes/:id/assign` - Assign moderator
  - `PATCH /disputes/:id/resolve` - Moderator resolves
- **Business Logic:**
  - Freeze escrow on dispute filed
  - Track resolution actions (refund, warning, suspend, no action)
  - Notify all parties on resolution
- **Reference:** 03_Data_Model.md (Dispute section)

**API-015: Platform Analytics Endpoints (2.5 hours)**
- **Add to:** `backend/src/admin/` module
- **Endpoints:**
  - `GET /analytics/overview` - Super admin dashboard stats
  - `GET /analytics/users` - User growth metrics
  - `GET /analytics/revenue` - Transaction metrics
  - `GET /analytics/caregivers` - Caregiver performance
  - `GET /analytics/companies` - Company performance
- **Metrics:**
  - Total users, companies, caregivers, patients
  - Monthly transaction volume
  - Average job completion time
  - Top-rated caregivers/companies
- **Cache:** Redis cache for 5 minutes

---

### **PHASE 4: FRONTEND DEVELOPMENT** ✅ 100% Complete

**Status:** All pages and components created
**Action Required:** Update API calls to use new backend
- Find all `fetch('/api/...')` calls
- Replace with `apiCall('/...')` using api-client.ts
- Test all user flows end-to-end

---

### **PHASE 5: INTEGRATIONS** 🚧 ~85% Complete

**Reference Document:** 02_Technical_Architecture.md (Integration Strategy section)

#### **Current Task: Rate Limiting (INT-007)**

**Estimated Time:** 1.5 hours  
**Priority:** HIGH - Protects against abuse

**Implementation Steps:**

1. **Install Upstash Ratelimit (15 min)**
```bash
cd backend
npm install @upstash/ratelimit @upstash/redis
```

2. **Create Rate Limit Guard (30 min)**
- **File:** `backend/src/common/guards/throttle.guard.ts`
- **Logic:**
  - Use Upstash Redis for distributed rate limiting
  - Sliding window algorithm (100 requests per minute per user)
  - Different limits for different endpoints:
    - Auth: 5 requests/min (prevent brute force)
    - Payments: 10 requests/min
    - General: 100 requests/min
    - Webhooks: 1000 requests/min (per IP)

**Code Pattern:**
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
});

// In guard
const identifier = user?.id || request.ip;
const { success, remaining } = await ratelimit.limit(identifier);

if (!success) {
  throw new ThrottlerException('Too many requests');
}
```

3. **Apply to Controllers (30 min)**
- Add `@UseGuards(ThrottleGuard)` to:
  - `auth.controller.ts` (5 req/min)
  - `payments.controller.ts` (10 req/min)
  - All other controllers (100 req/min)

4. **Test Rate Limiting (15 min)**
- Use Postman/curl to send 101 requests rapidly
- Verify 101st request returns 429 Too Many Requests
- Verify rate limit resets after 1 minute

**Reference:** 02_Technical_Architecture.md (Rate Limiting section)

---

#### **Next Task: Nagad Webhook (INT-006)**

**Estimated Time:** 30 minutes  
**Priority:** MEDIUM - Completes payment integration

**Action:** Copy bKash webhook route pattern
- **File:** `backend/src/payments/webhooks/nagad-webhook.controller.ts`
- **Copy from:** `bkash-webhook.controller.ts`
- **Change:**
  - Signature verification algorithm (if different)
  - Callback URL: `/payments/nagad/callback`
  - Parse Nagad-specific response format
- **Test:** Use Nagad sandbox (requires credentials)

**Reference:** 02_Technical_Architecture.md (Nagad Integration section)

---

#### **Remaining Integration Tasks:**

**INT-009: SMS Notifications (Twilio) - 2 hours**
- **Create Service:** `backend/src/notifications/providers/sms.service.ts`
- **Methods:**
  - `sendOTP(phone, code)`
  - `sendJobNotification(phone, message)`
  - `sendPaymentConfirmation(phone, amount)`
- **Configuration:**
  - Twilio Account SID, Auth Token from env
  - Bangladesh phone format validation
  - Rate limit: 5 SMS/hour per number
- **Reference:** 02_Technical_Architecture.md (Notification Integration)

**INT-010: Email Notifications (SendGrid) - 1.5 hours**
- **Create Service:** `backend/src/notifications/providers/email.service.ts`
- **Templates:**
  - Welcome email (with onboarding checklist)
  - Invoice email (PDF attachment)
  - Weekly care summary
- **Configuration:**
  - SendGrid API key from env
  - From email: noreply@caregiver-platform.com
  - Unsubscribe link for marketing emails

**INT-011: Push Notifications (Web Push) - 2 hours**
- **Create Service:** `backend/src/notifications/providers/push.service.ts`
- **Implementation:**
  - Use Web Push API (not FCM for PWA)
  - Store push subscriptions in database
  - Send notifications for: missed medication, job assignment, payment received
- **Frontend:** Add service worker to subscribe to push notifications

**INT-012: In-App Notifications - 1.5 hours**
- **Frontend Component:** `frontend/src/components/layout/NotificationBell.tsx`
- **Backend Endpoint:** Already created (API-010)
- **Features:**
  - Real-time notification count badge
  - Dropdown with recent notifications
  - Mark as read functionality
  - "View all" link to notifications page

**INT-013: Cloudflare R2 File Storage - 2.5 hours**
- **Create Module:** `backend/src/files/`
- **Service:** S3-compatible upload/download
- **Endpoints:**
  - `POST /files/upload` - Upload file (multipart/form-data)
  - `GET /files/:key` - Get signed URL
  - `DELETE /files/:key` - Delete file
- **File Types:**
  - Images: JPEG, PNG, WebP (max 5MB)
  - Documents: PDF (max 10MB)
- **Validation:** File type, size, virus scanning (optional)
- **Reference:** 02_Technical_Architecture.md (File Storage section)

**INT-014: Image Compression - 1 hour**
- **Use:** Sharp library
- **Auto-resize:** Profile photos to 400x400px
- **Auto-compress:** Quality 80%, WebP format
- **Generate Thumbnails:** 100x100px for lists

**INT-015: File Upload Endpoints - 1 hour**
- Already covered in INT-013, just document usage in API docs

---

### **PHASE 6: PROGRESSIVE WEB APP** ⏸️ 0% Complete

**Reference Document:** 04_UX_Flow_&_Screens.md (Mobile sections)  
**Estimated Time:** 12 hours total

**Why PWA Instead of React Native:**
- ✅ Faster development (no separate codebase)
- ✅ Instant updates (no app store delays)
- ✅ Works on all devices (Android, iOS, desktop)
- ✅ GPS, Camera, Push notifications all supported via browser APIs
- ❌ Tradeoff: Slightly slower than native (acceptable for MVP)

#### **PWA Tasks:**

**PWA-001: Create manifest.json (30 min)**
- **File:** `frontend/public/manifest.json`
- **Configuration:**
```json
{
  "name": "Caregiver Platform",
  "short_name": "Caregiver",
  "description": "Connect families with verified caregivers in Bangladesh",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0e0e0e",
  "theme_color": "#00AEEF",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```
- **Add to:** `frontend/src/app/layout.tsx` metadata

**PWA-002: Implement Service Worker (2 hours)**
- **File:** `frontend/public/sw.js`
- **Features:**
  - Cache static assets (CSS, JS, images)
  - Cache API responses (5-minute TTL)
  - Offline fallback page
  - Background sync for care logs (when back online)
- **Register:** In `frontend/src/app/layout.tsx`

**PWA-003: Mobile-Optimized Navigation (1.5 hours)**
- **File:** `frontend/src/components/mobile/BottomNav.tsx`
- **Features:**
  - Fixed bottom navigation (Home, Jobs, Earnings, Profile)
  - Active state highlighting
  - Haptic feedback on tap (if supported)
  - Show only on mobile breakpoint (<768px)
- **Add to:** Caregiver dashboard layout

**PWA-004 & PWA-005: Test Installation (1 hour)**
- **Android:**
  - Open Chrome → Menu → "Add to Home Screen"
  - Verify app opens in standalone mode
  - Test offline functionality
- **iOS:**
  - Open Safari → Share → "Add to Home Screen"
  - Verify app opens (limited PWA support on iOS)
  - Test basic functionality

**PWA-006: GPS-Based Check-In (2 hours)**
- **File:** `frontend/src/hooks/use-geolocation.ts`
- **API:** Browser Geolocation API
```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    // Send to backend
  },
  (error) => {
    // Handle error
  },
  { enableHighAccuracy: true, timeout: 15000 }
);
```
- **Component:** `frontend/src/components/mobile/GPSCheckIn.tsx`
- **Features:**
  - Show current location on map (optional)
  - Verify location within 100m of patient address
  - Send lat/lng to backend with care log

**PWA-007: Camera Capture (1.5 hours)**
- **File:** `frontend/src/hooks/use-camera.ts`
- **API:** MediaDevices API
```typescript
const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// Capture photo from video stream
```
- **Component:** `frontend/src/components/mobile/CameraCapture.tsx`
- **Features:**
  - Take photo for check-in verification
  - Compress image before upload (max 2MB)
  - Preview before sending
- **Use Cases:** Check-in selfie, incident photo, meal photo

**PWA-008: Touch-Friendly UI (2 hours)**
- **Update All Buttons:** Minimum 48x48px touch targets
- **Add Haptic Feedback:** On button clicks (if supported)
- **Improve Forms:** Larger inputs, better spacing
- **Test:** On real mobile devices (not just browser dev tools)

**PWA-009: Performance Optimization (1 hour)**
- **Run Lighthouse Audit:** Target >90 score
- **Optimize:**
  - Lazy load images
  - Code splitting for routes
  - Preload critical resources
- **Target:** <3s load time on 3G connection

**PWA-010: Offline Fallback (30 min)**
- **File:** `frontend/src/app/offline/page.tsx`
- **Features:**
  - Show when user is offline
  - Display cached data (if available)
  - "Retry" button to check connection
  - Queue actions for when back online
- **Service Worker:** Intercept failed network requests → Show offline page

**PWA-011 to PWA-015: Mobile Experience Optimization (3 hours)**
- **PWA-011:** Mobile job list (card view, swipe actions)
- **PWA-012:** Mobile check-in interface (large buttons, GPS map)
- **PWA-013:** Mobile care logging (quick vitals entry, voice notes optional)
- **PWA-014:** Mobile earnings (visual charts, export CSV)
- **PWA-015:** Pull-to-refresh (refresh job list, care logs)

---

### **PHASE 7: TESTING & QA** ⏸️ 0% Complete

**Reference Document:** 09_DEVELOPMENT_GUIDELINES.md (Testing section)  
**Estimated Time:** 20 hours total

#### **Backend Testing (10 hours):**

**TEST-001: Set Up Jest (1 hour)**
```bash
cd backend
npm install -D @nestjs/testing jest @types/jest ts-jest
```
- **File:** `backend/jest.config.js`
- **Configure:** Test environment, coverage thresholds (80%)

**TEST-002: Auth Service Unit Tests (2 hours)**
- **File:** `backend/src/auth/auth.service.spec.ts`
- **Test Cases:**
  - Login with valid credentials → Returns JWT tokens
  - Login with invalid credentials → Throws UnauthorizedException
  - Register with valid data → Creates user
  - Register with duplicate phone → Throws ConflictException
  - Refresh token → Returns new access token
  - MFA verification → Validates TOTP code

**TEST-003: Payment Service Unit Tests (2.5 hours)**
- **File:** `backend/src/payments/payments.service.spec.ts`
- **Test Cases:**
  - Create payment → Calls bKash API, stores in DB
  - Verify payment → Updates payment status
  - Release escrow → Marks escrow as released
  - Process refund → Calls gateway, updates DB
  - Handle webhook → Verifies signature, updates payment
- **Mock:** bKash/Nagad services, Prisma client

**TEST-004: API Integration Tests (3 hours)**
- **File:** `backend/test/app.e2e-spec.ts`
- **Test Flows:**
  - User registration → Login → Access protected route
  - Guardian creates patient → Creates job → Makes payment
  - Caregiver checks in → Logs vitals → Checks out
  - Company verifies caregiver → Assigns to job
  - Moderator approves company → Views analytics
- **Use:** Supertest library for HTTP testing

**TEST-005: E2E Critical Flows (1.5 hours)**
- **File:** `backend/test/payment-flow.e2e-spec.ts`
- **Test:** Complete payment flow (checkout → callback → escrow → release)
- **Use:** Test database, mock payment gateways

**TEST-006: Code Coverage (Target 80%) - Ongoing**
- Run: `npm run test:cov`
- Identify untested code paths
- Add tests until coverage >80%

#### **Frontend Testing (6 hours):**

**TEST-007: Set Up React Testing Library (30 min)**
```bash
cd frontend
npm install -D @testing-library/react @testing-library/jest-dom
```

**TEST-008: Component Tests (2.5 hours)**
- **Files:**
  - `frontend/src/components/forms/__tests__/PatientForm.test.tsx`
  - `frontend/src/components/cards/__tests__/JobCard.test.tsx`
  - `frontend/src/components/layout/__tests__/Header.test.tsx`
- **Test:**
  - Forms render correctly
  - Form validation works
  - Submit handlers called with correct data
  - Cards display data properly
  - Navigation links work

**TEST-009: User Flow Integration Tests (2 hours)**
- **File:** `frontend/src/__tests__/user-flows.test.tsx`
- **Test Flows:**
  - Login flow (enter phone → enter password → redirect to dashboard)
  - Patient registration (fill form → submit → see in patient list)
  - Package purchase (browse → select → checkout → payment)
- **Mock:** API calls using MSW (Mock Service Worker)

**TEST-010: Accessibility Testing (1 hour)**
- **Tool:** axe-core, WAVE browser extension
- **Test:**
  - All images have alt text
  - Forms have proper labels
  - Keyboard navigation works (Tab, Enter, Esc)
  - Color contrast meets WCAG 2.1 AA (4.5:1 minimum)
  - Screen reader compatibility

#### **Performance & Security (4 hours):**

**PERF-001: Database Query Optimization (1.5 hours)**
- **Tool:** Prisma query logging
- **Review:** Slow queries (>100ms)
- **Fix:**
  - Add missing indexes
  - Optimize N+1 queries (use `include` instead of separate queries)
  - Add pagination to large datasets

**PERF-002: Redis Caching (1 hour)**
- **Cache:**
  - User sessions (7 days)
  - API responses (public data, 5 min)
  - Analytics data (1 hour)
- **Implement:** Cache middleware in NestJS

**PERF-003: Frontend Bundle Optimization (1 hour)**
- **Run:** `npm run build` and analyze bundle size
- **Optimize:**
  - Code splitting (dynamic imports)
  - Remove unused dependencies
  - Tree shaking (ensure ESM imports)
- **Target:** <500KB initial bundle

**PERF-004: Lighthouse Audits (30 min)**
- **Run:** Lighthouse on all key pages
- **Target Scores:**
  - Performance: >90
  - Accessibility: 100
  - Best Practices: >90
  - SEO: >90

**SEC-001: Security Audit (1 hour)**
- **Check:**
  - SQL injection protection (Prisma handles this)
  - XSS protection (input sanitization)
  - CSRF tokens (SameSite cookies)
  - Sensitive data in logs (remove passwords, tokens)
  - Environment variables (no secrets in code)
- **Run:** `npm audit` and fix vulnerabilities

**SEC-002: Fix Vulnerabilities (Ongoing)**
- Update dependencies with known vulnerabilities
- Review and fix security issues from SEC-001

**SEC-003: Rate Limiting Complete (Already done in INT-007)**

---

### **PHASE 8: DEPLOYMENT & LAUNCH** ⏸️ 0% Complete

**Reference Document:** 02_Technical_Architecture.md (Deployment section)  
**Estimated Time:** 15 hours total

#### **Infrastructure Setup (3 hours):**

**DEP-001: Neon PostgreSQL Production (30 min)**
1. Create Neon account: https://neon.tech
2. Create production database
3. Copy connection string
4. Add to Render environment variables
5. **Important:** Use connection pooling URL (ends with `?pgbouncer=true`)

**DEP-002: Upstash Redis Production (30 min)**
1. Create Upstash account: https://upstash.com
2. Create Redis database (select closest region to Bangladesh)
3. Copy URL and token
4. Add to Render environment variables

**DEP-003: Cloudflare R2 Production (1 hour)**
1. Create Cloudflare account
2. Create R2 bucket: `caregiver-platform-files`
3. Generate API tokens (access key ID, secret access key)
4. Configure CORS for frontend domain
5. Add credentials to Render environment variables

**DEP-004: Production Environment Variables (1 hour)**
- **Backend (Render):**
  ```
  DATABASE_URL=postgresql://...?pgbouncer=true
  JWT_SECRET=<generate-strong-secret>
  JWT_REFRESH_SECRET=<generate-strong-secret>
  BKASH_BASE_URL=<production-url>
  BKASH_APP_KEY=<production-key>
  BKASH_WEBHOOK_SECRET=<production-secret>
  NAGAD_BASE_URL=<production-url>
  FRONTEND_URL=https://caregiver-platform.vercel.app
  NODE_ENV=production
  ```
- **Frontend (Vercel):**
  ```
  NEXT_PUBLIC_API_URL=https://api-caregiver.onrender.com
  NEXT_PUBLIC_APP_URL=https://caregiver-platform.vercel.app
  ```

#### **Backend Deployment (4 hours):**

**DEP-005: Create Render Service (1 hour)**
1. Go to https://render.com → New → Web Service
2. Connect GitHub repository
3. Root directory: `backend`
4. Build command: `npm install && npx prisma generate && npm run build`
5. Start command: `npm run start:prod`
6. Select instance type: Free (for MVP)
7. Add environment variables from DEP-004

**DEP-006: Configure Build Settings (30 min)**
- **Auto-deploy:** Enable for `main` branch
- **Health check:** Add `/health` endpoint
  ```typescript
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date() };
  }
  ```
- **Branch deploys:** Disable for now (save resources)

**DEP-007: Run Production Migrations (30 min)**
```bash
# Connect to production database
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Verify migrations applied
npx prisma studio
```
- **Important:** Run migrations BEFORE deploying backend
- **Seed Data:** Run seed script to create super admin

**DEP-008: Test Backend Health (30 min)**
- Hit health endpoint: `https://api-caregiver.onrender.com/health`
- Test auth: Try logging in via Postman
- Check logs: Review Render dashboard for errors
- Test database: Verify connection works

**DEP-009: Configure Production CORS (30 min)**
- Update `backend/src/main.ts`:
  ```typescript
  app.enableCors({
    origin: [
      'https://caregiver-platform.vercel.app',
      'https://*.vercel.app', // Preview deploys
    ],
    credentials: true,
  });
  ```
- Redeploy backend
- Test from frontend production URL

#### **Frontend Deployment (3 hours):**

**DEP-010: Connect Vercel to GitHub (15 min)**
1. Go to https://vercel.com → New Project
2. Import GitHub repository
3. Root directory: `frontend`
4. Framework preset: Next.js (auto-detected)
5. Click Deploy

**DEP-011: Configure Build Settings (15 min)**
- Build command: `npm run build` (default)
- Output directory: `.next` (default)
- Install command: `npm install` (default)
- Node version: 18.x (default)

**DEP-012: Production Environment Variables (30 min)**
- Add in Vercel dashboard → Settings → Environment Variables
  ```
  NEXT_PUBLIC_API_URL=https://api-caregiver.onrender.com
  NEXT_PUBLIC_APP_URL=https://caregiver-platform.vercel.app
  NEXT_PUBLIC_ENABLE_PWA=true
  ```
- Redeploy to apply changes

**DEP-013: Test Frontend Deployment (1 hour)**
- Open production URL
- Test login flow (calls backend API)
- Test package browsing (SSR working)
- Test dashboard (auth working)
- Check browser console for errors
- Test on mobile devices (responsive design)

**DEP-014: Configure Custom Domain (1 hour) - OPTIONAL**
- Buy domain: `caregiver-platform.com.bd`
- Add to Vercel: Settings → Domains
- Update DNS records (Vercel provides instructions)
- Wait for SSL certificate (automatic)
- Update environment variables with new domain

#### **Integration Testing (3 hours):**

**DEP-015: End-to-End Auth Flow (30 min)**
- Register new user → Verify OTP → Login → Access dashboard
- Test all user roles (Guardian, Company, Caregiver, Moderator)
- Verify JWT tokens working
- Test refresh token flow

**DEP-016: Payment Flow with Sandbox (1 hour)**
- Create job → Initiate payment → Redirect to bKash sandbox
- Complete payment → Verify callback received
- Check escrow created in database
- Verify guardian sees payment confirmation
- Test refund flow

**DEP-017: File Uploads (30 min)**
- Upload caregiver photo → Verify stored in R2
- Upload patient health record → Verify accessible
- Test image compression (profile photos)
- Verify proper CORS configuration

**DEP-018: Notifications (30 min)**
- Test SMS notification (Twilio sandbox)
- Test email notification (SendGrid)
- Test in-app notifications (WebSocket or polling)
- Verify notification preferences respected

**DEP-019: Load Testing (30 min)**
- **Tool:** k6 or Apache JMeter
- **Test:** 100 concurrent users
- **Endpoints:**
  - Login (10 req/s)
  - Browse packages (50 req/s)
  - Create job (20 req/s)
- **Target:** <500ms p95 response time
- **Monitor:** Render dashboard for CPU/memory usage

#### **Monitoring & Logging (2 hours):**

**DEP-020: Error Tracking (Optional - 1 hour)**
- **Tool:** Sentry (free tier: 5K errors/month)
- **Setup:**
  ```bash
  npm install @sentry/node @sentry/nextjs
  ```
- **Configure:** Add DSN to environment variables
- **Benefit:** Catch errors before users report them

**DEP-021: Production Logging (30 min)**
- **Backend:** Structured JSON logs (Winston)
- **Log Levels:**
  - ERROR: Payment failures, auth errors
  - WARN: Rate limit hits, slow queries
  - INFO: User actions, API calls (sample 1%)
- **Storage:** Render logs (7-day retention)

**DEP-022: Uptime Monitoring (15 min)**
- **Tool:** UptimeRobot (free tier: 50 monitors)
- **Monitor:**
  - Frontend: https://caregiver-platform.vercel.app
  - Backend: https://api-caregiver.onrender.com/health
- **Alerts:** Email if down for >5 minutes
- **Interval:** Check every 5 minutes

**DEP-023: Status Page (15 min)**
- **Tool:** Status.io or custom Next.js page
- **Show:**
  - System status (operational, degraded, down)
  - Recent incidents
  - Scheduled maintenance
- **URL:** https://status.caregiver-platform.com (optional)

#### **Launch Preparation (3 hours):**

**LAUNCH-001: Deployment Documentation (1 hour)**
- **Create:** `docs/DEPLOYMENT.md`
- **Include:**
  - Environment setup instructions
  - Database migration steps
  - Deployment checklist
  - Rollback procedure
  - Troubleshooting guide

**LAUNCH-002: Launch Checklist (30 min)**
- [ ] All tests passing (backend + frontend)
- [ ] Security audit completed
- [ ] Performance benchmarks met (Lighthouse >90)
- [ ] Database backups configured (Neon auto-backup enabled)
- [ ] Monitoring and alerts active
- [ ] Error tracking configured
- [ ] SSL certificates valid (auto-renewed)
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Payment webhooks working
- [ ] Notification services tested
- [ ] Mobile PWA tested on real devices
- [ ] Documentation complete (API docs, user guides)
- [ ] Super admin account created
- [ ] Support email configured (support@caregiver-platform.com)

**LAUNCH-003: Final Security Review (1 hour)**
- Run `npm audit` on both frontend and backend
- Review all environment variables (no secrets exposed)
- Check API endpoints (all protected except public routes)
- Verify HTTPS enforcement (no HTTP access)
- Test auth flows (login, logout, token refresh)
- Review CORS configuration (only allowed origins)
- Check rate limits (all endpoints protected)

**LAUNCH-004: Backup & Rollback Plan (30 min)**
- **Database Backup:**
  - Neon auto-backup (daily, 7-day retention)
  - Manual backup before launch: `pg_dump > backup.sql`
- **Code Rollback:**
  - Render: Revert to previous deploy (one-click)
  - Vercel: Revert to previous deploy (one-click)
- **Procedure:**
  1. Identify issue (check logs, error tracking)
  2. Decide: Fix forward or rollback
  3. If rollback: Revert both frontend and backend
  4. Verify rollback successful
  5. Communicate to users (status page)

**LAUNCH-005: Deploy to Production (Execute Launch)**
1. Merge all code to `main` branch
2. Verify CI/CD pipeline passes
3. Backend auto-deploys to Render
4. Frontend auto-deploys to Vercel
5. Monitor logs for 1 hour
6. Test critical flows (auth, payments)
7. Announce launch (email, social media)

**LAUNCH-006: Post-Launch Monitoring (Ongoing)**
- **First 24 hours:** Monitor closely (check logs every 2 hours)
- **First week:** Daily check-ins, fix bugs quickly
- **First month:** Weekly reviews, gather user feedback
- **Ongoing:** Monthly reviews, performance optimization

---

## 📊 SUCCESS METRICS & TARGETS

**Reference Document:** 06_Compliance_&_Metrics.md

### **Phase 1 MVP Targets (12 weeks):**

**Business Metrics:**
- [ ] 5 pilot companies onboarded and verified
- [ ] 50 caregivers verified with complete profiles
- [ ] 200 patients registered with health records
- [ ] 100 jobs completed with ≥4-star rating
- [ ] 95%+ payment success rate (bKash/Nagad)
- [ ] <2% dispute rate

**Technical Metrics:**
- [ ] Page load times < 2 seconds (Lighthouse)
- [ ] API response times < 500ms (p95)
- [ ] 99.9% uptime (excluding scheduled maintenance)
- [ ] Zero critical security vulnerabilities
- [ ] Mobile responsive (all screen sizes)
- [ ] WCAG 2.1 AA accessibility compliance

**Feature Completeness:**
- [x] User authentication (all roles) ✅
- [x] Role-based dashboards ✅
- [x] Payment integration (bKash/Nagad) 🚧 85%
- [ ] Care logging system ⏸️
- [ ] Rating/feedback system ⏸️
- [ ] Admin verification workflows 🚧 75%
- [ ] PWA mobile experience ⏸️
- [ ] Notification services ⏸️

---

## 🚨 CRITICAL REMINDERS

### **For AI Coding Agent:**

1. **Always Update This Checklist:**
   - Mark tasks complete immediately after finishing
   - Update completion percentages
   - Document blockers with clear descriptions
   - Note technical decisions with rationale

2. **Reference Documents Constantly:**
   - Don't guess implementation details
   - Check data model before creating entities
   - Verify API patterns in architecture doc
   - Follow UX guidelines for frontend

3. **Test Before Marking Complete:**
   - Run unit tests
   - Test manually in browser/Postman
   - Verify database changes with Prisma Studio
   - Check logs for errors

4. **Follow Migration Plan:**
   - **DO NOT proceed past Phase 5 without completing Step 0 (Backend Migration)**
   - Backend separation is CRITICAL for Bangladesh payment requirements
   - Migration is estimated at 12-14 hours - plan accordingly

5. **Security First:**
   - Never commit secrets to git
   - Always validate user inputs (Zod schemas)
   - Protect all API routes (except public endpoints)
   - Test rate limiting

6. **Bangladesh Market Focus:**
   - Phone format: +8801XXXXXXXXX
   - Payment gateways: bKash and Nagad (mandatory)
   - Language: English/Bengali bilingual
   - Currency: BDT (৳ symbol)

---

## 📞 QUICK REFERENCE

### **Current Status:**
- **Phase:** 5 (Integrations)
- **Progress:** 42% overall
- **Current Task:** Rate limiting (INT-007)
- **Next Milestone:** Complete Phase 5 by Week 9

### **Deployment URLs:**
- **Frontend (Staging):** https://caregiver-platform-git-main.vercel.app
- **Backend (Staging):** https://api-caregiver.onrender.com
- **Database:** Neon PostgreSQL (connection in .env)

### **Key Commands:**
```bash
# Backend
cd backend
npm run start:dev          # Development server
npm run build              # Production build
npx prisma migrate dev     # Create migration
npx prisma studio          # Database GUI

# Frontend  
cd frontend
npm run dev                # Development server
npm run build              # Production build
npm run lint               # Code quality check

# Testing
npm test                   # Run all tests
npm run test:cov          # Coverage report
```

### **Emergency Contacts:**
- **Database Issues:** Check Prisma connection, verify DATABASE_URL
- **Auth Failures:** Check JWT_SECRET, verify token expiration
- **Payment Issues:** Check gateway credentials, webhook signatures
- **CORS Errors:** Verify FRONTEND_URL in backend, allowed origins

---

## 🎯 FINAL INSTRUCTIONS

### **Work Autonomously:**
1. Follow this guide sequentially
2. Complete Step 0 (Backend Migration) before continuing Phase 5
3. Reference documents for every implementation detail
4. Test thoroughly before marking tasks complete
5. Update this checklist after every task
6. Document decisions and blockers clearly

### **Quality Standards:**
- Zero compromises on security
- Production-ready code from day one
- Complete adherence to specifications
- Thorough testing of all functionality

### **Communication:**
- Update this checklist every 4 hours
- Document blockers immediately
- Flag critical decisions for review
- Maintain clean git commit history

---

**YOU ARE AUTHORIZED TO BEGIN DEVELOPMENT**

Start with **Step 0.1: Create NestJS Backend** if not yet done.  
If backend migration is complete, proceed with **INT-007: Rate Limiting**.

Good luck! The success of elderly care in Bangladesh depends on your work. 🚀