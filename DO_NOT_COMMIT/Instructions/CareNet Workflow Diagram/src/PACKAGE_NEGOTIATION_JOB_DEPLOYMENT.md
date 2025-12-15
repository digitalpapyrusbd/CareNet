# CareNet Package Negotiation & Job Deployment System

## 🔄 Complete Workflow Overview

### **Package → Negotiation → Purchase → Job → Deployment**

---

## 1️⃣ Guardian/Patient Package Browsing & Negotiation

### **Browse & Select**
1. **Browse Agencies** - Filter by location, rating, specialization
2. **Select Package** - View package details (shows price, NOT wages)
3. **Negotiate Decision** - Accept as-is OR send counter-offer

### **Negotiation Flow**
4. **Send Counter-offer** - Request:
   - Price discount
   - Package customization
   - Additional services
   - Schedule adjustments

5. **Wait for Agency Response** - Agency reviews counter-offer

6. **Review Agency Counter-offer** - Three options:
   - ✅ **Accept** - Proceed to checkout
   - 🔄 **Counter Again** - Continue negotiating
   - ❌ **Browse Others** - Look at different agencies

7. **Accept Final Offer** - Agree to negotiated terms

### **Purchase & Job Creation**
8. **Checkout** - **PURCHASED PACKAGE BECOMES A JOB**
9. **Payment Gateway** - bKash/Nagad payment processing
10. **Job Created** - Appears in Agency's Job Inbox

---

## 2️⃣ Agency Package Management & Negotiation

### **Package Creation**
- **Manage Packages** - Central hub
- **Create/Edit Package** - Set pricing, services, duration
- **Publish** - Make available to guardians

### **Handle Counter-offers**
- **Package Inquiries** - View all counter-offers from guardians
- **Review Counter-offer** - See guardian's request (discount, customization)
- **Make Counter-offer** - Three response options:

  **Option A: Offer Discount**
  - Reduce price to match budget
  - Percentage off or fixed amount
  
  **Option B: Add Services/Customize**
  - Bundle additional services
  - Extended hours
  - Extra care features
  - Custom schedule
  
  **Option C: Decline Offer**
  - Cannot meet requirements
  - Guardian looks elsewhere

---

## 3️⃣ Job Deployment by Agency

### **Job Inbox**
Once guardian purchases package (after negotiation or directly):
- **Package automatically becomes Job**
- Appears in **Agency Job Inbox**

### **Job Assignment Process**

1. **View Job Details**
   - Guardian information
   - Patient requirements
   - Package specifications
   - Schedule and duration

2. **Assign Caregiver** - Two methods:
   
   **Method A: From Roster**
   - Select from agency's existing caregivers
   - Already vetted and employed
   
   **Method B: Search Pool**
   - Search platform's caregiver pool
   - Filter by skills, availability, ratings
   - View detailed profiles
   - Check availability status

3. **Deploy Caregiver**
   - Send job offer to selected caregiver
   - Include all job details (no pricing shown to caregiver)

4. **Wait for Acceptance**
   - Caregiver reviews offer
   - Can accept or decline

5. **Job Status**
   - **Accepted** → Job Active, caregiver on assignment
   - **Declined** → Return to "Assign Caregiver" step, choose another

---

## 4️⃣ Caregiver Job Acceptance

### **Job Offers & Assignments**

1. **View Job Offers**
   - See all offers from agencies
   - Agency name visible
   - **NO PRICING SHOWN** (caregiver doesn't see what guardian paid)

2. **View Job Details**
   - Patient needs and requirements
   - Care schedule
   - Duration
   - Location
   - Special instructions

3. **Accept Job Decision**
   - ✅ **Accept** - Confirm assignment, job becomes active
   - ❌ **Decline** - Agency must find another caregiver

4. **Job Assigned**
   - Caregiver is now on assignment
   - Can begin check-in and care logging

---

## 💰 Pricing Transparency Model

### **Guardian/Patient View:**
- ✅ See **FULL PACKAGE PRICE** (what they pay)
- ✅ Can negotiate for discounts
- ✅ See total cost breakdown
- ❌ Do NOT see caregiver wages

### **Agency View:**
- ✅ See **PACKAGE PRICE** (what guardian pays)
- ✅ See **CAREGIVER WAGES** (what they pay caregivers)
- ✅ See **PROFIT MARGIN** (difference)
- ✅ Can offer discounts/customizations

### **Caregiver View:**
- ✅ See **THEIR WAGE** (what they earn from agency)
- ❌ Do NOT see **PACKAGE PRICE** (what guardian paid)
- ✅ See job requirements and schedule

### **Platform (Admin/Moderator) View:**
- ✅ See EVERYTHING
- ✅ Full transparency for oversight

---

## 🎯 Key Business Rules

1. **Negotiation is Optional**
   - Guardian can buy package directly OR negotiate
   - Multiple rounds of negotiation allowed

2. **Agency Flexibility**
   - Can offer discounts (reduce price)
   - Can add services (increase value)
   - Can decline if unprofitable

3. **Purchase Creates Job**
   - Once payment confirmed → Job created automatically
   - Appears immediately in Agency Job Inbox

4. **Caregiver Assignment**
   - Agency controls which caregiver gets job
   - Can search platform pool OR use own roster
   - Caregiver must accept before job starts

5. **Caregiver Can Decline**
   - If declined, agency picks different caregiver
   - No penalty for declining (maintains caregiver autonomy)

---

## 📊 Workflow Summary

```
GUARDIAN                    AGENCY                      CAREGIVER
---------                   -------                     ----------
Browse Agencies
Select Package
    ↓
Counter-offer? --------→  Review Offer
    ↓                         ↓
Wait for Response      Make Counter-offer
    ↓                         ↓
Review Response   ←----  Send Response
    ↓
Accept Final Offer
    ↓
Checkout & Pay
    ↓
[JOB CREATED] --------→  Job Inbox
                              ↓
                         View Job Details
                              ↓
                         Assign Caregiver ----→  Receive Job Offer
                              ↓                        ↓
                         Wait for Response      View Job Details
                              ↓                        ↓
                         Job Status       ←----  Accept/Decline
                              ↓                        ↓
                         [JOB ACTIVE]              [ON ASSIGNMENT]
```

---

## ✅ Implementation Status

- ✅ Guardian package browsing
- ✅ Guardian counter-offer submission
- ✅ Guardian response review (accept/counter/browse)
- ✅ Agency package creation
- ✅ Agency counter-offer handling
- ✅ Agency discount/addition options
- ✅ Purchase → Job conversion
- ✅ Agency job inbox
- ✅ Agency caregiver assignment (roster + pool)
- ✅ Agency caregiver deployment
- ✅ Caregiver job offer receipt
- ✅ Caregiver accept/decline
- ✅ Job status tracking

---

## 🚀 Next Enhancements

Consider adding:
1. **Time limits** on counter-offers (e.g., 48 hours to respond)
2. **Counter-offer history** - Track negotiation thread
3. **Package templates** - Pre-set discount rules
4. **Auto-assign AI** - Suggest best caregiver match for job
5. **Caregiver preferences** - Filter jobs by caregiver criteria
6. **Multi-caregiver jobs** - Team assignments
7. **Job shifts** - Multiple caregivers rotating schedule
