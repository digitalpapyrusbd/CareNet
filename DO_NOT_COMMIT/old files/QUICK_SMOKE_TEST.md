# CareNet Platform - Quick Smoke Test

**Purpose:** Rapid verification of critical functionality  
**Time Required:** 15-20 minutes  
**Use When:** After major changes, before deployment, or for quick validation

---

## 🚀 Prerequisites

- [ ] Development server running at http://localhost:3000
- [ ] Browser open (Chrome recommended)
- [ ] `navigation.html` ready for quick access

---

## ⚡ CRITICAL PATH TESTING

### 1. Public Pages (2 minutes)

**Landing Page** - http://localhost:3000
- [x] Page loads without errors
- [x] "Login" button routes to login  
- [x] "Register" button routes to role selection
- [x] All 3 role cards are clickable

**Login** - http://localhost:3000/auth/login
- [x] Page loads with CareNet logo
- [x] Phone input works
- [x] Password toggle works
- [x] "Forgot Password" link works
- [x] "Register" link works

**Role Selection** - http://localhost:3000/auth/role-selection
- [x] 3 role cards display
- [ ] Guardian card routes to /guardian/registration/step-1 (NOT TESTED - need to fix Layout first)
- [ ] Caregiver card routes to /caregiver/registration/step-1 (NOT TESTED - need to fix Layout first)
- [ ] Agency card routes to /agency/registration/step-1 (NOT TESTED - need to fix Layout first)

---

### 2. Guardian Flow (3 minutes)

**Registration**
- [ ] Step 1 loads at /guardian/registration/step-1 (NOT TESTED - Layout error blocks testing)
- [ ] Can enter phone, password
- [ ] "Continue" button works → Step 2
- [ ] Step 2 displays OTP inputs
- [ ] "Continue" routes to Step 3
- [ ] Step 3 has name, photo upload, checkboxes
- [ ] "Complete" routes to dashboard

**Dashboard** - http://localhost:3000/guardian/dashboard
- [x] ❌ FAILS - Layout error: Navigation and Sidebar not exported
- [ ] Page loads with pink gradient theme
- [ ] Quick action buttons display
- [ ] KPI cards display

**Key Pages Quick Check:**
- [ ] Add Patient page loads: /guardian/patients/new (BLOCKED by Layout error)
- [ ] Browse Packages loads: /guardian/packages (BLOCKED by Layout error)
- [ ] Messages loads: /guardian/messages (BLOCKED by Layout error)
- [ ] Billing loads: /guardian/billing (BLOCKED by Layout error)

---

### 3. Agency Flow (3 minutes)

**Dashboard** - http://localhost:3000/agency/dashboard
- [ ] Page loads with blue gradient theme
- [ ] KPI cards display
- [ ] Quick actions work

**Key Pages Quick Check:**
- [ ] Registration Step 1 loads: /agency/registration/step-1
- [ ] Caregiver Roster loads: /agency/caregivers
- [ ] Packages loads: /agency/packages
- [ ] Jobs loads: /agency/jobs

---

### 4. Caregiver Flow (3 minutes)

**Dashboard** - http://localhost:3000/caregiver/dashboard
- [ ] Page loads with green gradient theme
- [ ] Today's schedule card displays
- [ ] Quick actions work

**Key Pages Quick Check:**
- [ ] Registration Step 1 loads: /caregiver/registration/step-1
- [ ] Jobs loads: /caregiver/jobs
- [ ] Check-in loads: /caregiver/checkin
- [ ] Care logs loads: /caregiver/care-logs
- [ ] Earnings loads: /caregiver/earnings

**Verification Flow:**
- [ ] Pending verification loads: /caregiver/pending-verification
- [ ] Certificates page loads: /caregiver/verification/certificates
- [ ] Complete page loads: /caregiver/verification/complete

---

### 5. Patient Flow (2 minutes)

**Dashboard** - http://localhost:3000/patient/dashboard
- [ ] Page loads with yellow gradient theme
- [ ] Caregiver card displays
- [ ] Medications display

**Key Pages Quick Check:**
- [ ] Medications loads: /patient/medications
- [ ] Caregiver profile loads: /patient/caregiver
- [ ] Emergency SOS loads: /patient/emergency-sos

---

### 6. Moderator Flow (2 minutes)

**Login** - http://localhost:3000/moderator/login
- [ ] Page loads with red-orange gradient
- [ ] MFA verification displays

**Dashboard** - http://localhost:3000/moderator/dashboard
- [ ] Page loads
- [ ] KPI cards display

**Key Pages Quick Check:**
- [ ] Verification agencies loads: /moderator/verification/agencies
- [ ] Verification caregivers loads: /moderator/verification/caregivers
- [ ] Disputes loads: /moderator/disputes
- [ ] CV pool loads: /moderator/cv-pool

---

### 7. Admin Flow (2 minutes)

**Login** - http://localhost:3000/admin/login
- [ ] Page loads with purple gradient
- [ ] MFA verification displays

**Dashboard** - http://localhost:3000/admin/dashboard
- [ ] Page loads
- [ ] Extended KPIs display

**Key Pages Quick Check:**
- [ ] Moderators loads: /admin/moderators
- [ ] Analytics loads: /admin/analytics
- [ ] Audit logs loads: /admin/audit-logs
- [ ] System settings loads: /admin/system-settings

---

### 8. Shop Flow (2 minutes)

**Dashboard** - http://localhost:3000/shop/dashboard
- [ ] Page loads with cyan-blue gradient
- [ ] KPI cards display

**Key Pages Quick Check:**
- [ ] Products loads: /shop/products
- [ ] Orders loads: /shop/orders
- [ ] Registration loads: /shop/registration

**Shop Manager:**
- [ ] Dashboard loads: /shop-manager/dashboard
- [ ] Orders loads: /shop-manager/orders
- [ ] Inventory loads: /shop-manager/inventory

---

## 🎨 DESIGN SYSTEM SPOT CHECK (1 minute)

Pick 3 random pages and verify:
- [ ] Role-specific gradient colors correct
- [ ] Cards use glassmorphic `finance-card` style
- [ ] Buttons have radial gradients
- [ ] Text colors: #535353 (headers), #848484 (body)
- [ ] No console errors

---

## 📱 RESPONSIVE SPOT CHECK (2 minutes)

Open DevTools, test 3 pages on different sizes:

**Mobile (375px):**
- [ ] Landing page stacks vertically
- [ ] Login form full width
- [ ] Dashboard cards stack

**Desktop (1440px):**
- [ ] Landing page centered
- [ ] Dashboard uses grid
- [ ] Content doesn't stretch too wide

---

## 🔗 NAVIGATION SPOT CHECK (1 minute)

- [ ] Browser back button works
- [ ] Internal links work
- [ ] "Back" buttons on pages work
- [ ] Bottom nav works (mobile, if applicable)

---

## ⚙️ INTERACTIVE ELEMENTS SPOT CHECK (1 minute)

Test on any page with forms:
- [ ] Input fields accept text
- [ ] Buttons are clickable
- [ ] Dropdowns open
- [ ] Toggles switch
- [ ] File upload triggers picker

---

## ✅ SMOKE TEST RESULTS

**Status:** ❌ FAIL

**Critical Issues Found:** 2

**Critical Issue #1: Layout Component Export Error**
- **Error:** `'Navigation' is not exported from './Navigation'`
- **Error:** `'Sidebar' is not exported from './Sidebar'`
- **Impact:** ALL dashboard pages fail to render (Guardian, Agency, Caregiver, Patient, Moderator, Admin, Shop dashboards)
- **Location:** `src/components/layout/Layout.tsx:61`
- **Fix Needed:** Export Navigation and Sidebar components from their respective files

**Critical Issue #2: Case-Sensitive File Names**
- **Error:** Multiple modules with names that differ only in casing
- **Files:** `Button.tsx` vs `button.tsx`, `Input.tsx` vs `input.tsx`
- **Impact:** Webpack warnings, potential build issues
- **Fix Needed:** Standardize to lowercase (button.tsx, input.tsx)

**Pages Tested:**
✅ Landing page (/) - WORKS
✅ Login (/auth/login) - WORKS
✅ Role Selection (/auth/role-selection) - WORKS
✅ Terms (/terms) - WORKS
✅ Privacy (/privacy) - WORKS
❌ Guardian Dashboard - FAILS (Layout error)
❌ Caregiver Dashboard - FAILS (Layout error)
❌ Agency Dashboard - FAILS (Layout error)
❌ Patient Dashboard - FAILS (Layout error)

**Notes:**
- Public pages (without Layout component) work perfectly
- All dashboard pages fail due to missing component exports
- Must fix Layout.tsx imports before further testing possible
- Registration flows cannot be tested until Layout is fixed

**Tested By:** AI Automated Test  
**Date:** December 5, 2025  
**Time Taken:** 5 minutes

---

## 🚨 IF TEST FAILS

1. Note which section failed
2. Check browser console for errors
3. Run full test on failed section from FRONTEND_TESTING_CHECKLIST.md
4. Document issue in main checklist
5. Report to development team

---

## 📋 WHEN TO USE THIS TEST

- ✅ **Before commits** - Quick verification
- ✅ **After major changes** - Ensure nothing broke
- ✅ **Before deployment** - Final check
- ✅ **Daily development** - Quick status check
- ✅ **After pulling changes** - Verify team updates

**For comprehensive testing, use:** `FRONTEND_TESTING_CHECKLIST.md`

---

## 💡 TIPS

1. **Keep dev server running** during testing
2. **Use keyboard shortcuts** (Ctrl/Cmd + Click for new tabs)
3. **Keep browser console open** to catch errors quickly
4. **Use navigation.html** to jump between pages quickly
5. **Test in Chrome first** (most consistent), then other browsers
6. **Focus on critical paths** - this is a smoke test, not exhaustive testing
7. **If something feels off, mark it** and test thoroughly later


