# Performance Optimization Implementation

## ✅ Completed Optimizations

### 1. **Next.js Configuration** (`next.config.js`)
- ✅ **SWC Minification**: Enabled `swcMinify: true` (faster than Terser)
- ✅ **Compression**: Enabled `compress: true` (Gzip/Brotli)
- ✅ **Console Removal**: Production builds remove `console.log` (keep errors/warns)
- ✅ **Image Optimization**:
  - Device sizes: 640-3840px
  - Image sizes: 16-384px
  - Cache TTL: 60 seconds
  - AVIF + WebP formats
- ✅ **Removed**: `poweredByHeader` for security

### 2. **Font Optimization** (`layout.tsx`)
- ✅ **Font Display**: `display: 'swap'` (prevent FOIT)
- ✅ **Preload**: `preload: true` for Inter font
- ✅ **Font Strategy**: Loads fonts efficiently

### 3. **Code Splitting** (`src/components/lazy/index.ts`)
Created lazy-loaded exports for heavy components:
- ✅ `DashboardCharts` - Chart library (ssr: false)
- ✅ `DataTable` - Table with sorting/filtering
- ✅ `Chart` - Individual charts
- ✅ `BkashPayment` - Payment SDK
- ✅ `NagadPayment` - Payment SDK  
- ✅ `CameraCapture` - MediaDevices API (ssr: false)

**Usage:**
```tsx
import { DashboardCharts } from '@/components/lazy';
// Lazy loaded with skeleton, only downloads when rendered
```

### 4. **Image Lazy Loading** (`src/components/ui/LazyImage.tsx`)
- ✅ **Intersection Observer**: Loads images 50px before viewport
- ✅ **Skeleton Loader**: Animated placeholder while loading
- ✅ **Fade-in**: Smooth opacity transition when loaded
- ✅ **Configurable**: Custom threshold & rootMargin

**Usage:**
```tsx
<LazyImage 
  src="/image.jpg" 
  alt="Description" 
  width={800} 
  height={600}
  threshold={0.1}
  rootMargin="50px"
/>
```

### 5. **Performance Monitoring** (`src/components/performance/PerformanceMonitoring.tsx`)
- ✅ **Web Vitals Tracking**:
  - CLS (Cumulative Layout Shift)
  - FID (First Input Delay) 
  - FCP (First Contentful Paint)
  - LCP (Largest Contentful Paint)
  - TTFB (Time to First Byte)
  - INP (Interaction to Next Paint)
- ✅ **Resource Hints**:
  - DNS prefetch for API
  - Preconnect to API & CDN
  - Preload critical fonts
- ✅ **Analytics**: Sends metrics to `/api/analytics/vitals`

---

## 📊 Lighthouse Audit Checklist

### How to Run
```bash
# 1. Build production bundle
npm run build
npm start

# 2. Open Chrome DevTools (F12)
# 3. Go to "Lighthouse" tab
# 4. Select:
#    ☑ Performance
#    ☑ Accessibility
#    ☑ Best Practices
#    ☑ PWA
# 5. Device: Mobile
# 6. Click "Analyze page load"
```

### Target Scores
- **Performance**: >90 (Target: 95+)
- **Accessibility**: >90 (Target: 95+)
- **Best Practices**: >90 (Target: 95+)
- **PWA**: 100
- **SEO**: >90

### Performance Metrics Targets
- **FCP** (First Contentful Paint): <1.8s
- **LCP** (Largest Contentful Paint): <2.5s
- **CLS** (Cumulative Layout Shift): <0.1
- **FID** (First Input Delay): <100ms
- **Speed Index**: <3.4s
- **Total Blocking Time**: <200ms

---

## 🚀 Additional Optimizations to Apply

### 1. Route-Level Code Splitting
Already implemented by Next.js App Router automatically. Each page is a separate chunk.

### 2. Component-Level Lazy Loading
Apply to heavy components:

```tsx
// Before
import { DashboardCharts } from '@/components/ui/DashboardCharts';

// After
import { DashboardCharts } from '@/components/lazy';
```

**Apply to:**
- [ ] `src/app/dashboard/*/page.tsx` - Replace chart imports
- [ ] `src/app/payments/page.tsx` - Lazy load payment SDKs
- [ ] `src/app/care-logs/page.tsx` - Lazy load data tables

### 3. Image Optimization
Replace `<img>` and heavy `<Image>` with `<LazyImage>`:

```tsx
// Before
<Image src="/photo.jpg" alt="Photo" width={800} height={600} />

// After
<LazyImage src="/photo.jpg" alt="Photo" width={800} height={600} />
```

**Apply to:**
- [ ] Profile avatars
- [ ] Job listing photos
- [ ] Patient photos
- [ ] Caregiver photos
- [ ] Incident report images

### 4. Critical CSS
Extract critical CSS for above-the-fold content:

```bash
npm install critters --save-dev
```

Update `next.config.js`:
```js
experimental: {
  optimizeCss: true,
  critters: true,
}
```

### 5. Reduce Bundle Size

**Check bundle size:**
```bash
npm run build
# Look for large chunks in output

# Analyze bundle
npm install @next/bundle-analyzer --save-dev
```

**`next.config.js`:**
```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

**Run:**
```bash
ANALYZE=true npm run build
```

**Common optimizations:**
- Replace Moment.js with date-fns (smaller)
- Replace Lodash with native methods
- Tree-shake unused library code

### 6. Prefetch Critical Resources

Add to pages with known navigation:

```tsx
// In critical landing pages
import Link from 'next/link';

<Link href="/dashboard" prefetch>
  Go to Dashboard
</Link>
```

### 7. Service Worker Optimization

Update `public/sw.js`:
- [ ] Cache font files
- [ ] Cache critical CSS
- [ ] Implement stale-while-revalidate for API
- [ ] Add runtime caching for avatars

---

## 🧪 Testing Methodology

### 1. Desktop Testing
```bash
# Chrome DevTools
1. Open DevTools → Network tab
2. Throttle: "Fast 3G"
3. Disable cache
4. Hard refresh (Ctrl+Shift+R)
5. Check:
   - Load time <3s
   - FCP <1.8s
   - Interactive <3.8s
```

### 2. Mobile Testing (Real Device)
```bash
# Android Chrome
1. Settings → Developer options → Limit background processes
2. Enable "Show layout bounds"
3. Clear app cache
4. Test load time on 3G connection
5. Monitor battery/CPU usage
```

### 3. Lighthouse CI
```bash
# Install
npm install -g @lhci/cli

# Run
lhci autorun --config=lighthouserc.json
```

**`lighthouserc.json`:**
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:pwa": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

### 4. WebPageTest
```
URL: https://www.webpagetest.org/
Settings:
- Location: Bangladesh (or nearest)
- Browser: Mobile - Chrome
- Connection: 3G
- Runs: 3

Check:
- Start Render <2s
- First Byte <0.8s
- Document Complete <3s
```

---

## 📈 Monitoring & Metrics

### Web Vitals API Endpoint

Create `src/app/api/analytics/vitals/route.ts`:
```ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const metric = await request.json();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vital]', metric);
    }
    
    // TODO: Send to analytics service
    // await analytics.track('web-vital', metric);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to record metric' },
      { status: 500 }
    );
  }
}
```

### Dashboard Integration

Add Web Vitals chart to moderator/admin dashboard:
- Real-time performance metrics
- Historical trends
- Per-page breakdown
- User device/browser stats

---

## 🎯 Performance Budget

Set limits to prevent regressions:

**JavaScript:**
- Main bundle: <200KB (gzipped)
- Per route: <50KB (gzipped)
- Total: <500KB (gzipped)

**Images:**
- Hero images: <100KB
- Avatars: <20KB
- Icons: <5KB

**Fonts:**
- Total: <100KB
- WOFF2 only

**CSS:**
- Main: <50KB (gzipped)
- Critical: <14KB (inline)

**Total Page Weight:**
- First load: <1MB
- Subsequent: <500KB

---

## ✅ Completion Checklist

### Implementation
- [x] Next.js config optimized
- [x] Font loading optimized
- [x] Lazy loading components created
- [x] Lazy image component created
- [x] Performance monitoring added
- [x] Resource hints added
- [ ] Apply lazy loading to all pages
- [ ] Replace all images with LazyImage
- [ ] Create Web Vitals API endpoint
- [ ] Run bundle analyzer
- [ ] Optimize largest chunks

### Testing
- [ ] Run Lighthouse (mobile): Score >90
- [ ] Run Lighthouse (desktop): Score >90
- [ ] Test on 3G: Load time <3s
- [ ] Test on real Android device
- [ ] Test on real iOS device
- [ ] WebPageTest: Start render <2s
- [ ] Check bundle size <500KB

### Monitoring
- [ ] Set up Web Vitals tracking
- [ ] Create performance dashboard
- [ ] Set up alerts for regressions
- [ ] Document baseline metrics

**Status:** Core optimizations complete - Application & testing required

**Estimated Remaining:** 1-2 hours for full application and validation
