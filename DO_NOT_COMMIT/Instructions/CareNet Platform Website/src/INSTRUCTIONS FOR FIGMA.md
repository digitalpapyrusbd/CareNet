# CareNet Platform - Mobile-First Frontend Development Guide

**Purpose:** Define mobile-first functionality requirements for each screen/component in the CareNet platform.  
**Version:** 2.0  
**Last Updated:** December 2024  
**Design System:** shadcn/ui + Tailwind CSS  
**Platform:** Progressive Web App (PWA)

**Design Philosophy:** This document specifies FUNCTIONALITY and STRUCTURE. Visual design decisions (colors, typography, specific styling) are delegated to the design tool (Figma/GLM 4.6).

---

## Table of Contents

1. [Mobile-First Design Principles](#1-mobile-first-design-principles)
2. [PWA Specifications](#2-pwa-specifications)
3. [Global Components](#3-global-components)
4. [Authentication Screens](#4-authentication-screens)
5. [Guardian Interface](#5-guardian-interface)
6. [Agency Admin Interface](#6-agency-admin-interface)
7. [Agency Manager Interface](#7-agency-manager-interface)
8. [Caregiver Interface](#8-caregiver-interface)
9. [Patient Interface](#9-patient-interface)
10. [Platform Moderator Panel](#10-platform-moderator-panel)
11. [Platform Admin Dashboard](#11-platform-admin-dashboard)
12. [Shop Admin Interface](#12-shop-admin-interface)
13. [Shop Manager Interface](#13-shop-manager-interface)
14. [Payment Flows](#14-payment-flows)
15. [Chat & Messaging System](#15-chat--messaging-system)
16. [Mobile Interaction Patterns](#16-mobile-interaction-patterns)
17. [Accessibility Requirements](#17-accessibility-requirements)

---

## 1. Mobile-First Design Principles

### Core Philosophy

**Mobile is the PRIMARY design target.** Desktop and tablet are progressive enhancements.

### Breakpoint Strategy

| Priority | Breakpoint | Width | Target |
|----------|------------|-------|--------|
| 1 (Primary) | Mobile | < 640px | Single column, full-width, touch-optimized |
| 2 | Large Mobile | 640px - 768px | Slightly larger touch targets, same layout |
| 3 | Tablet | 768px - 1024px | Two-column where beneficial, sidebar optional |
| 4 | Desktop | > 1024px | Multi-column, persistent sidebar, hover states |

### Mobile-First Rules

1. **Design for mobile FIRST** - All screens start as single-column, touch-friendly layouts
2. **Progressive Enhancement** - Add complexity for larger screens, never remove functionality
3. **Touch Targets** - Minimum 44×44px (iOS) / 48×48px (Android recommended)
4. **Thumb Zone** - Primary actions within easy thumb reach (bottom 60% of screen)
5. **Content Priority** - Most important content loads first, secondary content lazy-loads
6. **Offline Awareness** - Every screen has an offline state defined

### Layout Patterns

**Mobile (Default):**
- Single column layout
- Bottom navigation bar (fixed)
- Full-width cards
- Bottom sheet modals
- Floating Action Button (FAB) for primary actions

**Tablet Enhancement:**
- Two-column layouts where appropriate
- Collapsible sidebar
- Side-by-side modals
- Split view for master-detail

**Desktop Enhancement:**
- Persistent sidebar navigation
- Multi-column grids (3-4 columns)
- Centered modals with max-width
- Hover states and tooltips
- Keyboard shortcuts

---

## 2. PWA Specifications

### 2.1 Web App Manifest

```json
{
  "name": "CareNet - Caregiver Platform",
  "short_name": "CareNet",
  "description": "Find and manage caregiving services",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#ffffff",
  "theme_color": "#7C3AED",
  "icons": [
    { "src": "/icons/icon-72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/icons/icon-128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "screenshots": [
    { "src": "/screenshots/mobile-home.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" },
    { "src": "/screenshots/desktop-home.png", "sizes": "1920x1080", "type": "image/png", "form_factor": "wide" }
  ],
  "categories": ["health", "medical", "lifestyle"],
  "shortcuts": [
    { "name": "Check In", "url": "/caregiver/check-in", "icon": "/icons/check-in.png" },
    { "name": "My Jobs", "url": "/jobs", "icon": "/icons/jobs.png" }
  ]
}
```

### 2.2 Install Prompt Strategy

**When to Show Install Banner:**
- After 2+ page views in a session
- After user completes registration
- After first successful job booking (Guardian)
- After first check-in (Caregiver)
- NOT on first visit
- NOT if already installed
- NOT if dismissed in last 7 days

**Install Prompt UI:**
```
┌─────────────────────────────────────┐
│ 📱 Install CareNet                  │
│                                     │
│ Add to your home screen for quick   │
│ access and offline features.        │
│                                     │
│ [Not Now]          [Install]        │
└─────────────────────────────────────┘
```

**Placement:** Bottom sheet on mobile, banner on desktop

### 2.3 Service Worker & Caching

**Caching Strategies:**

| Resource Type | Strategy | Cache Duration |
|--------------|----------|----------------|
| App Shell (HTML, CSS, JS) | Cache First, Network Fallback | Until new version |
| API Responses (GET) | Network First, Cache Fallback | 5 minutes |
| User Data | Network Only with Background Sync | - |
| Images | Cache First | 7 days |
| Fonts | Cache First | 30 days |
| Static Assets | Cache First | Until new version |

**Precached Resources:**
- Login page
- Dashboard shell
- Offline fallback page
- Critical icons and fonts
- Common UI components

### 2.4 Offline Mode

**Offline Indicator:**
- Persistent banner at top when offline: "You're offline. Some features may be limited."
- Subtle indicator in header when back online (auto-dismiss after 3s)

**Offline Capabilities by Role:**

| Role | Available Offline | Requires Online |
|------|-------------------|-----------------|
| **Caregiver** | View cached job details, Draft care logs (queued), View cached patient info, View cached medication schedule | Check-in/out (GPS required), Submit care logs, View new jobs |
| **Guardian** | View cached patient info, View cached care logs, Draft messages (queued) | Browse packages, Make payments, Real-time care log updates |
| **Agency** | View cached caregiver roster, View cached jobs | Assign caregivers, Create packages, Process payments |
| **All Users** | View cached profile, Access downloaded documents | Login (first time), Registration, Real-time notifications |

**Queued Actions (Background Sync):**
When offline, these actions are queued and synced when connection returns:
- Care log entries
- Draft messages
- Profile updates
- Medication marking

**Queued Action UI:**
```
┌─────────────────────────────────────┐
│ ⏳ Pending Sync (3 items)           │
│                                     │
│ • Care log entry (2:30 PM)    [↻]  │
│ • Medication marked (2:45 PM) [↻]  │
│ • Activity note (3:00 PM)     [↻]  │
│                                     │
│ Will sync when online               │
└─────────────────────────────────────┘
```

### 2.5 Push Notifications

**Permission Request Flow:**
1. Do NOT request on first visit
2. Show contextual prompt explaining benefit BEFORE browser prompt
3. Request after user action that benefits from notifications
4. Respect "Not Now" - don't ask again for 7 days
5. Provide settings to manage later

**Pre-Permission Prompt (Contextual):**
```
┌─────────────────────────────────────┐
│ 🔔 Stay Updated                     │
│                                     │
│ Get instant alerts for:             │
│ • New job assignments               │
│ • Payment confirmations             │
│ • Important care updates            │
│                                     │
│ [Not Now]    [Enable Notifications] │
└─────────────────────────────────────┘
```

**Notification Types by Role:**

| Role | Notification Types |
|------|-------------------|
| **Guardian** | Job status changes, Care log alerts (abnormal vitals), Payment confirmations, Caregiver check-in/out, Dispute updates |
| **Caregiver** | New job offers, Job reminders (30 min before), Payment received, Schedule changes |
| **Agency Admin** | New job bookings, Caregiver acceptance/decline, Payment received, Verification status |
| **Moderator** | New verification queue items, Dispute assignments, Escalations |
| **Admin** | Moderator submissions pending review, System alerts |

**Notification Actions:**
```
┌─────────────────────────────────────┐
│ CareNet                             │
│ New Job Offer                       │
│ Mrs. Rahman needs care starting     │
│ tomorrow at 9:00 AM                 │
│                                     │
│ [View Details]  [Accept]  [Decline] │
└─────────────────────────────────────┘
```

### 2.6 Camera & GPS APIs

**Camera Permission Flow:**

1. **Contextual Trigger:** User taps camera button (check-in photo, document upload, etc.)
2. **Pre-Permission (if first time):**
   ```
   ┌─────────────────────────────────────┐
   │ 📷 Camera Access Needed             │
   │                                     │
   │ To take check-in photos, we need    │
   │ access to your camera.              │
   │                                     │
   │ [Cancel]           [Allow Camera]   │
   └─────────────────────────────────────┘
   ```
3. **Browser Permission:** Standard browser prompt
4. **Denied State:** Show alternative (file upload) with re-request option in settings

**GPS Permission Flow:**

1. **Contextual Trigger:** Check-in button, or "Navigate to Location"
2. **Pre-Permission:**
   ```
   ┌─────────────────────────────────────┐
   │ 📍 Location Access Needed           │
   │                                     │
   │ We verify your location during      │
   │ check-in to ensure accurate         │
   │ timekeeping.                        │
   │                                     │
   │ [Cancel]          [Allow Location]  │
   └─────────────────────────────────────┘
   ```
3. **Location Unavailable Fallback:**
   - Show warning
   - Allow manual override with note requirement
   - Flag for review

**Microphone Permission Flow (Voice Notes):**

1. **Contextual Trigger:** Voice note button in care logging
2. **Pre-Permission:** Explain voice-to-text feature
3. **Denied Fallback:** Text input only

---

## 3. Global Components

### 3.1 Navigation - Mobile (Primary)

**Bottom Navigation Bar:**
- Fixed at bottom of viewport
- Height: 56px (Android) / 49px (iOS safe area aware)
- 4-5 items maximum
- Active state indicator (filled icon + label)
- Badge support for notifications
- Haptic feedback on tap

**Role-Based Bottom Nav Items:**

| Role | Nav Items |
|------|-----------|
| Guardian | Home, Patients, Jobs, Shop, Profile |
| Caregiver | Home, Jobs, Check-In*, Earnings, Profile |
| Agency Admin | Home, Jobs, Caregivers, Packages, More |
| Agency Manager | Home, QA, Feedback, Reports, Profile |
| Patient | Home, Meds, Care Log, Emergency, Profile |
| Shop Admin | Home, Orders, Products, Analytics, Profile |
| Shop Manager | Home, Orders, Inventory, Inquiries, Profile |

*Check-In only visible when caregiver has active job today

**Top App Bar (Mobile):**
- Height: 56px
- Left: Back arrow (if not root) or hamburger menu
- Center: Page title
- Right: Action icons (max 2) + notification bell

**Hamburger Menu (Secondary Nav):**
- Full-screen slide-in from left
- User profile summary at top
- All navigation items
- Settings, Help, Logout at bottom
- Close on outside tap or X button

### 3.2 Navigation - Desktop Enhancement

**Sidebar Navigation:**
- Width: 256px (expanded) / 64px (collapsed)
- Toggle button to collapse
- Sticky positioning
- Nested items with expand/collapse
- Active state highlight
- Footer: Version, Help link

### 3.3 Notification Center

**Mobile:**
- Tap bell icon → Full-screen notification list
- Pull-to-refresh
- Swipe left to dismiss
- Tap to navigate to related item
- "Mark all as read" action

**Desktop Enhancement:**
- Dropdown panel (max 5 recent)
- "View All" link to full page

**Notification Item Structure:**
```
┌─────────────────────────────────────┐
│ 🔵 [Icon] Title                 2h  │
│    Brief description of the         │
│    notification content...          │
└─────────────────────────────────────┘
```

### 3.4 Bilingual Support (i18n)

**Language Toggle:**
- Location: Profile settings (primary), Quick toggle in header (secondary)
- Languages: English (EN), Bengali (BN)
- Behavior: Immediate switch, no page reload
- Persistence: Saved to user profile

**Formatting by Language:**

| Element | English (EN) | Bengali (BN) |
|---------|-------------|--------------|
| Date | MM/DD/YYYY | DD/MM/YYYY |
| Currency | BDT 1,500.00 | ৳ ১,৫০০.০০ |
| Numbers | 1,234 | ১,২৩৪ (optional) |
| Time | 2:30 PM | ২:৩০ PM |

### 3.5 Theme Support

**Modes:** Light, Dark, System (auto)
**Toggle Location:** Settings page
**Behavior:** Immediate switch, persisted to profile

---

## 4. Authentication Screens

### 4.1 Login (`/auth/login`)

**Mobile Layout:**
- Full-screen with logo at top
- Form centered vertically
- Keyboard-aware scroll

**Components:**

**Phone Input:**
- Label: "Phone Number"
- Placeholder: "01XXXXXXXXX"
- Validation: Bangladesh format (+8801[3-9]XXXXXXXX)
- Auto-prefix: Add +880 if user enters 01...
- Keyboard: `tel` type
- Error: "Enter a valid Bangladesh phone number"

**Password Input:**
- Label: "Password"
- Toggle visibility (eye icon)
- Keyboard: Password type
- Error: "Incorrect password"

**Submit Button:**
- Full width on mobile
- Text: "Login"
- Loading: Spinner + "Logging in..."
- Disabled until valid

**Links:**
- "Forgot Password?" → `/auth/forgot-password`
- "Don't have an account? Register" → `/auth/register`

**Post-Login:**
- If MFA enabled → `/auth/mfa`
- Else → Role-appropriate dashboard

### 4.2 Role Selection (`/auth/register`)

**Mobile Layout:**
- Stacked role cards (full width)
- Each card tappable

**Role Cards:**

1. **Guardian/Family Member**
   - Icon: Family
   - Text: "Find care for your loved ones"
   - → `/auth/register/guardian`

2. **Caregiving Agency**
   - Icon: Building
   - Text: "List your services and manage caregivers"
   - → `/auth/register/agency`

3. **Caregiver**
   - Icon: Heart/Hands
   - Text: "Find caregiving opportunities"
   - → `/auth/register/caregiver`

### 4.3 Guardian Registration (`/auth/register/guardian`)

**Multi-Step Form with Progress Indicator:**

**Step 1: Account (1/3)**
- Phone number (required)
- Email (optional)
- Password (required, 8+ chars, 1 uppercase, 1 number)
- Confirm password
- [Next →]

**Step 2: Verify (2/3)**
- OTP sent message with masked number
- 6-digit OTP input (auto-advance between digits)
- Resend timer (60s countdown)
- [Verify]

**Step 3: Profile (3/3)**
- Full name (required)
- Profile photo upload (optional)
- Language preference
- Terms checkbox (required, link to terms)
- Privacy checkbox (required, link to policy)
- [Complete Registration]

**Post-Registration:**
- Auto-login
- Welcome bottom sheet with quick tour option
- Navigate to dashboard

### 4.4 Agency Registration (`/auth/register/agency`)

**Multi-Step Form (5 steps):**

**Step 1-2:** Same as Guardian

**Step 3: Company Info (3/5)**
- Company name (required)
- Trade license number (required)
- TIN number (optional)
- Contact person name (required)
- Contact phone (required)
- Company address (required, with area/zone selector)

**Step 4: Documents (4/5)**
- Trade license upload (required, image/PDF, max 5MB)
- TIN certificate (optional)
- Company logo (optional, image, max 2MB)
- Drag-drop zone with preview

**Step 5: Payout Setup (5/5)**
- Payment method: bKash / Nagad / Bank
- Account details based on selection
- [Submit for Verification]

**Post-Registration:**
- Navigate to pending verification screen
- Show estimated review time (24-48 hours)

### 4.5 Caregiver Registration (`/auth/register/caregiver`)

**Multi-Step Form (6 steps):**

**Step 1-2:** Same as above

**Step 3: Personal Info (3/6)**
- Full name (required)
- Date of birth (required, must be 18+)
- Gender (required)
- Current address (required)
- Profile photo (required)

**Step 4: Identity (4/6)**
- NID number (required, 10 or 17 digits)
- NID front photo (required)
- NID back photo (required)

**Step 5: Professional (5/6)**
- Skills multi-select (required, min 1):
  - Medication Management
  - Mobility Assistance
  - Dementia Care
  - Post-Surgery Care
  - Companion Care
  - Vital Signs Monitoring
  - Wound Care
- Certifications upload (optional, multiple files)
- Years of experience (required)
- Languages (multi-select)
- Expected hourly rate (optional)

**Step 6: Availability (6/6)**
- Weekly calendar grid
- Per-day: Toggle available + time range pickers
- [Submit for Verification]

**Post-Registration:**
- Pending verification screen
- 6-step verification pipeline notice

### 4.6 MFA Verification (`/auth/mfa`)

**Required for:** Admin, Moderator, Agency Admin roles

**Components:**
- 6-digit code input (auto-submit on complete)
- "Use backup code" link
- Session timer
- [Verify] button

### 4.7 Password Reset (`/auth/forgot-password`)

**Step 1:** Phone input → [Send Reset Code]
**Step 2:** OTP verification
**Step 3:** New password + confirm → [Reset Password]
**Success:** Auto-redirect to login

---

## 5. Guardian Interface

### 5.1 Dashboard (`/guardian`)

**Mobile Layout (Primary):**
```
┌─────────────────────────────────────┐
│ Good morning, [Name]            🔔  │
├─────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐            │
│ │+ Patient│ │ Browse  │            │
│ │         │ │Packages │            │
│ └─────────┘ └─────────┘            │
├─────────────────────────────────────┤
│ My Patients                    [+]  │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Patient Name                 │ │
│ │ Age 72 • Diabetes, Heart        │ │
│ │ 🟢 Active Job                   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Patient Name                 │ │
│ │ Age 65 • Post-Surgery           │ │
│ │ No active job                   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Recent Activity                     │
│ • Care log: Vitals recorded - 2h   │
│ • Payment confirmed - Yesterday    │
│ [View All]                          │
└─────────────────────────────────────┘
│ [Home] [Patients] [Jobs] [Shop] [Me]│
└─────────────────────────────────────┘
```

**Desktop Enhancement:**
- 3-column grid for patient cards
- Activity feed in sidebar
- Quick stats row (Active Jobs, Total Spent, etc.)

### 5.2 Patient Management

**Add/Edit Patient (Bottom Sheet on Mobile, Modal on Desktop):**

**Basic Info Section:**
- Name (required)
- Date of birth (date picker)
- Gender (select)
- Blood group (select)
- Photo upload

**Medical Info Section:**
- Primary conditions (multi-select with search)
- Allergies (text area)
- Mobility level (select: Independent, Needs Assistance, Wheelchair, Bedridden)
- Cognitive status (select: Normal, Mild/Moderate/Severe Impairment)

**Location Section:**
- Address (text area)
- Map pin (optional)

**Emergency Contact:**
- Name, Phone, Relationship

**Actions:**
- [Cancel] [Save Patient]

### 5.3 Patient Detail (`/guardian/patients/[id]`)

**Mobile Layout:**
- Patient header card (photo, name, key info)
- Tab bar: Overview | Health | Care Logs | Jobs

**Overview Tab:**
- Patient summary
- Current job card (if active)
- Quick actions: Edit, Upload Prescription, Book Care

**Health Records Tab:**
- Document list with type filters
- Upload button (FAB on mobile)
- Each document: Icon, title, date, actions (view/download/delete)

**Prescription Upload with AI OCR:**
1. Upload image/PDF
2. [Scan with AI] button
3. Extracted medications in editable table
4. [Confirm & Save] creates medication schedule

**Care Logs Tab:**
- Timeline view grouped by date
- Filter by log type
- Expandable entries with photos

**Jobs Tab:**
- Job history table/cards
- Tap → Job detail

### 5.4 Browse Packages (`/packages`)

**Mobile Layout:**
- Search bar (sticky top)
- Filter button → Bottom sheet filters
- Vertically scrollable package cards
- Load more on scroll

**Filters (Bottom Sheet):**
- Location (area selector)
- Category (checkboxes)
- Price range (slider)
- Duration (checkboxes)
- Rating (min stars)

**Package Card:**
```
┌─────────────────────────────────────┐
│ [Agency Logo] Agency Name      ⭐4.8│
│ Package Name                        │
│ 🏷️ Category • 📅 7 days            │
│ ৳ 15,000                           │
│ • Medication management             │
│ • Daily vitals monitoring           │
│                        [View →]     │
└─────────────────────────────────────┘
```

### 5.5 Package Detail (`/packages/[id]`)

**Mobile Layout:**
- Full-width header with package info
- Scrollable details
- Sticky bottom CTA bar

**Sections:**
- Description
- Inclusions (bulleted)
- Exclusions (bulleted)
- Pricing breakdown
- Agency info card

**Sticky Bottom Bar:**
```
┌─────────────────────────────────────┐
│ ৳ 15,000        [Book Now]         │
│ [Request Custom Quote]              │
└─────────────────────────────────────┘
```

**Book Now Flow:**
1. Select patient (dropdown)
2. Select start date
3. → Checkout

**Negotiation Flow:**
1. Tap "Request Custom Quote"
2. Bottom sheet: Modified requirements + message
3. [Send Request]
4. Agency notified, negotiation thread created

### 5.6 Active Jobs (`/guardian/jobs`)

**Mobile Layout:**
- Tab filter: Active | Completed | Disputed
- Job cards stack

**Job Card:**
```
┌─────────────────────────────────────┐
│ 🟢 Active          Day 3 of 7      │
│ Patient Name                        │
│ Package Name • Agency Name          │
│ Caregiver: [Photo] Name ⭐4.9      │
│ Jun 1 - Jun 7, 2024                │
│                        [View →]     │
└─────────────────────────────────────┘
```

### 5.7 Job Detail (`/guardian/jobs/[id]`)

**Mobile Tabs:** Overview | Care Logs | Vitals | Meds

**Overview:**
- Job status card
- Caregiver card with [Message] button
- Schedule summary

**Care Logs (Real-time):**
- Auto-refresh indicator
- Today's logs first
- Grouped by date
- Expandable with photos

**Vitals:**
- Charts (swipeable on mobile)
- Abnormal readings highlighted red
- Table view option

**Medications:**
- Schedule with compliance indicators
- ✓ Given on time | ⚠ Delayed | ✗ Missed

**Actions:**
- [Message Caregiver]
- [Report Issue] → Opens dispute flow
- [Rate & Review] (after completion)

### 5.8 Payment Enforcement States

**Day 3 Reminder (Notification + In-App Banner):**
```
┌─────────────────────────────────────┐
│ ⚠️ Payment Reminder                 │
│ Invoice #123 is due in 4 days       │
│ Amount: ৳ 15,000                   │
│ [Pay Now]                [Dismiss]  │
└─────────────────────────────────────┘
```

**Day 5 Warning:**
```
┌─────────────────────────────────────┐
│ ⚠️ Urgent: Payment Required         │
│ Your account will be restricted in  │
│ 2 days if payment is not received.  │
│ [Pay Now]                           │
└─────────────────────────────────────┘
```

**Day 6 Final Warning:**
- List of features that will be locked
- Prominent Pay Now button

**Day 7+ Locked State:**
```
┌─────────────────────────────────────┐
│ 🔒 Account Restricted               │
│                                     │
│ Your account has been restricted    │
│ due to pending payment.             │
│                                     │
│ You can still:                      │
│ • View existing jobs (read-only)    │
│ • Communicate with assigned CG      │
│ • Make payments                     │
│                                     │
│ You cannot:                         │
│ • Browse or purchase packages       │
│ • Add new patients                  │
│                                     │
│ [Pay Outstanding Balance]           │
│ Amount Due: ৳ 15,000               │
└─────────────────────────────────────┘
```

---

## 6. Agency Admin Interface

### 6.1 Dashboard (`/agency`)

**Mobile Layout:**
- KPI cards (horizontal scroll)
- Job pipeline summary
- Quick actions

**KPI Cards (Horizontal Scroll):**
```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ 12      │ │ 5       │ │৳45,000 │ │ ⭐4.7  │
│Caregivers│ │Active   │ │This    │ │Rating  │
│         │ │Jobs     │ │Month   │ │        │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

**Job Pipeline:**
- New (needs assignment): 3
- Assigned (waiting acceptance): 2
- Active: 5
- Completing Today: 1

**Quick Actions:**
- [+ Create Package]
- [+ Add Caregiver]
- [View All Jobs]

### 6.2 Caregiver Roster (`/agency/caregivers`)

**Mobile Layout:**
- Search bar
- Filter chips (horizontal scroll)
- Caregiver cards stack

**Filters:** Status, Skills, Availability

**Caregiver Card:**
```
┌─────────────────────────────────────┐
│ [Photo] Name                   ⭐4.8│
│ 🟢 Available                        │
│ Medication • Mobility • Dementia    │
│ 15 jobs completed                   │
│                     [View] [Assign] │
└─────────────────────────────────────┘
```

**Add Caregiver Options:**
1. **From CV Pool:** Search verified caregivers → Send job offer
2. **Register New:** Internal registration form

### 6.3 Package Management (`/agency/packages`)

**Package Card:**
```
┌─────────────────────────────────────┐
│ Package Name              🟢 Active │
│ Category • 7 days • ৳15,000        │
│ 12 bookings                         │
│              [Edit] [Duplicate] [⋮] │
└─────────────────────────────────────┘
```

**Create/Edit Package Form:**
- Basic: Name, Category, Description
- Pricing: Total price, Duration, Hours/day, Advance booking days
- Services: Inclusions (tag input), Exclusions
- Settings: Active toggle, Number of caregivers
- Preview button

### 6.4 Job Inbox (`/agency/jobs`)

**Tabs:** New | Assigned | Active | Completed

**New Job (Needs Assignment):**
```
┌─────────────────────────────────────┐
│ 🔴 Needs Assignment                 │
│ Patient: Mrs. Rahman                │
│ Package: Premium Weekly Care        │
│ Start: Jun 1, 2024                  │
│ Guardian: Mr. Karim                 │
│                  [Assign Caregiver] │
└─────────────────────────────────────┘
```

**Assign Caregiver Flow (Bottom Sheet):**
1. Job & patient summary
2. Available caregivers list (filtered by skills/availability)
3. Each shows: Name, skills match %, current workload
4. Select caregiver
5. Set schedule (shift times, days)
6. Conflict detection & warning
7. [Confirm Assignment]
8. Notifications sent to caregiver & guardian

### 6.5 Billing & Finance (`/agency/finance`)

**Summary Cards:**
- Total Earned | This Month | Pending Payout | Commission Paid

**Sections:**

**Incoming (From Guardians):**
- Invoice list
- Status: Paid, Pending, Overdue

**Outgoing (To Caregivers):**
- Caregiver invoice list
- [Review & Pay] actions

**Platform Charges:**
- Subscription status
- Transaction commissions

**Payment Enforcement:** Same lockout pattern as Guardian

### 6.6 Subscription Management (`/agency/subscription`)

**Current Plan Card:**
```
┌─────────────────────────────────────┐
│ Premium Plan              🟢 Active │
│ ৳ 5,000/month                      │
│ Renews: Jul 1, 2024                 │
│                                     │
│ Features:                           │
│ • Unlimited caregivers              │
│ • Advanced analytics                │
│ • Priority support                  │
│                                     │
│ [Change Plan] [Manage Payment]      │
└─────────────────────────────────────┘
```

**Plan Selection:**
- Basic / Premium / Enterprise cards
- Feature comparison
- [Subscribe] / [Upgrade]

---

## 7. Agency Manager Interface

**Access Level:** Limited (QA-focused, read-only for most data)

### 7.1 Manager Dashboard (`/agency-manager`)

**Restrictions Banner (if applicable):**
```
┌─────────────────────────────────────┐
│ ℹ️ Manager Access                   │
│ You have view and QA permissions.   │
│ Contact Agency Admin for changes.   │
└─────────────────────────────────────┘
```

**KPI Cards:**
- Quality Score | Active Jobs | Open Feedback | Incidents

**Quick Access:**
- QA Dashboard
- Feedback Queue
- Reports

### 7.2 QA Dashboard (`/agency-manager/qa`)

**Components:**

**Quality Metrics Cards:**
- Average Rating (trend indicator)
- On-time Check-in Rate
- Care Log Completion Rate
- Incident Rate

**Caregiver Quality Table:**
```
┌─────────────────────────────────────┐
│ Name          Rating  Check-in  Logs│
│ Fatima K.     ⭐4.9   98%      100%│
│ Rahman A.     ⭐4.5   85%       92%│
│ Shirin B.     ⭐4.8   95%       98%│
└─────────────────────────────────────┘
```

**Quality Alerts:**
- Low ratings flagged
- Missed check-ins flagged
- Incomplete logs flagged

**Actions:**
- View caregiver detail (read-only)
- [Submit QA Report to Admin]

### 7.3 Feedback Queue (`/agency-manager/feedback`)

**Feedback List:**
```
┌─────────────────────────────────────┐
│ 🟡 Pending Response                 │
│ Guardian: Mr. Karim                 │
│ Job: #12345                         │
│ "The caregiver was late on..."      │
│ Received: 2 hours ago               │
│                    [View] [Respond] │
└─────────────────────────────────────┘
```

**Respond to Feedback:**
- Original feedback displayed
- Response text area
- [Send Response] → Guardian notified

### 7.4 Reports (`/agency-manager/reports`)

**Report Types:**
- Performance Report (date range)
- Quality Report (by caregiver)
- Activity Report (jobs summary)

**Generate Report:**
1. Select type
2. Select date range
3. [Generate]
4. Preview
5. [Export PDF] [Export CSV]

### 7.5 View Assignments (Read-Only)

**Assignment List:**
- Can view all caregiver assignments
- Cannot edit or reassign
- View job details (read-only)

**Manager Restrictions Summary:**
| Action | Allowed |
|--------|---------|
| View QA metrics | ✅ |
| Respond to feedback | ✅ |
| Generate reports | ✅ |
| View assignments | ✅ |
| Create packages | ❌ |
| Deploy caregivers | ❌ |
| Manage billing | ❌ |
| Access caregiver pool | ❌ |

---

## 8. Caregiver Interface

**Design Priority:** MOBILE-FIRST (primary use case is on-the-go)

### 8.1 Home Screen (`/caregiver`)

**Mobile Layout:**
```
┌─────────────────────────────────────┐
│ Good morning, Fatima            🔔  │
├─────────────────────────────────────┤
│ Today's Schedule                    │
│ ┌─────────────────────────────────┐ │
│ │ Mrs. Rahman                     │ │
│ │ 9:00 AM - 5:00 PM               │ │
│ │ Dhanmondi, Road 5               │ │
│ │                                 │ │
│ │ [Navigate]  [Check In]          │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ This Week          This Month      │
│ ┌─────────┐       ┌─────────┐      │
│ │ 5 Jobs  │       │৳12,500 │      │
│ └─────────┘       └─────────┘      │
├─────────────────────────────────────┤
│ Upcoming Jobs                       │
│ • Jun 2 - Mrs. Begum               │
│ • Jun 5 - Mr. Islam                │
│ [View All Jobs →]                   │
└─────────────────────────────────────┘
│ [Home] [Jobs] [✓] [Earnings] [Me]  │
└─────────────────────────────────────┘
```

**Check-In Button States:**
- Hidden: No job today
- Visible (disabled): Job today but not within time window (30 min before)
- Visible (active): Within check-in window
- Checked In: Shows "Check Out" instead

### 8.2 My Jobs (`/caregiver/jobs`)

**Tabs:** Today | Upcoming | Completed

**Job Card:**
```
┌─────────────────────────────────────┐
│ Patient Name                        │
│ 📅 Jun 1-7 • ⏰ 9AM-5PM            │
│ 📍 Dhanmondi                        │
│ Conditions: Diabetes, Heart         │
│                        [View →]     │
└─────────────────────────────────────┘
```

### 8.3 Job Detail - Caregiver View (`/caregiver/jobs/[id]`)

**IMPORTANT - Data Visibility:**
- ✅ Patient care info (conditions, medications, allergies)
- ✅ Schedule and location
- ✅ Emergency contacts
- ✅ Own wage for this job
- ❌ Package price (what guardian pays)
- ❌ Agency commission
- ❌ Guardian's payment status

**Sections:**

**Patient Info Card:**
- Name, Age, Photo
- Medical conditions (highlighted)
- Allergies (RED highlight)
- Mobility level
- Special instructions
- Emergency contact with [Call] button

**Medication Schedule:**
- Today's medications
- Time, Drug, Dosage
- Checkbox to mark given

**Schedule:**
- Calendar view of shifts
- Today highlighted

**Actions:**
- [Navigate] → Opens maps
- [Check In] / [Check Out]
- [Contact Guardian] → In-app message
- [Emergency Call] → Direct dial

### 8.4 Check-In Flow (`/caregiver/jobs/[id]/check-in`)

**Step 1: Location Verification**
```
┌─────────────────────────────────────┐
│ 📍 Verifying Location...            │
│                                     │
│ [GPS Animation]                     │
│                                     │
│ Please ensure location services     │
│ are enabled.                        │
└─────────────────────────────────────┘
```

**Location Success:**
- ✓ Location verified
- → Next step

**Location Failed/Outside Range:**
```
┌─────────────────────────────────────┐
│ ⚠️ Location Mismatch                │
│                                     │
│ You appear to be away from the      │
│ patient's location.                 │
│                                     │
│ If you're at the correct location,  │
│ you can proceed with a note.        │
│                                     │
│ Note: [________________]            │
│       (Required)                    │
│                                     │
│ [Cancel]    [Proceed with Override] │
└─────────────────────────────────────┘
```
*Override flagged for agency review*

**Step 2: Photo Capture**
```
┌─────────────────────────────────────┐
│ 📷 Check-In Photo                   │
│                                     │
│ Take a photo to confirm arrival     │
│                                     │
│ [Camera Viewfinder]                 │
│                                     │
│ [Capture]                           │
└─────────────────────────────────────┘
```

**Step 3: Confirmation**
```
┌─────────────────────────────────────┐
│ ✅ Checked In                       │
│                                     │
│ Time: 9:02 AM                       │
│ Location: Verified                  │
│                                     │
│ [Start Care Session]                │
└─────────────────────────────────────┘
```

### 8.5 Care Logging Interface (`/caregiver/jobs/[id]/care-log`)

**Mobile Layout:**
```
┌─────────────────────────────────────┐
│ Care Log - Mrs. Rahman          [×] │
├─────────────────────────────────────┤
│ Today's Entries                     │
│                                     │
│ 9:15 AM - 📊 Vitals                │
│ BP: 120/80, HR: 72                  │
│                                     │
│ 9:30 AM - 💊 Medication            │
│ Metformin 500mg given               │
│                                     │
│ 10:00 AM - 📝 Activity             │
│ Assisted with breakfast             │
│                                     │
├─────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ 📊  │ │ 💊  │ │ 📝  │ │ ⚠️  │   │
│ │Vital│ │ Med │ │Note │ │Alert│   │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
└─────────────────────────────────────┘
```

**Log Vitals (Bottom Sheet):**
- Blood Pressure: Systolic [ ] / Diastolic [ ]
- Heart Rate: [ ] BPM
- Temperature: [ ] °F/°C toggle
- Blood Glucose: [ ] mg/dL
- Oxygen: [ ] %
- All optional (log what's measured)
- [Save]
- **Abnormal Detection:** If out of range, show alert option

**Log Medication (Bottom Sheet):**
- List of scheduled medications for current time window
- Each: Drug name, dosage, time
- Actions: [Given] or [Skipped] (with reason)
- Photo capture option
- [Save]

**Log Activity (Bottom Sheet):**
- Activity type dropdown
- Notes field
- **Voice Input Button:**
  ```
  ┌─────────────────────────────────────┐
  │ 🎤 Tap to speak                     │
  │ Speak in Bengali or English         │
  └─────────────────────────────────────┘
  ```
  - Records audio
  - AI transcription to text
  - User can edit transcribed text
- Photo upload (optional)
- [Save]

**Log Incident (Bottom Sheet):**
- Incident type (required): Fall, Emergency, Behavioral, Equipment, Other
- Severity (required): Low, Medium, High, Critical
- Description (required)
- Action taken (required)
- Photo/video evidence (optional)
- [Submit]
- **If High/Critical:** Immediate notification to guardian & agency with confirmation

### 8.6 Check-Out Flow (`/caregiver/jobs/[id]/check-out`)

**Pre-Checkout Checklist:**
```
┌─────────────────────────────────────┐
│ Before You Go                       │
│                                     │
│ ☑️ All medications logged           │
│ ☑️ Vitals recorded                  │
│ ☐ Any incidents reported?           │
│                                     │
│ Handover Notes:                     │
│ [________________________]          │
│ [________________________]          │
│                                     │
│ [Complete Shift]                    │
└─────────────────────────────────────┘
```

**Confirmation:**
- Shift summary generated
- [Complete Shift]
- Guardian notified

### 8.7 Earnings (`/caregiver/earnings`)

**Summary:**
```
┌─────────────────────────────────────┐
│ This Week      This Month    Total  │
│ ৳ 3,500       ৳ 12,500   ৳ 85,000│
└─────────────────────────────────────┘
```

**Earnings List:**
- Grouped by month
- Each: Job, dates, hours, amount, status (Paid/Pending)

**Note:** "Payments handled by your agency"

### 8.8 Job Offers

**New Job Offer (Push Notification → In-App):**
```
┌─────────────────────────────────────┐
│ 📩 New Job Offer                    │
│                                     │
│ Patient: Mrs. Begum                 │
│ Dates: Jun 10-17, 2024              │
│ Shift: 9 AM - 5 PM                  │
│ Location: Gulshan                   │
│ Your Wage: ৳ 800/day               │
│                                     │
│ Conditions: Dementia, Diabetes      │
│ Skills Required: Dementia Care      │
│                                     │
│ [Decline]           [Accept]        │
└─────────────────────────────────────┘
```

**If Declined:** Agency notified, finds another caregiver

---

## 9. Patient Interface

**Access Level:** Limited (personal health view only)

### 9.1 Patient Home (`/patient`)

**Mobile Layout:**
```
┌─────────────────────────────────────┐
│ Hello, [Patient Name]           🔔  │
├─────────────────────────────────────┤
│ Your Caregiver Today                │
│ ┌─────────────────────────────────┐ │
│ │ [Photo] Fatima K.          ⭐4.9│ │
│ │ Certified • 5 years exp         │ │
│ │         [Chat]                  │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Today's Medications                 │
│ ┌─────────────────────────────────┐ │
│ │ 🕐 9:00 AM                      │ │
│ │ Metformin 500mg         ✓ Taken │ │
│ ├─────────────────────────────────┤ │
│ │ 🕐 2:00 PM                      │ │
│ │ Amlodipine 5mg         ⏳ Due   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Quick Actions                       │
│ ┌─────────┐ ┌─────────┐            │
│ │🚨      │ │📞      │            │
│ │Emergency│ │ Call    │            │
│ │         │ │Guardian │            │
│ └─────────┘ └─────────┘            │
└─────────────────────────────────────┘
│ [Home] [Meds] [Logs] [SOS] [Me]    │
└─────────────────────────────────────┘
```

### 9.2 My Caregiver (`/patient/caregiver`)

**Caregiver Profile Display:**
- Photo
- Name
- Certifications
- Skills
- [Chat with Caregiver] button

### 9.3 Medication Schedule (`/patient/medications`)

**Daily View:**
```
┌─────────────────────────────────────┐
│ Today's Medications                 │
│                                     │
│ Morning (Before 12 PM)              │
│ ┌─────────────────────────────────┐ │
│ │ ✓ Metformin 500mg     9:00 AM  │ │
│ │   Given by Fatima K.            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Afternoon (12 PM - 6 PM)            │
│ ┌─────────────────────────────────┐ │
│ │ ⏳ Amlodipine 5mg     2:00 PM  │ │
│ │   Due in 1 hour                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Evening (After 6 PM)                │
│ ┌─────────────────────────────────┐ │
│ │ ○ Metformin 500mg     9:00 PM  │ │
│ │   Scheduled                     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Medication Reminders:**
- Push notification at scheduled time
- In-app reminder popup

### 9.4 Care Log View (`/patient/care-log`)

**Read-Only Timeline:**
- View all care activities
- Meals, exercises, vitals (simplified view)
- Cannot edit

### 9.5 Emergency Contacts (`/patient/emergency`)

**Emergency Contact List:**
```
┌─────────────────────────────────────┐
│ Emergency Contacts                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Mr. Karim (Son)              │ │
│ │ +880 1712345678                 │ │
│ │           [Call]  [Message]     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏥 Dr. Rahman                   │ │
│ │ +880 1812345678                 │ │
│ │           [Call]                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🚑 Ambulance                    │ │
│ │ 999                             │ │
│ │           [Call]                │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 9.6 Emergency Button

**SOS Button (Bottom Nav):**
- Large, prominent button
- Tap → Confirmation dialog
- Confirm → Calls primary emergency contact + sends notification to guardian + caregiver

### 9.7 Rate Caregiver

**After Job Completion:**
```
┌─────────────────────────────────────┐
│ Rate Your Care                      │
│                                     │
│ [Photo] Fatima K.                   │
│                                     │
│ ⭐ ⭐ ⭐ ⭐ ⭐                       │
│                                     │
│ Quick Tags:                         │
│ [Caring] [Professional] [Punctual]  │
│ [Skilled] [Friendly]                │
│                                     │
│ Comments (optional):                │
│ [________________________]          │
│                                     │
│ [Submit Review]                     │
└─────────────────────────────────────┘
```

### 9.8 Patient Restrictions

| Action | Allowed |
|--------|---------|
| View caregiver | ✅ |
| Chat with caregiver | ✅ |
| View medication schedule | ✅ |
| View care logs | ✅ |
| Access emergency contacts | ✅ |
| Rate caregiver | ✅ |
| Make payments | ❌ |
| Purchase packages | ❌ |
| Manage billing | ❌ |
| Edit own profile (medical) | ❌ (Guardian manages) |

---

## 10. Platform Moderator Panel

### 10.1 Moderator Dashboard (`/moderator`)

**KPI Cards:**
- Pending Verifications (with badge)
- Open Disputes
- Active Caregivers (total)
- Active Agencies (total)

**Queue Summary:**
- Agency verifications: X pending
- Caregiver verifications: X pending
- Disputes: X open
- Tickets: X open

### 10.2 Verification Queue (`/moderator/verification`)

**Tabs:** Agencies | Caregivers

**Agency Verification Item:**
```
┌─────────────────────────────────────┐
│ ABC Care Services                   │
│ Submitted: Jun 1, 2024              │
│ Documents: Trade License, TIN       │
│                      [Review →]     │
└─────────────────────────────────────┘
```

**Review Panel (Slide-in on Mobile):**

**Document Viewer:**
- Zoomable document preview
- Download option
- Multiple documents tabbed

**Verification Checklist:**
- ☐ Trade license valid
- ☐ License not expired
- ☐ Address matches license
- ☐ Contact info verified

**Internal Notes:**
- Text area for moderator notes

**Actions (TWO-TIER AUTHORITY):**
```
┌─────────────────────────────────────┐
│ Recommendation                      │
│                                     │
│ [Recommend Approval]                │
│ [Request More Info]                 │
│ [Recommend Rejection]               │
│                                     │
│ ⚠️ Final approval by Admin         │
└─────────────────────────────────────┘
```

**Moderator submits to Admin queue, NOT final approval**

### 10.3 Caregiver Verification (6-Step Pipeline)

**Pipeline View:**
```
┌─────────────────────────────────────┐
│ Fatima K. - Verification            │
├─────────────────────────────────────┤
│ Step 1: Certificates     ✅ Passed  │
│ Step 2: Police Clearance ✅ Passed  │
│ Step 3: Interview        🔄 Current │
│ Step 4: Psych Assessment ○ Pending  │
│ Step 5: Document Check   ○ Pending  │
│ Step 6: Final Approval   ○ Pending  │
└─────────────────────────────────────┘
```

**Each Step:**
1. Moderator reviews/conducts
2. Moderator makes recommendation
3. **Submits to Admin for approval**
4. Admin: Approve / Send Back / Reject
5. If approved → Next step
6. If sent back → Moderator re-reviews
7. If rejected → Pipeline ends

### 10.4 CV Pool Management (`/moderator/cv-pool`)

**Searchable Database:**
- Filter: Skills, Location, Rating, Availability, Experience
- Results table with caregiver cards
- [View Profile] action

### 10.5 Dispute Center (`/moderator/disputes`)

**Dispute List:**
```
┌─────────────────────────────────────┐
│ 🔴 #D-1234          Open • 3 days  │
│ Type: Service Quality               │
│ Guardian vs Caregiver               │
│ Job: #J-5678                        │
│               [Assign to Me] [View] │
└─────────────────────────────────────┘
```

**Dispute Detail Page:**

**Case Header:**
- ID, Status, Time Open
- [Assign to Me] if unassigned

**Parties:**
- Raised by: Name, role, contact
- Against: Name, role, contact

**Evidence Tabs:**
- Submitted Evidence
- Care Logs
- Payment Records
- Messages

**Case Timeline:**
- All actions logged

**Resolution Panel (TWO-TIER):**
```
┌─────────────────────────────────────┐
│ Resolution Recommendation           │
│                                     │
│ Decision:                           │
│ [Full Refund to Guardian      ▼]   │
│                                     │
│ Resolution Notes: (required)        │
│ [________________________]          │
│                                     │
│ [Submit to Admin for Approval]      │
│                                     │
│ ⚠️ Complex cases escalate directly │
│ [Escalate to Admin]                 │
└─────────────────────────────────────┘
```

### 10.6 Support Tickets (`/moderator/tickets`)

**Ticket Queue:**
- Filter: Status, Priority, Type
- Ticket list with summary
- [Respond] action

**Ticket Response:**
- Thread view of messages
- Reply text area
- [Send Reply]
- [Close Ticket] or [Escalate]

### 10.7 Moderator Communications

**Message Center:**
- Chat with Agencies
- Chat with Caregivers
- Chat with Guardians
- Contact Admin (Escalation)

---

## 11. Platform Admin Dashboard

### 11.1 Admin Dashboard (`/admin`)

**Extended KPIs:**
- All Moderator KPIs plus:
- Total Platform Revenue
- Active Moderators
- System Health

### 11.2 Moderator Submissions Queue (`/admin/approvals`)

**TWO-TIER AUTHORITY - Admin Reviews ALL Moderator Submissions**

**Queue Tabs:** Verifications | Disputes | Tickets | Deployments

**Submission Item:**
```
┌─────────────────────────────────────┐
│ Agency Verification                 │
│ ABC Care Services                   │
│ Moderator: M. Rahman                │
│ Recommendation: Approve             │
│ Submitted: 2 hours ago              │
│                           [Review]  │
└─────────────────────────────────────┘
```

**Admin Review Panel:**

**Moderator's Submission:**
- Summary of what moderator reviewed
- Moderator's recommendation
- Moderator's notes

**Original Data:**
- All documents
- Verification checklist

**Admin Decision (3-Way):**
```
┌─────────────────────────────────────┐
│ Your Decision                       │
│                                     │
│ [✅ Approve]                        │
│ Finalize and activate               │
│                                     │
│ [🔄 Send Back to Moderator]        │
│ Return with feedback for re-review  │
│                                     │
│ [❌ Override & Reject]              │
│ Reject regardless of recommendation │
│                                     │
│ Feedback Notes:                     │
│ [________________________]          │
│                                     │
│ [Submit Decision]                   │
└─────────────────────────────────────┘
```

### 11.3 Moderator Management (`/admin/moderators`)

**Moderator Table:**
- Name, Email, Status, Last Active, Workload
- [Add Moderator] button

**Add Moderator:**
- Name, Email, Phone
- Permission level
- [Send Invite]

**Edit Moderator:**
- Update permissions
- Deactivate account

### 11.4 Package Templates (`/admin/templates`)

**Agency Package Templates:**
- Create templates agencies can use
- Category, services, pricing guidelines

**Caregiver Package Templates:**
- Templates for independent caregivers (if applicable)

### 11.5 Subscription Management (`/admin/subscriptions`)

**Create Subscription Plans:**
- For Agencies: Basic, Premium, Enterprise
- For Caregivers (if applicable)
- For Shops

**Plan Configuration:**
- Name, Price, Billing cycle
- Features included
- Limits (caregivers, listings, etc.)

### 11.6 Platform Analytics (`/admin/analytics`)

**Charts:**
- User Growth (line)
- Transaction Volume (bar)
- Revenue Trends (line)
- Geographic Distribution (map)
- Device Breakdown (pie)

**Filters:**
- Date range
- Entity type
- Region

**Export:** PDF Report, CSV

### 11.7 Audit Logs (`/admin/logs`)

**Log Viewer:**
```
┌─────────────────────────────────────┐
│ Audit Logs                          │
├─────────────────────────────────────┤
│ Filters:                            │
│ Date: [Jun 1] to [Jun 30]          │
│ Entity: [All Types ▼]               │
│ Action: [All Actions ▼]             │
│ User: [Search...        ]           │
│ Result: [All ▼]                     │
│                          [Search]   │
├─────────────────────────────────────┤
│ Results (1,234 entries)             │
│                                     │
│ 2024-06-01 14:30:00                │
│ auth_login • admin@carenet.com      │
│ IP: 192.168.1.1 • Success           │
│                                     │
│ 2024-06-01 14:25:00                │
│ approval • Agency: ABC Care         │
│ By: M. Rahman • Success             │
│                                     │
│ [View Details] [Export CSV/JSON]    │
└─────────────────────────────────────┘
```

**Log Entry Detail:**
- Timestamp
- User ID & Entity Type
- Action Type
- Target Resource
- Before/After Values (for updates)
- IP Address, Device Info
- Session ID
- Result & Error (if any)

### 11.8 System Settings (`/admin/settings`)

**Commission Settings:**
- Default commission rate
- Category-specific overrides

**Feature Flags:**
- Marketplace enabled
- Shop module enabled
- AI features enabled

**Content Management:**
- Terms & Conditions editor
- Privacy Policy editor
- FAQ management

**System:**
- Maintenance mode toggle
- Announcement banner

### 11.9 Locked Accounts (`/admin/locked-accounts`)

**View accounts locked due to payment enforcement:**
```
┌─────────────────────────────────────┐
│ Locked Accounts                     │
├─────────────────────────────────────┤
│ ABC Agency                          │
│ Type: Agency • Locked: 3 days ago   │
│ Outstanding: ৳ 5,000               │
│ [View Details] [Manual Unlock]      │
├─────────────────────────────────────┤
│ Mr. Karim                           │
│ Type: Guardian • Locked: 1 day ago  │
│ Outstanding: ৳ 15,000              │
│ [View Details] [Manual Unlock]      │
└─────────────────────────────────────┘
```

**Manual Unlock:** Admin can unlock with reason (e.g., payment arrangement made)

---

## 12. Shop Admin Interface

### 12.1 Shop Dashboard (`/shop`)

**KPI Cards:**
- Today's Orders | Revenue This Month | Pending Orders | Low Stock

**Quick Actions:**
- [+ Add Product]
- [View Orders]

### 12.2 Product Management (`/shop/products`)

**Product List:**
```
┌─────────────────────────────────────┐
│ [Image] Product Name        🟢 Live│
│ Category • ৳ 500                   │
│ Stock: 25                           │
│              [Edit] [Deactivate]    │
└─────────────────────────────────────┘
```

**Add/Edit Product:**
- Images (multiple)
- Name, Description
- Category: Medicines, Equipment (Sale/Rental), Services
- Price
- Stock quantity
- Active toggle
- [Save]

### 12.3 Order Management (`/shop/orders`)

**Order List:**
```
┌─────────────────────────────────────┐
│ #O-1234              🟡 Processing  │
│ 3 items • ৳ 1,500                  │
│ Customer: Mr. Karim                 │
│ Ordered: 2 hours ago                │
│                     [Process →]     │
└─────────────────────────────────────┘
```

**Order Detail:**
- Items list
- Customer info
- Shipping address
- Status: Pending → Processing → Shipped → Delivered

**Update Status Flow:**
1. Accept order
2. Process (pack)
3. Ship (add tracking)
4. Mark delivered

### 12.4 Shop Analytics (`/shop/analytics`)

**Charts:**
- Sales over time
- Top products
- Revenue by category

### 12.5 Shop Billing (`/shop/billing`)

**Platform Charges:**
- Subscription fee
- Commission on sales

**Payment Enforcement:** Same 7-day lockout pattern

---

## 13. Shop Manager Interface

**Access Level:** Operations-focused (no pricing, no billing)

### 13.1 Manager Dashboard (`/shop-manager`)

**Restrictions Banner:**
```
┌─────────────────────────────────────┐
│ ℹ️ Manager Access                   │
│ You can process orders and manage   │
│ inventory. Contact Admin for other  │
│ changes.                            │
└─────────────────────────────────────┘
```

**KPIs:**
- Pending Orders | Processing | Low Stock Items

### 13.2 Order Queue (`/shop-manager/orders`)

**Order Processing:**
- View incoming orders
- Update order status (Confirm → Process → Ship → Complete)
- Add tracking numbers
- Cannot: Change pricing, issue refunds

### 13.3 Inventory Management (`/shop-manager/inventory`)

**Inventory List:**
```
┌─────────────────────────────────────┐
│ Product Name                        │
│ Stock: 5            🔴 Low Stock   │
│               [Update Stock]        │
└─────────────────────────────────────┘
```

**Update Stock:**
- Adjust quantity
- Add stock note
- [Save]

**Low Stock Alerts:**
- Items below threshold highlighted
- [Notify Admin] action

### 13.4 Customer Inquiries (`/shop-manager/inquiries`)

**Inquiry Queue:**
- Customer questions about products/orders
- [Respond] action
- [Escalate to Admin] for complex issues

### 13.5 Manager Restrictions

| Action | Allowed |
|--------|---------|
| View orders | ✅ |
| Process orders | ✅ |
| Update inventory | ✅ |
| Respond to inquiries | ✅ |
| Chat with Shop Admin | ✅ |
| Change pricing | ❌ |
| Add/remove products | ❌ |
| Manage billing | ❌ |
| Run promotions | ❌ |

---

## 14. Payment Flows

### 14.1 Checkout (`/checkout`)

**Mobile Layout:**
```
┌─────────────────────────────────────┐
│ Checkout                        [×] │
├─────────────────────────────────────┤
│ Order Summary                       │
│ ┌─────────────────────────────────┐ │
│ │ Premium Weekly Care             │ │
│ │ ABC Care Services               │ │
│ │ Patient: Mrs. Rahman            │ │
│ │ Jun 1-7, 2024                   │ │
│ │                                 │ │
│ │ Subtotal: ৳ 14,500             │ │
│ │ Platform Fee: ৳ 500            │ │
│ │ Total: ৳ 15,000                │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Payment Method                      │
│                                     │
│ ○ bKash [Logo]                     │
│ ● Nagad [Logo]                     │
│                                     │
├─────────────────────────────────────┤
│ Billing Info                        │
│ Name: Mr. Karim (pre-filled)        │
│ Phone: +880 171... (pre-filled)     │
├─────────────────────────────────────┤
│                                     │
│ [Pay ৳ 15,000]                     │
└─────────────────────────────────────┘
```

### 14.2 Payment Gateway Redirect

**Flow:**
1. Show loading: "Redirecting to [Provider]..."
2. User completes payment on gateway
3. Redirect back

### 14.3 Payment Success (`/payment/success`)

```
┌─────────────────────────────────────┐
│           ✅                        │
│                                     │
│    Payment Successful!              │
│                                     │
│ Transaction ID: TXN-123456          │
│ Amount: ৳ 15,000                   │
│                                     │
│ Your booking is confirmed.          │
│ The agency will assign a caregiver  │
│ shortly.                            │
│                                     │
│ [View Order]                        │
│ [Return to Dashboard]               │
└─────────────────────────────────────┘
```

### 14.4 Payment Failed (`/payment/failed`)

```
┌─────────────────────────────────────┐
│           ❌                        │
│                                     │
│    Payment Failed                   │
│                                     │
│ Your payment could not be           │
│ processed.                          │
│                                     │
│ Error: Transaction declined         │
│                                     │
│ [Try Again]                         │
│ [Contact Support]                   │
└─────────────────────────────────────┘
```

### 14.5 Invoice View (`/invoices/[id]`)

**Invoice Display:**
- Invoice number
- Date issued
- Due date
- From/To details
- Line items
- Total
- Payment status
- [Pay Now] if unpaid
- [Download PDF]

### 14.6 Escrow States

**Funds in Escrow:**
```
┌─────────────────────────────────────┐
│ 💰 Escrow Status                    │
│                                     │
│ Amount: ৳ 15,000                   │
│ Status: Held                        │
│                                     │
│ Funds will be released to the       │
│ agency 48 hours after job           │
│ completion if no disputes.          │
└─────────────────────────────────────┘
```

**Escrow Frozen (Dispute):**
```
┌─────────────────────────────────────┐
│ ❄️ Escrow Frozen                    │
│                                     │
│ Amount: ৳ 15,000                   │
│ Reason: Dispute #D-1234             │
│                                     │
│ Funds are on hold pending           │
│ dispute resolution.                 │
│                                     │
│ [View Dispute]                      │
└─────────────────────────────────────┘
```

---

## 15. Chat & Messaging System

### 15.1 Chat Access Points

**Integration Locations:**

Add message/chat buttons to the following existing screens:

| Screen | Button/Action | Navigation |
|--------|---------------|------------|
| Guardian Job Detail | [Message Caregiver] button | → Chat Thread |
| Caregiver Job Detail | [Contact Guardian] button | → Chat Thread |
| Patient Home | [Chat with Caregiver] button | → Chat Thread |
| Agency Job Detail | [Message Guardian], [Message Caregiver] | → Chat Thread |
| All Roles - Header | Message icon with badge | → Conversation List |

**Header Message Icon:**
- Location: Top app bar, right side
- Badge: Shows unread message count
- Tap: Opens Conversation List screen
- Active state: Highlighted when on message screens

### 15.2 Conversation List Screen (`/messages`)

**Mobile Layout (Primary):**

```
┌─────────────────────────────────────┐
│ ← Messages                     🔍   │
├─────────────────────────────────────┤
│ [Search conversations...]           │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 👤 Fatima Khan       🟢    2m   │ │
│ │ Caregiver                       │ │
│ │ I've completed vitals check  [2]│ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Mr. Karim              1h    │ │
│ │ Guardian                        │ │
│ │ Thank you for the care          │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🏢 Elite Caregivers   Yesterday │ │
│ │ Agency                          │ │
│ │ New job assignment available    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│               [+ New Message]        │ (FAB)
└─────────────────────────────────────┘
```

**Components:**

**Search Bar:**
- Location: Sticky top below header
- Placeholder: "Search conversations..."
- Search: Name, role, message content
- Real-time filtering

**Conversation Card:**
- Avatar: User photo (circular, 48×48px)
- Name: Bold, truncated at 1 line
- Role Badge: Small pill (Guardian, Caregiver, Agency, etc.)
- Online Status: Green dot (if active in last 5 min)
- Last Message: Gray text, truncated at 2 lines
- Timestamp: Relative time (2m, 1h, Yesterday, MM/DD)
- Unread Badge: Red circle with count (right-aligned)
- Touch Target: Full card height (min 72px)
- Tap Action: Navigate to chat thread
- Swipe Left: Delete/Archive actions (optional)

**Empty State:**
```
┌─────────────────────────────────────┐
│                                     │
│         💬                          │
│                                     │
│     No conversations yet            │
│                                     │
│  Start chatting with caregivers,    │
│  guardians, or agencies             │
│                                     │
│      [Start New Message]            │
│                                     │
└─────────────────────────────────────┘
```

**FAB (Floating Action Button):**
- Icon: Plus or pen icon
- Position: Bottom right
- Text: "New Message"
- Tap: Opens contact selector

**Desktop Enhancement:**
- Split view: Conversation list (30%) | Active thread (70%)
- Conversation list always visible
- No FAB, use "+ New Message" button in header

### 15.3 Chat Thread Screen (`/messages/[conversationId]`)

**Mobile Layout:**

```
┌─────────────────────────────────────┐
│ ← 👤 Fatima Khan    🟢         ⋮   │
│   Caregiver                         │
├─────────────────────────────────────┤
│                                     │
│              Jun 1, 2024            │ (Date separator)
│                                     │
│ ┌─────────────────────┐             │
│ │ Hello! I'm on my    │             │ (Received)
│ │ way to the patient  │             │
│ └─────────────────────┘             │
│   9:30 AM                           │
│                                     │
│             ┌─────────────────────┐ │
│             │ Great, thank you!   │ │ (Sent)
│             └─────────────────────┘ │
│                         9:35 AM ✓✓ │
│                                     │
│         [System Message]            │
│    Caregiver checked in at 9:45 AM  │
│                                     │
│ ┌─────────────────────┐             │
│ │ [Image Preview]     │             │
│ │ 📷                  │             │
│ └─────────────────────┘             │
│   10:00 AM                          │
│                                     │
│             ┌─────────────────────┐ │
│             │ Got it, looks good  │ │
│             └─────────────────────┘ │
│                        10:05 AM ✓✓ │
│                                     │
│   Fatima is typing...               │
│                                     │
├─────────────────────────────────────┤
│ 📎  [Type a message...]    [Send→] │ (Input area)
└─────────────────────────────────────┘
```

**Header:**
- Back Arrow: Navigate to conversation list
- Avatar: 36×36px circular photo
- Name: Bold, truncated
- Role: Small text below name
- Online Status: Green dot when active
- More Menu (⋮): Options (Mute, Block, Report)

**Message Area:**
- Scrollable (flex-1, overflow-y-auto)
- Messages grouped by date with separators
- Auto-scroll to bottom on new message
- Pull down to load older messages

**Date Separators:**
- Centered, gray text
- Format: "Jun 1, 2024" | "Yesterday" | "Today"
- Spacing: 16px top/bottom

**Received Messages (Left-aligned):**
- Background: Light gray (light mode) / Dark gray (dark mode)
- Border Radius: 16px (rounded corners, square bottom-left)
- Max Width: 75% of screen
- Padding: 12px 16px
- Text Color: Default foreground
- Timestamp: Below bubble, small gray text, left-aligned

**Sent Messages (Right-aligned):**
- Background: Primary color
- Border Radius: 16px (rounded corners, square bottom-right)
- Max Width: 75% of screen
- Padding: 12px 16px
- Text Color: White
- Timestamp + Read Receipt: Below bubble, small text, right-aligned

**Read Receipts:**
- Single checkmark (✓): Sent
- Double checkmark (✓✓): Delivered
- Double checkmark blue (✓✓): Read

**System Messages:**
- Centered, gray background pill
- Icon + text (e.g., "🎯 Caregiver checked in at 9:45 AM")
- Non-interactive
- Use cases: Check-in/out, Job start/end, Payment received

**Typing Indicator:**
- Position: Bottom of message area, left-aligned
- Text: "[Name] is typing..."
- Animation: Three dots bouncing
- Hide after 5s of inactivity

**Input Area:**
- Fixed at bottom, above keyboard
- Height: 56px (expands with multi-line)
- Background: Card background
- Border top: 1px

**Attachment Button (📎):**
- Icon button, left side
- Tap: Opens action sheet with options:
  - 📷 Camera
  - 🖼️ Gallery
  - 📄 Document
  - Cancel
- Uploads show progress bar
- Max file size: 10MB

**Text Input:**
- Placeholder: "Type a message..."
- Auto-focus on screen load
- Multi-line support (max 4 lines before scroll)
- Keyboard type: Default

**Send Button:**
- Icon: Arrow or paper plane
- Position: Right side
- States:
  - Disabled (gray): When input empty
  - Enabled (primary color): When text entered
  - Loading: Spinner when sending
- Tap: Send message, clear input, auto-scroll to bottom

**Keyboard Awareness:**
- Input area pushes up with keyboard
- Message area adjusts height
- Auto-scroll to keep latest message visible

**Desktop Enhancement:**
- Input area remains at bottom of thread panel
- Wider max message width (60%)
- Hover states for messages (show timestamp always)

### 15.4 Message Types & Rendering

**Text Messages:**
- Default type
- Supports line breaks
- URL auto-detection with link styling
- Phone number detection (tap to call)

**Image Messages:**
- Thumbnail in message bubble (max 200×200px)
- Tap: Opens full-screen viewer
- Caption support (text below image)
- Loading state: Skeleton with progress
- Failed: Error icon + retry button

**Full-Screen Image Viewer:**
```
┌─────────────────────────────────────┐
│ ×                              ⋮   │ (Close, Options)
├─────────────────────────────────────┤
│                                     │
│                                     │
│         [Full Image]                │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ Caption text here if any            │
│ Sent by Fatima Khan at 10:00 AM     │
└─────────────────────────────────────┘
```

**Document Messages:**
- Icon based on file type (PDF, DOC, etc.)
- File name (truncated)
- File size
- Tap: Opens in browser or downloads
- Example:
```
┌─────────────────────┐
│ 📄 Prescription.pdf │
│ 2.3 MB              │
│ [Download ↓]        │
└─────────────────────┘
```

**System Messages:**
- Centered gray pill
- Icon + descriptive text
- Examples:
  - "🎯 Caregiver checked in at 9:45 AM"
  - "✅ Job completed successfully"
  - "💰 Payment received: ৳15,000"
  - "📝 New care log added"

### 15.5 Real-Time Features

**Online Status:**
- Green dot next to user name in header
- Criteria: Active in last 5 minutes
- Updates every 30 seconds
- Offline: No dot shown

**Typing Indicator:**
- Trigger: User types in input field
- Send: Typing event to other party
- Display: "[Name] is typing..." with animated dots
- Hide: After 5s of no typing activity

**New Message Handling:**
- Real-time: WebSocket or polling (every 5s)
- Notification: If app in background
- In-app: Message appears with slide-in animation
- Sound: Optional ding (user setting)
- Haptic: Light vibration on mobile
- Auto-scroll: If user at bottom of thread

**Read Receipts:**
- Trigger: Message visible in viewport for 2s
- Update: Double checkmark turns blue
- Privacy: User can disable in settings

**Message Status Flow:**
1. Sending (spinner)
2. Sent (single ✓)
3. Delivered (double ✓✓)
4. Read (double ✓✓ blue)

### 15.6 Push Notifications for Messages

**When New Message Received (App in Background):**

**Notification Payload:**
```
Title: Fatima Khan
Body: I've completed today's vitals check
Icon: Sender avatar
Badge: Update app badge count
Action Buttons: [Reply] [View]
```

**Tap Notification:**
- Opens app to conversation thread
- Auto-focuses input field if [Reply] tapped
- Marks message as read

**Notification Grouping:**
- Multiple messages from same person: Stack under one notification
- Update body to "3 new messages"

**Quiet Hours:**
- User setting: Do not disturb (e.g., 10 PM - 7 AM)
- Critical messages (Admin/Moderator): Bypass quiet hours

### 15.7 Role-Based Messaging Permissions

**Who Can Message Whom:**

| From ↓ / To → | Guardian | Caregiver | Agency | Patient | Moderator | Admin |
|---------------|----------|-----------|--------|---------|-----------|-------|
| **Guardian** | - | ✅ (assigned) | ✅ | - | ✅ | - |
| **Caregiver** | ✅ (assigned) | - | ✅ (employer) | ✅ (assigned) | ✅ | - |
| **Agency** | ✅ (client) | ✅ (roster) | - | - | ✅ | ✅ |
| **Patient** | - | ✅ (assigned) | - | - | - | - |
| **Moderator** | ✅ | ✅ | ✅ | - | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | - | ✅ | ✅ |

**Permission Notes:**
- **"assigned"**: Only during active job relationship
- **"employer"**: Caregiver can message their employing agency
- **"client"**: Agency can message guardians who've booked packages
- **"roster"**: Agency can message caregivers on their roster

**Initiate Conversation:**
- Guardian: Can start chat with assigned caregiver or booked agency
- Caregiver: Can start chat with guardian of active job or employer agency
- Agency: Can start chat with any rostered caregiver or client guardian
- Patient: Can start chat with currently assigned caregiver only
- Moderator/Admin: Can start chat with anyone

**Permission Enforcement:**
- New Message button: Only shows eligible contacts
- Contact selector: Filters by permissions
- Direct message links: Validate permission server-side
- Expired jobs: Read-only access, cannot send new messages

### 15.8 Offline Behavior

**Offline Capabilities:**

| Action | Available Offline | Behavior |
|--------|-------------------|----------|
| View conversations | ✅ | Show cached list |
| Read messages | ✅ | Show cached thread |
| Compose message | ✅ | Draft saved locally |
| Send message | ⏳ | Queued for sync |
| Receive messages | ❌ | Requires connection |
| View images | ✅ | If previously loaded |
| Download files | ❌ | Requires connection |
| See typing indicator | ❌ | Requires connection |
| See online status | ❌ | Requires connection |

**Offline Indicator:**
- Banner at top: "You're offline. Messages will send when online."
- Queued messages: Clock icon (🕒) instead of checkmark

**Message Queue:**
```
┌─────────────────────────────────────┐
│             ┌─────────────────────┐ │
│             │ Thank you!          │ │
│             └─────────────────────┘ │
│                   Queued 🕒         │
│             ┌─────────────────────┐ │
│             │ I'll be there soon  │ │
│             └─────────────────────┘ │
│                   Queued 🕒         │
├─────────────────────────────────────┤
│ 📶 No connection. Messages will     │
│    send automatically when online.  │
└─────────────────────────────────────┘
```

**Sync on Reconnect:**
- Auto-detect connection restore
- Send queued messages in order
- Update status to sent/delivered
- Fetch new messages
- Toast: "Messages sent" (brief)

**Failed Send:**
- Persistent failure (e.g., server error)
- Change queue icon to error (⚠️)
- Tap: Retry or delete options

### 15.9 Integration Points & Updates to Existing Screens

**Header Notification Badge (All Roles):**
- **Location**: Message icon in top app bar
- **Badge**: Red dot or number showing unread count
- **Update**: Real-time (WebSocket) or polling
- **Tap**: Navigate to `/messages`

**Guardian - Job Detail Screen:**
- **Add Button**: [Message Caregiver]
- **Location**: Below caregiver info card
- **Style**: Secondary button, full-width on mobile
- **Action**: Navigate to chat thread with assigned caregiver
- **Disabled State**: If job not yet assigned

**Caregiver - Job Detail Screen:**
- **Add Buttons**: 
  - [Contact Guardian] - Opens chat with guardian
  - [Contact Agency] - Opens chat with agency (if applicable)
- **Location**: Action section, below job details
- **Style**: Outlined buttons, stacked on mobile

**Patient - Home Screen:**
- **Add Button**: [Chat with Caregiver]
- **Location**: On caregiver info card (if assigned)
- **Style**: Icon button or text link
- **Disabled State**: If no active caregiver assignment

**Agency - Job Detail Screen:**
- **Add Buttons**:
  - [Message Guardian] - Chat with job requester
  - [Message Caregiver] - Chat with assigned caregiver
- **Location**: Action menu or below respective cards
- **Permission**: Only if job involves agency

**Moderator/Admin - User Detail Screens:**
- **Add Button**: [Message User]
- **Location**: User profile header
- **Purpose**: Communication for verification, disputes, support

**All Screens - Quick Message Shortcut:**
- **Implementation**: Long-press on user avatar → Quick action menu → "Send Message"
- **Location**: Any screen showing user cards (roster, job list, etc.)

### 15.10 Additional Features

**Conversation Actions (More Menu):**
- **Mute Conversation**: Stop notifications for this chat
- **Block User**: Prevent new messages (Admin/Moderator only)
- **Report**: Flag inappropriate messages
- **Clear Chat**: Delete local message history
- **Mark as Unread**: Return to unread state

**Message Search (Future Enhancement):**
- Search within conversation thread
- Search across all conversations
- Filter by date, sender, attachment type

**Rich Notifications (Mobile):**
- Inline reply from notification
- Mark as read action
- Quick actions based on message type

**Accessibility:**
- Screen reader support for all message types
- Keyboard navigation for input and actions
- High contrast mode for message bubbles
- Font size respects system settings

**Security:**
- End-to-end encryption (future consideration)
- Message retention policy (90 days for regular, indefinite for job-related)
- Admin audit logs for moderator/admin messages

---

## 16. Mobile Interaction Patterns

### 15.1 Touch Gestures

| Gesture | Action | Usage |
|---------|--------|-------|
| Tap | Primary action | Buttons, links, cards |
| Long Press | Secondary action menu | Cards, list items |
| Swipe Left | Destructive action (delete, dismiss) | Notifications, list items |
| Swipe Right | Positive action (archive, mark done) | Tasks, notifications |
| Pull Down | Refresh content | Lists, feeds |
| Pinch | Zoom | Images, documents |

### 15.2 Bottom Sheets

**Use Instead of Modals on Mobile:**
- Filter panels
- Action menus
- Forms (short)
- Confirmations

**Bottom Sheet Behavior:**
- Drag handle at top
- Swipe down to dismiss
- Snap points: 50%, 90%, dismiss
- Background dimmed, tap outside to close

### 15.3 Floating Action Button (FAB)

**Usage:**
- Primary create action
- Position: Bottom right, above bottom nav
- Size: 56×56px
- Shadow for elevation

**Expandable FAB:**
- Tap → Expands to show 2-3 quick actions
- Used when multiple create actions exist

### 15.4 Skeleton Loading

**Pattern:**
- Match actual content layout
- Animated shimmer effect
- Show immediately (no delay)
- Replace with content when loaded

### 15.5 Pull-to-Refresh

**Implementation:**
- Native feel on iOS/Android
- Loading indicator at top
- Refresh all list data
- Success feedback (subtle)

### 15.6 Haptic Feedback

**Trigger Points:**
- Bottom nav tap
- Toggle switches
- Button press (important actions)
- Success/Error states
- Pull-to-refresh release

**Implementation:** Use `navigator.vibrate()` with appropriate patterns

### 15.7 Native Share

**Share Button:**
- Uses Web Share API when available
- Fallback: Copy link to clipboard

**Shareable Content:**
- Package details
- Agency profiles
- Caregiver reviews

### 15.8 Voice Input

**Implementation:**
- Web Speech API
- Languages: English, Bengali
- Visual feedback during recording
- Transcription preview
- Edit before submit

**Usage:**
- Care log activity notes
- Search (optional)
- Messages (optional)

---

## 17. Accessibility Requirements

### 16.1 Touch Accessibility

- Minimum touch target: 44×44px (48×48px recommended)
- Touch target spacing: 8px minimum
- No hover-only actions on mobile
- Visible focus states for keyboard navigation

### 16.2 Screen Reader Support

- All images have alt text
- Form labels properly associated
- ARIA labels for icon-only buttons
- Semantic HTML structure
- Live regions for dynamic content
- Skip navigation link

### 16.3 Color & Contrast

- WCAG AA minimum (4.5:1 for text)
- Don't rely on color alone (use icons + text)
- Test with color blindness simulators
- Support high contrast mode

### 16.4 Motion

- Respect `prefers-reduced-motion`
- Provide option to disable animations
- No auto-playing videos without controls

### 16.5 Form Accessibility

- Error messages announced
- Required fields indicated (asterisk + text)
- Inline validation messages
- Keyboard-navigable date/time pickers

### 16.6 Offline Accessibility

- Clear offline indicators
- Cached content accessible
- Actions queued with feedback
- Sync status visible

---

## Summary: Entity Count & Workflows

### Entities (9)

| # | Entity | Primary Platform | Interface Type |
|---|--------|------------------|----------------|
| 1 | Platform Admin | Desktop | Full Admin Panel |
| 2 | Platform Moderator | Desktop/Tablet | Admin Panel |
| 3 | Agency Admin | Desktop/Mobile | Dashboard |
| 4 | Agency Manager | Desktop/Mobile | Limited Dashboard |
| 5 | Caregiver | **Mobile (Primary)** | Mobile-First App |
| 6 | Guardian | Mobile/Desktop | Dashboard |
| 7 | Patient | **Mobile (Primary)** | Simplified View |
| 8 | Shop Admin | Desktop/Mobile | Dashboard |
| 9 | Shop Manager | Desktop/Mobile | Limited Dashboard |

### Key System Patterns

| Pattern | Implementation |
|---------|---------------|
| Two-Tier Authority | Moderator recommends → Admin decides (Approve/Send Back/Reject) |
| 7-Day Payment Enforcement | Day 3 reminder → Day 5 warning → Day 6 final → Day 7 lockout |
| Three-Tier Billing | Caregiver→Agency→Guardian + Platform fees |
| Escrow | Funds held until job completion + 48hr dispute window |
| Audit Logging | All actions logged, Admin can view/filter/export |

---

## Notes for Design Implementation

1. **Mobile-First:** Design all screens for 360px width first, then enhance
2. **Offline States:** Every screen needs an offline state defined
3. **Loading States:** Skeleton screens, not spinners, for content areas
4. **Empty States:** Illustration + message + CTA for empty lists
5. **Error States:** Friendly messages, retry options, support links
6. **Touch Optimization:** Thumb-zone aware layouts, large touch targets
7. **Bilingual Testing:** Test with both EN and BN content (length varies)
8. **PWA Features:** Install prompts, push notifications, offline caching
9. **Accessibility:** WCAG AA compliance, screen reader testing
10. **Performance:** Lazy loading, image optimization, minimal JS blocking

---

*End of Document - Version 2.0*
