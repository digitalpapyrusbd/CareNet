# Technical Architecture (Updated for Separate Backend)

**Version:** 2.0 (Updated for NestJS Backend Split)  
**Last Updated:** January 2025

---

## Architecture Overview

This platform uses a **separated frontend-backend architecture** optimized for Bangladesh market requirements, scalability, and developer productivity.

```
┌─────────────────────────────────────────────────────┐
│              Client Layer (Users)                    │
│  - Desktop Browsers (Guardians, Companies, Admins)  │
│  - Mobile Browsers (Caregivers via PWA)             │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS/REST
                   ↓
┌─────────────────────────────────────────────────────┐
│         Frontend (Next.js 15 - Vercel)              │
│  - Server-Side Rendering (SSR)                      │
│  - Static Site Generation (SSG)                     │
│  - Progressive Web App (PWA) for Mobile             │
│  - Responsive UI (Tailwind CSS + shadcn/ui)         │
└──────────────────┬──────────────────────────────────┘
                   │ REST API Calls
                   │ (CORS enabled)
                   ↓
┌─────────────────────────────────────────────────────┐
│         Backend (NestJS - Render)                   │
│  - RESTful API                                      │
│  - JWT Authentication                               │
│  - Role-Based Access Control (RBAC)                │
│  - Payment Gateway Integration                      │
│  - Background Jobs & Cron                           │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┬────────────┐
        ↓                     ↓            ↓
┌──────────────┐    ┌────────────────┐   ┌──────────────┐
│ PostgreSQL   │    │ Redis Cache    │   │ File Storage │
│ (Neon)       │    │ (Upstash)      │   │ (Cloudflare) │
└──────────────┘    └────────────────┘   └──────────────┘
```

---

## Frontend Architecture

### Technology Stack

**Framework:** Next.js 15 with App Router  
**Language:** TypeScript (strict mode)  
**UI Library:** shadcn/ui + Tailwind CSS  
**State Management:** React Context + Zustand (for global state)  
**Data Fetching:** Custom API client with React Query  
**Localization:** next-intl (English/Bengali)

### Key Features

1. **Server-Side Rendering (SSR)**
   - SEO-optimized pages (company listings, public profiles)
   - Fast initial page loads
   - Dynamic content rendering

2. **Progressive Web App (PWA)**
   - Add to home screen capability
   - Service worker for offline support
   - Mobile-optimized navigation
   - GPS-based check-in (Geolocation API)
   - Camera access (MediaDevices API)
   - Push notifications (Web Push API)

3. **Responsive Design**
   - Mobile-first approach
   - Touch-friendly UI (48px minimum targets)
   - Adaptive layouts for all screen sizes

4. **API Integration**
   ```typescript
   // src/lib/api-client.ts
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
   
   export async function apiCall(endpoint, options) {
     const token = getAuthToken();
     
     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
       ...options,
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`,
         ...options?.headers,
       },
     });
     
     if (!response.ok) {
       throw new APIError(response);
     }
     
     return response.json();
   }
   ```

### Deployment: Vercel

**Free Tier Includes:**
- Unlimited deployments
- Automatic HTTPS/SSL
- Global CDN (150+ edge locations)
- Preview deployments (per git branch)
- 100GB bandwidth/month
- Automatic builds on git push

**Configuration:**
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.caregiver-platform.onrender.com
NEXT_PUBLIC_APP_URL=https://caregiver-platform.vercel.app
```

---

## Backend Architecture

### Technology Stack

**Framework:** NestJS (Node.js)  
**Language:** TypeScript (strict mode)  
**ORM:** Prisma (with PostgreSQL)  
**Authentication:** JWT + Passport  
**Validation:** class-validator + class-transformer  
**API Type:** RESTful (GraphQL optional for Phase 2)

### Key Features

1. **Modular Architecture**
   ```
   src/
   ├── auth/           # JWT, login, register, MFA
   ├── users/          # User management
   ├── companies/      # Company operations
   ├── caregivers/     # Caregiver management
   ├── patients/       # Patient records
   ├── jobs/           # Job assignments
   ├── payments/       # Payment processing
   │   ├── bkash/      # bKash integration
   │   ├── nagad/      # Nagad integration
   │   └── escrow/     # Escrow management
   ├── notifications/  # SMS, email, push
   └── common/         # Shared utilities
       ├── prisma/     # Database service
       ├── guards/     # Auth guards
       └── filters/    # Exception filters
   ```

2. **Authentication & Authorization**
   - JWT access tokens (15-minute expiry)
   - JWT refresh tokens (7-day expiry)
   - Role-based guards: `@Roles('GUARDIAN', 'COMPANY')`
   - Permission-based guards: `@RequirePermission('manage:payments')`
   - MFA for admin roles (TOTP-based)

3. **Background Jobs & Cron**
   ```typescript
   // Escrow auto-release (48 hours after job completion)
   @Cron('0 */6 * * *') // Every 6 hours
   async releaseEscrow() {
     const jobs = await this.jobsService.findCompletedJobs({
       completedBefore: subHours(new Date(), 48),
       escrowStatus: 'HELD',
     });
     
     for (const job of jobs) {
       await this.escrowService.release(job.paymentId);
     }
   }
   ```

4. **Payment Gateway Integration**
   - bKash Checkout URL API
   - Nagad PGW API
   - Webhook signature verification (HMAC-SHA256)
   - Escrow system (hold funds until job completion)
   - Automatic refund processing

### Deployment: Render

**Free Tier Includes:**
- 750 hours/month (24/7 uptime)
- 512MB RAM
- Auto-deploy from git
- Free PostgreSQL (optional)
- Free SSL certificates
- Environment variable management

**Limitations:**
- Spins down after 15 minutes of inactivity
- 30-second cold start on first request
- No custom domains on free tier

**Configuration:**
```yaml
# render.yaml
services:
  - type: web
    name: caregiver-backend
    env: node
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production
```

---

## Database Architecture

### PostgreSQL (Neon)

**Why Neon:**
- Fully managed PostgreSQL 15+
- Serverless (auto-suspend when idle)
- 3GB storage (free tier)
- Daily automatic backups
- Connection pooling built-in
- Low latency from Asia regions (Bangladesh-friendly)

**Schema Highlights:**
- 20+ entities (users, companies, caregivers, patients, jobs, payments)
- UUID primary keys
- Soft deletes (`deleted_at` timestamp)
- Audit trails (`created_at`, `updated_at`)
- JSONB fields for flexible data (skills, availability, metadata)

**Connection Pooling:**
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// With connection pooling (production)
DATABASE_URL="postgresql://user:pass@host/db?pgbouncer=true&connection_limit=10"
```

### Redis Cache (Upstash)

**Use Cases:**
- Session storage (JWT refresh tokens)
- Rate limiting (100 req/min per user)
- OTP codes (10-minute expiry)
- Temporary data (caregiver locations)

**Free Tier:**
- 10,000 requests/day
- 256MB storage
- Global edge caching

```typescript
// Rate limiting example
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
});

export async function checkRateLimit(identifier: string) {
  const { success, remaining } = await ratelimit.limit(identifier);
  return { allowed: success, remaining };
}
```

---

## File Storage & CDN

### Cloudflare R2

**Why R2:**
- S3-compatible API (works with AWS SDK)
- **No egress fees** (huge cost savings vs AWS S3)
- 10GB storage/month (free tier)
- Global CDN delivery
- Fast uploads from Bangladesh

**Use Cases:**
- NID scans (caregiver verification)
- Caregiver profile photos
- Health records (prescriptions, reports)
- Job completion photos

```typescript
// S3-compatible upload
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function uploadFile(file: Buffer, key: string) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: 'image/jpeg',
  }));
  
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
```

---

## CORS Configuration

### Backend Setup (NestJS)

```typescript
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000', // Local development
      'https://caregiver-platform.vercel.app', // Production
      'https://*.vercel.app', // Preview deployments
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(process.env.PORT || 4000);
}
```

### Frontend API Client

```typescript
// src/lib/api-client.ts
export async function apiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Send cookies
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new APIError(error.message, response.status);
  }
  
  return response.json();
}
```

---

## Payment Gateway Integration

### bKash Integration

**Flow:**
1. Guardian initiates checkout → Backend creates payment
2. Backend calls bKash API → Gets checkout URL
3. Frontend redirects user → bKash payment page
4. User completes payment → bKash sends webhook
5. Backend verifies signature → Updates payment status
6. Funds held in escrow → Released after job completion

**Webhook Signature Verification:**
```typescript
import crypto from 'crypto';

function verifyBkashSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### Nagad Integration

Similar flow to bKash with PGW API.

### Escrow System

```typescript
// Database-backed escrow
await prisma.escrowRecord.create({
  data: {
    paymentId: payment.id,
    amount: payment.amount,
    status: 'HELD',
    heldAt: new Date(),
  },
});

// Auto-release after 48 hours (cron job)
const releasableEscrows = await prisma.escrowRecord.findMany({
  where: {
    status: 'HELD',
    heldAt: { lte: subHours(new Date(), 48) },
  },
});

for (const escrow of releasableEscrows) {
  await releaseEscrow(escrow.id);
}
```

---

## Security

### Authentication Flow

```
1. User logs in with phone + password
   ↓
2. Backend validates credentials
   ↓
3. Backend generates JWT tokens:
   - Access token (15 min expiry)
   - Refresh token (7 days expiry)
   ↓
4. Frontend stores tokens:
   - Access token in memory
   - Refresh token in httpOnly cookie
   ↓
5. Frontend sends access token with each request
   ↓
6. When access token expires:
   - Frontend calls /auth/refresh
   - Backend validates refresh token
   - Backend issues new access token
```

### MFA for Admin Roles

```typescript
// Required for: SUPER_ADMIN, MODERATOR, COMPANY
@Post('login')
async login(@Body() dto: LoginDto) {
  const user = await this.authService.validateUser(dto);
  
  if (user.mfaEnabled) {
    // Return temp token, require MFA code
    return {
      requiresMfa: true,
      tempToken: this.authService.generateTempToken(user.id),
    };
  }
  
  return this.authService.login(user);
}

@Post('mfa/verify')
async verifyMfa(@Body() dto: VerifyMfaDto) {
  const isValid = await this.authService.verifyMfaCode(
    dto.tempToken,
    dto.code
  );
  
  if (!isValid) {
    throw new UnauthorizedException('Invalid MFA code');
  }
  
  return this.authService.login(user);
}
```

### Data Encryption

- **In Transit:** HTTPS/TLS 1.3 (enforced by Vercel/Render)
- **At Rest:** AES-256 (PostgreSQL encryption at rest via Neon)
- **Sensitive Fields:** Application-level encryption for NID, health records

---

## Monitoring & Logging

### Error Tracking: Sentry (Optional)

```typescript
// Backend integration
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Capture errors
try {
  await processPayment();
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

### Logging Strategy

**Development:**
- Console logs with timestamps
- Verbose error stack traces

**Production:**
- Structured JSON logs
- Log levels: ERROR, WARN, INFO, DEBUG
- Centralized logging (optional: Logtail, Datadog)

```typescript
// src/common/logger.ts
export class Logger {
  error(message: string, trace?: string, context?: string) {
    console.error(JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      trace,
      context,
    }));
  }
}
```

---

## Performance Optimization

### Frontend

1. **Code Splitting**
   - Automatic with Next.js App Router
   - Dynamic imports for heavy components

2. **Image Optimization**
   - Next.js `<Image>` component (auto WebP conversion)
   - Lazy loading below fold
   - Responsive sizes

3. **Caching Strategy**
   - SSG for static pages (company listings)
   - ISR for dynamic pages (revalidate every 60s)
   - Browser caching (immutable assets)

### Backend

1. **Database Query Optimization**
   - Prisma `include` only needed relations
   - Pagination with cursor-based approach
   - Database indexes on frequently queried columns

2. **Redis Caching**
   - Cache expensive queries (5-minute TTL)
   - Cache API responses (1-minute TTL for public data)

3. **Connection Pooling**
   - PgBouncer for PostgreSQL (max 20 connections)
   - Redis connection reuse

---

## Scalability Strategy

### Phase 1 (MVP): Current Architecture
- Next.js on Vercel (auto-scales)
- NestJS on Render (512MB RAM, single instance)
- PostgreSQL on Neon (3GB storage)
- **Handles:** 1,000 concurrent users, 10K daily active users

### Phase 2 (Growth): Horizontal Scaling
- NestJS on Render (upgrade to 2GB RAM)
- PostgreSQL read replicas (Neon Scale plan)
- Redis cluster (Upstash Pro)
- **Handles:** 10K concurrent users, 100K daily active users

### Phase 3 (Enterprise): Microservices
- Separate services: Auth, Payments, Jobs, Notifications
- Message queue (RabbitMQ/Kafka)
- Load balancer (Render native)
- **Handles:** 50K+ concurrent users, 1M+ daily active users

---

## Deployment Workflow

### CI/CD Pipeline

```yaml
# GitHub Actions example
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: |
          cd backend
          npm install
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Render
        uses: render-deploy@v1
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

### Environment Management

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| **Development** | localhost:3000 | localhost:4000 | Local SQLite |
| **Staging** | staging.vercel.app | staging.render.com | Neon (staging) |
| **Production** | caregiver.vercel.app | api.render.com | Neon (production) |

---

## Bangladesh Market Compliance

### Data Localization
- Database: Neon Asia region (Singapore)
- CDN: Cloudflare Bangladesh edge nodes
- Legal: Data storage within approved AWS/Cloudflare regions

### Payment Gateway Requirements
- bKash: Registered merchant account (sandbox for development)
- Nagad: Merchant API access (contact Nagad support)
- Compliance: Bangladesh Bank digital payment regulations

### Phone Number Validation
```typescript
// +8801XXXXXXXXX format only
const BD_PHONE_REGEX = /^(\+8801|01)[3-9]\d{8}$/;

function isValidBangladeshPhone(phone: string): boolean {
  return BD_PHONE_REGEX.test(phone);
}
```

---

## Cost Projection

### Free Tier (MVP Phase)
| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | 100GB bandwidth | $0 |
| Render | 750 hours/month | $0 |
| Neon | 3GB storage | $0 |
| Upstash | 10K req/day | $0 |
| Cloudflare R2 | 10GB storage | $0 |
| **Total** | | **$0/month** |

### Paid Tier (Growth Phase)
| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20/month |
| Render | Starter | $7/month |
| Neon | Scale | $19/month |
| Upstash | Pay-as-go | ~$10/month |
| Cloudflare R2 | Pay-as-go | ~$5/month |
| **Total** | | **~$61/month** |

---

## Migration from Monolith (If Needed)

If you later need to split further (e.g., separate Payment Service):

```
1. Extract payment module from NestJS
   ↓
2. Create standalone payment microservice
   ↓
3. Add message queue (RabbitMQ)
   ↓
4. Update main backend to call payment service
   ↓
5. Deploy payment service to separate Render instance
```

**Estimated effort:** 2-3 days (if needed in Phase 2)

# File Architecture (Updated for Separate Backend)

**Version:** 2.0 (Updated for NestJS Backend Split + PWA)  
**Last Updated:** January 2025

---

## Project Structure Overview

```
/caregiver-platform/
├── /frontend/              # Next.js 15 (Vercel)
├── /backend/               # NestJS (Render)
├── /docs/                  # Project documentation
├── /shared/                # Shared types/constants (optional)
├── .gitignore
└── README.md
```

---

## Frontend Structure (Next.js 15)

### Complete Directory Tree

```
/frontend/
├── /public/
│   ├── /locales/
│   │   ├── en.json          # English translations
│   │   └── bn.json          # Bengali translations
│   ├── /images/
│   │   ├── logo.svg
│   │   └── favicon.ico
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service worker (optional)
│
├── /src/
│   ├── /app/                # Next.js App Router
│   │   ├── layout.tsx       # Root layout (providers, fonts)
│   │   ├── page.tsx         # Landing page
│   │   ├── globals.css      # Global styles
│   │   │
│   │   ├── /(auth)/         # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   ├── guardian/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── company/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── caregiver/
│   │   │   │       └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── mfa/
│   │   │       └── page.tsx
│   │   │
│   │   ├── /dashboard/      # Role-based dashboards
│   │   │   ├── /guardian/
│   │   │   │   ├── page.tsx         # Guardian home
│   │   │   │   ├── layout.tsx       # Guardian layout
│   │   │   │   ├── /patients/
│   │   │   │   │   ├── page.tsx     # Patient list
│   │   │   │   │   ├── /[id]/
│   │   │   │   │   │   └── page.tsx # Patient details
│   │   │   │   │   └── /new/
│   │   │   │   │       └── page.tsx # Add patient
│   │   │   │   ├── /jobs/
│   │   │   │   │   ├── page.tsx     # Active jobs
│   │   │   │   │   └── /[id]/
│   │   │   │   │       └── page.tsx # Job details
│   │   │   │   ├── /payments/
│   │   │   │   │   └── page.tsx     # Payment history
│   │   │   │   └── /settings/
│   │   │   │       └── page.tsx     # Profile settings
│   │   │   │
│   │   │   ├── /company/
│   │   │   │   ├── page.tsx         # Company home
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── /caregivers/
│   │   │   │   │   ├── page.tsx     # Caregiver roster
│   │   │   │   │   ├── /[id]/
│   │   │   │   │   │   └── page.tsx # Caregiver profile
│   │   │   │   │   └── /new/
│   │   │   │   │       └── page.tsx # Add caregiver
│   │   │   │   ├── /packages/
│   │   │   │   │   ├── page.tsx     # Package list
│   │   │   │   │   ├── /[id]/
│   │   │   │   │   │   └── page.tsx # Edit package
│   │   │   │   │   └── /new/
│   │   │   │   │       └── page.tsx # Create package
│   │   │   │   ├── /jobs/
│   │   │   │   │   ├── page.tsx     # Job inbox
│   │   │   │   │   └── /[id]/
│   │   │   │   │       └── page.tsx # Job assignment
│   │   │   │   ├── /analytics/
│   │   │   │   │   └── page.tsx     # Analytics dashboard
│   │   │   │   └── /settings/
│   │   │   │       └── page.tsx     # Company settings
│   │   │   │
│   │   │   ├── /caregiver/
│   │   │   │   ├── page.tsx         # Caregiver home (mobile-optimized)
│   │   │   │   ├── layout.tsx       # Mobile layout
│   │   │   │   ├── /jobs/
│   │   │   │   │   ├── page.tsx     # Job list
│   │   │   │   │   └── /[id]/
│   │   │   │   │       ├── page.tsx       # Job details
│   │   │   │   │       ├── /check-in/
│   │   │   │   │       │   └── page.tsx   # GPS check-in
│   │   │   │   │       └── /care-log/
│   │   │   │   │           └── page.tsx   # Care logging
│   │   │   │   ├── /earnings/
│   │   │   │   │   └── page.tsx     # Earnings tracker
│   │   │   │   └── /profile/
│   │   │   │       └── page.tsx     # Profile settings
│   │   │   │
│   │   │   ├── /moderator/
│   │   │   │   ├── page.tsx         # Moderator home
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── /verification/
│   │   │   │   │   ├── /companies/
│   │   │   │   │   │   └── page.tsx # Company queue
│   │   │   │   │   └── /caregivers/
│   │   │   │   │       └── page.tsx # Caregiver queue
│   │   │   │   ├── /disputes/
│   │   │   │   │   ├── page.tsx     # Dispute list
│   │   │   │   │   └── /[id]/
│   │   │   │   │       └── page.tsx # Dispute details
│   │   │   │   └── /users/
│   │   │   │       └── page.tsx     # User management
│   │   │   │
│   │   │   └── /admin/
│   │   │       ├── page.tsx         # Super admin home
│   │   │       ├── layout.tsx
│   │   │       ├── /analytics/
│   │   │       │   └── page.tsx     # Platform analytics
│   │   │       └── /settings/
│   │   │           └── page.tsx     # System settings
│   │   │
│   │   ├── /packages/       # Public package browsing
│   │   │   ├── page.tsx     # Browse packages
│   │   │   └── /[id]/
│   │   │       └── page.tsx # Package details
│   │   │
│   │   ├── /companies/      # Public company listings
│   │   │   ├── page.tsx     # Company directory
│   │   │   └── /[id]/
│   │   │       └── page.tsx # Company profile
│   │   │
│   │   └── /payments/       # Payment flow pages
│   │       ├── /checkout/
│   │       │   └── page.tsx # Checkout page
│   │       ├── /success/
│   │       │   └── page.tsx # Payment success
│   │       └── /failure/
│   │           └── page.tsx # Payment failed
│   │
│   ├── /components/         # React components
│   │   ├── /ui/             # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── ... (40+ components)
│   │   │
│   │   ├── /forms/          # Form components
│   │   │   ├── PatientForm.tsx
│   │   │   ├── CaregiverForm.tsx
│   │   │   ├── PackageForm.tsx
│   │   │   └── JobAssignmentForm.tsx
│   │   │
│   │   ├── /cards/          # Card components
│   │   │   ├── PatientCard.tsx
│   │   │   ├── CaregiverCard.tsx
│   │   │   ├── JobCard.tsx
│   │   │   └── PackageCard.tsx
│   │   │
│   │   ├── /charts/         # Dashboard charts
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── JobStatusChart.tsx
│   │   │   └── CaregiverUtilizationChart.tsx
│   │   │
│   │   ├── /layout/         # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   └── /mobile/         # Mobile-specific components (PWA)
│   │       ├── BottomNav.tsx
│   │       ├── GPSCheckIn.tsx
│   │       ├── CameraCapture.tsx
│   │       └── InstallPrompt.tsx
│   │
│   ├── /lib/                # Utility functions
│   │   ├── api-client.ts    # **NEW: API wrapper for backend calls**
│   │   ├── utils.ts         # General utilities
│   │   ├── validators.ts    # Client-side validation
│   │   ├── formatters.ts    # Date, currency formatting
│   │   └── constants.ts     # App constants
│   │
│   ├── /hooks/              # Custom React hooks
│   │   ├── use-auth.ts      # Authentication hook
│   │   ├── use-api.ts       # API call hook
│   │   ├── use-media-query.ts
│   │   ├── use-geolocation.ts  # GPS hook
│   │   └── use-camera.ts    # Camera hook
│   │
│   ├── /context/            # React Context providers
│   │   ├── AuthContext.tsx  # Auth state
│   │   ├── ThemeContext.tsx # Theme (dark/light)
│   │   └── LocaleContext.tsx # Language
│   │
│   └── /types/              # TypeScript types
│       ├── api.ts           # API response types
│       ├── models.ts        # Data model types
│       └── components.ts    # Component prop types
│
├── .env.local               # Local environment variables
├── .env.production          # Production environment variables
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json
└── README.md
```

---

## Backend Structure (NestJS)

### Complete Directory Tree

```
/backend/
├── /prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Seed data script
│   └── /migrations/         # Database migrations
│       ├── 20250117_init/
│       ├── 20250118_add_escrow/
│       └── 20250119_add_transactions/
│
├── /src/
│   ├── main.ts              # Application entry point
│   ├── app.module.ts        # Root module
│   │
│   ├── /auth/               # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── /dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── /guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── /strategies/
│   │       └── jwt.strategy.ts
│   │
│   ├── /users/              # User management module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── /dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   │
│   ├── /companies/          # Company module
│   │   ├── companies.module.ts
│   │   ├── companies.controller.ts
│   │   ├── companies.service.ts
│   │   └── /dto/
│   │       ├── create-company.dto.ts
│   │       └── update-company.dto.ts
│   │
│   ├── /caregivers/         # Caregiver module
│   │   ├── caregivers.module.ts
│   │   ├── caregivers.controller.ts
│   │   ├── caregivers.service.ts
│   │   └── /dto/
│   │       ├── create-caregiver.dto.ts
│   │       └── update-caregiver.dto.ts
│   │
│   ├── /patients/           # Patient module
│   │   ├── patients.module.ts
│   │   ├── patients.controller.ts
│   │   ├── patients.service.ts
│   │   └── /dto/
│   │       ├── create-patient.dto.ts
│   │       └── update-patient.dto.ts
│   │
│   ├── /packages/           # Package module
│   │   ├── packages.module.ts
│   │   ├── packages.controller.ts
│   │   ├── packages.service.ts
│   │   └── /dto/
│   │       ├── create-package.dto.ts
│   │       └── update-package.dto.ts
│   │
│   ├── /jobs/               # Job assignment module
│   │   ├── jobs.module.ts
│   │   ├── jobs.controller.ts
│   │   ├── jobs.service.ts
│   │   ├── /dto/
│   │   │   ├── create-job.dto.ts
│   │   │   └── assign-caregiver.dto.ts
│   │   └── /cron/
│   │       └── job-scheduler.service.ts  # Background jobs
│   │
│   ├── /payments/           # Payment module
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── /dto/
│   │   │   ├── create-payment.dto.ts
│   │   │   └── refund.dto.ts
│   │   ├── /providers/
│   │   │   ├── bkash.service.ts
│   │   │   └── nagad.service.ts
│   │   ├── /escrow/
│   │   │   └── escrow.service.ts
│   │   └── /webhooks/
│   │       ├── bkash-webhook.controller.ts
│   │       └── nagad-webhook.controller.ts
│   │
│   ├── /care-logs/          # Care logging module
│   │   ├── care-logs.module.ts
│   │   ├── care-logs.controller.ts
│   │   ├── care-logs.service.ts
│   │   └── /dto/
│   │       ├── create-care-log.dto.ts
│   │       └── update-care-log.dto.ts
│   │
│   ├── /notifications/      # Notification module
│   │   ├── notifications.module.ts
│   │   ├── notifications.service.ts
│   │   ├── /providers/
│   │   │   ├── sms.service.ts     # Twilio
│   │   │   ├── email.service.ts   # SendGrid
│   │   │   └── push.service.ts    # FCM
│   │   └── /dto/
│   │       └── send-notification.dto.ts
│   │
│   ├── /files/              # File upload module
│   │   ├── files.module.ts
│   │   ├── files.controller.ts
│   │   ├── files.service.ts      # Cloudflare R2 integration
│   │   └── /dto/
│   │       └── upload-file.dto.ts
│   │
│   ├── /admin/              # Admin/Moderator module
│   │   ├── admin.module.ts
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   └── /dto/
│   │       ├── verify-company.dto.ts
│   │       └── verify-caregiver.dto.ts
│   │
│   └── /common/             # Shared utilities
│       ├── /prisma/
│       │   ├── prisma.module.ts
│       │   └── prisma.service.ts
│       │
│       ├── /decorators/
│       │   ├── roles.decorator.ts
│       │   ├── public.decorator.ts
│       │   └── permissions.decorator.ts
│       │
│       ├── /guards/
│       │   ├── jwt-auth.guard.ts
│       │   ├── roles.guard.ts
│       │   └── throttle.guard.ts
│       │
│       ├── /filters/
│       │   ├── http-exception.filter.ts
│       │   └── prisma-exception.filter.ts
│       │
│       ├── /interceptors/
│       │   ├── logging.interceptor.ts
│       │   └── transform.interceptor.ts
│       │
│       ├── /pipes/
│       │   └── validation.pipe.ts
│       │
│       └── /utils/
│           ├── helpers.ts
│           ├── constants.ts
│           └── validators.ts
│
├── /test/                   # Integration tests
│   ├── app.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   └── payments.e2e-spec.ts
│
├── .env                     # Environment variables
├── .env.example             # Example env file
├── .gitignore
├── nest-cli.json            # NestJS CLI configuration
├── tsconfig.json            # TypeScript configuration
├── package.json
└── README.md
```

---

## Shared Types (Optional)

If you want to share TypeScript types between frontend and backend:

```
/shared/
├── /types/
│   ├── user.types.ts
│   ├── payment.types.ts
│   └── job.types.ts
├── /constants/
│   ├── roles.ts
│   └── permissions.ts
└── package.json
```

**Usage:**
```typescript
// Backend
import { UserRole } from '@shared/types';

// Frontend
import { UserRole } from '@shared/types';
```

---

## Configuration Files

### Frontend (Next.js)

#### **next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['pub-xxxxx.r2.dev'], // Cloudflare R2 domain
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  i18n: {
    locales: ['en', 'bn'],
    defaultLocale: 'en',
  },
};

module.exports = nextConfig;
```

#### **tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00AEEF',
        success: '#3CCF4E',
        error: '#FF4D4D',
        warning: '#FFA500',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

#### **tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### Backend (NestJS)

#### **nest-cli.json**
```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

#### **tsconfig.json**
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## Naming Conventions

### Files
- **Components:** PascalCase (`PatientCard.tsx`)
- **Utilities:** camelCase (`api-client.ts`)
- **Pages:** lowercase with hyphens (`forgot-password/page.tsx`)
- **DTOs:** kebab-case with `.dto.ts` suffix (`create-user.dto.ts`)
- **Services:** kebab-case with `.service.ts` suffix (`auth.service.ts`)

### Folders
- **Lowercase with hyphens:** `/care-logs`, `/forgot-password`
- **Route groups:** Parentheses `/(auth)` (Next.js convention)

### Code
- **Variables/Functions:** camelCase (`getUserProfile`)
- **Classes/Interfaces:** PascalCase (`UserService`, `CreateUserDto`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Enums:** PascalCase with UPPER values (`UserRole.GUARDIAN`)

---

## Environment Variables

### Frontend (.env.local)
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA=true
```

### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/caregiver_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Payment Gateways
BKASH_BASE_URL="https://checkout.sandbox.bka.sh/v1.2.0-beta"
BKASH_APP_KEY="sandbox_app_key"
BKASH_APP_SECRET="sandbox_app_secret"
BKASH_USERNAME="sandbox_username"
BKASH_PASSWORD="sandbox_password"
BKASH_WEBHOOK_SECRET="your_webhook_secret"

NAGAD_BASE_URL="https://api.sandbox.mynagad.com"
NAGAD_MERCHANT_ID="sandbox_merchant_id"
NAGAD_WEBHOOK_SECRET="your_webhook_secret"

# Notifications
TWILIO_ACCOUNT_SID="your_twilio_sid"
TWILIO_AUTH_TOKEN="your_twilio_token"
SENDGRID_API_KEY="your_sendgrid_key"

# Redis
UPSTASH_REDIS_URL="https://us1-upstash-redis.upstash.io"
UPSTASH_REDIS_TOKEN="your_upstash_token"

# File Storage (Cloudflare R2)
R2_ENDPOINT="https://xxxxx.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="your_r2_access_key"
R2_SECRET_ACCESS_KEY="your_r2_secret_key"
R2_BUCKET_NAME="caregiver-platform-files"
R2_PUBLIC_URL="https://pub-xxxxx.r2.dev"

# Frontend (for CORS)
FRONTEND_URL="http://localhost:3000"

# Server
PORT=4000
NODE_ENV=development
```

---

## Git Structure

### Repository Layout (Monorepo)
```
/.git/
/.github/
│   └── workflows/
│       ├── frontend-deploy.yml
│       └── backend-deploy.yml
│
/frontend/                 # Next.js app
/backend/                  # NestJS app
/docs/                     # Documentation
/shared/                   # Shared types (optional)
│
.gitignore
README.md
```

### .gitignore
```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build
/dist

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env
.env*.local

# Vercel
.vercel

# Prisma
prisma/*.db
prisma/*.db-journal

# IDEs
.idea/
.vscode/
*.swp
*.swo
```

---

## Module Dependencies

### Frontend Dependencies (package.json)
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.263.1",
    "next-intl": "^3.0.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

### Backend Dependencies (package.json)
```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/schedule": "^4.0.0",
    "@nestjs/throttler": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.0",
    "bcryptjs": "^2.4.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "@upstash/ratelimit": "^1.0.0",
    "@upstash/redis": "^1.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/node": "^20.0.0",
    "@types/passport-jwt": "^4.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0"
  }
}
```

---

## Summary

This file architecture provides:
- ✅ Clear separation between frontend and backend
- ✅ Modular structure for easy navigation
- ✅ Scalable organization (easy to add new modules)
- ✅ Consistent naming conventions