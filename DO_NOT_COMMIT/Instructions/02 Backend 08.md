# Backend Documentation 08 - Verification System (Two-Tier)

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Module**: Verification  
**Priority**: 🔴 Critical

---

## 📋 Overview

The Verification System implements a **two-tier approval process** for caregiver and agency verification, ensuring quality control through moderator review followed by admin final decision.

### **Key Features**
- **6-step caregiver verification pipeline**
- **2-step agency verification**
- Moderator review queue (first tier)
- Admin approval workflow (second tier)
- Document verification and validation
- Send-back and resubmission process
- Step-by-step tracking

**Module Path**: `/backend/src/verification/`

---

## 📁 Module Structure

```
verification/
├── verification.module.ts         # Module configuration
├── verification.service.ts        # Business logic
├── verification.controller.ts     # HTTP endpoints
└── dto/
    ├── submit-step.dto.ts        # Step submission
    ├── moderator-review.dto.ts   # Moderator review
    └── admin-review.dto.ts       # Admin decision
```

---

## 🎯 Caregiver Verification (6 Steps)

### **Step 1: Certificates**
```typescript
POST /api/verification/submit-step
Authorization: Bearer {accessToken}
Role: CAREGIVER

Request Body:
{
  "stepType": "CERTIFICATES",
  "documentUrls": [
    "https://r2.com/certs/nursing-diploma.pdf",
    "https://r2.com/certs/first-aid.pdf"
  ]
}

Response:
{
  "success": true,
  "message": "Step submitted for review",
  "data": {
    "id": "step-uuid",
    "stepType": "CERTIFICATES",
    "stepOrder": 1,
    "status": "PENDING",
    "documentUrls": [...],
    "submittedAt": "2025-12-11T10:00:00Z"
  }
}
```

### **Step 2: Police Clearance**
```typescript
POST /api/verification/submit-step

Request Body:
{
  "stepType": "POLICE_CLEARANCE",
  "documentUrls": [
    "https://r2.com/docs/police-clearance.pdf"
  ]
}
```

### **Step 3: Interview**
```typescript
POST /api/verification/submit-step

Request Body:
{
  "stepType": "INTERVIEW",
  "documentUrls": [
    "https://r2.com/videos/interview-recording.mp4"
  ],
  "notes": "Conducted via video call on 2025-12-10"
}
```

### **Step 4: Psychological Test**
```typescript
POST /api/verification/submit-step

Request Body:
{
  "stepType": "PSYCHOLOGICAL_TEST",
  "documentUrls": [
    "https://r2.com/docs/psych-test-results.pdf"
  ]
}
```

### **Step 5: Document Check**
```typescript
POST /api/verification/submit-step

Request Body:
{
  "stepType": "DOCUMENT_CHECK",
  "documentUrls": [
    "https://r2.com/docs/nid.pdf",
    "https://r2.com/docs/address-proof.pdf",
    "https://r2.com/docs/references.pdf"
  ]
}
```

### **Step 6: Final Approval**
```typescript
POST /api/verification/submit-step

Request Body:
{
  "stepType": "FINAL_APPROVAL",
  "documentUrls": []
}
```

---

## 🔍 Moderator Review (First Tier)

### **1. Get Pending Verifications**
```typescript
GET /api/verification/moderator/pending
Authorization: Bearer {accessToken}
Role: MODERATOR

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- stepType: VerificationStepType
- userRole: 'CAREGIVER' | 'AGENCY_ADMIN'

Response:
{
  "success": true,
  "data": [
    {
      "id": "step-uuid",
      "user": {
        "id": "user-uuid",
        "fullName": "Fatima Rahman",
        "phone": "+8801712345678",
        "role": "CAREGIVER"
      },
      "stepType": "CERTIFICATES",
      "stepOrder": 1,
      "documentUrls": [...],
      "status": "PENDING",
      "submittedAt": "2025-12-11T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### **2. Review Step (Moderator)**
```typescript
POST /api/verification/moderator/review/:stepId
Authorization: Bearer {accessToken}
Role: MODERATOR

Request Body:
{
  "decision": "RECOMMEND_APPROVE" | "RECOMMEND_REJECT" | "SEND_BACK",
  "notes": "All certificates are valid and verified",
  "sendBackReason": ""  // If decision is SEND_BACK
}

Response:
{
  "success": true,
  "message": "Review submitted. Awaiting admin decision",
  "data": {
    "id": "step-uuid",
    "status": "PENDING_ADMIN_REVIEW",
    "moderatorReview": {
      "reviewedBy": "moderator-uuid",
      "moderatorName": "Moderator Name",
      "decision": "RECOMMEND_APPROVE",
      "notes": "All certificates are valid and verified",
      "reviewedAt": "2025-12-11T10:15:00Z"
    }
  }
}
```

**Moderator Actions**:
- `RECOMMEND_APPROVE` - Recommends approval to admin
- `RECOMMEND_REJECT` - Recommends rejection to admin
- `SEND_BACK` - Returns to user for corrections

---

## ✅ Admin Decision (Second Tier)

### **1. Get Pending Admin Reviews**
```typescript
GET /api/verification/admin/pending
Authorization: Bearer {accessToken}
Roles: PLATFORM_ADMIN, SUPER_ADMIN

Query Parameters:
- page: number
- limit: number
- moderatorRecommendation: string

Response:
{
  "success": true,
  "data": [
    {
      "id": "step-uuid",
      "user": {...},
      "stepType": "CERTIFICATES",
      "stepOrder": 1,
      "documentUrls": [...],
      "status": "PENDING_ADMIN_REVIEW",
      "moderatorReview": {
        "reviewedBy": "moderator-uuid",
        "moderatorName": "Moderator Name",
        "decision": "RECOMMEND_APPROVE",
        "notes": "All certificates are valid",
        "reviewedAt": "2025-12-11T10:15:00Z"
      },
      "submittedAt": "2025-12-11T10:00:00Z"
    }
  ],
  "meta": {...}
}
```

### **2. Admin Final Decision**
```typescript
POST /api/verification/admin/decision/:stepId
Authorization: Bearer {accessToken}
Roles: PLATFORM_ADMIN, SUPER_ADMIN

Request Body:
{
  "decision": "APPROVE" | "REJECT" | "SEND_BACK",
  "notes": "Approved. All documents verified",
  "sendBackReason": ""  // If decision is SEND_BACK
}

Response:
{
  "success": true,
  "message": "Verification step approved",
  "data": {
    "id": "step-uuid",
    "status": "APPROVED",
    "adminDecision": {
      "decidedBy": "admin-uuid",
      "adminName": "Admin Name",
      "decision": "APPROVE",
      "notes": "Approved. All documents verified",
      "decidedAt": "2025-12-11T10:30:00Z"
    }
  }
}
```

**Admin Actions**:
- `APPROVE` - Final approval, step complete
- `REJECT` - Final rejection, cannot resubmit
- `SEND_BACK` - Return to user for corrections

---

## 🔄 Resubmission Process

### **Send Back Flow**
```typescript
// Moderator or Admin sends back
POST /api/verification/moderator/review/:stepId
{
  "decision": "SEND_BACK",
  "notes": "Documents are unclear",
  "sendBackReason": "Please upload clearer scans of certificates"
}

// User resubmits
POST /api/verification/submit-step
{
  "stepType": "CERTIFICATES",
  "documentUrls": [
    "https://r2.com/certs/nursing-diploma-clear.pdf",
    "https://r2.com/certs/first-aid-clear.pdf"
  ],
  "resubmissionNotes": "Uploaded clearer scans as requested"
}
```

---

## 📊 Verification Progress

### **Get User Verification Status**
```typescript
GET /api/verification/status
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": {
    "userId": "user-uuid",
    "role": "CAREGIVER",
    "overallStatus": "IN_PROGRESS",
    "completedSteps": 3,
    "totalSteps": 6,
    "steps": [
      {
        "stepType": "CERTIFICATES",
        "stepOrder": 1,
        "status": "APPROVED",
        "submittedAt": "2025-12-01T10:00:00Z",
        "approvedAt": "2025-12-02T14:30:00Z"
      },
      {
        "stepType": "POLICE_CLEARANCE",
        "stepOrder": 2,
        "status": "APPROVED",
        "submittedAt": "2025-12-03T09:00:00Z",
        "approvedAt": "2025-12-04T11:00:00Z"
      },
      {
        "stepType": "INTERVIEW",
        "stepOrder": 3,
        "status": "APPROVED",
        "submittedAt": "2025-12-05T10:00:00Z",
        "approvedAt": "2025-12-06T15:00:00Z"
      },
      {
        "stepType": "PSYCHOLOGICAL_TEST",
        "stepOrder": 4,
        "status": "PENDING_MODERATOR_REVIEW",
        "submittedAt": "2025-12-10T10:00:00Z"
      },
      {
        "stepType": "DOCUMENT_CHECK",
        "stepOrder": 5,
        "status": "NOT_STARTED"
      },
      {
        "stepType": "FINAL_APPROVAL",
        "stepOrder": 6,
        "status": "NOT_STARTED"
      }
    ]
  }
}
```

---

## 🏢 Agency Verification (2 Steps)

### **Step 1: Business Documents**
```typescript
POST /api/verification/submit-step
Role: AGENCY_ADMIN

Request Body:
{
  "stepType": "BUSINESS_DOCUMENTS",
  "documentUrls": [
    "https://r2.com/docs/trade-license.pdf",
    "https://r2.com/docs/company-registration.pdf",
    "https://r2.com/docs/tax-certificate.pdf"
  ]
}
```

### **Step 2: Final Verification**
```typescript
POST /api/verification/submit-step

Request Body:
{
  "stepType": "AGENCY_FINAL_VERIFICATION",
  "documentUrls": []
}
```

**Same two-tier process applies**: Moderator reviews → Admin decides

---

## 📈 Verification Statistics

### **Get Verification Stats (Admin)**
```typescript
GET /api/verification/stats
Authorization: Bearer {accessToken}
Roles: MODERATOR, PLATFORM_ADMIN, SUPER_ADMIN

Response:
{
  "success": true,
  "data": {
    "pending": {
      "moderator": 45,
      "admin": 23
    },
    "completed": {
      "today": 12,
      "thisWeek": 67,
      "thisMonth": 284
    },
    "byStep": {
      "CERTIFICATES": { "pending": 15, "approved": 234, "rejected": 12 },
      "POLICE_CLEARANCE": { "pending": 12, "approved": 198, "rejected": 8 },
      "INTERVIEW": { "pending": 10, "approved": 187, "rejected": 15 },
      "PSYCHOLOGICAL_TEST": { "pending": 5, "approved": 165, "rejected": 3 },
      "DOCUMENT_CHECK": { "pending": 2, "approved": 156, "rejected": 5 },
      "FINAL_APPROVAL": { "pending": 1, "approved": 145, "rejected": 2 }
    },
    "averageProcessingTime": {
      "moderator": 24, // hours
      "admin": 12  // hours
    }
  }
}
```

---

## 📊 Database Schema

```prisma
model VerificationStep {
  id                String      @id @default(uuid())
  userId            String
  
  stepType          VerificationStepType
  stepOrder         Int
  documentUrls      String[]
  notes             String?
  
  // Status
  status            StepStatus  @default(PENDING)
  
  // Moderator Review (First Tier)
  moderatorId       String?
  moderatorNotes    String?
  moderatorDecision String?     // RECOMMEND_APPROVE, RECOMMEND_REJECT, SEND_BACK
  moderatorReviewedAt DateTime?
  
  // Admin Decision (Second Tier)
  adminId           String?
  adminNotes        String?
  adminDecision     String?     // APPROVE, REJECT, SEND_BACK
  adminDecidedAt    DateTime?
  
  // Send Back
  sendBackReason    String?
  resubmissionNotes String?
  
  // Timestamps
  submittedAt       DateTime    @default(now())
  approvedAt        DateTime?
  
  // Relations
  user              User        @relation(fields: [userId], references: [id])
  moderator         User?       @relation("ModeratorReviews", fields: [moderatorId], references: [id])
  admin             User?       @relation("AdminDecisions", fields: [adminId], references: [id])
  
  @@unique([userId, stepType])
}

enum VerificationStepType {
  // Caregiver (6 steps)
  CERTIFICATES
  POLICE_CLEARANCE
  INTERVIEW
  PSYCHOLOGICAL_TEST
  DOCUMENT_CHECK
  FINAL_APPROVAL
  
  // Agency (2 steps)
  BUSINESS_DOCUMENTS
  AGENCY_FINAL_VERIFICATION
}

enum StepStatus {
  NOT_STARTED
  PENDING
  PENDING_MODERATOR_REVIEW
  PENDING_ADMIN_REVIEW
  APPROVED
  REJECTED
  SENT_BACK
}
```

---

## 🔔 Notifications

### **Step Status Changes**
- User submits step → Notify moderators
- Moderator reviews → Notify admins
- Admin approves → Notify user
- Admin sends back → Notify user with reason
- All steps approved → Notify user (verification complete)

---

## 🧪 Testing

### **Unit Tests**
```typescript
describe('VerificationService', () => {
  it('should submit verification step');
  it('should get pending verifications for moderator');
  it('should allow moderator to review step');
  it('should get pending admin reviews');
  it('should allow admin to make final decision');
  it('should handle send-back and resubmission');
  it('should track verification progress');
});
```

---

## 🚀 Complete Verification Flow Example

```javascript
// CAREGIVER: Submit all 6 steps
for (const step of ['CERTIFICATES', 'POLICE_CLEARANCE', 'INTERVIEW', 
                     'PSYCHOLOGICAL_TEST', 'DOCUMENT_CHECK', 'FINAL_APPROVAL']) {
  await fetch('/api/verification/submit-step', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      stepType: step,
      documentUrls: [...]
    })
  });
}

// MODERATOR: Review each step
const pending = await fetch('/api/verification/moderator/pending');
for (const step of pending.data) {
  await fetch(`/api/verification/moderator/review/${step.id}`, {
    method: 'POST',
    body: JSON.stringify({
      decision: 'RECOMMEND_APPROVE',
      notes: 'All documents verified'
    })
  });
}

// ADMIN: Final decisions
const adminPending = await fetch('/api/verification/admin/pending');
for (const step of adminPending.data) {
  await fetch(`/api/verification/admin/decision/${step.id}`, {
    method: 'POST',
    body: JSON.stringify({
      decision: 'APPROVE',
      notes: 'Approved'
    })
  });
}

// Check completion
const status = await fetch('/api/verification/status');
if (status.data.completedSteps === 6) {
  console.log('Caregiver fully verified!');
}
```

---

## 📚 Related Documentation

- [02 Backend 02.md](02%20Backend%2002.md) - Authentication & User Management
- [02 Backend 03.md](02%20Backend%2003.md) - Companies & Agency Management
- [02 Backend 04.md](02%20Backend%2004.md) - Caregiver Management
- [02 Backend 16.md](02%20Backend%2016.md) - Moderator Management

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
