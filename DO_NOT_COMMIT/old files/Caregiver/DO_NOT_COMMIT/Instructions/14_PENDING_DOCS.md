# Pending Documentation Tasks

This file tracks remaining documentation corrections and small doc-related tasks. I'll complete them one-by-one and mark them off as I finish them.

## Status of Fixes from 15_FIXING_INSTRUCTION.md

### ✅ Completed Fixes

- [x] **Technology Stack Clarification** — Updated README and Technical Architecture to explicitly state Next.js 15 full-stack with optional NestJS
- [x] **Prisma Schema Template** — Added basic prisma/schema.prisma with generator/datasource and example models
- [x] **Environment Variables Documentation** — Enhanced README with sandbox credentials guidance and example values
- [x] **Seed Data Script** — Created prisma/seed.ts with password hashing and Super Admin creation
- [x] **Rate Limiting Guide** — Added Upstash Redis implementation to Development Guidelines
- [x] **New Documentation Files** — Created 12_TROUBLESHOOTING_GUIDE.md and 13_DEPLOYMENT_CHECKLIST_DETAILED.md
- [x] **Error State Diagrams** — Added payment, authentication, and webhook error handling flows to UX Flow document
- [x] **Time Estimates** — Updated some task estimates in Progress Checklist (e.g., bKash integration, Guardian Dashboard)

### ✅ Recently Completed Fixes

- [x] **Fix Prisma Schema Syntax Errors** — Added missing ChatAnalyticsEvent and ChatSession models for chat analytics
- [x] **Fix Phone Validation Logic** — Fixed Bangladesh phone regex prefix extraction logic
- [x] **Complete Seed Script** — Seed script already has all required fields and correct import paths
- [x] **Add Missing Database Connection File** — Database connection file already exists at src/lib/db.ts
- [x] **Add TypeScript Configuration** — TypeScript configuration already exists with path aliases

### ❌ Still Pending Fixes

- [ ] Add "how to preview docs/mermaid diagrams locally" guidance to `01 README_FOR_AI_AGENT.md` or `02 QUICK_REFERENCE.md`
- [ ] Update PRD to explicitly state Next.js 15 and whether API routes are used vs external backend — `06 01 PRD_CaregiverSolution.md`
- [ ] Add package.json scripts documentation for development, testing, and deployment
- [ ] Add more comprehensive seed data examples beyond Super Admin
- [ ] (Optional) Cross-link updated docs in `AGENT_OPERATION_MANUAL.md` and `Quick Access Cheat Sheet.md`

### 🔧 Critical Issues to Address

1. **Prisma Schema Issues** (prisma/schema.prisma):
   - User.name is marked as optional but should be required
   - Missing some fields from the data model document
   - Some relationship definitions are incomplete

2. **Phone Validation Bug** (09 DEVELOPMENT_GUIDELINES.md, line 373-375):
   - The substring logic for extracting operator prefix is incorrect
   - After removing +880 or 0, only 2 digits remain (13, 17) not 3 (013, 017)

3. **Seed Script Issues** (prisma/seed.ts):
   - Missing required fields for User model (name is required in schema)
   - Should include more comprehensive seed data for testing

4. **Missing Configuration Files**:
   - src/lib/db.ts (database connection)
   - tsconfig.json (path aliases)

Notes:
- I'll edit and complete each item in this file as I finish it. Open issues will remain unchecked.
- Last updated: 2025-11-13 based on analysis of 15_FIXING_INSTRUCTION.md
