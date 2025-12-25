# 👨‍👩‍👧 Manual Testing - Guardian Entity (Complete Guide)

**Date Created:** December 25, 2025  
**Entity:** Guardian (Family Member)  
**Testing Scope:** Registration, patient management, package purchase, job tracking  
**Estimated Time:** 2-2.5 hours  
**Prerequisites:** Development server running, database seeded with test data  

---

## 👨‍👩‍👧 GUARDIAN USER ROLE & CAPABILITIES

### Role Definition
**Guardian** is a family member who seeks care services for their loved ones (patients).

| Property | Value |
|----------|-------|
| **Role Name** | GUARDIAN |
| **Authority Level** | Level 3 (Consumer) |
| **Core Function** | Find care, manage patients, monitor care delivery |
| **Access Level** | Personal account, patients, purchased services |
| **MFA Requirement** | Optional |

### Guardian Permissions Overview

| Category | Permissions |
|----------|-------------|
| **Profile** | ✅ Create, read, update profile |
| **Patients** | ✅ Add, edit, manage patient profiles |
| **Packages** | ✅ Browse, search, purchase packages |
| **Negotiation** | ✅ Negotiate package terms with agencies |
| **Jobs** | ✅ View active jobs, track progress |
| **Care Logs** | ✅ View care logs for their patients |
| **Billing** | ✅ View invoices, make payments |
| **Messages** | ✅ Communicate with agencies, caregivers |
| **Feedback** | ✅ Rate and review caregivers |

---

## 🚀 SETUP & PREREQUISITES

### Test Environment Checklist

- [ ] **Development Server Running**
  - [ ] Next.js app: `npm run dev` (port 3000)
  - [ ] Backend/API available
  - [ ] Database connected and seeded

- [ ] **Browser & Tools**
  - [ ] Modern browser
  - [ ] DevTools available
  - [ ] LocalStorage accessible

- [ ] **Test Data**
  - [ ] Guardian account (or will register)
  - [ ] Agencies with packages available
  - [ ] Caregivers verified

### Test Guardian Account Credentials

| Credential | Value |
|-----------|-------|
| **Phone Number** | `+8801712345501` |
| **Email** | `guardian@carenet.com` |
| **Password** | `Guardian@123` |
| **Role** | GUARDIAN |
| **Name** | Fahima Rahman |
| **Is Active** | Yes |

---

## ✅ TEST EXECUTION PLAN

---

## Phase 1: Registration Flow (25 minutes)

### G1.1 - Step 1: Account Creation
**Objective:** Verify guardian registration start  
**URL:** `http://localhost:3000/guardian/registration/step-1`

**Page Elements:**
- [ ] Progress indicator (Step 1 of 3)
- [ ] Title: "Create Account"
- [ ] Form fields

**Form Fields:**
- [ ] **Phone Number** (required)
  - Enter: "01712345678"

- [ ] **Email** (optional)
  - Enter: "test@guardian.com"

- [ ] **Password** (required)
  - Enter: "Guardian@123"

- [ ] **Confirm Password** (required)
  - Enter: "Guardian@123"

**Validation Tests:**
1. Mismatched passwords
   - [ ] Error: "Passwords do not match"

2. Weak password
   - [ ] Error: Password requirements

3. Invalid phone format
   - [ ] Error: "Invalid phone number"

**Navigation:**
- [ ] "Continue" button enabled when valid
- [ ] Terms agreement text visible

**Expected Outcome:**
- ✅ Form validates correctly
- ✅ Proceeds to Step 2

---

### G1.2 - Step 2: Phone Verification
**Objective:** Verify OTP entry  
**URL:** `http://localhost:3000/guardian/registration/step-2`

**Page Elements:**
- [ ] Progress indicator (Step 2 of 3)
- [ ] 6-digit code input
- [ ] Resend timer
- [ ] Phone number display (masked)

**Test Actions:**
1. Enter verification code
2. Click "Continue"

**Expected Outcome:**
- ✅ Code verified
- ✅ Proceeds to Step 3

---

### G1.3 - Step 3: Profile Details
**Objective:** Verify profile completion  
**URL:** `http://localhost:3000/guardian/registration/step-3`

**Form Fields:**
- [ ] **Full Name** (required)
  - Enter: "Fahima Rahman"

- [ ] **Relationship to Patient** (required)
  - Enter: "Daughter" or select from dropdown

- [ ] **Address** (required)
  - Enter: "House 123, Road 5, Gulshan, Dhaka"

- [ ] **Preferred Language**
  - Select: "Bengali" or "English"

**Submit:**
1. Fill all required fields
2. Click "Complete Registration"
3. Verify:
   - [ ] Success message
   - [ ] Redirects to dashboard

**Expected Outcome:**
- ✅ Registration complete
- ✅ Dashboard accessible

---

## Phase 2: Authentication (15 minutes)

### G2.1 - Guardian Login
**Objective:** Verify guardian can login  
**URL:** `http://localhost:3000/guardian/login`

**Steps:**
1. Navigate to guardian login
2. Enter credentials:
   - Phone: `+8801712345501`
   - Password: `Guardian@123`
3. Click "Login"

**Expected Outcome:**
- ✅ Login succeeds
- ✅ Redirects to dashboard

---

### G2.2 - Guardian Dashboard
**Objective:** Verify dashboard displays correctly  
**URL:** `http://localhost:3000/guardian/dashboard`

**Dashboard Elements:**

**Header:**
- [ ] Greeting with name: "Hello, Fahima"
- [ ] Welcome message
- [ ] Notification bell with count

**Quick Actions (Grid):**
- [ ] Add New Patient
- [ ] Browse Packages
- [ ] View Messages
- [ ] Payment History

**Patients Section:**
- [ ] Patient cards or "No patients yet" message
- [ ] Each card shows:
  - Patient name
  - Age
  - Condition
  - Care status
  - Caregiver assigned
  - Next visit time

**Recent Activity:**
- [ ] Recent care logs
- [ ] Recent messages
- [ ] Payment reminders

**Expected Outcome:**
- ✅ All sections render
- ✅ Patient info displays
- ✅ Quick actions work

---

## Phase 3: Patient Management (30 minutes)

### G3.1 - Patient List
**Objective:** Verify patient listing  
**URL:** `http://localhost:3000/guardian/patients`

**Page Elements:**
- [ ] Page title: "My Patients"
- [ ] "Add New Patient" button
- [ ] Patient list/cards

**Patient Card Info:**
- [ ] Photo/avatar
- [ ] Name
- [ ] Age
- [ ] Medical condition summary
- [ ] Current care status
- [ ] View details button

**Expected Outcome:**
- ✅ Patient list loads
- ✅ Can navigate to details

---

### G3.2 - Add New Patient
**Objective:** Verify patient registration  
**URL:** `http://localhost:3000/guardian/patients/new`

**Patient Form:**

**Basic Information:**
- [ ] **Full Name** (required)
  - Enter: "Anwar Hossain"

- [ ] **Date of Birth** (required)
  - Enter: "1950-03-15"

- [ ] **Gender** (required)
  - Select: "Male"

- [ ] **Blood Type**
  - Select: "O+"

- [ ] **Profile Photo** (optional)
  - Upload photo

**Contact Information:**
- [ ] **Address** (required)
  - Enter: "House 45, Mohammadpur, Dhaka"

- [ ] **Phone** (optional)
  - Enter patient's phone if any

**Medical Information:**
- [ ] **Primary Condition** (required)
  - Enter: "Elderly Care - Post Surgery"

- [ ] **Medical Conditions** (multi-select/tags)
  - Add: "Diabetes", "Hypertension"

- [ ] **Allergies**
  - Enter: "Penicillin"

- [ ] **Current Medications** (list)
  - Add: "Metformin 500mg - twice daily"
  - Add: "Losartan 50mg - once daily"

**Care Requirements:**
- [ ] **Care Level** (required)
  - Select: "Full-time" / "Part-time" / "Overnight"

- [ ] **Mobility Status**
  - Select: "Limited mobility - needs assistance"

- [ ] **Special Requirements** (textarea)
  - Enter: "Requires help with bathing and dressing"

**Emergency Contact:**
- [ ] **Name** (required)
  - Enter: "Karim Hossain"

- [ ] **Relationship**
  - Enter: "Son"

- [ ] **Phone** (required)
  - Enter: "01812345678"

**Submit:**
1. Fill all required fields
2. Click "Add Patient"
3. Verify:
   - [ ] Success message
   - [ ] Patient appears in list

**Expected Outcome:**
- ✅ Patient created
- ✅ All data saved

---

### G3.3 - View Patient Details
**Objective:** Verify patient detail view  
**URL:** `http://localhost:3000/guardian/patients/[id]`

**Detail Sections:**
- [ ] Basic information card
- [ ] Medical history
- [ ] Current medications
- [ ] Allergies
- [ ] Emergency contacts
- [ ] Care requirements
- [ ] Active care service (if any)
- [ ] Recent care logs
- [ ] "Edit" button

**Expected Outcome:**
- ✅ All details display
- ✅ Can navigate to edit

---

### G3.4 - Edit Patient
**Objective:** Verify patient editing  
**URL:** `http://localhost:3000/guardian/patients/[id]/edit`

**Test Actions:**
1. Click "Edit" on patient
2. Update a field (e.g., add new medication)
3. Save changes
4. Verify changes persist

**Expected Outcome:**
- ✅ Edit form loads with data
- ✅ Changes save successfully

---

### G3.5 - Health Records
**Objective:** Verify health records access  
**URL:** `http://localhost:3000/guardian/patients/[id]/health-records`

**Health Records:**
- [ ] Prescription uploads
- [ ] Lab reports
- [ ] X-rays/imaging
- [ ] Doctor notes
- [ ] Upload new record option

**Test Actions:**
1. View existing records
2. Upload a new prescription PDF
3. Verify upload successful

**Expected Outcome:**
- ✅ Records accessible
- ✅ Can upload new records

---

## Phase 4: Package Browsing & Search (25 minutes)

### G4.1 - Browse Packages
**Objective:** Verify package listing  
**URL:** `http://localhost:3000/guardian/packages`

**Page Elements:**
- [ ] Page title: "Care Packages"
- [ ] Search bar
- [ ] Filter options
- [ ] Package grid/list

**Filters:**
- [ ] Service type (Elderly, Post-Surgery, etc.)
- [ ] Price range
- [ ] Duration
- [ ] Location/area
- [ ] Rating

**Package Card:**
- [ ] Agency name/logo
- [ ] Package name
- [ ] Price (range if negotiable)
- [ ] Duration
- [ ] Key features (3-4 bullet points)
- [ ] Rating
- [ ] "View Details" button

**Test Actions:**
1. View all packages
2. Apply filter: "Elderly Care"
3. Set price range: ৳10,000 - ৳20,000
4. Verify results update

**Expected Outcome:**
- ✅ Packages display
- ✅ Filters work correctly

---

### G4.2 - Advanced Filters
**Objective:** Verify advanced filter options  
**URL:** `http://localhost:3000/guardian/packages/filters`

**Filter Options:**
- [ ] Multiple service types
- [ ] Specific specializations
- [ ] Agency rating minimum
- [ ] 24/7 availability
- [ ] Emergency support
- [ ] Language requirements
- [ ] Distance/location

**Expected Outcome:**
- ✅ All filters available
- ✅ Results accurate

---

### G4.3 - Package Details
**Objective:** Verify package detail page  
**URL:** `http://localhost:3000/guardian/packages/[id]`

**Detail Sections:**

**Agency Info:**
- [ ] Agency name and logo
- [ ] Rating and review count
- [ ] Years in business
- [ ] Verified badge

**Package Info:**
- [ ] Package name
- [ ] Description
- [ ] Price (or starting price)
- [ ] Duration options
- [ ] Services included (full list)
- [ ] Caregiver requirements
- [ ] Terms and conditions

**Reviews:**
- [ ] Recent reviews from other guardians
- [ ] Rating breakdown

**Actions:**
- [ ] "Purchase Now" button
- [ ] "Negotiate Price" button (if negotiable)
- [ ] "Ask Question" button
- [ ] "Save for Later" button

**Expected Outcome:**
- ✅ All details visible
- ✅ Action buttons work

---

## Phase 5: Package Negotiation (20 minutes)

### G5.1 - Start Negotiation
**Objective:** Verify negotiation initiation  
**URL:** `http://localhost:3000/guardian/packages/[id]/negotiate`

**Negotiation Form:**
- [ ] Select patient (from your patients)
- [ ] Select duration
- [ ] Propose price (if negotiable)
- [ ] Special requests textarea
- [ ] Preferred start date

**Test Actions:**
1. Select patient: "Anwar Hossain"
2. Select duration: "30 days"
3. Propose price: ৳14,000 (from ৳15,000)
4. Add request: "Need caregiver who speaks English"
5. Submit negotiation request

**Expected Outcome:**
- ✅ Negotiation submitted
- ✅ Status shows "Pending Agency Response"

---

### G5.2 - Negotiation Communication
**Objective:** Verify negotiation chat/messaging

**Negotiation Thread:**
- [ ] Initial proposal visible
- [ ] Agency responses
- [ ] Counter-offer handling
- [ ] Accept/Decline buttons

**Test Actions:**
1. View negotiation thread
2. Read agency counter-offer
3. Accept or make new counter

**Expected Outcome:**
- ✅ Communication works
- ✅ Can accept/counter

---

## Phase 6: Checkout & Payment (25 minutes)

### G6.1 - Checkout Process
**Objective:** Verify checkout flow  
**URL:** `http://localhost:3000/guardian/checkout`

**Checkout Page:**
- [ ] Package summary
- [ ] Selected patient
- [ ] Duration and dates
- [ ] Price breakdown
  - Base price
  - Platform fee
  - Total

- [ ] Coupon/promo code field
- [ ] Payment method selection
- [ ] Terms acceptance

**Test Actions:**
1. Review order summary
2. Apply promo code (if available)
3. Proceed to payment

**Expected Outcome:**
- ✅ Summary accurate
- ✅ Can proceed to payment

---

### G6.2 - Payment Selection
**Objective:** Verify payment method selection  
**URL:** `http://localhost:3000/guardian/checkout/payment`

**Payment Methods:**
- [ ] **bKash**
  - [ ] Select option
  - [ ] Shows phone number input
  - [ ] OTP verification

- [ ] **Nagad**
  - [ ] Select option
  - [ ] Similar flow to bKash

- [ ] **Bank Transfer**
  - [ ] Shows bank details
  - [ ] Upload proof option

- [ ] **Card Payment** (if available)
  - [ ] Card number
  - [ ] Expiry
  - [ ] CVV

**Test Actions:**
1. Select bKash
2. Enter phone number
3. Click "Pay Now"
4. Complete payment (test mode)

**Expected Outcome:**
- ✅ Payment methods work
- ✅ Transaction processes

---

### G6.3 - Payment Success
**Objective:** Verify success confirmation  
**URL:** `http://localhost:3000/guardian/checkout/success`

**Success Page:**
- [ ] Confirmation message
- [ ] Order/booking number
- [ ] Package details summary
- [ ] Start date confirmation
- [ ] Download receipt button
- [ ] "Go to Jobs" button

**Email/SMS:**
- [ ] Confirmation sent (if configured)

**Expected Outcome:**
- ✅ Clear confirmation
- ✅ Can download receipt

---

## Phase 7: Active Jobs Monitoring (20 minutes)

### G7.1 - Jobs List
**Objective:** Verify active jobs display  
**URL:** `http://localhost:3000/guardian/jobs`

**Page Elements:**
- [ ] Page title: "Active Care"
- [ ] Active jobs list
- [ ] Completed jobs tab
- [ ] Cancelled jobs tab

**Job Card:**
- [ ] Patient name
- [ ] Package name
- [ ] Agency name
- [ ] Caregiver assigned (with photo)
- [ ] Status (Scheduled, In Progress, Completed)
- [ ] Remaining days
- [ ] "View Details" button

**Expected Outcome:**
- ✅ Jobs list loads
- ✅ Status accurate

---

### G7.2 - Job Details
**Objective:** Verify job detail page  
**URL:** `http://localhost:3000/guardian/jobs/[id]`

**Detail Sections:**
- [ ] Patient info
- [ ] Package info
- [ ] Caregiver info (photo, name, rating)
- [ ] Schedule (calendar view)
- [ ] Today's status (checked in/out times)
- [ ] Recent care logs
- [ ] "View All Care Logs" link
- [ ] "Message Caregiver" button
- [ ] "Report Issue" button

**Expected Outcome:**
- ✅ All details visible
- ✅ Actions work

---

### G7.3 - View Care Logs
**Objective:** Verify care log access  
**URL:** `http://localhost:3000/guardian/jobs/[id]/care-logs`

**Care Log Display:**

**Tabs:**
- [ ] Vitals
- [ ] Medications
- [ ] Activities
- [ ] Incidents

**Vitals Log:**
- [ ] Date/time
- [ ] Blood pressure
- [ ] Heart rate
- [ ] Temperature
- [ ] Notes

**Medications Log:**
- [ ] Medication name
- [ ] Time given
- [ ] Status
- [ ] Caregiver notes

**Activities Log:**
- [ ] Activity type
- [ ] Duration
- [ ] Description
- [ ] Patient mood

**Incidents:**
- [ ] Incident type
- [ ] Severity
- [ ] Description
- [ ] Actions taken

**Expected Outcome:**
- ✅ All logs accessible
- ✅ Clear presentation

---

## Phase 8: Billing & Payments (15 minutes)

### G8.1 - Billing Dashboard
**Objective:** Verify billing information  
**URL:** `http://localhost:3000/guardian/billing`

**Billing Overview:**
- [ ] Total spent
- [ ] Pending payments
- [ ] Recent transactions

**Invoice List:**
- [ ] Invoice number
- [ ] Date
- [ ] Amount
- [ ] Status (Paid/Pending/Overdue)
- [ ] Download button

**Test Actions:**
1. View invoice list
2. Download an invoice PDF
3. Verify PDF content

**Expected Outcome:**
- ✅ Billing info accurate
- ✅ Invoices downloadable

---

### G8.2 - Platform Fees
**Objective:** Verify platform fee transparency  
**URL:** `http://localhost:3000/guardian/billing/platform`

**Fee Information:**
- [ ] Fee breakdown
- [ ] What's included
- [ ] FAQ about fees

**Expected Outcome:**
- ✅ Clear fee explanation

---

## Phase 9: Communication (15 minutes)

### G9.1 - Messages
**Objective:** Verify messaging system  
**URL:** `http://localhost:3000/guardian/messages`

**Features:**
- [ ] Conversation list
- [ ] Unread indicators
- [ ] Filter by: Agency, Caregiver, Support
- [ ] New conversation button

**Conversation View:**
- [ ] Message history
- [ ] Timestamp
- [ ] Read receipts
- [ ] Send message input
- [ ] Attachment option

**Test Actions:**
1. Open conversation with caregiver
2. Send a message
3. Verify delivery

**Expected Outcome:**
- ✅ Messaging works
- ✅ Real-time updates

---

### G9.2 - Prescription Upload
**Objective:** Verify prescription sharing  
**URL:** `http://localhost:3000/guardian/prescription-upload`

**Upload Features:**
- [ ] Select patient
- [ ] Upload prescription file
- [ ] Add notes
- [ ] Share with caregiver option

**Expected Outcome:**
- ✅ Upload works
- ✅ Shared correctly

---

## Phase 10: Feedback & Rating (10 minutes)

### G10.1 - Rate Caregiver
**Objective:** Verify rating system

**After Job Completion:**
- [ ] Rating prompt appears
- [ ] Star rating (1-5)
- [ ] Review text area
- [ ] Categories: Punctuality, Care Quality, Communication
- [ ] Submit button

**Test Actions:**
1. Rate caregiver: 5 stars
2. Write review: "Excellent care provided"
3. Submit

**Expected Outcome:**
- ✅ Rating submitted
- ✅ Shows in caregiver profile

---

## Phase 11: Payment Reminders & Warnings (10 minutes)

### G11.1 - Payment Reminder
**Objective:** Verify payment reminder page  
**URL:** `http://localhost:3000/guardian/payment-reminder`

**Page Shows:**
- [ ] Outstanding amount
- [ ] Due date
- [ ] "Pay Now" button
- [ ] Payment methods

---

### G11.2 - Payment Warning
**Objective:** Verify payment warning page  
**URL:** `http://localhost:3000/guardian/payment-warning`

**Page Shows:**
- [ ] Warning message
- [ ] Consequences of non-payment
- [ ] "Pay Now" button
- [ ] Contact support

---

### G11.3 - Account Locked
**Objective:** Verify locked state  
**URL:** `http://localhost:3000/guardian/payment-locked`

**Page Shows:**
- [ ] Locked message
- [ ] Amount due
- [ ] Payment required to unlock
- [ ] Support contact

---

## 📊 TEST SUMMARY

### Quick Reference - URLs

| Page | URL |
|------|-----|
| Registration Step 1 | `/guardian/registration/step-1` |
| Registration Step 2 | `/guardian/registration/step-2` |
| Registration Step 3 | `/guardian/registration/step-3` |
| Login | `/guardian/login` |
| Dashboard | `/guardian/dashboard` |
| Patients List | `/guardian/patients` |
| Add Patient | `/guardian/patients/new` |
| Patient Detail | `/guardian/patients/[id]` |
| Browse Packages | `/guardian/packages` |
| Package Detail | `/guardian/packages/[id]` |
| Negotiate | `/guardian/packages/[id]/negotiate` |
| Checkout | `/guardian/checkout` |
| Payment | `/guardian/checkout/payment` |
| Jobs | `/guardian/jobs` |
| Job Detail | `/guardian/jobs/[id]` |
| Care Logs | `/guardian/jobs/[id]/care-logs` |
| Billing | `/guardian/billing` |
| Messages | `/guardian/messages` |

### Test Counts

| Phase | Test Cases | Est. Time |
|-------|------------|-----------|
| Registration | 3 | 25 min |
| Authentication | 2 | 15 min |
| Patient Management | 5 | 30 min |
| Package Browsing | 3 | 25 min |
| Negotiation | 2 | 20 min |
| Checkout | 3 | 25 min |
| Jobs Monitoring | 3 | 20 min |
| Billing | 2 | 15 min |
| Communication | 2 | 15 min |
| Feedback | 1 | 10 min |
| Payment Warnings | 3 | 10 min |
| **Total** | **29** | **~3.5 hours** |

---

## ✅ SIGN-OFF

| Tester | Date | Total Passed | Total Failed | Notes |
|--------|------|--------------|--------------|-------|
| _______ | _______ | ___/29 | ___/29 | _______ |

