# 📊 Manual Testing - Agency Manager Entity (Complete Guide)

**Date Created:** December 25, 2025  
**Entity:** Agency Manager (QA Staff)  
**Testing Scope:** Quality assurance, monitoring, read-only agency access  
**Estimated Time:** 1-1.5 hours  
**Prerequisites:** Development server running, database seeded with test data  

---

## 📊 AGENCY MANAGER USER ROLE & CAPABILITIES

### Role Definition
**Agency Manager** is a quality control role with limited write access, focused on monitoring caregiver performance and responding to feedback.

| Property | Value |
|----------|-------|
| **Role Name** | AGENCY_MANAGER |
| **Authority Level** | Level 5 (QA Staff) |
| **Core Function** | Quality monitoring, performance tracking, feedback response |
| **Access Level** | Read-mostly with QA response capabilities |
| **MFA Requirement** | Optional |

### Agency Manager Permissions Overview

| Category | Permissions |
|----------|-------------|
| **Dashboard** | ✅ View manager dashboard |
| **QA Dashboard** | ✅ View QA metrics |
| **Quality Monitoring** | ✅ Track caregiver quality, view alerts |
| **Assignments** | 👁️ View only (cannot assign) |
| **Feedback** | ✅ View and respond to feedback |
| **Reports** | ✅ Generate performance reports |
| **Caregivers** | 👁️ View profiles (cannot manage) |
| **Packages** | 👁️ View only (cannot create/edit) |
| **Jobs** | 👁️ View only (cannot create/cancel) |
| **Billing** | ❌ No access |

---

## 🚀 SETUP & PREREQUISITES

### Test Environment Checklist

- [ ] **Development Server Running**
  - [ ] Next.js app: `npm run dev` (port 3000)
  - [ ] Backend/API available
  - [ ] Database connected and seeded

- [ ] **Browser & Tools**
  - [ ] Modern browser (Chrome, Firefox, Safari, Edge)
  - [ ] DevTools available (F12)
  - [ ] LocalStorage accessible

- [ ] **Test Data**
  - [ ] Agency Manager account created
  - [ ] Associated with an agency
  - [ ] Seed data includes caregivers, jobs, feedback

### Test Agency Manager Account Credentials

| Credential | Value |
|-----------|-------|
| **Phone Number** | `+8801712345302` |
| **Email** | `manager@carenet.com` |
| **Password** | `Manager@123` |
| **Role** | AGENCY_MANAGER |
| **Name** | QA Manager |
| **Associated Agency** | CareFirst Healthcare |
| **Is Active** | Yes |

---

## ✅ TEST EXECUTION PLAN

---

## Phase 1: Authentication & Access Control (20 minutes)

### M1.1 - Agency Manager Login
**Objective:** Verify Agency Manager can login  
**URL:** `http://localhost:3000/agency-manager/login`

**Steps:**
1. Navigate to agency manager login
2. Observe login form:
   - [ ] Phone number field
   - [ ] Password field
   - [ ] Login button

3. Enter credentials:
   - Phone: `+8801712345302`
   - Password: `Manager@123`

4. Click "Login"

**Expected Outcome:**
- ✅ Login succeeds
- ✅ Redirects to `/agency-manager/dashboard`
- ✅ Session created

**Fail Conditions:**
- ❌ Login fails
- ❌ Wrong redirect
- ❌ No session

---

### M1.2 - Dashboard Access
**Objective:** Verify manager dashboard loads  
**URL:** `http://localhost:3000/agency-manager/dashboard`

**Dashboard Elements:**
- [ ] Page title: "Manager Dashboard"
- [ ] Back button
- [ ] Quality management overview card
- [ ] Quick links to QA features

**Expected Outcome:**
- ✅ Dashboard loads correctly
- ✅ Navigation visible
- ✅ QA links accessible

**Fail Conditions:**
- ❌ 404 or blank page
- ❌ Missing elements

---

### M1.3 - Access Restrictions Test
**Objective:** Verify manager cannot access admin-only pages

**Restricted Routes to Test:**

1. Try `/agency/packages/new`
   - [ ] Should show 403 or redirect
   - [ ] Should NOT load create package form

2. Try `/agency/jobs/[id]/assign`
   - [ ] Should show 403 or redirect
   - [ ] Cannot assign caregivers

3. Try `/agency/billing`
   - [ ] Should show 403 or redirect
   - [ ] No billing access

4. Try `/agency/subscription`
   - [ ] Should show 403 or redirect
   - [ ] No subscription management

**Expected Outcome:**
- ✅ Cannot access restricted pages
- ✅ Clear error or redirect
- ✅ No unauthorized data exposed

**Fail Conditions:**
- ❌ Can access restricted pages
- ❌ Admin features available

---

## Phase 2: QA Dashboard (15 minutes)

### M2.1 - QA Dashboard Overview
**Objective:** Verify QA dashboard displays metrics  
**URL:** `http://localhost:3000/agency-manager/qa`

**Page Elements:**
- [ ] Page title: "QA Dashboard"
- [ ] Back button
- [ ] QA overview card with icon
- [ ] Quality assurance overview message

**QA Metrics to Verify:**
- [ ] Average response time
- [ ] Care log compliance rate
- [ ] Incident report frequency
- [ ] Training completion rates

**Expected Outcome:**
- ✅ QA dashboard loads
- ✅ Metrics displayed
- ✅ Navigation works

**Fail Conditions:**
- ❌ Page not loading
- ❌ Metrics missing

---

## Phase 3: Quality Monitoring (20 minutes)

### M3.1 - Quality Dashboard
**Objective:** Verify quality metrics display  
**URL:** `http://localhost:3000/agency-manager/quality`

**Quality Metrics Cards:**

1. **Average Rating**
   - [ ] Star icon
   - [ ] Rating value (e.g., 4.7)
   - [ ] Change indicator (+/-)

2. **On-time Check-in**
   - [ ] Percentage value
   - [ ] Trend indicator

3. **Care Log Completion**
   - [ ] Percentage value
   - [ ] Trend indicator

4. **Incident Rate**
   - [ ] Percentage value
   - [ ] Alert icon if high

**Caregiver Quality Table:**
- [ ] List of caregivers
- [ ] Name column
- [ ] Rating column
- [ ] On-time rate column
- [ ] Log completion column
- [ ] Incident count column

**Test Actions:**
1. View all metrics
2. Sort caregiver table by rating
3. Identify top/bottom performers

**Expected Outcome:**
- ✅ All metrics display
- ✅ Table sortable
- ✅ Data accurate

**Fail Conditions:**
- ❌ Metrics not loading
- ❌ Sorting broken
- ❌ Data incorrect

---

### M3.2 - Quality Alerts
**Objective:** Verify quality alerts system  
**URL:** `http://localhost:3000/agency-manager/quality/alerts`

**Alert Types:**
- [ ] Late check-in alerts
- [ ] Missed care log alerts
- [ ] Low rating alerts
- [ ] Incident alerts
- [ ] Certification expiry alerts

**Alert Card Info:**
- [ ] Alert type icon
- [ ] Caregiver name
- [ ] Alert description
- [ ] Date/time
- [ ] Severity (High/Medium/Low)
- [ ] Action button

**Test Actions:**
1. View alert list
2. Click on an alert for details
3. Acknowledge/dismiss alert (if available)

**Expected Outcome:**
- ✅ Alerts list loads
- ✅ Can view details
- ✅ Actions work

**Fail Conditions:**
- ❌ Alerts not showing
- ❌ Cannot view details

---

## Phase 4: View Assignments (10 minutes)

### M4.1 - Assignments View (Read-Only)
**Objective:** Verify manager can view assignments  
**URL:** `http://localhost:3000/agency-manager/assignments`

**Page Elements:**
- [ ] Page title: "View Assignments"
- [ ] Assignment list
- [ ] Read-only indicator
- [ ] No "Assign" buttons visible

**Assignment Info:**
- [ ] Job ID
- [ ] Patient name
- [ ] Caregiver assigned
- [ ] Start date
- [ ] Status
- [ ] Duration

**Verify Read-Only:**
1. View assignment list
2. Click on assignment details
3. Verify NO edit/assign buttons
4. Verify cannot modify assignment

**Expected Outcome:**
- ✅ Can view all assignments
- ✅ No edit capabilities
- ✅ Detailed view available

**Fail Conditions:**
- ❌ Cannot view assignments
- ❌ Edit buttons visible (shouldn't be)

---

## Phase 5: Feedback Management (20 minutes)

### M5.1 - Feedback Queue
**Objective:** Verify manager can view feedback  
**URL:** `http://localhost:3000/agency-manager/feedback`

**Page Elements:**
- [ ] Page title: "Feedback Queue"
- [ ] Feedback list
- [ ] Filter by status (New/Responded/Closed)
- [ ] Sort options

**Feedback Card:**
- [ ] Guardian name
- [ ] Caregiver name
- [ ] Rating given
- [ ] Feedback text preview
- [ ] Date
- [ ] Status badge
- [ ] "Respond" button

**Test Actions:**
1. View feedback list
2. Filter by "New" status
3. Click on a feedback item

**Expected Outcome:**
- ✅ Feedback list loads
- ✅ Filters work
- ✅ Can view details

**Fail Conditions:**
- ❌ List not loading
- ❌ Filters broken

---

### M5.2 - Respond to Feedback
**Objective:** Verify manager can respond to feedback  
**URL:** `http://localhost:3000/agency-manager/feedback/[id]/respond`

**Response Page:**
- [ ] Original feedback displayed
- [ ] Guardian name
- [ ] Rating and comments
- [ ] Caregiver details
- [ ] Response textarea
- [ ] Submit button

**Test Actions:**
1. Click "Respond" on a feedback item
2. Read the original feedback
3. Type response:
   - Enter: "Thank you for your feedback. We have noted your comments and will address them accordingly."
4. Click "Submit Response"

**Expected Outcome:**
- ✅ Response form loads
- ✅ Can type response
- ✅ Response submitted
- ✅ Status updates to "Responded"

**Fail Conditions:**
- ❌ Form not loading
- ❌ Cannot submit
- ❌ Status not updating

---

## Phase 6: Reports & Analytics (15 minutes)

### M6.1 - Generate Reports
**Objective:** Verify manager can generate reports  
**URL:** `http://localhost:3000/agency-manager/reports`

**Report Types:**

1. **Caregiver Performance Report**
   - [ ] Date range selector
   - [ ] Caregiver filter (all or specific)
   - [ ] Metrics included: Rating, punctuality, log completion
   - [ ] Generate button

2. **Quality Summary Report**
   - [ ] Date range selector
   - [ ] Overall quality metrics
   - [ ] Incident summary
   - [ ] Generate button

3. **Feedback Analysis Report**
   - [ ] Date range selector
   - [ ] Feedback trends
   - [ ] Common issues
   - [ ] Generate button

**Test Actions:**
1. Select "Caregiver Performance Report"
2. Set date range: Last 30 days
3. Click "Generate"
4. Verify report displays/downloads

**Expected Outcome:**
- ✅ Report options available
- ✅ Can configure parameters
- ✅ Report generates successfully

**Fail Conditions:**
- ❌ Cannot generate reports
- ❌ Report empty or incorrect

---

## Phase 7: Caregiver Performance Tracking (10 minutes)

### M7.1 - Individual Caregiver View
**Objective:** Verify manager can view caregiver performance  

**Access Path:**
1. From Quality Dashboard, click on caregiver name
2. Or navigate to caregiver profile from quality alerts

**Performance Metrics:**
- [ ] Overall rating
- [ ] Recent reviews
- [ ] On-time check-in history
- [ ] Care log completion history
- [ ] Incident history
- [ ] Training completion

**Charts/Graphs:**
- [ ] Rating trend over time
- [ ] Punctuality chart
- [ ] Quality score trend

**Verify Read-Only:**
- [ ] Cannot edit caregiver profile
- [ ] No action buttons to modify data

**Expected Outcome:**
- ✅ Can view caregiver performance
- ✅ Metrics display correctly
- ✅ Read-only access confirmed

**Fail Conditions:**
- ❌ Cannot view performance
- ❌ Edit options visible

---

## Phase 8: All Alerts View (10 minutes)

### M8.1 - Consolidated Alerts
**Objective:** Verify all alerts page  
**URL:** `http://localhost:3000/agency-manager/alerts`

**Page Elements:**
- [ ] Page title: "All Alerts"
- [ ] Alert list
- [ ] Filter by type
- [ ] Filter by severity
- [ ] Sort by date

**Alert Types Combined:**
- [ ] Quality alerts
- [ ] Performance alerts
- [ ] Incident alerts
- [ ] System alerts

**Test Actions:**
1. View all alerts
2. Filter by "High" severity
3. Sort by newest first

**Expected Outcome:**
- ✅ All alerts consolidated
- ✅ Filters work
- ✅ Clear presentation

**Fail Conditions:**
- ❌ Alerts missing
- ❌ Filters broken

---

## Phase 9: Edge Cases (10 minutes)

### M9.1 - No Data State
**Objective:** Verify handling when no data available

**Test Scenarios:**
1. Empty feedback queue
   - [ ] Shows "No feedback yet" message
   - [ ] No errors

2. No alerts
   - [ ] Shows "No alerts" message
   - [ ] Page still functional

3. New caregiver with no history
   - [ ] Shows appropriate empty state

**Expected Outcome:**
- ✅ Empty states handled gracefully
- ✅ No errors or crashes

---

### M9.2 - Session Persistence
**Objective:** Verify session handling

**Steps:**
1. Login as Agency Manager
2. Refresh page
3. Navigate between pages
4. Open new tab

**Expected Outcome:**
- ✅ Session persists across refresh
- ✅ Works in multiple tabs
- ✅ No re-login required

---

## 📊 TEST SUMMARY

### Quick Reference - URLs

| Page | URL |
|------|-----|
| Login | `/agency-manager/login` |
| Dashboard | `/agency-manager/dashboard` |
| QA Dashboard | `/agency-manager/qa` |
| Quality | `/agency-manager/quality` |
| Quality Alerts | `/agency-manager/quality/alerts` |
| Assignments | `/agency-manager/assignments` |
| Feedback | `/agency-manager/feedback` |
| Reports | `/agency-manager/reports` |
| All Alerts | `/agency-manager/alerts` |

### Test Counts

| Phase | Test Cases | Est. Time |
|-------|------------|-----------|
| Authentication | 3 | 20 min |
| QA Dashboard | 1 | 15 min |
| Quality Monitoring | 2 | 20 min |
| Assignments | 1 | 10 min |
| Feedback | 2 | 20 min |
| Reports | 1 | 15 min |
| Performance Tracking | 1 | 10 min |
| Alerts | 1 | 10 min |
| Edge Cases | 2 | 10 min |
| **Total** | **14** | **~2 hours** |

---

## ✅ SIGN-OFF

| Tester | Date | Total Passed | Total Failed | Notes |
|--------|------|--------------|--------------|-------|
| _______ | _______ | ___/14 | ___/14 | _______ |

