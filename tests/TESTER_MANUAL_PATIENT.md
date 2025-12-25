# 🧑‍🦳 Manual Testing - Patient Entity (Complete Guide)

**Date Created:** December 25, 2025  
**Entity:** Patient  
**Testing Scope:** Patient portal, view care, medications, chat, emergency features  
**Estimated Time:** 1 hour  
**Prerequisites:** Development server running, database seeded with test data  

---

## 🧑‍🦳 PATIENT USER ROLE & CAPABILITIES

### Role Definition
**Patient** is the care recipient who can view their care information and interact with their caregiver.

| Property | Value |
|----------|-------|
| **Role Name** | PATIENT |
| **Authority Level** | Level 2 (Care Recipient) |
| **Core Function** | View care, communicate with caregiver, access health info |
| **Access Level** | Personal health info, assigned caregiver, care logs |
| **MFA Requirement** | Optional |

### Patient Permissions Overview

| Category | Permissions |
|----------|-------------|
| **Dashboard** | ✅ View personal dashboard |
| **Caregiver** | ✅ View assigned caregiver profile |
| **Care Logs** | ✅ View care logs (vitals, medications, activities) |
| **Medications** | ✅ View medication schedule, reminders |
| **Health Records** | ✅ View own health records |
| **Appointments** | ✅ View scheduled appointments |
| **Chat** | ✅ Message assigned caregiver |
| **Emergency SOS** | ✅ Trigger emergency alert |
| **Feedback** | ✅ Rate caregiver |

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

- [ ] **Test Data**
  - [ ] Patient account exists
  - [ ] Assigned to a caregiver
  - [ ] Care logs recorded

### Test Patient Account Credentials

| Credential | Value |
|-----------|-------|
| **Phone Number** | `+8801712345502` |
| **Email** | `patient@carenet.com` |
| **Password** | `Patient@123` |
| **Role** | PATIENT |
| **Name** | Anwar Hossain |
| **Guardian** | Fahima Rahman |
| **Is Active** | Yes |

---

## ✅ TEST EXECUTION PLAN

---

## Phase 1: Authentication (10 minutes)

### P1.1 - Patient Login
**Objective:** Verify patient can login  
**URL:** `http://localhost:3000/patient/login`

**Login Form:**
- [ ] Phone number field
- [ ] Password field
- [ ] Login button
- [ ] Forgot password link

**Steps:**
1. Enter phone: `+8801712345502`
2. Enter password: `Patient@123`
3. Click "Login"

**Expected Outcome:**
- ✅ Login succeeds
- ✅ Redirects to dashboard
- ✅ Session created

**Fail Conditions:**
- ❌ Login fails
- ❌ Wrong redirect

---

## Phase 2: Dashboard (15 minutes)

### P2.1 - Patient Dashboard
**Objective:** Verify dashboard displays correctly  
**URL:** `http://localhost:3000/patient/dashboard`

**Header Section:**
- [ ] Date display (e.g., "Tuesday, Dec 10")
- [ ] Greeting with name: "Hello, Anwar"
- [ ] Next caregiver arrival time

**Today's Caregiver Card:**
- [ ] Caregiver photo/avatar
- [ ] Caregiver name
- [ ] Rating stars
- [ ] Short description
- [ ] "Chat" button
- [ ] "Call Guardian" button

**Today's Medications Card:**
- [ ] Medication list
- [ ] Time scheduled
- [ ] Status (Due/Taken/Scheduled)
- [ ] "View All" link

**Quick Actions:**
- [ ] Care Logs button
- [ ] Appointments button

**Next Reminder:**
- [ ] Next medication/appointment
- [ ] Time
- [ ] "Details" link

**Test Actions:**
1. View all dashboard sections
2. Click "Chat" button
3. Click "View All" on medications
4. Click quick action buttons

**Expected Outcome:**
- ✅ All sections render
- ✅ Data accurate
- ✅ Navigation works

---

## Phase 3: View Caregiver (10 minutes)

### P3.1 - My Caregiver Profile
**Objective:** Verify caregiver profile display  
**URL:** `http://localhost:3000/patient/caregiver`

**Profile Sections:**
- [ ] Photo
- [ ] Name
- [ ] Rating (stars)
- [ ] Experience years
- [ ] Specializations
- [ ] Languages spoken
- [ ] About/bio section
- [ ] Contact options (Chat only, not direct phone)

**Expected Outcome:**
- ✅ Caregiver info displays
- ✅ Can initiate chat

---

## Phase 4: Care Logs Viewing (15 minutes)

### P4.1 - Care Logs Overview
**Objective:** Verify care logs display  
**URL:** `http://localhost:3000/patient/care-logs`

**Page Elements:**
- [ ] Date selector
- [ ] Tab navigation: Vitals, Medications, Activities, Incidents
- [ ] Log entries list

---

### P4.2 - Vitals Tab
**Objective:** Verify vitals display

**Vitals Display:**
- [ ] Time recorded
- [ ] Blood Pressure (e.g., "120/80")
- [ ] Heart Rate (e.g., "72 BPM")
- [ ] Temperature (e.g., "98.6°F")
- [ ] Blood Glucose (e.g., "110 mg/dL")
- [ ] Oxygen Saturation (e.g., "98%")
- [ ] Caregiver notes

**Date Navigation:**
1. Select yesterday's date
2. Verify logs update to that date
3. Select today's date

**Expected Outcome:**
- ✅ Vitals display correctly
- ✅ Date filter works

---

### P4.3 - Medications Tab
**Objective:** Verify medication log display

**Medication Log:**
- [ ] Time
- [ ] Medication name
- [ ] Dosage
- [ ] Status (Taken/Skipped/Refused)
- [ ] Notes from caregiver

**Expected Outcome:**
- ✅ Medications logged
- ✅ Status clear

---

### P4.4 - Activities Tab
**Objective:** Verify activity log display

**Activity Log:**
- [ ] Time
- [ ] Activity type (Exercise, Bath, Meal, etc.)
- [ ] Description
- [ ] Duration
- [ ] Patient mood noted

**Expected Outcome:**
- ✅ Activities display
- ✅ Clear descriptions

---

### P4.5 - Incidents Tab
**Objective:** Verify incident viewing (if any)

**Incident Log:**
- [ ] Time
- [ ] Incident type
- [ ] Severity
- [ ] Description
- [ ] Actions taken

**Expected Outcome:**
- ✅ Incidents visible (if any)
- ✅ Severity clear

---

## Phase 5: Medications (10 minutes)

### P5.1 - Medication List
**Objective:** Verify medication schedule  
**URL:** `http://localhost:3000/patient/medications`

**Medication Card:**
- [ ] Medication name
- [ ] Dosage
- [ ] Frequency (e.g., "Twice daily")
- [ ] Purpose (e.g., "For diabetes")
- [ ] Next scheduled time
- [ ] Status indicator

**Test Actions:**
1. View full medication list
2. Check scheduled times
3. Verify status indicators

**Expected Outcome:**
- ✅ All medications listed
- ✅ Schedule accurate

---

### P5.2 - Medication Reminder
**Objective:** Verify reminder display  
**URL:** `http://localhost:3000/patient/medication-reminder`

**Reminder Display:**
- [ ] Upcoming medication
- [ ] Time
- [ ] Instructions
- [ ] Dismiss/acknowledge option

**Expected Outcome:**
- ✅ Reminder shows
- ✅ Can acknowledge

---

## Phase 6: Health Records (10 minutes)

### P6.1 - Health Records View
**Objective:** Verify health records access  
**URL:** `http://localhost:3000/patient/health-records`

**Record Types:**
- [ ] Prescriptions
- [ ] Lab reports
- [ ] Imaging (X-rays, etc.)
- [ ] Doctor notes

**Record Card:**
- [ ] Type icon
- [ ] Title/description
- [ ] Date
- [ ] Doctor name (if applicable)
- [ ] View/Download button

**Test Actions:**
1. View records list
2. Click to view a record
3. Verify PDF/image opens

**Expected Outcome:**
- ✅ Records accessible
- ✅ Can view/download

---

## Phase 7: Appointments (10 minutes)

### P7.1 - Appointments List
**Objective:** Verify appointments display  
**URL:** `http://localhost:3000/patient/appointments`

**Appointment Card:**
- [ ] Date and time
- [ ] Appointment type (Doctor visit, Therapy, etc.)
- [ ] Location/address
- [ ] Doctor/therapist name
- [ ] Status (Upcoming/Completed/Cancelled)

**Calendar View:**
- [ ] Month calendar with appointments marked
- [ ] Click date to see details

**Test Actions:**
1. View upcoming appointments
2. Click on appointment for details
3. Check calendar view

**Expected Outcome:**
- ✅ Appointments display
- ✅ Calendar works

---

### P7.2 - Schedule View
**Objective:** Verify care schedule  
**URL:** `http://localhost:3000/patient/schedule`

**Schedule Display:**
- [ ] Weekly/daily view
- [ ] Caregiver visit times
- [ ] Medication times
- [ ] Appointment times

**Expected Outcome:**
- ✅ Schedule clear
- ✅ All events shown

---

## Phase 8: Communication (10 minutes)

### P8.1 - Chat with Caregiver
**Objective:** Verify chat functionality  
**URL:** `http://localhost:3000/patient/chat`

**Chat Interface:**
- [ ] Caregiver name and photo
- [ ] Message history
- [ ] Message input
- [ ] Send button
- [ ] Timestamps

**Test Actions:**
1. View chat history
2. Type message: "Hello, how are you today?"
3. Send message
4. Verify message appears in chat

**Expected Outcome:**
- ✅ Chat loads
- ✅ Can send messages
- ✅ Messages display

---

## Phase 9: Emergency Features (10 minutes)

### P9.1 - Emergency Contacts
**Objective:** Verify emergency contacts  
**URL:** `http://localhost:3000/patient/emergency-contacts`

**Contact List:**
- [ ] Guardian contact
- [ ] Secondary emergency contact
- [ ] Emergency services (if configured)
- [ ] Call button for each

**Test Actions:**
1. View emergency contacts
2. Verify call buttons work

**Expected Outcome:**
- ✅ Contacts display
- ✅ Can initiate call

---

### P9.2 - Emergency SOS
**Objective:** Verify SOS functionality  
**URL:** `http://localhost:3000/patient/emergency-sos`

**SOS Page:**
- [ ] Large SOS button
- [ ] "Press and hold to alert" instruction
- [ ] Alert sends to:
  - Guardian
  - Caregiver
  - Emergency contacts

**Test Actions:**
1. View SOS page
2. Understand functionality (don't actually trigger unless testing)
3. Verify cancel option available

**Expected Outcome:**
- ✅ SOS accessible
- ✅ Clear instructions

---

## Phase 10: Feedback & Rating (5 minutes)

### P10.1 - Rate Caregiver
**Objective:** Verify patient can rate caregiver  
**URL:** `http://localhost:3000/patient/rate-caregiver`

**Rating Form:**
- [ ] Star rating (1-5)
- [ ] Specific categories:
  - Care quality
  - Punctuality
  - Communication
  - Kindness
- [ ] Comment textarea
- [ ] Submit button

**Test Actions:**
1. Rate caregiver: 5 stars
2. Rate categories
3. Write comment: "Very caring and attentive"
4. Submit

**Expected Outcome:**
- ✅ Rating submits
- ✅ Thank you message

---

## Phase 11: Profile & Settings (5 minutes)

### P11.1 - Patient Profile
**Objective:** Verify profile view  
**URL:** `http://localhost:3000/patient/profile`

**Profile Display:**
- [ ] Photo
- [ ] Name
- [ ] Age
- [ ] Blood type
- [ ] Medical conditions
- [ ] Allergies
- [ ] Medications

**Note:** Patient typically cannot edit medical info (guardian manages)

**Expected Outcome:**
- ✅ Profile displays
- ✅ Info accurate

---

### P11.2 - Settings
**Objective:** Verify settings page  
**URL:** `http://localhost:3000/patient/settings`

**Settings Options:**
- [ ] Language preference
- [ ] Notification preferences
- [ ] Font size (accessibility)
- [ ] Theme (if available)

**Expected Outcome:**
- ✅ Settings accessible
- ✅ Can modify preferences

---

## 📊 TEST SUMMARY

### Quick Reference - URLs

| Page | URL |
|------|-----|
| Login | `/patient/login` |
| Dashboard | `/patient/dashboard` |
| Caregiver Profile | `/patient/caregiver` |
| Care Logs | `/patient/care-logs` |
| Medications | `/patient/medications` |
| Medication Reminder | `/patient/medication-reminder` |
| Health Records | `/patient/health-records` |
| Appointments | `/patient/appointments` |
| Schedule | `/patient/schedule` |
| Chat | `/patient/chat` |
| Emergency Contacts | `/patient/emergency-contacts` |
| Emergency SOS | `/patient/emergency-sos` |
| Rate Caregiver | `/patient/rate-caregiver` |
| Profile | `/patient/profile` |
| Settings | `/patient/settings` |

### Test Counts

| Phase | Test Cases | Est. Time |
|-------|------------|-----------|
| Authentication | 1 | 10 min |
| Dashboard | 1 | 15 min |
| Caregiver View | 1 | 10 min |
| Care Logs | 5 | 15 min |
| Medications | 2 | 10 min |
| Health Records | 1 | 10 min |
| Appointments | 2 | 10 min |
| Communication | 1 | 10 min |
| Emergency | 2 | 10 min |
| Feedback | 1 | 5 min |
| Profile | 2 | 5 min |
| **Total** | **19** | **~2 hours** |

---

## ✅ SIGN-OFF

| Tester | Date | Total Passed | Total Failed | Notes |
|--------|------|--------------|--------------|-------|
| _______ | _______ | ___/19 | ___/19 | _______ |

