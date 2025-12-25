# 📋 CareNet Platform - Manual Testing Guide Index

**Date Created:** December 25, 2025  
**Platform:** CareNet Healthcare Platform  
**Version:** 1.0  
**Total Entities:** 9 User Roles  

---

## 📚 Overview

This directory contains comprehensive manual testing guides for each entity/user role in the CareNet platform. Each file provides step-by-step test cases, expected outcomes, and verification criteria.

---

## 📂 Testing Files Structure

### **Administrative Roles**

| File | Entity | Pages | Status | Est. Time |
|------|--------|-------|--------|-----------|
| [TESTER_MANUAL_SUPERADMIN.md](TESTER_MANUAL_SUPERADMIN.md) | Super Admin | 45 | ✅ Complete | 2-3 hours |
| [TESTER_MANUAL_MODERATOR.md](TESTER_MANUAL_MODERATOR.md) | Moderator | 38 | ✅ Complete | 2-2.5 hours |

### **Agency Roles**

| File | Entity | Pages | Status | Est. Time |
|------|--------|-------|--------|-----------|
| [TESTER_MANUAL_AGENCY.md](TESTER_MANUAL_AGENCY.md) | Agency Admin | 41 | ✅ Complete | 2.5-3 hours |
| [TESTER_MANUAL_AGENCY_MANAGER.md](TESTER_MANUAL_AGENCY_MANAGER.md) | Agency Manager | 18 | ✅ Complete | 1-1.5 hours |

### **Service Provider Roles**

| File | Entity | Pages | Status | Est. Time |
|------|--------|-------|--------|-----------|
| [TESTER_MANUAL_CAREGIVER.md](TESTER_MANUAL_CAREGIVER.md) | Caregiver | 35 | ✅ Complete | 2-2.5 hours |

### **Consumer Roles**

| File | Entity | Pages | Status | Est. Time |
|------|--------|-------|--------|-----------|
| [TESTER_MANUAL_GUARDIAN.md](TESTER_MANUAL_GUARDIAN.md) | Guardian | 42 | ✅ Complete | 2-2.5 hours |
| [TESTER_MANUAL_PATIENT.md](TESTER_MANUAL_PATIENT.md) | Patient | 15 | ✅ Complete | 1 hour |

### **Shop Roles**

| File | Entity | Pages | Status | Est. Time |
|------|--------|-------|--------|-----------|
| [TESTER_MANUAL_SHOP.md](TESTER_MANUAL_SHOP.md) | Shop Admin | 12 | ✅ Complete | 1-1.5 hours |
| [TESTER_MANUAL_SHOP_MANAGER.md](TESTER_MANUAL_SHOP_MANAGER.md) | Shop Manager | 13 | ✅ Complete | 1 hour |

### **Cross-Entity Testing**

| File | Scope | Status | Est. Time |
|------|-------|--------|-----------|
| [TESTER_MANUAL_AUTH.md](TESTER_MANUAL_AUTH.md) | Authentication & Common Features | ✅ Complete | 1 hour |

---

## 🚀 Quick Start

### Prerequisites

1. **Development Server Running**
   ```bash
   npm run dev
   ```

2. **Database Seeded**
   ```bash
   cd backend && npm run seed
   ```

3. **Browser Requirements**
   - Modern browser (Chrome, Firefox, Safari, Edge)
   - DevTools enabled
   - LocalStorage accessible

### Test Order Recommendation

For comprehensive testing, follow this order:

1. **TESTER_MANUAL_AUTH.md** - Test common authentication flows first
2. **TESTER_MANUAL_SUPERADMIN.md** - Admin functionality
3. **TESTER_MANUAL_MODERATOR.md** - Moderation features
4. **TESTER_MANUAL_AGENCY.md** - Agency registration & management
5. **TESTER_MANUAL_AGENCY_MANAGER.md** - QA features
6. **TESTER_MANUAL_CAREGIVER.md** - Caregiver registration & jobs
7. **TESTER_MANUAL_GUARDIAN.md** - Consumer journey
8. **TESTER_MANUAL_PATIENT.md** - Patient portal
9. **TESTER_MANUAL_SHOP.md** - Shop management
10. **TESTER_MANUAL_SHOP_MANAGER.md** - Shop employee features

---

## 👤 Test Accounts

### Administrative
| Role | Phone | Password |
|------|-------|----------|
| Super Admin | `+8801712345101` | `Admin@123` |
| Moderator | `+8801712345201` | `Moderator@123` |

### Agency
| Role | Phone | Password |
|------|-------|----------|
| Agency Admin | `+8801712345301` | `Agency@123` |
| Agency Manager | `+8801712345302` | `Manager@123` |

### Caregiver
| Role | Phone | Password |
|------|-------|----------|
| Caregiver | `+8801712345401` | `Caregiver@123` |

### Consumer
| Role | Phone | Password |
|------|-------|----------|
| Guardian | `+8801712345501` | `Guardian@123` |
| Patient | `+8801712345502` | `Patient@123` |

### Shop
| Role | Phone | Password |
|------|-------|----------|
| Shop Admin | `+8801712345601` | `Shop@123` |
| Shop Manager | `+8801712345602` | `ShopMgr@123` |

---

## 📊 Testing Statistics

### Total Test Cases by Entity

| Entity | Auth Tests | Feature Tests | Edge Cases | Total |
|--------|------------|---------------|------------|-------|
| Super Admin | 5 | 35 | 10 | 50 |
| Moderator | 5 | 30 | 8 | 43 |
| Agency | 8 | 40 | 12 | 60 |
| Agency Manager | 3 | 15 | 5 | 23 |
| Caregiver | 8 | 35 | 10 | 53 |
| Guardian | 6 | 38 | 10 | 54 |
| Patient | 3 | 12 | 5 | 20 |
| Shop | 5 | 15 | 5 | 25 |
| Shop Manager | 3 | 12 | 4 | 19 |
| Auth (Common) | 15 | 5 | 8 | 28 |
| **Total** | **61** | **237** | **77** | **375** |

---

## ✅ Test Result Tracking

Use this table to track overall testing progress:

| Entity | Assigned To | Start Date | Complete Date | Pass Rate |
|--------|-------------|------------|---------------|-----------|
| Super Admin | _________ | _________ | _________ | ____% |
| Moderator | _________ | _________ | _________ | ____% |
| Agency | _________ | _________ | _________ | ____% |
| Agency Manager | _________ | _________ | _________ | ____% |
| Caregiver | _________ | _________ | _________ | ____% |
| Guardian | _________ | _________ | _________ | ____% |
| Patient | _________ | _________ | _________ | ____% |
| Shop | _________ | _________ | _________ | ____% |
| Shop Manager | _________ | _________ | _________ | ____% |
| Auth | _________ | _________ | _________ | ____% |

---

## 🐛 Bug Reporting

When you find a bug during testing, document it using this template:

```markdown
## Bug Report

**Test File:** [e.g., TESTER_MANUAL_AGENCY.md]
**Test Case:** [e.g., T2.3 - Package Creation]
**Severity:** [Critical / High / Medium / Low]
**Date Found:** [YYYY-MM-DD]
**Tester:** [Your Name]

### Description
[Brief description of the bug]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happened]

### Screenshots/Evidence
[Attach screenshots or logs]

### Environment
- Browser: [e.g., Chrome 120]
- Device: [e.g., Desktop]
- OS: [e.g., Windows 11]
```

Save bug reports in: `tests/bugs/BUG_[ENTITY]_[DATE]_[SEQUENCE].md`

---

## 📝 Additional Resources

- [MANUAL_TESTING_CHECKLIST.md](MANUAL_TESTING_CHECKLIST.md) - Multilingual testing checklist
- [TESTING_QUICK_REFERENCE.md](TESTING_QUICK_REFERENCE.md) - Quick reference guide
- [README.md](README.md) - Tests directory overview

---

## 🤖 AI Testing Agent Prompt

Copy and use this prompt with **Cursor**, **Aider**, **Claude**, **GPT-4**, or any AI coding assistant to automate testing:

---

### 🎯 MASTER TESTING AGENT PROMPT

```
You are an expert QA testing agent for the CareNet Healthcare Platform. Your task is to systematically test the application following the manual testing documentation.

## PLATFORM OVERVIEW
- **Framework:** Next.js with App Router
- **Base URL:** http://localhost:3000
- **Backend:** NestJS API
- **Database:** PostgreSQL with Prisma ORM
- **Total Portals:** 9 (Admin, Moderator, Agency, Agency Manager, Caregiver, Guardian, Patient, Shop, Shop Manager)

## TEST ACCOUNTS
| Role | Phone | Password | Login URL |
|------|-------|----------|-----------|
| Super Admin | +8801712345101 | Admin@123 | /admin/login |
| Moderator | +8801712345201 | Moderator@123 | /admin/login |
| Agency Admin | +8801712345301 | Agency@123 | /agency/login |
| Agency Manager | +8801712345302 | Manager@123 | /agency-manager/login |
| Caregiver | +8801712345401 | Caregiver@123 | /caregiver/login |
| Guardian | +8801712345501 | Guardian@123 | /guardian/login |
| Patient | +8801712345502 | Patient@123 | /patient/login |
| Shop Admin | +8801712345601 | Shop@123 | /shop/login |
| Shop Manager | +8801712345602 | ShopMgr@123 | /shop-manager/login |

## YOUR TESTING TASKS

### Task 1: Read Testing Documentation
1. Read the test file for the entity I specify: `tests/TESTER_MANUAL_[ENTITY].md`
2. Understand all test phases and test cases
3. Note URLs, expected behaviors, and validation criteria

### Task 2: Execute Tests
For each test case:
1. Navigate to the specified URL
2. Perform the documented actions
3. Verify expected outcomes
4. Record PASS/FAIL with evidence

### Task 3: Report Results
Provide a structured report:
- Test case ID
- Status (PASS/FAIL)
- Actual behavior observed
- Screenshots/logs if failure
- Recommendations for fixes

## TESTING APPROACH

1. **Start with Authentication** - Run TESTER_MANUAL_AUTH.md first
2. **Follow Phase Order** - Complete each phase before moving to next
3. **Verify Each Checkbox** - Every [ ] item must be verified
4. **Test Edge Cases** - Empty inputs, invalid data, boundary conditions
5. **Check Error Handling** - Verify error messages appear correctly
6. **Validate Redirects** - Confirm navigation flows work

## WHAT TO TEST FOR EACH PAGE

- [ ] Page loads without console errors
- [ ] All UI elements render correctly
- [ ] Forms validate inputs properly
- [ ] Submit actions work as expected
- [ ] Success/error messages appear
- [ ] Navigation works correctly
- [ ] Role-based access enforced
- [ ] Data persists after actions
- [ ] Responsive layout (if applicable)

## COMMANDS YOU CAN USE

If you have terminal access:
- `npm run dev` - Start dev server
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run Playwright E2E tests

## OUTPUT FORMAT

After testing, provide:

### Test Summary
| Category | Passed | Failed | Skipped |
|----------|--------|--------|---------|
| Auth     | X      | X      | X       |
| Features | X      | X      | X       |
| ...      | ...    | ...    | ...     |

### Failed Tests Detail
For each failed test:
- **Test ID:** [ID]
- **Description:** [What was tested]
- **Expected:** [What should happen]
- **Actual:** [What happened]
- **Suggested Fix:** [If applicable]

### Recommendations
[Any patterns observed, suggested improvements, etc.]

---

NOW: Tell me which entity to test, or say "test all" for comprehensive testing.
```

---

### 🎯 QUICK ENTITY-SPECIFIC PROMPTS

#### Test Authentication
```
Test the CareNet authentication system. Read tests/TESTER_MANUAL_AUTH.md and execute all test cases. Login to each portal, verify session management, test password reset, and check language switching. Report all findings.
```

#### Test Agency Portal
```
Test the Agency Admin portal for CareNet. Read tests/TESTER_MANUAL_AGENCY.md. Login as Agency Admin (+8801712345301 / Agency@123), then test: registration flow, package management, job posting, caregiver management, and billing. Report PASS/FAIL for each test case.
```

#### Test Caregiver Portal
```
Test the Caregiver portal for CareNet. Read tests/TESTER_MANUAL_CAREGIVER.md. Login as Caregiver (+8801712345401 / Caregiver@123), then test: registration, job applications, check-in/out, care logs, earnings, and profile management. Report findings with evidence.
```

#### Test Guardian Portal
```
Test the Guardian portal for CareNet. Read tests/TESTER_MANUAL_GUARDIAN.md. Login as Guardian (+8801712345501 / Guardian@123), then test: patient management, package browsing, negotiation, checkout, job monitoring, and chat. Report all results.
```

#### Test Admin Portal
```
Test the Super Admin portal for CareNet. Read tests/TESTER_MANUAL_SUPERADMIN.md. Login as Super Admin (+8801712345101 / Admin@123), then test: user management, agency approval, content management, and all admin features. Report comprehensive results.
```

---

### 🎯 PLAYWRIGHT E2E GENERATION PROMPT

```
You are a Playwright test automation expert. Read the manual testing file at tests/TESTER_MANUAL_[ENTITY].md and generate Playwright E2E tests.

## Requirements:
1. Use TypeScript
2. Follow Page Object Model pattern
3. Use test fixtures for authentication
4. Add proper assertions for each test case
5. Include screenshot capture on failure
6. Handle async operations properly

## Output Structure:
tests/e2e/
├── [entity]/
│   ├── [entity].spec.ts      # Main test file
│   ├── [entity].page.ts      # Page Object
│   └── [entity].fixtures.ts  # Test fixtures

## Test Account:
- Phone: [from test accounts table]
- Password: [from test accounts table]
- Login URL: [entity]/login

Generate tests for all phases documented in the manual testing file.
```

---

### 🎯 BUG HUNTING PROMPT

```
You are a security and bug hunting expert testing the CareNet Healthcare Platform.

## Focus Areas:
1. **Authentication Bypass** - Try accessing protected routes without login
2. **Role Escalation** - Can Guardian access Admin routes?
3. **Input Validation** - SQL injection, XSS, invalid data
4. **Session Security** - Token expiry, multi-tab handling
5. **API Security** - Direct API calls without auth
6. **Data Leakage** - Can users see other users' data?

## Test Accounts (use these to test cross-role access):
[See test accounts table above]

## Steps:
1. Login as Role A
2. Try accessing Role B's routes
3. Try manipulating requests to access unauthorized data
4. Test form inputs with malicious data
5. Check browser storage for sensitive data exposure

Report any security vulnerabilities found with:
- Severity (Critical/High/Medium/Low)
- Steps to reproduce
- Potential impact
- Suggested fix
```

---

### 🎯 REGRESSION TESTING PROMPT

```
A code change was made to [DESCRIBE CHANGE]. Run regression tests to ensure nothing broke.

## Regression Test Scope:
1. Read relevant manual test file(s)
2. Focus on features that might be affected
3. Test the changed functionality
4. Test adjacent/related functionality
5. Verify no side effects

## Quick Regression Checklist:
- [ ] Login still works for all roles
- [ ] Dashboard loads for each role
- [ ] CRUD operations still function
- [ ] Navigation works correctly
- [ ] Error handling still works
- [ ] Data validation intact

Report any regressions found with before/after comparison.
```

---

## 🔄 Update History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| Dec 25, 2025 | 1.0 | Initial creation of all entity test files | AI |
| Dec 25, 2025 | 1.1 | Added AI Testing Agent prompts section | AI |

