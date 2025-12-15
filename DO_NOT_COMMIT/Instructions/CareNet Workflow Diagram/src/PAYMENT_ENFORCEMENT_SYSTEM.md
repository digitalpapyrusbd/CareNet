# CareNet Platform - Payment Enforcement & Account Lockout System

## ⚠️ Overview

**Critical Rule:** If payment is pending for **7 days** after bill generation, the entity account will be **AUTOMATICALLY LOCKED**.

This system ensures financial discipline and timely payments across all platform entities while protecting active services and care continuity.

---

## 🔐 Lockout Matrix by Entity

| Entity | Lockout Triggers | What Gets Locked | What Remains Active | Unlock Method |
|--------|-----------------|------------------|---------------------|---------------|
| **Agency** | • Caregiver invoice unpaid 7+ days<br>• Platform subscription unpaid 7+ days | • Cannot deploy caregivers<br>• Cannot create packages<br>• Cannot access caregiver pool<br>• Cannot message | • View existing jobs (read-only)<br>• Make payments<br>• Active jobs continue | Pay ALL overdue invoices |
| **Guardian** | • Agency invoice unpaid 7+ days<br>• Platform subscription unpaid 7+ days | • Cannot purchase packages<br>• Cannot send counter-offers<br>• Cannot browse new agencies | • View existing jobs<br>• Communicate with assigned caregivers<br>• Make payments<br>• Active care continues | Pay ALL overdue invoices |
| **Caregiver** | • Platform subscription unpaid 7+ days | • Cannot accept new jobs<br>• Cannot update availability<br>• Cannot generate invoices | • Complete existing jobs<br>• Communicate about active jobs<br>• Make payments | Pay overdue invoice |
| **Shop** | • Platform subscription unpaid 7+ days | • Cannot list products<br>• Cannot process new orders<br>• Cannot update listings | • Fulfill existing orders<br>• Make payments | Pay overdue invoice |

---

## 📅 7-Day Lockout Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT ENFORCEMENT TIMELINE                  │
└─────────────────────────────────────────────────────────────────┘

Day 0: 📄 Invoice Generated
       ├─ Invoice sent to entity
       ├─ Due date: Day 7
       └─ Status: PENDING

Day 3: 🔔 First Payment Reminder
       ├─ Email + SMS + In-app notification
       ├─ "Payment due in 4 days"
       └─ [Pay Now] button

Day 5: ⚠️ Second Warning (2 days to lockout)
       ├─ Email + SMS + In-app notification
       ├─ "URGENT: Payment due in 2 days"
       ├─ "Avoid account lockout"
       └─ [Pay Immediately] button

Day 6: 🚨 Final Warning (24 hours to lockout)
       ├─ Email + SMS + In-app + Phone call (optional)
       ├─ "FINAL WARNING: 24 hours to lockout"
       ├─ List of features that will be locked
       └─ [Pay Now to Avoid Lockout] button

Day 7: 🔒 ACCOUNT LOCKED
       ├─ Automatic system lockout
       ├─ Email + SMS + In-app notification
       ├─ "Account locked due to unpaid invoice"
       ├─ List of locked features
       ├─ List of active features
       └─ [View Invoices] [Make Payment] buttons

Payment Made: ✅ Auto-Unlock
       ├─ System verifies payment
       ├─ Account unlocked within 1 hour
       ├─ Email + SMS + In-app confirmation
       └─ "Account fully restored"
```

---

## 📱 Lockout Notification Templates

### **Day 3 - First Reminder**

```
┌───────────────────────────────────────┐
│    🔔 Payment Reminder                │
├───────────────────────────────────────┤
│ Invoice #AG-12345                     │
│ Amount Due: $350.00                   │
│ Due Date: December 10, 2025           │
│                                       │
│ Payment is due in 4 days.             │
│ Pay now to avoid service interruption.│
│                                       │
│ [Pay Now]  [View Invoice Details]     │
└───────────────────────────────────────┘
```

---

### **Day 5 - Second Warning**

```
┌───────────────────────────────────────┐
│    ⚠️ URGENT: Payment Required         │
├───────────────────────────────────────┤
│ Invoice #AG-12345                     │
│ Amount Due: $350.00                   │
│ Due Date: December 10, 2025           │
│                                       │
│ ⚠️ Your payment is overdue!            │
│                                       │
│ Your account will be LOCKED in 2 DAYS │
│ if payment is not received.           │
│                                       │
│ Locked features will include:         │
│ • Cannot deploy caregivers            │
│ • Cannot create new packages          │
│ • Cannot access caregiver pool        │
│                                       │
│ [Pay Immediately]  [View Details]     │
└───────────────────────────────────────┘
```

---

### **Day 6 - Final Warning**

```
┌───────────────────────────────────────┐
│    🚨 FINAL WARNING                    │
├───────────────────────────────────────┤
│ Invoice #AG-12345                     │
│ Amount Due: $350.00                   │
│ OVERDUE BY: 6 DAYS                    │
│                                       │
│ 🚨 ACCOUNT LOCKOUT IN 24 HOURS!       │
│                                       │
│ Your account will be automatically    │
│ locked in 24 hours if payment is not  │
│ received immediately.                 │
│                                       │
│ Once locked, you will NOT be able to: │
│ ❌ Deploy caregivers to new jobs      │
│ ❌ Create new packages                │
│ ❌ Access caregiver pool search       │
│ ❌ Send messages to guardians         │
│                                       │
│ You WILL still be able to:            │
│ ✅ View existing jobs (read-only)     │
│ ✅ Make payment to unlock              │
│                                       │
│ [PAY NOW TO AVOID LOCKOUT]            │
│ [Contact Support for Help]            │
└───────────────────────────────────────┘
```

---

### **Day 7 - Account Locked**

```
┌───────────────────────────────────────┐
│    🔒 ACCOUNT LOCKED                   │
├───────────────────────────────────────┤
│ Your account has been automatically   │
│ locked due to unpaid invoice(s).      │
│                                       │
│ OUTSTANDING BALANCE: $350.00          │
│                                       │
│ Overdue Invoice(s):                   │
│ • Invoice #AG-12345: $350.00          │
│   (Overdue by 7 days)                 │
│                                       │
│ ───────────────────────────────       │
│ LOCKED FEATURES:                      │
│ 🚫 Cannot deploy caregivers           │
│ 🚫 Cannot create new packages         │
│ 🚫 Cannot access caregiver pool       │
│ 🚫 Cannot send messages               │
│                                       │
│ ACTIVE FEATURES:                      │
│ ✅ View existing jobs (read-only)     │
│ ✅ Make payments                       │
│ ✅ Active jobs continue                │
│                                       │
│ Your account will be automatically    │
│ unlocked within 1 hour after payment  │
│ confirmation.                         │
│                                       │
│ [MAKE PAYMENT NOW]                    │
│ [View Invoice Details]                │
│ [Contact Support]                     │
└───────────────────────────────────────┘
```

---

### **After Payment - Account Unlocked**

```
┌───────────────────────────────────────┐
│    ✅ ACCOUNT UNLOCKED                 │
├───────────────────────────────────────┤
│ Thank you for your payment!           │
│                                       │
│ Payment Confirmed:                    │
│ • Invoice #AG-12345: $350.00 ✓       │
│ • Payment Date: December 10, 2025     │
│                                       │
│ Your account is now FULLY ACTIVE.     │
│ All features have been restored.      │
│                                       │
│ You can now:                          │
│ ✅ Deploy caregivers to jobs          │
│ ✅ Create new packages                │
│ ✅ Access caregiver pool              │
│ ✅ Send messages                       │
│                                       │
│ [View Receipt]  [Return to Dashboard] │
└───────────────────────────────────────┘
```

---

## 🎯 Entity-Specific Lockout Details

### **1. AGENCY LOCKOUT**

#### **Triggers:**
- Caregiver invoice unpaid for 7+ days (Agency owes Caregiver)
- Platform subscription + commission unpaid for 7+ days (Agency owes Platform)

#### **Locked Features:**
| Feature | Status | Reason |
|---------|--------|--------|
| Deploy Caregivers | 🔒 LOCKED | Cannot assign new jobs |
| Create Packages | 🔒 LOCKED | Cannot list new services |
| Caregiver Pool Search | 🔒 LOCKED | Cannot recruit new caregivers |
| Message Guardians/Caregivers | 🔒 LOCKED | Limited to active job communication |
| Create Job Offers | 🔒 LOCKED | Cannot send new offers |
| Update Package Pricing | 🔒 LOCKED | Cannot modify offerings |

#### **Active Features:**
| Feature | Status | Reason |
|---------|--------|--------|
| View Existing Jobs | ✅ ACTIVE | Read-only access |
| Manage Active Jobs | ✅ ACTIVE | Care continuity |
| Make Payments | ✅ ACTIVE | Can unlock account |
| View Invoices | ✅ ACTIVE | See outstanding balance |
| Emergency Communication | ✅ ACTIVE | For active jobs only |

#### **Business Impact:**
- ⚠️ **Cannot take on new business**
- ⚠️ **Cannot recruit new caregivers**
- ✅ **Existing jobs protected**
- ✅ **Active care continues uninterrupted**

---

### **2. GUARDIAN LOCKOUT**

#### **Triggers:**
- Agency service invoice unpaid for 7+ days (Guardian owes Agency)
- Platform subscription unpaid for 7+ days (Guardian owes Platform)

#### **Locked Features:**
| Feature | Status | Reason |
|---------|--------|--------|
| Purchase Packages | 🔒 LOCKED | Cannot buy new services |
| Send Counter-Offers | 🔒 LOCKED | Cannot negotiate |
| Browse New Agencies | 🔒 LOCKED | Cannot search for providers |
| Message New Agencies | 🔒 LOCKED | Limited to active service communication |
| Request New Care | 🔒 LOCKED | Cannot initiate new bookings |

#### **Active Features:**
| Feature | Status | Reason |
|---------|--------|--------|
| View Existing Jobs | ✅ ACTIVE | Monitor active care |
| Message Assigned Caregiver | ✅ ACTIVE | Care coordination |
| Make Payments | ✅ ACTIVE | Can unlock account |
| View Invoices | ✅ ACTIVE | See outstanding balance |
| Track Active Care | ✅ ACTIVE | Care monitoring |

#### **Business Impact:**
- ⚠️ **Cannot book new care services**
- ⚠️ **Cannot negotiate with agencies**
- ✅ **Active care continues**
- ✅ **Can communicate with current caregiver**

---

### **3. CAREGIVER LOCKOUT**

#### **Triggers:**
- Platform subscription + commission unpaid for 7+ days (Caregiver owes Platform)

#### **Locked Features:**
| Feature | Status | Reason |
|---------|--------|--------|
| Accept New Job Offers | 🔒 LOCKED | Cannot take new assignments |
| Update Availability Status | 🔒 LOCKED | Status frozen |
| Generate New Invoices | 🔒 LOCKED | Cannot bill for new work |
| Browse Job Opportunities | 🔒 LOCKED | Cannot see new offers |
| Update Profile | 🔒 LOCKED | Profile frozen |

#### **Active Features:**
| Feature | Status | Reason |
|---------|--------|--------|
| Complete Existing Jobs | ✅ ACTIVE | Care continuity |
| Communicate About Active Jobs | ✅ ACTIVE | Job coordination |
| Make Payments | ✅ ACTIVE | Can unlock account |
| View Active Assignments | ✅ ACTIVE | See current work |
| Log Work Hours | ✅ ACTIVE | Track active job time |

#### **Business Impact:**
- ⚠️ **Cannot accept new assignments**
- ⚠️ **Cannot update availability**
- ✅ **Can complete current jobs**
- ✅ **Current assignments protected**

---

### **4. SHOP LOCKOUT**

#### **Triggers:**
- Platform subscription + commission unpaid for 7+ days (Shop owes Platform)

#### **Locked Features:**
| Feature | Status | Reason |
|---------|--------|--------|
| List New Products | 🔒 LOCKED | Cannot add inventory |
| Process New Orders | 🔒 LOCKED | Cannot take new sales |
| Update Product Listings | 🔒 LOCKED | Cannot modify products |
| Run Promotions | 🔒 LOCKED | Cannot create offers |

#### **Active Features:**
| Feature | Status | Reason |
|---------|--------|--------|
| Fulfill Existing Orders | ✅ ACTIVE | Complete pending sales |
| Make Payments | ✅ ACTIVE | Can unlock account |
| View Orders | ✅ ACTIVE | See current orders |

---

## 🔄 Multiple Overdue Invoices

### **Scenario: Agency with 3 Overdue Invoices**

```
┌─────────────────────────────────────────────────────────┐
│    🔒 ACCOUNT LOCKED - MULTIPLE OVERDUE INVOICES        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Your account is locked due to multiple unpaid invoices.│
│                                                         │
│ OVERDUE INVOICES:                                       │
│ ┌───────────────────────────────────────────────────┐  │
│ │ Invoice #CG-001                                   │  │
│ │ Caregiver Payment: $500.00                        │  │
│ │ Overdue by: 14 days                               │  │
│ │ Status: UNPAID ❌                                  │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ Invoice #PLT-002                                  │  │
│ │ Platform Subscription: $300.00                    │  │
│ │ Overdue by: 10 days                               │  │
│ │ Status: UNPAID ❌                                  │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ Invoice #PLT-003                                  │  │
│ │ Platform Commission: $150.00                      │  │
│ │ Overdue by: 8 days                                │  │
│ │ Status: UNPAID ❌                                  │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ─────────────────────────────────────────────────────  │
│ TOTAL OUTSTANDING: $950.00                             │
│ ─────────────────────────────────────────────────────  │
│                                                         │
│ ⚠️ You MUST pay ALL invoices to unlock your account.   │
│ Partial payment will NOT unlock your account.          │
│                                                         │
│ Payment Priority: Oldest invoice first                 │
│                                                         │
│ [PAY ALL INVOICES - $950.00]                           │
│ [Pay Individual Invoices]                              │
│ [Contact Support]                                      │
└─────────────────────────────────────────────────────────┘
```

### **Payment Rules:**
1. ✅ **Must pay ALL invoices** to unlock
2. ❌ **Partial payment does NOT unlock** account
3. 📊 **Oldest invoice should be paid first** (recommended)
4. 💰 **Total outstanding balance must be cleared**

---

## 👨‍💼 Admin Controls & Override

### **Admin Dashboard - Locked Accounts Management**

```
┌─────────────────────────────────────────────────────────┐
│    Admin Panel - Locked Accounts Dashboard              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ LOCKED ACCOUNTS OVERVIEW                                │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Total Locked: 47                                │    │
│ │ • Agencies: 12                                  │    │
│ │ • Guardians: 18                                 │    │
│ │ • Caregivers: 15                                │    │
│ │ • Shops: 2                                      │    │
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ FINANCIAL METRICS                                       │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Total Outstanding Debt: $23,450.00              │    │
│ │ Average Days Overdue: 12 days                   │    │
│ │ Payment Recovery Rate: 87%                      │    │
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ LOCKED AGENCIES                                         │
│ ┌─────────────────────────────────────────────────┐    │
│ │ AgencyCare Plus                                 │    │
│ │ Outstanding: $950.00 | Overdue: 14 days        │    │
│ │ [View Details] [Grant Grace Period] [Unlock]   │    │
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ [Export Report] [Send Bulk Reminder] [Analytics]       │
└─────────────────────────────────────────────────────────┘
```

### **Admin Capabilities:**

| Action | Admin Can Do | Moderator Can Do |
|--------|--------------|------------------|
| View Locked Accounts | ✅ YES | ✅ YES |
| View Outstanding Debt | ✅ YES | ✅ YES |
| **Manually Unlock Account** | ✅ YES | ❌ NO |
| **Grant Grace Period (Extend deadline)** | ✅ YES | ❌ NO (Can request only) |
| **Apply Temporary Unlock (Emergency)** | ✅ YES | ❌ NO |
| View Payment History | ✅ YES | ✅ YES |
| Send Payment Reminders | ✅ YES | ✅ YES |
| Contact Locked Entities | ✅ YES | ✅ YES |
| **Override Lockout** | ✅ YES | ❌ NO |

### **Grace Period Workflow:**

```
Entity Requests Grace Period
         ↓
Moderator Reviews Request
         ↓
Moderator Submits to Admin with Recommendation
         ↓
Admin Reviews Case
         ↓
Admin Decision:
├─ Approve → Extend deadline by X days
├─ Deny → Account remains locked
└─ Conditional → Grant with payment plan
```

---

## 📊 Lockout Analytics & Reporting

### **Platform-Wide Metrics:**

```
┌──────────────────────────────────────────────┐
│    Payment Enforcement Analytics             │
├──────────────────────────────────────────────┤
│                                              │
│ LOCKOUT TRENDS (Last 30 Days)                │
│ ┌────────────────────────────────────────┐  │
│ │ Total Lockouts: 127                    │  │
│ │ Agencies: 45 (35%)                     │  │
│ │ Guardians: 52 (41%)                    │  │
│ │ Caregivers: 28 (22%)                   │  │
│ │ Shops: 2 (2%)                          │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ PAYMENT RECOVERY                             │
│ ┌────────────────────────────────────────┐  │
│ │ Accounts Unlocked: 110 (87%)           │  │
│ │ Still Locked: 17 (13%)                 │  │
│ │ Average Time to Payment: 3.2 days      │  │
│ │ Total Recovered: $45,320.00            │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ OVERDUE DEBT AGING                           │
│ ┌────────────────────────────────────────┐  │
│ │ 7-14 days: $12,450 (8 accounts)       │  │
│ │ 15-30 days: $8,200 (5 accounts)       │  │
│ │ 30+ days: $2,800 (4 accounts)         │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ EFFECTIVENESS SCORE: 87% ✅                  │
└──────────────────────────────────────────────┘
```

---

## 🛡️ System Business Rules

### **Core Principles:**

1. **⚡ Automatic Enforcement**
   - No manual intervention required
   - System locks accounts automatically at Day 7
   - No warnings or grace period after Day 7

2. **🔓 Automatic Unlock**
   - Payment verification automatic
   - Account unlocked within 1 hour
   - No manual unlock request needed

3. **🏥 Care Continuity First**
   - Active jobs always protected
   - Existing care never interrupted
   - Emergency communication always enabled

4. **📖 Read-Only Access**
   - Locked entities can view data
   - Cannot create new activities
   - Can make payments to unlock

5. **👨‍💼 Admin Override Available**
   - Exceptional circumstances only
   - Grace periods for legitimate cases
   - Emergency temporary unlocks

6. **💰 All or Nothing**
   - Must pay ALL overdue invoices
   - Partial payment doesn't unlock
   - Total balance must be cleared

7. **📱 Multi-Channel Notifications**
   - Email + SMS + In-app alerts
   - Progressive warning system
   - Clear action buttons

8. **📊 Complete Transparency**
   - Entity sees exactly what's locked
   - Clear unlock conditions
   - Real-time status updates

---

## 🚨 Emergency Scenarios

### **Emergency Care Situation During Lockout:**

**Scenario:** Guardian account locked but patient needs immediate care

**Process:**
1. Guardian contacts support via emergency hotline
2. Support escalates to Admin immediately
3. Admin reviews case urgency
4. Admin can:
   - Grant temporary unlock (24-48 hours)
   - Arrange payment plan
   - Enable specific features for emergency

**Active Care Protected:**
- ✅ Existing caregiver can continue
- ✅ Communication remains active
- ✅ Emergency services not affected

---

### **Disputed Invoice During Lockout:**

**Scenario:** Agency locked due to disputed caregiver invoice

**Process:**
1. Agency submits dispute through support
2. Moderator reviews dispute
3. If legitimate dispute:
   - Moderator submits to Admin
   - Admin can temporarily unlock during investigation
   - Payment held until resolution
4. If resolved in agency's favor:
   - Invoice corrected
   - Account unlocked automatically

---

## 📋 Implementation Checklist

### **Technical Requirements:**

- ✅ **Automated Lockout System**
  - [ ] Day 7 automatic trigger
  - [ ] Feature-level permission system
  - [ ] Read-only access implementation

- ✅ **Notification System**
  - [ ] Day 3, 5, 6, 7 automated emails
  - [ ] SMS integration
  - [ ] In-app notification system
  - [ ] Push notifications (mobile)

- ✅ **Payment Integration**
  - [ ] Payment verification webhook
  - [ ] Automatic unlock trigger
  - [ ] 1-hour unlock processing
  - [ ] Payment confirmation emails

- ✅ **Admin Dashboard**
  - [ ] Locked accounts overview
  - [ ] Outstanding debt tracking
  - [ ] Manual unlock capability
  - [ ] Grace period management
  - [ ] Analytics and reporting

- ✅ **Entity Dashboard Lockout UI**
  - [ ] Prominent lockout banner
  - [ ] List of locked features
  - [ ] Outstanding invoice display
  - [ ] Payment buttons
  - [ ] Unlock status tracker

---

## 🎯 Success Metrics

### **Key Performance Indicators:**

1. **Payment Recovery Rate:** Target 85%+
2. **Average Time to Payment After Lockout:** Target < 5 days
3. **Lockout Rate:** Target < 5% of active accounts
4. **False Positive Lockouts:** Target < 1%
5. **Admin Override Rate:** Target < 3% of lockouts

---

## ✅ Summary

The 7-Day Payment Enforcement System ensures:

- 💰 **Timely payments** across all tiers
- 🏥 **Care continuity** is never interrupted
- ⚡ **Automatic enforcement** with no manual work
- 📱 **Clear communication** with progressive warnings
- 🔓 **Quick unlock** within 1 hour of payment
- 👨‍💼 **Admin flexibility** for exceptional cases
- 📊 **Complete transparency** for all parties

**This system balances financial discipline with platform reliability and user care!** 🌟
