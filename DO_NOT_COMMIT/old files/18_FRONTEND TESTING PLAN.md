# Comprehensive Frontend Testing Plan
## Caregiver Digital Solution - Bangladesh

**Document Version:** 7.0  
**Target Agent:** GPT-5-Codex  
**Project:** Caregiver Platform Frontend Testing  
**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui  
**Testing Framework:** Jest, React Testing Library, Playwright  

---

## 🎯 MISSION OVERVIEW

You are tasked with implementing a comprehensive frontend testing suite for the Caregiver Digital Solution platform. This document provides detailed instructions for setting up and writing tests covering all frontend components, user flows, accessibility, and integration scenarios.

**Testing Goals:**
- 80%+ code coverage for all components
- 100% coverage for critical user flows
- WCAG 2.1 AA accessibility compliance
- Zero critical bugs in production

---

## 📦 PHASE 1: TESTING INFRASTRUCTURE SETUP (2 hours)

### TEST-SETUP-001: Install Testing Dependencies (30 min)

```bash
# Navigate to project root
cd caregiver-platform

# Install core testing libraries
npm install -D jest @types/jest ts-jest

# Install React Testing Library
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Install Playwright for E2E testing
npm install -D @playwright/test

# Install accessibility testing
npm install -D jest-axe @axe-core/react

# Install API mocking
npm install -D msw@latest

# Install additional utilities
npm install -D @testing-library/react-hooks whatwg-fetch
```

### TEST-SETUP-002: Configure Jest (30 min)

**File:** `jest.config.js`
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/app/api/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx)',
    '**/*.(test|spec).(ts|tsx)',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

**File:** `jest.setup.js`
```javascript
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import 'whatwg-fetch';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suppress console errors during tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

### TEST-SETUP-003: Configure Playwright for E2E (30 min)

**File:** `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### TEST-SETUP-004: Configure MSW for API Mocking (30 min)

**File:** `src/mocks/handlers.ts`
```typescript
import { http, HttpResponse } from 'msw';

// Base URL for API
const API_BASE = '/api';

// Mock user data
const mockUsers = {
  guardian: {
    id: 'guardian-001',
    name: 'Test Guardian',
    email: 'guardian@test.com',
    phone: '+8801712345678',
    role: 'GUARDIAN',
    language: 'en',
  },
  company: {
    id: 'company-001',
    name: 'Test Company Admin',
    email: 'company@test.com',
    phone: '+8801812345678',
    role: 'COMPANY',
    language: 'en',
  },
  caregiver: {
    id: 'caregiver-001',
    name: 'Test Caregiver',
    email: 'caregiver@test.com',
    phone: '+8801912345678',
    role: 'CAREGIVER',
    language: 'bn',
  },
  moderator: {
    id: 'moderator-001',
    name: 'Test Moderator',
    email: 'moderator@test.com',
    phone: '+8801612345678',
    role: 'MODERATOR',
    language: 'en',
  },
  superAdmin: {
    id: 'admin-001',
    name: 'Super Admin',
    email: 'admin@test.com',
    phone: '+8801512345678',
    role: 'SUPER_ADMIN',
    language: 'en',
  },
};

// Mock patients
const mockPatients = [
  {
    id: 'patient-001',
    name: 'Mohammad Rahman',
    dateOfBirth: '1945-03-15',
    gender: 'male',
    bloodGroup: 'A+',
    mobilityLevel: 'assisted',
    cognitiveStatus: 'mild_impairment',
    primaryConditions: ['diabetes', 'hypertension'],
    guardianId: 'guardian-001',
  },
  {
    id: 'patient-002',
    name: 'Fatima Begum',
    dateOfBirth: '1950-07-22',
    gender: 'female',
    bloodGroup: 'O+',
    mobilityLevel: 'wheelchair',
    cognitiveStatus: 'normal',
    primaryConditions: ['arthritis'],
    guardianId: 'guardian-001',
  },
];

// Mock packages
const mockPackages = [
  {
    id: 'package-001',
    name: 'Elder Care - Daily',
    description: 'Comprehensive daily care for elderly patients',
    category: 'elderly_care',
    price: 15000,
    durationDays: 30,
    hoursPerDay: 8,
    inclusions: ['medication_mgmt', 'vitals_monitoring', 'mobility_assist'],
    companyId: 'company-001',
    companyName: 'Care Solutions Ltd',
    isActive: true,
  },
  {
    id: 'package-002',
    name: 'Post-Surgery Recovery',
    description: 'Specialized care for post-operative patients',
    category: 'post_surgery',
    price: 25000,
    durationDays: 14,
    hoursPerDay: 12,
    inclusions: ['wound_care', 'medication_mgmt', 'physiotherapy_assist'],
    companyId: 'company-001',
    companyName: 'Care Solutions Ltd',
    isActive: true,
  },
];

// Mock jobs
const mockJobs = [
  {
    id: 'job-001',
    packageId: 'package-001',
    patientId: 'patient-001',
    companyId: 'company-001',
    guardianId: 'guardian-001',
    startDate: '2025-01-20',
    endDate: '2025-02-19',
    status: 'active',
    totalPrice: 15000,
    caregiverId: 'caregiver-001',
    caregiverName: 'Test Caregiver',
  },
];

// Mock care logs
const mockCareLogs = [
  {
    id: 'log-001',
    jobId: 'job-001',
    caregiverId: 'caregiver-001',
    patientId: 'patient-001',
    logType: 'vitals',
    timestamp: '2025-01-20T08:30:00Z',
    data: {
      blood_pressure: { systolic: 120, diastolic: 80 },
      heart_rate: 72,
      temperature: 98.6,
    },
    notes: 'Patient stable, vitals within normal range',
  },
];

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as { phone: string; password: string };
    const { phone } = body;
    
    // Find user by phone
    const user = Object.values(mockUsers).find(u => u.phone === phone);
    if (user) {
      return HttpResponse.json({
        user,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
    }
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: 'new-user-001',
      ...body,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  http.post(`${API_BASE}/auth/send-otp`, async ({ request }) => {
    const body = await request.json() as { phone: string };
    return HttpResponse.json({
      success: true,
      message: 'OTP sent successfully',
      phone: body.phone,
    });
  }),

  http.post(`${API_BASE}/auth/verify-otp`, async ({ request }) => {
    const body = await request.json() as { phone: string; otp: string };
    if (body.otp === '123456') {
      return HttpResponse.json({ verified: true });
    }
    return HttpResponse.json({ error: 'Invalid OTP' }, { status: 400 });
  }),

  http.post(`${API_BASE}/auth/refresh-token`, () => {
    return HttpResponse.json({
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token',
    });
  }),

  http.get(`${API_BASE}/auth/me`, () => {
    return HttpResponse.json(mockUsers.guardian);
  }),

  // User endpoints
  http.get(`${API_BASE}/users`, () => {
    return HttpResponse.json({
      data: Object.values(mockUsers),
      total: Object.keys(mockUsers).length,
      page: 1,
      limit: 10,
    });
  }),

  http.get(`${API_BASE}/users/:id`, ({ params }) => {
    const user = Object.values(mockUsers).find(u => u.id === params.id);
    if (user) {
      return HttpResponse.json(user);
    }
    return HttpResponse.json({ error: 'User not found' }, { status: 404 });
  }),

  // Patient endpoints
  http.get(`${API_BASE}/patients`, () => {
    return HttpResponse.json({
      data: mockPatients,
      total: mockPatients.length,
      page: 1,
      limit: 10,
    });
  }),

  http.get(`${API_BASE}/patients/:id`, ({ params }) => {
    const patient = mockPatients.find(p => p.id === params.id);
    if (patient) {
      return HttpResponse.json(patient);
    }
    return HttpResponse.json({ error: 'Patient not found' }, { status: 404 });
  }),

  http.post(`${API_BASE}/patients`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: 'new-patient-001',
      ...body,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  http.put(`${API_BASE}/patients/:id`, async ({ request, params }) => {
    const body = await request.json() as Record<string, unknown>;
    const patient = mockPatients.find(p => p.id === params.id);
    if (patient) {
      return HttpResponse.json({ ...patient, ...body });
    }
    return HttpResponse.json({ error: 'Patient not found' }, { status: 404 });
  }),

  // Package endpoints
  http.get(`${API_BASE}/packages`, () => {
    return HttpResponse.json({
      data: mockPackages,
      total: mockPackages.length,
      page: 1,
      limit: 10,
    });
  }),

  http.get(`${API_BASE}/packages/:id`, ({ params }) => {
    const pkg = mockPackages.find(p => p.id === params.id);
    if (pkg) {
      return HttpResponse.json(pkg);
    }
    return HttpResponse.json({ error: 'Package not found' }, { status: 404 });
  }),

  http.post(`${API_BASE}/packages`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: 'new-package-001',
      ...body,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  // Job endpoints
  http.get(`${API_BASE}/jobs`, () => {
    return HttpResponse.json({
      data: mockJobs,
      total: mockJobs.length,
      page: 1,
      limit: 10,
    });
  }),

  http.get(`${API_BASE}/jobs/:id`, ({ params }) => {
    const job = mockJobs.find(j => j.id === params.id);
    if (job) {
      return HttpResponse.json(job);
    }
    return HttpResponse.json({ error: 'Job not found' }, { status: 404 });
  }),

  http.post(`${API_BASE}/jobs`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: 'new-job-001',
      ...body,
      status: 'pending_assignment',
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  // Care log endpoints
  http.get(`${API_BASE}/care-logs`, () => {
    return HttpResponse.json({
      data: mockCareLogs,
      total: mockCareLogs.length,
      page: 1,
      limit: 10,
    });
  }),

  http.post(`${API_BASE}/care-logs`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: 'new-log-001',
      ...body,
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  }),

  http.post(`${API_BASE}/care-logs/check-in`, async ({ request }) => {
    const body = await request.json() as { jobId: string; location: { latitude: number; longitude: number } };
    return HttpResponse.json({
      id: 'checkin-001',
      jobId: body.jobId,
      logType: 'check_in',
      location: body.location,
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  }),

  http.post(`${API_BASE}/care-logs/check-out`, async ({ request }) => {
    const body = await request.json() as { jobId: string; location: { latitude: number; longitude: number } };
    return HttpResponse.json({
      id: 'checkout-001',
      jobId: body.jobId,
      logType: 'check_out',
      location: body.location,
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  }),

  // Payment endpoints
  http.post(`${API_BASE}/payments/create`, async ({ request }) => {
    const body = await request.json() as { jobId: string; amount: number; method: string };
    return HttpResponse.json({
      paymentId: 'payment-001',
      checkoutURL: 'https://sandbox.bka.sh/checkout/mock-url',
      invoiceNumber: `INV-${Date.now()}`,
      amount: body.amount,
      method: body.method,
    });
  }),

  http.post(`${API_BASE}/payments/bkash/callback`, async ({ request }) => {
    const body = await request.json() as { paymentID: string; status: string };
    return HttpResponse.json({
      success: body.status === 'success',
      transactionId: 'txn-001',
      paymentId: body.paymentID,
    });
  }),

  // Feedback endpoints
  http.get(`${API_BASE}/feedback`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 'feedback-001',
          jobId: 'job-001',
          reviewerId: 'guardian-001',
          revieweeId: 'caregiver-001',
          rating: 5,
          comments: 'Excellent care provided',
          createdAt: '2025-01-19T10:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    });
  }),

  http.post(`${API_BASE}/feedback`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: 'new-feedback-001',
      ...body,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  // Company endpoints
  http.get(`${API_BASE}/companies`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 'company-001',
          userId: 'company-001',
          companyName: 'Care Solutions Ltd',
          tradeLicense: 'TL123456',
          isVerified: true,
          ratingAvg: 4.5,
          ratingCount: 120,
          specializations: ['elderly_care', 'post_surgery'],
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    });
  }),

  // Caregiver endpoints
  http.get(`${API_BASE}/caregivers`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 'caregiver-001',
          userId: 'caregiver-001',
          name: 'Test Caregiver',
          skills: ['medication_mgmt', 'mobility_assist'],
          isVerified: true,
          isAvailable: true,
          ratingAvg: 4.8,
          totalJobsCompleted: 45,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    });
  }),

  // Moderator endpoints
  http.get(`${API_BASE}/admin/verification-queue`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 'verification-001',
          type: 'company',
          entityId: 'company-002',
          entityName: 'New Care Company',
          submittedAt: '2025-01-18T10:00:00Z',
          status: 'pending',
        },
        {
          id: 'verification-002',
          type: 'caregiver',
          entityId: 'caregiver-002',
          entityName: 'New Caregiver',
          submittedAt: '2025-01-18T11:00:00Z',
          status: 'pending',
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
    });
  }),

  http.get(`${API_BASE}/admin/disputes`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 'dispute-001',
          jobId: 'job-001',
          raisedBy: 'guardian-001',
          against: 'caregiver-001',
          disputeType: 'quality',
          description: 'Caregiver arrived late',
          status: 'open',
          createdAt: '2025-01-19T09:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    });
  }),

  // Analytics endpoints
  http.get(`${API_BASE}/admin/analytics`, () => {
    return HttpResponse.json({
      totalUsers: 1500,
      totalCompanies: 25,
      totalCaregivers: 500,
      totalPatients: 800,
      totalJobs: 1200,
      totalRevenue: 15000000,
      activeJobs: 150,
      pendingVerifications: 12,
    });
  }),
];
```

**File:** `src/mocks/server.ts`
```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**File:** `src/mocks/browser.ts`
```typescript
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

---

## 🧪 PHASE 2: COMPONENT UNIT TESTS (8 hours)

### TEST-COMP-001: UI Component Tests (2 hours)

**File:** `src/components/ui/__tests__/Button.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Button variant="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-primary');

      rerender(<Button variant="destructive">Destructive</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-destructive');

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toHaveClass('border');

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('hover:bg-accent');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-9');

      rerender(<Button size="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-10');

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-11');
    });

    it('renders as disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('renders with loading state', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(<Button isLoading onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('is focusable via keyboard', () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
    });

    it('can be activated with Enter key', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Press Enter</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      expect(handleClick).toHaveBeenCalled();
    });

    it('can be activated with Space key', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Press Space</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
```

**File:** `src/components/ui/__tests__/Input.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Input } from '../Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Email" id="email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders with error state', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('renders with helper text', () => {
      render(<Input helperText="Enter your email address" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    it('renders as disabled', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('renders with different types', () => {
      const { rerender } = render(<Input type="text" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');

      rerender(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

      rerender(<Input type="password" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password');
    });
  });

  describe('Interactions', () => {
    it('handles text input correctly', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello World');
      
      expect(input).toHaveValue('Hello World');
      expect(handleChange).toHaveBeenCalled();
    });

    it('handles blur event', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();
      
      expect(handleBlur).toHaveBeenCalled();
    });

    it('clears input when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<Input clearable defaultValue="Test" />);
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);
      
      expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Input label="Email" id="email" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('associates label with input', () => {
      render(<Input label="Username" id="username" />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    it('announces error to screen readers', () => {
      render(<Input error="Invalid input" aria-describedby="error-msg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
```

**File:** `src/components/ui/__tests__/Select.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../Select';

const options = [
  { value: 'elderly_care', label: 'Elderly Care' },
  { value: 'post_surgery', label: 'Post Surgery' },
  { value: 'chronic_illness', label: 'Chronic Illness' },
];

describe('Select Component', () => {
  describe('Rendering', () => {
    it('renders with placeholder', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      expect(screen.getByText('Select category')).toBeInTheDocument();
    });

    it('renders all options when opened', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      
      options.forEach(opt => {
        expect(screen.getByText(opt.label)).toBeInTheDocument();
      });
    });

    it('renders with default value', () => {
      render(
        <Select defaultValue="elderly_care">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      expect(screen.getByText('Elderly Care')).toBeInTheDocument();
    });

    it('renders as disabled', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('selects an option when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(
        <Select onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Post Surgery'));
      
      expect(handleChange).toHaveBeenCalledWith('post_surgery');
    });

    it('closes dropdown after selection', async () => {
      const user = userEvent.setup();
      
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Elderly Care'));
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Select>
          <SelectTrigger aria-label="Category selection">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      
      const trigger = screen.getByRole('combobox');
      trigger.focus();
      
      await user.keyboard('{Enter}');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');
      
      expect(screen.getByText('Elderly Care')).toBeInTheDocument();
    });
  });
});
```

**File:** `src/components/ui/__tests__/Card.test.tsx`
```typescript
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';

describe('Card Component', () => {
  describe('Rendering', () => {
    it('renders basic card', () => {
      render(
        <Card>
          <CardContent>Card content</CardContent>
        </Card>
      );
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders card with all sections', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
          <CardContent>Main content here</CardContent>
          <CardFooter>Footer content</CardFooter>
        </Card>
      );
      
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description text')).toBeInTheDocument();
      expect(screen.getByText('Main content here')).toBeInTheDocument();
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          <CardContent>Content</CardContent>
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('uses semantic heading for title', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
        </Card>
      );
      expect(screen.getByRole('heading', { name: 'Card Title' })).toBeInTheDocument();
    });
  });
});
```

**File:** `src/components/ui/__tests__/DataTable.test.tsx`
```typescript
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { DataTable } from '../DataTable';

const mockData = [
  { id: '1', name: 'John Doe', email: 'john@test.com', role: 'Guardian' },
  { id: '2', name: 'Jane Smith', email: 'jane@test.com', role: 'Caregiver' },
  { id: '3', name: 'Bob Wilson', email: 'bob@test.com', role: 'Company' },
];

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', sortable: false },
];

describe('DataTable Component', () => {
  describe('Rendering', () => {
    it('renders table with data', () => {
      render(<DataTable data={mockData} columns={columns} />);
      
      // Check headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      
      // Check data rows
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@test.com')).toBeInTheDocument();
      expect(screen.getByText('Company')).toBeInTheDocument();
    });

    it('renders empty state when no data', () => {
      render(<DataTable data={[]} columns={columns} emptyMessage="No data available" />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders loading state', () => {
      render(<DataTable data={[]} columns={columns} isLoading />);
      expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('sorts by column when header clicked', async () => {
      const user = userEvent.setup();
      render(<DataTable data={mockData} columns={columns} />);
      
      const nameHeader = screen.getByText('Name');
      await user.click(nameHeader);
      
      const rows = screen.getAllByRole('row');
      // First row is header, second should be Bob (alphabetically first after sort)
      expect(within(rows[1]).getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('toggles sort direction on subsequent clicks', async () => {
      const user = userEvent.setup();
      render(<DataTable data={mockData} columns={columns} />);
      
      const nameHeader = screen.getByText('Name');
      
      // First click - ascending
      await user.click(nameHeader);
      let rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('Bob Wilson')).toBeInTheDocument();
      
      // Second click - descending
      await user.click(nameHeader);
      rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('John Doe')).toBeInTheDocument();
    });

    it('does not sort non-sortable columns', async () => {
      const user = userEvent.setup();
      render(<DataTable data={mockData} columns={columns} />);
      
      const roleHeader = screen.getByText('Role');
      await user.click(roleHeader);
      
      // Order should remain unchanged
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('Guardian')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('renders pagination controls', () => {
      render(<DataTable data={mockData} columns={columns} pageSize={2} />);
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    });

    it('navigates to next page', async () => {
      const user = userEvent.setup();
      render(<DataTable data={mockData} columns={columns} pageSize={2} />);
      
      // First page shows first 2 items
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
      
      // Navigate to next page
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      
      // Second page shows remaining item
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('supports row selection', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();
      
      render(
        <DataTable 
          data={mockData} 
          columns={columns} 
          selectable 
          onSelectionChange={onSelectionChange} 
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]); // First row checkbox
      
      expect(onSelectionChange).toHaveBeenCalledWith(['1']);
    });

    it('supports select all', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();
      
      render(
        <DataTable 
          data={mockData} 
          columns={columns} 
          selectable 
          onSelectionChange={onSelectionChange} 
        />
      );
      
      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(selectAllCheckbox);
      
      expect(onSelectionChange).toHaveBeenCalledWith(['1', '2', '3']);
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<DataTable data={mockData} columns={columns} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper table structure', () => {
      render(<DataTable data={mockData} columns={columns} />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(3);
      expect(screen.getAllByRole('row')).toHaveLength(4); // 1 header + 3 data rows
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<DataTable data={mockData} columns={columns} selectable />);
      
      const firstCheckbox = screen.getAllByRole('checkbox')[1];
      firstCheckbox.focus();
      
      expect(firstCheckbox).toHaveFocus();
      await user.keyboard(' ');
      expect(firstCheckbox).toBeChecked();
    });
  });
});
```

### TEST-COMP-002: Form Component Tests (2 hours)

**File:** `src/components/forms/__tests__/PatientForm.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { PatientForm } from '../PatientForm';

const mockOnSubmit = jest.fn();

const defaultProps = {
  onSubmit: mockOnSubmit,
  isLoading: false,
};

describe('PatientForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all form fields', () => {
      render(<PatientForm {...defaultProps} />);
      
      expect(screen.getByLabelText(/patient name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/blood group/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/emergency contact name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/emergency contact phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mobility level/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cognitive status/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit|save/i })).toBeInTheDocument();
    });

    it('renders with initial data for editing', () => {
      const initialData = {
        name: 'Mohammad Rahman',
        dateOfBirth: '1945-03-15',
        gender: 'male',
        bloodGroup: 'A+',
        address: '123 Main St, Dhaka',
        emergencyContactName: 'Fatima Rahman',
        emergencyContactPhone: '+8801712345678',
        mobilityLevel: 'assisted',
        cognitiveStatus: 'mild_impairment',
      };
      
      render(<PatientForm {...defaultProps} initialData={initialData} />);
      
      expect(screen.getByLabelText(/patient name/i)).toHaveValue('Mohammad Rahman');
      expect(screen.getByLabelText(/address/i)).toHaveValue('123 Main St, Dhaka');
    });

    it('shows loading state on submit button', () => {
      render(<PatientForm {...defaultProps} isLoading={true} />);
      
      const submitButton = screen.getByRole('button', { name: /saving|loading/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Validation', () => {
    it('shows error for empty required fields', async () => {
      const user = userEvent.setup();
      render(<PatientForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /submit|save/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });

    it('validates Bangladesh phone number format', async () => {
      const user = userEvent.setup();
      render(<PatientForm {...defaultProps} />);
      
      const phoneInput = screen.getByLabelText(/emergency contact phone/i);
      await user.type(phoneInput, '12345'); // Invalid format
      
      const submitButton = screen.getByRole('button', { name: /submit|save/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid.*phone/i)).toBeInTheDocument();
      });
    });

    it('accepts valid Bangladesh phone number', async () => {
      const user = userEvent.setup();
      render(<PatientForm {...defaultProps} />);
      
      const phoneInput = screen.getByLabelText(/emergency contact phone/i);
      await user.type(phoneInput, '+8801712345678');
      
      // Should not show phone validation error
      expect(screen.queryByText(/invalid.*phone/i)).not.toBeInTheDocument();
    });

    it('validates date of birth is in the past', async () => {
      const user = userEvent.setup();
      render(<PatientForm {...defaultProps} />);
      
      const dobInput = screen.getByLabelText(/date of birth/i);
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      await user.type(dobInput, futureDate.toISOString().split('T')[0]);
      
      const submitButton = screen.getByRole('button', { name: /submit|save/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/date.*past/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with form data', async () => {
      const user = userEvent.setup();
      render(<PatientForm {...defaultProps} />);
      
      // Fill out the form
      await user.type(screen.getByLabelText(/patient name/i), 'Test Patient');
      await user.type(screen.getByLabelText(/date of birth/i), '1950-01-15');
      await user.selectOptions(screen.getByLabelText(/gender/i), 'male');
      await user.selectOptions(screen.getByLabelText(/blood group/i), 'O+');
      await user.type(screen.getByLabelText(/address/i), '456 Test St, Dhaka');
      await user.type(screen.getByLabelText(/emergency contact name/i), 'Emergency Contact');
      await user.type(screen.getByLabelText(/emergency contact phone/i), '+8801812345678');
      await user.selectOptions(screen.getByLabelText(/mobility level/i), 'independent');
      await user.selectOptions(screen.getByLabelText(/cognitive status/i), 'normal');
      
      const submitButton = screen.getByRole('button', { name: /submit|save/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test Patient',
            gender: 'male',
            bloodGroup: 'O+',
          })
        );
      });
    });

    it('does not submit when validation fails', async () => {
      const user = userEvent.setup();
      render(<PatientForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /submit|save/i });
      await user.click(submitButton);
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<PatientForm {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper form structure', () => {
      render(<PatientForm {...defaultProps} />);
      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('associates labels with inputs', () => {
      render(<PatientForm {...defaultProps} />);
      
      const nameInput = screen.getByLabelText(/patient name/i);
      expect(nameInput).toHaveAttribute('id');
      expect(nameInput.id).not.toBe('');
    });

    it('announces errors to screen readers', async () => {
      const user = userEvent.setup();
      render(<PatientForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /submit|save/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const errorElements = screen.getAllByRole('alert');
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });
  });
});
```

**File:** `src/components/forms/__tests__/LoginForm.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { LoginForm } from '../LoginForm';

const mockOnSubmit = jest.fn();
const mockOnSendOTP = jest.fn();

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Phone/Password Login', () => {
    it('renders phone and password fields', () => {
      render(<LoginForm onSubmit={mockOnSubmit} loginMethod="password" />);
      
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login|sign in/i })).toBeInTheDocument();
    });

    it('validates Bangladesh phone format', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} loginMethod="password" />);
      
      await user.type(screen.getByLabelText(/phone/i), '12345');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /login|sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid.*phone/i)).toBeInTheDocument();
      });
    });

    it('submits with valid credentials', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} loginMethod="password" />);
      
      await user.type(screen.getByLabelText(/phone/i), '+8801712345678');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /login|sign in/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          phone: '+8801712345678',
          password: 'password123',
        });
      });
    });
  });

  describe('Phone/OTP Login', () => {
    it('renders phone field and send OTP button initially', () => {
      render(<LoginForm onSubmit={mockOnSubmit} onSendOTP={mockOnSendOTP} loginMethod="otp" />);
      
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send otp/i })).toBeInTheDocument();
    });

    it('shows OTP input after sending OTP', async () => {
      const user = userEvent.setup();
      mockOnSendOTP.mockResolvedValue(true);
      
      render(<LoginForm onSubmit={mockOnSubmit} onSendOTP={mockOnSendOTP} loginMethod="otp" />);
      
      await user.type(screen.getByLabelText(/phone/i), '+8801712345678');
      await user.click(screen.getByRole('button', { name: /send otp/i }));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/otp|verification code/i)).toBeInTheDocument();
      });
    });

    it('validates 6-digit OTP format', async () => {
      const user = userEvent.setup();
      mockOnSendOTP.mockResolvedValue(true);
      
      render(<LoginForm onSubmit={mockOnSubmit} onSendOTP={mockOnSendOTP} loginMethod="otp" />);
      
      await user.type(screen.getByLabelText(/phone/i), '+8801712345678');
      await user.click(screen.getByRole('button', { name: /send otp/i }));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/otp|verification code/i)).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/otp|verification code/i), '123'); // Too short
      await user.click(screen.getByRole('button', { name: /verify|login/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/6.*(digit|character)/i)).toBeInTheDocument();
      });
    });

    it('allows resending OTP after timeout', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      mockOnSendOTP.mockResolvedValue(true);
      
      render(<LoginForm onSubmit={mockOnSubmit} onSendOTP={mockOnSendOTP} loginMethod="otp" resendTimeout={60} />);
      
      await user.type(screen.getByLabelText(/phone/i), '+8801712345678');
      await user.click(screen.getByRole('button', { name: /send otp/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /resend/i })).toBeDisabled();
      });
      
      // Fast-forward 60 seconds
      jest.advanceTimersByTime(60000);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /resend/i })).not.toBeDisabled();
      });
      
      jest.useRealTimers();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<LoginForm onSubmit={mockOnSubmit} loginMethod="password" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('shows password visibility toggle', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} loginMethod="password" />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      const toggleButton = screen.getByRole('button', { name: /show password|toggle/i });
      await user.click(toggleButton);
      
      expect(passwordInput).toHaveAttribute('type', 'text');
    });
  });
});
```

**File:** `src/components/forms/__tests__/PackageForm.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { PackageForm } from '../PackageForm';

const mockOnSubmit = jest.fn();

const skillOptions = [
  { value: 'medication_mgmt', label: 'Medication Management' },
  { value: 'vitals_monitoring', label: 'Vitals Monitoring' },
  { value: 'mobility_assist', label: 'Mobility Assistance' },
  { value: 'wound_care', label: 'Wound Care' },
  { value: 'physiotherapy_assist', label: 'Physiotherapy Assistance' },
];

describe('PackageForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all package fields', () => {
      render(<PackageForm onSubmit={mockOnSubmit} skillOptions={skillOptions} />);
      
      expect(screen.getByLabelText(/package name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/duration.*days/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/hours.*day/i)).toBeInTheDocument();
      expect(screen.getByText(/inclusions/i)).toBeInTheDocument();
    });

    it('renders with initial data for editing', () => {
      const initialData = {
        name: 'Elder Care Package',
        description: 'Complete care for elderly',
        category: 'elderly_care',
        price: 15000,
        durationDays: 30,
        hoursPerDay: 8,
        inclusions: ['medication_mgmt', 'vitals_monitoring'],
      };
      
      render(<PackageForm onSubmit={mockOnSubmit} skillOptions={skillOptions} initialData={initialData} />);
      
      expect(screen.getByLabelText(/package name/i)).toHaveValue('Elder Care Package');
      expect(screen.getByLabelText(/price/i)).toHaveValue(15000);
    });
  });

  describe('Validation', () => {
    it('requires package name', async () => {
      const user = userEvent.setup();
      render(<PackageForm onSubmit={mockOnSubmit} skillOptions={skillOptions} />);
      
      await user.click(screen.getByRole('button', { name: /save|create/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/name.*required/i)).toBeInTheDocument();
      });
    });

    it('validates price is positive', async () => {
      const user = userEvent.setup();
      render(<PackageForm onSubmit={mockOnSubmit} skillOptions={skillOptions} />);
      
      await user.type(screen.getByLabelText(/price/i), '-100');
      await user.click(screen.getByRole('button', { name: /save|create/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/price.*positive/i)).toBeInTheDocument();
      });
    });

    it('requires at least one inclusion', async () => {
      const user = userEvent.setup();
      render(<PackageForm onSubmit={mockOnSubmit} skillOptions={skillOptions} />);
      
      await user.type(screen.getByLabelText(/package name/i), 'Test Package');
      await user.type(screen.getByLabelText(/price/i), '10000');
      await user.click(screen.getByRole('button', { name: /save|create/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/at least one inclusion/i)).toBeInTheDocument();
      });
    });
  });

  describe('Inclusions Selection', () => {
    it('allows selecting multiple inclusions', async () => {
      const user = userEvent.setup();
      render(<PackageForm onSubmit={mockOnSubmit} skillOptions={skillOptions} />);
      
      const medicationCheckbox = screen.getByLabelText(/medication management/i);
      const vitalsCheckbox = screen.getByLabelText(/vitals monitoring/i);
      
      await user.click(medicationCheckbox);
      await user.click(vitalsCheckbox);
      
      expect(medicationCheckbox).toBeChecked();
      expect(vitalsCheckbox).toBeChecked();
    });

    it('allows deselecting inclusions', async () => {
      const user = userEvent.setup();
      render(<PackageForm onSubmit={mockOnSubmit} skillOptions={skillOptions} />);
      
      const medicationCheckbox = screen.getByLabelText(/medication management/i);
      
      await user.click(medicationCheckbox);
      expect(medicationCheckbox).toBeChecked();
      
      await user.click(medicationCheckbox);
      expect(medicationCheckbox).not.toBeChecked();
    });
  });

  describe('Form Submission', () => {
    it('submits with all valid data', async () => {
      const user = userEvent.setup();
      render(<PackageForm onSubmit={mockOnSubmit} skillOptions={skillOptions} />);
      
      await user.type(screen.getByLabelText(/package name/i), 'Test Package');
      await user.type(screen.getByLabelText(/description/i), 'A test package');
      await user.selectOptions(screen.getByLabelText(/category/i), 'elderly_care');
      await user.type(screen.getByLabelText(/price/i), '15000');
      await user.type(screen.getByLabelText(/duration.*days/i), '30');
      await user.type(screen.getByLabelText(/hours.*day/i), '8');
      await user.click(screen.getByLabelText(/medication management/i));
      
      await user.click(screen.getByRole('button', { name: /save|create/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test Package',
            price: 15000,
            inclusions: ['medication_mgmt'],
          })
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<PackageForm onSubmit={mockOnSubmit} skillOptions={skillOptions} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

### TEST-COMP-003: Card Component Tests (1 hour)

**File:** `src/components/cards/__tests__/JobCard.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { JobCard } from '../JobCard';

const mockJob = {
  id: 'job-001',
  packageName: 'Elder Care - Daily',
  patientName: 'Mohammad Rahman',
  companyName: 'Care Solutions Ltd',
  caregiverName: 'Fatima Begum',
  startDate: '2025-01-20',
  endDate: '2025-02-19',
  status: 'active',
  totalPrice: 15000,
};

const mockOnClick = jest.fn();
const mockOnAction = jest.fn();

describe('JobCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders job information', () => {
      render(<JobCard job={mockJob} />);
      
      expect(screen.getByText('Elder Care - Daily')).toBeInTheDocument();
      expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
      expect(screen.getByText('Care Solutions Ltd')).toBeInTheDocument();
      expect(screen.getByText('Fatima Begum')).toBeInTheDocument();
    });

    it('displays formatted dates', () => {
      render(<JobCard job={mockJob} />);
      
      // Should display dates in user-friendly format
      expect(screen.getByText(/jan.*20.*2025/i)).toBeInTheDocument();
    });

    it('displays formatted price in BDT', () => {
      render(<JobCard job={mockJob} />);
      
      expect(screen.getByText(/৳.*15,000|15,000.*bdt/i)).toBeInTheDocument();
    });

    it('displays status badge', () => {
      render(<JobCard job={mockJob} />);
      
      expect(screen.getByText(/active/i)).toBeInTheDocument();
    });

    it('renders different status colors', () => {
      const { rerender } = render(<JobCard job={{ ...mockJob, status: 'active' }} />);
      expect(screen.getByText(/active/i)).toHaveClass(/success|green/i);
      
      rerender(<JobCard job={{ ...mockJob, status: 'pending_assignment' }} />);
      expect(screen.getByText(/pending/i)).toHaveClass(/warning|yellow|orange/i);
      
      rerender(<JobCard job={{ ...mockJob, status: 'completed' }} />);
      expect(screen.getByText(/completed/i)).toHaveClass(/info|blue/i);
      
      rerender(<JobCard job={{ ...mockJob, status: 'cancelled' }} />);
      expect(screen.getByText(/cancelled/i)).toHaveClass(/error|red/i);
    });
  });

  describe('Interactions', () => {
    it('calls onClick when card is clicked', async () => {
      const user = userEvent.setup();
      render(<JobCard job={mockJob} onClick={mockOnClick} />);
      
      await user.click(screen.getByRole('article'));
      
      expect(mockOnClick).toHaveBeenCalledWith(mockJob);
    });

    it('renders action buttons when provided', () => {
      const actions = [
        { label: 'View Details', onClick: mockOnAction },
        { label: 'Cancel Job', onClick: mockOnAction, variant: 'destructive' },
      ];
      
      render(<JobCard job={mockJob} actions={actions} />);
      
      expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel job/i })).toBeInTheDocument();
    });

    it('calls action handler when action button clicked', async () => {
      const user = userEvent.setup();
      const actions = [{ label: 'View Details', onClick: mockOnAction }];
      
      render(<JobCard job={mockJob} actions={actions} />);
      
      await user.click(screen.getByRole('button', { name: /view details/i }));
      
      expect(mockOnAction).toHaveBeenCalledWith(mockJob);
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<JobCard job={mockJob} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper article semantics', () => {
      render(<JobCard job={mockJob} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('is keyboard navigable when clickable', () => {
      render(<JobCard job={mockJob} onClick={mockOnClick} />);
      
      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });
});
```

**File:** `src/components/cards/__tests__/PatientCard.test.tsx`
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { PatientCard } from '../PatientCard';

const mockPatient = {
  id: 'patient-001',
  name: 'Mohammad Rahman',
  dateOfBirth: '1945-03-15',
  gender: 'male',
  bloodGroup: 'A+',
  mobilityLevel: 'assisted',
  cognitiveStatus: 'mild_impairment',
  primaryConditions: ['diabetes', 'hypertension'],
  photoUrl: '/images/patient.jpg',
};

describe('PatientCard Component', () => {
  describe('Rendering', () => {
    it('renders patient information', () => {
      render(<PatientCard patient={mockPatient} />);
      
      expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
      expect(screen.getByText(/male/i)).toBeInTheDocument();
      expect(screen.getByText('A+')).toBeInTheDocument();
    });

    it('displays calculated age', () => {
      render(<PatientCard patient={mockPatient} />);
      
      // Should show age (approximately 80 years as of 2025)
      expect(screen.getByText(/\d+.*years?/i)).toBeInTheDocument();
    });

    it('displays conditions as badges', () => {
      render(<PatientCard patient={mockPatient} />);
      
      expect(screen.getByText(/diabetes/i)).toBeInTheDocument();
      expect(screen.getByText(/hypertension/i)).toBeInTheDocument();
    });

    it('displays mobility level', () => {
      render(<PatientCard patient={mockPatient} />);
      
      expect(screen.getByText(/assisted/i)).toBeInTheDocument();
    });

    it('renders patient photo', () => {
      render(<PatientCard patient={mockPatient} />);
      
      const image = screen.getByRole('img', { name: /mohammad rahman/i });
      expect(image).toHaveAttribute('src', expect.stringContaining('patient.jpg'));
    });

    it('renders placeholder when no photo', () => {
      render(<PatientCard patient={{ ...mockPatient, photoUrl: undefined }} />);
      
      expect(screen.getByTestId('avatar-placeholder')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<PatientCard patient={mockPatient} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

**File:** `src/components/cards/__tests__/CaregiverCard.test.tsx`
```typescript
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { CaregiverCard } from '../CaregiverCard';

const mockCaregiver = {
  id: 'caregiver-001',
  name: 'Fatima Begum',
  photoUrl: '/images/caregiver.jpg',
  skills: ['medication_mgmt', 'mobility_assist', 'vitals_monitoring'],
  experienceYears: 5,
  ratingAvg: 4.8,
  ratingCount: 45,
  isVerified: true,
  isAvailable: true,
  totalJobsCompleted: 120,
};

describe('CaregiverCard Component', () => {
  describe('Rendering', () => {
    it('renders caregiver information', () => {
      render(<CaregiverCard caregiver={mockCaregiver} />);
      
      expect(screen.getByText('Fatima Begum')).toBeInTheDocument();
      expect(screen.getByText(/5.*years?/i)).toBeInTheDocument();
    });

    it('displays rating with stars', () => {
      render(<CaregiverCard caregiver={mockCaregiver} />);
      
      expect(screen.getByText('4.8')).toBeInTheDocument();
      expect(screen.getByText(/45.*reviews?/i)).toBeInTheDocument();
    });

    it('displays verification badge when verified', () => {
      render(<CaregiverCard caregiver={mockCaregiver} />);
      
      expect(screen.getByTestId('verified-badge')).toBeInTheDocument();
    });

    it('does not show verification badge when not verified', () => {
      render(<CaregiverCard caregiver={{ ...mockCaregiver, isVerified: false }} />);
      
      expect(screen.queryByTestId('verified-badge')).not.toBeInTheDocument();
    });

    it('displays availability status', () => {
      const { rerender } = render(<CaregiverCard caregiver={mockCaregiver} />);
      expect(screen.getByText(/available/i)).toBeInTheDocument();
      
      rerender(<CaregiverCard caregiver={{ ...mockCaregiver, isAvailable: false }} />);
      expect(screen.getByText(/unavailable|busy/i)).toBeInTheDocument();
    });

    it('displays skills as badges', () => {
      render(<CaregiverCard caregiver={mockCaregiver} />);
      
      expect(screen.getByText(/medication/i)).toBeInTheDocument();
      expect(screen.getByText(/mobility/i)).toBeInTheDocument();
    });

    it('displays completed jobs count', () => {
      render(<CaregiverCard caregiver={mockCaregiver} />);
      
      expect(screen.getByText(/120.*jobs?/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<CaregiverCard caregiver={mockCaregiver} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

### TEST-COMP-004: Layout Component Tests (1.5 hours)

**File:** `src/components/layout/__tests__/Header.test.tsx`
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Header } from '../Header';

const mockUser = {
  id: 'user-001',
  name: 'Test User',
  email: 'test@example.com',
  role: 'GUARDIAN',
  language: 'en',
};

const mockOnMenuClick = jest.fn();
const mockOnLogout = jest.fn();
const mockOnLanguageChange = jest.fn();

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders logo', () => {
      render(<Header user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByRole('img', { name: /logo/i })).toBeInTheDocument();
    });

    it('renders user name and avatar', () => {
      render(<Header user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('renders mobile menu button on small screens', () => {
      render(<Header user={mockUser} onMenuClick={mockOnMenuClick} onLogout={mockOnLogout} />);
      
      expect(screen.getByRole('button', { name: /menu|toggle/i })).toBeInTheDocument();
    });

    it('renders language switcher', () => {
      render(<Header user={mockUser} onLogout={mockOnLogout} onLanguageChange={mockOnLanguageChange} />);
      
      expect(screen.getByRole('button', { name: /language|en|bn/i })).toBeInTheDocument();
    });

    it('renders notification bell', () => {
      render(<Header user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByRole('button', { name: /notification/i })).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onMenuClick when menu button clicked', async () => {
      const user = userEvent.setup();
      render(<Header user={mockUser} onMenuClick={mockOnMenuClick} onLogout={mockOnLogout} />);
      
      await user.click(screen.getByRole('button', { name: /menu|toggle/i }));
      
      expect(mockOnMenuClick).toHaveBeenCalled();
    });

    it('opens user dropdown when avatar clicked', async () => {
      const user = userEvent.setup();
      render(<Header user={mockUser} onLogout={mockOnLogout} />);
      
      await user.click(screen.getByRole('button', { name: /user menu|profile/i }));
      
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /logout|sign out/i })).toBeInTheDocument();
    });

    it('calls onLogout when logout clicked', async () => {
      const user = userEvent.setup();
      render(<Header user={mockUser} onLogout={mockOnLogout} />);
      
      await user.click(screen.getByRole('button', { name: /user menu|profile/i }));
      await user.click(screen.getByRole('menuitem', { name: /logout|sign out/i }));
      
      expect(mockOnLogout).toHaveBeenCalled();
    });

    it('toggles language when language button clicked', async () => {
      const user = userEvent.setup();
      render(<Header user={mockUser} onLogout={mockOnLogout} onLanguageChange={mockOnLanguageChange} />);
      
      await user.click(screen.getByRole('button', { name: /language|en|bn/i }));
      
      expect(mockOnLanguageChange).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Header user={mockUser} onLogout={mockOnLogout} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper navigation landmark', () => {
      render(<Header user={mockUser} onLogout={mockOnLogout} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });
});
```

**File:** `src/components/layout/__tests__/Sidebar.test.tsx`
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Sidebar } from '../Sidebar';

const mockOnClose = jest.fn();

describe('Sidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Guardian Role Navigation', () => {
    it('renders guardian navigation items', () => {
      render(<Sidebar userRole="GUARDIAN" isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /patients/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /jobs/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /payments/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
    });
  });

  describe('Company Role Navigation', () => {
    it('renders company navigation items', () => {
      render(<Sidebar userRole="COMPANY" isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /caregivers|roster/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /packages/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /jobs/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument();
    });
  });

  describe('Caregiver Role Navigation', () => {
    it('renders caregiver navigation items', () => {
      render(<Sidebar userRole="CAREGIVER" isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /jobs|assignments/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /earnings/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /availability/i })).toBeInTheDocument();
    });
  });

  describe('Moderator Role Navigation', () => {
    it('renders moderator navigation items', () => {
      render(<Sidebar userRole="MODERATOR" isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /verification/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /disputes/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument();
    });
  });

  describe('Super Admin Role Navigation', () => {
    it('renders super admin navigation items', () => {
      render(<Sidebar userRole="SUPER_ADMIN" isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /moderators/i })).toBeInTheDocument();
    });
  });

  describe('Mobile Behavior', () => {
    it('closes when close button clicked', async () => {
      const user = userEvent.setup();
      render(<Sidebar userRole="GUARDIAN" isOpen={true} onClose={mockOnClose} />);
      
      await user.click(screen.getByRole('button', { name: /close/i }));
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes when overlay clicked', async () => {
      const user = userEvent.setup();
      render(<Sidebar userRole="GUARDIAN" isOpen={true} onClose={mockOnClose} />);
      
      await user.click(screen.getByTestId('sidebar-overlay'));
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('is hidden when isOpen is false', () => {
      render(<Sidebar userRole="GUARDIAN" isOpen={false} onClose={mockOnClose} />);
      
      expect(screen.getByRole('navigation', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Active State', () => {
    it('highlights current route', () => {
      render(<Sidebar userRole="GUARDIAN" isOpen={true} onClose={mockOnClose} currentPath="/dashboard/guardian" />);
      
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      expect(dashboardLink).toHaveClass(/active|current/i);
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Sidebar userRole="GUARDIAN" isOpen={true} onClose={mockOnClose} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper navigation landmark', () => {
      render(<Sidebar userRole="GUARDIAN" isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('traps focus when open on mobile', async () => {
      const user = userEvent.setup();
      render(<Sidebar userRole="GUARDIAN" isOpen={true} onClose={mockOnClose} />);
      
      const firstLink = screen.getAllByRole('link')[0];
      const closeButton = screen.getByRole('button', { name: /close/i });
      
      closeButton.focus();
      await user.tab();
      
      expect(firstLink).toHaveFocus();
    });
  });
});
```

**File:** `src/components/layout/__tests__/DashboardLayout.test.tsx`
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { DashboardLayout } from '../DashboardLayout';

const mockUser = {
  id: 'user-001',
  name: 'Test User',
  role: 'GUARDIAN',
};

describe('DashboardLayout Component', () => {
  describe('Rendering', () => {
    it('renders header, sidebar, and main content', () => {
      render(
        <DashboardLayout user={mockUser}>
          <div>Dashboard Content</div>
        </DashboardLayout>
      );
      
      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // Sidebar
      expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
      expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    });

    it('renders children in main content area', () => {
      render(
        <DashboardLayout user={mockUser}>
          <h1>Page Title</h1>
          <p>Page content here</p>
        </DashboardLayout>
      );
      
      const main = screen.getByRole('main');
      expect(main).toContainElement(screen.getByText('Page Title'));
      expect(main).toContainElement(screen.getByText('Page content here'));
    });
  });

  describe('Responsive Behavior', () => {
    it('shows mobile menu button on small screens', () => {
      // Mock small screen
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 767px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
      
      render(
        <DashboardLayout user={mockUser}>
          <div>Content</div>
        </DashboardLayout>
      );
      
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    });

    it('toggles sidebar on mobile', async () => {
      const user = userEvent.setup();
      
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 767px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
      
      render(
        <DashboardLayout user={mockUser}>
          <div>Content</div>
        </DashboardLayout>
      );
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <DashboardLayout user={mockUser}>
          <div>Content</div>
        </DashboardLayout>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has skip navigation link', () => {
      render(
        <DashboardLayout user={mockUser}>
          <div>Content</div>
        </DashboardLayout>
      );
      
      expect(screen.getByRole('link', { name: /skip to.*content/i })).toBeInTheDocument();
    });

    it('skip link focuses main content', async () => {
      const user = userEvent.setup();
      
      render(
        <DashboardLayout user={mockUser}>
          <div>Content</div>
        </DashboardLayout>
      );
      
      const skipLink = screen.getByRole('link', { name: /skip to.*content/i });
      await user.click(skipLink);
      
      expect(screen.getByRole('main')).toHaveFocus();
    });
  });
});
```

### TEST-COMP-005: Dashboard Component Tests (1.5 hours)

**File:** `src/app/dashboard/guardian/__tests__/GuardianDashboard.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { server } from '@/mocks/server';
import GuardianDashboard from '../page';

// Start MSW server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Guardian Dashboard', () => {
  describe('Rendering', () => {
    it('renders welcome message', async () => {
      render(<GuardianDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/welcome|hello/i)).toBeInTheDocument();
      });
    });

    it('renders patient list', async () => {
      render(<GuardianDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
        expect(screen.getByText('Fatima Begum')).toBeInTheDocument();
      });
    });

    it('renders active jobs section', async () => {
      render(<GuardianDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /active jobs/i })).toBeInTheDocument();
      });
    });

    it('renders quick actions', async () => {
      render(<GuardianDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add patient/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /browse packages/i })).toBeInTheDocument();
      });
    });

    it('renders recent care logs', async () => {
      render(<GuardianDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /recent.*logs|activity/i })).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading skeleton initially', () => {
      render(<GuardianDashboard />);
      
      expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
    });

    it('hides skeleton after data loads', async () => {
      render(<GuardianDashboard />);
      
      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('navigates to add patient form', async () => {
      const user = userEvent.setup();
      render(<GuardianDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add patient/i })).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: /add patient/i }));
      
      // Should navigate or open modal
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('navigates to patient detail when patient card clicked', async () => {
      const user = userEvent.setup();
      render(<GuardianDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Mohammad Rahman'));
      
      // Navigation should occur
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<GuardianDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
      });
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper heading hierarchy', async () => {
      render(<GuardianDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });
    });
  });
});
```

**File:** `src/app/dashboard/company/__tests__/CompanyDashboard.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { server } from '@/mocks/server';
import CompanyDashboard from '../page';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Company Dashboard', () => {
  describe('Rendering', () => {
    it('renders KPI cards', async () => {
      render(<CompanyDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/active jobs/i)).toBeInTheDocument();
        expect(screen.getByText(/total caregivers/i)).toBeInTheDocument();
        expect(screen.getByText(/revenue/i)).toBeInTheDocument();
        expect(screen.getByText(/pending/i)).toBeInTheDocument();
      });
    });

    it('renders job pipeline/queue', async () => {
      render(<CompanyDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /jobs|pipeline/i })).toBeInTheDocument();
      });
    });

    it('renders caregiver roster summary', async () => {
      render(<CompanyDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /caregivers|roster/i })).toBeInTheDocument();
      });
    });

    it('renders revenue chart', async () => {
      render(<CompanyDashboard />);
      
      await waitFor(() => {
        expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<CompanyDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/active jobs/i)).toBeInTheDocument();
      });
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

**File:** `src/app/dashboard/caregiver/__tests__/CaregiverDashboard.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { server } from '@/mocks/server';
import CaregiverDashboard from '../page';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Caregiver Dashboard', () => {
  describe('Rendering', () => {
    it('renders today\'s assignments', async () => {
      render(<CaregiverDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /today|assignments/i })).toBeInTheDocument();
      });
    });

    it('renders check-in/check-out button', async () => {
      render(<CaregiverDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /check.?in|start shift/i })).toBeInTheDocument();
      });
    });

    it('renders earnings summary', async () => {
      render(<CaregiverDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/earnings/i)).toBeInTheDocument();
      });
    });

    it('renders upcoming schedule', async () => {
      render(<CaregiverDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /schedule|upcoming/i })).toBeInTheDocument();
      });
    });

    it('renders rating/feedback summary', async () => {
      render(<CaregiverDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/rating/i)).toBeInTheDocument();
      });
    });
  });

  describe('Check-in Flow', () => {
    it('shows location permission prompt on check-in', async () => {
      const user = userEvent.setup();
      render(<CaregiverDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /check.?in/i })).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: /check.?in/i }));
      
      // Should show location verification or modal
      expect(screen.getByText(/location|gps/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<CaregiverDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

**File:** `src/app/dashboard/moderator/__tests__/ModeratorDashboard.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { server } from '@/mocks/server';
import ModeratorDashboard from '../page';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Moderator Dashboard', () => {
  describe('Rendering', () => {
    it('renders verification queue', async () => {
      render(<ModeratorDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /verification|pending/i })).toBeInTheDocument();
      });
    });

    it('renders active disputes', async () => {
      render(<ModeratorDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /disputes/i })).toBeInTheDocument();
      });
    });

    it('renders platform metrics', async () => {
      render(<ModeratorDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/total users/i)).toBeInTheDocument();
        expect(screen.getByText(/pending verifications/i)).toBeInTheDocument();
      });
    });

    it('renders verification queue items', async () => {
      render(<ModeratorDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('New Care Company')).toBeInTheDocument();
        expect(screen.getByText('New Caregiver')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ModeratorDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

---

## 🪝 PHASE 2B: CUSTOM HOOK TESTS (3 hours)

### TEST-PAGE-006: Jobs Split Layout (1.5 hours)

**Files:** `src/app/jobs/page.tsx`, `src/app/jobs/layout.tsx`, `src/components/jobs/JobDetailPanel.tsx`

**Objective:** guarantee the Front_end_modification split-view experience remains stable across desktop and mobile, keeps the `?selected=` query param as the source of truth, and preserves full accessibility coverage.

#### 1. Jobs list + layout integration tests (React Testing Library)
- Render `JobsPage` with MSW handlers for `GET /api/jobs`, `DELETE /api/jobs/:id`, and ensure:
  - Auth guard redirects unauthenticated users to `/auth/login` (mock `useAuth`).
  - Initial fetch populates the compact list, highlights the row matching `selectedJobId`, and auto-selects the first job when no query is present (assert `router.replace` called with `?selected=<id>`).
  - Clicking a list item updates the query via `router.push` without triggering scroll, and keyboard selection (`Enter`/`Space`) does the same.
  - Search + status filter submit resets pagination to page 1 and debounces fetches (spy on fetch/MSW invocation count).
  - Delete flow removes the row, re-selects the next available job, and shows the empty-placeholder when the list is depleted.
  - Placeholder hint renders whenever there is no `selected` query param.

#### 2. `JobDetailPanel` unit coverage
- Mock `localStorage` token, `window.confirm`, and the `/api/jobs/:id` + `/api/jobs/:id/cancel` endpoints.
- Assert loading skeleton, success rendering (patient info, caregiver assignment, care log timeline capped at 4 items), and retry-able error state.
- Verify action buttons route correctly:
  - `Edit` links to `/jobs/[id]/edit`.
  - `Assign caregiver` uses `router.push('/jobs/[id]/assign')`.
  - `Cancel job` hits the cancel endpoint, shows a spinner via `loading` prop, and re-fetches the detail payload.
- Ensure care-log timeline items expose accessible timestamps + caregiver names for screen readers.

#### 3. Accessibility baselines
- Add jest-axe assertions for both the list container and `JobDetailPanel` (desktop selection, empty placeholder, and error banner variants).
- Confirm focus styles on selectable rows, `aria-pressed`/`aria-selected` semantics, and that the close button on the panel clears the `selected` query.

#### 4. Playwright + axe smoke tests
- **Desktop chromium spec (`tests/a11y/jobs-split.spec.ts`)**: 
  1. Navigate to `/jobs`, wait for `/api/jobs` + `/api/jobs/:id` network idle.
  2. Validate two-column layout (list width ≈40%, detail ≈60%) via bounding box assertions.
  3. Click a different job, ensure URL updates with `?selected=` and detail panel updates accordingly, then run AxeBuilder for the combined viewport.
- **Deep-link scenario**: start with `/jobs?selected=job-002`, assert the correct row is marked active without extra clicks.
- **Mobile spec (`tests/e2e/mobile/jobs-split.spec.ts`)**: use a Pixel profile, confirm the layout stacks vertically, the placeholder remains visible until a row is tapped, and keyboard focus order remains logical.
- **Deletion regression**: from Playwright, delete a job and verify the placeholder text reappears plus no network 404s occur for `/api/jobs/:id`.

#### 5. Coverage + regression tracking
- Enforce ≥90% statements/branches for the three files via `collectCoverageFrom` overrides.
- Add the jobs split scenarios to the regression checklist so every PR touching `/jobs` runs `npm run test -- JobsPage` + the dedicated Playwright spec.

### TEST-HOOK-001: useApi Hook Tests (1 hour)

**File:** `src/hooks/__tests__/useApi.test.ts`
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from '../useApi';

describe('useApi Hook', () => {
  describe('Basic Execution', () => {
    it('should initialize with default state', () => {
      const apiFunction = jest.fn();
      const { result } = renderHook(() => useApi(apiFunction));

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should execute API call manually', async () => {
      const mockData = { id: 1, name: 'Test' };
      const apiFunction = jest.fn().mockResolvedValue(mockData);
      
      const { result } = renderHook(() => useApi(apiFunction));

      await result.current.execute();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(mockData);
      });

      expect(apiFunction).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      const error = new Error('API Error');
      const apiFunction = jest.fn().mockRejectedValue(error);
      
      const { result } = renderHook(() => useApi(apiFunction));

      await expect(result.current.execute()).rejects.toThrow('API Error');

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toEqual(error);
      });
    });
  });

  describe('Immediate Execution', () => {
    it('should execute immediately when immediate option is true', async () => {
      const apiFunction = jest.fn().mockResolvedValue({ id: 1 });
      
      const { result } = renderHook(() => 
        useApi(apiFunction, { immediate: true })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual({ id: 1 });
      });

      expect(apiFunction).toHaveBeenCalledTimes(1);
    });

    it('should not execute immediately when immediate is false', () => {
      const apiFunction = jest.fn();
      
      renderHook(() => useApi(apiFunction, { immediate: false }));

      expect(apiFunction).not.toHaveBeenCalled();
    });
  });

  describe('Callbacks', () => {
    it('should call onSuccess callback', async () => {
      const mockData = { id: 1 };
      const apiFunction = jest.fn().mockResolvedValue(mockData);
      const onSuccess = jest.fn();
      
      const { result } = renderHook(() => 
        useApi(apiFunction, { onSuccess })
      );

      await result.current.execute();

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(mockData);
      });
    });

    it('should call onError callback', async () => {
      const error = new Error('API Error');
      const apiFunction = jest.fn().mockRejectedValue(error);
      const onError = jest.fn();
      
      const { result } = renderHook(() => 
        useApi(apiFunction, { onError })
      );

      await expect(result.current.execute()).rejects.toThrow();

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('Reset', () => {
    it('should reset state to initial values', async () => {
      const apiFunction = jest.fn().mockResolvedValue({ id: 1 });
      
      const { result } = renderHook(() => useApi(apiFunction));

      await result.current.execute();
      
      await waitFor(() => {
        expect(result.current.data).toEqual({ id: 1 });
      });

      result.current.reset();

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
```

### TEST-HOOK-002: useAuth Hook Tests (1 hour)

**File:** `src/hooks/__tests__/useAuth.test.ts`
```typescript
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Authentication', () => {
    it('should login successfully', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('+8801700000000', 'password123');
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toBeDefined();
      });
    });

    it('should handle login failure', async () => {
      const { result } = renderHook(() => useAuth());

      await expect(
        act(async () => {
          await result.current.login('+8801700000000', 'wrongpassword');
        })
      ).rejects.toThrow();

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should logout successfully', async () => {
      const { result } = renderHook(() => useAuth());

      // Login first
      await act(async () => {
        await result.current.login('+8801700000000', 'password123');
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      // Then logout
      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe('Token Management', () => {
    it('should refresh token', async () => {
      const { result } = renderHook(() => useAuth());

      // Login to get tokens
      await act(async () => {
        await result.current.login('+8801700000000', 'password123');
      });

      const oldToken = result.current.tokens?.accessToken;

      await act(async () => {
        await result.current.refreshToken();
      });

      await waitFor(() => {
        expect(result.current.tokens?.accessToken).not.toBe(oldToken);
      });
    });
  });
});
```

### TEST-HOOK-003: Other Custom Hooks (1 hour)

Test remaining custom hooks like `useTheme`, `useNotifications`, etc. following similar patterns.

**Key Testing Patterns for Hooks:**
- Use `renderHook` from `@testing-library/react`
- Wrap state updates in `act()`
- Use `waitFor()` for async operations
- Test with `immediate: true` option by checking state after mount
- Mock external dependencies (localStorage, API calls)

---

## 🔄 PHASE 3: USER FLOW INTEGRATION TESTS (6 hours)

### TEST-FLOW-001: Authentication Flows (2 hours)

**File:** `src/__tests__/flows/auth-flow.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import App from '@/app/layout';
import LoginPage from '@/app/(auth)/login/page';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Authentication User Flows', () => {
  describe('Login with Phone/Password', () => {
    it('completes login flow and redirects to dashboard', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      // Enter credentials
      await user.type(screen.getByLabelText(/phone/i), '+8801712345678');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /login|sign in/i }));
      
      // Should redirect to dashboard
      await waitFor(() => {
        expect(window.location.pathname).toBe('/dashboard/guardian');
      });
    });

    it('shows error message on invalid credentials', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        })
      );
      
      const user = userEvent.setup();
      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/phone/i), '+8801712345678');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /login|sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('redirects to appropriate dashboard based on role', async () => {
      const roles = [
        { role: 'GUARDIAN', expectedPath: '/dashboard/guardian' },
        { role: 'COMPANY', expectedPath: '/dashboard/company' },
        { role: 'CAREGIVER', expectedPath: '/dashboard/caregiver' },
        { role: 'MODERATOR', expectedPath: '/dashboard/moderator' },
        { role: 'SUPER_ADMIN', expectedPath: '/dashboard/admin' },
      ];
      
      for (const { role, expectedPath } of roles) {
        server.use(
          http.post('/api/auth/login', () => {
            return HttpResponse.json({
              user: { id: 'user-001', name: 'Test User', role },
              accessToken: 'mock-token',
              refreshToken: 'mock-refresh',
            });
          })
        );
        
        const user = userEvent.setup();
        const { unmount } = render(<LoginPage />);
        
        await user.type(screen.getByLabelText(/phone/i), '+8801712345678');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /login|sign in/i }));
        
        await waitFor(() => {
          expect(window.location.pathname).toBe(expectedPath);
        });
        
        unmount();
        server.resetHandlers();
      }
    });
  });

  describe('Login with OTP', () => {
    it('completes OTP login flow', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      // Switch to OTP mode
      await user.click(screen.getByRole('button', { name: /use otp|otp login/i }));
      
      // Enter phone
      await user.type(screen.getByLabelText(/phone/i), '+8801712345678');
      await user.click(screen.getByRole('button', { name: /send otp/i }));
      
      // Wait for OTP input
      await waitFor(() => {
        expect(screen.getByLabelText(/otp|code/i)).toBeInTheDocument();
      });
      
      // Enter OTP
      await user.type(screen.getByLabelText(/otp|code/i), '123456');
      await user.click(screen.getByRole('button', { name: /verify|login/i }));
      
      // Should redirect
      await waitFor(() => {
        expect(window.location.pathname).toContain('/dashboard');
      });
    });

    it('shows error for invalid OTP', async () => {
      server.use(
        http.post('/api/auth/verify-otp', () => {
          return HttpResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        })
      );
      
      const user = userEvent.setup();
      render(<LoginPage />);
      
      await user.click(screen.getByRole('button', { name: /use otp/i }));
      await user.type(screen.getByLabelText(/phone/i), '+8801712345678');
      await user.click(screen.getByRole('button', { name: /send otp/i }));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/otp|code/i)).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/otp|code/i), '000000');
      await user.click(screen.getByRole('button', { name: /verify/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid otp/i)).toBeInTheDocument();
      });
    });
  });

  describe('Registration Flow', () => {
    it('completes guardian registration', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      // Navigate to registration
      await user.click(screen.getByRole('link', { name: /register|sign up/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /register|create account/i })).toBeInTheDocument();
      });
      
      // Fill registration form
      await user.type(screen.getByLabelText(/name/i), 'Test Guardian');
      await user.type(screen.getByLabelText(/phone/i), '+8801712345678');
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123!');
      
      // Select role
      await user.selectOptions(screen.getByLabelText(/role|account type/i), 'GUARDIAN');
      
      // Accept terms
      await user.click(screen.getByLabelText(/terms|agree/i));
      
      // Submit
      await user.click(screen.getByRole('button', { name: /register|create/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/success|verify.*phone/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password Reset Flow', () => {
    it('completes password reset flow', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      // Click forgot password
      await user.click(screen.getByRole('link', { name: /forgot.*password/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /reset.*password/i })).toBeInTheDocument();
      });
      
      // Enter phone
      await user.type(screen.getByLabelText(/phone/i), '+8801712345678');
      await user.click(screen.getByRole('button', { name: /send|reset/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/otp.*sent|check.*phone/i)).toBeInTheDocument();
      });
    });
  });

  describe('MFA Setup Flow', () => {
    it('shows MFA setup for company users', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json({
            user: { id: 'company-001', name: 'Company Admin', role: 'COMPANY' },
            accessToken: 'mock-token',
            requiresMFA: true,
          });
        })
      );
      
      const user = userEvent.setup();
      render(<LoginPage />);
      
      await user.type(screen.getByLabelText(/phone/i), '+8801812345678');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /login/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/two.?factor|mfa|2fa/i)).toBeInTheDocument();
      });
    });
  });

  describe('Session Management', () => {
    it('redirects to login when session expires', async () => {
      server.use(
        http.get('/api/auth/me', () => {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
        })
      );
      
      render(<App />);
      
      await waitFor(() => {
        expect(window.location.pathname).toBe('/login');
      });
    });

    it('refreshes token automatically', async () => {
      let refreshCalled = false;
      server.use(
        http.post('/api/auth/refresh-token', () => {
          refreshCalled = true;
          return HttpResponse.json({
            accessToken: 'new-token',
            refreshToken: 'new-refresh',
          });
        })
      );
      
      // Simulate token refresh scenario
      // This would typically be handled by an auth context
      
      await waitFor(() => {
        expect(refreshCalled).toBe(true);
      });
    });
  });
});
```

### TEST-FLOW-002: Patient Management Flow (1.5 hours)

**File:** `src/__tests__/flows/patient-flow.test.tsx`
```typescript
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import PatientManagementPage from '@/app/patient-management/page';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Patient Management User Flows', () => {
  describe('View Patient List', () => {
    it('displays list of patients', async () => {
      render(<PatientManagementPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
        expect(screen.getByText('Fatima Begum')).toBeInTheDocument();
      });
    });

    it('shows patient details when card clicked', async () => {
      const user = userEvent.setup();
      render(<PatientManagementPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Mohammad Rahman'));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/diabetes/i)).toBeInTheDocument();
        expect(screen.getByText(/hypertension/i)).toBeInTheDocument();
      });
    });
  });

  describe('Add New Patient', () => {
    it('completes add patient flow', async () => {
      const user = userEvent.setup();
      render(<PatientManagementPage />);
      
      // Open add patient form
      await user.click(screen.getByRole('button', { name: /add patient/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Fill form
      await user.type(screen.getByLabelText(/patient name/i), 'New Patient');
      await user.type(screen.getByLabelText(/date of birth/i), '1960-05-20');
      await user.selectOptions(screen.getByLabelText(/gender/i), 'female');
      await user.selectOptions(screen.getByLabelText(/blood group/i), 'B+');
      await user.type(screen.getByLabelText(/address/i), '123 Test St, Dhaka');
      await user.type(screen.getByLabelText(/emergency contact name/i), 'Emergency Person');
      await user.type(screen.getByLabelText(/emergency contact phone/i), '+8801712345679');
      await user.selectOptions(screen.getByLabelText(/mobility level/i), 'independent');
      await user.selectOptions(screen.getByLabelText(/cognitive status/i), 'normal');
      
      // Submit
      await user.click(screen.getByRole('button', { name: /save|add/i }));
      
      // Verify success
      await waitFor(() => {
        expect(screen.getByText(/patient.*added|success/i)).toBeInTheDocument();
      });
      
      // Verify patient appears in list
      await waitFor(() => {
        expect(screen.getByText('New Patient')).toBeInTheDocument();
      });
    });

    it('shows validation errors for invalid data', async () => {
      const user = userEvent.setup();
      render(<PatientManagementPage />);
      
      await user.click(screen.getByRole('button', { name: /add patient/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Try to submit empty form
      await user.click(screen.getByRole('button', { name: /save|add/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/name.*required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Edit Patient', () => {
    it('completes edit patient flow', async () => {
      const user = userEvent.setup();
      render(<PatientManagementPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
      });
      
      // Find and click edit button
      const patientCard = screen.getByText('Mohammad Rahman').closest('[data-testid="patient-card"]');
      const editButton = within(patientCard!).getByRole('button', { name: /edit/i });
      await user.click(editButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByLabelText(/patient name/i)).toHaveValue('Mohammad Rahman');
      });
      
      // Update name
      await user.clear(screen.getByLabelText(/patient name/i));
      await user.type(screen.getByLabelText(/patient name/i), 'Mohammad Rahman Updated');
      
      // Save
      await user.click(screen.getByRole('button', { name: /save|update/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/updated|success/i)).toBeInTheDocument();
      });
    });
  });

  describe('Delete Patient', () => {
    it('shows confirmation before deleting', async () => {
      const user = userEvent.setup();
      render(<PatientManagementPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
      });
      
      const patientCard = screen.getByText('Mohammad Rahman').closest('[data-testid="patient-card"]');
      const deleteButton = within(patientCard!).getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        expect(screen.getByText(/are you sure|confirm/i)).toBeInTheDocument();
      });
    });

    it('deletes patient on confirmation', async () => {
      const user = userEvent.setup();
      render(<PatientManagementPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
      });
      
      const patientCard = screen.getByText('Mohammad Rahman').closest('[data-testid="patient-card"]');
      const deleteButton = within(patientCard!).getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: /confirm|yes|delete/i }));
      
      await waitFor(() => {
        expect(screen.queryByText('Mohammad Rahman')).not.toBeInTheDocument();
      });
    });
  });

  describe('Search and Filter', () => {
    it('filters patients by search term', async () => {
      const user = userEvent.setup();
      render(<PatientManagementPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
        expect(screen.getByText('Fatima Begum')).toBeInTheDocument();
      });
      
      await user.type(screen.getByPlaceholderText(/search/i), 'Mohammad');
      
      await waitFor(() => {
        expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
        expect(screen.queryByText('Fatima Begum')).not.toBeInTheDocument();
      });
    });

    it('filters patients by condition', async () => {
      const user = userEvent.setup();
      render(<PatientManagementPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
      });
      
      await user.selectOptions(screen.getByLabelText(/filter.*condition/i), 'diabetes');
      
      await waitFor(() => {
        expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
        expect(screen.queryByText('Fatima Begum')).not.toBeInTheDocument();
      });
    });
  });
});
```

### TEST-FLOW-003: Package Purchase Flow (1.5 hours)

**File:** `src/__tests__/flows/package-purchase-flow.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import PackagesPage from '@/app/packages/page';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Package Purchase User Flows', () => {
  describe('Browse Packages', () => {
    it('displays available packages', async () => {
      render(<PackagesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Elder Care - Daily')).toBeInTheDocument();
        expect(screen.getByText('Post-Surgery Recovery')).toBeInTheDocument();
      });
    });

    it('shows package details with price', async () => {
      render(<PackagesPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/৳.*15,000|15,000/)).toBeInTheDocument();
        expect(screen.getByText(/30.*days/i)).toBeInTheDocument();
        expect(screen.getByText(/8.*hours/i)).toBeInTheDocument();
      });
    });

    it('filters packages by category', async () => {
      const user = userEvent.setup();
      render(<PackagesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Elder Care - Daily')).toBeInTheDocument();
      });
      
      await user.selectOptions(screen.getByLabelText(/category/i), 'post_surgery');
      
      await waitFor(() => {
        expect(screen.getByText('Post-Surgery Recovery')).toBeInTheDocument();
        expect(screen.queryByText('Elder Care - Daily')).not.toBeInTheDocument();
      });
    });

    it('filters packages by price range', async () => {
      const user = userEvent.setup();
      render(<PackagesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Elder Care - Daily')).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/max price/i), '20000');
      
      await waitFor(() => {
        expect(screen.getByText('Elder Care - Daily')).toBeInTheDocument();
        expect(screen.queryByText('Post-Surgery Recovery')).not.toBeInTheDocument();
      });
    });
  });

  describe('Package Detail View', () => {
    it('shows detailed package information', async () => {
      const user = userEvent.setup();
      render(<PackagesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Elder Care - Daily')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Elder Care - Daily'));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/medication.*management/i)).toBeInTheDocument();
        expect(screen.getByText(/vitals.*monitoring/i)).toBeInTheDocument();
        expect(screen.getByText(/mobility.*assist/i)).toBeInTheDocument();
      });
    });

    it('shows company information', async () => {
      const user = userEvent.setup();
      render(<PackagesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Elder Care - Daily')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Elder Care - Daily'));
      
      await waitFor(() => {
        expect(screen.getByText('Care Solutions Ltd')).toBeInTheDocument();
      });
    });
  });

  describe('Purchase Flow', () => {
    it('completes full purchase flow', async () => {
      const user = userEvent.setup();
      render(<PackagesPage />);
      
      // Select package
      await waitFor(() => {
        expect(screen.getByText('Elder Care - Daily')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Elder Care - Daily'));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /book|purchase/i })).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: /book|purchase/i }));
      
      // Select patient
      await waitFor(() => {
        expect(screen.getByText(/select patient/i)).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Mohammad Rahman'));
      await user.click(screen.getByRole('button', { name: /next|continue/i }));
      
      // Select dates
      await waitFor(() => {
        expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/start date/i), '2025-02-01');
      await user.click(screen.getByRole('button', { name: /next|continue/i }));
      
      // Add special instructions
      await waitFor(() => {
        expect(screen.getByLabelText(/instructions|notes/i)).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/instructions|notes/i), 'Patient prefers morning visits');
      await user.click(screen.getByRole('button', { name: /next|continue/i }));
      
      // Review order
      await waitFor(() => {
        expect(screen.getByText(/review|summary/i)).toBeInTheDocument();
        expect(screen.getByText('Elder Care - Daily')).toBeInTheDocument();
        expect(screen.getByText('Mohammad Rahman')).toBeInTheDocument();
        expect(screen.getByText(/৳.*15,000/)).toBeInTheDocument();
      });
      
      // Select payment method
      await user.click(screen.getByLabelText(/bkash/i));
      await user.click(screen.getByRole('button', { name: /pay|confirm/i }));
      
      // Verify redirect to payment gateway
      await waitFor(() => {
        expect(screen.getByText(/redirecting.*payment|processing/i)).toBeInTheDocument();
      });
    });

    it('shows error when no patient selected', async () => {
      const user = userEvent.setup();
      render(<PackagesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Elder Care - Daily')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Elder Care - Daily'));
      await user.click(screen.getByRole('button', { name: /book|purchase/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/select patient/i)).toBeInTheDocument();
      });
      
      // Try to continue without selecting patient
      await user.click(screen.getByRole('button', { name: /next|continue/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/please select.*patient/i)).toBeInTheDocument();
      });
    });
  });

  describe('Payment Callback Handling', () => {
    it('shows success message on successful payment', async () => {
      server.use(
        http.get('/api/payments/status/:id', () => {
          return HttpResponse.json({
            status: 'completed',
            transactionId: 'txn-001',
          });
        })
      );
      
      // Simulate payment callback redirect
      render(<PackagesPage />, {
        wrapper: ({ children }) => (
          <div data-payment-callback="success" data-payment-id="payment-001">
            {children}
          </div>
        ),
      });
      
      await waitFor(() => {
        expect(screen.getByText(/payment.*success|confirmed/i)).toBeInTheDocument();
      });
    });

    it('shows error message on failed payment', async () => {
      server.use(
        http.get('/api/payments/status/:id', () => {
          return HttpResponse.json({
            status: 'failed',
            error: 'Payment declined',
          });
        })
      );
      
      // Simulate payment callback redirect with failure
      render(<PackagesPage />, {
        wrapper: ({ children }) => (
          <div data-payment-callback="failed" data-payment-id="payment-001">
            {children}
          </div>
        ),
      });
      
      await waitFor(() => {
        expect(screen.getByText(/payment.*failed|declined/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /try again|retry/i })).toBeInTheDocument();
      });
    });
  });
});
```

### TEST-FLOW-004: Care Logging Flow (1 hour)

**File:** `src/__tests__/flows/care-logging-flow.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import CareLogsPage from '@/app/care-logs/page';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Care Logging User Flows', () => {
  describe('Check-in Flow', () => {
    it('completes check-in with GPS verification', async () => {
      // Mock geolocation
      const mockGeolocation = {
        getCurrentPosition: jest.fn().mockImplementation((success) =>
          success({
            coords: {
              latitude: 23.8103,
              longitude: 90.4125,
            },
          })
        ),
      };
      Object.defineProperty(global.navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });
      
      const user = userEvent.setup();
      render(<CareLogsPage jobId="job-001" />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /check.?in/i })).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: /check.?in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/location.*verified|checked in/i)).toBeInTheDocument();
      });
    });

    it('shows error when GPS unavailable', async () => {
      const mockGeolocation = {
        getCurrentPosition: jest.fn().mockImplementation((_, error) =>
          error({ code: 1, message: 'User denied geolocation' })
        ),
      };
      Object.defineProperty(global.navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });
      
      const user = userEvent.setup();
      render(<CareLogsPage jobId="job-001" />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /check.?in/i })).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: /check.?in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/location.*required|enable.*gps/i)).toBeInTheDocument();
      });
    });
  });

  describe('Vitals Logging', () => {
    it('logs patient vitals', async () => {
      const user = userEvent.setup();
      render(<CareLogsPage jobId="job-001" isCheckedIn={true} />);
      
      await user.click(screen.getByRole('button', { name: /log vitals/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Fill vitals form
      await user.type(screen.getByLabelText(/systolic/i), '120');
      await user.type(screen.getByLabelText(/diastolic/i), '80');
      await user.type(screen.getByLabelText(/heart rate/i), '72');
      await user.type(screen.getByLabelText(/temperature/i), '98.6');
      
      await user.click(screen.getByRole('button', { name: /save|submit/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/vitals.*logged|saved/i)).toBeInTheDocument();
      });
    });

    it('shows warning for abnormal vitals', async () => {
      const user = userEvent.setup();
      render(<CareLogsPage jobId="job-001" isCheckedIn={true} />);
      
      await user.click(screen.getByRole('button', { name: /log vitals/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Enter abnormal blood pressure
      await user.type(screen.getByLabelText(/systolic/i), '180');
      await user.type(screen.getByLabelText(/diastolic/i), '110');
      
      await waitFor(() => {
        expect(screen.getByText(/abnormal|warning|alert/i)).toBeInTheDocument();
      });
    });
  });

  describe('Medication Logging', () => {
    it('logs medication administration', async () => {
      const user = userEvent.setup();
      render(<CareLogsPage jobId="job-001" isCheckedIn={true} />);
      
      await user.click(screen.getByRole('button', { name: /log medication/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/Metformin/i)).toBeInTheDocument();
      });
      
      // Mark medication as given
      await user.click(screen.getByLabelText(/Metformin.*given/i));
      await user.click(screen.getByRole('button', { name: /save|submit/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/medication.*logged/i)).toBeInTheDocument();
      });
    });

    it('requires reason when medication skipped', async () => {
      const user = userEvent.setup();
      render(<CareLogsPage jobId="job-001" isCheckedIn={true} />);
      
      await user.click(screen.getByRole('button', { name: /log medication/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Mark as skipped
      await user.click(screen.getByLabelText(/Metformin.*skipped/i));
      await user.click(screen.getByRole('button', { name: /save|submit/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/reason.*required/i)).toBeInTheDocument();
      });
      
      // Enter reason
      await user.type(screen.getByLabelText(/reason/i), 'Patient refused medication');
      await user.click(screen.getByRole('button', { name: /save|submit/i }));
            await waitFor(() => {
        expect(screen.getByText(/medication.*logged/i)).toBeInTheDocument();
      });
    });
  });

  describe('Incident Reporting', () => {
    it('reports incident with photo evidence', async () => {
      const user = userEvent.setup();
      render(<CareLogsPage jobId="job-001" isCheckedIn={true} />);
      
      await user.click(screen.getByRole('button', { name: /report incident/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Fill incident form
      await user.selectOptions(screen.getByLabelText(/incident type/i), 'fall');
      await user.selectOptions(screen.getByLabelText(/severity/i), 'minor');
      await user.type(screen.getByLabelText(/description|action taken/i), 'Patient had a minor fall, no injury');
      
      // Upload photo (mock)
      const file = new File(['photo'], 'incident.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload.*photo/i);
      await user.upload(input, file);
      
      await user.click(screen.getByRole('button', { name: /submit|report/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/incident.*reported/i)).toBeInTheDocument();
      });
    });

    it('notifies guardian for high severity incidents', async () => {
      const user = userEvent.setup();
      render(<CareLogsPage jobId="job-001" isCheckedIn={true} />);
      
      await user.click(screen.getByRole('button', { name: /report incident/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      await user.selectOptions(screen.getByLabelText(/incident type/i), 'fall');
      await user.selectOptions(screen.getByLabelText(/severity/i), 'major');
      await user.type(screen.getByLabelText(/description/i), 'Patient fell and hit head');
      
      await user.click(screen.getByRole('button', { name: /submit|report/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/guardian.*notified|alert.*sent/i)).toBeInTheDocument();
      });
    });
  });

  describe('Check-out Flow', () => {
    it('completes check-out with summary', async () => {
      const mockGeolocation = {
        getCurrentPosition: jest.fn().mockImplementation((success) =>
          success({ coords: { latitude: 23.8103, longitude: 90.4125 } })
        ),
      };
      Object.defineProperty(global.navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });
      
      const user = userEvent.setup();
      render(<CareLogsPage jobId="job-001" isCheckedIn={true} />);
      
      await user.click(screen.getByRole('button', { name: /check.?out/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/shift summary/i)).toBeInTheDocument();
      });
      
      // Add final notes
      await user.type(screen.getByLabelText(/notes|summary/i), 'Patient had a good day');
      await user.click(screen.getByRole('button', { name: /confirm.*check.?out/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/checked out|shift.*complete/i)).toBeInTheDocument();
      });
    });
  });
});
```

---

## 🌐 PHASE 4: END-TO-END TESTS WITH PLAYWRIGHT (4 hours)

### TEST-E2E-001: Critical User Journeys (2 hours)

**File:** `e2e/auth.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication E2E', () => {
  test('guardian can login and access dashboard', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('[name="phone"]', '+8801712345678');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await expect(page).toHaveURL(/\/dashboard\/guardian/);
    
    // Verify dashboard loaded
    await expect(page.locator('h1')).toContainText(/welcome|dashboard/i);
  });

  test('company user sees MFA prompt', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="phone"]', '+8801812345678');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should see MFA verification
    await expect(page.locator('text=/two.?factor|mfa|verification code/i')).toBeVisible();
  });

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="phone"]', '+8801712345678');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=/invalid|incorrect/i')).toBeVisible();
  });

  test('logout clears session', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="phone"]', '+8801712345678');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Logout
    await page.click('[aria-label="User menu"]');
    await page.click('text=/logout|sign out/i');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
    
    // Try to access dashboard directly
    await page.goto('/dashboard/guardian');
    await expect(page).toHaveURL(/\/login/);
  });
});
```

**File:** `e2e/patient-management.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Patient Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login as guardian
    await page.goto('/login');
    await page.fill('[name="phone"]', '+8801712345678');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('add new patient', async ({ page }) => {
    await page.goto('/patient-management');
    
    // Click add patient
    await page.click('button:has-text("Add Patient")');
    
    // Fill form
    await page.fill('[name="name"]', 'Test Patient E2E');
    await page.fill('[name="dateOfBirth"]', '1955-06-15');
    await page.selectOption('[name="gender"]', 'male');
    await page.selectOption('[name="bloodGroup"]', 'O+');
    await page.fill('[name="address"]', '789 E2E Test St, Dhaka');
    await page.fill('[name="emergencyContactName"]', 'E2E Contact');
    await page.fill('[name="emergencyContactPhone"]', '+8801712345680');
    await page.selectOption('[name="mobilityLevel"]', 'independent');
    await page.selectOption('[name="cognitiveStatus"]', 'normal');
    
    // Submit
    await page.click('button:has-text("Save")');
    
    // Verify success
    await expect(page.locator('text=/success|added/i')).toBeVisible();
    await expect(page.locator('text=Test Patient E2E')).toBeVisible();
  });

  test('edit existing patient', async ({ page }) => {
    await page.goto('/patient-management');
    
    // Find patient and click edit
    const patientCard = page.locator('[data-testid="patient-card"]').filter({ hasText: 'Mohammad Rahman' });
    await patientCard.locator('button:has-text("Edit")').click();
    
    // Update name
    await page.fill('[name="name"]', 'Mohammad Rahman Updated');
    await page.click('button:has-text("Save")');
    
    // Verify update
    await expect(page.locator('text=Mohammad Rahman Updated')).toBeVisible();
  });

  test('view patient health records', async ({ page }) => {
    await page.goto('/patient-management');
    
    // Click on patient
    await page.click('text=Mohammad Rahman');
    
    // Navigate to health records tab
    await page.click('text=/health records|medical/i');
    
    // Verify records are displayed
    await expect(page.locator('[data-testid="health-record"]')).toBeVisible();
  });
});
```

**File:** `e2e/package-purchase.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Package Purchase E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="phone"]', '+8801712345678');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('complete package purchase flow', async ({ page }) => {
    await page.goto('/packages');
    
    // Browse packages
    await expect(page.locator('text=Elder Care - Daily')).toBeVisible();
    
    // Select package
    await page.click('text=Elder Care - Daily');
    await page.click('button:has-text("Book")');
    
    // Step 1: Select patient
    await page.click('text=Mohammad Rahman');
    await page.click('button:has-text("Next")');
    
    // Step 2: Select dates
    await page.fill('[name="startDate"]', '2025-02-15');
    await page.click('button:has-text("Next")');
    
    // Step 3: Add instructions
    await page.fill('[name="instructions"]', 'E2E test instructions');
    await page.click('button:has-text("Next")');
    
    // Step 4: Review and pay
    await expect(page.locator('text=Elder Care - Daily')).toBeVisible();
    await expect(page.locator('text=Mohammad Rahman')).toBeVisible();
    await expect(page.locator('text=/৳.*15,000/')).toBeVisible();
    
    // Select payment method
    await page.click('label:has-text("bKash")');
    await page.click('button:has-text("Pay")');
    
    // Should show processing/redirect message
    await expect(page.locator('text=/processing|redirecting/i')).toBeVisible();
  });

  test('filter packages by category', async ({ page }) => {
    await page.goto('/packages');
    
    await page.selectOption('[name="category"]', 'post_surgery');
    
    await expect(page.locator('text=Post-Surgery Recovery')).toBeVisible();
    await expect(page.locator('text=Elder Care - Daily')).not.toBeVisible();
  });
});
```

### TEST-E2E-002: Mobile Responsiveness Tests (1 hour)

**File:** `e2e/mobile.spec.ts`
```typescript
import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ ...devices['iPhone 12'] });

  test('mobile navigation works correctly', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="phone"]', '+8801712345678');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Menu should be collapsed
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
    
    // Navigate to patients
    await page.click('text=Patients');
    await expect(page).toHaveURL(/\/patient/);
  });

  test('forms are usable on mobile', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="phone"]', '+8801712345678');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.goto('/patient-management');
    await page.click('button:has-text("Add Patient")');
    
    // Modal should be full screen or properly sized
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    
    // All fields should be visible and fillable
    await page.fill('[name="name"]', 'Mobile Test Patient');
    await expect(page.locator('[name="name"]')).toHaveValue('Mobile Test Patient');
  });

  test('touch targets are appropriately sized', async ({ page }) => {
    await page.goto('/login');
    
    // Check button height (should be at least 44px for iOS)
    const submitButton = page.locator('button[type="submit"]');
    const box = await submitButton.boundingBox();
    
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('data tables convert to cards on mobile', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="phone"]', '+8801712345678');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.goto('/patient-management');
    
    // On mobile, should see cards not table
    await expect(page.locator('[data-testid="patient-card"]').first()).toBeVisible();
    await expect(page.locator('table')).not.toBeVisible();
  });
});
```

### TEST-E2E-003: Accessibility E2E Tests (1 hour)

**File:** `e2e/accessibility.spec.ts`
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility E2E', () => {
  test('login page has no accessibility violations', async ({ page }) => {
    await page.goto('/login');
    
    const results = await new AxeBuilder({ page }).analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('dashboard has no accessibility violations', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="phone"]', '+8801712345678');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    const results = await new AxeBuilder({ page })
      .exclude('[data-testid="chart"]') // Charts may have known issues
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('keyboard navigation works throughout app', async ({ page }) => {
    await page.goto('/login');
    
    // Tab to phone input
    await page.keyboard.press('Tab');
    await expect(page.locator('[name="phone"]')).toBeFocused();
    
    // Tab to password
    await page.keyboard.press('Tab');
    await expect(page.locator('[name="password"]')).toBeFocused();
    
    // Tab to submit
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('skip to content link works', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="phone"]', '+8801712345678');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Press Tab to focus skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a:has-text("Skip to content")');
    await expect(skipLink).toBeFocused();
    
    // Press Enter
    await page.keyboard.press('Enter');
    
    // Main content should be focused
    await expect(page.locator('main')).toBeFocused();
  });

  test('color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/login');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    const contrastViolations = results.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });

  test('forms have proper labels', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="phone"]', '+8801712345678');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.goto('/patient-management');
    await page.click('button:has-text("Add Patient")');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    const labelViolations = results.violations.filter(
      v => v.id === 'label' || v.id === 'label-title-only'
    );
    
    expect(labelViolations).toEqual([]);
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="phone"]', '+8801712345678');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.goto('/patient-management');
    
    const results = await new AxeBuilder({ page }).analyze();
    
    const imageViolations = results.violations.filter(
      v => v.id === 'image-alt'
    );
    
    expect(imageViolations).toEqual([]);
  });
});
```

---

## 🌍 PHASE 5: INTERNATIONALIZATION TESTS (2 hours)

### TEST-I18N-001: Language Switching Tests

**File:** `src/__tests__/i18n/language-switching.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider } from '@/lib/i18n/provider';
import { Header } from '@/components/layout/Header';
import LoginPage from '@/app/(auth)/login/page';

const mockUser = {
  id: 'user-001',
  name: 'Test User',
  role: 'GUARDIAN',
  language: 'en',
};

describe('Language Switching', () => {
  describe('English to Bengali', () => {
    it('switches UI text to Bengali', async () => {
      const user = userEvent.setup();
      
      render(
        <I18nProvider defaultLocale="en">
          <Header user={mockUser} onLogout={jest.fn()} />
        </I18nProvider>
      );
      
      // Initially in English
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      
      // Click language switcher
      await user.click(screen.getByRole('button', { name: /language|en/i }));
      
      // Wait for Bengali text
      await waitFor(() => {
        expect(screen.getByText(/ড্যাশবোর্ড/)).toBeInTheDocument();
      });
    });

    it('persists language preference', async () => {
      const user = userEvent.setup();
      const setLocaleMock = jest.fn();
      
      render(
        <I18nProvider defaultLocale="en" onLocaleChange={setLocaleMock}>
          <Header user={mockUser} onLogout={jest.fn()} />
        </I18nProvider>
      );
      
      await user.click(screen.getByRole('button', { name: /language/i }));
      
      expect(setLocaleMock).toHaveBeenCalledWith('bn');
    });
  });

  describe('Form Validation Messages', () => {
    it('shows validation errors in Bengali', async () => {
      const user = userEvent.setup();
      
      render(
        <I18nProvider defaultLocale="bn">
          <LoginPage />
        </I18nProvider>
      );
      
      // Submit empty form
      await user.click(screen.getByRole('button', { name: /লগইন/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/এই ক্ষেত্রটি আবশ্যক/)).toBeInTheDocument();
      });
    });
  });

  describe('Date and Currency Formatting', () => {
    it('formats dates in Bengali locale', () => {
      render(
        <I18nProvider defaultLocale="bn">
          <div data-testid="formatted-date">
            {new Intl.DateTimeFormat('bn-BD').format(new Date('2025-01-20'))}
          </div>
        </I18nProvider>
      );
      
      // Bengali date format
      expect(screen.getByTestId('formatted-date')).toHaveTextContent(/২০/);
    });

    it('formats currency with BDT symbol', () => {
      render(
        <I18nProvider defaultLocale="bn">
          <div data-testid="formatted-currency">
            {new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(15000)}
          </div>
        </I18nProvider>
      );
      
      expect(screen.getByTestId('formatted-currency')).toHaveTextContent(/৳|BDT/);
    });
  });

  describe('Bengali Numerals', () => {
    it('displays Bengali numerals when enabled', () => {
      render(
        <I18nProvider defaultLocale="bn" useBengaliNumerals={true}>
          <div data-testid="bengali-number">
            {(15000).toLocaleString('bn-BD-u-nu-beng')}
          </div>
        </I18nProvider>
      );
      
      expect(screen.getByTestId('bengali-number')).toHaveTextContent(/১৫,০০০/);
    });
  });
});
```

### TEST-I18N-002: Content Translation Tests

**File:** `src/__tests__/i18n/translations.test.ts`
```typescript
import { translations } from '@/lib/i18n';

describe('Translation Completeness', () => {
  const englishKeys = Object.keys(translations.en);
  const bengaliKeys = Object.keys(translations.bn);

  it('Bengali translations have all English keys', () => {
    const missingKeys = englishKeys.filter(key => !bengaliKeys.includes(key));
    
    expect(missingKeys).toEqual([]);
  });

  it('all translation values are non-empty', () => {
    for (const [key, value] of Object.entries(translations.en)) {
      expect(value).not.toBe('');
      expect(value).toBeDefined();
    }
    
    for (const [key, value] of Object.entries(translations.bn)) {
      expect(value).not.toBe('');
      expect(value).toBeDefined();
    }
  });

  it('no untranslated English text in Bengali', () => {
    // Check that Bengali translations are actually in Bengali (contain Bengali characters)
    const bengaliRegex = /[\u0980-\u09FF]/;
    
    for (const [key, value] of Object.entries(translations.bn)) {
      if (typeof value === 'string' && !key.includes('placeholder')) {
        expect(bengaliRegex.test(value)).toBe(true);
      }
    }
  });
});

describe('Translation Keys', () => {
  it('authentication translations exist', () => {
    expect(translations.en['auth.login']).toBeDefined();
    expect(translations.en['auth.register']).toBeDefined();
    expect(translations.en['auth.phone']).toBeDefined();
    expect(translations.en['auth.password']).toBeDefined();
    expect(translations.en['auth.forgotPassword']).toBeDefined();
    
    expect(translations.bn['auth.login']).toBeDefined();
    expect(translations.bn['auth.register']).toBeDefined();
  });

  it('dashboard translations exist', () => {
    expect(translations.en['dashboard.welcome']).toBeDefined();
    expect(translations.en['dashboard.patients']).toBeDefined();
    expect(translations.en['dashboard.jobs']).toBeDefined();
    expect(translations.en['dashboard.earnings']).toBeDefined();
    
    expect(translations.bn['dashboard.welcome']).toBeDefined();
    expect(translations.bn['dashboard.patients']).toBeDefined();
  });

  it('error translations exist', () => {
    expect(translations.en['error.required']).toBeDefined();
    expect(translations.en['error.invalidPhone']).toBeDefined();
    expect(translations.en['error.invalidEmail']).toBeDefined();
    expect(translations.en['error.networkError']).toBeDefined();
    
    expect(translations.bn['error.required']).toBeDefined();
    expect(translations.bn['error.invalidPhone']).toBeDefined();
  });

  it('payment translations exist', () => {
    expect(translations.en['payment.bkash']).toBeDefined();
    expect(translations.en['payment.nagad']).toBeDefined();
    expect(translations.en['payment.success']).toBeDefined();
    expect(translations.en['payment.failed']).toBeDefined();
    
    expect(translations.bn['payment.bkash']).toBeDefined();
    expect(translations.bn['payment.nagad']).toBeDefined();
  });
});
```

---

## 📊 PHASE 6: PERFORMANCE TESTS (2 hours)

### TEST-PERF-001: Component Performance Tests

**File:** `src/__tests__/performance/component-performance.test.tsx`
```typescript
import { render } from '@testing-library/react';
import { DataTable } from '@/components/ui/DataTable';
import { PatientCard } from '@/components/cards/PatientCard';

describe('Component Performance', () => {
  describe('DataTable Performance', () => {
    it('renders 100 rows within acceptable time', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: `id-${i}`,
        name: `User ${i}`,
        email: `user${i}@test.com`,
        role: 'Guardian',
      }));
      
      const columns = [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role' },
      ];
      
      const startTime = performance.now();
      render(<DataTable data={largeDataset} columns={columns} />);
      const endTime = performance.now();
      
      const renderTime = endTime - startTime;
      
      // Should render within 500ms
      expect(renderTime).toBeLessThan(500);
    });

    it('renders 1000 rows within acceptable time with virtualization', () => {
      const veryLargeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `id-${i}`,
        name: `User ${i}`,
        email: `user${i}@test.com`,
        role: 'Guardian',
      }));
      
      const columns = [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role' },
      ];
      
      const startTime = performance.now();
      render(<DataTable data={veryLargeDataset} columns={columns} virtualized />);
      const endTime = performance.now();
      
      const renderTime = endTime - startTime;
      
      // Should render within 1000ms with virtualization
      expect(renderTime).toBeLessThan(1000);
    });
  });

  describe('Card List Performance', () => {
    it('renders 50 patient cards efficiently', () => {
      const patients = Array.from({ length: 50 }, (_, i) => ({
        id: `patient-${i}`,
        name: `Patient ${i}`,
        dateOfBirth: '1950-01-01',
        gender: 'male',
        bloodGroup: 'O+',
        mobilityLevel: 'independent',
        cognitiveStatus: 'normal',
        primaryConditions: ['diabetes'],
      }));
      
      const startTime = performance.now();
      
      render(
        <div>
          {patients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 300ms
      expect(renderTime).toBeLessThan(300);
    });
  });
});
```

### TEST-PERF-002: Bundle Size Monitoring

**File:** `src/__tests__/performance/bundle-size.test.ts`
```typescript
import fs from 'fs';
import path from 'path';

describe('Bundle Size Monitoring', () => {
  const buildDir = path.join(process.cwd(), '.next', 'static', 'chunks');

  // Skip if build directory doesn't exist
  const buildExists = fs.existsSync(buildDir);

  test.skipIf(!buildExists)('main bundle is within size limit', () => {
    const files = fs.readdirSync(buildDir);
    const mainBundle = files.find(f => f.startsWith('main-') && f.endsWith('.js'));
    
    if (mainBundle) {
      const stats = fs.statSync(path.join(buildDir, mainBundle));
      const sizeInKB = stats.size / 1024;
      
      // Main bundle should be under 250KB
      expect(sizeInKB).toBeLessThan(250);
    }
  });

  test.skipIf(!buildExists)('page bundles are within size limits', () => {
    const pagesDir = path.join(buildDir, 'pages');
    
    if (fs.existsSync(pagesDir)) {
      const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.js'));
      
      for (const file of pageFiles) {
        const stats = fs.statSync(path.join(pagesDir, file));
        const sizeInKB = stats.size / 1024;
        
        // Individual page bundles should be under 100KB
        expect(sizeInKB).toBeLessThan(100);
      }
    }
  });

  test.skipIf(!buildExists)('total bundle size is within limit', () => {
    let totalSize = 0;
    
    const getAllFiles = (dir: string): string[] => {
      const files: string[] = [];
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          files.push(...getAllFiles(fullPath));
        } else if (item.endsWith('.js')) {
          files.push(fullPath);
        }
      }
      return files;
    };
    
    const allJsFiles = getAllFiles(buildDir);
    
    for (const file of allJsFiles) {
      totalSize += fs.statSync(file).size;
    }
    
    const totalSizeInMB = totalSize / (1024 * 1024);
    
    // Total JS bundle should be under 2MB
    expect(totalSizeInMB).toBeLessThan(2);
  });
});
```

---

## 🔧 PHASE 7: TEST UTILITIES & HELPERS (1 hour)

### TEST-UTIL-001: Custom Test Utilities

**File:** `src/__tests__/utils/test-utils.tsx`
```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { I18nProvider } from '@/lib/i18n/provider';
import { ThemeProvider } from '@/lib/theme/provider';
import { AuthProvider } from '@/lib/auth/provider';

// Mock user for testing
export const mockGuardianUser = {
  id: 'guardian-001',
  name: 'Test Guardian',
  email: 'guardian@test.com',
  phone: '+8801712345678',
  role: 'GUARDIAN' as const,
  language: 'en',
};

export const mockCompanyUser = {
  id: 'company-001',
  name: 'Test Company',
  email: 'company@test.com',
  phone: '+8801812345678',
  role: 'COMPANY' as const,
  language: 'en',
};

export const mockCaregiverUser = {
  id: 'caregiver-001',
  name: 'Test Caregiver',
  email: 'caregiver@test.com',
  phone: '+8801912345678',
  role: 'CAREGIVER' as const,
  language: 'bn',
};

export const mockModeratorUser = {
  id: 'moderator-001',
  name: 'Test Moderator',
  email: 'moderator@test.com',
  phone: '+8801612345678',
  role: 'MODERATOR' as const,
  language: 'en',
};

// All providers wrapper
interface AllProvidersProps {
  children: React.ReactNode;
  locale?: 'en' | 'bn';
  theme?: 'light' | 'dark';
  user?: typeof mockGuardianUser | null;
}

const AllProviders: React.FC<AllProvidersProps> = ({
  children,
  locale = 'en',
  theme = 'dark',
  user = mockGuardianUser,
}) => {
  return (
    <ThemeProvider defaultTheme={theme}>
      <I18nProvider defaultLocale={locale}>
        <AuthProvider initialUser={user}>
          {children}
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: 'en' | 'bn';
  theme?: 'light' | 'dark';
  user?: typeof mockGuardianUser | null;
}

export const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { locale, theme, user, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders locale={locale} theme={theme} user={user}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render };
```

**File:** `src/__tests__/utils/mock-data.ts`
```typescript
// Mock Patients
export const mockPatients = [
  {
    id: 'patient-001',
    name: 'Mohammad Rahman',
    dateOfBirth: '1945-03-15',
    gender: 'male' as const,
    bloodGroup: 'A+',
    address: '123 Main St, Dhaka',
    emergencyContactName: 'Fatima Rahman',
    emergencyContactPhone: '+8801712345679',
    mobilityLevel: 'assisted' as const,
    cognitiveStatus: 'mild_impairment' as const,
    primaryConditions: ['diabetes', 'hypertension'],
    guardianId: 'guardian-001',
  },
  {
    id: 'patient-002',
    name: 'Fatima Begum',
    dateOfBirth: '1950-07-22',
    gender: 'female' as const,
    bloodGroup: 'O+',
    address: '456 Test Ave, Dhaka',
    emergencyContactName: 'Karim Begum',
    emergencyContactPhone: '+8801812345679',
    mobilityLevel: 'wheelchair' as const,
    cognitiveStatus: 'normal' as const,
    primaryConditions: ['arthritis'],
    guardianId: 'guardian-001',
  },
];

// Mock Packages
export const mockPackages = [
  {
    id: 'package-001',
    name: 'Elder Care - Daily',
    description: 'Comprehensive daily care for elderly patients',
    category: 'elderly_care' as const,
    price: 15000,
    durationDays: 30,
    hoursPerDay: 8,
    inclusions: ['medication_mgmt', 'vitals_monitoring', 'mobility_assist'],
    exclusions: ['medical_procedures', 'overnight_stay'],
    companyId: 'company-001',
    companyName: 'Care Solutions Ltd',
    isActive: true,
  },
  {
    id: 'package-002',
    name: 'Post-Surgery Recovery',
    description: 'Specialized care for post-operative patients',
    category: 'post_surgery' as const,
    price: 25000,
    durationDays: 14,
    hoursPerDay: 12,
    inclusions: ['wound_care', 'medication_mgmt', 'physiotherapy_assist'],
    exclusions: [],
    companyId: 'company-001',
    companyName: 'Care Solutions Ltd',
    isActive: true,
  },
];

// Mock Jobs
export const mockJobs = [
  {
    id: 'job-001',
    packageId: 'package-001',
    packageName: 'Elder Care - Daily',
    patientId: 'patient-001',
    patientName: 'Mohammad Rahman',
    companyId: 'company-001',
    companyName: 'Care Solutions Ltd',
    guardianId: 'guardian-001',
    caregiverId: 'caregiver-001',
    caregiverName: 'Fatima Begum',
    startDate: '2025-01-20',
    endDate: '2025-02-19',
    status: 'active' as const,
    totalPrice: 15000,
    commissionAmount: 1800,
    payoutAmount: 13200,
  },
];

// Mock Care Logs
export const mockCareLogs = [
  {
    id: 'log-001',
    jobId: 'job-001',
    caregiverId: 'caregiver-001',
    patientId: 'patient-001',
    logType: 'check_in' as const,
    timestamp: '2025-01-20T08:00:00Z',
    locationLat: 23.8103,
    locationLng: 90.4125,
    notes: 'Arrived at patient residence',
  },
  {
    id: 'log-002',
    jobId: 'job-001',
    caregiverId: 'caregiver-001',
    patientId: 'patient-001',
    logType: 'vitals' as const,
    timestamp: '2025-01-20T08:30:00Z',
    data: {
      blood_pressure: { systolic: 120, diastolic: 80 },
      heart_rate: 72,
      temperature: 98.6,
    },
    notes: 'Vitals within normal range',
  },
  {
    id: 'log-003',
    jobId: 'job-001',
    caregiverId: 'caregiver-001',
    patientId: 'patient-001',
    logType: 'medication' as const,
    timestamp: '2025-01-20T09:00:00Z',
    data: {
      medication_name: 'Metformin 500mg',
      dosage: '1 tablet',
      administered_at: '2025-01-20T09:00:00Z',
      skipped: false,
    },
    notes: 'Medication administered with breakfast',
  },
];

// Mock Caregivers
export const mockCaregivers = [
  {
    id: 'caregiver-001',
    userId: 'user-caregiver-001',
    name: 'Fatima Begum',
    photoUrl: '/images/caregiver1.jpg',
    nid: '1234567890123',
    dateOfBirth: '1985-05-15',
    gender: 'female' as const,
    address: 'Uttara, Dhaka',
    skills: ['medication_mgmt', 'mobility_assist', 'vitals_monitoring'],
    certifications: [
      { name: 'Basic Nursing Certificate', expiry: '2026-12-31' },
    ],
    experienceYears: 5,
    languages: ['bn', 'en'],
    ratingAvg: 4.8,
    ratingCount: 45,
    totalJobsCompleted: 120,
    isVerified: true,
    isAvailable: true,
    companyId: 'company-001',
  },
];

// Mock Companies
export const mockCompanies = [
  {
    id: 'company-001',
    userId: 'user-company-001',
    companyName: 'Care Solutions Ltd',
    tradeLicense: 'TL123456',
    tradeLicenseUrl: '/docs/trade-license.pdf',
    tin: 'TIN987654',
    contactPerson: 'Abdul Karim',
    contactPhone: '+8801812345678',
    contactEmail: 'info@caresolutions.bd',
    address: 'Gulshan-2, Dhaka',
    logoUrl: '/images/company-logo.png',
    description: 'Professional caregiving services since 2015',
    specializations: ['elderly_care', 'post_surgery', 'dementia'],
    payoutMethod: 'bkash' as const,
    payoutAccount: '01812345678',
    commissionRate: 12.00,
    subscriptionTier: 'growth' as const,
    ratingAvg: 4.5,
    ratingCount: 200,
    isVerified: true,
  },
];

// Mock Feedback
export const mockFeedback = [
  {
    id: 'feedback-001',
    jobId: 'job-001',
    reviewerId: 'guardian-001',
    revieweeId: 'caregiver-001',
    revieweeType: 'caregiver' as const,
    rating: 5,
    tags: ['punctual', 'caring', 'professional'],
    comments: 'Excellent care provided. Very attentive to my father\'s needs.',
    isPublic: true,
    createdAt: '2025-01-19T10:00:00Z',
  },
];
```

**File:** `src/__tests__/utils/mock-handlers-extended.ts`
```typescript
import { http, HttpResponse, delay } from 'msw';

// Extended handlers for edge cases and error scenarios
export const errorHandlers = [
  // Network error
  http.get('/api/patients', async () => {
    await delay(100);
    return HttpResponse.error();
  }),

  // Server error
  http.get('/api/jobs', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }),

  // Rate limiting
  http.post('/api/auth/login', () => {
    return HttpResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }),

  // Validation error
  http.post('/api/patients', () => {
    return HttpResponse.json(
      {
        error: 'Validation failed',
        details: [
          { field: 'name', message: 'Name is required' },
          { field: 'phone', message: 'Invalid phone format' },
        ],
      },
      { status: 400 }
    );
  }),
];

export const slowHandlers = [
  // Slow response for loading state testing
  http.get('/api/patients', async () => {
    await delay(3000);
    return HttpResponse.json({ data: [], total: 0 });
  }),

  // Slow payment processing
  http.post('/api/payments/create', async () => {
    await delay(5000);
    return HttpResponse.json({
      paymentId: 'payment-001',
      checkoutURL: 'https://sandbox.bka.sh/checkout',
    });
  }),
];

export const emptyStateHandlers = [
  http.get('/api/patients', () => {
    return HttpResponse.json({ data: [], total: 0, page: 1, limit: 10 });
  }),

  http.get('/api/jobs', () => {
    return HttpResponse.json({ data: [], total: 0, page: 1, limit: 10 });
  }),

  http.get('/api/packages', () => {
    return HttpResponse.json({ data: [], total: 0, page: 1, limit: 10 });
  }),
];
```

---

## 📋 PHASE 8: TEST EXECUTION & CI/CD CONFIGURATION (1 hour)

### TEST-CI-001: Package.json Scripts

**File:** `package.json` (add to scripts section)
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:unit": "jest --testPathPattern='__tests__/(components|lib|hooks)'",
    "test:integration": "jest --testPathPattern='__tests__/flows'",
    "test:a11y": "jest --testPathPattern='accessibility'",
    "test:i18n": "jest --testPathPattern='i18n'",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "test:all": "npm run test:ci && npm run test:e2e"
  }
}
```

### TEST-CI-002: GitHub Actions Workflow

**File:** `.github/workflows/test.yml`
```yaml
name: Frontend Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:ci
      
      - name: Upload coverage report
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true

  e2e-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  accessibility-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run accessibility tests
        run: npm run test:a11y
```

---

## 📊 TEST COVERAGE REQUIREMENTS

### Coverage Targets by Category

| Category | Target Coverage | Critical Threshold |
|----------|-----------------|-------------------|
| **UI Components** | 90% | 80% |
| **Form Components** | 95% | 85% |
| **Layout Components** | 85% | 75% |
| **Dashboard Pages** | 80% | 70% |
| **User Flows** | 100% | 90% |
| **Utilities/Helpers** | 95% | 90% |
| **Hooks** | 90% | 80% |

### Critical Paths (Must Have 100% Coverage)

1. **Authentication Flow**
   - Login (phone/password)
   - Login (phone/OTP)
   - Registration
   - Password reset
   - Session management

2. **Payment Flow**
   - Package selection
   - Patient selection
   - Payment method selection
   - Payment callback handling

3. **Care Logging Flow**
   - Check-in with GPS
   - Vitals logging
   - Medication logging
   - Incident reporting
   - Check-out

---

## 🚀 EXECUTION INSTRUCTIONS FOR GPT-5-CODEX

### Step-by-Step Implementation Order

1. **Setup Phase (2 hours)**
   - Install all testing dependencies
   - Configure Jest
   - Configure Playwright
   - Set up MSW handlers

2. **Component Tests (8 hours)**
   - UI components (Button, Input, Select, Card, DataTable)
   - Form components (PatientForm, LoginForm, PackageForm)
   - Card components (JobCard, PatientCard, CaregiverCard)
   - Layout components (Header, Sidebar, DashboardLayout)

3. **Dashboard Tests (3 hours)**
   - Guardian Dashboard
   - Company Dashboard
   - Caregiver Dashboard
   - Moderator Dashboard

4. **User Flow Tests (6 hours)**
   - Authentication flows
   - Patient management flows
   - Package purchase flows
   - Care logging flows

5. **E2E Tests (4 hours)**
   - Critical user journeys
   - Mobile responsiveness
   - Accessibility

6. **I18n Tests (2 hours)**
   - Language switching
   - Translation completeness

7. **Performance Tests (2 hours)**
   - Component render performance
   - Bundle size monitoring

8. **Final Configuration (1 hour)**
   - CI/CD setup
   - Coverage reporting

### Quality Checklist

Before marking testing complete, verify:

- [ ] All tests pass (`npm run test:ci`)
- [ ] Coverage meets thresholds (80%+ overall)
- [ ] E2E tests pass on all browsers
- [ ] Accessibility tests pass (zero violations)
- [ ] No console errors/warnings during tests
- [ ] CI/CD pipeline runs successfully
- [ ] Test documentation is complete

### Commands Reference

```bash
# Run all unit tests
npm run test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only component tests
npm run test:unit

# Run integration/flow tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run E2E tests with browser visible
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug

# View E2E test report
npm run test:e2e:report

# Run all tests (CI)
npm run test:all
```

---

## 📝 NOTES FOR AI AGENT

1. **File Creation Order**: Create test utilities first, then MSW handlers, then component tests, then flow tests, then E2E tests.

2. **Mock Data Consistency**: Always use mock data from `mock-data.ts` to ensure consistency across tests.

3. **Accessibility First**: Every component test should include accessibility checks using jest-axe.

4. **Bangladesh Specifics**: 
   - Phone validation must test +8801XXXXXXXXX format
   - Currency formatting must use BDT/৳
   - Bengali language tests are mandatory

5. **Error Handling**: Include tests for error states, loading states, and empty states.

6. **Performance**: Monitor render times and fail tests if they exceed thresholds.

7. **Documentation**: Add JSDoc comments to test utilities and complex test cases.

**Total Estimated Time: 28-32 hours**

---

*Document Version: 1.0*
*Last Updated: 2025-01-17*
*Target: GPT-5-Codex AI Coding Agent* # Comprehensive Frontend Testing Plan
## Caregiver Digital Solution - Bangladesh

**Document Version:** 1.0  
**Target Agent:** GPT-5-Codex  
**Project:** Caregiver Platform Frontend Testing  
**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui  
**Testing Framework:** Jest, React Testing Library, Playwright  

---

