# CareNet Platform - Complete Page Inventory

**Generated from:** FigJam Workflow Data (15 workflows, 9 entities)  
**Purpose:** Comprehensive page list for Figma design implementation  
**Version:** 1.0  
**Date:** December 2024

---

## Overview

| Entity | Page Count |
|--------|------------|
| Shared/Authentication | 12 |
| Guardian | 22 |
| Agency Admin | 24 |
| Agency Manager | 8 |
| Caregiver | 26 |
| Patient | 12 |
| Platform Moderator | 28 |
| Platform Admin | 32 |
| Shop Admin | 16 |
| Shop Manager | 10 |
| **TOTAL** | **190** |

---

## 1. SHARED / AUTHENTICATION PAGES

| SL | Entity | Page Name | Page Content Description |
|----|--------|-----------|--------------------------|
| 1 | Shared | Landing Page | Public homepage with hero section, value proposition, "Browse Agencies" CTA, role selection for registration, testimonials, footer |
| 2 | Shared | Login | Phone number input (BD format), password field with visibility toggle, "Forgot Password" link, "Register" link, login button with loading state |
| 3 | Shared | Role Selection | Card-based role picker: Guardian (family icon), Agency (building icon), Caregiver (heart icon) - each with description and navigation |
| 4 | Shared | MFA Verification | 6-digit code input with auto-advance, "Use backup code" link, session timer, verification button (for Admin/Moderator) |
| 5 | Shared | Password Reset - Step 1 | Phone number input, "Send Reset Code" button |
| 6 | Shared | Password Reset - Step 2 | OTP verification (6 digits), resend timer |
| 7 | Shared | Password Reset - Step 3 | New password input, confirm password, "Reset Password" button |
| 8 | Shared | Password Reset - Success | Success message, auto-redirect to login |
| 9 | Shared | Terms & Conditions | Full terms document, accept checkbox |
| 10 | Shared | Privacy Policy | Full privacy policy document |
| 11 | Shared | 404 Not Found | Friendly error page with navigation back |
| 12 | Shared | Offline State | PWA offline indicator with cached content access |

---

## 2. GUARDIAN PAGES

| SL | Entity | Page Name | Page Content Description |
|----|--------|-----------|--------------------------|
| 13 | Guardian | Registration Step 1 | Phone number, email (optional), password, confirm password, progress indicator (1/3) |
| 14 | Guardian | Registration Step 2 | OTP verification with masked phone, 6-digit input, resend timer, progress indicator (2/3) |
| 15 | Guardian | Registration Step 3 | Full name, profile photo upload, language preference, terms/privacy checkboxes, progress indicator (3/3) |
| 16 | Guardian | Dashboard | Greeting with name, quick action buttons (+ Patient, Browse Packages), patient cards list, recent activity feed, bottom nav |
| 17 | Guardian | Add Patient | Bottom sheet/modal with: name, DOB, gender, blood group, photo upload, medical conditions multi-select, allergies, mobility level, cognitive status, address, emergency contact |
| 18 | Guardian | Patient Detail | Patient header card, tab bar (Overview, Health, Care Logs, Jobs), quick actions (Edit, Upload Prescription, Book Care) |
| 19 | Guardian | Patient Health Records | Document list with type filters, upload button (FAB), document cards with view/download/delete actions |
| 20 | Guardian | Prescription Upload (AI OCR) | Image/PDF upload, "Scan with AI" button, extracted medications table (editable), "Confirm & Save" button |
| 21 | Guardian | Browse Packages | Sticky search bar, filter button → bottom sheet filters (location, category, price range, duration, rating), package cards with agency info, price, services |
| 22 | Guardian | Package Filters | Bottom sheet with: area selector, category checkboxes, price slider, duration options, minimum rating stars |
| 23 | Guardian | Package Detail | Full-width header, description, inclusions/exclusions lists, pricing breakdown, agency info card, sticky bottom bar with "Book Now" and "Request Custom Quote" |
| 24 | Guardian | Negotiation - Send Counter-Offer | Bottom sheet with modified requirements text area, proposed price, message field, "Send Request" button |
| 25 | Guardian | Negotiation - Wait for Response | Status indicator showing "Waiting for agency response", timer, view sent offer details |
| 26 | Guardian | Negotiation - Review Agency Response | Agency's counter-offer display, Accept/Counter Again/Browse Others options |
| 27 | Guardian | Active Jobs List | Tab filter (Active, Completed, Disputed), job cards with status badge, patient name, package, caregiver, dates |
| 28 | Guardian | Job Detail | Tabs (Overview, Care Logs, Vitals, Meds), caregiver card with Message button, schedule, actions (Report Issue, Rate & Review) |
| 29 | Guardian | Messages Inbox | Conversation list grouped by contact type (Caregiver, Agency, Support), unread badges |
| 30 | Guardian | Chat Screen | Message thread, text input, attachment button, voice input option |
| 31 | Guardian | Billing - Agency Invoices | Invoice list from agencies with status (Paid, Pending, Overdue), "Pay" action |
| 32 | Guardian | Billing - Platform Invoices | Platform subscription invoices if applicable |
| 33 | Guardian | Payment Reminder (Day 3) | Banner/notification: "Invoice #X is due in 4 days", amount, "Pay Now" and "Dismiss" buttons |
| 34 | Guardian | Payment Warning (Day 5) | Urgent banner: "Account will be restricted in 2 days", "Pay Now" button |
| 35 | Guardian | Payment Final Warning (Day 6) | Full-screen warning with list of features that will be locked, prominent "Pay Now" button |
| 36 | Guardian | Account Locked (Day 7+) | Locked state screen showing what's restricted (🚫) and allowed (✅), outstanding balance, "Pay Outstanding Balance" button |

---

## 3. AGENCY ADMIN PAGES

| SL | Entity | Page Name | Page Content Description |
|----|--------|-----------|--------------------------|
| 37 | Agency Admin | Registration Step 1-2 | Same as Guardian (phone, OTP verification) |
| 38 | Agency Admin | Registration Step 3 | Company name, trade license number, TIN (optional), contact person, contact phone, company address with area/zone selector |
| 39 | Agency Admin | Registration Step 4 | Trade license upload (required), TIN certificate (optional), company logo (optional), drag-drop zone with preview |
| 40 | Agency Admin | Registration Step 5 | Payout setup: payment method selection (bKash/Nagad/Bank), account details, "Submit for Verification" button |
| 41 | Agency Admin | Pending Verification | Status screen showing "Under Review", estimated time (24-48 hours), document upload status |
| 42 | Agency Admin | Rejection View | Rejection reasons displayed, resubmission instructions, "Edit & Resubmit" button |
| 43 | Agency Admin | Onboarding | Service zone selection (map/area picker), payment method configuration, initial package creation prompt |
| 44 | Agency Admin | Dashboard | KPI cards (Caregivers, Active Jobs, Revenue, Rating), job pipeline summary, quick actions (+Create Package, +Add Caregiver, View All Jobs) |
| 45 | Agency Admin | Subscription Plans | Plan cards (Basic/Premium/Enterprise), feature comparison table, current plan highlight, "Subscribe"/"Upgrade" buttons |
| 46 | Agency Admin | Subscription Active | Current plan card with renewal date, features list, "Change Plan" and "Manage Payment" buttons |
| 47 | Agency Admin | Caregiver Roster | Search bar, filter chips (Status, Skills, Availability), caregiver cards with photo, rating, skills tags, "View"/"Assign" buttons |
| 48 | Agency Admin | Add Caregiver Options | Options: "From CV Pool" (search verified caregivers) or "Register New" (internal form) |
| 49 | Agency Admin | Caregiver Pool Search | Advanced search with filters (skills, location, rating, availability, experience), results grid, caregiver profile preview |
| 50 | Agency Admin | Caregiver Profile View | Full profile with photo, certifications, ratings, reviews, availability calendar, "Contact"/"Send Job Offer" buttons |
| 51 | Agency Admin | Package Management | Package cards with status badge, category, price, bookings count, "Edit"/"Duplicate" actions |
| 52 | Agency Admin | Create/Edit Package | Form: name, category, description, pricing, duration, hours/day, inclusions (tag input), exclusions, active toggle, preview button |
| 53 | Agency Admin | Package Inquiries | List of counter-offers from guardians, each with proposed changes, "Review" button |
| 54 | Agency Admin | Review Counter-Offer | Original package vs proposed changes comparison, response options (Offer Discount, Add Services, Decline) |
| 55 | Agency Admin | Job Inbox | Tabs (New, Assigned, Active, Completed), job cards with status, patient, package, dates |
| 56 | Agency Admin | New Job - Needs Assignment | Job card showing patient info, package, start date, guardian, "Assign Caregiver" button |
| 57 | Agency Admin | Assign Caregiver Flow | Bottom sheet with job summary, available caregivers list (filtered), skills match %, workload indicator, schedule setter, conflict detection |
| 58 | Agency Admin | Messages Inbox | Grouped conversations: Caregivers, Guardians, Support |
| 59 | Agency Admin | Billing & Finance | Summary cards (Total Earned, This Month, Pending Payout, Commission Paid), incoming invoices (from Guardians), outgoing (to Caregivers), platform charges |
| 60 | Agency Admin | Account Locked State | Same pattern as Guardian - restricted features list, "Pay Outstanding Balance" |

---

## 4. AGENCY MANAGER PAGES

| SL | Entity | Page Name | Page Content Description |
|----|--------|-----------|--------------------------|
| 61 | Agency Manager | Login | Standard login (no MFA required) |
| 62 | Agency Manager | Dashboard | Restrictions banner explaining limited access, KPI cards (Quality Score, Active Jobs, Open Feedback, Incidents), quick access links |
| 63 | Agency Manager | QA Dashboard | Quality metrics cards (Average Rating, On-time Check-in Rate, Care Log Completion, Incident Rate), caregiver quality table with ratings |
| 64 | Agency Manager | Quality Alerts | Flagged items: low ratings, missed check-ins, incomplete logs |
| 65 | Agency Manager | Feedback Queue | Feedback list with status (Pending Response, Responded), guardian info, job reference, "View"/"Respond" buttons |
| 66 | Agency Manager | Respond to Feedback | Original feedback display, response text area, "Send Response" button |
| 67 | Agency Manager | Reports | Report type selection (Performance, Quality, Activity), date range picker, "Generate" button, preview, export options (PDF/CSV) |
| 68 | Agency Manager | View Assignments (Read-Only) | Assignment list showing caregiver assignments, job details - view only, cannot edit |

---

## 5. CAREGIVER PAGES

| SL | Entity | Page Name | Page Content Description |
|----|--------|-----------|--------------------------|
| 69 | Caregiver | Registration Step 1-2 | Phone verification same as others |
| 70 | Caregiver | Registration Step 3 | Full name, DOB (must be 18+), gender, current address, profile photo (required) |
| 71 | Caregiver | Registration Step 4 | NID number input, NID front photo upload, NID back photo upload |
| 72 | Caregiver | Registration Step 5 | Skills multi-select (min 1), certifications upload, years of experience, languages, expected hourly rate (optional) |
| 73 | Caregiver | Registration Step 6 | Weekly calendar grid, per-day availability toggle with time range pickers, "Submit for Verification" button |
| 74 | Caregiver | Pending Verification | 6-step pipeline status display, current step highlighted, estimated time for each step |
| 75 | Caregiver | Verification Step - Certificates | Status: Submitted/Under Review/Approved/Needs Resubmission, resubmit option if rejected |
| 76 | Caregiver | Verification Step - Police Clearance | Upload police clearance document, submission status |
| 77 | Caregiver | Verification Step - Interview | Schedule interview screen, interview confirmation, results pending |
| 78 | Caregiver | Verification Step - Psychological Test | Online assessment instructions, start test button, results pending |
| 79 | Caregiver | Verification Step - Document Check | Final document verification status |
| 80 | Caregiver | Verification Complete | Success screen with "VERIFICATION COMPLETE" message, next steps |
| 81 | Caregiver | Verification Failed | Failure screen with rejection reasons, reapplication info |
| 82 | Caregiver | Home Screen / Dashboard | Greeting, today's schedule card with patient info and Navigate/Check-In buttons, weekly stats, upcoming jobs list, bottom nav |
| 83 | Caregiver | Subscription Plans | Caregiver-specific subscription packages, comparison, subscribe button |
| 84 | Caregiver | My Jobs List | Tabs (Today, Upcoming, Completed), job cards with patient name, dates, times, location, conditions |
| 85 | Caregiver | Job Detail | Patient info card (name, age, conditions, allergies RED highlight, mobility, special instructions), medication schedule, calendar view, action buttons (Navigate, Check In, Contact Guardian, Emergency Call) |
| 86 | Caregiver | Job Offer Notification | Push/in-app: patient info, dates, shift times, location, wage, required conditions/skills, Accept/Decline buttons |
| 87 | Caregiver | Check-In Step 1 - Location | GPS verification loading animation, "Verifying Location..." message |
| 88 | Caregiver | Check-In - Location Mismatch | Warning dialog with note field (required), "Cancel" and "Proceed with Override" buttons |
| 89 | Caregiver | Check-In Step 2 - Photo | Camera viewfinder, "Capture" button for arrival confirmation photo |
| 90 | Caregiver | Check-In Step 3 - Confirmation | Success screen with check-in time, location verified badge, "Start Care Session" button |
| 91 | Caregiver | Care Log Interface | Today's entries timeline, log type buttons (Vitals, Medication, Activity/Note, Incident/Alert) |
| 92 | Caregiver | Care Log - Vitals | Bottom sheet: BP (systolic/diastolic), heart rate, temperature, blood glucose, oxygen - all optional, abnormal detection alert |
| 93 | Caregiver | Care Log - Medication | Bottom sheet: scheduled medications list with time/drug/dosage, "Given"/"Skipped" (with reason), photo capture option |
| 94 | Caregiver | Care Log - Activity | Bottom sheet: activity type dropdown, notes field, voice input button (EN/BN), photo upload, AI transcription preview |
| 95 | Caregiver | Care Log - Incident | Bottom sheet: incident type (Fall, Emergency, Behavioral, Equipment, Other), severity (Low-Critical), description, action taken, photo/video upload, immediate notification for High/Critical |
| 96 | Caregiver | Check-Out Flow | Pre-checkout checklist (medications logged, vitals recorded, incidents reported), handover notes field, "Complete Shift" button |
| 97 | Caregiver | Earnings Summary | Weekly/Monthly/Total earnings display, earnings list grouped by month, job, dates, hours, amount, status (Paid/Pending) |
| 98 | Caregiver | Generate Invoice to Agency | Invoice creation for completed job: hours worked, job completion details, agreed wage, "Submit to Agency" button |
| 99 | Caregiver | Messages Inbox | Conversations grouped: Guardian, Patient, Agency |
| 100 | Caregiver | Account Locked State | Restricted features (🚫 Cannot accept new jobs, update availability, generate invoices; ✅ Can complete existing jobs, communicate, make payment), "Pay Outstanding Balance" button |

---

## 6. PATIENT PAGES

| SL | Entity | Page Name | Page Content Description |
|----|--------|-----------|--------------------------|
| 101 | Patient | Login | Simplified login for patient (set up by Guardian) |
| 102 | Patient | Home / Dashboard | Greeting, today's caregiver card (photo, name, rating, "Chat" button), today's medications with status, quick actions (Emergency, Call Guardian), bottom nav |
| 103 | Patient | My Caregiver | Caregiver profile: photo, name, certifications, skills, "Chat with Caregiver" button |
| 104 | Patient | Medication Schedule | Daily view grouped by time period (Morning, Afternoon, Evening), each medication with name, dosage, time, status (✓ Taken, ⏳ Due, ○ Scheduled), given by info |
| 105 | Patient | Medication Reminder | Push notification/in-app popup at scheduled time |
| 106 | Patient | Care Logs View | Read-only timeline of all care activities: meals, exercises, vitals (simplified view), cannot edit |
| 107 | Patient | Appointments/Schedule | Upcoming appointments list: doctor visits, therapy sessions, caregiver visits, daily schedule view |
| 108 | Patient | Emergency Contacts | Contact list with relationship, phone, "Call" and "Message" buttons: Guardian, Doctor, Hospital, Ambulance (999) |
| 109 | Patient | Emergency SOS | Large prominent SOS button, confirmation dialog, triggers: calls primary emergency contact + notifications to guardian + caregiver |
| 110 | Patient | Rate Caregiver | Star rating (1-5), quick tags (Caring, Professional, Punctual, Skilled, Friendly), optional comments, "Submit Review" button |
| 111 | Patient | Chat with Caregiver | Direct message thread with assigned caregiver |
| 112 | Patient | Profile View (Read-Only) | Patient can view own info but cannot edit (Guardian manages) |

---

## 7. PLATFORM MODERATOR PAGES

| SL | Entity | Page Name | Page Content Description |
|----|--------|-----------|--------------------------|
| 113 | Moderator | Login with MFA | Login + 6-digit MFA verification required |
| 114 | Moderator | Dashboard | KPI cards (Pending Verifications with badge, Open Disputes, Active Caregivers, Active Agencies), queue summary |
| 115 | Moderator | Agency Package Template | Template creation: category, services included, pricing guidelines, save as template |
| 116 | Moderator | Caregiver Package Template | Template creation for caregiver packages |
| 117 | Moderator | Agency Subscription Package Creator | Create subscription plans (Basic/Premium/Enterprise): pricing, duration, features |
| 118 | Moderator | Caregiver Subscription Package Creator | Create caregiver subscription plans |
| 119 | Moderator | Verification Queue - Agencies Tab | Agency verification items with company name, submitted date, documents, "Review" button |
| 120 | Moderator | Verification Queue - Caregivers Tab | Caregiver verification items with pipeline step indicator |
| 121 | Moderator | Agency Verification Review Panel | Document viewer (zoomable, download), verification checklist (trade license valid, not expired, address matches, contact verified), internal notes, TWO-TIER actions: "Recommend Approval"/"Request More Info"/"Recommend Rejection" with Admin approval notice |
| 122 | Moderator | Agency Legal Document Queue | Queue of legal doc submissions pending moderator review |
| 123 | Moderator | Agency Physical Verification Queue | Queue of physical verification submissions |
| 124 | Moderator | Caregiver Certificate Queue | Queue of certificate submissions for review |
| 125 | Moderator | Caregiver Police Clearance Queue | Queue of police clearance submissions |
| 126 | Moderator | Caregiver Interview Queue | Interview scheduling and results entry, marks submission form |
| 127 | Moderator | Caregiver Psychological Analysis Queue | Psych test results review, recommendation submission |
| 128 | Moderator | Caregiver Verification Pipeline View | 6-step pipeline status: Certificates → Police Clearance → Interview → Psych Assessment → Document Check → Final Approval, current step highlighted |
| 129 | Moderator | CV Pool Management | Searchable caregiver database with filters (Skills, Location, Rating, Availability, Experience), results table, "View Profile" action |
| 130 | Moderator | Dispute Center | Dispute list with status badge, type, parties, job reference, "Assign to Me"/"View" buttons |
| 131 | Moderator | Dispute Detail | Case header (ID, status, time open), parties info, evidence tabs (Submitted Evidence, Care Logs, Payment Records, Messages), case timeline, TWO-TIER resolution panel: decision dropdown, notes (required), "Submit to Admin for Approval", "Escalate to Admin" for complex cases |
| 132 | Moderator | Support Tickets Queue | Ticket list with status, priority, type filters, "Respond" action |
| 133 | Moderator | Ticket Response | Thread view of messages, reply text area, "Send Reply", "Close Ticket"/"Escalate" buttons |
| 134 | Moderator | Platform Analytics | Metrics dashboard: User Growth, Transaction Volume, Dispute Rate, Revenue Reports |
| 135 | Moderator | Billing / Invoices | View invoice details and payment status |
| 136 | Moderator | Messages / Communication | Chat with Agencies, Caregivers, Guardians, and Admin (escalation) |
| 137 | Moderator | Settings | Personal settings, notification preferences |

---

## 8. PLATFORM ADMIN PAGES

| SL | Entity | Page Name | Page Content Description |
|----|--------|-----------|--------------------------|
| 138 | Admin | Login with MFA | Secure authentication + mandatory MFA verification with logging |
| 139 | Admin | MFA Failed - Error | Error display for failed authentication attempts |
| 140 | Admin | Dashboard | Extended KPIs: all Moderator KPIs + Total Platform Revenue, Active Moderators, System Health |
| 141 | Admin | Agency Package Template Editor | Create/edit package templates for agencies |
| 142 | Admin | Caregiver Package Template Editor | Create/edit package templates for caregivers |
| 143 | Admin | Agency Subscription Package Creator | Create/publish agency subscription packages with tiers |
| 144 | Admin | Caregiver Subscription Package Creator | Create/publish caregiver subscription packages |
| 145 | Admin | Moderator Management | Moderator table (Name, Email, Status, Last Active, Workload), "Add Moderator" button |
| 146 | Admin | Add Moderator | Form: Name, Email, Phone, permission level, "Send Invite" button |
| 147 | Admin | Edit Moderator | Update permissions, deactivate account options |
| 148 | Admin | Moderator Submissions Queue | Tabs: Verifications, Disputes, Tickets, Deployments - all moderator submissions requiring admin decision |
| 149 | Admin | Submission Review Panel | Moderator's submission summary, recommendation, notes + original data + documents + verification checklist |
| 150 | Admin | Admin Decision (3-Way) | "Approve" (finalize and activate), "Send Back to Moderator" (return with feedback), "Override & Reject" (reject regardless), feedback notes field |
| 151 | Admin | Agency Legal Doc Review | Review moderator's legal document verification submission, 3-way decision |
| 152 | Admin | Agency Physical Verification Review | Review moderator's physical verification submission, 3-way decision |
| 153 | Admin | Caregiver Certificate Review | Review moderator's certificate verification, 3-way decision |
| 154 | Admin | Caregiver Police Clearance Review | Review moderator's police clearance verification, 3-way decision |
| 155 | Admin | Caregiver Interview Review | Review moderator's interview marks/recommendation, 3-way decision |
| 156 | Admin | Caregiver Psych Analysis Review | Review moderator's psychological analysis recommendation, 3-way decision |
| 157 | Admin | Caregiver Direct Verification Queue | Direct admin verification queue (bypassing moderator) |
| 158 | Admin | Agency Verification Queue | Direct admin verification queue |
| 159 | Admin | Dispute Center (Escalated) | Complex disputes escalated from moderators, same resolution panel |
| 160 | Admin | CV Pool Management | Admin access to caregiver CV pool with full controls |
| 161 | Admin | Support Tickets (Escalated) | Escalated tickets from moderators |
| 162 | Admin | Platform Analytics | Charts: User Growth (line), Transaction Volume (bar), Revenue Trends (line), Geographic Distribution (map), Device Breakdown (pie), filters (date, entity, region), export PDF/CSV |
| 163 | Admin | Audit Logs | Log viewer with filters (Date, Entity, Action, User, Result), results table, log entry detail view (timestamp, user, action, target, before/after values, IP, device, session, result/error), export CSV/JSON |
| 164 | Admin | System Settings | Commission settings, feature flags (Marketplace, Shop, AI), content management (Terms, Privacy, FAQ), maintenance mode, announcement banner |
| 165 | Admin | Locked Accounts | List of payment-locked accounts (type, locked duration, outstanding amount), "View Details"/"Manual Unlock" actions |
| 166 | Admin | Manual Unlock | Admin unlock with reason field (e.g., payment arrangement made) |
| 167 | Admin | Messages / Communication | Chat with all entity types + moderators |
| 168 | Admin | Billing Management | Platform-wide billing overview, commission tracking |

---

## 9. SHOP ADMIN PAGES

| SL | Entity | Page Name | Page Content Description |
|----|--------|-----------|--------------------------|
| 169 | Shop Admin | Registration | Shop details, document upload, submit for verification |
| 170 | Shop Admin | Pending Verification | Verification status screen with estimated time |
| 171 | Shop Admin | Dashboard | KPI cards (Today's Orders, Revenue This Month, Pending Orders, Low Stock), quick actions (+Add Product, View Orders) |
| 172 | Shop Admin | Product Management | Product list with image, name, status, category, price, stock, "Edit"/"Deactivate" actions |
| 173 | Shop Admin | Add/Edit Product | Form: images (multiple), name, description, category (Medicines, Equipment Sale/Rental, Services), price, stock quantity, active toggle |
| 174 | Shop Admin | Order Management | Order list with ID, status badge, items count, total, customer, time, "Process" button |
| 175 | Shop Admin | Order Detail | Items list, customer info, shipping address, status workflow (Pending → Processing → Shipped → Delivered) |
| 176 | Shop Admin | Update Order Status | Accept order → Process (pack) → Ship (add tracking) → Mark delivered flow |
| 177 | Shop Admin | Messages Inbox | Customer inquiries, platform support conversations |
| 178 | Shop Admin | Shop Analytics | Sales over time chart, top products, revenue by category |
| 179 | Shop Admin | Billing | Platform subscription fee, commission on sales, invoice list |
| 180 | Shop Admin | Payment Reminder (Day 3) | Same pattern as Guardian |
| 181 | Shop Admin | Payment Warning (Day 5) | Same pattern |
| 182 | Shop Admin | Payment Final Warning (Day 6) | Same pattern |
| 183 | Shop Admin | Account Locked (Day 7+) | Restricted features (🚫 Cannot list new products, process new orders, update listings; ✅ Can fulfill existing orders, make payment) |

---

## 10. SHOP MANAGER PAGES

| SL | Entity | Page Name | Page Content Description |
|----|--------|-----------|--------------------------|
| 184 | Shop Manager | Login | Standard login |
| 185 | Shop Manager | Dashboard | Restrictions banner ("Manager Access - Operations only"), KPIs (Pending Orders, Processing, Low Stock Items) |
| 186 | Shop Manager | Order Queue | Incoming orders view, status update flow (Confirm → Process → Ship → Complete), cannot change pricing/issue refunds |
| 187 | Shop Manager | Order Detail | View order, update status, add tracking number |
| 188 | Shop Manager | Inventory Management | Inventory list with stock levels, low stock highlighting, "Update Stock" action |
| 189 | Shop Manager | Update Stock | Adjust quantity form, stock note field, "Save" button |
| 190 | Shop Manager | Low Stock Alerts | Items below threshold list, "Notify Admin" action |
| 191 | Shop Manager | Customer Inquiries | Inquiry queue with customer questions, "Respond"/"Escalate to Admin" actions |
| 192 | Shop Manager | Chat with Shop Admin | Internal communication channel |
| 193 | Shop Manager | View Restrictions Summary | Table showing allowed (✅ View/Process orders, Update inventory, Respond to inquiries, Chat) vs restricted (❌ Change pricing, Add/remove products, Manage billing, Run promotions) |

---

## GAP ANALYSIS

### Pages Present in Workflow but Potentially Missing Detail in INSTRUCTIONS_FOR_FIGMA.md

| Gap # | Entity | Missing/Incomplete Page | Notes |
|-------|--------|------------------------|-------|
| 1 | Moderator | 6 Separate Verification Sub-Queues | Instructions mention pipeline but individual queue screens (Legal, Physical, Certificate, Police, Interview, Psych) need explicit detail |
| 2 | Admin | 6 Corresponding Admin Review Screens | Each moderator verification type needs corresponding admin 3-way decision screen |
| 3 | Caregiver | 6 Individual Verification Step Status Screens | Each step in 6-step pipeline (Certificates, Police, Interview, Psych, Documents, Final) needs its own status/upload/result screen |
| 4 | Admin | Audit Log Detail View | Log entry detail screen with full metadata (before/after values, IP, device, session) needs explicit layout |
| 5 | Multi-Entity | Package Negotiation Back-and-Forth UI | Full negotiation thread view showing offer → counter-offer → response history |
| 6 | Multi-Entity | Escrow 48-Hour Timer UI | Timer visualization during dispute grace period |
| 7 | Multi-Entity | Job Deployment Tracking | Multi-entity job status tracking (Agency creates → Caregiver accepts/declines → Guardian approves → Admin monitors) |
| 8 | Admin | Commission Settings Editor | Detailed commission rate configuration screen |
| 9 | Admin | Feature Flags Management | Toggle interface for Marketplace, Shop, AI features |
| 10 | Admin | Content Editor (Terms/Privacy/FAQ) | Rich text editor for platform content |

### UI States That Need Explicit Design

| State Type | Entities Affected | Description |
|------------|-------------------|-------------|
| Empty State | All Lists | Illustration + message + CTA for empty lists |
| Loading State | All Screens | Skeleton screens per section type |
| Error State | All Forms/Actions | Friendly error messages, retry options |
| Offline State | PWA Screens | Cached content indicator, sync status |
| Pending/Processing | Verifications, Payments | Waiting state with progress indicator |
| Rejected State | Verifications | Rejection details with resubmission path |
| Override Warning | Check-in, Payments | Confirmation before override actions |

### Critical Multi-Entity Flow Screens

These complex flows span multiple entities and need coordinated screen designs:

1. **Caregiver Verification Pipeline (6-Step)**
   - Caregiver: Submit screens (6)
   - Moderator: Review screens (6)
   - Admin: Approval screens (6)
   - Total: ~18 coordinated screens

2. **Dispute Resolution Flow**
   - Guardian/Caregiver: File dispute screen
   - Moderator: Investigation screens
   - Admin: Final decision screen
   - Both Parties: Resolution notification

3. **Payment Enforcement Flow**
   - Day 3: Reminder notification/banner
   - Day 5: Warning screen
   - Day 6: Final warning with feature list
   - Day 7+: Locked account state
   - Payment: Unlock confirmation
   (Applies to: Guardian, Agency, Caregiver, Shop Admin)

---

## SUMMARY

**Total Unique Pages:** 190+

**Entity Distribution:**
- Shared: 12 pages
- Guardian: 24 pages (including payment states)
- Agency Admin: 24 pages
- Agency Manager: 8 pages
- Caregiver: 32 pages (including verification pipeline)
- Patient: 12 pages
- Moderator: 25 pages
- Admin: 31 pages
- Shop Admin: 15 pages
- Shop Manager: 10 pages

**Key Design Considerations:**
1. Mobile-first for all screens (360px primary width)
2. Bottom sheets instead of modals on mobile
3. Touch targets minimum 44×44px
4. Skeleton loading states for all content areas
5. Offline indicators on every screen
6. Bilingual text support (EN/BN) affecting layout lengths
7. Two-Tier Authority UI pattern (Moderator → Admin) throughout

---

*End of Page Inventory - Version 1.0*
