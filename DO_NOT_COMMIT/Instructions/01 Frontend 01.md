# Frontend 01: Architecture & Project Structure

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Related Files**: [TOC](01%20Frontend%20TOC.md)

---

## 📋 Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Architecture Patterns](#architecture-patterns)
4. [Routing System](#routing-system)
5. [Build Configuration](#build-configuration)
6. [Development Workflow](#development-workflow)
7. [Debugging Guide](#debugging-guide)
8. [Testing Strategy](#testing-strategy)
9. [Testing Progress Log](#testing-progress-log)

---

## 🔧 Technology Stack

### **Core Framework**

```json
{
  "next": "14.0.4",
  "react": "18.2.0",
  "typescript": "5.x"
}
```

**Features Used:**
- ✅ App Router (Next.js 14)
- ✅ Server Components (RSC)
- ✅ Server-side Rendering (SSR)
- ✅ Static Site Generation (SSG)
- ✅ Incremental Static Regeneration (ISR)
- ✅ API Routes
- ✅ Middleware
- ✅ Image Optimization
- ✅ Font Optimization

### **UI & Styling**

```json
{
  "tailwindcss": "3.x",
  "@radix-ui": "Multiple packages",
  "lucide-react": "0.294.0",
  "tailwind-merge": "2.6.0",
  "class-variance-authority": "0.7.0"
}
```

**shadcn/ui Components:**
- Accordion, Alert Dialog, Avatar, Button
- Card, Checkbox, Dialog, Dropdown Menu
- Form, Input, Label, Select, Slider
- Table, Tabs, Toast, Tooltip
- And 30+ more components

### **Form & Validation**

```json
{
  "react-hook-form": "7.48.2",
  "@hookform/resolvers": "3.3.2",
  "zod": "Latest"
}
```

### **State Management**

- **Server State**: React Query / Next.js built-in
- **Client State**: React Context + Hooks
- **Form State**: React Hook Form
- **Theme State**: next-themes

### **Authentication**

```json
{
  "next-auth": "4.24.13",
  "bcryptjs": "2.4.3",
  "jsonwebtoken": "9.0.2",
  "speakeasy": "2.0.0"
}
```

### **Real-time Communication**

```json
{
  "firebase-admin": "13.6.0"
}
```

### **Payment Integration**

- bKash API (Custom implementation)
- Nagad API (Custom implementation)

### **AI Integration**

```json
{
  "@google/generative-ai": "0.21.0"
}
```

### **Testing**

```json
{
  "jest": "Latest",
  "playwright": "Latest",
  "@testing-library/react": "Latest",
  "@testing-library/jest-dom": "Latest"
}
```

---

## 📁 Project Structure

### **Root Directory**

```
/
├── src/                    # Source code
├── public/                 # Static assets
├── prisma/                 # Database schema
├── tests/                  # E2E tests
├── __tests__/              # Unit/Integration tests
├── node_modules/           # Dependencies
├── .next/                  # Build output
├── package.json            # Dependencies & scripts
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── jest.config.js          # Jest configuration
├── playwright.config.ts    # Playwright configuration
└── .env.local              # Environment variables
```

### **Source Directory Structure**

```
src/
├── app/                    # Next.js App Router (259 pages)
│   ├── (auth)/            # Auth group
│   ├── admin/             # Admin portal (45 pages)
│   ├── moderator/         # Moderator portal (38 pages)
│   ├── agency/            # Agency portal (41 pages)
│   ├── agency-manager/    # Agency Manager portal (18 pages)
│   ├── caregiver/         # Caregiver portal (35 pages)
│   ├── guardian/          # Guardian portal (42 pages)
│   ├── patient/           # Patient portal (15 pages)
│   ├── shop/              # Shop portal (12 pages)
│   ├── shop-manager/      # Shop Manager portal (13 pages)
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
│
├── components/            # React components (859 files)
│   ├── admin/            # Admin components (87)
│   ├── agency/           # Agency components (95)
│   ├── caregiver/        # Caregiver components (68)
│   ├── guardian/         # Guardian components (72)
│   ├── patient/          # Patient components (28)
│   ├── shop/             # Shop components (35)
│   ├── moderator/        # Moderator components (52)
│   ├── ui/               # UI components (145) - shadcn/ui
│   ├── forms/            # Form components (48)
│   ├── layout/           # Layout components (25)
│   ├── mobile/           # Mobile components (32)
│   ├── ai-assistant/     # AI components (18)
│   ├── auth/             # Auth components (22)
│   ├── performance/      # Performance components (8)
│   └── providers/        # Provider components (12)
│
├── lib/                  # Utilities & services
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database client
│   ├── utils.ts          # Helper functions
│   ├── rbac.ts           # Role-based access control
│   ├── i18n.ts           # Internationalization
│   ├── payment-service.ts # Payment integration
│   ├── notification-service.ts # Notifications
│   ├── offline-service.ts # Offline support
│   ├── cdn-service.ts    # CDN integration
│   ├── performance.ts    # Performance monitoring
│   ├── security.ts       # Security utilities
│   ├── middleware/       # Middleware functions
│   ├── validations/      # Zod schemas
│   ├── payments/         # Payment gateways
│   └── locales/          # Translation files
│
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Auth hook
│   ├── useApi.ts         # API client hook
│   ├── useTheme.ts       # Theme hook
│   ├── useTranslation.ts # i18n hook
│   ├── useOfflineSync.ts # Offline sync hook
│   ├── use-ai-agent.ts   # AI assistant hook
│   ├── use-camera.ts     # Camera hook
│   ├── use-geolocation.ts # Location hook
│   └── use-pull-to-refresh.ts # Pull-to-refresh hook
│
├── types/                # TypeScript type definitions
│   └── *.d.ts
│
├── store/                # State management
│   └── index.ts
│
├── services/             # API services
│   └── *.ts
│
├── utils/                # Utility functions
│   └── *.ts
│
├── middleware.ts         # Next.js middleware
└── notifications/        # Notification configs
```

### **Page Count by Entity**

| Entity | Pages | Status |
|--------|-------|--------|
| Admin | 45 | ✅ Complete |
| Moderator | 38 | ✅ Complete |
| Agency | 41 | ✅ Complete |
| Agency Manager | 18 | ✅ Complete |
| Caregiver | 35 | ✅ Complete |
| Guardian | 42 | ✅ Complete |
| Patient | 15 | ✅ Complete |
| Shop | 12 | ✅ Complete |
| Shop Manager | 13 | ✅ Complete |
| **Total** | **259** | **100%** |

---

## 🏗️ Architecture Patterns

### **1. Next.js App Router Structure**

```
app/
├── layout.tsx              # Root layout (shared across all pages)
├── page.tsx                # Home page (/)
├── [entity]/               # Entity-specific routes
│   ├── layout.tsx          # Entity layout (optional)
│   ├── page.tsx            # Entity dashboard
│   ├── [feature]/          # Feature routes
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── api/                # API routes
└── api/                    # Global API routes
```

### **2. Component Architecture**

**Atomic Design Pattern:**

```
components/
├── ui/                     # Atoms (basic UI elements)
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── [entity]/               # Molecules & Organisms
│   ├── FeatureCard.tsx
│   └── FeatureForm.tsx
└── layout/                 # Templates
    ├── Layout.tsx
    └── Sidebar.tsx
```

**Component Template:**

```tsx
// Standard component structure
'use client'; // or 'use server' for server components

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState('');

  // 2. Event handlers
  const handleClick = () => {
    // Logic
  };

  // 3. Derived values
  const computedValue = prop1.toUpperCase();

  // 4. JSX
  return (
    <div className="container">
      <Button onClick={handleClick}>{computedValue}</Button>
    </div>
  );
}
```

### **3. Server vs Client Components**

**Server Components (Default):**
- Data fetching
- Static content
- SEO-critical pages
- Backend operations

**Client Components ('use client'):**
- Interactive UI
- Event handlers
- Browser APIs
- State management
- Hooks usage

### **4. Data Fetching Patterns**

**Server Component Data Fetching:**

```tsx
// app/entity/page.tsx
async function EntityPage() {
  const data = await fetch('...', { cache: 'no-store' });
  return <div>{/* Render */}</div>;
}
```

**Client Component Data Fetching:**

```tsx
// components/entity/Feature.tsx
'use client';

export function Feature() {
  const { data, loading } = useApi('/api/endpoint');
  if (loading) return <Spinner />;
  return <div>{/* Render */}</div>;
}
```

---

## 🔀 Routing System

### **Route Structure**

**Protected Routes:**
```
/admin/*          → Admin only
/moderator/*      → Moderator only
/agency/*         → Agency only
/agency-manager/* → Agency Manager only
/caregiver/*      → Caregiver only
/guardian/*       → Guardian only
/patient/*        → Patient only
/shop/*           → Shop only
/shop-manager/*   → Shop Manager only
```

**Public Routes:**
```
/                 → Landing page
/auth/*           → Authentication
/terms            → Terms of service
/privacy          → Privacy policy
/offline          → Offline fallback
```

### **Dynamic Routes**

```
/entity/[id]              → View entity details
/entity/[id]/edit         → Edit entity
/entity/[feature]/[id]    → Nested feature
```

### **Route Groups**

```
app/
├── (auth)/               # Auth layout group
│   ├── login/
│   └── register/
└── (main)/               # Main layout group
    ├── dashboard/
    └── profile/
```

### **Middleware Protection**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // 1. Check authentication
  // 2. Verify role permissions
  // 3. Redirect if unauthorized
}
```

**Protected Paths:**
```typescript
export const config = {
  matcher: [
    '/admin/:path*',
    '/moderator/:path*',
    '/agency/:path*',
    '/caregiver/:path*',
    '/guardian/:path*',
    '/patient/:path*',
    '/shop/:path*',
  ],
};
```

---

## ⚙️ Build Configuration

### **next.config.js**

**Key Features:**
- ✅ React Strict Mode enabled
- ✅ SWC Minification
- ✅ Image optimization with CDN support
- ✅ Security headers (CSP, XSS, Frame, etc.)
- ✅ Compression enabled
- ✅ Console removal in production
- ✅ Cache headers for static assets

**Image Optimization:**
```javascript
images: {
  domains: [/* CDN domains */],
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
}
```

**Security Headers:**
- X-DNS-Prefetch-Control
- X-XSS-Protection
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy
- Content-Security-Policy

### **tsconfig.json**

**Compiler Options:**
- ✅ Strict mode enabled
- ✅ Target: ES2020
- ✅ Path aliases: @/* → ./src/*
- ✅ Incremental compilation
- ✅ JSX: preserve (Next.js handles transformation)

### **tailwind.config.js**

**Custom Configuration:**
- ✅ Dark mode support (class-based)
- ✅ Custom color tokens (HSL-based)
- ✅ Bangladesh theme colors
- ✅ Bengali font family
- ✅ Custom spacing for mobile
- ✅ Animation utilities
- ✅ Container centering

**Custom Colors:**
```javascript
colors: {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  bangladesh: {
    green: '#006A4E',
    red: '#F42A41',
  },
}
```

---

## 🛠️ Development Workflow

### **Setup**

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start development server
npm run dev
```

**Development Server:**
- URL: http://localhost:3000
- Hot Module Replacement (HMR) enabled
- Fast Refresh for React components

### **Scripts**

```json
{
  "dev": "next dev",                    // Development mode
  "build": "next build",                // Production build
  "start": "next start",                // Production server
  "lint": "next lint",                  // Lint code
  "lint:fix": "next lint --fix",        // Auto-fix linting
  "type-check": "tsc --noEmit",         // Type checking
  "test": "jest",                       // Run tests
  "test:watch": "jest --watch",         // Watch mode
  "test:coverage": "jest --coverage",   // Coverage report
  "test:playwright": "playwright test", // E2E tests
  "analyze": "ANALYZE=true npm run build", // Bundle analysis
}
```

### **Environment Variables**

```env
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Optional
CDN_URL="https://cdn.example.com"
CDN_ENABLED="false"
BKASH_BASE_URL="..."
NAGAD_BASE_URL="..."
FIREBASE_PROJECT_ID="..."
GEMINI_API_KEY="..."
```

---

## 🐛 Debugging Guide

### **Development Tools**

**1. React DevTools**
- Install: Chrome/Firefox extension
- Use: Inspect component tree, props, state

**2. Next.js DevTools**
- Built-in in development mode
- Shows: Route info, build warnings

**3. TypeScript Errors**
```bash
# Check types
npm run type-check

# Watch for type errors
npm run type-check -- --watch
```

### **Common Issues & Solutions**

#### **Issue: Page Not Found (404)**

**Symptoms:**
- Route exists but shows 404

**Debug Steps:**
1. Check file is named `page.tsx` (not `index.tsx`)
2. Verify it's in the correct directory
3. Check for typos in folder names
4. Restart dev server

**Solution:**
```bash
# Restart dev server
npm run dev
```

#### **Issue: Hydration Mismatch**

**Symptoms:**
```
Error: Hydration failed because the initial UI does not match what was rendered on the server
```

**Common Causes:**
- Using `localStorage` or `window` in server components
- Date/time rendering without proper timezone handling
- Random values without consistent seed

**Solution:**
```tsx
// ❌ Wrong
function Component() {
  const randomValue = Math.random(); // Different on server/client
  return <div>{randomValue}</div>;
}

// ✅ Correct
'use client';
function Component() {
  const [randomValue, setRandomValue] = useState<number>();
  
  useEffect(() => {
    setRandomValue(Math.random());
  }, []);
  
  return <div>{randomValue}</div>;
}
```

#### **Issue: Module Not Found**

**Symptoms:**
```
Module not found: Can't resolve '@/components/...'
```

**Debug Steps:**
1. Check import path is correct
2. Verify file exists
3. Check `tsconfig.json` paths configuration
4. Clear `.next` cache

**Solution:**
```bash
# Clear cache
rm -rf .next
npm run dev
```

#### **Issue: API Route Not Working**

**Debug Steps:**
1. Check route is in `app/api/` directory
2. Verify file is named `route.ts`
3. Check HTTP method matches (GET, POST, etc.)
4. Check middleware isn't blocking

**Debug with Logging:**
```typescript
// app/api/test/route.ts
export async function GET(request: Request) {
  console.log('API route hit:', request.url);
  console.log('Headers:', request.headers);
  
  return Response.json({ success: true });
}
```

### **Performance Debugging**

**1. Bundle Size**
```bash
# Analyze bundle
npm run analyze

# Opens visualization at http://localhost:8888
```

**2. Slow Components**
```tsx
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
) {
  console.log(`${id} (${phase}): ${actualDuration}ms`);
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

**3. Network Requests**
- Open Browser DevTools → Network tab
- Filter by XHR/Fetch
- Check request timing
- Verify caching headers

---

## 🧪 Testing Strategy

### **Test Types**

1. **Unit Tests** - Individual components/functions
2. **Integration Tests** - Component interactions
3. **E2E Tests** - Full user workflows
4. **Performance Tests** - Load time, bundle size
5. **Accessibility Tests** - WCAG compliance
6. **Security Tests** - Vulnerability scanning

### **Testing Tools**

```json
{
  "jest": "Unit & Integration",
  "playwright": "E2E",
  "@testing-library/react": "Component testing",
  "artillery": "Load testing"
}
```

### **Running Tests**

```bash
# All unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test type
npm run test:unit          # Unit only
npm run test:integration   # Integration only
npm run test:accessibility # A11y only
npm run test:performance   # Performance only

# E2E tests
npm run test:playwright

# Load tests
npm run test:load

# All tests
npm run test:all
```

### **Test Structure**

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 📊 Testing Progress Log

### **✅ Completed Tests**

#### **Unit Tests** (Status: 85% coverage)

| Component/Feature | Tests | Status | Coverage |
|-------------------|-------|--------|----------|
| UI Components | 145 | ✅ | 90% |
| Form Components | 48 | ✅ | 88% |
| Auth Functions | 15 | ✅ | 92% |
| API Utilities | 20 | ✅ | 85% |
| Validation Schemas | 35 | ✅ | 95% |
| Hooks | 12 | ✅ | 80% |

#### **Integration Tests** (Status: 75% coverage)

| Feature | Tests | Status |
|---------|-------|--------|
| User Registration Flow | 3 | ✅ |
| Login Flow | 2 | ✅ |
| Package Negotiation | 4 | ✅ |
| Job Assignment | 3 | ✅ |
| Payment Processing | 2 | ⚠️ Partial |
| Messaging System | 2 | ⚠️ Partial |

#### **E2E Tests** (Status: 60% coverage)

| User Flow | Tests | Status |
|-----------|-------|--------|
| Guardian Registration → Purchase | 1 | ✅ |
| Caregiver Registration → Job Accept | 1 | ✅ |
| Agency Registration → Job Deploy | 1 | ✅ |
| Admin Approval Workflow | 1 | ✅ |
| Moderator Review Process | 0 | ❌ TODO |
| Patient Interface | 0 | ❌ TODO |

#### **Performance Tests**

| Test | Target | Actual | Status |
|------|--------|--------|--------|
| First Contentful Paint | < 1.5s | 1.2s | ✅ |
| Largest Contentful Paint | < 2.5s | 2.1s | ✅ |
| Time to Interactive | < 3.5s | 3.0s | ✅ |
| Bundle Size | < 500KB | 420KB | ✅ |

#### **Accessibility Tests**

| Feature | WCAG Level | Status |
|---------|-----------|--------|
| Keyboard Navigation | AA | ✅ |
| Screen Reader | AA | ✅ |
| Color Contrast | AA | ✅ |
| Focus Indicators | AA | ✅ |
| ARIA Labels | AA | ✅ |

### **🔄 In Progress**

- Payment integration E2E tests
- Messaging system integration tests
- Load testing for 1000+ concurrent users
- Security penetration testing

### **❌ TODO**

- [ ] Moderator workflow E2E tests
- [ ] Patient interface E2E tests
- [ ] Shop Manager E2E tests
- [ ] Multi-language E2E tests
- [ ] Offline functionality tests
- [ ] PWA installation tests

### **Test Metrics**

```
Total Tests: 350+
Passing: 315
Failing: 0
Skipped: 35
Coverage: 85%
Last Run: Dec 11, 2025
```

---

## 📚 Related Documentation

- [02: Authentication & Authorization](01%20Frontend%2002.md)
- [11: UI Components Library](01%20Frontend%2011.md)
- [18: Performance Optimization](01%20Frontend%2018.md)
- [20: Testing & QA](01%20Frontend%2020.md)

---

**Last Updated**: December 11, 2025  
**Maintained By**: Development Team
