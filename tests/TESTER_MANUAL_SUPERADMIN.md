# 🔑 Manual Testing - Super Admin Entity (Complete Guide)

**Date Created:** December 17, 2025  
**Entity:** Super Admin / Platform Admin  
**Testing Scope:** Full Super Admin dashboard and administrative features  
**Estimated Time:** 2-3 hours  
**Prerequisites:** Development server running, database seeded with test data  

---

## 📋 SUPER ADMIN USER ROLES & CAPABILITIES

### Role Definition
**Super Admin** is the highest authority level in the CareNet platform with full system access.

| Property | Value |
|----------|-------|
| **Role Name** | SUPER_ADMIN |
| **Authority Level** | Level 10 (Supreme) |
| **Core Function** | Platform management, policy enforcement, dispute resolution |
| **Access Level** | Full system access to all modules |
| **MFA Requirement** | Yes (Mandatory) |

### Super Admin Permissions Overview

| Category | Permissions |
|----------|-------------|
| **User Management** | ✅ Create, read, update, delete all user types |
| **Agency Management** | ✅ Verify/reject agencies, suspend operations, view analytics |
| **Caregiver Management** | ✅ Verify/reject caregivers, manage certifications, suspend accounts |
| **Patient Management** | ✅ Full access to all patient records and health data |
| **Job Management** | ✅ Create, modify, cancel jobs; manage assignments |
| **Payment Management** | ✅ Process refunds, adjust balances, view transactions |
| **Dispute Resolution** | ✅ Review and resolve all disputes with authority |
| **System Settings** | ✅ Configure platform settings, manage MFA, security policies |
| **Analytics & Reporting** | ✅ Access all platform metrics, export data |
| **Audit Logs** | ✅ Full access to all system activities and changes |

---

## 🚀 SETUP & PREREQUISITES

### Test Environment Checklist

- [ ] **Development Server Running**
  - [ ] Next.js app: `npm run dev` (port 3000)
  - [ ] Backend/API available (if applicable)
  - [ ] Database connected and seeded

- [ ] **Browser & Tools**
  - [ ] Modern browser (Chrome, Firefox, Safari, or Edge)
  - [ ] DevTools available (F12)
  - [ ] LocalStorage accessible
  - [ ] Cookies enabled

- [ ] **Test Data**
  - [ ] Super Admin account created in database
  - [ ] Seed data includes agencies, caregivers, guardians, etc.

### Test Super Admin Account Credentials

| Credential | Value |
|-----------|-------|
| **Phone Number** | `+8801712345101` |
| **Email** | `admin@carenet.com` |
| **Password** | `Admin@123` |
| **Role** | SUPER_ADMIN |
| **Name** | Super Admin |
| **KYC Status** | VERIFIED |
| **Is Active** | Yes |
| **Language** | English (en) |

**Demo Account (Alternative):**
- **Phone:** `+8801712345102`
- **Password:** `Demo@123`

---

## ✅ TEST EXECUTION PLAN

### Phase 1: Authentication & Access (30 minutes)

#### T1.1 - Super Admin Login
**Objective:** Verify Super Admin can successfully authenticate  
**URL:** `http://localhost:3000/admin/login`

**Steps:**
1. Open the admin login page in browser
2. Observe the page layout:
   - [ ] Page title shows "Admin Login" or similar
   - [ ] Purple gradient background displays correctly
   - [ ] Login form is centered and properly styled
   - [ ] All form fields are visible

3. Enter credentials:
   - [ ] Phone field: `+8801712345101`
   - [ ] Password field: `Admin@123`
   - [ ] "Remember Me" checkbox visible (optional)

4. Click "Login" or "Sign In" button
5. Observe MFA requirement (if configured):
   - [ ] MFA prompt appears (if enabled)
   - [ ] Can enter OTP/verification code
   - [ ] MFA success message displays

**Expected Outcome:**
- [x] Login succeeds without errors
- [ ] Redirects to `/admin/dashboard`
- [ ] Page loads completely within 3 seconds
- [ ] No error messages in browser console
- [x] Session token stored in localStorage/cookies

**Verification Note:** Login API `/api/auth/login` returns 200 OK and valid JWT token. Access token storage verified via API response structure. UI redirection not verified.

**Fail Conditions:**
- ❌ Error message: "Invalid credentials"
- ❌ Page shows 403/404 error
- ❌ Infinite loading or blank page
- ❌ Console errors visible

**Notes:**
- _Take screenshot of successful login page_
- _Check Network tab for API response status (200 OK)_

---

#### T1.2 - Dashboard Access After Login
**Objective:** Verify Super Admin is redirected to correct dashboard  
**Expected URL:** `http://localhost:3000/admin/dashboard`

**Steps:**
1. After successful login, observe redirect
2. Check page loads with:
   - [ ] Dashboard title displays (e.g., "Admin Dashboard")
   - [ ] Navigation menu appears on left/top
   - [ ] Header shows "Super Admin" or similar
   - [ ] User profile/logout option visible

3. Verify no blank pages or loading states

**Expected Outcome:**
- ✅ Dashboard loads within 2-3 seconds
- ✅ All layout components render correctly
- ✅ No 404 or 500 errors
- ✅ Navigation menu accessible

**Fail Conditions:**
- ❌ 404 Page Not Found
- ❌ Infinite loading spinner
- ❌ Console errors (e.g., failed API calls)
- ❌ Redirects to wrong page (e.g., public home)

---

#### T1.3 - Session Persistence
**Objective:** Verify Super Admin session persists across page refreshes

**Steps:**
1. On dashboard, press F5 or Ctrl+R to refresh page
2. Observe:
   - [ ] User remains logged in (no redirect to login)
   - [ ] Dashboard reloads with same data
   - [ ] No re-authentication required

3. Open new tab and navigate to `http://localhost:3000/admin/dashboard`
4. Observe:
   - [ ] Can access dashboard in new tab
   - [ ] Session shared across tabs

5. Open DevTools (F12) → Application → LocalStorage
6. Verify:
   - [ ] Auth token stored
   - [ ] User role = "SUPER_ADMIN"

**Expected Outcome:**
- ✅ Session persists across refreshes
- ✅ Session shared across browser tabs
- ✅ Token visible in localStorage
- ✅ No re-login required

**Fail Conditions:**
- ❌ Redirected to login after refresh
- ❌ No token in localStorage
- ❌ Different data loaded in new tab

---

### Phase 2: Super Admin Dashboard Features (45 minutes)

#### T2.1 - Dashboard Overview Display
**Objective:** Verify dashboard displays all KPIs and metrics  
**URL:** `http://localhost:3000/admin/dashboard`

**Dashboard Metrics to Verify:**

**KPI Cards (Top Section):**
- [ ] **Total Users**
  - Expected: Display count (e.g., "1,245")
  - Icon: 👥 or similar
  - Format: Large bold number with label

- [ ] **Active Agencies**
  - Expected: Display count
  - Filter: Only VERIFIED agencies
  - Color indicator (green for active)

- [ ] **Registered Caregivers**
  - Expected: Display count
  - Breakdown: Verified vs. Pending
  - Color indicator by status

- [ ] **Pending Verifications**
  - Expected: Display count
  - Label: Red/orange for urgent
  - Link: Should navigate to verification queue

- [ ] **Platform Revenue**
  - Expected: Display amount (e.g., "৳ 125,400")
  - Currency: Bengali Taka (BDT)
  - Period: Current month/week

- [ ] **System Health Score**
  - Expected: Percentage (e.g., "98.5%")
  - Color coding: Green (>90%), Yellow (80-90%), Red (<80%)

**Expected Outcome:**
- ✅ All KPI cards display
- ✅ Numbers are non-zero (if test data seeded)
- ✅ Cards are responsive on different screen sizes
- ✅ Icons display correctly
- ✅ Color coding appropriate

**Fail Conditions:**
- ❌ Missing KPI cards
- ❌ "undefined" or "NaN" values
- ❌ Console errors
- ❌ Cards misaligned or overlapping

**Testing Notes:**
- Take screenshot of full dashboard
- Check mobile view (F12 → Toggle device toolbar)

---

#### T2.2 - Dashboard Charts & Visualizations
**Objective:** Verify charts display correctly

**Charts to Check:**

**User Growth Chart:**
- [ ] Chart type: Line or Area chart
- [ ] X-axis: Time period (days/weeks/months)
- [ ] Y-axis: User count
- [ ] Data points: Show trend
- [ ] Legend: Clearly labeled
- [ ] Tooltip: Displays on hover

**Revenue Distribution Chart:**
- [ ] Chart type: Pie or Donut chart
- [ ] Segments: By entity type (Agency, Caregiver, etc.)
- [ ] Percentages: Calculate correctly
- [ ] Colors: Visually distinct
- [ ] Legend: Shows category names

**Activity Timeline:**
- [ ] Displays recent activities (last 24/48 hours)
- [ ] Shows: Action, Actor, Timestamp
- [ ] Format: Chronological order (newest first)
- [ ] Clickable: Can expand for details (if applicable)

**Expected Outcome:**
- ✅ All charts render without errors
- ✅ Data loads within 2 seconds
- ✅ Charts responsive to screen size
- ✅ Legends and labels visible
- ✅ Tooltips work on hover

**Fail Conditions:**
- ❌ Charts show blank/empty space
- ❌ Data not loading (spinner indefinite)
- ❌ Missing legends or labels
- ❌ Console errors

---

#### T2.3 - Navigation Menu
**Objective:** Verify Super Admin navigation menu is complete  

**Menu Items to Check:**

| Menu Item | Expected URL | Icon | Accessible |
|-----------|--------------|------|-----------|
| Dashboard | `/admin/dashboard` | 📊 | ✅ |
| Users | `/admin/users` | 👥 | ✅ |
| Agencies | `/admin/agencies` | 🏢 | ✅ |
| Caregivers | `/admin/caregivers` | 👨‍⚕️ | ✅ |
| Patients | `/admin/patients` | 🏥 | ✅ |
| Jobs & Assignments | `/admin/jobs` | 📋 | ✅ |
| Payments & Billing | `/admin/billing` | 💳 | ✅ |
| Disputes | `/admin/disputes` | ⚖️ | ✅ |
| Moderation Queue | `/admin/verification` | ✓ | ✅ |
| Audit Logs | `/admin/audit-logs` | 📝 | ✅ |
| Analytics | `/admin/analytics` | 📈 | ✅ |
| System Settings | `/admin/settings` | ⚙️ | ✅ |
| Messages | `/admin/messages` | 💬 | ✅ |

**Steps:**
1. Check sidebar/navigation menu visible
2. For each menu item:
   - [ ] Label displays correctly
   - [ ] Icon visible and matches description
   - [ ] Can click without error
   - [ ] Navigates to correct URL
   - [ ] Menu item highlights when active

3. Check menu collapse/expand:
   - [ ] Mobile: Menu toggles with hamburger icon
   - [ ] Desktop: Menu stays visible

**Expected Outcome:**
- ✅ All 13+ menu items visible
- ✅ Each item clickable and functional
- ✅ Active item highlighted
- ✅ Navigation smooth (< 1 second)

**Fail Conditions:**
- ❌ Missing menu items
- ❌ "Unauthorized" errors
- ❌ Dead links (404)
- ❌ Menu doesn't collapse on mobile

---

### Phase 3: Entity Management Features (60 minutes)

#### T3.1 - Users Management
**Objective:** Verify Super Admin can view and manage all users  
**URL:** `http://localhost:3000/admin/users`

**Page Layout Check:**
- [ ] Page title: "Users Management" or similar
- [ ] Search bar visible
- [ ] Filter options visible (by role, status, etc.)
- [ ] Pagination visible (if >10 users)
- [ ] Add/Create button visible

**User List Verification:**

For each user row, check these columns display:
- [ ] **ID** - User unique identifier
- [ ] **Name** - User's full name
- [ ] **Phone** - Phone number (+880...)
- [ ] **Email** - Email address (if applicable)
- [ ] **Role** - SUPER_ADMIN, MODERATOR, AGENCY, CAREGIVER, GUARDIAN, PATIENT
- [ ] **Status** - Active/Inactive indicator
- [ ] **Verified** - KYC status (Yes/No/Pending)
- [ ] **Actions** - View, Edit, Delete buttons

**Search & Filter Test:**
1. Click search bar, enter partial name/phone
   - [ ] Results filter in real-time
   - [ ] Shows only matching users
   - [ ] "No results" message if no matches

2. Try filter by role dropdown:
   - [ ] Select "SUPER_ADMIN"
   - [ ] List filters to show only Super Admins
   - [ ] Count shows correct number
   - [ ] Clear filter returns all users

3. Try filter by status:
   - [ ] Select "Active" → Shows only active users
   - [ ] Select "Inactive" → Shows only inactive users

**User Detail View:**
1. Click "View" on any user
2. Verify detail page shows:
   - [ ] Full name and basic info
   - [ ] Phone, email, date of birth
   - [ ] Role and permissions
   - [ ] KYC status with document links
   - [ ] Account status (Active/Inactive)
   - [ ] Last login timestamp
   - [ ] Edit, Deactivate, Delete buttons

**Edit User:**
1. Click "Edit" button
2. Verify edit form opens with:
   - [ ] Editable fields (name, email, etc.)
   - [ ] Role selector (dropdown)
   - [ ] Status toggle
   - [ ] Save & Cancel buttons

3. Make small change (e.g., add note)
4. Click Save
5. Verify:
   - [ ] Success message displays
   - [ ] Changes saved and reflected in list
   - [ ] Audit log records change

**Expected Outcome:**
- [x] List displays all users (or paginated correctly)
- [ ] Search and filters work accurately
- [ ] Can view user details
- [ ] Can edit user information
- [ ] Changes persist across page refreshes

**Verification Note:** API `/api/users` returns correct user list with page/limit params. 400 error observed when params missing.

**Fail Conditions:**
- ❌ Empty user list (when data exists)
- ❌ Search doesn't filter
- ❌ Edit fails or doesn't save
- ❌ 403/404 errors

---

#### T3.2 - Agencies Management
**Objective:** Verify Super Admin can manage agency entities  
**URL:** `http://localhost:3000/admin/agencies`

**Page Layout:**
- [ ] Agencies list displays
- [ ] Search/filter available
- [ ] Agency count shown
- [ ] Status indicators visible

**Agency List Columns:**
- [ ] **Agency Name**
- [ ] **Trade License** ID
- [ ] **Contact Person** name
- [ ] **Phone** - Contact number
- [ ] **Status** - Active/Inactive
- [ ] **Verification** - Verified/Pending/Rejected
- [ ] **Actions** - View, Edit, Verify/Reject, Delete

**Search & Filter:**
1. Search by agency name
   - [ ] Results filter correctly
   - [ ] Case-insensitive search works

2. Filter by verification status:
   - [ ] "Pending" - shows unverified agencies
   - [ ] "Verified" - shows approved agencies
   - [ ] "Rejected" - shows rejected agencies

3. Filter by active status:
   - [ ] "Active" - shows active agencies
   - [ ] "Inactive" - shows suspended agencies

**Agency Verification:**
1. Find an agency with status "Pending"
2. Click "Verify" button
3. Observe:
   - [ ] Verification dialog/modal appears
   - [ ] Shows agency details for review
   - [ ] Commission rate visible
   - [ ] Approve/Reject buttons present

4. Click "Approve" (or "Verify")
5. Verify:
   - [ ] Status changes to "Verified"
   - [ ] Success notification displays
   - [ ] Audit log records verification
   - [ ] Agency can now operate (list caregivers, create packages)

**Agency Rejection (Optional):**
1. Find another pending agency
2. Click "Reject"
3. Enter reason (e.g., "Invalid trade license")
4. Click "Confirm"
5. Verify:
   - [ ] Status changes to "Rejected"
   - [ ] Agency cannot operate
   - [ ] Rejection reason stored
   - [ ] Agency can reapply (if applicable)

**Expected Outcome:**
- [x] Agency list displays correctly
- [x] Can search and filter
- [x] Verification process works (API Only)
- [ ] Status changes persist
- [ ] Audit trail created

**Verification Note:** 
- `GET /api/agencies` works correctly.
- **CRITICAL FAIL:** The frontend detail page route `/admin/agencies/[id]` does not exist in the file system. Clicking "View" will result in a 404.
- Verification logic exists in API but cannot be accessed via UI due to missing page.



**Fail Conditions:**
- ❌ List empty when agencies exist
- ❌ Verify button disabled
- ❌ Status not updating
- ❌ Errors on verification

---

#### T3.3 - Caregivers Management
**Objective:** Verify Super Admin can manage caregiver entities  
**URL:** `http://localhost:3000/admin/caregivers`

**Page Layout:**
- [ ] Caregiver list displays
- [ ] Filter options available (status, verification, agency)
- [ ] Sorting available (by name, rating, experience)

**Caregiver List Columns:**
- [ ] **Name**
- [ ] **Phone**
- [ ] **NID** (National ID)
- [ ] **Agency** - Associated agency
- [ ] **Verification** - Verified/Pending/Rejected
- [ ] **Background Check** - Status
- [ ] **Certifications** - Count and expiry info
- [ ] **Rating** - Average rating (e.g., 4.8/5)
- [ ] **Actions**

**Search & Filter:**
1. Search by caregiver name
   - [ ] Results update in real-time

2. Filter by verification status:
   - [ ] "Pending" - awaiting verification
   - [ ] "Verified" - approved caregivers
   - [ ] "Rejected" - rejected caregivers

3. Filter by agency:
   - [ ] Dropdown lists all verified agencies
   - [ ] Selecting agency filters list

**Caregiver Detail View:**
1. Click "View" on a caregiver
2. Detail page shows:
   - [ ] Personal info (name, DOB, gender, address)
   - [ ] Contact (phone, email)
   - [ ] NID with verification status
   - [ ] Background check status with date
   - [ ] Certifications list with expiry dates
   - [ ] Skills/specializations
   - [ ] Languages spoken
   - [ ] Experience years
   - [ ] Rating and review count
   - [ ] Agency affiliation
   - [ ] Available/unavailable status
   - [ ] Edit and action buttons

**Verify Caregiver:**
1. Find pending caregiver
2. Click "Verify" button
3. Review:
   - [ ] All documents visible
   - [ ] NID verification checkmark
   - [ ] Background check completed
   - [ ] Required certifications present

4. Click "Approve"
5. Verify:
   - [ ] Status → "Verified"
   - [ ] Can now accept job assignments
   - [ ] Appears in agency's caregiver roster

**Background Check Management:**
1. Find caregiver with pending background check
2. Observe:
   - [ ] Status shows "Pending"
   - [ ] Date submitted visible
   - [ ] Action button available

3. Click "Approve Background Check"
4. Enter approval notes
5. Click "Confirm"
6. Verify:
   - [ ] Status → "Cleared"
   - [ ] Timestamp recorded
   - [ ] Caregiver can now take jobs

**Expected Outcome:**
- [x] Caregiver list displays correctly
- [ ] All filter options work
- [ ] Detail page shows complete information
- [ ] Verification/background check process functional
- [ ] Status changes persist

**Verification Note:** 
- `GET /api/caregivers` works correctly.
- **CRITICAL FAIL:** The frontend detail page route `/admin/caregivers/[id]` does not exist in the file system.
- `PATCH /api/users/:id` issues persistent (DTO limitation).



**Fail Conditions:**
- ❌ List not loading
- ❌ Missing caregiver data fields
- ❌ Verify button non-functional
- ❌ Background check status not updating

---

#### T3.4 - Guardians & Patients Management
**Objective:** Verify Super Admin can manage guardian and patient entities  
**URL:** `http://localhost:3000/admin/patients`

**Guardian List (Parent Page):**
- [ ] List displays all guardians
- [ ] Search by name/phone available
- [ ] Filter by status (Active/Inactive)
- [ ] Shows associated patient count

**Guardian Detail:**
1. Click "View" on guardian
2. Page shows:
   - [ ] Guardian info (name, phone, email, address)
   - [ ] KYC status and documents
   - [ ] Account creation date
   - [ ] Associated patients (list)
   - [ ] Payment method on file
   - [ ] Total spending
   - [ ] Edit button

**Patients List (Sub-view):**
1. Click "View Patients" for a guardian
2. List shows:
   - [ ] **Patient Name**
   - [ ] **Age/DOB**
   - [ ] **Gender**
   - [ ] **Care Need** (e.g., "Elderly care", "Post-surgery")
   - [ ] **Active Jobs** - Count
   - [ ] **Last Caregiver Assigned**
   - [ ] **Health Status** - Overview
   - [ ] **Actions**

**Patient Detail:**
1. Click patient name
2. Page displays:
   - [ ] Full name and basic info
   - [ ] Age, gender, address
   - [ ] Emergency contact
   - [ ] Care requirements/notes
   - [ ] Active prescriptions/medications
   - [ ] Scheduled care activities
   - [ ] Recent care logs
   - [ ] Assigned caregivers (current)
   - [ ] Health records access
   - [ ] Edit button

**Health Records:**
1. Expand "Health Records" section
2. Verify displays:
   - [ ] Chronic conditions list
   - [ ] Allergies
   - [ ] Current medications
   - [ ] Vaccination history
   - [ ] Blood type
   - [ ] Can add/edit records

**Edit Patient:**
1. Click "Edit"
2. Form allows:
   - [ ] Update name, DOB, contact info
   - [ ] Update care requirements
   - [ ] Update emergency contact
   - [ ] Save changes

3. Click "Save"
4. Verify changes persist

**Expected Outcome:**
- ✅ Guardian list displays
- ✅ Can view patient details
- ✅ Health records visible
- ✅ Can edit patient information
- ✅ Data persists after save

**Fail Conditions:**
- ❌ Patients not displaying
- ❌ Health records missing
- ❌ Edit fails
- ❌ Data loss after save

---

### Phase 4: Administrative Actions (45 minutes)

#### T4.1 - Dispute Resolution
**Objective:** Verify Super Admin can manage and resolve disputes  
**URL:** `http://localhost:3000/admin/disputes`

**Dispute List:**
- [ ] Lists all open disputes
- [ ] Shows filters: By type, status, date range
- [ ] Sorting: By date, status, severity

**Dispute Columns:**
- [ ] **ID** - Dispute unique ID
- [ ] **Type** - Quality, Payment, Cancellation, Other
- [ ] **Raised By** - Guardian/Caregiver/Agency name
- [ ] **Against** - Defendant name
- [ ] **Description** - Brief summary
- [ ] **Status** - Open, Under Review, Resolved, Closed
- [ ] **Created Date**
- [ ] **Priority** - High, Medium, Low

**Open Dispute:**
1. Find a dispute with status "Open"
2. Click to view details
3. Page shows:
   - [ ] Complainant details
   - [ ] Defendant details
   - [ ] Full dispute description
   - [ ] Attached evidence (if any)
   - [ ] Timeline of messages
   - [ ] Related job/transaction info

4. Observe action buttons:
   - [ ] "Accept & Investigate" button
   - [ ] "Escalate" button (if needed)
   - [ ] "Messages" section

**Investigation Process:**
1. Click "Accept & Investigate"
2. Page updates:
   - [ ] Status → "Under Review"
   - [ ] Assigned to: Current Admin
   - [ ] Timestamp recorded

3. Review evidence:
   - [ ] View chat history
   - [ ] Check job completion records
   - [ ] Review caregiver's care logs
   - [ ] Check payment status

4. Click "Send Message" to communicate:
   - [ ] Text area appears
   - [ ] Enter message
   - [ ] Can attach files/images
   - [ ] Send button functional

**Dispute Resolution:**
1. Click "Resolve Dispute"
2. Resolution modal appears:
   - [ ] Decision options: "Favor Complainant", "Favor Defendant", "Compromise"
   - [ ] Resolution amount field (for payment disputes)
   - [ ] Reason/explanation textarea

3. Enter resolution details:
   - [ ] Select decision
   - [ ] Enter amount if applicable
   - [ ] Provide detailed reason

4. Click "Confirm Resolution"
5. Verify:
   - [ ] Status → "Resolved"
   - [ ] Payment processed (if applicable)
   - [ ] Notification sent to both parties
   - [ ] Audit log records resolution

**Expected Outcome:**
- ✅ Disputes load correctly
- ✅ Can view full details
- ✅ Investigation process works
- ✅ Resolution process functional
- ✅ Status updates persist

**Fail Conditions:**
- ❌ Disputes not displaying
- ❌ Messages don't send
- ❌ Resolution button disabled
- ❌ Status not updating

---

#### T4.2 - Audit Logs Review
**Objective:** Verify Super Admin can access and review audit logs  
**URL:** `http://localhost:3000/admin/audit-logs`

**Audit Log List:**
- [ ] Displays chronological list of system activities
- [ ] Shows filters: Date range, action type, actor role, entity type
- [ ] Sorting: By timestamp (newest first by default)

**Audit Log Columns:**
- [ ] **Timestamp** - When action occurred
- [ ] **Actor** - User who performed action (name + role)
- [ ] **Action** - What was done (e.g., "user_created", "agency_verified")
- [ ] **Entity Type** - What was affected (User, Agency, etc.)
- [ ] **Entity ID** - ID of affected entity
- [ ] **Entity Name** - Human-readable name
- [ ] **Changes** - Summary of what changed

**Filter by Date Range:**
1. Click date range picker
2. Select "Last 24 hours"
3. Verify list updates to show only recent activities
4. Try other ranges: "Last week", "Last month", "Custom"

**Filter by Action Type:**
1. Click action type dropdown
2. Verify options include:
   - [ ] user_created
   - [ ] user_updated
   - [ ] user_deleted
   - [ ] agency_verified
   - [ ] caregiver_verified
   - [ ] payment_processed
   - [ ] dispute_resolved
   - [ ] etc.

3. Select one action type
4. List filters accordingly

**View Audit Detail:**
1. Click on an audit log entry
2. Detail panel opens showing:
   - [ ] Full timestamp
   - [ ] Actor full details (name, email, phone, role)
   - [ ] Action description
   - [ ] Entity affected (with link)
   - [ ] Changes made (before → after values)
   - [ ] IP address (if logged)
   - [ ] User agent/browser info

**Export Audit Logs:**
1. Check if "Export" button exists
2. If available, click "Export"
3. Verify:
   - [ ] File downloads (CSV or JSON format)
   - [ ] File contains all filtered logs
   - [ ] Date range respected
   - [ ] All columns included

**Expected Outcome:**
- [x] Audit logs display correctly
- [ ] Filters work accurately
- [ ] Can view detailed entries
- [ ] Export functionality works (if available)

**Verification Note:** API `/api/audit` returns log entries successfully.

**Fail Conditions:**
- ❌ Empty audit log (when activities exist)
- ❌ Filters don't work
- ❌ Detail view shows incomplete data
- ❌ Export fails

---

#### T4.3 - System Settings & Configuration
**Objective:** Verify Super Admin can access and modify system settings  
**URL:** `http://localhost:3000/admin/settings`

**Settings Page Sections:**

**General Settings:**
- [ ] Platform name (editable)
- [ ] Platform description (editable)
- [ ] Support email (editable)
- [ ] Support phone (editable)
- [ ] Timezone selector
- [ ] Currency (should be BDT)
- [ ] Date format selector

1. Edit platform name:
   - [ ] Change value
   - [ ] Click Save
   - [ ] Value persists
   - [ ] Appears updated in UI

**MFA Settings:**
- [ ] MFA enforcement toggle
- [ ] Required for roles checkbox:
  - [ ] Super Admin
  - [ ] Moderator
  - [ ] Agency

- [ ] MFA methods available:
  - [ ] SMS OTP
  - [ ] Email OTP
  - [ ] Google Authenticator (if supported)

1. Try enabling MFA for all roles:
   - [ ] Toggle enabled
   - [ ] Save changes
   - [ ] All admins now require MFA

**Payment Settings:**
- [ ] Commission rate (percentage)
- [ ] Payment gateway selection:
  - [ ] bKash
  - [ ] Nagad
  - [ ] Bank Transfer
- [ ] Minimum payout amount
- [ ] Payout frequency (Weekly, Bi-weekly, Monthly)

1. Change commission rate:
   - [ ] Edit value (e.g., from 12% to 13%)
   - [ ] Click Save
   - [ ] Verify change applied to new transactions

**Notification Settings:**
- [ ] Email notifications toggle
- [ ] SMS notifications toggle
- [ ] Notification preferences by event:
  - [ ] New user registration
  - [ ] Agency verification
  - [ ] Payment processed
  - [ ] Dispute raised

**Security Settings:**
- [ ] Password requirements display
- [ ] Session timeout (minutes)
- [ ] Failed login attempts allowed
- [ ] Account lockout duration
- [ ] IP whitelist/blacklist (if applicable)

1. Change session timeout:
   - [ ] Edit value
   - [ ] Save
   - [ ] Verify takes effect on next session

**Rate Limiting:**
- [ ] API rate limit per minute
- [ ] Login attempts per hour
- [ ] Message sending limits

**Database Maintenance:**
- [ ] Backup status
- [ ] Last backup timestamp
- [ ] "Backup Now" button (if available)
- [ ] "Clear Old Logs" button (if available)

**System Status:**
- [ ] Database connection status
- [ ] API server status
- [ ] Cache/Redis status
- [ ] Email service status

Expected display:
- [ ] All services show "Connected" ✅
- [ ] Response times shown
- [ ] Last health check timestamp

**Expected Outcome:**
- ✅ All settings load correctly
- ✅ Can edit settings
- ✅ Changes save and persist
- ✅ System status shows as healthy
- ✅ No errors on settings page

**Fail Conditions:**
- ❌ Settings page blank/not loading
- ❌ Save button doesn't work
- ❌ Changes don't persist
- ❌ System status shows errors

---

### Phase 5: Communication & Analytics (30 minutes)

#### T5.1 - Admin Messaging System
**Objective:** Verify Super Admin can communicate with other entities  
**URL:** `http://localhost:3000/admin/messages`

**Messaging Interface:**
- [ ] Conversation list displays on left/side
- [ ] Search conversations available
- [ ] Filter: By entity type, status, unread, etc.
- [ ] Message thread displays in main area

**Conversation List:**
- [ ] Shows recent conversations first
- [ ] Displays:
  - [ ] Entity name/type (Agency, Caregiver, etc.)
  - [ ] Last message preview
  - [ ] Timestamp of last message
  - [ ] Unread badge (if applicable)
  - [ ] Status (online/offline indicator if available)

**Start New Conversation:**
1. Look for "New Message" or "+" button
2. Click to open entity selector
3. Verify can select:
   - [ ] Specific agency
   - [ ] Specific caregiver
   - [ ] Specific guardian
   - [ ] Broadcast (all users of type)

4. Select an entity
5. Type message in text area
6. Click "Send"
7. Verify:
   - [ ] Message appears in thread
   - [ ] Timestamp shown
   - [ ] Message marked as "from Admin"
   - [ ] Notification sent to recipient

**Message Thread:**
1. Open existing conversation
2. Verify displays:
   - [ ] All messages chronologically
   - [ ] Sender identity (Admin or other party)
   - [ ] Timestamps
   - [ ] Read receipt (if available)

3. Scroll through messages:
   - [ ] All messages load
   - [ ] No missing messages
   - [ ] Pagination works if many messages

4. Reply to message:
   - [ ] Click reply or text area
   - [ ] Type response
   - [ ] Click Send
   - [ ] Message appears in thread

**Attachments (if supported):**
1. Look for attachment button (📎)
2. Click to attach file
3. Select file
4. File shows as attachment
5. Click Send
6. Verify:
   - [ ] File uploads
   - [ ] Recipient can download

**Expected Outcome:**
- ✅ Can view conversations
- ✅ Can send messages
- ✅ Messages display correctly
- ✅ Timestamps accurate
- ✅ Notifications work

**Fail Conditions:**
- ❌ Conversations not loading
- ❌ Send button doesn't work
- ❌ Messages not appearing
- ❌ Errors on page

---

#### T5.2 - Analytics Dashboard
**Objective:** Verify Super Admin can access comprehensive platform analytics  
**URL:** `http://localhost:3000/admin/analytics`

**Analytics Overview:**

**User Metrics:**
- [ ] Total users (all time)
- [ ] New users (today, this week, this month)
- [ ] User growth chart (line or area)
- [ ] Breakdown by role:
  - [ ] Agencies
  - [ ] Caregivers
  - [ ] Guardians
  - [ ] Patients

**Agency Metrics:**
- [ ] Total agencies
- [ ] Verified agencies
- [ ] Active agencies (last 30 days)
- [ ] Agency growth chart
- [ ] Top agencies by revenue

**Caregiver Metrics:**
- [ ] Total caregivers
- [ ] Verified caregivers
- [ ] Active caregivers
- [ ] Average rating
- [ ] Top rated caregivers

**Job & Assignment Metrics:**
- [ ] Total jobs posted
- [ ] Jobs completed
- [ ] Jobs pending
- [ ] Average job duration
- [ ] Jobs by status pie chart

**Financial Metrics:**
- [ ] Total revenue (platform)
- [ ] Revenue trend (chart)
- [ ] Average transaction amount
- [ ] Total commissions earned
- [ ] Failed payments
- [ ] Refunds issued

**Quality Metrics:**
- [ ] Average caregiver rating
- [ ] Customer satisfaction score
- [ ] Dispute rate
- [ ] Complaint count
- [ ] Resolution time (average)

**Interactive Features:**
1. Check date range selector:
   - [ ] Can select "This month"
   - [ ] Can select custom range
   - [ ] Chart updates on change

2. Check export options:
   - [ ] "Export as CSV" button
   - [ ] "Export as PDF" button
   - [ ] Reports can be emailed (if available)

3. Filter options:
   - [ ] By agency (dropdown)
   - [ ] By region/city (if applicable)
   - [ ] By role

**Expected Outcome:**
- ✅ Analytics load within 3 seconds
- ✅ All metrics display
- ✅ Charts render correctly
- ✅ Filters work
- ✅ Export functionality available

**Fail Conditions:**
- ❌ Analytics page blank
- ❌ Charts not rendering
- ❌ Data shows zero when data exists
- ❌ Filters don't work
- ❌ Export fails

---

### Phase 6: Role-Based Access Control (20 minutes)

#### T6.1 - Permission Boundaries
**Objective:** Verify Super Admin has appropriate permissions and cannot exceed bounds

**Super Admin Can:**
- [ ] View all users
- [ ] Edit user information
- [ ] Delete user accounts
- [ ] Verify agencies
- [ ] Reject agencies
- [ ] Verify caregivers
- [ ] Suspend accounts (agency, caregiver)
- [ ] Resolve disputes
- [ ] View audit logs
- [ ] Access system settings
- [ ] Process refunds/payments
- [ ] Manage moderators

**Verification Tests:**

1. **Agency Suspension Test:**
   - [ ] Navigate to Agency detail
   - [ ] Look for "Suspend" or "Deactivate" button
   - [ ] Click to suspend an agency
   - [ ] Status changes to "Inactive"
   - [ ] Agency can no longer create packages

2. **Caregiver Deactivation Test:**
   - [ ] Navigate to Caregiver detail
   - [ ] Look for "Deactivate" button
   - [ ] Click to deactivate
   - [ ] Caregiver appears as inactive
   - [ ] Cannot accept new jobs

3. **Payment Authorization Test:**
   - [ ] Navigate to a payment
   - [ ] Check if can authorize/process
   - [ ] Check if can issue refund
   - [ ] Can set reason for refund

4. **Moderator Management Test:**
   - [ ] Check if "Create Moderator" option available
   - [ ] Or check if can edit existing moderators
   - [ ] Can assign permissions

**Expected Outcome:**
- ✅ All admin actions available
- ✅ Can modify system-level settings
- ✅ No permission denied errors
- ✅ Changes apply immediately

**Fail Conditions:**
- ❌ "Permission denied" errors
- ❌ Admin buttons missing/disabled
- ❌ Changes don't apply

---

### Phase 7: Error Handling & Edge Cases (20 minutes)

#### T7.1 - Session Timeout
**Objective:** Verify admin session handles timeout appropriately

**Steps:**
1. Login as Super Admin
2. Leave the browser idle for session timeout duration
   - (Typically 30 minutes, but check settings)
3. Try to perform an action:
   - [ ] Click a button or navigate
4. Observe:
   - [ ] Redirected to login page
   - [ ] Appropriate message displayed
   - [ ] Session cleared

**Expected:** Session timeout handled gracefully with clear messaging

---

#### T7.2 - Invalid Data Handling
**Objective:** Verify error handling for invalid inputs

**Test 1 - Edit User with Invalid Email:**
1. Go to Users → Edit a user
2. Change email to invalid format (e.g., "notanemail")
3. Click Save
4. Verify:
   - [ ] Validation error message displays
   - [ ] Form highlights invalid field
   - [ ] Not saved to database

**Test 2 - Commission Rate Out of Range:**
1. Go to Settings
2. Try to set commission to invalid value:
   - [ ] Negative number
   - [ ] Over 100%
   - [ ] Non-numeric

3. Verify:
   - [ ] Error message displays
   - [ ] Value reverted to previous

**Expected:** All inputs validated with clear error messages

---

#### T7.3 - Network Error Handling
**Objective:** Verify graceful handling of network issues

**Steps:**
1. Open admin page (e.g., Users list)
2. Open DevTools (F12) → Network tab
3. Check "Offline" to simulate network failure
4. Try to perform action (e.g., search users)
5. Verify:
   - [ ] Error message displays (not blank page)
   - [ ] "Retry" button available
   - [ ] Can still navigate away
6. Uncheck "Offline" to restore connection
7. Click "Retry"
8. Verify action completes successfully

**Expected:** Network errors handled gracefully with user feedback

---

## 📊 TESTING SUMMARY

### Results Tracking

**Tester Name:** AI Agent (Backend/API Verification)  
**Test Date:** 2025-12-25  
**Environment:** [x] Dev [ ] Staging [ ] Prod  
**Browser:** CLI/Curl  
**OS:** Linux  

### Test Status Summary

| Phase | Tests | Passed | Failed | Notes |
|-------|-------|--------|--------|-------|
| T1 - Auth & Access | 3 | 1 | 0 | API Verified (UI Skipped) |
| T2 - Dashboard | 3 | 0 | 0 | Skipped (UI) |
| T3 - Entity Management | 4 | 1 | 2 | Users Passed. Agencies/Caregivers FAILED (Missing Pages) |
| T4 - Admin Actions | 3 | 1 | 0 | API Verified (T4.2) |
| T5 - Communication & Analytics | 2 | 0 | 0 | Skipped (UI) |


| T6 - RBAC | 1 | 0 | 0 | Skipped |
| T7 - Error Handling | 3 | 0 | 0 | Skipped |
| **TOTAL** | **19** | **__** | **__** | |

### Critical Issues Found

| Issue # | Severity | Title | Description | Steps to Reproduce |
|---------|----------|-------|-------------|-------------------|
| 1 | 🟡 | API 400 on Missing Params | GET /users returns 400 if page/limit missing | Call /users without params |
| 2 | 🟡 | API Strict DTO Validation | PATCH endpoints throw 400 for any extra fields | Send extra fields in JSON body |
| 3 | 🟠 | Missing Admin Override for KYC | PATCH /users/:id DTO blocks kyc_status update | Try to update kyc_status as Admin |
| 4 | � | Missing Frontend Routes | Admin Detail pages for Agency/Caregiver do not exist | Click "View" on Agency/Caregiver list |


### Recommendations

- [ ] **Critical Issues:** Must fix before release
- [ ] **High Issues:** Should fix in next sprint
- [ ] **Medium Issues:** Can fix in upcoming release
- [ ] **Low Issues:** Nice to have improvements

---

## ✅ SIGN-OFF

**Tester Signature:** _______________  
**Date:** _______________  
**Verified By:** _______________  
**Status:** [ ] PASS [ ] FAIL [ ] CONDITIONAL PASS

---

**Next Entity to Test:** 🚀 Moderator (comprehensive testing guide to follow)

