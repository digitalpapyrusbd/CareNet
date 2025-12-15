# CareNet Platform Billing System

## 💰 Complete Billing Flow Overview

The CareNet platform implements a **three-tier billing structure** that manages financial transactions between all parties while maintaining transparency and proper revenue collection.

---

## 🔄 Billing Flow Summary

```
CAREGIVER --------→ AGENCY --------→ GUARDIAN
    ↓                   ↓                 ↓
    └──────→ PLATFORM ←─┴────────────────┘
            (Subscription + Commission)
```

---

## 1️⃣ Caregiver → Agency Billing

### **Purpose:** Caregivers bill agencies for work performed

### **Workflow:**
1. **Generate Invoice to Agency**
   - Caregiver accesses billing dashboard
   - Selects completed job to invoice
   - System auto-populates job details

2. **Job Invoice Details**
   - Hours worked
   - Job completion status
   - Agreed wage rate
   - Total amount due
   - Job reference number

3. **Submit to Agency**
   - Invoice sent to agency for review
   - Agency receives notification
   - Invoice appears in agency's "Caregiver Invoices" queue

### **What Caregiver Sees:**
- ✅ Their wage (what they earn)
- ✅ Hours worked
- ✅ Job completion details
- ❌ Does NOT see package price (what guardian paid)

---

## 2️⃣ Agency → Guardian Billing

### **Purpose:** Agencies bill guardians for services rendered

### **Workflow:**
1. **Generate Invoice to Guardian**
   - Agency accesses billing dashboard
   - Selects completed job/package
   - System generates service invoice

2. **Service Invoice Details**
   - Package price (what guardian agreed to pay)
   - Service duration
   - Completion status
   - Any negotiated discounts applied
   - Job reference number

3. **Send to Guardian**
   - Invoice sent to guardian
   - Guardian receives notification
   - Invoice appears in guardian's "Agency Service Invoices"

### **What Agency Sees:**
- ✅ Package price (what guardian pays)
- ✅ Caregiver wages (what they pay caregivers)
- ✅ Profit margin (difference)
- ✅ Service completion details

---

## 3️⃣ Platform → All Entities (Subscription + Commission)

### **Purpose:** Platform collects revenue for service provision and transaction facilitation

---

### **A) Platform → Caregiver Billing**

**Components:**
1. **Subscription Fee**
   - Monthly or Yearly subscription
   - Based on selected plan (Basic/Premium/Pro)
   - Provides platform access and features

2. **Platform Commission**
   - Commission on jobs obtained via platform
   - Percentage-based on caregiver earnings
   - Only applies to platform-facilitated jobs

**Caregiver Invoice Shows:**
```
Platform Invoice
├── Subscription Fee: $XX.XX (Monthly/Yearly)
├── Commission: $X.XX (X% of platform job earnings)
└── Total Due: $XXX.XX
```

**Payment:**
- Caregiver pays via payment gateway
- Subscription + Commission combined invoice

---

### **B) Platform → Agency Billing**

**Components:**
1. **Subscription Fee**
   - Monthly or Yearly subscription
   - Based on selected plan (Basic/Premium/Enterprise)
   - Provides platform access, caregiver pool, job management

2. **Transaction Commissions**
   - Per-job platform commission
   - Percentage of package price sold
   - Commission on each guardian purchase

**Agency Invoice Shows:**
```
Platform Invoice
├── Subscription Charges: $XXX.XX (Monthly/Yearly)
├── Transaction Commissions: $XX.XX (X% per job)
└── Total Due: $XXXX.XX
```

**Payment:**
- Agency pays via payment gateway
- Subscription + All commissions combined

---

### **C) Platform → Guardian Billing** *(If Applicable)*

**Components:**
1. **Subscription Fee** *(Optional)*
   - Monthly or Yearly subscription
   - Premium features access
   - Enhanced tracking and reporting

**Guardian Invoice Shows:**
```
Platform Subscription Invoice
└── Subscription Fee: $XX.XX (Monthly/Yearly)
```

**Payment:**
- Guardian pays via payment gateway
- Separate from agency service payments

---

## 📊 Agency Financial Flow (Example)

**Scenario:** Guardian purchases package for **$1,000**

### **Revenue (Incoming):**
- Guardian pays Agency: **$1,000**

### **Costs (Outgoing):**
1. **Pay Caregiver:** $600 (caregiver wage)
2. **Platform Commission:** $100 (10% of package price)
3. **Platform Subscription:** $50 (monthly fee)

### **Agency Profit:**
- **$1,000 - $600 - $100 - $50 = $250**

---

## 🔍 Agency Billing Dashboard Features

### **Three Billing Sections:**

1. **Caregiver Invoices**
   - Review incoming invoices from caregivers
   - Verify hours and completion
   - Approve and pay caregivers

2. **Generate Guardian Invoices**
   - Bill guardians for completed services
   - Track payment status
   - Send payment reminders

3. **Platform Invoice**
   - View subscription charges
   - View per-job commissions
   - Pay combined platform fees

---

## 🎯 Billing Workflow Step-by-Step

### **Complete Job Cycle:**

```
1. Guardian purchases package → Payment to Agency

2. Agency deploys caregiver → Job assignment

3. Caregiver completes job → Logs work completion

4. Caregiver generates invoice → Sends to Agency
   └── Agency reviews and pays caregiver

5. Agency generates invoice → Sends to Guardian
   └── Guardian pays for services

6. Platform generates invoices:
   ├── Caregiver: Subscription + Commission
   ├── Agency: Subscription + Transaction Commission
   └── Guardian: Subscription (if applicable)
```

---

## 💳 Payment Methods

### **All Entities:**
- **bKash** - Mobile financial service
- **Nagad** - Mobile financial service
- Payment gateway integration for secure processing

---

## 🔐 Billing Transparency Rules

### **Caregiver View:**
- ✅ See their own wage
- ✅ See hours worked
- ✅ See platform fees they pay
- ❌ Cannot see package price guardian paid
- ❌ Cannot see agency profit margin

### **Agency View:**
- ✅ See package price (guardian payment)
- ✅ See caregiver wages (what they pay)
- ✅ See profit margin
- ✅ See platform fees (subscription + commission)
- ✅ Full financial transparency for business operations

### **Guardian View:**
- ✅ See package price (what they pay)
- ✅ See service details
- ✅ See agency invoice breakdown
- ✅ See platform subscription (if applicable)
- ❌ Cannot see caregiver wages
- ❌ Cannot see agency costs

### **Admin/Moderator View:**
- ✅ See ALL financial transactions
- ✅ Complete transparency for oversight
- ✅ Can audit all billing activities

---

## 📝 Invoice Components

### **Caregiver → Agency Invoice:**
```
Invoice #CG-12345
Date: [Date]
Job Reference: JOB-67890

Services Rendered:
- Job: [Job Name]
- Duration: [X hours/days]
- Completion Date: [Date]
- Agreed Wage: $XX/hour
- Total Hours: XX

Amount Due: $XXX.XX
Payment Method: [Bank Transfer/Mobile Payment]
Due Date: [Date]
```

### **Agency → Guardian Invoice:**
```
Invoice #AG-12345
Date: [Date]
Package Reference: PKG-67890

Service Details:
- Package: [Package Name]
- Service Duration: [X days/weeks]
- Completion Date: [Date]
- Package Price: $XXX.XX
- Discount Applied: -$XX.XX (if negotiated)

Total Amount Due: $XXX.XX
Payment Method: bKash/Nagad
Due Date: [Date]
```

### **Platform → Entity Invoice:**
```
Invoice #PLT-12345
Date: [Date]
Billing Period: [Month/Year]

Charges:
1. Subscription Fee
   - Plan: [Basic/Premium/Enterprise]
   - Period: [Monthly/Yearly]
   - Amount: $XX.XX

2. Transaction Commissions (For Agencies)
   - Job 1: $X.XX
   - Job 2: $X.XX
   - Total: $XX.XX

OR

2. Platform Commission (For Caregivers)
   - Jobs Completed: X
   - Commission Rate: X%
   - Total: $XX.XX

Total Due: $XXX.XX
Payment Method: [Payment Gateway]
Due Date: [Date]
```

---

## 🚀 Billing Features by Entity

### **Caregiver Billing Features:**
- ✅ Generate job invoices to agencies
- ✅ Track invoice status (Pending/Paid)
- ✅ View platform subscription invoice
- ✅ View commission breakdown
- ✅ Payment history
- ✅ Automated invoice generation

### **Agency Billing Features:**
- ✅ Receive caregiver invoices
- ✅ Review and approve payments
- ✅ Generate guardian invoices
- ✅ Track payment status
- ✅ View platform fees breakdown
- ✅ Profit margin calculator
- ✅ Financial reports and analytics

### **Guardian Billing Features:**
- ✅ Receive agency service invoices
- ✅ View invoice details
- ✅ Make payments via bKash/Nagad
- ✅ Payment history
- ✅ Download invoice receipts
- ✅ Platform subscription management (if applicable)

### **Admin/Platform Billing Features:**
- ✅ Generate subscription invoices
- ✅ Calculate transaction commissions
- ✅ Track all payments
- ✅ Revenue analytics
- ✅ Payment reconciliation
- ✅ Audit trail
- ✅ Financial reporting

---

## 🔔 Billing Notifications

### **Auto-notifications Sent:**

1. **Invoice Generated**
   - Recipient receives notification
   - Email/SMS/In-app alert
   - Invoice details and amount due

2. **Payment Reminder**
   - Sent X days before due date
   - Second reminder if overdue

3. **Payment Received**
   - Confirmation to payer
   - Receipt generated automatically

4. **Payment Overdue**
   - Escalation notification
   - Late fee warning (if applicable)

---

## ⚠️ Payment Enforcement & Account Lockout System

### **7-Day Payment Rule**

**If payment is pending for 7 days after bill generation, the entity account will be LOCKED.**

---

### **Lockout Triggers by Entity:**

#### **1. Agency Lockout Conditions:**

**Locked if ANY of these are overdue 7+ days:**
- ❌ Caregiver invoice unpaid (Agency owes Caregiver)
- ❌ Platform subscription + commission unpaid (Agency owes Platform)

**When Agency is Locked:**
- 🚫 Cannot deploy caregivers to new jobs
- 🚫 Cannot create new packages
- 🚫 Cannot access caregiver pool search
- 🚫 Cannot send messages to guardians/caregivers
- ✅ CAN view existing jobs (read-only)
- ✅ CAN make overdue payments
- ⚠️ **Existing active jobs continue but no new activities**

**Unlock Condition:**
- ✅ Pay ALL overdue invoices
- ✅ System auto-unlocks within 1 hour of payment confirmation

---

#### **2. Guardian Lockout Conditions:**

**Locked if ANY of these are overdue 7+ days:**
- ❌ Agency service invoice unpaid (Guardian owes Agency)
- ❌ Platform subscription unpaid (Guardian owes Platform, if applicable)

**When Guardian is Locked:**
- 🚫 Cannot purchase new packages
- 🚫 Cannot send counter-offers to agencies
- 🚫 Cannot browse or communicate with new agencies
- ✅ CAN view existing jobs (read-only)
- ✅ CAN communicate with assigned caregivers (active jobs only)
- ✅ CAN make overdue payments
- ⚠️ **Active care services continue but no new bookings**

**Unlock Condition:**
- ✅ Pay ALL overdue invoices
- ✅ System auto-unlocks within 1 hour of payment confirmation

---

#### **3. Caregiver Lockout Conditions:**

**Locked if:**
- ❌ Platform subscription + commission unpaid 7+ days (Caregiver owes Platform)

**When Caregiver is Locked:**
- 🚫 Cannot accept new job offers
- 🚫 Cannot update availability status
- 🚫 Cannot generate new invoices to agencies
- ✅ CAN complete existing active jobs
- ✅ CAN communicate about active jobs
- ✅ CAN make overdue payments
- ⚠️ **Current assignments continue but no new jobs accepted**

**Unlock Condition:**
- ✅ Pay overdue platform invoice
- ✅ System auto-unlocks within 1 hour of payment confirmation

---

#### **4. Shop Lockout Conditions:**

**Locked if:**
- ❌ Platform subscription + commission unpaid 7+ days (Shop owes Platform)

**When Shop is Locked:**
- 🚫 Cannot list new products
- 🚫 Cannot process new orders
- 🚫 Cannot update product listings
- ✅ CAN fulfill existing orders
- ✅ CAN make overdue payments
- ⚠️ **Existing orders continue but no new sales**

**Unlock Condition:**
- ✅ Pay overdue platform invoice
- ✅ System auto-unlocks within 1 hour of payment confirmation

---

### **Lockout Timeline:**

```
Day 0: Invoice Generated
   ↓
Day 3: First Payment Reminder (Email/SMS/In-app)
   ↓
Day 5: Second Payment Reminder (Warning: 2 days to lockout)
   ↓
Day 6: Final Warning (24 hours to lockout)
   ↓
Day 7: ACCOUNT LOCKED ⚠️
   ↓
   Payment Made → Auto-unlock within 1 hour ✅
```

---

### **Lockout Notification System:**

**Day 3 Reminder:**
```
🔔 Payment Reminder
Invoice #[XXX] is due in 4 days.
Amount: $XXX.XX
Pay now to avoid service interruption.
[Pay Now Button]
```

**Day 6 Final Warning:**
```
⚠️ URGENT: Payment Required
Invoice #[XXX] is overdue.
Your account will be LOCKED in 24 hours if payment is not received.
Amount: $XXX.XX
[Pay Immediately Button]
```

**Day 7 Lockout:**
```
🚫 ACCOUNT LOCKED
Your account has been locked due to unpaid invoice(s).
Outstanding Balance: $XXX.XX

Locked Features: [List of disabled features]
Active Features: [List of still-accessible features]

[View Invoices] [Make Payment]

Your account will be unlocked automatically within 1 hour of payment confirmation.
```

**After Payment:**
```
✅ ACCOUNT UNLOCKED
Thank you for your payment!
Invoice #[XXX] has been paid.
Your account is now fully active.
```

---

### **Grace Period & Exceptions:**

**Admin Can:**
- ✅ Manually extend payment deadline (case-by-case basis)
- ✅ Apply grace period for technical issues
- ✅ Unlock account temporarily for emergency situations
- ✅ View all locked accounts dashboard

**Moderator Can:**
- ✅ View locked accounts
- ✅ Request Admin for grace period extension
- ❌ Cannot unlock accounts (Admin only)

---

### **Multiple Overdue Invoices:**

**If entity has multiple overdue invoices:**
- All invoices must be paid to unlock
- Partial payment does NOT unlock account
- Payment priority: Oldest invoice first
- System displays total outstanding balance

**Example:**
```
Account Locked - Multiple Overdue Invoices

Invoice #AG-001: $500.00 (14 days overdue)
Invoice #AG-002: $300.00 (10 days overdue)
Invoice #AG-003: $150.00 (8 days overdue)

Total Outstanding: $950.00

Pay ALL invoices to unlock your account.
[Pay All Button] [Pay Individual Invoices]
```

---

### **Lockout Analytics (Admin View):**

**Admin Dashboard Shows:**
- 📊 Total locked accounts by entity type
- 📊 Total outstanding debt
- 📊 Average days overdue
- 📊 Lockout trends over time
- 📊 Payment recovery rate after lockout

---

### **Business Rules:**

1. **7-Day Rule is Automatic** - No manual intervention needed
2. **No Warnings After Day 7** - Immediate lockout
3. **Payment Immediately Unlocks** - Within 1 hour (automated)
4. **Active Jobs Protected** - Existing services continue
5. **Read-Only Access** - Can view data but cannot create new activities
6. **Admin Override Available** - For exceptional circumstances

---

## ✅ Implementation Status

### **Caregiver Billing:**
- ✅ Generate invoice to agency
- ✅ Job invoice details
- ✅ Submit to agency
- ✅ Platform subscription invoice
- ✅ Commission breakdown
- ✅ Payment gateway integration

### **Agency Billing:**
- ✅ Receive caregiver invoices
- ✅ Review and approve workflow
- ✅ Pay caregiver functionality
- ✅ Generate guardian invoices
- ✅ Service invoice details
- ✅ Send to guardian
- ✅ Platform invoice (subscription + commission)
- ✅ Payment gateway integration

### **Guardian Billing:**
- ✅ Agency service invoices
- ✅ Review invoice workflow
- ✅ Pay agency functionality
- ✅ Platform subscription invoice
- ✅ Subscription details
- ✅ Payment gateway integration

### **Platform Billing:**
- ✅ Caregiver subscription + commission
- ✅ Agency subscription + transaction commission
- ✅ Guardian subscription (if applicable)
- ✅ Invoice generation workflows
- ✅ Payment tracking

---

## 🎓 Key Principles

1. **Transparency:** Each entity sees what they need to see, nothing more
2. **Automation:** Invoices auto-generate based on job completion
3. **Multiple Revenue Streams:** Subscriptions + Commissions
4. **Fair Pricing:** Caregivers paid fairly, agencies profit reasonably, platform sustainable
5. **Secure Payments:** Integrated payment gateways for all transactions
6. **Audit Trail:** Complete financial history for oversight and compliance

---

## 📌 Next Enhancements

Consider adding:
1. **Payment Schedules** - Installment payments for large packages
2. **Auto-pay** - Recurring subscription auto-debit
3. **Invoice Disputes** - Workflow for challenging invoices
4. **Late Fees** - Automated late payment penalties
5. **Tax Integration** - VAT/Tax calculation and reporting
6. **Multi-currency** - Support for different currencies
7. **Financial Analytics** - Revenue forecasting and trends
8. **Expense Tracking** - Agency expense management
9. **Payroll Integration** - Bulk caregiver payments
10. **Invoice Templates** - Customizable invoice designs