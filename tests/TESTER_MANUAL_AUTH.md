# 🔐 Manual Testing - Authentication & Common Features (Complete Guide)

**Date Created:** December 25, 2025  
**Scope:** Cross-entity authentication, common UI components, shared features  
**Testing Scope:** Login, logout, MFA, session management, language switching, theme  
**Estimated Time:** 1 hour  
**Prerequisites:** Development server running, database seeded with test data  

---

## 🔐 OVERVIEW

This document covers testing for features shared across all entities:
- Authentication (login, logout, session)
- Multi-Factor Authentication (MFA)
- Password management
- Language switching (i18n)
- Theme switching
- Common UI components
- Navigation
- Error handling
- Accessibility basics

---

## 🚀 SETUP & PREREQUISITES

### Test Environment Checklist

- [ ] **Development Server Running**
  - [ ] Next.js app: `npm run dev` (port 3000)
  - [ ] Backend/API available
  - [ ] Database connected and seeded

- [ ] **Browser & Tools**
  - [ ] Modern browser (Chrome recommended)
  - [ ] DevTools available (F12)
  - [ ] Network tab accessible
  - [ ] Application/Storage tab accessible

---

## ✅ TEST EXECUTION PLAN

---

## Phase 1: Basic Authentication (20 minutes)

### AUTH1.1 - Login Page Accessibility
**Objective:** Verify all login pages load correctly

**Login URLs to Test:**

| Entity | URL | Expected |
|--------|-----|----------|
| Admin | `/admin/login` | Admin login form |
| Moderator | `/admin/login` | Same admin login |
| Agency | `/agency/login` | Agency login form |
| Agency Manager | `/agency-manager/login` | Manager login form |
| Caregiver | `/caregiver/login` | Caregiver login form |
| Guardian | `/guardian/login` | Guardian login form |
| Patient | `/patient/login` | Patient login form |
| Shop | `/shop/login` | Shop login form |
| Shop Manager | `/shop-manager/login` | Shop Manager login form |

**For Each Login Page:**
- [ ] Page loads without errors
- [ ] Phone/email input visible
- [ ] Password input visible
- [ ] Login button visible
- [ ] "Forgot Password" link present
- [ ] Styling consistent with design

**Expected Outcome:**
- ✅ All login pages accessible
- ✅ Consistent design

---

### AUTH1.2 - Valid Login
**Objective:** Verify successful login flow

**Test with Each Role (pick 3):**

**Test 1: Super Admin**
1. Go to `/admin/login`
2. Enter: `+8801712345101` / `Admin@123`
3. Click "Login"
4. Verify:
   - [ ] Loading state appears
   - [ ] Redirects to `/admin/dashboard`
   - [ ] Dashboard loads correctly
   - [ ] User name displayed
   - [ ] Role indicator visible

**Test 2: Guardian**
1. Go to `/guardian/login`
2. Enter: `+8801712345501` / `Guardian@123`
3. Click "Login"
4. Verify:
   - [ ] Redirects to `/guardian/dashboard`
   - [ ] Session created

**Test 3: Caregiver**
1. Go to `/caregiver/login`
2. Enter: `+8801712345401` / `Caregiver@123`
3. Click "Login"
4. Verify redirect and session

**Expected Outcome:**
- ✅ All logins succeed
- ✅ Correct redirects

---

### AUTH1.3 - Invalid Login
**Objective:** Verify error handling for bad credentials

**Test Cases:**

1. **Wrong Password:**
   - Enter valid phone, wrong password
   - Expected: "Invalid credentials" error
   - [ ] Error message appears
   - [ ] Form not cleared
   - [ ] Can retry

2. **Wrong Phone:**
   - Enter non-existent phone
   - Expected: "Invalid credentials" or "User not found"
   - [ ] Appropriate error shown

3. **Empty Fields:**
   - Click login with empty fields
   - Expected: Validation errors
   - [ ] Required field errors shown

4. **Invalid Phone Format:**
   - Enter: "abc123"
   - Expected: Format validation error
   - [ ] "Invalid phone format" shown

**Expected Outcome:**
- ✅ All errors handled gracefully
- ✅ Clear error messages

---

### AUTH1.4 - Logout
**Objective:** Verify logout flow

**Steps:**
1. Login as any user
2. Find logout button/option
   - [ ] In header dropdown
   - [ ] Or in navigation menu
3. Click "Logout"
4. Verify:
   - [ ] Session cleared (check localStorage/cookies)
   - [ ] Redirects to login page
   - [ ] Cannot access dashboard without re-login

**Expected Outcome:**
- ✅ Logout works
- ✅ Session fully cleared

---

## Phase 2: Session Management (15 minutes)

### AUTH2.1 - Session Persistence
**Objective:** Verify session persists across actions

**Test Steps:**
1. Login successfully
2. Navigate to different pages within portal
3. Verify session maintained
4. Refresh page (F5)
5. Verify:
   - [ ] Still logged in
   - [ ] No re-authentication required
   - [ ] User data preserved

**Expected Outcome:**
- ✅ Session persists across navigation
- ✅ Session survives refresh

---

### AUTH2.2 - Multi-Tab Session
**Objective:** Verify session works across tabs

**Test Steps:**
1. Login in Tab 1
2. Open new tab (Tab 2)
3. Navigate to same dashboard in Tab 2
4. Verify:
   - [ ] Both tabs show same session
   - [ ] No re-login in Tab 2

5. Logout in Tab 1
6. Refresh Tab 2
7. Verify:
   - [ ] Tab 2 also logged out
   - [ ] Or shows session expired

**Expected Outcome:**
- ✅ Session shared across tabs
- ✅ Logout affects all tabs

---

### AUTH2.3 - Session Timeout
**Objective:** Verify session expiry handling

**Note:** May require short timeout for testing

**Test Steps:**
1. Login successfully
2. Wait for session timeout (or manually clear token)
3. Try to perform an action
4. Verify:
   - [ ] Session expired message
   - [ ] Redirects to login
   - [ ] Clear explanation

**Expected Outcome:**
- ✅ Timeout handled gracefully
- ✅ User informed appropriately

---

### AUTH2.4 - Protected Routes
**Objective:** Verify unauthenticated access blocked

**Test Steps (logged out):**

1. Try accessing `/admin/dashboard` directly
   - [ ] Redirects to login
   - [ ] Or shows 401/403

2. Try accessing `/guardian/patients`
   - [ ] Redirects to login

3. Try accessing `/caregiver/jobs`
   - [ ] Redirects to login

**Expected Outcome:**
- ✅ All protected routes secured
- ✅ Proper redirects

---

## Phase 3: Multi-Factor Authentication (10 minutes)

### AUTH3.1 - MFA Setup (Admin)
**Objective:** Verify MFA configuration

**If MFA Enabled:**
1. Login as Super Admin
2. Navigate to security settings
3. Verify:
   - [ ] MFA toggle/option visible
   - [ ] Can enable/disable MFA
   - [ ] QR code or setup options

---

### AUTH3.2 - MFA Login Flow
**Objective:** Verify MFA during login

**When MFA Required:**
1. Enter credentials
2. Click login
3. Verify:
   - [ ] MFA prompt appears
   - [ ] OTP input shown
   - [ ] Verification code type indicated

4. Enter MFA code
5. Complete login

**Expected Outcome:**
- ✅ MFA flow works
- ✅ Secure verification

---

### AUTH3.3 - MFA Failed
**Objective:** Verify MFA failure handling

**URL:** `http://localhost:3000/admin/mfa-failed`

**Test Steps:**
1. Enter wrong MFA code multiple times
2. Verify:
   - [ ] Error messages shown
   - [ ] Account not locked immediately
   - [ ] MFA failed page shows (if configured)

**Expected Outcome:**
- ✅ Failed attempts handled
- ✅ User guidance provided

---

## Phase 4: Password Management (10 minutes)

### AUTH4.1 - Forgot Password
**Objective:** Verify password reset initiation

**Steps:**
1. Go to any login page
2. Click "Forgot Password"
3. Enter phone/email
4. Verify:
   - [ ] Confirmation message
   - [ ] Reset link/code sent (check test email/SMS)

---

### AUTH4.2 - Reset Password
**Objective:** Verify password reset completion

**Steps:**
1. Access reset link/code
2. Enter new password
3. Confirm new password
4. Verify:
   - [ ] Password validation (min 8 chars, etc.)
   - [ ] Success message
   - [ ] Can login with new password

---

### AUTH4.3 - Change Password (Logged In)
**Objective:** Verify password change while logged in

**Steps:**
1. Login successfully
2. Go to profile/settings
3. Find "Change Password"
4. Enter:
   - Current password
   - New password
   - Confirm new password
5. Save
6. Verify:
   - [ ] Success message
   - [ ] Old password no longer works
   - [ ] New password works

---

## Phase 5: Language Switching (10 minutes)

### AUTH5.1 - Language Selector
**Objective:** Verify language switching UI

**Steps:**
1. Find language selector (usually in header)
2. Verify:
   - [ ] Current language indicated
   - [ ] Available languages shown (English, Bengali)
   - [ ] Flag icons (if used)

---

### AUTH5.2 - Switch to Bengali
**Objective:** Verify Bengali translation

**Steps:**
1. Select "বাংলা" from language selector
2. Verify:
   - [ ] UI text changes to Bengali
   - [ ] Navigation items translated
   - [ ] Button labels translated
   - [ ] Form labels translated
   - [ ] Error messages in Bengali

3. Navigate to different pages
4. Verify:
   - [ ] Bengali persists

5. Refresh page
6. Verify:
   - [ ] Bengali still selected (stored preference)

---

### AUTH5.3 - Switch Back to English
**Objective:** Verify English restoration

**Steps:**
1. From Bengali, select "English"
2. Verify:
   - [ ] All text back to English
   - [ ] Preference saved

---

## Phase 6: Theme & Accessibility (10 minutes)

### AUTH6.1 - Theme Toggle (if available)
**Objective:** Verify light/dark mode

**If Theme Toggle Exists:**
1. Find theme toggle
2. Switch theme
3. Verify:
   - [ ] Colors change appropriately
   - [ ] Readable contrast
   - [ ] Preference saved

---

### AUTH6.2 - Basic Accessibility
**Objective:** Verify basic accessibility features

**Checks:**
- [ ] Focus indicators visible (Tab navigation)
- [ ] Form labels associated with inputs
- [ ] Buttons have visible text or aria-label
- [ ] Images have alt text
- [ ] Color contrast adequate

**Keyboard Navigation:**
1. Tab through login form
2. Verify:
   - [ ] Can reach all fields
   - [ ] Can submit with Enter
   - [ ] Focus visible

---

## Phase 7: Common UI Components (10 minutes)

### AUTH7.1 - Navigation Component
**Objective:** Verify consistent navigation

**UniversalNav Check (multiple pages):**
- [ ] Back button works
- [ ] Logo/brand visible
- [ ] User menu accessible
- [ ] Role-appropriate menu items

---

### AUTH7.2 - Loading States
**Objective:** Verify loading indicators

**Test:**
1. Perform action that fetches data
2. Verify:
   - [ ] Loading spinner appears
   - [ ] Not frozen UI
   - [ ] Loading completes

---

### AUTH7.3 - Error States
**Objective:** Verify error handling UI

**Test:**
1. Trigger an error (e.g., network off)
2. Verify:
   - [ ] Error message shown
   - [ ] Retry option (if applicable)
   - [ ] No crash

---

### AUTH7.4 - Toast Notifications
**Objective:** Verify notification system

**Test:**
1. Perform action that shows success
2. Verify:
   - [ ] Toast appears
   - [ ] Message clear
   - [ ] Auto-dismisses or has close button

---

## Phase 8: Cross-Role Access Control (15 minutes)

### AUTH8.1 - Role-Based Redirects
**Objective:** Verify users redirected to correct portal

| Login As | Should Redirect To |
|----------|-------------------|
| Super Admin | `/admin/dashboard` |
| Moderator | `/admin/dashboard` (with limited menu) |
| Agency | `/agency/dashboard` |
| Agency Manager | `/agency-manager/dashboard` |
| Caregiver | `/caregiver/dashboard` |
| Guardian | `/guardian/dashboard` |
| Patient | `/patient/dashboard` |
| Shop | `/shop/dashboard` |
| Shop Manager | `/shop-manager/dashboard` |

---

### AUTH8.2 - Cross-Portal Access Prevention
**Objective:** Verify users cannot access other portals

**Test as Guardian:**
1. Login as Guardian
2. Try accessing `/admin/dashboard`
   - [ ] Should be blocked (403 or redirect)
3. Try accessing `/caregiver/jobs`
   - [ ] Should be blocked
4. Try accessing `/shop/products`
   - [ ] Should be blocked

**Expected Outcome:**
- ✅ Cannot access other roles' pages

---

### AUTH8.3 - Role in Token
**Objective:** Verify role stored correctly

**Check in DevTools:**
1. Login
2. Open DevTools → Application → LocalStorage
3. Find auth token
4. Verify:
   - [ ] Token contains role
   - [ ] Role matches logged-in user

---

## 📊 TEST SUMMARY

### Test Categories

| Category | Test Cases | Est. Time |
|----------|------------|-----------|
| Basic Auth | 4 | 20 min |
| Session | 4 | 15 min |
| MFA | 3 | 10 min |
| Password | 3 | 10 min |
| Language | 3 | 10 min |
| Theme & A11y | 2 | 10 min |
| Common UI | 4 | 10 min |
| Access Control | 3 | 15 min |
| **Total** | **26** | **~1.5 hours** |

### Common Test Accounts

| Role | Phone | Password |
|------|-------|----------|
| Super Admin | `+8801712345101` | `Admin@123` |
| Moderator | `+8801712345201` | `Moderator@123` |
| Agency | `+8801712345301` | `Agency@123` |
| Agency Manager | `+8801712345302` | `Manager@123` |
| Caregiver | `+8801712345401` | `Caregiver@123` |
| Guardian | `+8801712345501` | `Guardian@123` |
| Patient | `+8801712345502` | `Patient@123` |
| Shop | `+8801712345601` | `Shop@123` |
| Shop Manager | `+8801712345602` | `ShopMgr@123` |

---

## ✅ SIGN-OFF

| Tester | Date | Total Passed | Total Failed | Notes |
|--------|------|--------------|--------------|-------|
| _______ | _______ | ___/26 | ___/26 | _______ |

