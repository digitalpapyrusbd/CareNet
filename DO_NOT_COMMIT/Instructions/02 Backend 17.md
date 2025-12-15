# Backend Documentation 17 - Dispute Resolution

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Modules**: Disputes  
**Priority**: 🟡 High

---

## 📋 Overview

The Dispute Resolution System manages **conflicts between users** with structured workflows, evidence submission, moderator review, and admin decision-making.

### **Key Features**
- Dispute creation with categories
- Evidence submission (documents/photos)
- Moderator investigation
- Admin final decision
- Automatic refunds/penalties
- Resolution timeline tracking
- Appeal process
- Status notifications

**Module Path**: `/backend/src/disputes/`

---

## 📁 Module Structure

```
disputes/
├── disputes.module.ts             # Module configuration
├── disputes.service.ts            # Business logic
├── disputes.controller.ts         # HTTP endpoints
└── dto/
    ├── create-dispute.dto.ts     # Dispute validation
    ├── submit-evidence.dto.ts    # Evidence validation
    └── resolve-dispute.dto.ts    # Resolution validation
```

---

## 🎯 Core Features

### **1. Create Dispute**

```typescript
POST /api/disputes
Authorization: Bearer {accessToken}

Request Body:
{
  "jobId": "job-uuid",
  "respondentId": "user-uuid",
  "category": "PAYMENT_ISSUE" | "SERVICE_QUALITY" | "MISCONDUCT" | "CONTRACT_BREACH" | "OTHER",
  "title": "Payment not received after job completion",
  "description": "I completed the job on Dec 5th but haven't received payment yet.",
  "desiredResolution": "REFUND" | "COMPENSATION" | "APOLOGY" | "OTHER"
}

Response:
{
  "success": true,
  "message": "Dispute created successfully",
  "data": {
    "id": "dispute-uuid",
    "disputeNumber": "DISP-2025-00123",
    "jobId": "job-uuid",
    "complainantId": "user-uuid",
    "respondentId": "user-uuid-2",
    "category": "PAYMENT_ISSUE",
    "title": "Payment not received after job completion",
    "status": "PENDING_EVIDENCE",
    "createdAt": "2025-12-11T10:00:00Z",
    "deadline": "2025-12-18T23:59:59Z"
  }
}
```

---

### **2. Submit Evidence**

```typescript
POST /api/disputes/:disputeId/evidence
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Form Data:
- description: "Invoice and job completion proof"
- files: [file1.pdf, photo1.jpg, photo2.jpg]

Response:
{
  "success": true,
  "message": "Evidence submitted successfully",
  "data": {
    "evidenceId": "evidence-uuid",
    "disputeId": "dispute-uuid",
    "submittedBy": "user-uuid",
    "description": "Invoice and job completion proof",
    "files": [
      {
        "id": "file-uuid-1",
        "fileName": "invoice.pdf",
        "fileType": "application/pdf",
        "fileSize": 123456,
        "url": "https://r2.com/disputes/invoice.pdf"
      },
      {
        "id": "file-uuid-2",
        "fileName": "photo1.jpg",
        "fileType": "image/jpeg",
        "fileSize": 234567,
        "url": "https://r2.com/disputes/photo1.jpg"
      }
    ],
    "submittedAt": "2025-12-11T10:15:00Z"
  }
}
```

---

### **3. Get My Disputes**

```typescript
GET /api/disputes/my-disputes
Authorization: Bearer {accessToken}

Query Parameters:
- status: "PENDING_EVIDENCE" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED"
- role: "COMPLAINANT" | "RESPONDENT"
- page: number
- limit: number

Response:
{
  "success": true,
  "data": [
    {
      "id": "dispute-uuid",
      "disputeNumber": "DISP-2025-00123",
      "job": {
        "id": "job-uuid",
        "title": "Elderly Care - 24h shift"
      },
      "category": "PAYMENT_ISSUE",
      "title": "Payment not received",
      "status": "UNDER_REVIEW",
      "myRole": "COMPLAINANT",
      "otherParty": {
        "id": "user-uuid-2",
        "fullName": "Agency Name",
        "role": "AGENCY"
      },
      "createdAt": "2025-12-11T10:00:00Z",
      "deadline": "2025-12-18T23:59:59Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 3
  }
}
```

---

### **4. Get Dispute Details**

```typescript
GET /api/disputes/:disputeId
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": {
    "id": "dispute-uuid",
    "disputeNumber": "DISP-2025-00123",
    "job": {
      "id": "job-uuid",
      "title": "Elderly Care - 24h shift",
      "amount": 5000
    },
    "complainant": {
      "id": "user-uuid-1",
      "fullName": "Caregiver Ahmed",
      "role": "CAREGIVER"
    },
    "respondent": {
      "id": "user-uuid-2",
      "fullName": "Care Agency",
      "role": "AGENCY"
    },
    "category": "PAYMENT_ISSUE",
    "title": "Payment not received after job completion",
    "description": "I completed the job on Dec 5th but haven't received payment yet.",
    "desiredResolution": "REFUND",
    "status": "UNDER_REVIEW",
    "timeline": [
      {
        "event": "DISPUTE_CREATED",
        "actor": "Caregiver Ahmed",
        "timestamp": "2025-12-11T10:00:00Z"
      },
      {
        "event": "EVIDENCE_SUBMITTED",
        "actor": "Caregiver Ahmed",
        "timestamp": "2025-12-11T10:15:00Z"
      },
      {
        "event": "ASSIGNED_TO_MODERATOR",
        "actor": "System",
        "timestamp": "2025-12-11T10:30:00Z"
      }
    ],
    "evidence": [
      {
        "id": "evidence-uuid",
        "submittedBy": "user-uuid-1",
        "description": "Invoice and job completion proof",
        "files": [...],
        "submittedAt": "2025-12-11T10:15:00Z"
      }
    ],
    "createdAt": "2025-12-11T10:00:00Z",
    "deadline": "2025-12-18T23:59:59Z"
  }
}
```

---

### **5. Moderator Review Dispute**

```typescript
POST /api/disputes/:disputeId/moderate
Authorization: Bearer {accessToken}
Role: MODERATOR

Request Body:
{
  "recommendation": "FAVOR_COMPLAINANT" | "FAVOR_RESPONDENT" | "PARTIAL_RESOLUTION" | "REQUIRES_ADMIN",
  "findings": "Evidence shows job was completed as agreed. Payment is overdue.",
  "suggestedAction": "REFUND_FULL" | "REFUND_PARTIAL" | "WARNING" | "NO_ACTION",
  "notes": "Caregiver has provided sufficient proof of job completion."
}

Response:
{
  "success": true,
  "message": "Moderator review submitted",
  "data": {
    "disputeId": "dispute-uuid",
    "status": "PENDING_ADMIN_DECISION",
    "moderatorReview": {
      "moderatorId": "moderator-uuid",
      "moderatorName": "Sarah Johnson",
      "recommendation": "FAVOR_COMPLAINANT",
      "findings": "Evidence shows job was completed as agreed. Payment is overdue.",
      "suggestedAction": "REFUND_FULL",
      "reviewedAt": "2025-12-12T14:30:00Z"
    }
  }
}
```

---

### **6. Admin Resolve Dispute**

```typescript
POST /api/disputes/:disputeId/resolve
Authorization: Bearer {accessToken}
Role: ADMIN

Request Body:
{
  "decision": "FAVOR_COMPLAINANT" | "FAVOR_RESPONDENT" | "PARTIAL_RESOLUTION" | "DISMISSED",
  "resolution": "Payment of ৳5000 to be released to caregiver immediately.",
  "action": "REFUND_FULL" | "REFUND_PARTIAL" | "WARNING_ISSUED" | "ACCOUNT_SUSPENDED" | "NO_ACTION",
  "refundAmount": 5000,
  "penaltyAmount": 500
}

Response:
{
  "success": true,
  "message": "Dispute resolved successfully",
  "data": {
    "disputeId": "dispute-uuid",
    "status": "RESOLVED",
    "decision": "FAVOR_COMPLAINANT",
    "resolution": "Payment of ৳5000 to be released to caregiver immediately.",
    "refundProcessed": true,
    "penaltyApplied": true,
    "resolvedAt": "2025-12-13T16:00:00Z",
    "resolvedBy": {
      "id": "admin-uuid",
      "fullName": "Admin John"
    }
  }
}

// Automatic Actions:
// 1. If REFUND_FULL → Process refund to complainant
// 2. If PENALTY → Deduct from respondent's account
// 3. If WARNING → Add warning to user's record
// 4. If ACCOUNT_SUSPENDED → Lock respondent's account
// 5. Send notifications to both parties
```

---

### **7. Appeal Dispute**

```typescript
POST /api/disputes/:disputeId/appeal
Authorization: Bearer {accessToken}

Request Body:
{
  "reason": "I believe the decision was unfair. I have additional evidence.",
  "additionalEvidence": "evidence description"
}

Response:
{
  "success": true,
  "message": "Appeal submitted successfully",
  "data": {
    "disputeId": "dispute-uuid",
    "status": "UNDER_APPEAL",
    "appealedAt": "2025-12-14T10:00:00Z"
  }
}

// Appeals can only be filed within 7 days of resolution
// Appeals are reviewed by senior admin
```

---

## 📊 Dispute Categories

```typescript
enum DisputeCategory {
  PAYMENT_ISSUE = 'PAYMENT_ISSUE',              // Payment not received/incorrect
  SERVICE_QUALITY = 'SERVICE_QUALITY',          // Poor service quality
  MISCONDUCT = 'MISCONDUCT',                    // Inappropriate behavior
  CONTRACT_BREACH = 'CONTRACT_BREACH',          // Terms not followed
  NO_SHOW = 'NO_SHOW',                          // Caregiver/Guardian didn't show up
  EARLY_TERMINATION = 'EARLY_TERMINATION',      // Job ended prematurely
  PROPERTY_DAMAGE = 'PROPERTY_DAMAGE',          // Damage to property
  SAFETY_CONCERN = 'SAFETY_CONCERN',            // Safety issues
  OTHER = 'OTHER'
}
```

---

## 📊 Dispute Status Flow

```
┌─────────────────┐
│ PENDING_        │
│ EVIDENCE        │ ◄─── Complainant creates dispute
└────────┬────────┘
         │
         │ Both parties submit evidence
         ▼
┌─────────────────┐
│ UNDER_          │
│ REVIEW          │ ◄─── Moderator investigates
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PENDING_ADMIN_  │
│ DECISION        │ ◄─── Moderator submits recommendation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ RESOLVED        │ ◄─── Admin makes final decision
└────────┬────────┘
         │
         │ (Optional)
         ▼
┌─────────────────┐
│ UNDER_          │
│ APPEAL          │ ◄─── Party appeals decision
└─────────────────┘
```

---

## 📊 Database Schema

```prisma
model Dispute {
  id                  String          @id @default(uuid())
  disputeNumber       String          @unique
  
  // Parties
  jobId               String?
  complainantId       String
  respondentId        String
  
  // Details
  category            DisputeCategory
  title               String
  description         String
  desiredResolution   String
  
  // Status
  status              DisputeStatus   @default(PENDING_EVIDENCE)
  
  // Resolution
  decision            DisputeDecision?
  resolution          String?
  refundAmount        Int?
  penaltyAmount       Int?
  
  // Timestamps
  createdAt           DateTime        @default(now())
  deadline            DateTime
  resolvedAt          DateTime?
  
  // Relations
  job                 Job?            @relation(fields: [jobId], references: [id])
  complainant         User            @relation("ComplainingUser", fields: [complainantId], references: [id])
  respondent          User            @relation("RespondingUser", fields: [respondentId], references: [id])
  
  evidence            Evidence[]
  moderatorReviews    ModeratorDisputeReview[]
  adminReview         AdminDisputeReview?
  appeals             DisputeAppeal[]
  timeline            DisputeTimeline[]
}

model Evidence {
  id                  String      @id @default(uuid())
  disputeId           String
  submittedById       String
  
  description         String
  files               Json[]      @default([])
  
  submittedAt         DateTime    @default(now())
  
  dispute             Dispute     @relation(fields: [disputeId], references: [id])
  submittedBy         User        @relation(fields: [submittedById], references: [id])
}

model ModeratorDisputeReview {
  id                  String      @id @default(uuid())
  disputeId           String
  moderatorId         String
  
  recommendation      String
  findings            String
  suggestedAction     String
  notes               String?
  
  reviewedAt          DateTime    @default(now())
  
  dispute             Dispute     @relation(fields: [disputeId], references: [id])
  moderator           User        @relation(fields: [moderatorId], references: [id])
}

model AdminDisputeReview {
  id                  String      @id @default(uuid())
  disputeId           String      @unique
  adminId             String
  
  decision            DisputeDecision
  resolution          String
  action              String
  
  resolvedAt          DateTime    @default(now())
  
  dispute             Dispute     @relation(fields: [disputeId], references: [id])
  admin               User        @relation(fields: [adminId], references: [id])
}

model DisputeAppeal {
  id                  String      @id @default(uuid())
  disputeId           String
  appealedById        String
  
  reason              String
  additionalEvidence  String?
  
  status              AppealStatus @default(PENDING)
  
  appealedAt          DateTime    @default(now())
  resolvedAt          DateTime?
  
  dispute             Dispute     @relation(fields: [disputeId], references: [id])
  appealedBy          User        @relation(fields: [appealedById], references: [id])
}

enum DisputeStatus {
  PENDING_EVIDENCE
  UNDER_REVIEW
  PENDING_ADMIN_DECISION
  RESOLVED
  REJECTED
  UNDER_APPEAL
}

enum DisputeDecision {
  FAVOR_COMPLAINANT
  FAVOR_RESPONDENT
  PARTIAL_RESOLUTION
  DISMISSED
}

enum AppealStatus {
  PENDING
  UNDER_REVIEW
  ACCEPTED
  REJECTED
}
```

---

## 🧪 Testing

```typescript
describe('DisputesService', () => {
  it('should create dispute');
  it('should submit evidence');
  it('should get my disputes');
  it('should moderator review dispute');
  it('should admin resolve dispute');
  it('should process refund on resolution');
  it('should apply penalty');
  it('should allow appeal');
  it('should enforce appeal deadline');
});
```

---

## 🔧 Environment Variables

```env
# No specific environment variables
# Uses shared JWT, Database, Payment, and Notification configs
```

---

## 📚 Related Documentation

- [02 Backend 16.md](02%20Backend%2016.md) - Moderator Management
- [02 Backend 11.md](02%20Backend%2011.md) - Payment Processing
- [02 Backend 15.md](02%20Backend%2015.md) - Notification System

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
