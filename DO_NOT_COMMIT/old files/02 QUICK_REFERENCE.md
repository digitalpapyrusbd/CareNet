# AI Agent Quick Reference Guide

**Purpose:** Rapid access to critical information during development  
**Last Updated:** December 2025

---

## 📊 Current Project Status

| Metric | Value |
|--------|-------|
| **Overall Completion** | 95% (182/191 tasks) |
| **Backend Tests** | 504 passing (100% coverage) |
| **E2E Tests** | 13/13 passing |
| **Current Phase** | Testing & PWA Development |

---

## 🗂️ Key Files

```
📁 Critical Files:
├── backend/prisma/schema.prisma    # Database schema
├── backend/src/                     # NestJS backend
├── src/app/                         # Next.js pages
├── src/lib/api-client.ts           # API wrapper
├── src/components/                  # React components
└── .env.local                       # Environment variables
```

---

## 🔗 Reference Documents

| Document | Purpose |
|----------|---------|
| `03 PROGRESS_CHECKLIST.md` | Task tracking |
| `05 03 Data_Model.md` | Database schema |
| `06 01 PRD_CaregiverSolution.md` | Product requirements |
| `07 02 Technical_Architecture.md` | System design |
| `08 04 UX_Flow_&_Screens.md` | User flows & UI |
| `09 DEVELOPMENT_GUIDELINES.md` | Coding standards |
| `10 05 File_Architecture.md` | Project structure |

---

## 🛠️ Development Commands

### Backend (NestJS)

```bash
cd backend
npm run start:dev          # Development server (port 4000)
npm run build              # Production build
npm test                   # Run tests
npm run test:cov           # Coverage report
npx prisma migrate dev     # Create migration
npx prisma studio          # Database GUI
```

### Frontend (Next.js)

```bash
npm run dev                # Development server (port 3000)
npm run build              # Production build
npm run lint               # Code quality check
npm test                   # Run tests
```

---

## 🔐 Authentication

**Phone Format:** `+8801XXXXXXXXX` or `01XXXXXXXXX`

**User Roles:**
- `SUPER_ADMIN` - Platform administration
- `MODERATOR` - Verification & disputes
- `COMPANY` - Caregiver agency
- `CAREGIVER` - Service provider
- `GUARDIAN` - Patient family member
- `PATIENT` - Care recipient

**JWT Configuration:**
- Access Token: 15 minutes
- Refresh Token: 7 days
- MFA Required: COMPANY, MODERATOR, SUPER_ADMIN

---

## 💳 Payment Gateways

**bKash:**
```
BKASH_BASE_URL=https://checkout.sandbox.bka.sh/v1.2.0-beta
BKASH_APP_KEY=your_app_key
BKASH_APP_SECRET=your_app_secret
```

**Nagad:**
```
NAGAD_BASE_URL=https://api.sandbox.mynagad.com
NAGAD_MERCHANT_ID=your_merchant_id
```

---

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/refresh` - Token refresh

### Core Resources
- `GET/POST /users` - User management
- `GET/POST /companies` - Company management
- `GET/POST /caregivers` - Caregiver management
- `GET/POST /patients` - Patient management
- `GET/POST /packages` - Package management
- `GET/POST /jobs` - Job management

### Payments
- `POST /payments/create` - Create payment
- `GET /payments/bkash/callback` - bKash webhook
- `GET /payments/nagad/callback` - Nagad webhook

---

## 🚨 Troubleshooting

**Database Issues:**
- Check `DATABASE_URL` in `.env`
- Run `npx prisma generate`
- Verify Neon connection

**Auth Failures:**
- Check `JWT_SECRET` configuration
- Verify token expiration
- Check role permissions

**CORS Errors:**
- Verify `FRONTEND_URL` in backend
- Check allowed origins in `main.ts`

**Payment Issues:**
- Verify gateway credentials
- Check webhook signatures
- Review escrow logic

---

## 📋 Next Steps

1. Complete frontend testing (TEST-009B, TEST-010)
2. PWA Development (manifest, service worker)
3. Mobile optimization (GPS, camera, touch UI)
4. Production deployment (Render + Vercel)
5. Launch preparation

See `03 PROGRESS_CHECKLIST.md` for detailed task list.
