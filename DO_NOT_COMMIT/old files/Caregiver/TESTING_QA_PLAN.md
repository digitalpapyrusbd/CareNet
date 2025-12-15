# Phase 7: Testing & QA Implementation Plan

## Overview
**Status:** 0% Complete (0/13 tasks)  
**Estimated Time:** 20 hours total  
**Target:** 80% code coverage, >90 Lighthouse scores, WCAG 2.1 AA compliance

---

## Testing Strategy

### 1. Frontend Testing (Jest + React Testing Library)
**Tools:** Jest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event

#### Setup Required
- Install testing dependencies
- Configure jest.config.js for Next.js
- Create setupTests.ts with custom matchers
- Configure coverage thresholds

#### Test Categories
1. **Unit Tests** - Individual components and utilities
2. **Integration Tests** - Component interactions and API calls
3. **E2E Tests** - Complete user flows (Playwright)

---

### 2. Backend Testing (Jest + Supertest)
**Tools:** Jest, supertest, @nestjs/testing

#### Test Categories
1. **Controller Tests** - API endpoints with mocked services
2. **Service Tests** - Business logic with mocked Prisma
3. **Integration Tests** - Full request/response cycle

---

## Task Breakdown

### TEST-001: Frontend Testing Setup ⏸️
**Priority:** High  
**Time:** 1 hour

**Actions:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

**Files to Create:**
- `jest.config.js` - Next.js configuration
- `jest.setup.js` - Global test setup
- `__tests__/setup.ts` - Custom matchers

**Configuration:**
```javascript
// jest.config.js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
},
testEnvironment: 'jest-environment-jsdom',
setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
```

---

### TEST-002: UI Component Tests ⏸️
**Priority:** Medium  
**Time:** 2 hours  
**Target Coverage:** 90%

**Components to Test:**
- `Button.tsx` - Variants, sizes, onClick, disabled, haptic feedback
- `Input.tsx` - Value changes, error states, validation
- `Select.tsx` - Options rendering, onChange, children vs options prop
- `Card.tsx` - Content rendering, className merging
- `Modal.tsx` - Open/close, backdrop click

**Test Example:**
```typescript
// __tests__/components/ui/Button.test.tsx
describe('Button', () => {
  it('renders with correct variant classes', () => {
    const { container } = render(<Button variant="primary">Click</Button>);
    expect(container.firstChild).toHaveClass('bg-primary-600');
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('vibrates on click if navigator.vibrate exists', () => {
    const vibrate = jest.fn();
    Object.defineProperty(navigator, 'vibrate', { value: vibrate });
    render(<Button>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(vibrate).toHaveBeenCalledWith(10);
  });
});
```

---

### TEST-003: Auth Flow Tests ⏸️
**Priority:** High  
**Time:** 2 hours

**Flows to Test:**
1. Login with phone + OTP
2. Registration (Guardian, Caregiver, Company)
3. MFA setup
4. Password reset
5. Token refresh

**Mock Strategy:**
```typescript
// Mock api-client
jest.mock('@/lib/api-client', () => ({
  apiCall: jest.fn(),
}));

// Test example
it('submits login form successfully', async () => {
  (apiCall as jest.Mock).mockResolvedValue({
    accessToken: 'token123',
    user: { id: '1', role: 'GUARDIAN' }
  });

  render(<LoginPage />);
  fireEvent.change(screen.getByLabelText('Phone'), {
    target: { value: '+8801712345678' }
  });
  fireEvent.click(screen.getByText('Send OTP'));

  await waitFor(() => {
    expect(apiCall).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone: '+8801712345678' })
    });
  });
});
```

---

### TEST-004: Payment Integration Tests ⏸️
**Priority:** High  
**Time:** 2 hours

**Scenarios:**
- bKash checkout flow (mock createPayment, executePayment)
- Nagad payment flow (mock initiatePayment, confirmPayment)
- Payment callback handling (success, failure, cancelled)
- Escrow record verification
- Refund processing

**Test Data:**
```typescript
const mockBkashResponse = {
  paymentID: 'TR0011234567890',
  bkashURL: 'https://sandbox.bka.sh/pay/...',
  status: 'SUCCESS'
};

const mockPayment = {
  id: 'pay_123',
  jobId: 'job_123',
  amount: 5000,
  status: 'PENDING',
  method: 'BKASH'
};
```

---

### TEST-005: Mobile PWA Tests ⏸️
**Priority:** Medium  
**Time:** 2 hours

**Components:**
- `MobileJobCard` - Swipe gestures (left/right)
- `MobileCareLog` - Tab switching, form submission
- `MobileEarnings` - Chart rendering, CSV export
- `PullToRefresh` - Pull threshold, loading state
- `use-pull-to-refresh` - Touch event handling

**Mock Touch Events:**
```typescript
const createTouchEvent = (type: string, clientY: number) => {
  return new TouchEvent(type, {
    touches: [{ clientY } as Touch]
  });
};

it('triggers refresh when pulled beyond threshold', async () => {
  const onRefresh = jest.fn();
  render(<PullToRefresh onRefresh={onRefresh}>Content</PullToRefresh>);

  fireEvent(window, createTouchEvent('touchstart', 100));
  fireEvent(window, createTouchEvent('touchmove', 200)); // +100px
  fireEvent(window, createTouchEvent('touchend', 200));

  await waitFor(() => {
    expect(onRefresh).toHaveBeenCalled();
  });
});
```

---

### TEST-006: Backend API Tests ⏸️
**Priority:** High  
**Time:** 3 hours

**Controllers to Test:**
1. CareLogsController (5 endpoints)
2. FeedbacksController (4 endpoints)
3. DisputesController (5 endpoints)
4. NotificationsController (3 endpoints)
5. AnalyticsController (5 endpoints)

**NestJS Test Setup:**
```typescript
// care-logs.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CareLogsController } from './care-logs.controller';
import { CareLogsService } from './care-logs.service';
import { PrismaService } from '../common/prisma/prisma.service';

describe('CareLogsController', () => {
  let controller: CareLogsController;
  let service: CareLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CareLogsController],
      providers: [
        CareLogsService,
        {
          provide: PrismaService,
          useValue: {
            care_logs: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            }
          }
        }
      ],
    }).compile();

    controller = module.get<CareLogsController>(CareLogsController);
    service = module.get<CareLogsService>(CareLogsService);
  });

  it('should create care log', async () => {
    const dto = { jobId: 'job_123', logType: 'VITALS', details: {} };
    const expected = { id: 'log_123', ...dto };
    
    jest.spyOn(service, 'create').mockResolvedValue(expected);

    const result = await controller.create(dto);
    expect(result).toEqual(expected);
  });
});
```

---

### TEST-007: Payment Service Tests ⏸️
**Priority:** High  
**Time:** 2 hours

**Services:**
- `bKashService` - createPayment, executePayment, refund, verifySignature
- `NagadService` - initiatePayment, confirmPayment, verifySignature
- `EscrowService` - lockFunds, releaseFunds, refund

**Mock External APIs:**
```typescript
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('bKashService', () => {
  it('creates payment successfully', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { paymentID: 'TR0011234567890', bkashURL: '...' }
    });

    const result = await bKashService.createPayment({
      amount: 5000,
      orderId: 'order_123'
    });

    expect(result.paymentID).toBe('TR0011234567890');
  });

  it('verifies webhook signature correctly', () => {
    const payload = { paymentID: 'TR001', status: 'SUCCESS' };
    const signature = bKashService.generateSignature(payload);
    
    expect(bKashService.verifySignature(payload, signature)).toBe(true);
  });
});
```

---

### TEST-008: E2E Critical Flows ⏸️
**Priority:** High  
**Time:** 3 hours

**Install Playwright:**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Flows to Test:**
1. **Guardian Registration → Package Purchase → Job Creation**
2. **Caregiver Registration → Job Application → Assignment**
3. **Login → Dashboard → Care Log Submission**
4. **Payment Flow → Escrow Lock → Release**
5. **Dispute Creation → Resolution**

**Example E2E Test:**
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('complete guardian registration flow', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/register');
  
  // Fill registration form
  await page.fill('[name="name"]', 'Test Guardian');
  await page.fill('[name="phone"]', '+8801712345678');
  await page.fill('[name="password"]', 'Password123!');
  await page.selectOption('[name="role"]', 'GUARDIAN');
  
  // Submit and wait for redirect
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  // Verify dashboard loaded
  expect(await page.textContent('h1')).toContain('Dashboard');
});

test('complete payment flow', async ({ page, context }) => {
  // Login first
  await page.goto('http://localhost:3000/auth/login');
  await page.fill('[name="phone"]', '+8801712345678');
  await page.click('text=Send OTP');
  await page.fill('[name="otp"]', '123456'); // Mock OTP
  await page.click('text=Login');
  
  // Navigate to package
  await page.goto('http://localhost:3000/packages');
  await page.click('text=Purchase >> nth=0');
  
  // Select payment method
  await page.click('text=bKash');
  
  // Mock payment gateway (intercept)
  await page.route('**/payments/bkash/create', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        paymentID: 'TR001',
        bkashURL: 'https://sandbox.bka.sh/pay/...'
      })
    });
  });
  
  await page.click('text=Proceed to Payment');
  
  // Verify redirect to bKash
  await page.waitForURL('**/bka.sh/**');
});
```

---

### TEST-009: Performance Testing ⏸️
**Priority:** High  
**Time:** 2 hours

**Lighthouse CI Setup:**
```bash
npm install --save-dev @lhci/cli
```

**Configuration (`lighthouserc.json`):**
```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/dashboard",
        "http://localhost:3000/jobs",
        "http://localhost:3000/payments"
      ],
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "throttling": {
          "rttMs": 40,
          "throughputKbps": 10240
        }
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    }
  }
}
```

**Run Commands:**
```bash
# Build production
npm run build
npm start

# Run Lighthouse in another terminal
npx lhci autorun

# Test with 3G throttling
npx lhci autorun --collect.settings.preset=mobile --collect.settings.throttling.rttMs=150 --collect.settings.throttling.throughputKbps=1600
```

**Manual Checks:**
- Page load time <2s on broadband
- Page load time <3s on 3G
- Time to Interactive <3.5s
- Bundle size <300KB (main chunk)
- Image optimization (WebP/AVIF)

---

### TEST-010: Accessibility Audit ⏸️
**Priority:** High  
**Time:** 1.5 hours

**Install axe-core:**
```bash
npm install --save-dev @axe-core/react jest-axe
```

**Automated Tests:**
```typescript
// __tests__/a11y/dashboard.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';
import Dashboard from '@/app/dashboard/page';

expect.extend(toHaveNoViolations);

describe('Dashboard Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Manual Checks:**
- ✅ Keyboard navigation (Tab, Shift+Tab, Enter, Esc)
- ✅ Focus indicators visible (outline: 2px solid)
- ✅ Color contrast >4.5:1 for text, >3:1 for large text
- ✅ Form labels associated with inputs
- ✅ ARIA labels on icon buttons
- ✅ Heading hierarchy (h1 → h2 → h3)
- ✅ Alt text on images
- ✅ Screen reader testing (NVDA on Windows, VoiceOver on Mac)

---

### TEST-011: Security Audit ⏸️
**Priority:** Critical  
**Time:** 2 hours

**Checklist:**

1. **SQL Injection Prevention**
   - ✅ All Prisma queries use parameterized queries
   - ✅ No raw SQL with user input
   - ✅ `findUnique({ where: { id: userId } })` pattern

2. **XSS Protection**
   - ✅ React escapes variables by default
   - ✅ No `dangerouslySetInnerHTML` with user content
   - ✅ Input sanitization for rich text (if any)

3. **Authentication Security**
   - ✅ JWT tokens: 15min access, 7day refresh
   - ✅ Passwords hashed with bcrypt (10 rounds)
   - ✅ MFA enabled for admin roles
   - ✅ OTP expiration (5 minutes)
   - ✅ Rate limiting on login (5 attempts/15min)

4. **Authorization**
   - ✅ Role-based guards on all protected routes
   - ✅ User can only access own data (userId check)
   - ✅ Admin-only endpoints protected

5. **HTTPS/CORS**
   - ✅ HTTPS enforced in production
   - ✅ CORS whitelist configured
   - ✅ Secure cookies (httpOnly, secure, sameSite)

6. **Rate Limiting**
   - ✅ Auth endpoints: 5 req/15min
   - ✅ Payment endpoints: 10 req/min
   - ✅ API endpoints: 100 req/15min

**Tools:**
```bash
# NPM audit
npm audit

# Dependency vulnerabilities
npm audit fix

# OWASP Dependency Check (optional)
npx audit-ci --moderate
```

---

### TEST-012: Database Optimization ⏸️
**Priority:** Medium  
**Time:** 1.5 hours

**Enable Query Logging:**
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}
```

**Identify Slow Queries:**
```bash
# Run backend with query logging
cd backend
npm run start:dev

# Monitor logs for slow queries (>100ms)
```

**Optimization Checklist:**
- ✅ All foreign keys indexed
- ✅ Pagination on lists (`take`, `skip`)
- ✅ Select specific fields (avoid `select *`)
- ✅ Use `include` carefully (avoid N+1)
- ✅ Composite indexes on frequent queries

**Add Missing Indexes:**
```prisma
// Example
model Job {
  @@index([status, startDate])
  @@index([companyId, status])
  @@index([guardianId, status])
}
```

**Caching Strategy:**
- Analytics endpoints: Cache 5min
- User profile: Cache 1min
- Public data (packages): Cache 15min

---

### TEST-013: Code Coverage Analysis ⏸️
**Priority:** Medium  
**Time:** 1 hour

**Run Coverage:**
```bash
# Frontend
npm test -- --coverage --watchAll=false

# Backend
cd backend
npm test -- --coverage
```

**Coverage Targets:**
| Metric | Target | Critical |
|--------|--------|----------|
| Statements | 85% | 90% |
| Branches | 75% | 80% |
| Functions | 80% | 85% |
| Lines | 85% | 90% |

**Priority Coverage:**
1. **Critical Business Logic:** 95%
   - Escrow operations
   - Payment processing
   - Rating calculations
2. **API Endpoints:** 90%
3. **Services:** 85%
4. **Components:** 80%
5. **Utilities:** 90%

**Uncovered Code Report:**
```bash
# Generate HTML report
npm test -- --coverage --coverageReporters=html

# Open in browser
open coverage/index.html
```

**Actions:**
1. Identify untested critical paths
2. Write tests for red areas
3. Add integration tests for edge cases
4. Update coverage config in `jest.config.js`

---

## Testing Execution Order

### Phase 1: Setup & Infrastructure (2 hours)
1. TEST-001: Frontend testing setup
2. Install Playwright for E2E

### Phase 2: Unit Tests (6 hours)
3. TEST-002: UI component tests
4. TEST-006: Backend API tests
5. TEST-007: Payment service tests

### Phase 3: Integration Tests (4 hours)
6. TEST-003: Auth flow tests
7. TEST-004: Payment integration tests
8. TEST-005: Mobile PWA tests

### Phase 4: E2E & Performance (5 hours)
9. TEST-008: E2E critical flows
10. TEST-009: Performance testing

### Phase 5: Quality Assurance (3 hours)
11. TEST-010: Accessibility audit
12. TEST-011: Security audit
13. TEST-012: Database optimization
14. TEST-013: Code coverage analysis

---

## Success Metrics

### Must-Have (Phase 7 Complete)
- ✅ 80% overall code coverage
- ✅ All critical flows E2E tested
- ✅ Lighthouse Performance >90
- ✅ Lighthouse Accessibility >95
- ✅ Zero high/critical security vulnerabilities
- ✅ All auth flows tested
- ✅ Payment flows tested (mocked)

### Nice-to-Have
- 90% code coverage
- Lighthouse PWA score 100
- Automated visual regression tests
- Load testing (1000 concurrent users)
- Chaos testing (network failures)

---

## Next Steps After Phase 7

**Phase 8: Deployment**
1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Configure production database (Neon)
4. Set up monitoring (Sentry, LogRocket)
5. Load testing on staging
6. Production launch

---

## Testing Commands Reference

```bash
# Frontend tests
npm test                          # Watch mode
npm test -- --coverage            # With coverage
npm test -- --updateSnapshot      # Update snapshots

# Backend tests
cd backend
npm test                          # All tests
npm test:watch                    # Watch mode
npm test:cov                      # Coverage
npm test:e2e                      # E2E tests

# E2E tests
npx playwright test               # Run all
npx playwright test --headed      # With browser
npx playwright test --debug       # Debug mode
npx playwright show-report        # View report

# Lighthouse
npx lhci autorun                  # Run audit
npx lhci upload                   # Upload results

# Accessibility
npm run test:a11y                 # Custom script
```

---

## Files to Create

1. `jest.config.js` - Jest configuration
2. `jest.setup.js` - Global setup
3. `playwright.config.ts` - Playwright config
4. `lighthouserc.json` - Lighthouse config (already created)
5. `__tests__/` - Test directory structure
6. `.github/workflows/test.yml` - CI/CD tests (optional)

---

**Ready to begin Phase 7!** 🧪

Start with TEST-001 to set up the testing infrastructure.
