# 👩‍⚕️ Manual Testing - Caregiver Entity (Complete Guide)

**Date Created:** December 25, 2025  
**Entity:** Caregiver  
**Testing Scope:** Registration, verification, jobs, check-in/out, care logs, earnings  
**Estimated Time:** 2-2.5 hours  
**Prerequisites:** Development server running, database seeded with test data  

---

## 👩‍⚕️ CAREGIVER USER ROLE & CAPABILITIES

### Role Definition
**Caregiver** is a healthcare professional providing care services through the CareNet platform.

| Property | Value |
|----------|-------|
| **Role Name** | CAREGIVER |
| **Authority Level** | Level 4 (Service Provider) |
| **Core Function** | Provide care services, log activities, manage availability |
| **Access Level** | Personal profile, assigned jobs, earnings |
| **MFA Requirement** | Optional |

### Caregiver Permissions Overview

| Category | Permissions |
|----------|-------------|
| **Profile** | ✅ Create, read, update personal profile |
| **Jobs** | ✅ View offers, accept/decline, view assigned jobs |
| **Check-in/out** | ✅ Check in at job site, check out |
| **Care Logs** | ✅ Record vitals, medications, activities, incidents |
| **Earnings** | ✅ View earnings, request withdrawal |
| **Availability** | ✅ Set/update availability schedule |
| **Training** | ✅ Access training materials |
| **Messages** | ✅ Communicate with agency, guardians |

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
  - [ ] Caregiver account (or will register new)
  - [ ] Seed data includes agencies, jobs, patients

### Test Caregiver Account Credentials

| Credential | Value |
|-----------|-------|
| **Phone Number** | `+8801712345401` |
| **Email** | `caregiver@carenet.com` |
| **Password** | `Caregiver@123` |
| **Role** | CAREGIVER |
| **Name** | Rashida Begum |
| **KYC Status** | VERIFIED |
| **Is Active** | Yes |

---

## ✅ TEST EXECUTION PLAN

---

## Phase 1: Registration Flow (40 minutes)

### C1.1 - Step 1: Phone Verification
**Objective:** Verify caregiver can start registration  
**URL:** `http://localhost:3000/caregiver/registration/step-1`

**Page Elements:**
- [ ] Step indicator: "Step 1 of 6"
- [ ] Title: "Verify your phone number"
- [ ] Phone number input field
- [ ] "Send Verification Code" button
- [ ] Terms agreement text

**Test Actions:**
1. Enter phone number: `01712345678`
2. Click "Send Verification Code"
3. Verify:
   - [ ] Loading state appears
   - [ ] Redirects to Step 2

**Validation Tests:**
1. Empty phone field
   - [ ] Button disabled or error shown

2. Invalid phone format
   - [ ] Error: "Invalid phone number format"

**Expected Outcome:**
- ✅ Phone verification initiated
- ✅ Proceeds to Step 2

**Fail Conditions:**
- ❌ Cannot enter phone
- ❌ Button not working
- ❌ No redirect

---

### C1.2 - Step 2: Code Verification
**Objective:** Verify OTP code entry  
**URL:** `http://localhost:3000/caregiver/registration/step-2`

**Page Elements:**
- [ ] Step indicator: "Step 2 of 6"
- [ ] Title: "Enter 6-digit code"
- [ ] 6 individual digit inputs
- [ ] Resend code timer
- [ ] Continue button

**Test Actions:**
1. Enter 6-digit code: `123456` (test code)
2. Verify auto-focus moves to next input
3. Click "Continue"

**Code Entry Tests:**
1. Enter only 5 digits
   - [ ] Continue button disabled

2. Enter non-numeric character
   - [ ] Input rejected

3. Wait for timer to expire
   - [ ] "Resend" option becomes available

**Expected Outcome:**
- ✅ Code entry works
- ✅ Auto-focus functional
- ✅ Proceeds to Step 3

**Fail Conditions:**
- ❌ Cannot enter code
- ❌ Auto-focus broken
- ❌ No redirect

---

### C1.3 - Step 3: Basic Information
**Objective:** Verify personal details form  
**URL:** `http://localhost:3000/caregiver/registration/step-3`

**Form Fields:**
- [ ] **Full Name** (required)
  - Enter: "Rashida Begum"

- [ ] **Date of Birth** (required)
  - Enter: "1990-05-15"

- [ ] **Gender** (required)
  - Select: "Female"

- [ ] **Current Address** (required)
  - Enter: "123 Main Street, Dhaka"

- [ ] **Languages** (required)
  - Enter: "Bangla, English"

**Navigation:**
- [ ] "Back" button to return to Step 2
- [ ] "Save & Continue" button

**Validation Tests:**
1. Empty required fields
   - [ ] Error messages appear
   - [ ] Cannot proceed

2. Future date of birth
   - [ ] Error: "Invalid date"

**Expected Outcome:**
- ✅ Form validates correctly
- ✅ Proceeds to Step 4

**Fail Conditions:**
- ❌ Fields not working
- ❌ Validation broken

---

### C1.4 - Step 4: Experience & Education
**Objective:** Verify professional background form  
**URL:** `http://localhost:3000/caregiver/registration/step-4`

**Form Fields:**

**Education:**
- [ ] **Highest Education** (required)
  - Select: "Bachelor's Degree" / "Diploma" / etc.

- [ ] **Institution Name** (required)
  - Enter: "Dhaka Medical College"

- [ ] **Year of Completion** (required)
  - Enter: "2015"

**Experience:**
- [ ] **Years of Experience** (required)
  - Enter: "5"

- [ ] **Previous Employer** (optional)
  - Enter: "ABC Healthcare"

- [ ] **Specializations** (multi-select)
  - Select: "Elderly Care", "Post-Surgery Care"

- [ ] **Skills** (multi-select)
  - Select: "Vital Signs Monitoring", "Medication Management"

**Expected Outcome:**
- ✅ All fields functional
- ✅ Multi-select works
- ✅ Proceeds to Step 5

**Fail Conditions:**
- ❌ Fields missing
- ❌ Multi-select broken

---

### C1.5 - Step 5: Certifications Upload
**Objective:** Verify document upload  
**URL:** `http://localhost:3000/caregiver/registration/step-5`

**Documents to Upload:**

1. **Nursing Certificate** (required)
   - [ ] Upload area visible
   - [ ] Accepts PDF, JPG, PNG
   - [ ] Max size: 5MB
   - [ ] Certificate number field
   - [ ] Issue date field
   - [ ] Expiry date field

2. **First Aid Certificate** (optional)
   - [ ] Upload area visible
   - [ ] Same format requirements

3. **NID (National ID)** (required)
   - [ ] Upload area visible
   - [ ] NID number field

4. **Police Clearance** (required)
   - [ ] Upload area visible
   - [ ] Certificate number field

**Upload Tests:**
1. Upload valid PDF file
   - [ ] Upload successful
   - [ ] Preview/filename shown

2. Try uploading > 5MB file
   - [ ] Error message appears

3. Remove uploaded file
   - [ ] File removed successfully

**Expected Outcome:**
- ✅ All uploads work
- ✅ File validation works
- ✅ Proceeds to Step 6

**Fail Conditions:**
- ❌ Upload broken
- ❌ No validation

---

### C1.6 - Step 6: Photo & Final Submission
**Objective:** Verify photo upload and submission  
**URL:** `http://localhost:3000/caregiver/registration/step-6`

**Page Elements:**
- [ ] Profile photo upload area
- [ ] Photo guidelines (face visible, recent, etc.)
- [ ] Bio/introduction textarea
- [ ] Terms & conditions checkbox
- [ ] Submit button

**Photo Upload:**
1. Click upload area
2. Select a photo
3. Verify:
   - [ ] Photo preview displays
   - [ ] Can change/remove photo

**Bio Entry:**
- Enter: "Experienced caregiver with 5+ years in elderly care. Compassionate and dedicated to patient wellbeing."

**Final Submission:**
1. Check terms & conditions
2. Click "Submit Application"
3. Verify:
   - [ ] Success message
   - [ ] Redirects to pending verification page

**Expected Outcome:**
- ✅ Photo uploads correctly
- ✅ Bio saves
- ✅ Submission successful

**Fail Conditions:**
- ❌ Photo upload fails
- ❌ Submission error

---

### C1.7 - Pending Verification
**Objective:** Verify pending page displays  
**URL:** `http://localhost:3000/caregiver/pending-verification`

**Page Elements:**
- [ ] Status message: "Application Under Review"
- [ ] Submitted documents list
- [ ] Expected timeline
- [ ] Contact support link
- [ ] "Check Status" button

**Expected Outcome:**
- ✅ Clear status display
- ✅ Can check status

**Fail Conditions:**
- ❌ Page not loading
- ❌ No status info

---

## Phase 2: Verification Stages (25 minutes)

### C2.1 - Certificate Verification
**Objective:** View certificate verification status  
**URL:** `http://localhost:3000/caregiver/verification/certificates`

**Page Shows:**
- [ ] Certificate verification status
- [ ] Uploaded certificates list
- [ ] Verification progress
- [ ] Notes from verifier (if any)

---

### C2.2 - Police Clearance Verification
**Objective:** View police clearance status  
**URL:** `http://localhost:3000/caregiver/verification/police-clearance`

**Page Shows:**
- [ ] Police clearance status
- [ ] Document uploaded
- [ ] Verification status

---

### C2.3 - Interview Scheduling
**Objective:** View/schedule interview  
**URL:** `http://localhost:3000/caregiver/verification/interview`

**Page Shows:**
- [ ] Interview status
- [ ] Scheduled time (if set)
- [ ] Interview instructions
- [ ] Video call link (if applicable)

---

### C2.4 - Verification Complete
**Objective:** Verify approval notification  
**URL:** `http://localhost:3000/caregiver/verification-complete`

**Page Shows:**
- [ ] Congratulations message
- [ ] Account activated status
- [ ] "Go to Dashboard" button
- [ ] Next steps guide

**Expected Outcome:**
- ✅ Clear approval message
- ✅ Can access dashboard

---

## Phase 3: Dashboard & Authentication (20 minutes)

### C3.1 - Caregiver Login
**Objective:** Verify verified caregiver can login  
**URL:** `http://localhost:3000/caregiver/login`

**Steps:**
1. Navigate to caregiver login
2. Enter credentials:
   - Phone: `+8801712345401`
   - Password: `Caregiver@123`
3. Click "Login"

**Expected Outcome:**
- ✅ Login succeeds
- ✅ Redirects to dashboard
- ✅ Session created

---

### C3.2 - Caregiver Dashboard
**Objective:** Verify dashboard displays correctly  
**URL:** `http://localhost:3000/caregiver/dashboard`

**Dashboard Elements:**

**Header:**
- [ ] Greeting with name
- [ ] Today's schedule summary
- [ ] Notification bell

**Stats Cards:**
- [ ] Active Jobs count
- [ ] Today's Earnings
- [ ] Rating
- [ ] Hours worked this week

**Today's Schedule:**
- [ ] Current/next job card
- [ ] Patient name
- [ ] Time
- [ ] Address
- [ ] "Start Job" or "Check In" button

**Quick Actions:**
- [ ] View Job Offers
- [ ] Set Availability
- [ ] View Earnings
- [ ] Messages

**Recent Activity:**
- [ ] Last care logs submitted
- [ ] Recent payments received
- [ ] Job completions

**Expected Outcome:**
- ✅ All elements render
- ✅ Data loads correctly
- ✅ Quick actions work

---

## Phase 4: Job Management (35 minutes)

### C4.1 - Job Offers
**Objective:** Verify job offers display  
**URL:** `http://localhost:3000/caregiver/jobs/offers`

**Page Elements:**
- [ ] Page title: "Job Offers"
- [ ] List of available offers
- [ ] Filter options

**Job Offer Card:**
- [ ] Agency name
- [ ] Patient info (limited)
- [ ] Location/area
- [ ] Duration
- [ ] Pay rate
- [ ] Start date
- [ ] "View Details" button
- [ ] "Accept" / "Decline" buttons

**Test Actions:**
1. View offer list
2. Click "View Details" on an offer
3. Review full details

**Expected Outcome:**
- ✅ Offers display correctly
- ✅ Can view details

---

### C4.2 - Accept Job Offer
**Objective:** Verify job acceptance flow  
**URL:** `http://localhost:3000/caregiver/jobs/[id]/accept`

**Acceptance Page:**
- [ ] Full job details
- [ ] Patient requirements
- [ ] Schedule details
- [ ] Pay information
- [ ] Terms acceptance checkbox
- [ ] "Accept Job" button

**Test Actions:**
1. Review all details
2. Check terms checkbox
3. Click "Accept Job"
4. Verify:
   - [ ] Success message
   - [ ] Job moves to active jobs
   - [ ] Agency notified

**Expected Outcome:**
- ✅ Job accepted successfully
- ✅ Appears in active jobs

---

### C4.3 - Active Jobs View
**Objective:** Verify active jobs list  
**URL:** `http://localhost:3000/caregiver/jobs/active`

**Page Elements:**
- [ ] List of accepted/active jobs
- [ ] Status indicators
- [ ] Quick actions per job

**Job Card Info:**
- [ ] Patient name
- [ ] Start date/time
- [ ] Duration remaining
- [ ] Next scheduled visit
- [ ] "Check In" button (when on-site)
- [ ] "View Details" button

**Expected Outcome:**
- ✅ Active jobs display
- ✅ Status accurate

---

### C4.4 - Job Details
**Objective:** Verify full job details  
**URL:** `http://localhost:3000/caregiver/jobs/[id]`

**Details Sections:**

**Patient Information:**
- [ ] Name and photo
- [ ] Age and gender
- [ ] Medical conditions
- [ ] Medications
- [ ] Allergies
- [ ] Emergency contacts

**Care Requirements:**
- [ ] Specific care needs
- [ ] Daily schedule
- [ ] Restrictions/precautions
- [ ] Special instructions

**Job Schedule:**
- [ ] Start and end dates
- [ ] Daily hours
- [ ] Days of week

**Payment Info:**
- [ ] Pay rate
- [ ] Payment schedule
- [ ] Total expected

**Expected Outcome:**
- ✅ All details visible
- ✅ Clear layout

---

## Phase 5: Check-In & Check-Out (20 minutes)

### C5.1 - Check-In Flow
**Objective:** Verify check-in process  
**URL:** `http://localhost:3000/caregiver/checkin`

**Check-In Page:**
- [ ] Current job details
- [ ] Location verification (if GPS enabled)
- [ ] Time display
- [ ] "Check In" button
- [ ] Notes field (optional)

**Check-In Process:**
1. Navigate to check-in page
2. Verify location (if applicable):
   - [ ] GPS permission requested
   - [ ] Location verified
3. Click "Check In"
4. Verify:
   - [ ] Timestamp recorded
   - [ ] Status updates to "On Site"
   - [ ] Guardian notified (if configured)

**Location Test:**
1. If GPS required, try with location off
   - [ ] Error or warning message

**Expected Outcome:**
- ✅ Check-in successful
- ✅ Time recorded accurately

**Fail Conditions:**
- ❌ Cannot check in
- ❌ Time not recorded

---

### C5.2 - Check-Out Flow
**Objective:** Verify check-out process  
**URL:** `http://localhost:3000/caregiver/checkout`

**Check-Out Page:**
- [ ] Check-in time displayed
- [ ] Duration worked
- [ ] Care summary (logs submitted)
- [ ] Notes field
- [ ] "Check Out" button

**Check-Out Process:**
1. Navigate to check-out page
2. Review shift summary
3. Add any notes
4. Click "Check Out"
5. Verify:
   - [ ] Duration calculated
   - [ ] Earnings updated
   - [ ] Status updates

**Expected Outcome:**
- ✅ Check-out successful
- ✅ Earnings reflected

---

## Phase 6: Care Log System (30 minutes)

### C6.1 - Care Log Dashboard
**Objective:** Verify care log overview  
**URL:** `http://localhost:3000/caregiver/care-logs`

**Page Elements:**
- [ ] Current patient info
- [ ] Today's log summary
- [ ] Quick action cards for each log type
- [ ] Previous logs list

**Log Types:**
- [ ] Vitals
- [ ] Medications
- [ ] Activities
- [ ] Incidents

---

### C6.2 - Record Vitals
**Objective:** Verify vitals logging  
**URL:** `http://localhost:3000/caregiver/care-logs/vitals`

**Vitals Form:**
- [ ] **Blood Pressure** - Systolic/Diastolic
  - Enter: 120/80

- [ ] **Heart Rate** (BPM)
  - Enter: 72

- [ ] **Temperature** (°F or °C)
  - Enter: 98.6

- [ ] **Blood Glucose** (mg/dL)
  - Enter: 110

- [ ] **Oxygen Saturation** (%)
  - Enter: 98

- [ ] **Weight** (optional)
  - Enter: 65 kg

- [ ] **Notes** (optional)
  - Enter: "Patient feeling well today"

- [ ] Timestamp (auto or manual)
- [ ] Submit button

**Test Actions:**
1. Enter all vital signs
2. Click "Submit"
3. Verify:
   - [ ] Success message
   - [ ] Log appears in history
   - [ ] Guardian can view (if permitted)

**Expected Outcome:**
- ✅ Vitals recorded
- ✅ Data validates correctly

---

### C6.3 - Record Medications
**Objective:** Verify medication logging  
**URL:** `http://localhost:3000/caregiver/care-logs/medications`

**Medication Form:**
- [ ] **Medication Name** (dropdown from patient's list)
  - Select: "Metformin 500mg"

- [ ] **Dosage Given**
  - Enter: "1 tablet"

- [ ] **Time Administered**
  - Select: Current time

- [ ] **Status**
  - Select: "Given" / "Refused" / "Skipped"

- [ ] **Notes**
  - Enter: "Given with breakfast"

- [ ] Submit button

**Test Actions:**
1. Select medication from list
2. Enter administration details
3. Submit

**Expected Outcome:**
- ✅ Medication logged
- ✅ Shows in patient record

---

### C6.4 - Record Activities
**Objective:** Verify activity logging  
**URL:** `http://localhost:3000/caregiver/care-logs/activities`

**Activity Form:**
- [ ] **Activity Type**
  - Select: "Exercise" / "Bath" / "Meal" / "Therapy"

- [ ] **Description**
  - Enter: "15-minute morning walk in garden"

- [ ] **Duration** (minutes)
  - Enter: 15

- [ ] **Patient Mood**
  - Select: "Good" / "Neutral" / "Low"

- [ ] **Notes**
  - Enter: "Patient enjoyed the fresh air"

- [ ] Submit button

**Expected Outcome:**
- ✅ Activity logged
- ✅ Shows in history

---

### C6.5 - Report Incident
**Objective:** Verify incident reporting  
**URL:** `http://localhost:3000/caregiver/care-logs/incident`

**Incident Form:**
- [ ] **Incident Type**
  - Select: "Fall" / "Medication Error" / "Behavior" / "Other"

- [ ] **Severity**
  - Select: "Minor" / "Moderate" / "Severe"

- [ ] **Description** (required)
  - Enter detailed description

- [ ] **Actions Taken**
  - Enter: "Applied first aid, monitored vitals"

- [ ] **Photo Upload** (optional)
  - [ ] Can upload incident photos

- [ ] **Guardian Notification**
  - [ ] Checkbox to notify immediately

- [ ] Submit button

**Alert Test:**
1. Report a "Severe" incident
2. Verify:
   - [ ] Urgent notification sent to guardian
   - [ ] Agency alerted
   - [ ] Incident flagged in system

**Expected Outcome:**
- ✅ Incident reported
- ✅ Appropriate notifications sent

---

## Phase 7: Earnings & Invoicing (20 minutes)

### C7.1 - Earnings Dashboard
**Objective:** Verify earnings display  
**URL:** `http://localhost:3000/caregiver/earnings`

**Dashboard Elements:**
- [ ] Current balance
- [ ] Pending earnings
- [ ] Total earned (this month)
- [ ] Earnings chart/graph
- [ ] Withdrawal button

**Earnings Breakdown:**
- [ ] By job/patient
- [ ] By date
- [ ] Bonus/tips (if applicable)

**Expected Outcome:**
- ✅ Earnings display correctly
- ✅ Calculations accurate

---

### C7.2 - Request Withdrawal
**Objective:** Verify withdrawal process  
**URL:** `http://localhost:3000/caregiver/earnings/withdraw`

**Withdrawal Form:**
- [ ] Available balance shown
- [ ] Amount to withdraw input
- [ ] Payment method selection (bKash, Nagad, Bank)
- [ ] Account details
- [ ] "Request Withdrawal" button

**Test Actions:**
1. Enter withdrawal amount: ৳5,000
2. Select payment method: bKash
3. Confirm account number
4. Click "Request Withdrawal"
5. Verify:
   - [ ] Request submitted
   - [ ] Pending status shown
   - [ ] Balance updated

**Validation Tests:**
1. Try withdrawing more than balance
   - [ ] Error: "Insufficient balance"

2. Try withdrawing below minimum
   - [ ] Error: "Minimum withdrawal is ৳500"

**Expected Outcome:**
- ✅ Withdrawal request submitted
- ✅ Validation works

---

### C7.3 - Invoice History
**Objective:** Verify invoice access  
**URL:** `http://localhost:3000/caregiver/earnings/invoices`

**Page Elements:**
- [ ] List of invoices
- [ ] Filter by date/status
- [ ] Download option

**Invoice Info:**
- [ ] Invoice number
- [ ] Date
- [ ] Amount
- [ ] Status
- [ ] Download button

**Expected Outcome:**
- ✅ Invoices listed
- ✅ Can download PDF

---

## Phase 8: Availability Management (15 minutes)

### C8.1 - Set Availability
**Objective:** Verify availability setting  
**URL:** `http://localhost:3000/caregiver/availability`

**Availability Interface:**
- [ ] Weekly calendar view
- [ ] Time slot selection
- [ ] Recurring availability option
- [ ] Block dates option

**Setting Availability:**
1. View current week
2. Click on time slots to toggle availability
3. Set recurring pattern:
   - [ ] Weekdays: 8 AM - 6 PM
   - [ ] Weekends: Off

4. Block specific dates:
   - [ ] Select December 31, 2025
   - [ ] Mark as unavailable
   - [ ] Add reason: "Personal leave"

5. Save changes

**Expected Outcome:**
- ✅ Availability saves correctly
- ✅ Blocked dates respected
- ✅ Agencies see updated availability

---

## Phase 9: Training & Resources (10 minutes)

### C9.1 - Training Materials
**Objective:** Verify training access  
**URL:** `http://localhost:3000/caregiver/training`

**Training Content:**
- [ ] List of available courses
- [ ] Progress indicators
- [ ] Completion certificates

**Course Card:**
- [ ] Course title
- [ ] Duration
- [ ] Progress percentage
- [ ] "Start" or "Continue" button

**Test Actions:**
1. Click on a course
2. View course content
3. Mark section as complete
4. Check progress updates

**Expected Outcome:**
- ✅ Training materials accessible
- ✅ Progress tracking works

---

## Phase 10: Profile & Messages (10 minutes)

### C10.1 - Edit Profile
**Objective:** Verify profile editing  
**URL:** `http://localhost:3000/caregiver/profile`

**Editable Fields:**
- [ ] Profile photo
- [ ] Bio/introduction
- [ ] Contact details
- [ ] Languages
- [ ] Skills
- [ ] Availability preferences

**Test Actions:**
1. Update bio text
2. Add a new skill
3. Save changes
4. Verify changes persist

**Expected Outcome:**
- ✅ Profile updates save
- ✅ Changes visible to agencies

---

### C10.2 - Messages
**Objective:** Verify messaging works  
**URL:** `http://localhost:3000/caregiver/messages`

**Message Features:**
- [ ] Conversation list
- [ ] Unread indicators
- [ ] Send messages
- [ ] Receive messages

**Test Actions:**
1. Open conversation with agency
2. Send a message
3. Verify delivery

**Expected Outcome:**
- ✅ Messaging functional

---

## Phase 11: Edge Cases (10 minutes)

### C11.1 - Account Locked
**Objective:** Verify locked account handling  
**URL:** `http://localhost:3000/caregiver/account-locked`

**Scenario:** Caregiver with issues

**Page Shows:**
- [ ] Lock reason
- [ ] Required actions
- [ ] Contact support

---

### C11.2 - Verification Failed
**Objective:** Verify rejection handling  
**URL:** `http://localhost:3000/caregiver/verification-failed`

**Page Shows:**
- [ ] Rejection reason
- [ ] Resubmission options
- [ ] Support contact

---

## 📊 TEST SUMMARY

### Quick Reference - URLs

| Page | URL |
|------|-----|
| Registration Step 1 | `/caregiver/registration/step-1` |
| Registration Step 2 | `/caregiver/registration/step-2` |
| Registration Step 3 | `/caregiver/registration/step-3` |
| Registration Step 4 | `/caregiver/registration/step-4` |
| Registration Step 5 | `/caregiver/registration/step-5` |
| Registration Step 6 | `/caregiver/registration/step-6` |
| Pending Verification | `/caregiver/pending-verification` |
| Login | `/caregiver/login` |
| Dashboard | `/caregiver/dashboard` |
| Job Offers | `/caregiver/jobs/offers` |
| Active Jobs | `/caregiver/jobs/active` |
| Check-in | `/caregiver/checkin` |
| Check-out | `/caregiver/checkout` |
| Care Logs | `/caregiver/care-logs` |
| Vitals Log | `/caregiver/care-logs/vitals` |
| Medications Log | `/caregiver/care-logs/medications` |
| Activities Log | `/caregiver/care-logs/activities` |
| Incident Report | `/caregiver/care-logs/incident` |
| Earnings | `/caregiver/earnings` |
| Withdraw | `/caregiver/earnings/withdraw` |
| Availability | `/caregiver/availability` |
| Training | `/caregiver/training` |
| Profile | `/caregiver/profile` |
| Messages | `/caregiver/messages` |

### Test Counts

| Phase | Test Cases | Est. Time |
|-------|------------|-----------|
| Registration | 7 | 40 min |
| Verification | 4 | 25 min |
| Dashboard & Auth | 2 | 20 min |
| Job Management | 4 | 35 min |
| Check-in/out | 2 | 20 min |
| Care Logs | 5 | 30 min |
| Earnings | 3 | 20 min |
| Availability | 1 | 15 min |
| Training | 1 | 10 min |
| Profile & Messages | 2 | 10 min |
| Edge Cases | 2 | 10 min |
| **Total** | **33** | **~4 hours** |

---

## ✅ SIGN-OFF

| Tester | Date | Total Passed | Total Failed | Notes |
|--------|------|--------------|--------------|-------|
| _______ | _______ | ___/33 | ___/33 | _______ |

