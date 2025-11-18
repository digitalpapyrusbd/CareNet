AI Agent Development Package - Summary
Project: Caregiver Digital Solution for Bangladesh
Technology Stack: Next.js 15, TypeScript, Prisma, PostgreSQL, Tailwind CSS
Development Status: Ready for AI Agent to Begin

📦 COMPLETE DOCUMENTATION PACKAGE
1. Core Instructions
📋 AGENT_OPERATION_MANUAL.md - Complete operational manual
📊 PROGRESS_CHECKLIST.md - Real-time task tracking (165+ tasks)
📝 DEVELOPMENT_GUIDELINES.md - Technical implementation standards
⚡ QUICK_REFERENCE.md - Rapid access to critical information
🤖 16_CHAT_AGENT_INTEGRATION.md - Interactive chat agent implementation plan
2. Resource Documents (Provided)
01_PRD_CaregiverSolution.md - Product requirements and business logic
02_Technical_Architecture.md - System architecture and integrations
03_Data_Model.md - Complete database schema with 20+ entities
04_UX_Flow_%26_Screens.md - User workflows and design system
05_File_Architecture.md - Project structure and organization
06_Compliance_%26_Metrics.md - Legal requirements and success metrics
🚀 IMMEDIATE NEXT STEPS FOR AI AGENT
Step 1: Foundation Setup (First 24 Hours)
Read AGENT_OPERATION_MANUAL.md - Understand complete workflow
Review QUICK_REFERENCE.md - Get familiar with critical paths
Check PROGRESS_CHECKLIST.md - Understand task structure
Begin with DB-001 - Start database schema implementation
Step 2: Database Implementation (Week 1)
Update prisma/schema.prisma with all entities from Data Model document
Run migrations and set up database connection
Create seed data for development
Test CRUD operations
Step 3: Authentication System (Week 1-2)
Implement JWT-based authentication
Create phone number + OTP login for Bangladesh
Set up role-based access control
Implement MFA for companies and moderators
Step 4: API Development (Week 2-3)
Create user management endpoints
Implement company and caregiver APIs
Build job and package management
Add payment processing endpoints
Step 5: Frontend Development (Week 3-6)
Set up authentication pages
Create role-based dashboards
Implement package purchase flow
Build care logging interface
🎯 CRITICAL SUCCESS FACTORS
1. Bangladesh Market Specifics
Payment Integration: bKash and Nagad gateways mandatory
Phone Format: +8801XXXXXXXXX validation required
Language Support: English/Bengali bilingual interface
Mobile-First: Smartphone-centric design essential
2. Technical Requirements
Security: AES-256 encryption, audit trails, role-based permissions
Performance: Page loads < 2 seconds, API responses < 500ms
Scalability: Support 10K+ concurrent users
Accessibility: WCAG 2.1 AA compliance
3. Business Logic
Multi-Role System: 6 distinct user roles with different permissions
Escrow Payments: Secure payment holding and release
Verification Workflow: Company and caregiver verification by moderators
Rating System: Multi-directional feedback between all user types
📊 PROJECT METRICS & TARGETS
Phase 1 MVP + Chat Agent (14 Weeks)
Development Tasks: 165+ specific tasks tracked in checklist
Critical Path: 50 critical tasks that must be completed
Success Criteria: 5 companies, 50 caregivers, 200 patients, 100 jobs
Quality Gates
Code Quality: Zero ESLint errors, 100% TypeScript coverage
Testing: Unit tests for all critical functions
Security: Pass security audit before deployment
Performance: Meet Core Web Vitals benchmarks
🔧 DEVELOPMENT ENVIRONMENT
Current Setup (standardized)
- Framework: Next.js 15 with App Router (App + API routes)
- Default Backend Model: Next.js full-stack using App Router API routes (recommended)
	- If the team prefers a separate backend service, use NestJS as an independent service. If NestJS is used, remove or disable overlapping API routes in the Next.js app and treat Next as a pure frontend.
- Database: Prisma (PostgreSQL in staging/production; SQLite allowed for isolated local dev)
- UI Components: shadcn/ui library (already installed)
- Styling: Tailwind CSS (already configured)
- Development Server: http://localhost:3000

Prisma starter
The repository expects the Prisma schema at `prisma/schema.prisma`. A starter template has been added at `prisma/schema.prisma` with the minimal generator/datasource, enums and an example `User` model. Update it with entities from the Data Model document.

Required Environment Variables & Sandbox Credentials (development)
Use placeholder values in local development and replace with real sandbox credentials when testing integrations.

## SANDBOX CREDENTIALS (FOR DEVELOPMENT)
# bKash Sandbox: Register at https://developer.bka.sh/
# Nagad Sandbox: Contact Nagad Merchant Support or developer portal
# Twilio: Use test credentials from https://www.twilio.com/console

# Example placeholders for local development (replace before integration tests):
DATABASE_URL="file:./dev.db" # SQLite for local dev; use Postgres in staging/prod

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# bKash (Sandbox)
BKASH_BASE_URL="https://checkout.sandbox.bka.sh/v1.2.0-beta"
BKASH_APP_KEY="sandbox_app_key_placeholder"
BKASH_APP_SECRET="sandbox_app_secret_placeholder"
BKASH_USERNAME="sandbox_username"
BKASH_PASSWORD="sandbox_password"

# Nagad (Sandbox)
NAGAD_BASE_URL="https://api.sandbox.mynagad.com"
NAGAD_MERCHANT_ID="sandbox_nagad_merchant_id"

# Notifications & Email
TWILIO_ACCOUNT_SID="your_twilio_sid"
TWILIO_AUTH_TOKEN="your_twilio_token"
SENDGRID_API_KEY="your_sendgrid_key"

# Redis / Rate limiting (Upstash)
UPSTASH_REDIS_URL="https://us1-upstash-redis.upstash.io"
UPSTASH_REDIS_TOKEN="upstash_token_placeholder"

# File Storage
AWS_ACCESS_KEY_ID="your_aws_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret"
AWS_REGION="ap-south-1"
S3_BUCKET_NAME="caregiver-platform-files"

Seed data & examples
See `prisma/seed.ts` (example) for a minimal seed script that creates a Super Admin user. Update credentials and hash function as required.
📋 TASK MANAGEMENT PROTOCOL
Progress Tracking
Always Update PROGRESS_CHECKLIST.md after completing any task
Mark task status: Not Started → In Progress → Completed
Record actual time vs estimated time
Document blockers immediately when encountered
Update notes for important technical decisions
Communication Protocol
Document all decisions in appropriate files
Update progress every 4 hours minimum
Flag blockers with clear descriptions
Maintain code quality standards throughout
Quality Assurance
Run npm run lint before committing any changes
Test all functionality before marking tasks complete
Follow security guidelines strictly
Maintain TypeScript strict mode compliance
🎨 DESIGN SYSTEM IMPLEMENTATION
Color Palette (Dark Theme Default)
css

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
--color-primary-500: #00AEEF;    /* Main interactive color */
--color-success-main: #3CCF4E;     /* Success states */
--color-error-main: #FF4D4D;        /* Error states */
--color-warning-main: #FFA500;      /* Warning states */
--color-bg-primary: #0e0e0e;        /* Main background */
--color-text-primary: #FFFFFF;      /* Primary text */
Typography
Font Family: Inter, Nunito Sans (English), Kalpurush (Bengali)
Font Sizes: 16px base, 14px minimum
Line Height: 1.5 for body text
Component Standards
Buttons: 48px minimum touch targets
Cards: 8px border radius, 24px padding
Forms: Proper labels, validation states
Navigation: Logical tab order, accessibility support
🌟 KEY DIFFERENTIATORS
1. Compliance & Trust
Verified caregivers with background checks
Transparent rating system
Audit trails for all actions
Secure payment escrow
2. Localization
Full Bengali language support
Bangladesh payment gateway integration
Cultural UX considerations
Local phone number validation
3. Marketplace Model
Multiple caregiving companies on one platform
Unified caregiver verification
Standardized service packages
Transparent pricing
4. Technology Excellence
Modern tech stack (Next.js 15, TypeScript)
Mobile-first responsive design
Real-time notifications
Comprehensive analytics
🚀 LAUNCH READINESS
Pre-Launch Checklist
 All 150+ development tasks completed
 Security audit passed
 Performance benchmarks met
 Payment gateways tested
 Mobile app functional
 Documentation complete
 User acceptance testing passed
Success Metrics
5 pilot companies successfully onboarded
50 caregivers verified and active
200 patients registered
100 jobs completed with ≥4-star rating
95%+ payment success rate
Zero critical security vulnerabilities
📞 SUPPORT & RESOURCES
Documentation Structure

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
📁 Project Root/
├── 📋 AGENT_OPERATION_MANUAL.md    # Complete instructions
├── 📊 PROGRESS_CHECKLIST.md         # Task tracking (UPDATE THIS!)
├── 📝 DEVELOPMENT_GUIDELINES.md     # Technical standards
├── ⚡ QUICK_REFERENCE.md            # Fast access info
├── 📚 docs/                        # Resource documents
│   ├── 01_PRD_CaregiverSolution.md
│   ├── 02_Technical_Architecture.md
│   ├── 03_Data_Model.md
│   ├── 04_UX_Flow_%26_Screens.md
│   ├── 05_File_Architecture.md
│   └── 06_Compliance_%26_Metrics.md
└── 🚀 Current Project Files...
Development Commands
bash

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
# Database
npx prisma migrate dev    # Create migrations
npx prisma generate       # Generate client
npx prisma studio         # Database browser

# Development
npm run dev              # Start server (already running)
npm run build            # Production build
npm run lint             # Code quality check

# Testing
npm test                 # Run tests
npm run test:coverage    # Coverage report

# Documentation Preview
## Previewing Mermaid Diagrams Locally
Many documentation files contain Mermaid diagrams for visualization. To preview them locally:

1. **Install Mermaid CLI**: `npm install -g @mermaid-js/mermaid-cli`
2. **Preview single diagram**: `mmdc -i path/to/diagram.mmd -o output.png`
3. **Live preview with VS Code**: Install "Markdown Preview Mermaid Support" extension
4. **Online preview**: Copy diagram code to https://mermaid.live

This helps visualize complex workflows, database relationships, and system architecture during development.
🎯 FINAL INSTRUCTIONS
For AI Agent:
Start with AGENT_OPERATION_MANUAL.md - Read completely
Use QUICK_REFERENCE.md for daily development
Update PROGRESS_CHECKLIST.md after every task
Follow DEVELOPMENT_GUIDELINES.md for code quality
Reference resource documents for domain knowledge
Success Formula:
Discipline: Update checklist consistently
Quality: Follow all guidelines strictly
Communication: Document decisions and blockers
Focus: Prioritize critical path tasks
Excellence: Aim for production-ready code

