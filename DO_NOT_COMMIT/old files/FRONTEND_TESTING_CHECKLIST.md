# CareNet Platform - Frontend Testing Checklist

**Version:** 1.0  
**Date:** December 5, 2025  
**Total Pages:** 196  
**Estimated Testing Time:** 4-6 hours

---

## 📋 How to Use This Checklist

1. **Start the dev server:** `npm run dev` (should be running at http://localhost:3000)
2. **Open the navigation helper:** `navigation.html` in your browser
3. **Test systematically:** Go through each section, checking off items as you test
4. **Test on multiple screen sizes:**
   - Mobile: 375px width (iPhone SE)
   - Tablet: 768px width (iPad)
   - Desktop: 1440px width (standard laptop)
5. **Test on multiple browsers:** Chrome, Firefox, Safari (if on Mac), Edge
6. **Note any issues** in the "Issues Found" section at the bottom

---

## ✅ Prerequisites Checklist

- [ ] Development server is running (`npm run dev`)
- [ ] Browser DevTools are open (for inspecting elements/console errors)
- [ ] `navigation.html` is open in a tab for quick navigation
- [ ] Have tested browser window ready (can resize for responsive testing)

---

## 🎨 Design System Compliance

Before testing pages, verify these design elements are consistent:

### Colors & Gradients
- [ ] Guardian pages use pink gradient: `#FFB3C1 → #FF8FA3`
- [ ] Agency pages use blue gradient: `#8EC5FC → #5B9FFF`
- [ ] Caregiver pages use green gradient: `#A8E063 → #7CE577`
- [ ] Patient pages use yellow gradient: `#FDD835 → #FBC02D`
- [ ] Moderator pages use red-orange gradient: `#FF6F61 → #E65245`
- [ ] Admin pages use purple gradient: `#B8A7FF → #8B7AE8`
- [ ] Shop pages use cyan-blue gradient: `#80E0FF → #2F5DFD`

### Common Elements
- [ ] All cards use `finance-card` class with glassmorphic effect
- [ ] All buttons use radial gradients
- [ ] Text colors: Headers `#535353`, Body `#848484`
- [ ] Consistent border radius (rounded-2xl = 16px, rounded-3xl = 24px)
- [ ] Consistent spacing (p-4, p-6, p-8)

---

## 🌐 PUBLIC / SHARED PAGES (12 pages)

### Landing Page
**URL:** http://localhost:3000

- [ ] Page loads without console errors
- [ ] CareNet logo with heart icon displays
- [ ] "Professional Caregiver Services for Families in Bangladesh" heading
- [ ] "Login" button in header works → routes to `/auth/login`
- [ ] "Register" button in header works → routes to `/auth/role-selection`
- [ ] "Browse Agencies" CTA button works → routes to `/guardian/packages`
- [ ] "Get Started" button works → routes to `/auth/role-selection`
- [ ] Three feature cards display with icons
- [ ] Three role selection cards (Guardian, Agency, Caregiver) display
- [ ] Role cards are clickable → route to registration pages
- [ ] Three testimonials display with star ratings
- [ ] Footer displays with links to Terms, Privacy
- [ ] Footer links work (Terms, Privacy)
- [ ] Responsive: Mobile (375px) - stacks vertically
- [ ] Responsive: Tablet (768px) - proper grid layout
- [ ] Responsive: Desktop (1440px) - centered max-width

### Login
**URL:** http://localhost:3000/auth/login

- [ ] Page loads without errors
- [ ] CareNet logo with pink gradient displays
- [ ] "Welcome Back" heading visible
- [ ] Phone input field accepts input
- [ ] Phone input placeholder shows "01XXXXXXXXX"
- [ ] Phone auto-formats (adds +880 prefix when starting with 01)
- [ ] Phone validation shows error for invalid format
- [ ] Password input field accepts input
- [ ] Password visibility toggle icon displays
- [ ] Password visibility toggle works (shows/hides password)
- [ ] "Forgot Password?" link visible
- [ ] "Forgot Password?" link routes to `/auth/reset-password/step-1`
- [ ] "Register" link visible in bottom section
- [ ] "Register" link routes to `/auth/role-selection`
- [ ] Login button has gradient background
- [ ] Login button is disabled when form is invalid
- [ ] Login button is enabled when form is valid
- [ ] Demo hint text displays (017 for Guardian, 018 for Caregiver)
- [ ] Form validation prevents submission with empty fields
- [ ] Submitting with 017 number routes to `/guardian/dashboard`
- [ ] Submitting with 018 number routes to `/caregiver/dashboard`
- [ ] Submitting with 019 number routes to `/agency/dashboard`
- [ ] Footer text displays "CareNet Platform v2.0"
- [ ] Responsive: Mobile (375px) - card is full width with padding
- [ ] Responsive: Desktop (1440px) - card is centered, max-width

### Role Selection
**URL:** http://localhost:3000/auth/role-selection

- [ ] Page loads without errors
- [ ] "Back to Login" button visible and works
- [ ] CareNet logo displays with pink gradient
- [ ] "Choose Your Role" heading visible
- [ ] Three role cards display (Guardian, Agency, Caregiver)
- [ ] Guardian card has blue gradient icon
- [ ] Agency card has purple gradient icon
- [ ] Caregiver card has pink gradient icon
- [ ] Each card shows title and description
- [ ] Each card has arrow icon on right
- [ ] Cards have hover effect (shadow, translate)
- [ ] Guardian card routes to `/guardian/registration/step-1`
- [ ] Agency card routes to `/agency/registration/step-1`
- [ ] Caregiver card routes to `/caregiver/registration/step-1`
- [ ] Info card at bottom displays registration guidance
- [ ] Responsive: Mobile (375px) - cards stack vertically
- [ ] Responsive: Desktop (1440px) - cards maintain spacing

### MFA Verification
**URL:** http://localhost:3000/auth/verify-mfa

- [ ] Page loads without errors
- [ ] 6-digit code input displays
- [ ] Each input accepts one digit
- [ ] Auto-focus moves to next input after entering digit
- [ ] Backspace moves focus to previous input
- [ ] Verify button displays
- [ ] Responsive design works

### Password Reset - Step 1
**URL:** http://localhost:3000/auth/reset-password/step-1

- [ ] Page loads without errors
- [ ] "Back" button works
- [ ] "Reset Password" heading displays
- [ ] Phone number input field works
- [ ] Phone validation enforces BD format
- [ ] "Send Reset Code" button displays
- [ ] Button disabled when phone invalid
- [ ] Button enabled when phone valid
- [ ] Clicking button routes to step 2
- [ ] Responsive design works

### Password Reset - Step 2
**URL:** http://localhost:3000/auth/reset-password/step-2

- [ ] Page loads without errors
- [ ] "Back" button works
- [ ] "Enter OTP" heading displays
- [ ] Masked phone number displays (01XXX-XXX-789)
- [ ] 6 OTP input boxes display
- [ ] Each box accepts one digit
- [ ] Auto-focus to next box works
- [ ] Timer countdown displays (2:00)
- [ ] "Resend Code" button appears when timer reaches 0
- [ ] "Verify Code" button displays
- [ ] Button disabled until all 6 digits entered
- [ ] Clicking verify routes to step 3
- [ ] Responsive design works

### Password Reset - Step 3
**URL:** http://localhost:3000/auth/reset-password/step-3

- [ ] Page loads without errors
- [ ] "Back" button works
- [ ] "Set New Password" heading displays
- [ ] New password input field works
- [ ] Password visibility toggle works
- [ ] Confirm password input field works
- [ ] Confirm password visibility toggle works
- [ ] Validation error shows if passwords don't match
- [ ] Validation requires minimum 8 characters
- [ ] "Reset Password" button displays
- [ ] Button disabled when passwords invalid/don't match
- [ ] Button enabled when passwords valid and match
- [ ] Clicking button routes to success page
- [ ] Responsive design works

### Password Reset - Success
**URL:** http://localhost:3000/auth/reset-password/success

- [ ] Page loads without errors
- [ ] Green checkmark icon displays
- [ ] "Password Reset Successful!" heading displays
- [ ] Success message displays
- [ ] "Go to Login" button displays
- [ ] Auto-redirect countdown works (3 seconds)
- [ ] Clicking button routes to `/auth/login`
- [ ] Auto-redirect routes to `/auth/login`
- [ ] Responsive design works

### Terms & Conditions
**URL:** http://localhost:3000/terms

- [ ] Page loads without errors
- [ ] "Back" button works
- [ ] Document icon displays
- [ ] "Terms & Conditions" heading displays
- [ ] Last Updated date displays
- [ ] All 10 sections display with content
- [ ] Sections are properly formatted and readable
- [ ] Bottom info card displays
- [ ] Content is scrollable
- [ ] Responsive: Mobile - readable text size
- [ ] Responsive: Desktop - proper max-width

### Privacy Policy
**URL:** http://localhost:3000/privacy

- [ ] Page loads without errors
- [ ] "Back" button works
- [ ] Shield icon displays
- [ ] "Privacy Policy" heading displays
- [ ] Last Updated date displays
- [ ] All 11 sections display with content
- [ ] Sections properly formatted with bullet points
- [ ] Bottom info card displays
- [ ] Content is scrollable
- [ ] Responsive: Mobile - readable text size
- [ ] Responsive: Desktop - proper max-width

### Offline State
**URL:** http://localhost:3000/offline

- [ ] Page loads without errors
- [ ] WiFi off icon displays
- [ ] "You're Offline" heading displays
- [ ] Explanation text displays
- [ ] "What you can still do" section displays with checkmarks
- [ ] "Try Again" button with refresh icon displays
- [ ] Button click triggers page reload
- [ ] Bottom help text displays
- [ ] Responsive design works

### 404 Not Found
**URL:** http://localhost:3000/not-found (or any invalid URL)

- [ ] Page loads without errors
- [ ] Error state displays
- [ ] "Page Not Found" or similar message
- [ ] Navigation back to home works
- [ ] Responsive design works

---

## 👨‍👩‍👧 GUARDIAN PAGES (24 pages)

### Registration - Step 1
**URL:** http://localhost:3000/guardian/registration/step-1

- [ ] Page loads without errors
- [ ] Pink gradient colors display (Guardian theme)
- [ ] "Step 1 of 3" indicator displays
- [ ] Phone number input works
- [ ] Email input works (optional)
- [ ] Password input works
- [ ] Password visibility toggle works
- [ ] Confirm password input works
- [ ] Validation checks password match
- [ ] Progress bar shows 33%
- [ ] "Continue" button disabled when invalid
- [ ] "Continue" button enabled when valid
- [ ] Button routes to step 2
- [ ] Responsive design works

### Registration - Step 2
**URL:** http://localhost:3000/guardian/registration/step-2

- [ ] Page loads without errors
- [ ] "Step 2 of 3" indicator displays
- [ ] Masked phone number displays
- [ ] 6 OTP inputs display
- [ ] OTP input behavior works (auto-focus, etc.)
- [ ] Resend timer displays
- [ ] Progress bar shows 66%
- [ ] "Verify" button works
- [ ] Routes to step 3
- [ ] Responsive design works

### Registration - Step 3
**URL:** http://localhost:3000/guardian/registration/step-3

- [ ] Page loads without errors
- [ ] "Step 3 of 3" indicator displays
- [ ] Full name input works
- [ ] Profile photo upload area displays
- [ ] Profile photo upload triggers file picker
- [ ] Language preference dropdown works
- [ ] Terms checkbox displays
- [ ] Privacy checkbox displays
- [ ] Progress bar shows 100%
- [ ] "Complete Registration" button disabled until checkboxes checked
- [ ] Button enabled when form complete
- [ ] Button routes to dashboard
- [ ] Responsive design works

### Dashboard
**URL:** http://localhost:3000/guardian/dashboard

- [ ] Page loads without errors
- [ ] Greeting with name displays
- [ ] Quick action buttons display (+ Patient, Browse Packages)
- [ ] "+ Patient" button routes to `/guardian/patients/new`
- [ ] "Browse Packages" button routes to `/guardian/packages`
- [ ] Patient cards list displays (if mock data exists)
- [ ] Recent activity feed displays
- [ ] Bottom nav displays (if mobile)
- [ ] All dashboard cards use pink Guardian gradient
- [ ] Responsive: Mobile - single column
- [ ] Responsive: Desktop - multi-column grid

### Add Patient
**URL:** http://localhost:3000/guardian/patients/new

- [ ] Page loads without errors
- [ ] "Add New Patient" heading displays
- [ ] Name input works
- [ ] Date of birth picker works
- [ ] Gender dropdown works (Male/Female/Other)
- [ ] Blood group dropdown works
- [ ] Photo upload area displays
- [ ] Photo upload triggers file picker
- [ ] Medical conditions multi-select works
- [ ] Allergies input works (marked RED/important)
- [ ] Mobility level selector works
- [ ] Cognitive status selector works
- [ ] Address input works
- [ ] Emergency contact input works
- [ ] "Save Patient" button displays
- [ ] Button disabled when required fields empty
- [ ] Button enabled when form valid
- [ ] Responsive design works

### Patient Detail
**URL:** http://localhost:3000/guardian/patients/[id] (use any ID like 123)

- [ ] Page loads without errors
- [ ] Patient header card displays
- [ ] Tab bar displays (Overview, Health, Care Logs, Jobs)
- [ ] Tabs are clickable and switch content
- [ ] Quick action buttons display (Edit, Upload Prescription, Book Care)
- [ ] "Edit" button routes to edit page
- [ ] "Upload Prescription" routes to upload page
- [ ] "Book Care" routes to package browsing
- [ ] Patient info displays correctly
- [ ] Responsive design works

### Patient Detail - Edit
**URL:** http://localhost:3000/guardian/patients/[id]/edit

- [ ] Page loads without errors
- [ ] Form pre-populated with patient data (mock)
- [ ] All fields are editable
- [ ] "Save Changes" button displays
- [ ] "Cancel" button routes back
- [ ] Responsive design works

### Patient Health Records
**URL:** http://localhost:3000/guardian/patients/[id]/health-records

- [ ] Page loads without errors
- [ ] Document list displays
- [ ] Type filters display (All, Prescriptions, Lab Results, etc.)
- [ ] Upload button (FAB) displays
- [ ] Document cards display with view/download/delete actions
- [ ] View button works (opens document view)
- [ ] Download button triggers download
- [ ] Delete button shows confirmation
- [ ] Responsive design works

### Prescription Upload (AI OCR)
**URL:** http://localhost:3000/guardian/prescription-upload

- [ ] Page loads without errors
- [ ] Image/PDF upload area displays
- [ ] Upload area accepts file selection
- [ ] "Scan with AI" button displays
- [ ] Extracted medications table displays (mock)
- [ ] Table fields are editable
- [ ] "Confirm & Save" button displays
- [ ] Responsive design works

### Browse Packages
**URL:** http://localhost:3000/guardian/packages

- [ ] Page loads without errors
- [ ] Sticky search bar displays at top
- [ ] Search input works
- [ ] Filter button displays
- [ ] Filter button shows bottom sheet/modal
- [ ] Package cards display (mock data)
- [ ] Each card shows agency info, price, services
- [ ] Package cards are clickable → route to detail page
- [ ] Cards use Guardian pink theme
- [ ] Responsive: Mobile - single column
- [ ] Responsive: Desktop - grid layout

### Package Filters
**URL:** http://localhost:3000/guardian/packages/filters

- [ ] Page loads without errors
- [ ] Current filter selections display
- [ ] Area selector displays
- [ ] Category checkboxes display
- [ ] Price range slider works
- [ ] Duration options display
- [ ] Minimum rating stars selector displays
- [ ] "Apply Filters" button displays
- [ ] "Reset Filters" button displays
- [ ] Apply button routes back to packages with filters
- [ ] Reset button clears all selections
- [ ] Responsive design works

### Package Detail
**URL:** http://localhost:3000/guardian/packages/[id]

- [ ] Page loads without errors
- [ ] Full-width header displays
- [ ] Package description displays
- [ ] Inclusions list displays
- [ ] Exclusions list displays
- [ ] Pricing breakdown displays
- [ ] Agency info card displays
- [ ] Sticky bottom bar displays
- [ ] "Book Now" button displays
- [ ] "Request Custom Quote" button displays
- [ ] Both buttons route appropriately
- [ ] Responsive: Mobile - full width
- [ ] Responsive: Desktop - centered layout

### Negotiation - Send Counter-Offer
**URL:** http://localhost:3000/guardian/negotiation

- [ ] Page loads without errors
- [ ] Original package details display
- [ ] Modified requirements text area displays
- [ ] Proposed price input displays
- [ ] Message field displays
- [ ] "Send Request" button displays
- [ ] Button routes to waiting page
- [ ] Responsive design works

### Negotiation - Wait for Response
**URL:** http://localhost:3000/guardian/negotiation/waiting

- [ ] Page loads without errors
- [ ] "Waiting for agency response" status displays
- [ ] Timer/countdown displays
- [ ] Sent offer details display
- [ ] Responsive design works

### Negotiation - Review Agency Response
**URL:** http://localhost:3000/guardian/negotiation/review

- [ ] Page loads without errors
- [ ] Agency's counter-offer displays
- [ ] Original vs new comparison displays
- [ ] "Accept" button displays
- [ ] "Counter Again" button displays
- [ ] "Browse Others" button displays
- [ ] Buttons route appropriately
- [ ] Responsive design works

### Active Jobs List
**URL:** http://localhost:3000/guardian/jobs

- [ ] Page loads without errors
- [ ] Tab filter displays (Active, Completed, Disputed)
- [ ] Tabs switch content
- [ ] Job cards display with status badges
- [ ] Each card shows patient name, package, caregiver, dates
- [ ] Job cards are clickable → route to detail
- [ ] Status badges use appropriate colors
- [ ] Responsive design works

### Job Detail
**URL:** http://localhost:3000/guardian/jobs/[id]

- [ ] Page loads without errors
- [ ] Tab bar displays (Overview, Care Logs, Vitals, Meds)
- [ ] Tabs switch content
- [ ] Caregiver card displays with photo
- [ ] "Message" button displays on caregiver card
- [ ] Schedule information displays
- [ ] Action buttons display (Report Issue, Rate & Review)
- [ ] "Report Issue" button works
- [ ] "Rate & Review" button works
- [ ] Responsive design works

### Messages Inbox
**URL:** http://localhost:3000/guardian/messages

- [ ] Page loads without errors
- [ ] Conversation list displays
- [ ] Conversations grouped by type (Caregiver, Agency, Support)
- [ ] Unread badges display
- [ ] Each conversation clickable → routes to chat
- [ ] Timestamps display
- [ ] Responsive design works

### Chat Screen
**URL:** http://localhost:3000/guardian/messages/[id]

- [ ] Page loads without errors
- [ ] Message thread displays
- [ ] Messages grouped by sender
- [ ] Text input field displays at bottom
- [ ] Attachment button displays
- [ ] Voice input option displays (optional)
- [ ] Send button displays
- [ ] Responsive design works

### Billing - Agency Invoices
**URL:** http://localhost:3000/guardian/billing

- [ ] Page loads without errors
- [ ] Invoice list displays
- [ ] Each invoice shows status (Paid, Pending, Overdue)
- [ ] Status badges use appropriate colors
- [ ] "Pay" action button displays on pending/overdue
- [ ] Invoice details display (amount, date, etc.)
- [ ] "Pay" button triggers payment flow
- [ ] Responsive design works

### Billing - Platform Invoices
**URL:** http://localhost:3000/guardian/billing/platform

- [ ] Page loads without errors
- [ ] Platform subscription invoices display (if applicable)
- [ ] Invoice details display
- [ ] Payment actions work
- [ ] Responsive design works

### Payment Reminder (Day 3)
**URL:** http://localhost:3000/guardian/payment-reminder

- [ ] Page loads without errors
- [ ] Reminder banner displays
- [ ] Invoice number displays
- [ ] Amount displays
- [ ] "Invoice is due in 4 days" message
- [ ] "Pay Now" button displays
- [ ] "Dismiss" button displays
- [ ] "Pay Now" routes to payment page
- [ ] Banner uses warning colors (yellow/orange)
- [ ] Responsive design works

### Payment Warning (Day 5)
**URL:** http://localhost:3000/guardian/payment-warning

- [ ] Page loads without errors
- [ ] Urgent warning banner displays
- [ ] "Account will be restricted in 2 days" message
- [ ] Invoice details display
- [ ] List of consequences displays
- [ ] "Pay Now" button displays prominently
- [ ] Banner uses urgent colors (red/orange)
- [ ] Responsive design works

### Payment Final Warning (Day 6)
**URL:** http://localhost:3000/guardian/payment-final-warning

- [ ] Page loads without errors
- [ ] Full-screen warning displays
- [ ] "Final Warning" heading
- [ ] List of features that will be locked displays
- [ ] Each restricted feature marked with 🚫
- [ ] Outstanding balance displays prominently
- [ ] Large "Pay Now" button displays
- [ ] Button has urgent styling
- [ ] Responsive design works

### Account Locked (Day 7+)
**URL:** http://localhost:3000/guardian/account-locked

- [ ] Page loads without errors
- [ ] Lock icon displays
- [ ] "Account Locked" heading displays
- [ ] Restricted features list displays (marked 🚫)
- [ ] Allowed features list displays (marked ✅)
- [ ] Outstanding balance displays
- [ ] "Pay Outstanding Balance" button displays
- [ ] Button is large and prominent
- [ ] Responsive design works

---

## 🏢 AGENCY ADMIN PAGES (24 pages)

### Registration - Steps 1-2
**URL:** http://localhost:3000/agency/registration/step-1 & step-2

- [ ] Step 1: Phone verification (same as Guardian)
- [ ] Step 2: OTP verification (same as Guardian)
- [ ] Blue gradient theme applied (Agency colors)
- [ ] Progress indicators work
- [ ] Navigation between steps works
- [ ] Responsive design works

### Registration - Step 3
**URL:** http://localhost:3000/agency/registration/step-3

- [ ] Page loads without errors
- [ ] "Step 3 of 5" indicator displays
- [ ] Company name input works
- [ ] Trade license number input works
- [ ] TIN input works (optional)
- [ ] Contact person input works
- [ ] Contact phone input works
- [ ] Service area/zone selector displays
- [ ] Company address textarea works
- [ ] Progress bar shows 60%
- [ ] "Continue" button works
- [ ] Routes to step 4
- [ ] Responsive design works

### Registration - Step 4
**URL:** http://localhost:3000/agency/registration/step-4

- [ ] Page loads without errors
- [ ] "Step 4 of 5" indicator displays
- [ ] Trade license upload area displays (required)
- [ ] TIN certificate upload area displays (optional)
- [ ] Company logo upload area displays (optional)
- [ ] Drag-drop zones work
- [ ] File picker triggers work
- [ ] Upload status displays (checkmark when uploaded)
- [ ] Preview displays after upload (mock)
- [ ] Progress bar shows 80%
- [ ] "Continue" button disabled until required docs uploaded
- [ ] Routes to step 5
- [ ] Responsive design works

### Registration - Step 5
**URL:** http://localhost:3000/agency/registration/step-5

- [ ] Page loads without errors
- [ ] "Step 5 of 5" indicator displays
- [ ] Payment method selection displays
- [ ] Options: bKash, Nagad, Bank
- [ ] Account details input displays
- [ ] Progress bar shows 100%
- [ ] "Submit for Verification" button displays
- [ ] Button routes to pending verification page
- [ ] Responsive design works

### Pending Verification
**URL:** http://localhost:3000/agency/pending-verification

- [ ] Page loads without errors
- [ ] "Under Review" status displays
- [ ] Estimated time displays (24-48 hours)
- [ ] Document upload status displays
- [ ] Each document shows checkmark or pending icon
- [ ] Informational text displays
- [ ] Responsive design works

### Rejection View
**URL:** http://localhost:3000/agency/rejection

- [ ] Page loads without errors
- [ ] Rejection message displays
- [ ] Rejection reasons list displays
- [ ] Resubmission instructions display
- [ ] "Edit & Resubmit" button displays
- [ ] Button routes to registration edit flow
- [ ] Responsive design works

### Onboarding
**URL:** http://localhost:3000/agency/onboarding

- [ ] Page loads without errors
- [ ] Welcome message displays
- [ ] Service zone selection displays (map/area picker)
- [ ] Payment method configuration section displays
- [ ] Initial package creation prompt displays
- [ ] "Get Started" or "Complete Setup" button
- [ ] Responsive design works

### Dashboard
**URL:** http://localhost:3000/agency/dashboard

- [ ] Page loads without errors
- [ ] KPI cards display (Caregivers, Active Jobs, Revenue, Rating)
- [ ] Each KPI shows number and label
- [ ] Job pipeline summary displays
- [ ] Quick action buttons display (+Create Package, +Add Caregiver, View All Jobs)
- [ ] Quick actions route correctly
- [ ] Blue gradient theme applied
- [ ] Responsive: Mobile - stacked KPIs
- [ ] Responsive: Desktop - grid layout

### Subscription Plans
**URL:** http://localhost:3000/agency/subscription

- [ ] Page loads without errors
- [ ] Plan cards display (Basic/Premium/Enterprise)
- [ ] Feature comparison table displays
- [ ] Current plan highlighted (if applicable)
- [ ] "Subscribe" or "Upgrade" buttons display
- [ ] Buttons trigger subscription flow
- [ ] Responsive: Mobile - stacked plans
- [ ] Responsive: Desktop - side-by-side

### Subscription Active
**URL:** http://localhost:3000/agency/subscription/active

- [ ] Page loads without errors
- [ ] Current plan card displays
- [ ] Renewal date displays
- [ ] Features list displays
- [ ] "Change Plan" button displays
- [ ] "Manage Payment" button displays
- [ ] Responsive design works

### Caregiver Roster
**URL:** http://localhost:3000/agency/caregivers

- [ ] Page loads without errors
- [ ] Search bar displays
- [ ] Filter chips display (Status, Skills, Availability)
- [ ] Caregiver cards display (mock data)
- [ ] Each card shows photo, rating, skills tags
- [ ] "View" button displays on each card
- [ ] "Assign" button displays on each card
- [ ] Buttons route correctly
- [ ] Responsive design works

### Add Caregiver Options
**URL:** http://localhost:3000/agency/caregivers/add

- [ ] Page loads without errors
- [ ] Two option cards display
- [ ] "From CV Pool" option displays
- [ ] "Register New" option displays
- [ ] Each option clickable
- [ ] "From CV Pool" routes to pool search
- [ ] "Register New" shows internal form
- [ ] Responsive design works

### Caregiver Pool Search
**URL:** http://localhost:3000/agency/caregivers/pool

- [ ] Page loads without errors
- [ ] Advanced search filters display
- [ ] Filters: skills, location, rating, availability, experience
- [ ] Results grid displays
- [ ] Caregiver profile preview displays
- [ ] "View Profile" action works
- [ ] "Send Job Offer" action works
- [ ] Responsive design works

### Caregiver Profile View
**URL:** http://localhost:3000/agency/caregivers/[id]

- [ ] Page loads without errors
- [ ] Full profile displays with photo
- [ ] Certifications list displays
- [ ] Ratings and reviews display
- [ ] Availability calendar displays
- [ ] "Contact" button displays
- [ ] "Send Job Offer" button displays
- [ ] Responsive design works

### Package Management
**URL:** http://localhost:3000/agency/packages

- [ ] Page loads without errors
- [ ] Package cards display
- [ ] Each card shows status badge, category, price, bookings count
- [ ] "Edit" action displays
- [ ] "Duplicate" action displays
- [ ] "+ Create Package" button displays
- [ ] Actions work correctly
- [ ] Responsive design works

### Create/Edit Package
**URL:** http://localhost:3000/agency/packages/new & /[id]/edit

- [ ] Page loads without errors
- [ ] Name input works
- [ ] Category dropdown works
- [ ] Description textarea works
- [ ] Pricing input works
- [ ] Duration input works
- [ ] Hours/day input works
- [ ] Inclusions tag input works
- [ ] Exclusions tag input works
- [ ] Active toggle works
- [ ] Preview button works (if present)
- [ ] "Save Package" button displays
- [ ] Responsive design works

### Package Inquiries
**URL:** http://localhost:3000/agency/inquiries

- [ ] Page loads without errors
- [ ] List of counter-offers from guardians displays
- [ ] Each inquiry shows proposed changes
- [ ] "Review" button displays
- [ ] Button routes to review page
- [ ] Responsive design works

### Review Counter-Offer
**URL:** http://localhost:3000/agency/inquiries/[id]

- [ ] Page loads without errors
- [ ] Original package details display
- [ ] Proposed changes display
- [ ] Comparison view displays (original vs proposed)
- [ ] Response options display (Offer Discount, Add Services, Decline)
- [ ] Each option is selectable
- [ ] Response form displays
- [ ] "Send Response" button displays
- [ ] Responsive design works

### Job Inbox
**URL:** http://localhost:3000/agency/jobs

- [ ] Page loads without errors
- [ ] Tabs display (New, Assigned, Active, Completed)
- [ ] Tabs switch content
- [ ] Job cards display with status
- [ ] Each card shows patient, package, dates
- [ ] Job cards clickable → route to detail
- [ ] Responsive design works

### New Job - Needs Assignment
**URL:** http://localhost:3000/agency/jobs/[id]

- [ ] Page loads without errors
- [ ] Job card displays patient info
- [ ] Package details display
- [ ] Start date displays
- [ ] Guardian info displays
- [ ] "Assign Caregiver" button displays prominently
- [ ] Button routes to assignment flow
- [ ] Responsive design works

### Assign Caregiver Flow
**URL:** http://localhost:3000/agency/jobs/[id]/assign

- [ ] Page loads without errors
- [ ] Job summary displays
- [ ] Available caregivers list displays
- [ ] Caregivers filtered by availability
- [ ] Skills match percentage displays
- [ ] Workload indicator displays
- [ ] Schedule setter displays
- [ ] Conflict detection displays (if conflicts)
- [ ] "Assign" button displays
- [ ] Button disabled if conflicts exist
- [ ] Responsive design works

### Messages Inbox
**URL:** http://localhost:3000/agency/messages

- [ ] Page loads without errors
- [ ] Grouped conversations display (Caregivers, Guardians, Support)
- [ ] Each conversation clickable
- [ ] Unread badges display
- [ ] Responsive design works

### Billing & Finance
**URL:** http://localhost:3000/agency/billing

- [ ] Page loads without errors
- [ ] Summary cards display (Total Earned, This Month, Pending Payout, Commission Paid)
- [ ] Incoming invoices section displays (from Guardians)
- [ ] Outgoing invoices section displays (to Caregivers)
- [ ] Platform charges section displays
- [ ] Invoice list displays
- [ ] Responsive design works

### Account Locked State
**URL:** http://localhost:3000/agency/account-locked

- [ ] Page loads without errors
- [ ] Same pattern as Guardian locked state
- [ ] Restricted features list (🚫)
- [ ] Allowed features list (✅)
- [ ] "Pay Outstanding Balance" button displays
- [ ] Responsive design works

---

## 👔 AGENCY MANAGER PAGES (8 pages)

### Login
**URL:** http://localhost:3000/agency-manager/login

- [ ] Page loads without errors
- [ ] Standard login form (no MFA required)
- [ ] Blue/purple gradient theme
- [ ] Login works
- [ ] Routes to dashboard
- [ ] Responsive design works

### Dashboard
**URL:** http://localhost:3000/agency-manager/dashboard

- [ ] Page loads without errors
- [ ] Restrictions banner displays explaining limited access
- [ ] KPI cards display (Quality Score, Active Jobs, Open Feedback, Incidents)
- [ ] Quick access links display
- [ ] Links route correctly
- [ ] Responsive design works

### QA Dashboard
**URL:** http://localhost:3000/agency-manager/qa

- [ ] Page loads without errors
- [ ] Quality metrics cards display
- [ ] Metrics: Average Rating, On-time Check-in Rate, Care Log Completion, Incident Rate
- [ ] Caregiver quality table displays
- [ ] Table shows ratings per caregiver
- [ ] Sortable columns (if applicable)
- [ ] Responsive design works

### Quality Alerts
**URL:** http://localhost:3000/agency-manager/alerts

- [ ] Page loads without errors
- [ ] Flagged items list displays
- [ ] Categories: low ratings, missed check-ins, incomplete logs
- [ ] Each alert shows relevant info
- [ ] Action buttons display (View Details, Acknowledge)
- [ ] Responsive design works

### Feedback Queue
**URL:** http://localhost:3000/agency-manager/feedback

- [ ] Page loads without errors
- [ ] Feedback list displays
- [ ] Status badges display (Pending Response, Responded)
- [ ] Guardian info displays
- [ ] Job reference displays
- [ ] "View" and "Respond" buttons display
- [ ] Buttons route correctly
- [ ] Responsive design works

### Respond to Feedback
**URL:** http://localhost:3000/agency-manager/feedback/[id]/respond

- [ ] Page loads without errors
- [ ] Original feedback displays
- [ ] Response textarea displays
- [ ] Character counter (if applicable)
- [ ] "Send Response" button displays
- [ ] Responsive design works

### Reports
**URL:** http://localhost:3000/agency-manager/reports

- [ ] Page loads without errors
- [ ] Report type selection displays
- [ ] Options: Performance, Quality, Activity
- [ ] Date range picker displays
- [ ] "Generate" button displays
- [ ] Preview area displays (mock)
- [ ] Export options display (PDF/CSV)
- [ ] Responsive design works

### View Assignments (Read-Only)
**URL:** http://localhost:3000/agency-manager/assignments

- [ ] Page loads without errors
- [ ] Assignment list displays
- [ ] Each assignment shows caregiver, job details
- [ ] View-only mode (no edit buttons)
- [ ] Details are readable
- [ ] Responsive design works

---

## 🩺 CAREGIVER PAGES (32 pages)

### Registration - Steps 1-2
**URL:** http://localhost:3000/caregiver/registration/step-1 & step-2

- [ ] Phone verification works
- [ ] OTP verification works
- [ ] Green gradient theme applied (Caregiver colors)
- [ ] Progress indicators work
- [ ] Responsive design works

### Registration - Step 3
**URL:** http://localhost:3000/caregiver/registration/step-3

- [ ] Page loads without errors
- [ ] "Step 3 of 6" indicator displays
- [ ] Full name input works
- [ ] DOB input works (must be 18+)
- [ ] Age validation enforces 18+
- [ ] Gender dropdown works
- [ ] Current address input works
- [ ] Profile photo upload (required) displays
- [ ] Photo upload triggers file picker
- [ ] Progress bar shows 50%
- [ ] "Continue" button works
- [ ] Responsive design works

### Registration - Step 4
**URL:** http://localhost:3000/caregiver/registration/step-4

- [ ] Page loads without errors
- [ ] "Step 4 of 6" indicator displays
- [ ] NID number input works
- [ ] NID front photo upload displays
- [ ] NID back photo upload displays
- [ ] Both uploads trigger file picker
- [ ] Upload status displays
- [ ] Progress bar shows 66%
- [ ] "Continue" button disabled until both NID photos uploaded
- [ ] Responsive design works

### Registration - Step 5
**URL:** http://localhost:3000/caregiver/registration/step-5

- [ ] Page loads without errors
- [ ] "Step 5 of 6" indicator displays
- [ ] Skills multi-select displays
- [ ] At least 1 skill required
- [ ] Certifications upload area displays
- [ ] Years of experience input works
- [ ] Languages multi-select displays
- [ ] Expected hourly rate input works (optional)
- [ ] Progress bar shows 83%
- [ ] "Continue" button works
- [ ] Responsive design works

### Registration - Step 6
**URL:** http://localhost:3000/caregiver/registration/step-6

- [ ] Page loads without errors
- [ ] "Step 6 of 6" indicator displays
- [ ] Weekly calendar grid displays
- [ ] Per-day availability toggles display
- [ ] Toggle switches work for each day
- [ ] Time range pickers display for each day
- [ ] Time pickers work
- [ ] Progress bar shows 100%
- [ ] "Submit for Verification" button displays
- [ ] Button routes to pending verification
- [ ] Responsive design works

### Pending Verification
**URL:** http://localhost:3000/caregiver/pending-verification

- [ ] Page loads without errors
- [ ] 6-step pipeline status displays
- [ ] Steps: Certificates, Police, Interview, Psych, Documents, Final
- [ ] Current step highlighted
- [ ] Estimated time for each step displays
- [ ] Progress indicator shows completion percentage
- [ ] Responsive design works

### Verification Step - Certificates
**URL:** http://localhost:3000/caregiver/verification/certificates

- [ ] Page loads without errors
- [ ] Status displays (Submitted/Under Review/Approved/Needs Resubmission)
- [ ] Certificate list displays
- [ ] Upload area displays (if needs resubmission)
- [ ] Resubmit option displays if rejected
- [ ] Status badge uses appropriate color
- [ ] Responsive design works

### Verification Step - Police Clearance
**URL:** http://localhost:3000/caregiver/verification/police-clearance

- [ ] Page loads without errors
- [ ] Instructions display
- [ ] Upload police clearance document area displays
- [ ] Upload triggers file picker
- [ ] Submission status displays
- [ ] Responsive design works

### Verification Step - Interview
**URL:** http://localhost:3000/caregiver/verification/interview

- [ ] Page loads without errors
- [ ] Schedule interview screen displays
- [ ] Available time slots display
- [ ] Time slot selection works
- [ ] Interview confirmation displays after selection
- [ ] Results pending message displays (after interview)
- [ ] Responsive design works

### Verification Step - Psychological Test
**URL:** http://localhost:3000/caregiver/verification/psych-test

- [ ] Page loads without errors
- [ ] Online assessment instructions display
- [ ] "Start Test" button displays
- [ ] Button triggers test (mock)
- [ ] Results pending message displays after completion
- [ ] Responsive design works

### Verification Step - Document Check
**URL:** http://localhost:3000/caregiver/verification/document-check

- [ ] Page loads without errors
- [ ] Final document verification status displays
- [ ] All submitted documents list displays
- [ ] Status for each document displays
- [ ] Responsive design works

### Verification Complete
**URL:** http://localhost:3000/caregiver/verification/complete

- [ ] Page loads without errors
- [ ] Success screen displays
- [ ] "VERIFICATION COMPLETE" message
- [ ] Congratulations message displays
- [ ] Next steps information displays
- [ ] "Go to Dashboard" button displays
- [ ] Green checkmark icon displays
- [ ] Responsive design works

### Verification Failed
**URL:** http://localhost:3000/caregiver/verification/failed

- [ ] Page loads without errors
- [ ] Failure screen displays
- [ ] Rejection reasons list displays
- [ ] Reapplication information displays
- [ ] "Contact Support" button displays
- [ ] Red X icon displays
- [ ] Responsive design works

### Home Screen / Dashboard
**URL:** http://localhost:3000/caregiver/dashboard

- [ ] Page loads without errors
- [ ] Greeting displays
- [ ] Today's schedule card displays
- [ ] Patient info displays on schedule card
- [ ] "Navigate" button displays
- [ ] "Check-In" button displays
- [ ] Weekly stats display
- [ ] Upcoming jobs list displays
- [ ] Bottom nav displays (mobile)
- [ ] Green gradient theme applied
- [ ] Responsive design works

### Subscription Plans
**URL:** http://localhost:3000/caregiver/subscription

- [ ] Page loads without errors
- [ ] Caregiver-specific subscription packages display
- [ ] Comparison table displays
- [ ] "Subscribe" buttons display
- [ ] Responsive design works

### My Jobs List
**URL:** http://localhost:3000/caregiver/jobs

- [ ] Page loads without errors
- [ ] Tabs display (Today, Upcoming, Completed)
- [ ] Tabs switch content
- [ ] Job cards display
- [ ] Each card shows patient name, dates, times, location, conditions
- [ ] Allergies highlighted in RED
- [ ] Job cards clickable
- [ ] Responsive design works

### Job Detail
**URL:** http://localhost:3000/caregiver/jobs/[id]

- [ ] Page loads without errors
- [ ] Patient info card displays (name, age, conditions)
- [ ] Allergies highlighted in RED
- [ ] Mobility level displays
- [ ] Special instructions display
- [ ] Medication schedule displays
- [ ] Calendar view displays
- [ ] Action buttons display (Navigate, Check In, Contact Guardian, Emergency Call)
- [ ] All action buttons work
- [ ] Responsive design works

### Job Offer Notification
**URL:** http://localhost:3000/caregiver/jobs/offer

- [ ] Page loads without errors
- [ ] Patient info displays
- [ ] Dates and shift times display
- [ ] Location displays
- [ ] Wage displays
- [ ] Required conditions/skills display
- [ ] "Accept" button displays
- [ ] "Decline" button displays
- [ ] Buttons trigger appropriate actions
- [ ] Responsive design works

### Check-In Step 1 - Location
**URL:** http://localhost:3000/caregiver/checkin

- [ ] Page loads without errors
- [ ] GPS verification loading animation displays
- [ ] "Verifying Location..." message displays
- [ ] Progress indicator displays
- [ ] Responsive design works

### Check-In - Location Mismatch
**URL:** http://localhost:3000/caregiver/checkin/location-mismatch

- [ ] Page loads without errors
- [ ] Warning dialog displays
- [ ] Note field displays (required)
- [ ] Note field is required before proceeding
- [ ] "Cancel" button displays
- [ ] "Proceed with Override" button displays
- [ ] Responsive design works

### Check-In Step 2 - Photo
**URL:** http://localhost:3000/caregiver/checkin/photo

- [ ] Page loads without errors
- [ ] Camera viewfinder displays (or camera icon)
- [ ] "Capture" button displays
- [ ] Camera access requested (if using actual camera)
- [ ] Photo capture works (mock)
- [ ] Responsive design works

### Check-In Step 3 - Confirmation
**URL:** http://localhost:3000/caregiver/checkin/confirmation

- [ ] Page loads without errors
- [ ] Success screen displays
- [ ] Check-in time displays
- [ ] Location verified badge displays
- [ ] Green checkmark displays
- [ ] "Start Care Session" button displays
- [ ] Button routes to care log interface
- [ ] Responsive design works

### Care Log Interface
**URL:** http://localhost:3000/caregiver/care-logs

- [ ] Page loads without errors
- [ ] Today's entries timeline displays
- [ ] Log type buttons display (Vitals, Medication, Activity/Note, Incident/Alert)
- [ ] Each button has icon
- [ ] Buttons trigger respective log forms
- [ ] Timeline updates after adding log (mock)
- [ ] Responsive design works

### Care Log - Vitals
**URL:** http://localhost:3000/caregiver/care-logs/vitals

- [ ] Page loads without errors
- [ ] BP inputs display (systolic/diastolic)
- [ ] Heart rate input displays
- [ ] Temperature input displays
- [ ] Blood glucose input displays
- [ ] Oxygen level input displays
- [ ] All fields are optional
- [ ] Abnormal detection alert displays if values out of range
- [ ] "Save" button displays
- [ ] Responsive design works

### Care Log - Medication
**URL:** http://localhost:3000/caregiver/care-logs/medication

- [ ] Page loads without errors
- [ ] Scheduled medications list displays
- [ ] Each medication shows time, drug, dosage
- [ ] "Given" button displays
- [ ] "Skipped" button displays with reason field
- [ ] Photo capture option displays
- [ ] All actions work
- [ ] "Save" button displays
- [ ] Responsive design works

### Care Log - Activity
**URL:** http://localhost:3000/caregiver/care-logs/activity

- [ ] Page loads without errors
- [ ] Activity type dropdown displays
- [ ] Notes field displays
- [ ] Voice input button displays (EN/BN)
- [ ] Photo upload option displays
- [ ] AI transcription preview displays (mock)
- [ ] "Save" button displays
- [ ] Responsive design works

### Care Log - Incident
**URL:** http://localhost:3000/caregiver/care-logs/incident

- [ ] Page loads without errors
- [ ] Incident type dropdown displays
- [ ] Options: Fall, Emergency, Behavioral, Equipment, Other
- [ ] Severity dropdown displays (Low-Critical)
- [ ] Description textarea displays
- [ ] Action taken textarea displays
- [ ] Photo/video upload displays
- [ ] Immediate notification warning displays for High/Critical
- [ ] "Save" button displays
- [ ] Button triggers notification if High/Critical
- [ ] Responsive design works

### Check-Out Flow
**URL:** http://localhost:3000/caregiver/checkout

- [ ] Page loads without errors
- [ ] Pre-checkout checklist displays
- [ ] Checklist items: medications logged, vitals recorded, incidents reported
- [ ] Each checklist item has checkbox
- [ ] Handover notes field displays
- [ ] "Complete Shift" button displays
- [ ] Button disabled until checklist complete
- [ ] Responsive design works

### Earnings Summary
**URL:** http://localhost:3000/caregiver/earnings

- [ ] Page loads without errors
- [ ] Weekly/Monthly/Total earnings display
- [ ] Tab toggle for time periods works
- [ ] Earnings list displays grouped by month
- [ ] Each entry shows job, dates, hours, amount, status (Paid/Pending)
- [ ] Status badges use appropriate colors
- [ ] Responsive design works

### Generate Invoice to Agency
**URL:** http://localhost:3000/caregiver/invoice

- [ ] Page loads without errors
- [ ] Invoice creation form displays
- [ ] Job selection dropdown displays
- [ ] Hours worked input displays
- [ ] Job completion details display
- [ ] Agreed wage displays/input
- [ ] Calculation displays (hours × wage)
- [ ] "Submit to Agency" button displays
- [ ] Responsive design works

### Messages Inbox
**URL:** http://localhost:3000/caregiver/messages

- [ ] Page loads without errors
- [ ] Conversations grouped (Guardian, Patient, Agency)
- [ ] Each conversation clickable
- [ ] Unread badges display
- [ ] Responsive design works

### Account Locked State
**URL:** http://localhost:3000/caregiver/account-locked

- [ ] Page loads without errors
- [ ] Restricted features list displays
- [ ] 🚫 Cannot accept new jobs, update availability, generate invoices
- [ ] ✅ Can complete existing jobs, communicate, make payment
- [ ] "Pay Outstanding Balance" button displays
- [ ] Responsive design works

---

## 🧑‍🦽 PATIENT PAGES (12 pages)

### Login
**URL:** http://localhost:3000/patient/login

- [ ] Page loads without errors
- [ ] Simplified login form displays (set up by Guardian)
- [ ] Yellow gradient theme applied (Patient colors)
- [ ] Login works
- [ ] Responsive design works

### Home / Dashboard
**URL:** http://localhost:3000/patient/dashboard

- [ ] Page loads without errors
- [ ] Greeting displays
- [ ] Today's caregiver card displays (photo, name, rating)
- [ ] "Chat" button displays on caregiver card
- [ ] Today's medications display with status
- [ ] Quick actions display (Emergency, Call Guardian)
- [ ] Bottom nav displays (mobile)
- [ ] Yellow theme applied
- [ ] Responsive design works

### My Caregiver
**URL:** http://localhost:3000/patient/caregiver

- [ ] Page loads without errors
- [ ] Caregiver profile displays (photo, name)
- [ ] Certifications list displays
- [ ] Skills list displays
- [ ] "Chat with Caregiver" button displays
- [ ] Button routes to chat
- [ ] Responsive design works

### Medication Schedule
**URL:** http://localhost:3000/patient/medications

- [ ] Page loads without errors
- [ ] Daily view grouped by time period displays
- [ ] Groups: Morning, Afternoon, Evening
- [ ] Each medication shows name, dosage, time
- [ ] Status displays (✓ Taken, ⏳ Due, ○ Scheduled)
- [ ] Given by info displays
- [ ] Responsive design works

### Medication Reminder
**URL:** http://localhost:3000/patient/medication-reminder

- [ ] Page loads without errors
- [ ] Push notification/in-app popup displays at scheduled time (mock)
- [ ] Medication name displays
- [ ] Time displays
- [ ] "Mark as Taken" button displays
- [ ] Responsive design works

### Care Logs View
**URL:** http://localhost:3000/patient/care-logs

- [ ] Page loads without errors
- [ ] Read-only timeline of care activities displays
- [ ] Categories: meals, exercises, vitals
- [ ] Simplified view (not editable)
- [ ] Timeline format displays
- [ ] Responsive design works

### Appointments/Schedule
**URL:** http://localhost:3000/patient/appointments

- [ ] Page loads without errors
- [ ] Upcoming appointments list displays
- [ ] Categories: doctor visits, therapy sessions, caregiver visits
- [ ] Daily schedule view displays
- [ ] Each appointment shows time, type, location
- [ ] Responsive design works

### Emergency Contacts
**URL:** http://localhost:3000/patient/emergency-contacts

- [ ] Page loads without errors
- [ ] Contact list displays
- [ ] Each contact shows relationship, phone
- [ ] "Call" button displays
- [ ] "Message" button displays
- [ ] Contacts: Guardian, Doctor, Hospital, Ambulance (999)
- [ ] Buttons trigger appropriate actions
- [ ] Responsive design works

### Emergency SOS
**URL:** http://localhost:3000/patient/emergency-sos

- [ ] Page loads without errors
- [ ] Large prominent SOS button displays
- [ ] Button is RED and obvious
- [ ] Confirmation dialog displays on click
- [ ] Confirmation explains what will happen
- [ ] Triggers: calls primary emergency contact + notifications to guardian + caregiver
- [ ] "Cancel" option in confirmation
- [ ] "Confirm Emergency" option in confirmation
- [ ] Responsive design works

### Rate Caregiver
**URL:** http://localhost:3000/patient/rate-caregiver

- [ ] Page loads without errors
- [ ] Star rating displays (1-5)
- [ ] Stars are clickable
- [ ] Quick tags display (Caring, Professional, Punctual, Skilled, Friendly)
- [ ] Tags are selectable
- [ ] Optional comments textarea displays
- [ ] "Submit Review" button displays
- [ ] Responsive design works

### Chat with Caregiver
**URL:** http://localhost:3000/patient/chat

- [ ] Page loads without errors
- [ ] Direct message thread displays
- [ ] Messages grouped by sender
- [ ] Text input displays
- [ ] Send button displays
- [ ] Simple interface (patient-friendly)
- [ ] Responsive design works

### Profile View (Read-Only)
**URL:** http://localhost:3000/patient/profile

- [ ] Page loads without errors
- [ ] Patient can view own info
- [ ] Cannot edit (Guardian manages)
- [ ] Info displays: name, age, conditions, medications
- [ ] "Managed by Guardian" message displays
- [ ] Responsive design works

---

## ⚖️ PLATFORM MODERATOR PAGES (25 pages)

### Login with MFA
**URL:** http://localhost:3000/moderator/login

- [ ] Page loads without errors
- [ ] Login form displays
- [ ] 6-digit MFA verification required after login
- [ ] MFA inputs display
- [ ] Red-orange gradient theme applied (Moderator colors)
- [ ] Login with MFA succeeds
- [ ] Routes to dashboard
- [ ] Responsive design works

### Dashboard
**URL:** http://localhost:3000/moderator/dashboard

- [ ] Page loads without errors
- [ ] KPI cards display (Pending Verifications with badge, Open Disputes, Active Caregivers, Active Agencies)
- [ ] Queue summary displays
- [ ] Quick access links display
- [ ] Links route correctly
- [ ] Red-orange theme applied
- [ ] Responsive design works

### Verification Queue - Agencies Tab
**URL:** http://localhost:3000/moderator/verification/agencies

- [ ] Page loads without errors
- [ ] Agency verification items display
- [ ] Each item shows company name, submitted date, documents
- [ ] "Review" button displays
- [ ] Button routes to review panel
- [ ] Responsive design works

### Verification Queue - Caregivers Tab
**URL:** http://localhost:3000/moderator/verification/caregivers

- [ ] Page loads without errors
- [ ] Caregiver verification items display
- [ ] Pipeline step indicator displays for each
- [ ] "Review" button displays
- [ ] Button routes to review panel
- [ ] Responsive design works

### Agency Verification Review Panel
**URL:** http://localhost:3000/moderator/verification/agencies/[id]

- [ ] Page loads without errors
- [ ] Document viewer displays (zoomable, download)
- [ ] Verification checklist displays (trade license valid, not expired, address matches, contact verified)
- [ ] Internal notes field displays
- [ ] TWO-TIER actions display: "Recommend Approval", "Request More Info", "Recommend Rejection"
- [ ] Admin approval notice displays
- [ ] Each action triggers appropriate flow
- [ ] Responsive design works

### Agency Legal Document Queue
**URL:** http://localhost:3000/moderator/queues/legal

- [ ] Page loads without errors
- [ ] Queue of legal doc submissions displays
- [ ] Each submission shows agency name, date
- [ ] "Review" button displays
- [ ] Button routes to review screen
- [ ] Responsive design works

### Agency Physical Verification Queue
**URL:** http://localhost:3000/moderator/queues/physical

- [ ] Page loads without errors
- [ ] Queue of physical verification submissions displays
- [ ] "Review" button displays
- [ ] Responsive design works

### Caregiver Certificate Queue
**URL:** http://localhost:3000/moderator/queues/certificates

- [ ] Page loads without errors
- [ ] Queue of certificate submissions displays
- [ ] "Review" button displays
- [ ] Responsive design works

### Caregiver Police Clearance Queue
**URL:** http://localhost:3000/moderator/queues/police

- [ ] Page loads without errors
- [ ] Queue of police clearance submissions displays
- [ ] "Review" button displays
- [ ] Responsive design works

### Caregiver Interview Queue
**URL:** http://localhost:3000/moderator/queues/interviews

- [ ] Page loads without errors
- [ ] Interview scheduling interface displays
- [ ] Results entry form displays
- [ ] Marks submission form displays
- [ ] "Submit Recommendation" button displays
- [ ] Responsive design works

### Caregiver Psychological Analysis Queue
**URL:** http://localhost:3000/moderator/queues/psych

- [ ] Page loads without errors
- [ ] Psych test results review displays
- [ ] Recommendation submission form displays
- [ ] "Submit to Admin" button displays
- [ ] Responsive design works

### Caregiver Verification Pipeline View
**URL:** http://localhost:3000/moderator/verification/caregivers/[id]

- [ ] Page loads without errors
- [ ] 6-step pipeline displays
- [ ] Steps: Certificates → Police Clearance → Interview → Psych Assessment → Document Check → Final Approval
- [ ] Current step highlighted
- [ ] Status for each step displays
- [ ] Progress indicator displays
- [ ] Responsive design works

### CV Pool Management
**URL:** http://localhost:3000/moderator/cv-pool

- [ ] Page loads without errors
- [ ] Searchable caregiver database displays
- [ ] Filters display (Skills, Location, Rating, Availability, Experience)
- [ ] Results table displays
- [ ] "View Profile" action displays
- [ ] Profile modal/page opens
- [ ] Responsive design works

### Dispute Center
**URL:** http://localhost:3000/moderator/disputes

- [ ] Page loads without errors
- [ ] Dispute list displays
- [ ] Status badge displays for each
- [ ] Type displays (payment, quality, etc.)
- [ ] Parties display
- [ ] Job reference displays
- [ ] "Assign to Me" button displays
- [ ] "View" button displays
- [ ] Buttons work correctly
- [ ] Responsive design works

### Dispute Detail
**URL:** http://localhost:3000/moderator/disputes/[id]

- [ ] Page loads without errors
- [ ] Case header displays (ID, status, time open)
- [ ] Parties info displays
- [ ] Evidence tabs display (Submitted Evidence, Care Logs, Payment Records, Messages)
- [ ] Tabs switch content
- [ ] Case timeline displays
- [ ] TWO-TIER resolution panel displays
- [ ] Decision dropdown displays
- [ ] Notes field displays (required)
- [ ] "Submit to Admin for Approval" button displays
- [ ] "Escalate to Admin" button displays for complex cases
- [ ] Responsive design works

### Support Tickets Queue
**URL:** http://localhost:3000/moderator/tickets

- [ ] Page loads without errors
- [ ] Ticket list displays
- [ ] Status filter displays
- [ ] Priority filter displays
- [ ] Type filters display
- [ ] "Respond" action displays
- [ ] Button routes to ticket response
- [ ] Responsive design works

### Ticket Response
**URL:** http://localhost:3000/moderator/tickets/[id]

- [ ] Page loads without errors
- [ ] Thread view of messages displays
- [ ] Reply textarea displays
- [ ] "Send Reply" button displays
- [ ] "Close Ticket" button displays
- [ ] "Escalate" button displays
- [ ] Buttons trigger appropriate actions
- [ ] Responsive design works

### Platform Analytics
**URL:** http://localhost:3000/moderator/analytics

- [ ] Page loads without errors
- [ ] Metrics dashboard displays
- [ ] User Growth chart displays
- [ ] Transaction Volume chart displays
- [ ] Dispute Rate chart displays
- [ ] Revenue Reports section displays
- [ ] Charts render correctly
- [ ] Responsive design works

### Messages / Communication
**URL:** http://localhost:3000/moderator/messages

- [ ] Page loads without errors
- [ ] Chat with Agencies displays
- [ ] Chat with Caregivers displays
- [ ] Chat with Guardians displays
- [ ] Chat with Admin (escalation) displays
- [ ] Conversations are selectable
- [ ] Responsive design works

### Settings
**URL:** http://localhost:3000/moderator/settings

- [ ] Page loads without errors
- [ ] Personal settings section displays
- [ ] Notification preferences display
- [ ] Settings are editable
- [ ] "Save" button displays
- [ ] Responsive design works

---

## 👑 PLATFORM ADMIN PAGES (29 pages)

### Login with MFA
**URL:** http://localhost:3000/admin/login

- [ ] Page loads without errors
- [ ] Secure authentication form displays
- [ ] Mandatory MFA verification displays after login
- [ ] MFA has logging/audit trail notice
- [ ] Purple gradient theme applied (Admin colors)
- [ ] Login succeeds with MFA
- [ ] Routes to dashboard
- [ ] Responsive design works

### MFA Failed - Error
**URL:** http://localhost:3000/admin/mfa-failed

- [ ] Page loads without errors
- [ ] Error display for failed authentication
- [ ] Attempt counter displays
- [ ] Retry option displays
- [ ] Contact support option displays
- [ ] Responsive design works

### Dashboard
**URL:** http://localhost:3000/admin/dashboard

- [ ] Page loads without errors
- [ ] Extended KPIs display: all Moderator KPIs + Total Platform Revenue, Active Moderators, System Health
- [ ] Each KPI card displays correctly
- [ ] Quick access links display
- [ ] Links route correctly
- [ ] Purple theme applied
- [ ] Responsive design works

### Moderator Management
**URL:** http://localhost:3000/admin/moderators

- [ ] Page loads without errors
- [ ] Moderator table displays (Name, Email, Status, Last Active, Workload)
- [ ] Table is sortable (if applicable)
- [ ] "Add Moderator" button displays
- [ ] Button routes to add moderator page
- [ ] Each row has actions (View, Edit, Deactivate)
- [ ] Responsive design works

### Add Moderator
**URL:** http://localhost:3000/admin/moderators/add

- [ ] Page loads without errors
- [ ] Form displays: Name, Email, Phone, permission level
- [ ] All fields work
- [ ] Permission level dropdown displays
- [ ] "Send Invite" button displays
- [ ] Button triggers invite flow
- [ ] Responsive design works

### Edit Moderator
**URL:** http://localhost:3000/admin/moderators/[id]

- [ ] Page loads without errors
- [ ] Update permissions section displays
- [ ] Deactivate account option displays
- [ ] "Save Changes" button displays
- [ ] "Deactivate" button displays with confirmation
- [ ] Responsive design works

### Moderator Submissions Queue
**URL:** http://localhost:3000/admin/submissions

- [ ] Page loads without errors
- [ ] Tabs display: Verifications, Disputes, Tickets, Deployments
- [ ] Tabs switch content
- [ ] All moderator submissions requiring admin decision display
- [ ] Each submission shows moderator, date, type
- [ ] "Review" button displays
- [ ] Responsive design works

### Submission Review Panel
**URL:** http://localhost:3000/admin/submissions/[id]

- [ ] Page loads without errors
- [ ] Moderator's submission summary displays
- [ ] Recommendation displays
- [ ] Notes display
- [ ] Original data displays
- [ ] Documents display
- [ ] Verification checklist displays
- [ ] Admin decision panel displays
- [ ] Responsive design works

### Admin Decision (3-Way)
**URL:** Within submission review panel

- [ ] "Approve" button displays (finalize and activate)
- [ ] "Send Back to Moderator" button displays (return with feedback)
- [ ] "Override & Reject" button displays (reject regardless)
- [ ] Feedback notes field displays
- [ ] Each button triggers appropriate action
- [ ] Confirmation dialogs display for critical actions
- [ ] Responsive design works

### Agency Legal Doc Review
**URL:** http://localhost:3000/admin/review/legal

- [ ] Page loads without errors
- [ ] Review moderator's legal document verification submission
- [ ] 3-way decision panel displays
- [ ] Responsive design works

### Agency Physical Verification Review
**URL:** http://localhost:3000/admin/review/physical

- [ ] Page loads without errors
- [ ] Review moderator's physical verification submission
- [ ] 3-way decision panel displays
- [ ] Responsive design works

### Caregiver Certificate Review
**URL:** http://localhost:3000/admin/review/certificates

- [ ] Page loads without errors
- [ ] Review moderator's certificate verification
- [ ] 3-way decision panel displays
- [ ] Responsive design works

### Caregiver Police Clearance Review
**URL:** http://localhost:3000/admin/review/police

- [ ] Page loads without errors
- [ ] Review moderator's police clearance verification
- [ ] 3-way decision panel displays
- [ ] Responsive design works

### Caregiver Interview Review
**URL:** http://localhost:3000/admin/review/interviews

- [ ] Page loads without errors
- [ ] Review moderator's interview marks/recommendation
- [ ] 3-way decision panel displays
- [ ] Responsive design works

### Caregiver Psych Analysis Review
**URL:** http://localhost:3000/admin/review/psych

- [ ] Page loads without errors
- [ ] Review moderator's psychological analysis recommendation
- [ ] 3-way decision panel displays
- [ ] Responsive design works

### Caregiver Direct Verification Queue
**URL:** http://localhost:3000/admin/verification/caregivers

- [ ] Page loads without errors
- [ ] Direct admin verification queue displays (bypassing moderator)
- [ ] Verification items display
- [ ] "Review" button displays
- [ ] Responsive design works

### Agency Verification Queue
**URL:** http://localhost:3000/admin/verification/agencies

- [ ] Page loads without errors
- [ ] Direct admin verification queue displays
- [ ] Agency items display
- [ ] "Review" button displays
- [ ] Responsive design works

### Dispute Center (Escalated)
**URL:** http://localhost:3000/admin/disputes

- [ ] Page loads without errors
- [ ] Complex disputes escalated from moderators display
- [ ] Same resolution panel as moderator (but final authority)
- [ ] "Approve Moderator Decision" option
- [ ] "Override Decision" option
- [ ] Responsive design works

### CV Pool Management
**URL:** http://localhost:3000/admin/cv-pool

- [ ] Page loads without errors
- [ ] Admin access to caregiver CV pool with full controls
- [ ] Same interface as moderator CV pool
- [ ] Additional admin actions available
- [ ] Responsive design works

### Support Tickets (Escalated)
**URL:** http://localhost:3000/admin/tickets

- [ ] Page loads without errors
- [ ] Escalated tickets from moderators display
- [ ] Ticket details display
- [ ] Response interface displays
- [ ] Responsive design works

### Platform Analytics
**URL:** http://localhost:3000/admin/analytics

- [ ] Page loads without errors
- [ ] Charts display: User Growth (line), Transaction Volume (bar), Revenue Trends (line)
- [ ] Geographic Distribution map displays
- [ ] Device Breakdown pie chart displays
- [ ] Filters display (date, entity, region)
- [ ] Export options display (PDF/CSV)
- [ ] Charts render correctly
- [ ] Filters work
- [ ] Responsive design works

### Audit Logs
**URL:** http://localhost:3000/admin/audit-logs

- [ ] Page loads without errors
- [ ] Log viewer displays
- [ ] Filters display (Date, Entity, Action, User, Result)
- [ ] Results table displays
- [ ] Log entry detail view available (timestamp, user, action, target, before/after values, IP, device, session, result/error)
- [ ] Export options display (CSV/JSON)
- [ ] Filters work
- [ ] Table is sortable/searchable
- [ ] Responsive design works

### System Settings
**URL:** http://localhost:3000/admin/system-settings

- [ ] Page loads without errors
- [ ] Commission settings section displays
- [ ] Commission rate inputs work
- [ ] Feature flags section displays (Marketplace, Shop, AI)
- [ ] Feature toggles work
- [ ] Content management section displays (Terms, Privacy, FAQ)
- [ ] Rich text editor displays (if applicable)
- [ ] Maintenance mode toggle displays
- [ ] Announcement banner input displays
- [ ] "Save Settings" button displays
- [ ] Responsive design works

### Locked Accounts
**URL:** http://localhost:3000/admin/locked-accounts

- [ ] Page loads without errors
- [ ] List of payment-locked accounts displays
- [ ] Each account shows type, locked duration, outstanding amount
- [ ] "View Details" button displays
- [ ] "Manual Unlock" button displays
- [ ] Buttons work correctly
- [ ] Responsive design works

### Manual Unlock
**URL:** Within locked accounts detail

- [ ] Admin unlock interface displays
- [ ] Reason field displays (e.g., payment arrangement made)
- [ ] "Confirm Unlock" button displays
- [ ] Confirmation required before unlock
- [ ] Responsive design works

### Messages / Communication
**URL:** http://localhost:3000/admin/messages

- [ ] Page loads without errors
- [ ] Chat with all entity types displays
- [ ] Chat with moderators displays
- [ ] Conversations are organized
- [ ] Responsive design works

### Billing Management
**URL:** http://localhost:3000/admin/billing

- [ ] Page loads without errors
- [ ] Platform-wide billing overview displays
- [ ] Commission tracking displays
- [ ] Revenue summary displays
- [ ] Responsive design works

### Template Editors

**Agency Package Template:**
**URL:** http://localhost:3000/admin/templates/agency-package

- [ ] Page loads without errors
- [ ] Template creation interface displays
- [ ] Category selector displays
- [ ] Services included multi-input displays
- [ ] Pricing guidelines input displays
- [ ] "Save Template" button displays
- [ ] Responsive design works

**Caregiver Package Template:**
**URL:** http://localhost:3000/admin/templates/caregiver-package

- [ ] Page loads without errors
- [ ] Template creation interface displays
- [ ] Similar to agency template
- [ ] Responsive design works

### Subscription Package Creators

**Agency Subscription:**
**URL:** http://localhost:3000/admin/subscription/agency

- [ ] Page loads without errors
- [ ] Create subscription plans interface displays
- [ ] Basic/Premium/Enterprise tier inputs display
- [ ] Pricing inputs work
- [ ] Duration inputs work
- [ ] Features list inputs work
- [ ] "Publish" button displays
- [ ] Responsive design works

**Caregiver Subscription:**
**URL:** http://localhost:3000/admin/subscription/caregiver

- [ ] Page loads without errors
- [ ] Create caregiver subscription plans interface displays
- [ ] Similar to agency subscription
- [ ] Responsive design works

---

## 🏪 SHOP ADMIN PAGES (15 pages)

### Registration
**URL:** http://localhost:3000/shop/registration

- [ ] Page loads without errors
- [ ] Shop details form displays
- [ ] Shop name input works
- [ ] Trade license input works
- [ ] TIN input works (optional)
- [ ] Owner name input works
- [ ] Contact phone input works
- [ ] Address input works
- [ ] Document upload displays
- [ ] "Submit for Verification" button displays
- [ ] Cyan-blue gradient theme applied (Shop colors)
- [ ] Responsive design works

### Pending Verification
**URL:** http://localhost:3000/shop/pending-verification

- [ ] Page loads without errors
- [ ] Verification status screen displays
- [ ] Estimated time displays (24-48 hours)
- [ ] Document status displays
- [ ] Responsive design works

### Dashboard
**URL:** http://localhost:3000/shop/dashboard

- [ ] Page loads without errors
- [ ] KPI cards display (Today's Orders, Revenue This Month, Pending Orders, Low Stock)
- [ ] Quick actions display (+Add Product, View Orders)
- [ ] Quick actions route correctly
- [ ] Cyan-blue theme applied
- [ ] Responsive design works

### Product Management
**URL:** http://localhost:3000/shop/products

- [ ] Page loads without errors
- [ ] Product list displays
- [ ] Each product shows image, name, status, category, price, stock
- [ ] "Edit" action displays
- [ ] "Deactivate" action displays
- [ ] "+ Add Product" button displays
- [ ] Actions work correctly
- [ ] Responsive design works

### Add/Edit Product
**URL:** http://localhost:3000/shop/products/new & /[id]

- [ ] Page loads without errors
- [ ] Multiple images upload area displays
- [ ] Name input works
- [ ] Description textarea works
- [ ] Category dropdown displays (Medicines, Equipment Sale/Rental, Services)
- [ ] Price input works
- [ ] Stock quantity input works
- [ ] Active toggle displays
- [ ] "Save Product" button displays
- [ ] Responsive design works

### Order Management
**URL:** http://localhost:3000/shop/orders

- [ ] Page loads without errors
- [ ] Order list displays
- [ ] Each order shows ID, status badge, items count, total, customer, time
- [ ] Status badges use appropriate colors
- [ ] "Process" button displays
- [ ] Button routes to order detail
- [ ] Responsive design works

### Order Detail
**URL:** http://localhost:3000/shop/orders/[id]

- [ ] Page loads without errors
- [ ] Items list displays
- [ ] Customer info displays
- [ ] Shipping address displays
- [ ] Status workflow displays (Pending → Processing → Shipped → Delivered)
- [ ] Current status highlighted
- [ ] "Update Status" button displays
- [ ] Responsive design works

### Update Order Status
**URL:** http://localhost:3000/shop/orders/[id]/update-status

- [ ] Page loads without errors
- [ ] Accept order option displays
- [ ] Process (pack) option displays
- [ ] Ship option displays (add tracking)
- [ ] Mark delivered option displays
- [ ] Tracking number input displays (when shipping)
- [ ] "Update" button displays
- [ ] Flow progresses correctly
- [ ] Responsive design works

### Messages Inbox
**URL:** http://localhost:3000/shop/messages

- [ ] Page loads without errors
- [ ] Customer inquiries display
- [ ] Platform support conversations display
- [ ] Each conversation clickable
- [ ] Responsive design works

### Shop Analytics
**URL:** http://localhost:3000/shop/analytics

- [ ] Page loads without errors
- [ ] Sales over time chart displays
- [ ] Top products list displays
- [ ] Revenue by category chart displays
- [ ] Charts render correctly
- [ ] Responsive design works

### Billing
**URL:** http://localhost:3000/shop/billing

- [ ] Page loads without errors
- [ ] Platform subscription fee displays
- [ ] Commission on sales displays
- [ ] Invoice list displays
- [ ] Responsive design works

### Payment Enforcement Flow

**Payment Reminder (Day 3):**
**URL:** http://localhost:3000/shop/payment-reminder

- [ ] Page loads without errors
- [ ] Same pattern as Guardian payment reminder
- [ ] Responsive design works

**Payment Warning (Day 5):**
**URL:** http://localhost:3000/shop/payment-warning

- [ ] Page loads without errors
- [ ] Same pattern as Guardian
- [ ] Responsive design works

**Payment Final Warning (Day 6):**
**URL:** http://localhost:3000/shop/payment-final-warning

- [ ] Page loads without errors
- [ ] Same pattern as Guardian
- [ ] Responsive design works

**Account Locked (Day 7+):**
**URL:** http://localhost:3000/shop/account-locked

- [ ] Page loads without errors
- [ ] Restricted features list displays
- [ ] 🚫 Cannot list new products, process new orders, update listings
- [ ] ✅ Can fulfill existing orders, make payment
- [ ] "Pay Outstanding Balance" button displays
- [ ] Responsive design works

---

## 🏬 SHOP MANAGER PAGES (10 pages)

### Login
**URL:** http://localhost:3000/shop-manager/login

- [ ] Page loads without errors
- [ ] Standard login form displays
- [ ] Cyan-blue gradient theme
- [ ] Login works
- [ ] Routes to dashboard
- [ ] Responsive design works

### Dashboard
**URL:** http://localhost:3000/shop-manager/dashboard

- [ ] Page loads without errors
- [ ] Restrictions banner displays ("Manager Access - Operations only")
- [ ] KPIs display (Pending Orders, Processing, Low Stock Items)
- [ ] Quick access links display
- [ ] Responsive design works

### Order Queue
**URL:** http://localhost:3000/shop-manager/orders

- [ ] Page loads without errors
- [ ] Incoming orders view displays
- [ ] Status update flow displays (Confirm → Process → Ship → Complete)
- [ ] Cannot change pricing (restriction enforced)
- [ ] Cannot issue refunds (restriction enforced)
- [ ] Order cards display
- [ ] "Process" action displays
- [ ] Responsive design works

### Order Detail
**URL:** http://localhost:3000/shop-manager/orders/[id]

- [ ] Page loads without errors
- [ ] View order details
- [ ] Update status interface displays
- [ ] Add tracking number option displays
- [ ] Restrictions enforced (no pricing changes)
- [ ] Responsive design works

### Inventory Management
**URL:** http://localhost:3000/shop-manager/inventory

- [ ] Page loads without errors
- [ ] Inventory list displays
- [ ] Stock levels display for each item
- [ ] Low stock items highlighted
- [ ] "Update Stock" action displays
- [ ] Action routes to update page
- [ ] Responsive design works

### Update Stock
**URL:** http://localhost:3000/shop-manager/inventory/update

- [ ] Page loads without errors
- [ ] Product selection displays
- [ ] Adjust quantity form displays
- [ ] Stock note field displays
- [ ] "Save" button displays
- [ ] Responsive design works

### Low Stock Alerts
**URL:** http://localhost:3000/shop-manager/alerts

- [ ] Page loads without errors
- [ ] Items below threshold list displays
- [ ] Each item shows current stock, threshold
- [ ] "Notify Admin" action displays
- [ ] Action triggers notification
- [ ] Responsive design works

### Customer Inquiries
**URL:** http://localhost:3000/shop-manager/inquiries

- [ ] Page loads without errors
- [ ] Inquiry queue displays
- [ ] Customer questions display
- [ ] "Respond" button displays
- [ ] "Escalate to Admin" button displays
- [ ] Buttons work correctly
- [ ] Responsive design works

### Chat with Shop Admin
**URL:** http://localhost:3000/shop-manager/chat

- [ ] Page loads without errors
- [ ] Internal communication channel displays
- [ ] Message thread displays
- [ ] Text input displays
- [ ] Send button works
- [ ] Responsive design works

### View Restrictions Summary
**URL:** http://localhost:3000/shop-manager/restrictions

- [ ] Page loads without errors
- [ ] Table showing allowed vs restricted displays
- [ ] Allowed (✅): View/Process orders, Update inventory, Respond to inquiries, Chat
- [ ] Restricted (❌): Change pricing, Add/remove products, Manage billing, Run promotions
- [ ] Information is clear and organized
- [ ] Responsive design works

---

## 🔄 CROSS-CUTTING FEATURES

### Responsive Design Testing

Test on each screen size:

#### Mobile (375px)
- [ ] Landing page stacks vertically
- [ ] Login form is full width with padding
- [ ] Role selection cards stack
- [ ] Dashboard cards stack in single column
- [ ] Navigation menu works (hamburger if applicable)
- [ ] Bottom nav displays on mobile (if applicable)
- [ ] Text remains readable
- [ ] Buttons are tappable (min 44x44px)
- [ ] No horizontal scrolling
- [ ] Forms are usable
- [ ] Tables scroll horizontally if needed

#### Tablet (768px)
- [ ] Landing page uses grid layout
- [ ] Dashboards use 2-column grid
- [ ] Forms use appropriate width
- [ ] Navigation adapts appropriately
- [ ] Cards display in rows
- [ ] All content visible and accessible

#### Desktop (1440px)
- [ ] Landing page centered with max-width
- [ ] Dashboards use 3+ column grid
- [ ] Proper spacing and whitespace
- [ ] Content doesn't stretch too wide
- [ ] Forms are centered with max-width
- [ ] Optimal reading line length

### Navigation Testing

- [ ] Browser back button works on all pages
- [ ] Forward button works after going back
- [ ] "Back" buttons on pages work
- [ ] Breadcrumbs work (if present)
- [ ] All internal links route correctly
- [ ] External links open in new tab (Terms, Privacy footer links)
- [ ] Bottom nav works on mobile (if applicable)
- [ ] Tab navigation works (keyboard)

### Form Testing

- [ ] All input fields accept text
- [ ] Phone inputs validate BD format (01XXXXXXXXX)
- [ ] Email inputs validate email format
- [ ] Password fields have min length validation (6-8 characters)
- [ ] Required field indicators display (*)
- [ ] Error messages display on invalid input
- [ ] Error messages are descriptive
- [ ] Success messages display after submission
- [ ] Submit buttons disabled when form invalid
- [ ] Submit buttons enabled when form valid
- [ ] Enter key submits forms (where appropriate)

### Interactive Elements Testing

- [ ] All buttons are clickable/tappable
- [ ] Buttons show hover state on desktop
- [ ] Buttons show active/pressed state
- [ ] Toggles switch on/off
- [ ] Checkboxes check/uncheck
- [ ] Radio buttons select/deselect
- [ ] Dropdowns open and options are selectable
- [ ] File upload triggers file picker
- [ ] Tabs switch content
- [ ] Accordions expand/collapse
- [ ] Modals/dialogs open and close
- [ ] Modal backdrop closes modal on click
- [ ] Tooltips display on hover (if present)

### Visual Consistency Testing

- [ ] All pages use correct role-based gradient
- [ ] All cards use finance-card glassmorphic style
- [ ] All buttons use radial gradients
- [ ] Text colors are consistent (#535353 headers, #848484 body)
- [ ] Spacing is consistent (p-4, p-6, p-8)
- [ ] Border radius is consistent (rounded-2xl, rounded-3xl)
- [ ] Font sizes are consistent
- [ ] Icons are consistent (Lucide React)
- [ ] Shadows are consistent
- [ ] No color inconsistencies
- [ ] No spacing inconsistencies

### Performance Testing

- [ ] Pages load within 2 seconds (on localhost)
- [ ] No console errors on page load
- [ ] No console warnings (or acceptable warnings only)
- [ ] Images load properly
- [ ] No broken images
- [ ] No layout shift during load
- [ ] Smooth scrolling
- [ ] Smooth animations/transitions
- [ ] No janky interactions

### Browser Compatibility Testing

Test on:

#### Chrome
- [ ] All pages load
- [ ] All features work
- [ ] No visual issues

#### Firefox
- [ ] All pages load
- [ ] All features work
- [ ] No visual issues

#### Safari (if on Mac)
- [ ] All pages load
- [ ] All features work
- [ ] No visual issues

#### Edge
- [ ] All pages load
- [ ] All features work
- [ ] No visual issues

---

## 🐛 ISSUES FOUND

Use this section to track any bugs or issues discovered during testing:

### Critical Issues
1. 
2. 
3. 

### Major Issues
1. 
2. 
3. 

### Minor Issues
1. 
2. 
3. 

### Visual Issues
1. 
2. 
3. 

### Responsive Issues
1. 
2. 
3. 

---

## ✅ TESTING COMPLETION

- [ ] All 196 pages tested
- [ ] All navigation flows tested
- [ ] All forms tested
- [ ] Responsive design tested on all breakpoints
- [ ] Cross-browser testing completed
- [ ] Issues documented
- [ ] Critical issues reported to development team

**Date Completed:** _______________  
**Tested By:** _______________  
**Total Issues Found:** _______________  
**Time Taken:** _______________ hours

---

## 📝 NOTES

Add any additional observations, suggestions, or feedback here:


