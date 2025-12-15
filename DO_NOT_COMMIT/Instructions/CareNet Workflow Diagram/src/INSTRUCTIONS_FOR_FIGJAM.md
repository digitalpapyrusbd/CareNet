# CareNet Platform - FigJam Workflow Diagram Instructions

**Purpose:** Create comprehensive workflow diagrams for the CareNet caregiver platform in FigJam.  
**Version:** 1.3  
**Last Updated:** December 2024

---

## Table of Contents

1. [Diagram Structure](#diagram-structure)
2. [Visual Element Standards](#visual-element-standards)
3. [Core System Concepts](#core-system-concepts)
4. [Entity Workflows (11 Total)](#entity-workflows)
5. [Multi-Entity Workflows (4 Total)](#multi-entity-workflows)
6. [Payment & Financial Flows](#payment--financial-flows)
7. [Data Visibility Rules](#data-visibility-rules)
8. [AI Integration](#ai-integration)
9. [Logging & Audit Trail](#logging--audit-trail-requirements)
10. [Legend & Notes](#legend)

---

## Diagram Structure

### Swimlane Layout

Create **horizontal swimlanes** for each entity, arranged from top to bottom in this order:

| # | Entity | Background Color | Emoji |
|---|--------|-----------------|-------|
| 1 | **CareNet Platform Admin** | Purple `#E8DAEF` | 🔐 |
| 2 | **CareNet Platform Moderator** | Light Purple `#F5EEF8` | 👮 |
| 3 | **Agency Admin** | Blue `#D4E6F1` | 🏢 |
| 4 | **Agency Manager** | Light Blue `#EBF5FB` | 👔 |
| 5 | **Caregiver** | Green `#D5F5E3` | 👨‍⚕️ |
| 6 | **User/Guardian of Patient** | Orange `#FDEBD0` | 👤 |
| 7 | **Patient** | Light Orange `#FEF9E7` | 🤒 |
| 8 | **Shops Admin** | Teal `#D1F2EB` | 🏪 |
| 9 | **Shops Manager** | Light Teal `#E8F8F5` | 📦 |

**Swimlane Specifications:**
- Width: Full diagram width (minimum 2000px)
- Height: Variable based on content (minimum 300px per lane)
- Label: Entity name in bold, left-aligned, 24px font
- Divider lines: 2px solid gray (`#BDC3C7`)

---

## Visual Element Standards

### Node Shapes

| Element Type | Shape | Color | Border | Size |
|-------------|-------|-------|--------|------|
| **Start/End** | Rounded rectangle | Gray (`#95A5A6`) | None | 120×50px |
| **User Action** | Rectangle | Light Blue (`#AED6F1`) | 2px blue (`#3498DB`) | 180×80px |
| **System Process** | Rectangle | Light Green (`#ABEBC6`) | 2px green (`#27AE60`) | 180×80px |
| **Decision Point** | Diamond | Yellow (`#F9E79F`) | 2px orange (`#F39C12`) | 120×120px |
| **External Service** | Rectangle with double border | Light Purple (`#D7BDE2`) | 4px purple (`#8E44AD`) | 180×80px |
| **Data Store** | Cylinder | Light Gray (`#F4F6F6`) | 2px dark gray (`#7F8C8D`) | 100×120px |
| **Notification** | Rounded rectangle | Light Yellow (`#FEF9E7`) | 2px yellow (`#F1C40F`) | 160×60px |
| **AI Agent** | Hexagon | Light Cyan (`#D1F2EB`) | 2px teal (`#1ABC9C`) | 140×100px |
| **Error State** | Rectangle | Light Red (`#FADBD8`) | 2px red (`#E74C3C`) | 160×60px |
| **Log Event** | Small rectangle | Light Gray (`#F8F9FA`) | 1px gray (`#ADB5BD`) | 80×40px |

### Connector Specifications

| Flow Type | Arrow Style | Color | Label Position |
|-----------|-------------|-------|----------------|
| **Normal flow** | Solid line, filled arrow | Black (`#2C3E50`) | Above line |
| **Conditional flow** | Dashed line, filled arrow | Orange (`#E67E22`) | Above line with condition |
| **Data flow** | Dotted line, open arrow | Blue (`#3498DB`) | Below line |
| **Error/Exception** | Dashed line, red arrow | Red (`#E74C3C`) | Above line |
| **Cross-swimlane** | Solid line, open arrow | Purple (`#9B59B6`) | Above line |
| **Logging** | Dotted gray line | Gray (`#6C757D`) | "LOG" label |

---

## Core System Concepts

### Two-Tier Authority System

**CRITICAL:** All verification and approval processes follow this pattern:

```
┌──────────────────────────────────────────────────────────────────────┐
│                    TWO-TIER AUTHORITY SYSTEM                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  TIER 1: MODERATOR (First Line)                                      │
│  ├─ Reviews all applications and submissions                         │
│  ├─ Conducts interviews and assessments                              │
│  ├─ Makes recommendations                                            │
│  ├─ Resolves simple disputes/tickets                                 │
│  └─ ❌ CANNOT make final approvals                                   │
│                                                                       │
│  TIER 2: ADMIN (Final Authority)                                     │
│  ├─ Reviews ALL moderator submissions                                │
│  ├─ Three-way decision for everything:                               │
│  │   ├─ ✅ APPROVE - Accept and finalize                             │
│  │   ├─ 🔄 SEND BACK - Return to moderator with feedback             │
│  │   └─ ❌ REJECT - Override and reject                              │
│  ├─ Handles escalated complex cases                                  │
│  └─ Supreme platform authority                                       │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**What Requires Admin Approval:**
- Agency legal document verification
- Agency physical verification
- Caregiver certificate verification
- Caregiver police clearance
- Caregiver interview assessments
- Caregiver psychological analysis
- Dispute resolutions (from moderators)
- Ticket resolutions (from moderators)
- Moderator deployment

### Three-Tier Billing System

```
┌──────────────────────────────────────────────────────────────────────┐
│                    THREE-TIER BILLING FLOW                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  TIER 1: CAREGIVER → AGENCY                                          │
│  ├─ Caregiver generates invoice for completed work                   │
│  ├─ Invoice shows: Hours × Agreed Wage                               │
│  └─ Agency reviews and pays caregiver                                │
│                                                                       │
│  TIER 2: AGENCY → GUARDIAN                                           │
│  ├─ Agency generates invoice for services                            │
│  ├─ Invoice shows: Package price (negotiated)                        │
│  └─ Guardian pays for care services                                  │
│                                                                       │
│  TIER 3: PLATFORM → ALL ENTITIES                                     │
│  ├─ Platform → Caregiver: Subscription + Commission                  │
│  ├─ Platform → Agency: Subscription + Transaction Commission         │
│  ├─ Platform → Guardian: Subscription (optional)                     │
│  └─ Platform → Shop: Subscription + Commission                       │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Payment Enforcement (7-Day Lockout)

**CRITICAL:** If payment is pending for 7 days after bill generation, account is AUTOMATICALLY LOCKED.

```
┌──────────────────────────────────────────────────────────────────────┐
│                    7-DAY PAYMENT ENFORCEMENT                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Day 0: 📄 Invoice Generated                                         │
│         └─ Status: PENDING                                           │
│                                                                       │
│  Day 3: 🔔 First Payment Reminder                                    │
│         └─ Email + SMS + In-app notification                         │
│                                                                       │
│  Day 5: ⚠️ Second Warning (2 days to lockout)                        │
│         └─ "URGENT: Payment required"                                │
│                                                                       │
│  Day 6: 🚨 Final Warning (24 hours to lockout)                       │
│         └─ List of features that will be locked                      │
│                                                                       │
│  Day 7: 🔒 ACCOUNT LOCKED                                            │
│         ├─ Automatic system lockout                                  │
│         ├─ Limited access (read-only + payments)                     │
│         └─ Active jobs continue                                      │
│                                                                       │
│  Payment Made: ✅ Auto-Unlock within 1 hour                          │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Lockout Impact by Entity:**

| Entity | Locked Features | Remains Active |
|--------|----------------|----------------|
| **Agency** | Cannot deploy caregivers, create packages, access pool | View jobs (read-only), make payments |
| **Guardian** | Cannot purchase, negotiate, browse agencies | View jobs, communicate with assigned CG |
| **Caregiver** | Cannot accept new jobs, update availability | Complete existing jobs, make payments |
| **Shop** | Cannot list products, process new orders | Fulfill existing orders, make payments |

---

## Entity Workflows

### 1. Platform Admin Workflow

```
[START] → [Login with MFA]
              ↓
    ◇ MFA Valid? ─No→ [Show Error] → [Retry]
        │Yes
        ↓
    [Admin Dashboard]
        │
        ├→ [Manage Moderators]
        │      ├→ Add/Edit/Deactivate Moderator
        │      └→ Assign Permissions
        │
        ├→ [Review Moderator Submissions] ← TWO-TIER AUTHORITY
        │      ↓
        │   [View Submission Queue]
        │      ↓
        │   [Select Submission]
        │      ↓
        │   ◇ Decision? (3-way)
        │       ├→ ✅ Approve → [Finalize] → [Notify Parties]
        │       ├→ 🔄 Send Back → [Add Feedback] → [Return to Moderator]
        │       └→ ❌ Reject → [Document Reason] → [Notify Parties]
        │
        ├→ [Sample Package Templates]
        │      └→ Create templates for agencies to use
        │
        ├→ [Platform Communications] ← MESSAGING BRANCH
        │      ├→ Message Center
        │      ├→ Chat with Moderators
        │      ├→ Chat with Agencies
        │      ├→ Chat with Caregivers
        │      └→ Broadcast Announcements
        │
        ├→ [View Audit Logs]
        │      ├→ Filter by Date/Entity/Action/User
        │      ├→ View Log Details
        │      └→ Export Logs (CSV/JSON)
        │
        ├→ [Platform Analytics]
        │      ├→ User Growth
        │      ├→ Transaction Volume
        │      ├→ Dispute Rate
        │      └→ Revenue Reports
        │
        └→ [System Settings]
               ├→ Configure Commission Rates
               ├→ Manage Feature Flags
               └→ Update Platform Policies
```

### 2. Platform Moderator Workflow

```
[START] → [Login with MFA]
              ↓
    [Moderator Dashboard]
        │
        ├→ [Verification Queue] ← RECOMMEND TO ADMIN
        │      ↓
        │   ◇ Queue Type?
        │       ├→ [Agency Verification]
        │       │      ├→ Review Legal Documents
        │       │      ├→ Physical Verification
        │       │      ├→ Recommend Approval/Rejection
        │       │      └→ Submit to Admin for Final Decision
        │       │
        │       └→ [Caregiver Verification] (6 Steps)
        │              ├→ Step 1: Review Certificates → Submit to Admin
        │              ├→ Step 2: Verify Police Clearance → Submit to Admin
        │              ├→ Step 3: Conduct Interview → Submit Marks to Admin
        │              ├→ Step 4: Psychological Assessment → Submit to Admin
        │              ├→ Step 5: Document Verification → Submit to Admin
        │              └→ Step 6: Admin Final Approval (Admin Only)
        │
        ├→ [Dispute Center]
        │      ↓
        │   [View Open Disputes]
        │      ↓
        │   [Select Case]
        │      ↓
        │   [Review Evidence]
        │      ├→ Care Logs
        │      ├→ Payment Records
        │      ├→ Messages
        │      └→ Photos/Documents
        │      ↓
        │   [Contact Both Parties]
        │      ↓
        │   ◇ Complexity?
        │       ├→ Simple → [Resolve] → [Submit to Admin for Approval]
        │       └→ Complex → [Escalate to Admin Immediately]
        │
        ├→ [Support Tickets]
        │      ├→ View Ticket Queue
        │      ├→ Filter by Status/Priority
        │      ├→ Respond to Ticket
        │      └→ Escalate Complex Issues
        │
        └→ [Platform Communications] ← MESSAGING BRANCH
               ├→ Message Center
               ├→ Chat with Agencies
               ├→ Chat with Caregivers
               ├→ Chat with Guardians
               └→ Contact Admin (Escalation)
```

### 3. Agency Admin Workflow

```
[START] → [Register Agency]
              ↓
    [Fill Registration] → [Upload Documents] → [Submit for Verification]
              ↓
    [PENDING - Moderator Review → Admin Approval]
              ↓
    ◇ Approved? ─No→ [View Rejection] → [Resubmit]
        │Yes
        ↓
    [Complete Onboarding]
        ├→ Set Service Zones
        ├→ Configure Payment Methods (bKash/Nagad)
        └→ Create First Package
              ↓
    [Agency Dashboard]
        │
        ├→ [View Subscription Plans] ← SUBSCRIPTION
        │      ├→ Browse Plans (Basic/Premium/Enterprise)
        │      ├→ Select Subscription
        │      ├→ Subscribe & Pay
        │      └→ Subscription Active
        │
        ├→ [Manage Packages]
        │      ├→ Create/Edit Package
        │      ├→ View Package Inquiries (Counter-offers)
        │      └→ Respond to Counter-offers
        │            ├→ Offer Discount
        │            ├→ Add Services/Customize
        │            └→ Decline Offer
        │
        ├→ [Manage Caregiver Roster] ← BEFORE JOBS
        │      ├→ Add from CV Pool
        │      └→ Add New Caregiver
        │
        ├→ [Search Caregiver Pool] ← RECRUITING
        │      ├→ Search Filters (Skills, Location, Availability, Ratings)
        │      ├→ View Results
        │      ├→ View Caregiver Details
        │      ├→ Check Availability (Available/Busy/On Assignment)
        │      └→ Contact Caregiver (Message or Job Offer)
        │
        ├→ [Messages & Chat] ← COMMUNICATION BRANCH
        │      ├→ Message Inbox
        │      ├→ Chat with Caregivers
        │      ├→ Chat with Guardians
        │      └→ Contact Support
        │
        ├→ [Job Inbox] ← AFTER ROSTER READY
        │      ├→ View Purchased Jobs
        │      ├→ View Job Details
        │      ├→ Assign Caregiver (from Roster or Pool)
        │      ├→ Deploy Caregiver (Send Job Offer)
        │      ├→ Wait for Acceptance
        │      └→ Job Status (Accepted → Active, Declined → Reassign)
        │
        └→ [View Billing] ← THREE-TIER BILLING + LOCKOUT
               ├→ Generate Invoice to Guardian
               │      └→ Service Invoice Details → Send to Guardian
               ├→ Caregiver Invoices (Incoming)
               │      └→ Review & Approve → Pay Caregiver
               ├→ Platform Invoice
               │      ├→ Subscription Charges
               │      └→ Transaction Commissions
               └→ [Payment Enforcement]
                      └→ Day 3 → Day 5 → Day 6 → Day 7 🔒 → Pay → ✅ Unlock
```

### 4. Agency Manager Workflow

```
[START] → [Login]
              ↓
    [Manager Dashboard] (Limited Access - QA Focus)
        │
        ├→ [QA Dashboard]
        │      ├→ Quality Metrics
        │      ├→ Caregiver Ratings
        │      ├→ Incident Reports
        │      ├→ Quality Alerts
        │      └→ Submit QA Report to Admin
        │
        ├→ [Guardian Feedback Queue]
        │      ├→ View Feedback List
        │      ├→ Respond to Feedback
        │      └→ Response Sent → Guardian Notified
        │
        ├→ [View Caregiver Assignments] (Read-Only)
        │      ├→ Assignment List
        │      └→ View Assignment Details (Cannot Edit)
        │
        ├→ [Generate Reports]
        │      ├→ Performance Report
        │      ├→ Activity Report
        │      ├→ Quality Report
        │      └→ Export (PDF/CSV)
        │
        └→ [Communication]
               └→ Chat with Agency Admin
        
    ┌─────────────────────────────────────────────┐
    │ MANAGER RESTRICTIONS:                        │
    │ 🚫 Cannot create packages                   │
    │ 🚫 Cannot deploy caregivers                 │
    │ 🚫 Cannot manage billing                    │
    │ 🚫 Cannot access caregiver pool             │
    │ ✅ Can view QA metrics                      │
    │ ✅ Can respond to feedback                  │
    │ ✅ Can generate reports                     │
    └─────────────────────────────────────────────┘
```

### 5. Caregiver Workflow

```
[START] → [Register]
              ↓
    [Phone + OTP] → [Upload Photo & NID] → [Enter Skills] → [Set Availability]
              ↓
    [Submit for Verification] (6-Step Process via Moderator → Admin)
              ↓
    ◇ Verified? ─No→ [View Issues] → [Resubmit]
        │Yes
        ↓
    [Caregiver Dashboard]
        │
        ├→ [View Subscription Plans] ← SUBSCRIPTION
        │      ├→ Browse Plans
        │      ├→ Select Subscription
        │      ├→ Subscribe & Pay
        │      └→ Subscription Active
        │
        ├→ [Job Offers & Assignments]
        │      ├→ View Job Offers from Agencies
        │      ├→ View Job Details (NO PRICING - Only wage shown)
        │      └→ ◇ Accept Job?
        │            ├→ Accept → Job Assigned
        │            └→ Decline → Agency Finds Another
        │
        ├→ [Check-In to Job]
        │      ├→ Navigate to Location (GPS)
        │      ├→ ◇ GPS Valid?
        │      │     ├→ Yes → Take Check-in Photo → Confirm
        │      │     └→ No → Manual Override + Note
        │      └→ Start Care Session
        │
        ├→ [Care Logging]
        │      ├→ Log Medications (AI: OCR Prescription Scan)
        │      ├→ Log Vitals (Auto-Alert if Abnormal)
        │      ├→ Log Activities (AI: Voice Transcription EN/BN)
        │      └→ Log Incidents (Immediate Notify if Severe)
        │
        ├→ [Messages & Communication] ← COMMUNICATION BRANCH
        │      ├→ Message Inbox
        │      ├→ Chat with Guardian
        │      ├→ Chat with Patient (if capable)
        │      └→ Contact Agency
        │
        └→ [View My Billing] ← THREE-TIER BILLING + LOCKOUT
               ├→ Generate Invoice to Agency
               │      └→ Job Invoice Details → Submit to Agency
               ├→ Platform Invoice
               │      ├→ Subscription Fee
               │      └→ Platform Commission
               └→ [Payment Enforcement]
                      └→ Day 3 → Day 5 → Day 6 → Day 7 🔒 → Pay → ✅ Unlock
```

### 6. Guardian/User Workflow

```
[START] → ◇ Has Account?
              ├→ No → [Register] → [Phone + OTP] → [Create Profile]
              └→ Yes → [Login]
              ↓
    [Guardian Dashboard]
        │
        ├→ [Manage Patients]
        │      ├→ Add Patient Profile
        │      ├→ Upload Prescription
        │      ├→ AI: OCR Scan → Medication Schedule
        │      └→ Patient Profile Created
        │
        ├→ [Browse Agencies]
        │      ├→ Filter by Location/Rating/Specialization
        │      ├→ View Agency Profile
        │      ├→ Select Package
        │      └→ View Package Details (Shows Price, NOT wages)
        │
        ├→ [Negotiate Package] ← NEGOTIATION
        │      ├→ ◇ Accept as-is or Negotiate?
        │      │     ├→ Accept → Checkout
        │      │     └→ Negotiate → Send Counter-offer
        │      ├→ Wait for Agency Response
        │      ├→ Review Agency Counter-offer
        │      └→ ◇ Accept/Counter Again/Browse Others
        │
        ├→ [Checkout & Payment]
        │      ├→ Review Order Summary
        │      ├→ Select Payment Method (bKash/Nagad)
        │      ├→ Redirect to Payment Gateway
        │      ├→ ◇ Payment Success?
        │      │     ├→ Yes → Funds → ESCROW → Job Created
        │      │     └→ No → Show Error → Retry
        │      └→ Agency Notified
        │
        ├→ [Track Active Jobs]
        │      ├→ View Job Details (NO caregiver wages visible)
        │      ├→ View Care Logs (Real-time)
        │      ├→ View Assigned Caregiver
        │      └→ ◇ Issue? → File Dispute → ESCROW Frozen
        │
        ├→ [Messages & Communication] ← COMMUNICATION BRANCH
        │      ├→ Message Inbox
        │      ├→ Chat with Caregiver
        │      ├→ Chat with Agency
        │      └→ Contact Support
        │
        └→ [View Billing] ← THREE-TIER BILLING + LOCKOUT
               ├→ Agency Service Invoices
               │      └→ Review Invoice → Pay Agency
               ├→ Platform Subscription (Optional)
               │      └→ View/Pay Subscription
               └→ [Payment Enforcement]
                      └→ Day 3 → Day 5 → Day 6 → Day 7 🔒 → Pay → ✅ Unlock
```

### 7. Patient Workflow

```
[START] → [Login]
              ↓
    [Patient Dashboard] (Limited Access)
        │
        ├→ [View Assigned Caregiver]
        │      ├→ Caregiver Profile (Name, Photo, Certifications)
        │      └→ Chat with Caregiver ← COMMUNICATION
        │
        ├→ [View Medication Schedule]
        │      ├→ Medication List
        │      └→ Medication Reminders (Notifications)
        │
        ├→ [View Care Logs]
        │      └→ Activity Log (Meals, Exercises, Vitals)
        │
        ├→ [View Appointments]
        │      └→ Daily Schedule
        │
        ├→ [Emergency Contacts]
        │      ├→ Contact List (Guardian, Doctor, Hospital)
        │      └→ One-tap Emergency Calling
        │
        └→ [Rate Caregiver Service]
               └→ Submit Rating & Review
        
    ┌─────────────────────────────────────────────┐
    │ PATIENT RESTRICTIONS:                        │
    │ 🚫 Cannot make payments                     │
    │ 🚫 Cannot purchase packages                 │
    │ 🚫 Cannot manage billing                    │
    │ ✅ Can view care information                │
    │ ✅ Can chat with caregiver                  │
    │ ✅ Can provide feedback                     │
    └─────────────────────────────────────────────┘
```

### 8. Shop Admin Workflow

```
[START] → [Register Shop]
              ↓
    [Fill Registration] → [Upload Documents] → [Submit for Verification]
              ↓
    ◇ Approved?
        │Yes
        ↓
    [Shop Dashboard]
        │
        ├→ [Product Management]
        │      ├→ Add Product/Service
        │      │     ├→ Medicines
        │      │     ├→ Medical Equipment (Sale/Rental)
        │      │     └→ Services (Ambulance, etc.)
        │      └→ Publish Listing
        │
        ├→ [Order Management]
        │      ├→ View Incoming Orders
        │      ├→ Process Order (Accept/Reject/Ship)
        │      └→ Track Delivery Status
        │
        ├→ [Customer Communication] ← COMMUNICATION BRANCH
        │      ├→ Message Inbox
        │      ├→ Chat with Customers
        │      └→ Contact Platform Support
        │
        └→ [View Billing] ← BILLING + LOCKOUT
               ├→ Platform Invoice
               │      ├→ Subscription Charges
               │      └→ Commission on Sales
               └→ [Payment Enforcement]
                      └→ Day 3 → Day 5 → Day 6 → Day 7 🔒 → Pay → ✅ Unlock
```

### 9. Shop Manager Workflow

```
[START] → [Login]
              ↓
    [Manager Dashboard] (Operations Focus)
        │
        ├→ [View Orders]
        │      ├→ Order Queue (Pending/Processing/Shipped)
        │      ├→ Select Order → View Details
        │      └→ Update Status (Confirm/Process/Ship/Complete)
        │            └→ If Ship → Add Tracking Number
        │
        ├→ [Manage Inventory]
        │      ├→ Inventory List
        │      ├→ Update Stock Levels
        │      ├→ Low Stock Alert
        │      └→ Notify Shop Admin
        │
        ├→ [Customer Inquiries]
        │      ├→ Inquiry Queue
        │      ├→ Respond to Customer
        │      └→ ◇ Complex Issue?
        │            ├→ No → Resolve
        │            └→ Yes → Escalate to Shop Admin
        │
        └→ [Internal Communication]
               └→ Chat with Shop Admin
        
    ┌─────────────────────────────────────────────┐
    │ MANAGER RESTRICTIONS:                        │
    │ 🚫 Cannot change pricing                    │
    │ 🚫 Cannot add/remove products               │
    │ 🚫 Cannot manage billing                    │
    │ 🚫 Cannot run promotions                    │
    │ ✅ Can process orders                       │
    │ ✅ Can update inventory                     │
    │ ✅ Can handle customer service              │
    └─────────────────────────────────────────────┘
```

---

## Multi-Entity Workflows

### 10. Payment & Escrow Flow

**Swimlanes:** Guardian, Agency Admin, Moderator

```
GUARDIAN:    [Select Package] → [Checkout] → [Select bKash/Nagad]
                                                    ↓
                                        <<Payment Gateway>>
                                                    ↓
                                           ◇ Payment Success?
                                              /           \
                                           Yes             No
                                            ↓              ↓
                                   [Funds → ESCROW]   [Show Error]
                                            ↓
AGENCY:                          [Job Created] → [Assign CG] → [Job Active]
                                                                    ↓
                                                           [Job Completed]
                                                                    ↓
MODERATOR:                                                [48hr Timer Start]
                                                                    ↓
                                                           ◇ Dispute Filed?
                                                              /         \
                                                           Yes          No
                                                            ↓            ↓
                                                    [FREEZE Escrow]  [Release to Agency]
                                                            ↓            ↓
                                                    [Moderator Review] [Calculate Commission]
                                                            ↓            ↓
                                                    [Resolution]    [Transfer Funds]
```

### 11. Job Deployment Flow

**Swimlanes:** Agency Admin, Caregiver, Guardian, Admin

```
AGENCY:     [START] → [Create Job from Package] → [Job Details]
                                                        ↓
                                              [Select CG from Roster]
                                                        ↓
                                              [Send Job Offer] ─────────────────┐
                                                   ↑                            │
                                                   │ (if declined)              ↓
CAREGIVER:                          [Find Another] ← [Decline] ← ◇ Accept? ← [Reviews] ← [Receives Offer]
                                                                    ↓
                                                                [Accept]
                                                                    ↓
GUARDIAN:                                               [Notified] → [View CG Profile]
                                                                           ↓
                                                                    ◇ Approve Assignment?
                                                                       /          \
                                                                  Approve     Request Change
                                                                     ↓              ↓
CAREGIVER:                                                   [✅ Job Active]   [Agency: Find Another]
                                                                     ↓
ADMIN:                                                      [Platform Monitoring] → [Metrics]
```

### 12. Dispute Resolution Flow

**Swimlanes:** Guardian, Caregiver, Moderator, Admin

```
GUARDIAN:    [START] → ◇ Who Files?
                            ↓ Guardian
                    [Files Dispute] → [Upload Evidence] ───────┐
                                                               │
CAREGIVER:               ↓ Caregiver                          │
                    [Files Dispute] → [Upload Evidence] ───────┤
                                                               ↓
MODERATOR:                                            [Dispute Submitted]
                                                               ↓
                                                      [Moderator Assigned]
                                                               ↓
                                                      [Review Evidence]
                                                               ↓
                                                      [Contact Both Parties]
                                                               ↓
                                                      ◇ Complexity?
                                                        /         \
                                                    Simple      Complex
                                                       ↓            ↓
                                              [Resolve] → [Submit to Admin]
                                                               ↓
ADMIN:                                                [Admin Reviews]
                                                               ↓
                                                      ◇ Decision (3-way)
                                                        /     |     \
                                                  Approve  Send Back  Override
                                                       \      |      /
                                                        \     ↓     /
MODERATOR:                                         [Notify All Parties]
                                                        /           \
GUARDIAN:                              [Guardian Receives Decision]  [Caregiver Receives Decision]
CAREGIVER:
```

### 13. Package Negotiation Flow

**Swimlanes:** Guardian, Agency Admin

```
GUARDIAN:    [START] → [Browse Packages] → [Select Package] → [Review Terms]
                                                                    ↓
                                                          ◇ Accept or Negotiate?
                                                            /            \
                                                       Accept         Negotiate
                                                          ↓                ↓
                                                    [Checkout]    [Send Counter-offer]
                                                                          ↓
AGENCY:                                                       [Receives Counter-offer]
                                                                          ↓
                                                                    [Review]
                                                                          ↓
                                                              ◇ Agency Decision (3-way)
                                                               /      |        \
                                                         Accept   Counter    Reject
                                                            ↓        ↓          ↓
                                                    [Terms    [Send New   [Guardian:
                                                     Agreed]   Offer]     Final Choice]
                                                        ↓        ↓          /      \
GUARDIAN:                                         [Checkout] [Review]  Accept  Walk Away
                                                                 ↓      Original    ↓
                                                          ◇ Accept?      ↓       [END]
                                                            /    \   [Checkout]
                                                      Accept  Counter
                                                         ↓     Again
                                                   [Checkout]   ↓
                                                          [Loop Back]
```

### 14. Caregiver Verification Pipeline (6 Steps)

**Swimlanes:** Caregiver, Moderator, Admin

```
CAREGIVER:   [START] → [Register & Submit Profile]
                                ↓
             [Step 1: Upload Certificates] ──────────────────────────────────┐
                      ↑ (resubmit)                                           ↓
MODERATOR:            └────────── [Review Certs] → ◇ Valid? → [Recommend] ──┤
                                                                             ↓
ADMIN:                                                    [Admin: Approve/Resubmit] ──┤
                                                                             ↓
CAREGIVER:                                              [Step 2: Police Clearance] ──┤
                                                                             ↓
MODERATOR:                                              [Verify] → [Recommend] ──────┤
                                                                             ↓
ADMIN:                                                         [Admin: Approve] ─────┤
                                                                             ↓
CAREGIVER:                                                    [Step 3: Interview] ───┤
                                                                             ↓
MODERATOR:                                        [Conduct Interview] → [Submit Marks]
                                                                             ↓
ADMIN:                                                         [Admin: Approve] ─────┤
                                                                             ↓
CAREGIVER:                                               [Step 4: Psych Test] ───────┤
                                                                             ↓
MODERATOR:                                           [Review Results] → [Recommend] ─┤
                                                                             ↓
ADMIN:                                                         [Admin: Approve] ─────┤
                                                                             ↓
CAREGIVER:                                          [Step 5: Document Verification] ─┤
                                                                             ↓
MODERATOR:                                       [Full Doc Check] → [Final Recommend]
                                                                             ↓
ADMIN:                                            [Admin: Approve] → [Step 6: Final Review]
                                                                             ↓
                                                              ◇ Final Decision
                                                                /           \
CAREGIVER:                                          [✅ VERIFIED]     [❌ REJECTED]
```

---

## Payment & Financial Flows

### Complete Billing Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         CARENET BILLING OVERVIEW                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   CAREGIVER ──────────→ AGENCY ──────────→ GUARDIAN                        │
│       │                    │                    │                           │
│       │  Invoice for       │  Invoice for       │                           │
│       │  completed work    │  services          │                           │
│       │  (Hours × Wage)    │  (Package Price)   │                           │
│       │                    │                    │                           │
│       └────────────────────┴────────────────────┘                           │
│                            │                                                │
│                            ↓                                                │
│                    ┌───────────────┐                                        │
│                    │   PLATFORM    │                                        │
│                    │               │                                        │
│                    │ Collects:     │                                        │
│                    │ • Subscriptions                                        │
│                    │ • Commissions │                                        │
│                    └───────────────┘                                        │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

### Payment Methods

- **bKash** - Mobile Financial Service (Primary)
- **Nagad** - Government-backed MFS (Alternative)
- Credit/Debit Cards (Backup option)

---

## Data Visibility Rules

### Role-Based Information Access

| Data | Admin | Moderator | Agency | Caregiver | Guardian | Patient | Shop |
|------|-------|-----------|--------|-----------|----------|---------|------|
| Package Pricing | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | - |
| Caregiver Wages | ✓ | ✓ | ✓ | ✓ (own) | ✗ | ✗ | - |
| Patient Medical Info | ✓ | Limited | ✓ | ✓ (assigned) | ✓ (own) | ✓ (own) | - |
| Payment Transactions | ✓ | ✓ | ✓ (own) | ✗ | ✓ (own) | ✗ | ✓ (own) |
| Commission Rates | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ |
| All Audit Logs | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

### Pricing Transparency

- **Guardian sees:** Full package price (what they pay)
- **Caregiver sees:** Their wage only (what they earn)
- **Agency sees:** Package price + Caregiver wages = Profit margin
- **Admin sees:** Everything

---

## AI Integration

### 1. Navigation Assistant

```
<<AI: Navigation Agent>>
       ↓
[User asks question via chat/voice]
       ↓
[Process Natural Language]
       ↓
[Identify Intent] → [Provide Response / Navigate User]
```

### 2. Voice Transcription (Caregiver)

```
<<AI: Transcription Agent>>
       ↓
[Record Audio (EN or BN)] → [Convert to Text] → [Save to Care Log]
```

### 3. OCR Prescription Scanner

```
<<AI: OCR Agent>>
       ↓
[Upload Prescription] → [Extract Text] → [Parse Medications] → [Generate Checklist]
```

---

## Logging & Audit Trail Requirements

**CRITICAL:** Every action, event, and interaction on the platform MUST be logged for audit, compliance, and troubleshooting purposes.

### Logging Visual Element

Add a new node type to represent logging in workflow diagrams:

| Element | Shape | Color | Border | Size | Icon |
|---------|-------|-------|--------|------|------|
| **Log Event** | Small rectangle | Light Gray (`#F8F9FA`) | 1px gray (`#ADB5BD`) | 80×40px | 📋 |

**Connector Style:**
- Dotted gray line (`#6C757D`)
- Small arrow
- Connects from action nodes to log nodes
- Label: "LOG" in small text

### What Must Be Logged

Every workflow should show logging connections for the following event types:

#### 1. Authentication Events
```
[Login Attempt] ···→ 📋 LOG: auth_login
[Logout] ···→ 📋 LOG: auth_logout
[MFA Verification] ···→ 📋 LOG: auth_mfa
[Password Change] ···→ 📋 LOG: auth_password_change
[Session Created] ···→ 📋 LOG: session_start
[Session Expired] ···→ 📋 LOG: session_end
[Failed Login] ···→ 📋 LOG: auth_failed
```

#### 2. User Actions (CRUD Operations)
```
[Create Record] ···→ 📋 LOG: create_{entity}
[Read/View Record] ···→ 📋 LOG: read_{entity}
[Update Record] ···→ 📋 LOG: update_{entity}
[Delete Record] ···→ 📋 LOG: delete_{entity}
[Form Submission] ···→ 📋 LOG: form_submit
[Button Click] ···→ 📋 LOG: action_{button_name}
```

#### 3. Financial Events
```
[Payment Initiated] ···→ 📋 LOG: payment_init
[Payment Success] ···→ 📋 LOG: payment_success
[Payment Failed] ···→ 📋 LOG: payment_failed
[Invoice Generated] ···→ 📋 LOG: invoice_created
[Invoice Paid] ···→ 📋 LOG: invoice_paid
[Refund Issued] ···→ 📋 LOG: refund_issued
[Escrow Hold] ···→ 📋 LOG: escrow_hold
[Escrow Release] ···→ 📋 LOG: escrow_release
[Subscription Change] ···→ 📋 LOG: subscription_change
```

#### 4. Communication Events
```
[Message Sent] ···→ 📋 LOG: message_sent
[Message Received] ···→ 📋 LOG: message_received
[Chat Session Start] ···→ 📋 LOG: chat_start
[Chat Session End] ···→ 📋 LOG: chat_end
[Notification Sent] ···→ 📋 LOG: notification_sent
[Broadcast Sent] ···→ 📋 LOG: broadcast_sent
[Email Sent] ···→ 📋 LOG: email_sent
[SMS Sent] ···→ 📋 LOG: sms_sent
```

#### 5. Verification Events
```
[Document Uploaded] ···→ 📋 LOG: document_upload
[Verification Submitted] ···→ 📋 LOG: verification_submit
[Status Changed] ···→ 📋 LOG: status_change
[Approval Given] ···→ 📋 LOG: approval
[Rejection Issued] ···→ 📋 LOG: rejection
[Resubmit Requested] ···→ 📋 LOG: resubmit_request
```

#### 6. System Events
```
[API Call] ···→ 📋 LOG: api_request
[API Response] ···→ 📋 LOG: api_response
[Error Occurred] ···→ 📋 LOG: error
[Background Job Start] ···→ 📋 LOG: job_start
[Background Job Complete] ···→ 📋 LOG: job_complete
[Cron Task Executed] ···→ 📋 LOG: cron_executed
```

#### 7. Access Events
```
[Page View] ···→ 📋 LOG: page_view
[File Downloaded] ···→ 📋 LOG: file_download
[File Uploaded] ···→ 📋 LOG: file_upload
[Report Generated] ···→ 📋 LOG: report_generated
[Export Created] ···→ 📋 LOG: export_created
```

### Log Entry Structure

Each log entry must contain:

```
┌─────────────────────────────────────────────────────────────┐
│                    LOG ENTRY STRUCTURE                       │
├─────────────────────────────────────────────────────────────┤
│ timestamp      │ ISO 8601 format (2025-12-03T14:30:00Z)     │
│ user_id        │ UUID of the user performing action          │
│ entity_type    │ admin/moderator/agency/caregiver/guardian  │
│ action_type    │ create/read/update/delete/auth/payment     │
│ target_resource│ Resource being acted upon (e.g., job_123)  │
│ before_value   │ Previous state (for updates)               │
│ after_value    │ New state (for updates)                    │
│ ip_address     │ User's IP address                          │
│ device_info    │ Browser/Device identification              │
│ session_id     │ Current session identifier                 │
│ result         │ success/failure/pending                    │
│ error_message  │ Error details (if failure)                 │
│ metadata       │ Additional context (JSON)                  │
└─────────────────────────────────────────────────────────────┘
```

### Logging by Entity Type

| Entity | Actions Logged | Can View Logs |
|--------|---------------|---------------|
| **Admin** | All platform operations, system configuration | ALL logs (platform-wide) |
| **Moderator** | Verification actions, dispute handling, ticket management | Own actions + assigned cases |
| **Agency** | Package management, caregiver assignments, billing | Own agency logs only |
| **Caregiver** | Check-ins/outs, care logs, job actions, invoices | Own activity logs only |
| **Guardian** | Purchases, payments, feedback, patient management | Own activity + patient care logs |
| **Patient** | Profile views, medication acknowledgments, feedback | Own limited activity |
| **Shop** | Orders, inventory changes, customer interactions | Own shop logs only |

### Audit Trail Retention Policy

```
┌─────────────────────────────────────────────────────────────┐
│                  LOG RETENTION PERIODS                       │
├─────────────────────────────────────────────────────────────┤
│ Log Type              │ Retention    │ Archive Policy       │
├───────────────────────┼──────────────┼──────────────────────┤
│ Financial logs        │ 7 years      │ Archive after 1 year │
│ Authentication logs   │ 2 years      │ Archive after 6 mo   │
│ Activity logs         │ 1 year       │ Archive after 3 mo   │
│ Communication logs    │ 1 year       │ Archive after 3 mo   │
│ System logs           │ 90 days      │ Delete after 90 days │
│ Error logs            │ 6 months     │ Archive after 1 mo   │
│ Access logs           │ 6 months     │ Delete after 6 mo    │
└─────────────────────────────────────────────────────────────┘
```

### Visual Representation in Workflows

When creating workflow diagrams, add a **Logging Layer** showing:

1. **Implicit Logging** - Every action node automatically logs (show with small 📋 badge)
2. **Explicit Log Points** - Critical events with dedicated log nodes
3. **Audit Trail Flow** - Separate swimlane showing log aggregation (optional for complex diagrams)

**Example: Login with Logging**
```
[START] → [Enter Credentials] → [Submit]
                                   │
                            ···→ 📋 LOG: auth_attempt
                                   │
                            ◇ Valid?
                           /         \
                       Yes             No
                        │              │
              [Dashboard]     [Show Error]
                   │              │
           ···→ 📋 LOG:    ···→ 📋 LOG:
              auth_success    auth_failed
```

### Admin Log Viewer Requirements

Show in Admin workflow:
```
[Admin Dashboard]
       │
       ├→ [View Audit Logs]
       │      ↓
       │   [Filter Logs]
       │      ├→ By Date Range
       │      ├→ By Entity Type
       │      ├→ By Action Type
       │      ├→ By User
       │      └→ By Result (success/failure)
       │      ↓
       │   [View Log Details]
       │      ↓
       │   [Export Logs] (CSV/JSON)
       │
       └→ [System Health Dashboard]
              ├→ Error Rate Metrics
              ├→ API Performance
              └→ Active Sessions
```

### Compliance Notes

1. **GDPR Compliance** - Personal data in logs must be anonymizable
2. **Data Encryption** - All logs encrypted at rest and in transit
3. **Access Control** - Logs accessible only to authorized roles
4. **Immutability** - Logs cannot be modified once written
5. **Backup** - Logs backed up daily with offsite copies

---

## Legend

```
┌─────────────────────────────────────────────┐
│                  LEGEND                      │
├─────────────────────────────────────────────┤
│ ○ Start/End Point (Gray)                    │
│ □ User Action (Blue border)                 │
│ □ System Process (Green border)             │
│ ◇ Decision Point (Yellow, Orange border)    │
│ ⬡ AI Agent (Cyan, Teal border)              │
│ ═══ External Service (Purple, double border)│
│ 📋 Log Event (Gray)                          │
│ 🔒 Account Locked (Red)                      │
│ ──→ Normal Flow (Black)                     │
│ - -→ Conditional Flow (Orange)              │
│ ···→ Data Flow (Blue)                       │
│ - -→ Error Path (Red)                       │
│ ─ ─→ Cross-Swimlane (Purple)                │
│                                             │
│ Color Key for Swimlanes:                    │
│ ■ Admin/Moderator: Purple shades            │
│ ■ Agency: Blue shades                       │
│ ■ Caregiver: Green shades                   │
│ ■ Guardian/Patient: Orange shades           │
│ ■ Shop: Teal shades                         │
└─────────────────────────────────────────────┘
```

---

## Additional Notes for FigJam

1. **Use Sticky Notes** for annotations and clarifications
2. **Group Related Elements** using frames with labels
3. **Add Timestamps** to show sequence where timing matters
4. **Include Version Number** in the title (v1.3)
5. **Mark Phase 2 Features** with a "Phase 2" badge (purple label)
6. **Show Logging** with small 📋 badges on action nodes
7. **Use Emojis** for quick visual identification:
   - 🔐 Authentication/Security
   - 💰 Payment/Financial
   - 📱 Mobile-specific
   - 🤖 AI Integration
   - ⚠️ Error/Warning States
   - 🔒 Account Locked
   - ✅ Success/Approved
   - ❌ Rejected/Failed

---

## Summary: Total Workflows = 15

### Single-Entity Workflows (11)
1. Platform Admin
2. Platform Moderator
3. Agency Admin
4. Agency Manager
5. Caregiver
6. Guardian/User
7. Patient
8. Shop Admin
9. Shop Manager
10. Payment & Escrow
11. AI Integration

### Multi-Entity Workflows (4)
12. Job Deployment Flow (Agency → Caregiver → Guardian → Admin)
13. Dispute Resolution Flow (Guardian/Caregiver → Moderator → Admin)
14. Package Negotiation Flow (Guardian ↔ Agency)
15. Verification Pipeline (Caregiver → Moderator → Admin)
