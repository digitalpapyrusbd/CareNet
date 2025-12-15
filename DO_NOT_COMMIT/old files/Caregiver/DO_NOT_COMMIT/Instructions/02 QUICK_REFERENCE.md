AI Agent Quick Reference Guide
Purpose: Rapid access to critical information during development
Last Updated: 2025-01-17

📚 **RECENTLY UPDATED DOCUMENTATION**
✅ **All critical infrastructure issues resolved** - See 14_PENDING_DOCS.md for details
✅ **Enhanced package.json scripts** - Comprehensive documentation for all development commands
✅ **Fixed Prisma schema syntax** - Added missing ChatAnalyticsEvent and ChatSession models
✅ **Corrected phone validation** - Fixed Bangladesh phone number prefix extraction logic
✅ **Added database connection** - src/lib/db.ts with proper Prisma Client singleton
✅ **TypeScript configuration** - tsconfig.json with path aliases (@/* mapped to ./src/*)
✅ **Mermaid diagram preview** - Instructions added to README_FOR_AI_AGENT.md
✅ **PRD technology stack** - Now explicitly states Next.js 15 full-stack with App Router API routes
✅ **Comprehensive seed data** - Extended examples beyond Super Admin with all required fields

🔗 **Cross-References**
- Agent Operation Manual: 04_AGENT_OPERATION_MANUAL.md (updated with new resource links)
- Development Guidelines: 09_DEVELOPMENT_GUIDELINES.md
- Fixing Instructions: 15_FIXING_INSTRUCTION.md (step-by-step procedures)
- Chat Agent Integration: 16_CHAT_AGENT_INTEGRATION.md

🚀 IMMEDIATE ACTIONS (First 24 Hours)
1. Database Schema Implementation
bash

Line Wrapping

Collapse
Copy
1
2
3
4
# Priority 1: Update Prisma schema
# File: prisma/schema.prisma
# Reference: 03_Data_Model.md
# Tasks: DB-001 to DB-018 in PROGRESS_CHECKLIST.md
2. Key Files to Check First

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
📁 Critical Files:
├── prisma/schema.prisma           # Database schema ✅ **FIXED** - Added missing models
├── prisma/seed.ts                 # Example seed script ✅ **ENHANCED** - Comprehensive examples
├── src/lib/db.ts                 # Database connection ✅ **ADDED** - Prisma Client singleton
├── src/lib/validations/phone.ts  # Phone validation ✅ **FIXED** - Bangladesh prefix extraction
├── src/app/globals.css           # Global styles
├── src/app/layout.tsx            # Root layout
├── tsconfig.json                 # TypeScript config ✅ **ADDED** - Path aliases
├── package.json                  # Dependencies ✅ **ENHANCED** - Script documentation
├── AGENT_OPERATION_MANUAL.md     # Complete instructions ✅ **UPDATED** - Cross-links
├── PROGRESS_CHECKLIST.md         # Task tracking ✅ **UPDATED** - Latest progress
├── DEVELOPMENT_GUIDELINES.md     # Coding standards
├── 14_PENDING_DOCS.md           # ✅ **RESOLVED** - All issues fixed
├── 15_FIXING_INSTRUCTION.md     # Step-by-step fixing procedures
├── 16_CHAT_AGENT_INTEGRATION.md # Interactive chat agent plan
└── README_FOR_AI_AGENT.md       # ✅ **ENHANCED** - Mermaid preview instructions
🎯 CRITICAL PATH TASKS
Week 1: Foundation
Database Schema (22 tasks) - 40 hours
Authentication Setup (12 tasks) - 24 hours
Basic API Structure (10 tasks) - 20 hours
Chat Agent Architecture (4 tasks) - 30 hours
Week 2-3: Core Features
User Management APIs (8 tasks) - 32 hours
Frontend Authentication (6 tasks) - 18 hours
Dashboard Layouts (8 tasks) - 40 hours
📊 ESSENTIAL DATA MODELS
Core Entities (Must Implement First)
prisma

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
// 1. User (Base entity)
model User {
  id         String    @id @default(cuid())
  role       UserRole  // SUPER_ADMIN, MODERATOR, COMPANY, CAREGIVER, GUARDIAN, PATIENT
  phone      String    @unique  // +8801XXXXXXXXX format
  email      String?   @unique
  passwordHash String  @map("password_hash")
  // ... other fields
}

// 2. Company (Caregiver companies)
model Company {
  id            String @id @default(cuid())
  userId        String @unique
  companyName   String @map("company_name")
  tradeLicense  String @map("trade_license")
  isVerified    Boolean @default(false) @map("is_verified")
  // ... other fields
}

// 3. Caregiver (Service providers)
model Caregiver {
  id                String @id @default(cuid())
  userId            String @unique
  companyId         String?
  nid               String @unique
  skills            Json   // ["medication_mgmt", "mobility_assist"]
  isVerified        Boolean @default(false) @map("is_verified")
  // ... other fields
}

// 4. Patient (Care recipients)
model Patient {
  id           String @id @default(cuid())
  guardianId   String @map("guardian_id")
  name         String
  dateOfBirth  DateTime @map("date_of_birth")
  // ... other fields
}

// 5. Job (Care assignments)
model Job {
  id           String @id @default(cuid())
  packageId    String @map("package_id")
  patientId    String @map("patient_id")
  companyId    String @map("company_id")
  guardianId   String @map("guardian_id")
  status       JobStatus @default(PENDING_ASSIGNMENT)
  // ... other fields
}
🔐 AUTHENTICATION REQUIREMENTS
Bangladesh-Specific
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
// Phone validation: +8801XXXXXXXXX or 01XXXXXXXXX
const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;

// Roles with MFA requirement
const mfaRequiredRoles = ['COMPANY', 'MODERATOR', 'SUPER_ADMIN'];

// JWT token configuration
const ACCESS_TOKEN_EXPIRY = '15 minutes';
const REFRESH_TOKEN_EXPIRY = '7 days';
Authentication Flow
User Registration → Phone + OTP verification
Login → Phone/Email + Password → JWT tokens
MFA → Required for companies/moderators
Role-Based Access → Different dashboards per role
🌐 API ENDPOINT STRUCTURE
Standard Pattern
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
⌄
⌄
// src/app/api/[resource]/route.ts
export async function GET(request: NextRequest) {
  // 1. Authentication check
  // 2. Authorization check
  // 3. Query parameters
  // 4. Database query
  // 5. Response formatting
}

export async function POST(request: NextRequest) {
  // 1. Request body validation
  // 2. Business logic
  // 3. Database operation
  // 4. Response
}
Critical Endpoints (Implement First)

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
🔐 Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/verify-otp
POST   /api/auth/refresh-token

👥 Users:
GET    /api/users
POST   /api/users
GET    /api/users/[id]
PUT    /api/users/[id]

🏢 Companies:
GET    /api/companies
POST   /api/companies
PUT    /api/companies/[id]

👨‍⚕️ Caregivers:
GET    /api/caregivers
POST   /api/caregivers
PUT    /api/caregivers/[id]

📦 Packages:
GET    /api/packages
POST   /api/packages
GET    /api/packages/[id]

💼 Jobs:
GET    /api/jobs
POST   /api/jobs
PUT    /api/jobs/[id]

💳 Payments:
POST   /api/payments/create
POST   /api/payments/bkash/callback
GET    /api/payments/[id]
🎨 FRONTEND COMPONENTS
Required shadcn/ui Components (Already Available)
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
// From existing components/ui/
✅ button.tsx
✅ input.tsx
✅ card.tsx
✅ form.tsx
✅ table.tsx
✅ dialog.tsx
✅ toast.tsx
✅ badge.tsx
✅ avatar.tsx
✅ select.tsx
✅ textarea.tsx
✅ checkbox.tsx
✅ radio-group.tsx
✅ switch.tsx
✅ tabs.tsx
✅ accordion.tsx
✅ dropdown-menu.tsx
✅ navigation-menu.tsx
✅ sidebar.tsx
✅ sheet.tsx
✅ alert.tsx
✅ alert-dialog.tsx
✅ progress.tsx
✅ skeleton.tsx
✅ separator.tsx
✅ tooltip.tsx
✅ popover.tsx
✅ scroll-area.tsx
✅ breadcrumb.tsx
✅ calendar.tsx
✅ command.tsx
✅ chart.tsx
✅ resizable.tsx
✅ aspect-ratio.tsx
✅ hover-card.tsx
✅ context-menu.tsx
✅ menubar.tsx
�sonner.tsx
✅ toaster.tsx
✅ pagination.tsx
✅ carousel.tsx
✅ toggle.tsx
✅ toggle-group.tsx
✅ collapsible.tsx
✅ drawer.tsx
✅ input-otp.tsx
✅ label.tsx
Custom Components to Create

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
📝 Forms:
- UserRegistrationForm
- CompanyRegistrationForm
- CaregiverProfileForm
- PatientRegistrationForm
- PackageBuilderForm
- JobAssignmentForm

📊 Cards:
- PatientCard
- JobCard
- CaregiverCard
- CompanyCard
- PackageCard

📈 Charts:
- RevenueChart
- JobStatusChart
- CaregiverUtilizationChart
- PatientGrowthChart

🎛️ Layout:
- DashboardLayout
- Sidebar
- Header
- Footer
- Navigation
💳 PAYMENT INTEGRATION
bKash Configuration
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
// Environment variables required:
BKASH_BASE_URL=https://checkout.sandbox.bka.sh/v1.2.0-beta
BKASH_APP_KEY=your_app_key
BKASH_APP_SECRET=your_app_secret
BKASH_USERNAME=your_username
BKASH_PASSWORD=your_password

// Integration steps:
1. Get grant token
2. Create payment
3. Redirect user to bKash URL
4. Handle callback
5. Verify payment status
Nagad Configuration
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
// Environment variables required:
NAGAD_BASE_URL=https://api.mynagad.com
NAGAD_MERCHANT_ID=your_merchant_id
NAGAD_PUBLIC_KEY=your_public_key
NAGAD_PRIVATE_KEY=your_private_key
📱 MOBILE APP (React Native)
Key Screens

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
📱 Caregiver App Screens:
1. Login/Registration
2. Home Dashboard
3. Job List
4. Job Details
5. Check-in/Check-out
6. Care Logging
7. Earnings
8. Profile
9. Settings
Critical Features
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
// Must implement:
✅ GPS-based check-in/check-out
✅ Photo capture for verification
✅ Offline data sync
✅ Push notifications
✅ Bengali language support
✅ Touch-friendly UI (44px minimum)
🌍 LOCALIZATION
Translation Keys Structure
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
⌄
⌄
⌄
⌄
// Bengali translations needed:
{
  "auth": {
    "login": "লগইন",
    "register": "নিবন্ধন করুন",
    "phone": "ফোন নম্বর",
    "password": "পাসওয়ার্ড"
  },
  "dashboard": {
    "welcome": "স্বাগতম",
    "patients": "রোগীরা",
    "jobs": "কাজ",
    "earnings": "আয়"
  },
  "payment": {
    "bkash": "বিকাশ",
    "nagad": "নগদ",
    "pay": "পেমেন্ট করুন"
  }
}
🔒 SECURITY CHECKLIST
Must Implement
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
✅ Input validation (Zod schemas)
✅ SQL injection prevention (Prisma)
✅ XSS protection (DOM sanitization)
✅ CSRF protection (SameSite cookies)
✅ Rate limiting (Redis)
✅ Password hashing (bcrypt, 12 rounds)
✅ JWT token security (short expiry)
✅ File upload validation
✅ HTTPS enforcement
✅ Security headers (CSP, HSTS)
📊 SUCCESS METRICS
Phase 1 MVP Targets

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
📈 Business Metrics:
- 5 pilot companies onboarded
- 50 caregivers verified
- 200 patients registered
- 100 jobs completed
- 95%+ payment success rate

🚀 Technical Metrics:
- Page load < 2 seconds
- API response < 500ms
- 99.9% uptime
- Zero security vulnerabilities
- Mobile responsive design
🚨 COMMON PITFALLS TO AVOID
Database
❌ Don't use hard deletes (use soft deletes with deletedAt)
❌ Don't forget indexes on foreign keys
❌ Don't ignore data validation at database level

Authentication
❌ Don't store passwords in plain text
❌ Don't use long-lived JWT tokens
❌ Don't skip MFA for admin roles

Frontend
❌ Don't ignore mobile responsiveness
❌ Don't forget accessibility (WCAG 2.1 AA)
❌ Don't use client-side secrets

API
❌ Don't skip input validation
❌ Don't ignore error handling
❌ Don't expose sensitive data

🛠️ DEVELOPMENT COMMANDS
Database
bash

Line Wrapping

Collapse
Copy
1
2
3
4
npx prisma migrate dev    # Create and apply migration
npx prisma generate       # Generate Prisma client
npx prisma studio         # Open database browser
npx prisma db seed        # Seed database with test data
Development
bash

Line Wrapping

Collapse
Copy
1
2
3
4
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Check code quality
npm run type-check       # TypeScript validation
Testing
bash

Line Wrapping

Collapse
Copy
1
2
3
npm test                 # Run unit tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
📞 EMERGENCY CONTACTS (Internal)
System Failures
typescript

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
// Database issues:
// Check: prisma/schema.prisma, database connection, migrations

// Authentication failures:
// Check: JWT secrets, token validation, role permissions

// Payment issues:
// Check: Gateway credentials, webhook URLs, escrow logic

// Performance issues:
// Check: Database queries, API response times, bundle size
📋 QUICK START CHECKLIST
Day 1 Tasks
 Review all resource documents
 Update prisma/schema.prisma with User entity
 Set up database connection
 Create basic API structure
 Update PROGRESS_CHECKLIST.md
Day 2 Tasks
 Complete remaining database entities
 Run first migration
 Create seed data
 Set up authentication utilities
 Begin user registration API
Day 3 Tasks
 Complete authentication APIs
 Create basic frontend structure
 Implement login/registration pages
 Set up role-based routing
 Test complete auth flow
Remember: Update PROGRESS_CHECKLIST.md after every task completion!

📋 **CURRENT PROJECT STATUS** (as of 2025-01-17)
- Overall Completion: 72%
- Tasks Completed: 115/165
- Critical Tasks: 50/50 (100%) ✅
- High Priority: 55/55 (100%) ✅
- Medium Priority: 10/30 (33%) 🔄

🎯 **NEXT FOCUS AREAS**
1. Complete remaining Medium Priority tasks in Testing & Quality Assurance
2. Implement comprehensive test coverage for all API endpoints
3. Add integration tests for user workflows
4. Performance optimization and monitoring setup
5. Security audit and penetration testing preparation

📞 **QUICK HELP REFERENCES**
- Database Issues: Check prisma/schema.prisma, src/lib/db.ts, and migrations
- Authentication Issues: Check src/lib/auth.ts, JWT configuration, and role permissions
- Phone Validation: Fixed Bangladesh prefix extraction in src/lib/validations/phone.ts
- TypeScript Issues: Check tsconfig.json for path aliases and strict mode settings
- Build Issues: Check package.json scripts and environment variables
