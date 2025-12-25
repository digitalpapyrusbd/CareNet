# 🏢 Manual Testing - Agency Entity (Complete Guide)

**Date Created:** December 25, 2025  
**Entity:** Agency Admin (Company)  
**Testing Scope:** Agency registration, dashboard, packages, jobs, caregivers, billing  
**Estimated Time:** 2.5-3 hours  
**Prerequisites:** Development server running, database seeded with test data  

---

## 🏢 AGENCY USER ROLE & CAPABILITIES

### Role Definition
**Agency Admin** manages healthcare agency operations on the CareNet platform.

| Property | Value |
|----------|-------|
| **Role Name** | COMPANY (Agency Admin) |
| **Authority Level** | Level 6 (Business Owner) |
| **Core Function** | Manage caregiver workforce, packages, jobs, billing |
| **Access Level** | Full agency operations access |
| **MFA Requirement** | Optional |

### Agency Admin Permissions Overview

| Category | Permissions |
|----------|-------------|
| **Agency Profile** | ✅ Create, read, update agency profile |
| **Package Management** | ✅ Create, edit, delete care packages |
| **Job Management** | ✅ View job inbox, assign caregivers, track jobs |
| **Caregiver Management** | ✅ Add to roster, search pool, view performance |
| **Guardian Inquiries** | ✅ Respond to inquiries, negotiate packages |
| **Billing & Invoicing** | ✅ View invoices, manage payments, view transactions |
| **Subscription** | ✅ View/manage subscription plan |
| **Analytics** | ✅ View agency performance analytics |
| **Messages** | ✅ Communicate with guardians, caregivers, support |

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
  - [ ] Cookies enabled

- [ ] **Test Data**
  - [ ] Agency account created in database (or will register)
  - [ ] Seed data includes caregivers, guardians, jobs

### Test Agency Account Credentials

| Credential | Value |
|-----------|-------|
| **Phone Number** | `+8801712345301` |
| **Email** | `agency@carenet.com` |
| **Password** | `Agency@123` |
| **Role** | COMPANY |
| **Agency Name** | CareFirst Healthcare |
| **KYC Status** | VERIFIED |
| **Is Active** | Yes |

**Demo Account (Alternative):**
- **Phone:** `+8801712345302`
- **Password:** `Demo@123`

---

## ✅ TEST EXECUTION PLAN

---

## Phase 1: Registration Flow (45 minutes)

### A1.1 - Start Registration
**Objective:** Verify agency can start registration process  
**URL:** `http://localhost:3000/agency/registration`

**Steps:**
1. Navigate to agency registration page
2. Observe landing page:
   - [ ] Page title shows "Register Your Agency" or similar
   - [ ] Introduction text explains the process
   - [ ] "Start Registration" or "Get Started" button visible
   - [ ] Step indicator shows 5 steps

3. Click "Get Started"
4. Verify redirect to Step 1

**Expected Outcome:**
- ✅ Registration page loads correctly
- ✅ Step indicator visible
- ✅ Navigation to Step 1 works

**Fail Conditions:**
- ❌ Page 404 error
- ❌ Missing UI elements
- ❌ Button not clickable

---

### A1.2 - Step 1: Basic Information
**Objective:** Verify agency can complete basic information form  
**URL:** `http://localhost:3000/agency/registration/step-1`

**Form Fields to Test:**

**Agency Details:**
- [ ] **Agency Name** (required)
  - Enter: "Test Healthcare Agency"
  - Validation: Min 3 characters
  
- [ ] **Tagline** (optional)
  - Enter: "Quality Care, Trusted Service"

- [ ] **Phone Number** (required)
  - Enter: "01712345678"
  - Format: Bangladesh format

- [ ] **Email** (required)
  - Enter: "test@agency.com"
  - Validation: Valid email format

- [ ] **Password** (required)
  - Enter: "Agency@123"
  - Validation: Min 8 chars, uppercase, lowercase, number

- [ ] **Confirm Password**
  - Enter: "Agency@123"
  - Validation: Must match password

**Contact Person:**
- [ ] **Primary Contact Name** (required)
  - Enter: "Mohammad Ali"

- [ ] **Primary Contact Title** (optional)
  - Enter: "Director"

**Address:**
- [ ] **Street Address** (required)
  - Enter: "123 Main Road, Dhanmondi"

- [ ] **Area** (optional)
  - Enter: "Dhanmondi"

- [ ] **City** (required)
  - Enter: "Dhaka"

- [ ] **Division** (required)
  - Select: "Dhaka"

- [ ] **Postal Code** (optional)
  - Enter: "1205"

**Additional:**
- [ ] **Website URL** (optional)
  - Enter: "https://testagency.com"

- [ ] **Established Year** (required)
  - Select: "2015"

**Validation Tests:**
1. Try submitting with empty required fields
   - [ ] Error messages appear for each field
   - [ ] Fields highlighted in red

2. Enter invalid email format
   - [ ] Error: "Invalid email format"

3. Enter mismatched passwords
   - [ ] Error: "Passwords do not match"

4. Enter short password (less than 8 chars)
   - [ ] Error: "Password must be at least 8 characters"

5. Fill all fields correctly and click "Next"
   - [ ] Form validates successfully
   - [ ] Proceeds to Step 2

**Expected Outcome:**
- ✅ All form fields render correctly
- ✅ Validation works for required fields
- ✅ Error messages display appropriately
- ✅ Can proceed to Step 2

**Fail Conditions:**
- ❌ Form fields missing
- ❌ Validation not working
- ❌ Cannot proceed to next step

---

### A1.3 - Step 2: Legal Documents
**Objective:** Verify agency can upload required documents  
**URL:** `http://localhost:3000/agency/registration/step-2`

**Documents to Upload:**

1. **Trade License** (required)
   - [ ] Upload area visible
   - [ ] Accepts PDF, JPG, PNG
   - [ ] Max size: 5MB
   - [ ] License number input
   - [ ] Issue date picker
   - [ ] Expiry date picker

2. **TIN Certificate** (required)
   - [ ] Upload area visible
   - [ ] TIN number input field

3. **Business Registration** (required)
   - [ ] Upload area visible
   - [ ] Registration number input

4. **Owner NID** (required)
   - [ ] Upload area visible
   - [ ] NID number input

5. **Bank Account Details** (required)
   - [ ] Account number field
   - [ ] Account name field
   - [ ] Bank name dropdown
   - [ ] Branch name field
   - [ ] Routing number (optional)

**Upload Tests:**
1. Click upload area
   - [ ] File browser opens

2. Select a valid PDF file
   - [ ] File uploads successfully
   - [ ] Preview/filename shown
   - [ ] Remove button appears

3. Try uploading file > 5MB
   - [ ] Error: "File too large"

4. Try uploading invalid format (.doc)
   - [ ] Error: "Invalid file format"

5. Remove uploaded file
   - [ ] File removed
   - [ ] Upload area reappears

**Expected Outcome:**
- ✅ All document upload areas functional
- ✅ File validation works
- ✅ Document details can be entered
- ✅ Can proceed to Step 3

**Fail Conditions:**
- ❌ Upload not working
- ❌ File validation fails
- ❌ Cannot proceed

---

### A1.4 - Step 3: Services & Specializations
**Objective:** Verify agency can configure services offered  
**URL:** `http://localhost:3000/agency/registration/step-3`

**Service Types Selection:**
- [ ] **Elderly Care** - Checkbox
- [ ] **Post-Surgery Care** - Checkbox
- [ ] **Pediatric Care** - Checkbox
- [ ] **Disability Care** - Checkbox
- [ ] **Palliative Care** - Checkbox
- [ ] **General Nursing** - Checkbox

Select at least 2 services:
- [ ] "Elderly Care" selected
- [ ] "Post-Surgery Care" selected

**Specializations (Multi-select):**
- [ ] Dementia Care
- [ ] Diabetes Management
- [ ] Wound Care
- [ ] Physical Therapy Assistance
- [ ] Medication Management

Select: "Dementia Care", "Diabetes Management"

**Operating Hours:**
- [ ] Radio button: "24/7 Service"
- [ ] Radio button: "Business Hours"
- [ ] Radio button: "Flexible Schedule"

Select "Business Hours" and verify:
- [ ] Weekday hours inputs appear
- [ ] Weekend hours inputs appear
- Enter: Weekdays 8:00 AM - 8:00 PM
- Enter: Weekends 9:00 AM - 5:00 PM

**Coverage Areas (Multi-select Districts):**
- [ ] Dropdown/multi-select available
- Select: "Dhaka", "Gulshan", "Uttara", "Dhanmondi"

**Languages:**
- [ ] Multi-select or input
- Select: "Bengali", "English"

**Emergency Support:**
- [ ] Toggle/checkbox for 24/7 emergency availability
- [ ] Enable emergency support

**Expected Outcome:**
- ✅ All service options selectable
- ✅ Multi-select works correctly
- ✅ Operating hours configurable
- ✅ Can proceed to Step 4

**Fail Conditions:**
- ❌ Options not rendering
- ❌ Multi-select broken
- ❌ Cannot save selections

---

### A1.5 - Step 4: Billing Setup
**Objective:** Verify agency can configure billing preferences  
**URL:** `http://localhost:3000/agency/registration/step-4`

**Payment Methods:**

1. **bKash**
   - [ ] Toggle to enable
   - [ ] Account number field appears
   - Enter: "01712345678"

2. **Nagad**
   - [ ] Toggle to enable
   - [ ] Account number field appears
   - Enter: "01812345678"

3. **Bank Transfer**
   - [ ] Toggle to enable
   - [ ] Bank details form appears
   - Enter bank account details

**Invoice Settings:**
- [ ] **Invoice Prefix** - e.g., "THA" (Test Healthcare Agency)
- [ ] **Starting Number** - e.g., "1001"
- [ ] **Tax ID** (optional)

**Commission Agreement:**
- [ ] Platform commission terms displayed
- [ ] Checkbox to accept terms
- [ ] Check the acceptance box

**Expected Outcome:**
- ✅ Payment method toggles work
- ✅ Account details saveable
- ✅ Invoice settings configurable
- ✅ Can proceed to Step 5

**Fail Conditions:**
- ❌ Payment toggles not working
- ❌ Validation errors
- ❌ Cannot accept terms

---

### A1.6 - Step 5: Subscription Selection
**Objective:** Verify agency can select subscription plan  
**URL:** `http://localhost:3000/agency/registration/step-5`

**Available Plans:**

1. **Basic Plan**
   - [ ] Price displayed (e.g., ৳999/month)
   - [ ] Features listed
   - [ ] Select button

2. **Standard Plan**
   - [ ] Price displayed (e.g., ৳2,499/month)
   - [ ] Features listed
   - [ ] Select button
   - [ ] "Most Popular" badge (if applicable)

3. **Premium Plan**
   - [ ] Price displayed (e.g., ৳4,999/month)
   - [ ] Features listed
   - [ ] Select button

**Plan Features to Verify:**
- [ ] Caregiver limit
- [ ] Job limit per month
- [ ] Transaction commission rate
- [ ] Support level
- [ ] Analytics access

**Selection Test:**
1. Click on "Standard Plan"
   - [ ] Plan card highlights/selected state
   - [ ] Other plans de-selected

2. Click "Complete Registration" or "Submit"
   - [ ] Loading state appears
   - [ ] Success message displayed
   - [ ] Redirects to pending verification page

**Expected Outcome:**
- ✅ All plans displayed correctly
- ✅ Can select a plan
- ✅ Registration completes successfully
- ✅ Redirects to pending verification

**Fail Conditions:**
- ❌ Plans not loading
- ❌ Selection not working
- ❌ Submission fails

---

### A1.7 - Pending Verification
**Objective:** Verify pending verification page displays correctly  
**URL:** `http://localhost:3000/agency/pending-verification`

**Page Elements:**
- [ ] Status message: "Your application is under review"
- [ ] Submitted documents summary
- [ ] Expected review time (24-48 hours)
- [ ] Contact support option
- [ ] "Check Status" button

**Status Checks:**
1. Refresh the page
   - [ ] Status persists
   - [ ] Still shows pending

2. Click "Check Status"
   - [ ] API call made
   - [ ] Status updated (or remains pending)

**Expected Outcome:**
- ✅ Page displays correctly
- ✅ Status information shown
- ✅ Can check status

**Fail Conditions:**
- ❌ Page not loading
- ❌ Status unclear
- ❌ No contact option

---

## Phase 2: Authentication (20 minutes)

### A2.1 - Agency Login
**Objective:** Verify verified agency can login  
**URL:** `http://localhost:3000/agency/login`

**Steps:**
1. Navigate to agency login page
2. Observe login form:
   - [ ] Phone number field
   - [ ] Password field
   - [ ] "Remember Me" checkbox
   - [ ] "Forgot Password" link
   - [ ] Login button

3. Enter credentials:
   - Phone: `+8801712345301`
   - Password: `Agency@123`

4. Click "Login"

**Expected Outcome:**
- ✅ Login succeeds
- ✅ Redirects to `/agency/dashboard`
- ✅ Session token stored

**Fail Conditions:**
- ❌ Login fails with correct credentials
- ❌ Wrong redirect
- ❌ No session created

---

### A2.2 - Dashboard Access
**Objective:** Verify agency dashboard loads correctly  
**URL:** `http://localhost:3000/agency/dashboard`

**Dashboard Elements:**
- [ ] Welcome message with agency name
- [ ] Navigation menu visible
- [ ] Quick stats cards
- [ ] Recent activity feed
- [ ] Quick action buttons

**Stats Cards to Verify:**
- [ ] **Total Caregivers** - Count on roster
- [ ] **Active Jobs** - Current active jobs
- [ ] **Pending Inquiries** - Guardian inquiries
- [ ] **Monthly Revenue** - Earnings

**Quick Actions:**
- [ ] Create Package
- [ ] View Jobs
- [ ] Search Caregivers
- [ ] View Messages

**Expected Outcome:**
- ✅ Dashboard loads completely
- ✅ All cards render with data
- ✅ Navigation functional

**Fail Conditions:**
- ❌ 404 or blank page
- ❌ Data not loading
- ❌ Navigation broken

---

## Phase 3: Package Management (40 minutes)

### A3.1 - Package List View
**Objective:** Verify package listing page works  
**URL:** `http://localhost:3000/agency/packages`

**Page Elements:**
- [ ] Page title: "My Packages"
- [ ] "Create New Package" button
- [ ] Package cards/list
- [ ] Search/filter options
- [ ] Status filter (Active/Inactive/Draft)

**Package Card Information:**
- [ ] Package name
- [ ] Price range
- [ ] Service type
- [ ] Duration
- [ ] Status badge
- [ ] Edit/View buttons

**Test Actions:**
1. Verify list loads
   - [ ] Packages displayed or "No packages" message

2. Click filter by status
   - [ ] Filter applies correctly

3. Search by package name
   - [ ] Search results update

**Expected Outcome:**
- ✅ Package list displays
- ✅ Filters work correctly
- ✅ Can navigate to details

**Fail Conditions:**
- ❌ List not loading
- ❌ Filters broken
- ❌ No create button

---

### A3.2 - Create New Package
**Objective:** Verify agency can create a new care package  
**URL:** `http://localhost:3000/agency/packages/new`

**Package Basic Info:**
- [ ] **Package Name** (required)
  - Enter: "Premium Elderly Care"

- [ ] **Description** (required)
  - Enter: "Comprehensive elderly care package with 24/7 support"

- [ ] **Service Type** (required)
  - Select: "Elderly Care"

- [ ] **Care Level**
  - Select: "Advanced"

**Pricing Configuration:**
- [ ] **Base Price** (required)
  - Enter: ৳15,000

- [ ] **Pricing Type**
  - Select: "Per Day" / "Per Week" / "Per Month"

- [ ] **Minimum Duration**
  - Enter: 7 days

- [ ] **Maximum Duration** (optional)
  - Enter: 90 days

**Services Included:**
- [ ] Multi-select checkboxes for services
- Select:
  - [ ] Vital signs monitoring
  - [ ] Medication management
  - [ ] Personal hygiene assistance
  - [ ] Meal preparation
  - [ ] Companionship

**Requirements:**
- [ ] **Required Certifications**
  - Select: "Nursing Certificate", "First Aid"

- [ ] **Experience Level**
  - Select: "3+ years"

- [ ] **Languages**
  - Select: "Bengali", "English"

**Additional Options:**
- [ ] **Negotiable Price** - Toggle
- [ ] **Customizable Services** - Toggle
- [ ] **Emergency Add-on** - Toggle with price

**Submit Package:**
1. Fill all required fields
2. Click "Create Package" or "Publish"

**Expected Outcome:**
- ✅ Form validation works
- ✅ Package created successfully
- ✅ Redirects to package list
- ✅ New package appears in list

**Fail Conditions:**
- ❌ Form validation errors
- ❌ Submission fails
- ❌ Package not created

---

### A3.3 - Edit Package
**Objective:** Verify agency can edit existing package  
**URL:** `http://localhost:3000/agency/packages/[id]/edit`

**Steps:**
1. From package list, click "Edit" on a package
2. Edit form loads with existing data:
   - [ ] All fields pre-filled
   - [ ] Can modify any field

3. Change package name:
   - From: "Premium Elderly Care"
   - To: "Premium Elderly Care - Updated"

4. Change price:
   - From: ৳15,000
   - To: ৳16,000

5. Click "Save Changes"

**Expected Outcome:**
- ✅ Edit form loads correctly
- ✅ Changes save successfully
- ✅ Updated data reflects in list

**Fail Conditions:**
- ❌ Form not loading
- ❌ Data not pre-filled
- ❌ Save fails

---

### A3.4 - Package Status Management
**Objective:** Verify package status can be changed  

**Status Options:**
- Active (visible to guardians)
- Inactive (hidden from guardians)
- Draft (not published)

**Test Actions:**
1. Open a package detail page
2. Find status toggle/dropdown
3. Change status from "Active" to "Inactive"
   - [ ] Confirmation dialog appears
   - [ ] Status updates
   - [ ] Package hidden from public search

4. Change back to "Active"
   - [ ] Status updates
   - [ ] Package visible again

**Expected Outcome:**
- ✅ Status changes correctly
- ✅ Confirmation required for status change
- ✅ Changes persist

**Fail Conditions:**
- ❌ Status toggle not working
- ❌ No confirmation
- ❌ Changes not persisting

---

## Phase 4: Job Management (35 minutes)

### A4.1 - Job Inbox
**Objective:** Verify agency can view incoming job requests  
**URL:** `http://localhost:3000/agency/jobs`

**Page Elements:**
- [ ] Page title: "Job Inbox"
- [ ] Job list/cards
- [ ] Status tabs: New, In Progress, Completed, Cancelled
- [ ] Search/filter options
- [ ] Sort by date/status

**Job Card Information:**
- [ ] Job ID
- [ ] Guardian name
- [ ] Patient name
- [ ] Package type
- [ ] Start date
- [ ] Duration
- [ ] Status badge
- [ ] View details button

**Test Actions:**
1. Click "New" tab
   - [ ] Shows new job requests

2. Click "In Progress" tab
   - [ ] Shows active jobs

3. Search by guardian name
   - [ ] Results filter correctly

**Expected Outcome:**
- ✅ Job list loads
- ✅ Tabs work correctly
- ✅ Search/filter functional

**Fail Conditions:**
- ❌ Jobs not loading
- ❌ Tabs not working
- ❌ Search broken

---

### A4.2 - Job Details
**Objective:** Verify job detail page shows complete information  
**URL:** `http://localhost:3000/agency/jobs/[id]`

**Job Information:**
- [ ] Job ID and status
- [ ] Package details
- [ ] Guardian information
- [ ] Patient information
- [ ] Care requirements
- [ ] Schedule (start/end dates)
- [ ] Special instructions
- [ ] Price/payment info

**Patient Details:**
- [ ] Name and age
- [ ] Medical conditions
- [ ] Medications
- [ ] Emergency contacts
- [ ] Address

**Actions Available:**
- [ ] Assign Caregiver button
- [ ] Message Guardian button
- [ ] View Care Logs (if active)
- [ ] Cancel Job (with reason)

**Expected Outcome:**
- ✅ All details display correctly
- ✅ Actions buttons functional
- ✅ Can navigate to related pages

**Fail Conditions:**
- ❌ Details missing
- ❌ Buttons not working
- ❌ Error loading data

---

### A4.3 - Assign Caregiver to Job
**Objective:** Verify agency can assign caregiver to a job  
**URL:** `http://localhost:3000/agency/jobs/[id]/assign`

**Assignment Flow:**

1. Click "Assign Caregiver" from job details
2. Assignment page loads:
   - [ ] Job summary visible
   - [ ] Available caregivers list
   - [ ] Filter by: Availability, Skills, Rating, Distance

3. Filter caregivers:
   - [ ] Select required skills
   - [ ] Select date range
   - [ ] Apply filters

4. Caregiver cards show:
   - [ ] Name and photo
   - [ ] Rating
   - [ ] Relevant skills
   - [ ] Availability status
   - [ ] Distance from patient
   - [ ] "Assign" button

5. Click "Assign" on a caregiver:
   - [ ] Confirmation modal appears
   - [ ] Shows caregiver details
   - [ ] Confirm assignment

6. After confirmation:
   - [ ] Success message
   - [ ] Job status updates to "Assigned"
   - [ ] Caregiver notified
   - [ ] Guardian notified

**Expected Outcome:**
- ✅ Assignment flow works
- ✅ Filters functional
- ✅ Caregiver assigned successfully
- ✅ Notifications sent

**Fail Conditions:**
- ❌ Caregiver list not loading
- ❌ Filters not working
- ❌ Assignment fails

---

### A4.4 - Job Tracking
**Objective:** Verify agency can track active jobs  

**For Active Jobs:**
1. View job with "In Progress" status
2. Verify tracking information:
   - [ ] Caregiver check-in time
   - [ ] Current status
   - [ ] Today's care logs
   - [ ] Upcoming schedule

3. View care logs:
   - [ ] Vitals recorded
   - [ ] Medications given
   - [ ] Activities completed
   - [ ] Incidents (if any)

**Expected Outcome:**
- ✅ Job tracking visible
- ✅ Care logs accessible
- ✅ Real-time status updates

**Fail Conditions:**
- ❌ Tracking not updating
- ❌ Care logs missing
- ❌ Status incorrect

---

## Phase 5: Caregiver Management (30 minutes)

### A5.1 - Agency Roster
**Objective:** Verify agency can manage their caregiver roster  
**URL:** `http://localhost:3000/agency/caregivers`

**Page Elements:**
- [ ] Page title: "Caregiver Roster"
- [ ] "Add Caregiver" button
- [ ] "Search Pool" button
- [ ] Roster list/grid

**Caregiver Card Info:**
- [ ] Photo and name
- [ ] Rating
- [ ] Status (Available/On Assignment/Unavailable)
- [ ] Skills/certifications
- [ ] Experience years
- [ ] View Profile button

**Filters:**
- [ ] By status
- [ ] By skill/certification
- [ ] By rating

**Expected Outcome:**
- ✅ Roster loads correctly
- ✅ All caregiver info visible
- ✅ Filters work

**Fail Conditions:**
- ❌ Roster not loading
- ❌ Data missing
- ❌ Filters broken

---

### A5.2 - Search Caregiver Pool
**Objective:** Verify agency can search platform caregiver pool  
**URL:** `http://localhost:3000/agency/caregivers/pool`

**Search Criteria:**
- [ ] **Skills/Certifications** - Multi-select
- [ ] **Experience** - Minimum years
- [ ] **Languages** - Multi-select
- [ ] **Availability** - Date range
- [ ] **Location** - Area/district
- [ ] **Rating** - Minimum rating

**Search Results:**
- [ ] Caregiver cards display
- [ ] Relevance scoring
- [ ] "View Profile" button
- [ ] "Request to Join" or "Invite" button

**Test Actions:**
1. Set search criteria:
   - Skills: "Elderly Care"
   - Experience: 2+ years
   - Languages: "Bengali"

2. Click "Search"
   - [ ] Results load
   - [ ] Matching caregivers shown

3. Click "View Profile" on a result
   - [ ] Profile page opens
   - [ ] Full details visible

4. Click "Invite" or "Request"
   - [ ] Invitation sent
   - [ ] Status updated

**Expected Outcome:**
- ✅ Search functional
- ✅ Results accurate
- ✅ Can invite caregivers

**Fail Conditions:**
- ❌ Search not working
- ❌ No results when expected
- ❌ Invite fails

---

### A5.3 - Caregiver Profile View
**Objective:** Verify agency can view caregiver profiles  
**URL:** `http://localhost:3000/agency/caregivers/[id]`

**Profile Sections:**
- [ ] **Basic Info** - Name, photo, contact
- [ ] **Experience** - Years, previous employers
- [ ] **Education** - Qualifications
- [ ] **Certifications** - Verified certificates
- [ ] **Skills** - Care capabilities
- [ ] **Languages** - Spoken languages
- [ ] **Availability** - Schedule
- [ ] **Ratings & Reviews** - From guardians
- [ ] **Performance Metrics** - If on roster

**Expected Outcome:**
- ✅ All sections display
- ✅ Data complete
- ✅ Certifications verified status shown

**Fail Conditions:**
- ❌ Profile incomplete
- ❌ Sections missing
- ❌ Data not loading

---

## Phase 6: Inquiries & Communication (20 minutes)

### A6.1 - Guardian Inquiries
**Objective:** Verify agency can view and respond to inquiries  
**URL:** `http://localhost:3000/agency/inquiries`

**Inquiry List:**
- [ ] List of guardian inquiries
- [ ] Filter by status: New, Responded, Closed
- [ ] Sort by date

**Inquiry Card:**
- [ ] Guardian name
- [ ] Package interested in
- [ ] Date received
- [ ] Status badge
- [ ] Preview of message

**Test Actions:**
1. Click on an inquiry
2. Detail view shows:
   - [ ] Full guardian message
   - [ ] Package details
   - [ ] Patient requirements (if shared)
   - [ ] Response area

3. Type response:
   - Enter: "Thank you for your inquiry..."

4. Click "Send Response"
   - [ ] Response sent
   - [ ] Status updates

**Expected Outcome:**
- ✅ Inquiries list loads
- ✅ Can view details
- ✅ Can respond

**Fail Conditions:**
- ❌ List not loading
- ❌ Cannot respond
- ❌ Response not sent

---

### A6.2 - Messages
**Objective:** Verify agency messaging system works  
**URL:** `http://localhost:3000/agency/messages`

**Message Features:**
- [ ] Conversation list
- [ ] Unread indicators
- [ ] Search conversations
- [ ] New message button

**Conversation View:**
- [ ] Message history
- [ ] Sender identification
- [ ] Timestamps
- [ ] Message input
- [ ] Send button
- [ ] Attachment option

**Test Actions:**
1. Open a conversation
2. Read messages
3. Send a new message:
   - Type: "Test message"
   - Click send

4. Verify message appears in thread

**Expected Outcome:**
- ✅ Conversations load
- ✅ Can send/receive messages
- ✅ Real-time updates

**Fail Conditions:**
- ❌ Messages not loading
- ❌ Send fails
- ❌ No real-time updates

---

## Phase 7: Billing & Subscription (20 minutes)

### A7.1 - Billing Dashboard
**Objective:** Verify billing information displays correctly  
**URL:** `http://localhost:3000/agency/billing`

**Billing Overview:**
- [ ] Current balance
- [ ] Pending payouts
- [ ] Total earnings (this month)
- [ ] Platform fees deducted

**Invoice List:**
- [ ] List of all invoices
- [ ] Filter by date range
- [ ] Filter by status (Paid/Pending)
- [ ] Download button

**Invoice Details:**
- [ ] Invoice number
- [ ] Date
- [ ] Amount
- [ ] Status
- [ ] Download PDF

**Test Actions:**
1. View billing summary
2. Click on an invoice
3. Download invoice PDF
   - [ ] PDF downloads correctly
   - [ ] Contains correct info

**Expected Outcome:**
- ✅ Billing data accurate
- ✅ Invoices downloadable
- ✅ All transactions visible

**Fail Conditions:**
- ❌ Data not loading
- ❌ Download fails
- ❌ Incorrect amounts

---

### A7.2 - Subscription Management
**Objective:** Verify subscription page works  
**URL:** `http://localhost:3000/agency/subscription/active`

**Subscription Info:**
- [ ] Current plan name
- [ ] Plan features
- [ ] Billing cycle
- [ ] Next billing date
- [ ] Auto-renewal status
- [ ] Upgrade/Downgrade options

**Actions:**
- [ ] View plan details
- [ ] Upgrade plan button
- [ ] Cancel subscription (with confirmation)

**Test Actions:**
1. View current subscription
2. Click "View Plans" or "Upgrade"
3. See available plans
4. Verify upgrade flow (without completing)

**Expected Outcome:**
- ✅ Subscription info accurate
- ✅ Can view other plans
- ✅ Upgrade flow accessible

**Fail Conditions:**
- ❌ Subscription not showing
- ❌ Cannot view plans
- ❌ Actions broken

---

## Phase 8: Analytics (15 minutes)

### A8.1 - Agency Analytics
**Objective:** Verify agency analytics dashboard  
**URL:** `http://localhost:3000/agency/analytics`

**Analytics Sections:**

**Revenue Metrics:**
- [ ] Total revenue chart
- [ ] Monthly comparison
- [ ] Revenue by package type
- [ ] Growth percentage

**Job Metrics:**
- [ ] Total jobs completed
- [ ] Job completion rate
- [ ] Average job duration
- [ ] Jobs by service type

**Caregiver Metrics:**
- [ ] Average caregiver rating
- [ ] Top performers
- [ ] Availability rate

**Guardian Metrics:**
- [ ] New inquiries
- [ ] Conversion rate
- [ ] Repeat customers

**Date Range Filter:**
- [ ] Last 7 days
- [ ] Last 30 days
- [ ] Last 90 days
- [ ] Custom range

**Expected Outcome:**
- ✅ All charts render
- ✅ Data accurate
- ✅ Filters work

**Fail Conditions:**
- ❌ Charts not loading
- ❌ Data incorrect
- ❌ Filters broken

---

## Phase 9: Edge Cases & Error Handling (15 minutes)

### A9.1 - Session Timeout
**Objective:** Verify session timeout handling

**Steps:**
1. Login to agency account
2. Wait for session timeout (or manually clear token)
3. Try to access a protected page

**Expected Outcome:**
- ✅ Redirects to login
- ✅ Session expired message
- ✅ Can re-login

---

### A9.2 - Account Locked
**Objective:** Verify locked account handling  
**URL:** `http://localhost:3000/agency/account-locked`

**Scenario:** Agency with payment issues

**Page Should Show:**
- [ ] Account locked message
- [ ] Reason for lock
- [ ] Payment due amount
- [ ] Pay now button
- [ ] Contact support link

---

### A9.3 - Network Error Handling

**Test Actions:**
1. Disconnect network while on dashboard
2. Try to perform an action

**Expected Outcome:**
- ✅ Error message displayed
- ✅ Retry option available
- ✅ Data doesn't corrupt

---

## 📊 TEST SUMMARY

### Quick Reference - URLs

| Page | URL |
|------|-----|
| Registration | `/agency/registration` |
| Login | `/agency/login` |
| Dashboard | `/agency/dashboard` |
| Packages | `/agency/packages` |
| New Package | `/agency/packages/new` |
| Jobs | `/agency/jobs` |
| Caregivers | `/agency/caregivers` |
| Pool Search | `/agency/caregivers/pool` |
| Inquiries | `/agency/inquiries` |
| Messages | `/agency/messages` |
| Billing | `/agency/billing` |
| Subscription | `/agency/subscription/active` |
| Analytics | `/agency/analytics` |

### Test Counts

| Phase | Test Cases | Est. Time |
|-------|------------|-----------|
| Registration | 7 | 45 min |
| Authentication | 2 | 20 min |
| Package Management | 4 | 40 min |
| Job Management | 4 | 35 min |
| Caregiver Management | 3 | 30 min |
| Communication | 2 | 20 min |
| Billing | 2 | 20 min |
| Analytics | 1 | 15 min |
| Edge Cases | 3 | 15 min |
| **Total** | **28** | **~4 hours** |

---

## ✅ SIGN-OFF

| Tester | Date | Total Passed | Total Failed | Notes |
|--------|------|--------------|--------------|-------|
| _______ | _______ | ___/28 | ___/28 | _______ |

