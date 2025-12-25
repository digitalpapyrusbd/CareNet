# 🛡️ Manual Testing - Moderator Entity (Complete Guide)

**Date Created:** December 17, 2025  
**Entity:** Moderator / Platform Moderator  
**Testing Scope:** Moderator dashboard, verification, moderation, and limited admin features  
**Estimated Time:** 2-2.5 hours  
**Prerequisites:** Development server running, database seeded with test data  

---

## 🎖️ MODERATOR USER ROLE & CAPABILITIES

### Role Definition
**Moderator** is a platform management role responsible for verifying agencies and caregivers, managing disputes, and first-tier quality control.

| Property | Value |
|----------|-------|
| **Role Name** | MODERATOR |
| **Authority Level** | Level 8 (Quality Control) |
| **Core Function** | Agency/caregiver verification, dispute management, content moderation |
| **Access Level** | Limited administrative access (no system settings) |
| **MFA Requirement** | Yes (Mandatory) |
| **Scope** | Cannot modify system config, cannot manage other moderators |

### Moderator Permissions Overview

| Category | Permissions |
|----------|-------------|
| **User Management** | ⚠️ View users, Cannot create/delete |
| **Agency Management** | ✅ Verify/reject agencies, view analytics |
| **Caregiver Management** | ✅ Verify/reject caregivers, manage certifications |
| **Patient Management** | ✅ View patient records (read-only) |
| **Job Management** | ⚠️ View jobs, Cannot create/cancel |
| **Payment Management** | ❌ No access to payments or refunds |
| **Dispute Resolution** | ✅ Review disputes, recommend resolution (Super Admin executes) |
| **System Settings** | ❌ No access to system settings |
| **Analytics & Reporting** | ✅ View moderation-specific analytics |
| **Audit Logs** | ⚠️ View own actions only (not all system logs) |
| **Content Moderation** | ✅ Flag/review inappropriate content |
| **CV/Resume Pool** | ✅ Manage caregiver CV/resume database |

---

## 🚀 SETUP & PREREQUISITES

### Test Environment Checklist

- [ ] **Development Server Running**
  - [ ] Next.js app: `npm run dev` (port 3000)
  - [ ] Backend/API available
  - [ ] Database connected and seeded

- [ ] **Browser & Tools**
  - [ ] Modern browser (Chrome, Firefox, Safari, or Edge)
  - [ ] DevTools available (F12)
  - [ ] LocalStorage accessible
  - [ ] Cookies enabled

- [ ] **Test Data**
  - [ ] Moderator account created in database
  - [ ] Seed data includes:
    - [ ] Pending agencies for verification
    - [ ] Pending caregivers for verification
    - [ ] Open disputes for review
    - [ ] Agencies with caregivers

### Test Moderator Account Credentials

| Credential | Value |
|-----------|-------|
| **Phone Number** | `+8801712345201` |
| **Email** | `moderator@carenet.com` |
| **Password** | `Moderator@123` |
| **Role** | MODERATOR |
| **Name** | Platform Moderator |
| **KYC Status** | VERIFIED |
| **Is Active** | Yes |
| **Language** | English (en) |

**Demo Account (Alternative):**
- **Phone:** `+8801712345202`
- **Password:** `Demo@123`

---

## ✅ TEST EXECUTION PLAN

### Phase 1: Authentication & Access (25 minutes)

#### M1.1 - Moderator Login
**Objective:** Verify Moderator can successfully authenticate  
**URL:** `http://localhost:3000/admin/login`

**Steps:**
1. Open the admin login page in browser
2. Observe the page layout:
   - [ ] Page title shows "Admin Login" or similar
   - [ ] Login form centered and styled
   - [ ] All form fields visible

3. Enter credentials:
   - [ ] Phone field: `+8801712345201`
   - [ ] Password field: `Moderator@123`

4. Click "Login" button
5. Observe MFA requirement:
   - [ ] MFA prompt appears (if configured)
   - [ ] Can enter verification code

**Expected Outcome:**
- ✅ Login succeeds without errors
- ✅ Redirects to `/admin/dashboard` or moderator-specific dashboard
- ✅ Page loads within 3 seconds
- ✅ No console errors
- ✅ Session token stored

**Fail Conditions:**
- ❌ Error: "Invalid credentials"
- ❌ 403/404 error
- ❌ Infinite loading
- ❌ Console errors

**Notes:**
- _Verify moderator role displays (not "Super Admin")_

---

#### M1.2 - Dashboard Access After Login
**Objective:** Verify Moderator is redirected to correct dashboard  
**Expected URL:** `http://localhost:3000/admin/dashboard` or `/moderator/dashboard`

**Steps:**
1. After successful login, observe redirect
2. Check dashboard loads with:
   - [ ] Dashboard title displays "Moderator Dashboard" or similar
   - [ ] Navigation menu appropriate for moderator
   - [ ] Header shows "Moderator" or similar
   - [ ] User profile/logout option visible

3. Verify no blank pages or loading states

**Key Difference from Super Admin:**
- ✅ Should NOT see "System Settings" option
- ✅ Should NOT see "Analytics" (system-wide)
- ✅ Should see "Verification Queue"
- ✅ Should see "Disputes" (moderation view)

**Expected Outcome:**
- ✅ Dashboard loads within 2-3 seconds
- ✅ Layout components render correctly
- ✅ Moderator-specific menu items visible
- ✅ No admin-only items visible

**Fail Conditions:**
- ❌ Shows full admin dashboard (should be restricted)
- ❌ 404 Page Not Found
- ❌ Infinite loading
- ❌ Shows "Permission Denied"

---

#### M1.3 - Role-Based Access Restrictions
**Objective:** Verify Moderator cannot access Super Admin features

**Test 1 - System Settings Access:**
1. Try to navigate directly to `http://localhost:3000/admin/settings`
2. Verify:
   - [ ] Page shows 403/Forbidden error
   - OR
   - [ ] Menu item doesn't show
   - [ ] Error message: "Insufficient permissions"

**Test 2 - Try Navigation Direct Links:**
1. Moderator should be able to access:
   - [ ] `/admin/dashboard` ✅
   - [ ] `/admin/verification` ✅
   - [ ] `/admin/agencies` ✅
   - [ ] `/admin/caregivers` ✅
   - [ ] `/admin/disputes` ✅

2. Moderator should NOT access:
   - [ ] `/admin/settings` ❌
   - [ ] `/admin/users` (or limited view) ⚠️
   - [ ] `/admin/analytics` (system-wide) ❌

**Expected Outcome:**
- ✅ Cannot access restricted pages
- ✅ Clear error messages
- ✅ No errors in console

**Fail Conditions:**
- ❌ Can access restricted pages
- ❌ Vague error messages
- ❌ Data visible that shouldn't be

---

### Phase 2: Moderator Dashboard Features (35 minutes)

#### M2.1 - Dashboard Overview Display
**Objective:** Verify moderator dashboard displays relevant metrics  
**URL:** `http://localhost:3000/admin/dashboard`

**Dashboard Metrics to Verify:**

**Verification Queue KPIs:**
- [ ] **Pending Agencies**
  - Expected: Display count (e.g., "12")
  - Label: "Awaiting Verification"
  - Color: Orange/warning color
  - Action: Link to verification queue

- [ ] **Pending Caregivers**
  - Expected: Display count
  - Label: "Caregiver Verifications"
  - Color: Orange
  - Action: Link to verification queue

- [ ] **Pending Background Checks**
  - Expected: Display count
  - Label: "Background Checks"
  - Color: Red (if urgent)

- [ ] **Open Disputes**
  - Expected: Display count
  - Label: "Active Disputes"
  - Color: Red (urgent attention)

- [ ] **This Month's Verifications**
  - Expected: Display count completed this month
  - Trend: Arrow showing trend vs. last month

- [ ] **Moderation Actions**
  - Expected: Count of actions taken today/this week

**Expected Outcome:**
- ✅ All relevant KPI cards display
- ✅ Numbers are current
- ✅ Cards clickable and navigate to correct section
- ✅ No "undefined" values

**Fail Conditions:**
- ❌ Empty dashboard
- ❌ System-wide KPIs shown (should be moderation-only)
- ❌ Navigation links broken
- ❌ Stale data

---

#### M2.2 - Navigation Menu
**Objective:** Verify Moderator navigation menu is appropriate

**Expected Menu Items:**

| Menu Item | Expected | Accessible |
|-----------|----------|-----------|
| Dashboard | ✅ Yes | ✅ |
| Verification Queue | ✅ Yes | ✅ |
| Agencies | ✅ Yes (limited) | ✅ |
| Caregivers | ✅ Yes (limited) | ✅ |
| Disputes | ✅ Yes | ✅ |
| CV Pool / Resources | ✅ Yes | ✅ |
| My Actions | ⚠️ Optional | - |
| Users | ❌ No | ❌ |
| Analytics (System) | ❌ No | ❌ |
| Settings | ❌ No | ❌ |
| Billing | ❌ No | ❌ |

**Steps:**
1. Check sidebar/menu visible
2. For each menu item:
   - [ ] Shows only appropriate items (no admin-only items)
   - [ ] Can click without error
   - [ ] Navigates to correct page
   - [ ] Active item highlighted

**Expected Outcome:**
- ✅ 5-6 moderator-specific menu items visible
- ✅ No system admin items
- ✅ Each item clickable and functional

**Fail Conditions:**
- ❌ Shows all admin menu items (over-permissioned)
- ❌ Missing key moderator items
- ❌ Dead links

---

### Phase 3: Verification Queue (50 minutes)

#### M3.1 - Verification Queue Overview
**Objective:** Verify moderator can access and view verification queue  
**URL:** `http://localhost:3000/admin/verification` or `/moderator/verification`

**Queue Page Layout:**
- [ ] Page title: "Verification Queue" or similar
- [ ] Tabs visible: "Agencies", "Caregivers", "Background Checks" (if separate)
- [ ] Filter options: By status, date submitted, type
- [ ] Sort options: By date, priority, name
- [ ] Count of pending items in each category

**Expected Outcome:**
- ✅ Page loads correctly
- ✅ Shows pending items (or empty with placeholder if none)
- ✅ Items displayed chronologically
- ✅ No system-level data visible

**Fail Conditions:**
- ❌ Page blank/not loading
- ❌ Shows no items when they exist
- ❌ Errors in console

---

#### M3.2 - Agency Verification Workflow
**Objective:** Verify Moderator can review and verify agencies  

**Step 1 - View Pending Agencies:**
1. Click "Agencies" tab in verification queue
2. Verify list displays:
   - [ ] **Agency Name**
   - [ ] **Trade License ID**
   - [ ] **Contact Person**
   - [ ] **Submission Date**
   - [ ] **Status** - "Pending"
   - [ ] **View/Review button**

**Step 2 - Review Agency Details:**
1. Click "Review" or "View" on a pending agency
2. Detail page shows:
   - [ ] **Agency Info**
     - [ ] Name, address, phone, email
     - [ ] Contact person details
     - [ ] Years in business

   - [ ] **Documents**
     - [ ] Trade License (with preview)
     - [ ] TIN Certificate
     - [ ] Bank details
     - [ ] Owner ID/passport

   - [ ] **Verification Checklist**
     - [ ] Documents authentic
     - [ ] Contact verified
     - [ ] Business operational
     - [ ] No red flags

   - [ ] **Proposed Commission Rate**
     - [ ] Percentage shown (read-only for moderator)

3. Verify can zoom/view document images

**Step 3 - Verify Agency:**
1. After reviewing, click "Approve" or "Verify" button
2. Modal appears asking:
   - [ ] Confirmation message
   - [ ] Optional notes/comments field
   - [ ] "Verify" and "Cancel" buttons

3. Enter optional note (e.g., "Documents verified, business registered")
4. Click "Verify"
5. Verify:
   - [ ] Status changes to "Verified"
   - [ ] Success notification displays
   - [ ] Agency removed from queue
   - [ ] Action logged

**Step 4 - Reject Agency (Optional Test):**
1. Find another pending agency
2. Click "Review"
3. Click "Reject" button
4. Modal appears:
   - [ ] Reason dropdown with options:
     - [ ] "Invalid documents"
     - [ ] "Business not operational"
     - [ ] "Fraudulent information"
     - [ ] "Other (explain)"

5. Select reason and add explanation
6. Click "Confirm Rejection"
7. Verify:
   - [ ] Status → "Rejected"
   - [ ] Agency receives notification
   - [ ] Can reapply (if policy allows)

**Expected Outcome:**
- ✅ Can view all agency details
- ✅ Verification process works
- ✅ Status updates persist
- ✅ Audit trail created
- ✅ Cannot change commission rate

**Fail Conditions:**
- ❌ Cannot view documents
- ❌ Verify button doesn't work
- ❌ Status not updating
- ❌ Can edit restricted fields

---

#### M3.3 - Caregiver Verification Workflow
**Objective:** Verify Moderator can review and verify caregivers

**Step 1 - View Pending Caregivers:**
1. Click "Caregivers" tab in verification queue
2. List displays:
   - [ ] **Caregiver Name**
   - [ ] **NID**
   - [ ] **Applied Agency** (if applicable)
   - [ ] **Submission Date**
   - [ ] **Status** - "Pending"

**Step 2 - Review Caregiver Details:**
1. Click "Review" on a pending caregiver
2. Detail page shows:
   - [ ] **Personal Info**
     - [ ] Name, phone, email
     - [ ] Date of birth
     - [ ] Gender, address

   - [ ] **Verification Documents**
     - [ ] NID (with preview)
     - [ ] Photo ID
     - [ ] Passport (if available)

   - [ ] **Certifications**
     - [ ] List of nursing/care certifications
     - [ ] Certificate images
     - [ ] Expiry dates

   - [ ] **Background Check Status**
     - [ ] Status indicator (Pending/Cleared/Flagged)
     - [ ] If available: check date, issuing authority

   - [ ] **References** (if provided)
     - [ ] Previous employer contact info

   - [ ] **Verification Checklist**
     - [ ] NID valid and verified
     - [ ] Certifications authentic
     - [ ] Background check clear
     - [ ] References checked

**Step 3 - Verify Caregiver:**
1. After reviewing documents, click "Approve" button
2. Approval options may appear:
   - [ ] Conditional approval (until background check completes)
   - [ ] Full approval
   - [ ] Need more documents

3. Select appropriate option
4. Click "Verify"
5. Verify:
   - [ ] Status → "Verified"
   - [ ] Caregiver can now accept jobs
   - [ ] Notification sent to caregiver
   - [ ] Appears in agency's roster (if agency affiliation)

**Step 4 - Request Additional Documents:**
1. Find a caregiver with incomplete docs
2. Click "Request More Documents"
3. Modal appears:
   - [ ] List of missing documents
   - [ ] Custom message field
   - [ ] Send request button

4. Select missing docs and add message
5. Click "Send Request"
6. Verify:
   - [ ] Status → "Awaiting Documents"
   - [ ] Caregiver receives notification
   - [ ] Application paused

**Expected Outcome:**
- ✅ Can view all caregiver details
- ✅ Can verify caregivers
- ✅ Can request documents
- ✅ Status updates persist
- ✅ Caregivers notified

**Fail Conditions:**
- ❌ Cannot view documents
- ❌ Verify button doesn't work
- ❌ Notifications not sent

---

#### M3.4 - Background Check Management
**Objective:** Verify Moderator can manage background checks

**Step 1 - View Pending Background Checks:**
1. Find "Background Checks" section (may be separate tab)
2. List shows:
   - [ ] **Caregiver Name**
   - [ ] **Check Type** (e.g., "Criminal Record Check")
   - [ ] **Status** - "Pending", "Submitted", "In Progress"
   - [ ] **Submission Date**
   - [ ] **View/Review button**

**Step 2 - Review Background Check:**
1. Click "Review" on pending check
2. Detail page shows:
   - [ ] Check details
   - [ ] Caregiver info
   - [ ] Status from background check provider (if integrated)
   - [ ] Results (if available)

**Step 3 - Approve/Flag Background Check:**
1. If results are available:
   - [ ] Click "Approve" → Status: "Cleared"
   - OR
   - [ ] Click "Flag for Review" → Status: "Flagged"

2. For flagged items, add reason/notes

3. Click "Confirm"

4. Verify status updates

**Expected Outcome:**
- ✅ Can view background check status
- ✅ Can approve cleared checks
- ✅ Can flag suspicious items
- ✅ Status updates properly

**Fail Conditions:**
- ❌ Cannot view check status
- ❌ Action buttons disabled
- ❌ Status not updating

---

### Phase 4: Agency & Caregiver Management (40 minutes)

#### M4.1 - Agencies Management (Limited View)
**Objective:** Verify Moderator can view and manage verified agencies  
**URL:** `http://localhost:3000/admin/agencies`

**Agencies List:**
- [ ] Shows all verified agencies
- [ ] Search/filter available
- [ ] Cannot create new agencies
- [ ] Can view details

**For Each Agency - Check What Moderator Can Do:**

✅ **Can:**
- [ ] View agency details
- [ ] View associated caregivers
- [ ] View packages offered
- [ ] View analytics (agency-specific)
- [ ] Send messages
- [ ] Flag suspicious activity

❌ **Cannot:**
- [ ] Edit agency information (should be read-only)
- [ ] Suspend agency (only Super Admin)
- [ ] Modify commission rate
- [ ] Delete agency
- [ ] Change verification status (already verified)

**Step 1 - View Agency Details:**
1. Click on an agency name
2. Detail page shows:
   - [ ] Agency info (name, license, contact)
   - [ ] Caregivers roster
   - [ ] Packages and pricing
   - [ ] Recent activity

3. Verify cannot edit fields (read-only)

**Step 2 - View Associated Caregivers:**
1. Click "Caregivers" or "Roster" section
2. List shows:
   - [ ] Caregiver names
   - [ ] Verification status
   - [ ] Ratings
   - [ ] Active jobs

3. Can click caregiver for details (read-only)

**Step 3 - View Packages:**
1. Click "Packages" section
2. List shows:
   - [ ] Package name
   - [ ] Pricing
   - [ ] Hours included
   - [ ] Sold/Active status

3. Can view but not modify

**Expected Outcome:**
- ✅ Can view all agency data
- ✅ Cannot edit restricted fields
- ✅ Can see agency metrics
- ✅ No dangerous actions available

**Fail Conditions:**
- ❌ Can edit restricted fields
- ❌ Can suspend/delete agencies
- ❌ Edit buttons visible for read-only data

---

#### M4.2 - Caregivers Management (Limited View)
**Objective:** Verify Moderator can view and manage verified caregivers  
**URL:** `http://localhost:3000/admin/caregivers`

**Caregivers List:**
- [ ] Shows verified caregivers
- [ ] Search/filter available
- [ ] Cannot create new caregivers

**For Each Caregiver - Check What Moderator Can Do:**

✅ **Can:**
- [ ] View caregiver details
- [ ] View certifications
- [ ] View background check status
- [ ] View jobs and ratings
- [ ] Send messages
- [ ] Flag suspicious activity
- [ ] Request additional documents

❌ **Cannot:**
- [ ] Edit caregiver information
- [ ] Suspend caregiver (only Super Admin)
- [ ] Delete account
- [ ] Change verification status

**Step 1 - View Caregiver Details:**
1. Click on caregiver name
2. Detail page shows:
   - [ ] Personal info (name, phone, email)
   - [ ] NID, certifications
   - [ ] Background check status
   - [ ] Agency affiliation
   - [ ] Ratings and reviews
   - [ ] Jobs history

3. Verify read-only fields

**Step 2 - Review Certifications:**
1. Expand "Certifications" section
2. Verify:
   - [ ] All certs listed
   - [ ] Expiry dates shown
   - [ ] Can view certificate images
   - [ ] Cannot edit

**Step 3 - Check Background Status:**
1. Check "Background Check" section
2. Verify:
   - [ ] Status visible
   - [ ] Date completed shown
   - [ ] Can view details
   - [ ] Cannot change status

**Step 4 - Flag Suspicious Activity (if applicable):**
1. If you notice suspicious activity:
   - [ ] Look for "Flag" or "Report" button
   - [ ] Click to open flag dialog
   - [ ] Select reason (e.g., "Fraud", "Inappropriate behavior")
   - [ ] Add comments
   - [ ] Submit flag

2. Verify:
   - [ ] Flag submitted
   - [ ] Item escalates to Super Admin
   - [ ] Notification sent

**Expected Outcome:**
- ✅ Can view all caregiver data
- ✅ Can flag suspicious activity
- ✅ Cannot modify restricted data
- ✅ Changes not possible without permission

**Fail Conditions:**
- ❌ Can edit restricted fields
- ❌ Cannot flag activity
- ❌ Edit buttons visible
- ❌ Suspension options available

---

### Phase 5: Dispute Management (40 minutes)

#### M5.1 - Dispute Queue Overview
**Objective:** Verify Moderator can access and review disputes  
**URL:** `http://localhost:3000/admin/disputes` or `/moderator/disputes`

**Disputes List:**
- [ ] Shows all open disputes
- [ ] Filters: By type, status, date, priority
- [ ] Cannot resolve (can only recommend)
- [ ] Can communicate with parties

**Dispute Columns:**
- [ ] **ID** - Dispute unique ID
- [ ] **Type** - Quality, Payment, Cancellation, Behavior, Other
- [ ] **Raised By** - Complainant name
- [ ] **Against** - Defendant name
- [ ] **Status** - Open, Under Review, Awaiting Super Admin, Resolved
- [ ] **Priority** - High, Medium, Low
- [ ] **Created Date**
- [ ] **Action** - View/Review button

**Expected Outcome:**
- ✅ Disputes load correctly
- ✅ Filter options work
- ✅ Can click to view details

**Fail Conditions:**
- ❌ Disputes not loading
- ❌ Filters broken
- ❌ No data showing

---

#### M5.2 - Dispute Investigation Process
**Objective:** Verify Moderator can investigate disputes  

**Step 1 - Open Dispute for Review:**
1. Click on a dispute with status "Open"
2. Detail page shows:
   - [ ] Complainant details (name, role)
   - [ ] Defendant details
   - [ ] Dispute type
   - [ ] Full description/complaint
   - [ ] Evidence attached (screenshots, messages, etc.)
   - [ ] Timeline/chat messages
   - [ ] Related job/transaction info

**Step 2 - Start Investigation:**
1. Click "Accept for Review" or "Start Investigation"
2. Status changes:
   - [ ] Status → "Under Review"
   - [ ] Assigned to: [Moderator Name]
   - [ ] Timestamp recorded

3. Verify moderator name appears

**Step 3 - Review Evidence:**
1. Check all attached evidence:
   - [ ] View messages between parties
   - [ ] Review care logs (if applicable)
   - [ ] Check payment status
   - [ ] Review ratings

2. Take notes on findings

**Step 4 - Communicate with Parties:**
1. Look for "Send Message" option
2. Click to add message
3. Message modal opens:
   - [ ] "Send to: [Select party]" dropdown
   - [ ] Message text area
   - [ ] Attachment option (if available)
   - [ ] Send button

4. Send message to complainant:
   - [ ] Type: "Thank you for filing this dispute. I'm investigating the matter..."
   - [ ] Click "Send"
   - [ ] Verify message appears in thread
   - [ ] Timestamp recorded

5. Send message to defendant:
   - [ ] Request their side of the story
   - [ ] Click "Send"
   - [ ] Verify both messages in thread

**Step 5 - Document Investigation:**
1. Look for "Investigation Notes" section
2. Add findings:
   - [ ] Summary of evidence reviewed
   - [ ] Initial assessment
   - [ ] Recommendation
   - [ ] Save notes

3. Verify notes saved

**Step 6 - Recommend Resolution:**
1. Click "Recommend Resolution" button
2. Resolution recommendation form:
   - [ ] Decision options: "Favor Complainant", "Favor Defendant", "Compromise"
   - [ ] Recommended amount (if payment-related)
   - [ ] Detailed reasoning

3. Fill in recommendation:
   - [ ] Select decision
   - [ ] Enter recommended resolution
   - [ ] Explain reasoning
   - [ ] Click "Submit Recommendation"

4. Verify:
   - [ ] Status → "Awaiting Super Admin Decision"
   - [ ] Super Admin notified
   - [ ] Your recommendation visible
   - [ ] Parties notified

**Expected Outcome:**
- ✅ Can review disputes thoroughly
- ✅ Can communicate with parties
- ✅ Can submit recommendations
- ✅ Cannot execute final resolution (Super Admin only)
- ✅ Audit trail created

**Fail Conditions:**
- ❌ Cannot view evidence
- ❌ Messages don't send
- ❌ Recommendations fail
- ❌ Status not updating

---

#### M5.3 - Dispute Resolution Tracking
**Objective:** Verify Moderator can track dispute resolution status

**Step 1 - View Resolved Disputes:**
1. Change filter to "Status: Resolved"
2. List shows disputes with final resolution
3. For each dispute:
   - [ ] Can click to view final resolution
   - [ ] See Super Admin's decision
   - [ ] See resolution details
   - [ ] Cannot modify resolution

**Step 2 - Review Moderation History:**
1. If "My Actions" page available:
   - [ ] Can see own dispute investigations
   - [ ] Count of investigations started
   - [ ] Count of recommendations made
   - [ ] Acceptance rate of recommendations

**Expected Outcome:**
- ✅ Can view dispute history
- ✅ Can see own investigations
- ✅ Read-only access to resolved disputes

**Fail Conditions:**
- ❌ Cannot view resolved disputes
- ❌ Own actions not tracked

---

### Phase 6: Content Moderation & CV Pool (25 minutes)

#### M6.1 - CV/Resume Pool Management
**Objective:** Verify Moderator can manage caregiver CV database  
**URL:** `http://localhost:3000/admin/cv-pool` or similar

**CV Pool List:**
- [ ] Shows all uploaded caregiver CVs/resumes
- [ ] Filter: By date uploaded, status, caregiver
- [ ] Can search by name/skills

**CV Management:**

**Step 1 - View CV:**
1. Click on a caregiver's CV
2. Preview shows:
   - [ ] CV/Resume document (PDF or image)
   - [ ] Can zoom/expand
   - [ ] Caregiver info
   - [ ] Upload date
   - [ ] Version number

**Step 2 - Verify CV Quality:**
1. Review CV content:
   - [ ] Contains relevant information
   - [ ] Professional formatting
   - [ ] No inappropriate content
   - [ ] Accurate spelling/grammar

**Step 3 - Approve or Flag CV:**
1. Options:
   - [ ] ✅ "Approve" - CV acceptable for marketplace
   - [ ] ⚠️ "Request Revision" - Needs updates
   - [ ] 🚫 "Reject" - Inappropriate or incomplete

2. Select appropriate action
3. If rejecting, add reason:
   - [ ] "Incomplete information"
   - [ ] "Unprofessional format"
   - [ ] "Inappropriate content"
   - [ ] Other (explain)

4. Send notification to caregiver

**Expected Outcome:**
- ✅ Can view CV content
- ✅ Can approve/reject CVs
- ✅ Can request revisions
- ✅ Caregivers notified of actions

**Fail Conditions:**
- ❌ Cannot view CV
- ❌ Action buttons disabled
- ❌ Notifications not sent

---

#### M6.2 - Content Flagging (if applicable)
**Objective:** Verify Moderator can flag inappropriate content

**Content Types to Check:**
- [ ] User profiles with inappropriate content
- [ ] Package descriptions with issues
- [ ] User reviews/feedback with problems
- [ ] Job postings with concerns

**Flag Process (if available):**
1. Find content with issue
2. Click "Flag" or "Report" button
3. Flag dialog:
   - [ ] Select category: Spam, Hate speech, Fraud, Inappropriate, Other
   - [ ] Add explanation
   - [ ] Submit

4. Verify:
   - [ ] Flag submitted
   - [ ] Item marked for review
   - [ ] Super Admin notified

**Expected Outcome:**
- ✅ Can flag problematic content
- ✅ Clear categorization options
- ✅ Escalates appropriately

**Fail Conditions:**
- ❌ Cannot flag content
- ❌ Flags not submitted

---

### Phase 7: Communication & Reporting (20 minutes)

#### M7.1 - Moderator Messaging
**Objective:** Verify Moderator can communicate with stakeholders

**Messaging Features:**
- [ ] Can message agencies
- [ ] Can message caregivers
- [ ] Can message guardians (if applicable)
- [ ] Cannot message Super Admin (one-way)

**Step 1 - Send Message to Agency:**
1. Go to an agency detail page
2. Click "Send Message" button
3. Message dialog opens:
   - [ ] Recipient selected (agency)
   - [ ] Text area for message
   - [ ] Can attach files (if supported)
   - [ ] Send button

4. Type and send message
5. Verify message appears in conversation

**Step 2 - View Message History:**
1. Check conversation with agency
2. All previous messages display:
   - [ ] Sender identified
   - [ ] Timestamp
   - [ ] Message content
   - [ ] Attachments (if any)

**Expected Outcome:**
- ✅ Can send messages
- ✅ Can view conversation history
- ✅ Messages delivered

**Fail Conditions:**
- ❌ Cannot send messages
- ❌ Messages don't appear
- ❌ History not showing

---

#### M7.2 - Moderation Analytics
**Objective:** Verify Moderator can view moderation-specific reports

**Analytics Available:**

- [ ] **My Verifications (This Month)**
  - [ ] Agencies verified: X
  - [ ] Caregivers verified: X
  - [ ] Avg. time to verify: X hours

- [ ] **My Investigations**
  - [ ] Disputes investigated: X
  - [ ] Recommendations made: X
  - [ ] Super Admin acceptance rate: X%

- [ ] **Queue Status**
  - [ ] Agencies pending: X
  - [ ] Caregivers pending: X
  - [ ] Avg. wait time: X days

- [ ] **My Activity Log**
  - [ ] Recent actions listed
  - [ ] Timestamps
  - [ ] Action type (verified, rejected, etc.)

**Expected Outcome:**
- ✅ Analytics load correctly
- ✅ Metrics accurate
- ✅ Can view personal activity

**Fail Conditions:**
- ❌ Analytics blank
- ❌ Metrics showing zeros when data exists
- ❌ Cannot access

---

### Phase 8: Role-Based Access Control (20 minutes)

#### M8.1 - Permission Boundaries
**Objective:** Verify Moderator has appropriate permissions

**Moderator Can:**
- [ ] View agencies (verified)
- [ ] View caregivers (verified)
- [ ] Verify new agencies
- [ ] Verify new caregivers
- [ ] Investigate disputes
- [ ] Manage CV pool
- [ ] Send messages
- [ ] View own activity

**Moderator Cannot:**
- [ ] Create users
- [ ] Delete users
- [ ] Edit user information
- [ ] Change commission rates
- [ ] Resolve disputes (only recommend)
- [ ] Issue refunds
- [ ] Access system settings
- [ ] Manage other moderators
- [ ] View full audit logs (only own actions)

**Verification Tests:**

**Test 1 - Try to Access User Management:**
1. Navigate to `/admin/users`
2. Verify:
   - [ ] Cannot access (403 error) OR
   - [ ] Limited read-only view only
   - [ ] No edit buttons
   - [ ] No delete buttons

**Test 2 - Try to Access Settings:**
1. Navigate to `/admin/settings`
2. Verify:
   - [ ] 403 Forbidden error OR
   - [ ] Menu item not visible

**Test 3 - Try to Resolve Dispute:**
1. Open a dispute in investigation
2. Look for "Resolve Dispute" button
3. Verify:
   - [ ] Button not visible OR
   - [ ] Button disabled with tooltip: "Super Admin only"

**Test 4 - Try to Issue Refund:**
1. Go to a payment or dispute with refund option
2. Verify:
   - [ ] Refund button not available
   - [ ] Cannot process refunds

**Expected Outcome:**
- ✅ All admin-only actions blocked
- ✅ Clear permission errors
- ✅ Cannot access restricted data

**Fail Conditions:**
- ❌ Can access restricted pages
- ❌ Can perform admin-only actions
- ❌ Vague error messages

---

### Phase 9: Error Handling & Edge Cases (15 minutes)

#### M9.1 - Session Timeout
**Objective:** Verify session timeout handling

**Steps:**
1. Login as Moderator
2. Leave idle for timeout duration
3. Try to perform action
4. Verify:
   - [ ] Redirected to login
   - [ ] Clear message displayed

---

#### M9.2 - Invalid Data Handling
**Objective:** Verify error handling for invalid inputs

**Test 1 - Reject Agency with No Reason:**
1. Try to reject agency without selecting reason
2. Verify:
   - [ ] Form validation error
   - [ ] Cannot submit without reason

**Test 2 - Recommend Resolution with Missing Fields:**
1. Try to submit dispute recommendation without filled fields
2. Verify:
   - [ ] Validation error
   - [ ] Required fields highlighted

---

#### M9.3 - Network Error Handling
**Objective:** Verify graceful handling of network issues

**Steps:**
1. Open E2E page (e.g., Verification Queue)
2. Open DevTools → Network tab
3. Check "Offline" to simulate network failure
4. Try to perform action (e.g., verify agency)
5. Verify:
   - [ ] Error message displays
   - [ ] "Retry" button available
   - [ ] Not a blank page

6. Uncheck "Offline"
7. Click "Retry"
8. Verify action completes

---

## 📊 TESTING SUMMARY

### Results Tracking

**Tester Name:** _______________  
**Test Date:** _______________  
**Environment:** [ ] Dev [ ] Staging [ ] Prod  
**Browser:** _______________  
**OS:** _______________  

### Test Status Summary

| Phase | Tests | Passed | Failed | Notes |
|-------|-------|--------|--------|-------|
| M1 - Auth & Access | 3 | __ | __ | |
| M2 - Dashboard | 2 | __ | __ | |
| M3 - Verification Queue | 4 | __ | __ | |
| M4 - Agency & Caregiver Mgmt | 2 | __ | __ | |
| M5 - Dispute Management | 3 | __ | __ | |
| M6 - Content Moderation | 2 | __ | __ | |
| M7 - Communication & Analytics | 2 | __ | __ | |
| M8 - RBAC | 1 | __ | __ | |
| M9 - Error Handling | 3 | __ | __ | |
| **TOTAL** | **22** | **__** | **__** | |

### Critical Issues Found

| Issue # | Severity | Title | Description | Steps to Reproduce |
|---------|----------|-------|-------------|-------------------|
| 1 | 🔴 | | | |
| 2 | 🟠 | | | |
| 3 | 🟡 | | | |

### Key Differences from Super Admin

- ✅ Cannot access system settings
- ✅ Cannot manage users (create/delete)
- ✅ Can verify but not change/modify agency/caregiver info
- ✅ Can recommend dispute resolution, but cannot execute
- ✅ Cannot issue refunds
- ✅ Only sees own audit logs, not system-wide
- ✅ Limited to verification and moderation workflows

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

**Next Entity to Test:** 🚀 Agency (comprehensive testing guide to follow)
