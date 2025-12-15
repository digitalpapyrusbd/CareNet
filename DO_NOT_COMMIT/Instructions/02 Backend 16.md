# Backend Documentation 16 - Moderator Management

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Modules**: Moderators  
**Priority**: 🔴 Critical

---

## 📋 Overview

The Moderator Management System implements a **two-tier approval system** for caregivers and agencies with review queues and recommendation workflows.

### **Key Features**
- Two-tier approval (Moderator + Admin)
- Review queue management
- Approval/rejection with reasons
- Recommendation system
- Activity logging
- Performance metrics
- Moderator assignment
- Escalation workflow

**Module Path**: `/backend/src/moderators/`

---

## 📁 Module Structure

```
moderators/
├── moderators.module.ts            # Module configuration
├── moderators.service.ts           # Business logic
├── moderators.controller.ts        # HTTP endpoints
├── dto/
│   ├── review.dto.ts              # Review validation
│   └── assign.dto.ts              # Assignment validation
└── guards/
    └── moderator.guard.ts         # Role-based access
```

---

## 🎯 Core Features

### **1. Get Pending Reviews**

```typescript
GET /api/moderators/reviews/pending
Authorization: Bearer {accessToken}
Role: MODERATOR or ADMIN

Query Parameters:
- type: "CAREGIVER" | "AGENCY"
- page: number (default: 1)
- limit: number (default: 20)

Response:
{
  "success": true,
  "data": [
    {
      "id": "caregiver-uuid",
      "fullName": "Ahmed Hassan",
      "email": "ahmed@example.com",
      "phone": "+8801712345678",
      "status": "PENDING_MODERATOR_APPROVAL",
      "type": "CAREGIVER",
      "submittedAt": "2025-12-10T10:00:00Z",
      "documents": [
        {
          "type": "NID_FRONT",
          "url": "https://r2.com/documents/nid-front.jpg",
          "status": "PENDING"
        },
        {
          "type": "POLICE_CLEARANCE",
          "url": "https://r2.com/documents/police.pdf",
          "status": "PENDING"
        }
      ],
      "profile": {
        "experience": "5 years",
        "education": "Nursing Diploma",
        "specializations": ["Elderly Care", "Dementia Care"]
      }
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

---

### **2. Review Caregiver (Moderator)**

```typescript
POST /api/moderators/reviews/caregiver/:caregiverId
Authorization: Bearer {accessToken}
Role: MODERATOR

Request Body:
{
  "action": "APPROVE" | "REJECT" | "REQUEST_CHANGES",
  "recommendation": "HIGHLY_RECOMMENDED" | "RECOMMENDED" | "NOT_RECOMMENDED",
  "notes": "All documents verified. Background check passed.",
  "documentReviews": [
    {
      "documentId": "doc-uuid",
      "status": "APPROVED",
      "notes": "Valid NID card"
    }
  ]
}

Response:
{
  "success": true,
  "message": "Caregiver review submitted successfully",
  "data": {
    "id": "caregiver-uuid",
    "status": "PENDING_ADMIN_APPROVAL",
    "moderatorReview": {
      "moderatorId": "moderator-uuid",
      "moderatorName": "Moderator Sarah",
      "action": "APPROVE",
      "recommendation": "HIGHLY_RECOMMENDED",
      "notes": "All documents verified. Background check passed.",
      "reviewedAt": "2025-12-11T10:30:00Z"
    }
  }
}

// If APPROVED → Status becomes PENDING_ADMIN_APPROVAL
// If REJECTED → Status becomes REJECTED
// If REQUEST_CHANGES → Status becomes CHANGES_REQUESTED
```

---

### **3. Review Caregiver (Admin)**

```typescript
POST /api/moderators/reviews/admin/caregiver/:caregiverId
Authorization: Bearer {accessToken}
Role: ADMIN

Request Body:
{
  "action": "APPROVE" | "REJECT",
  "notes": "Final approval granted"
}

Response:
{
  "success": true,
  "message": "Final approval completed",
  "data": {
    "id": "caregiver-uuid",
    "status": "ACTIVE",
    "adminReview": {
      "adminId": "admin-uuid",
      "adminName": "Admin John",
      "action": "APPROVE",
      "notes": "Final approval granted",
      "reviewedAt": "2025-12-11T11:00:00Z"
    }
  }
}

// If APPROVED → Status becomes ACTIVE
// If REJECTED → Status becomes REJECTED
```

---

### **4. Review Agency (Moderator)**

```typescript
POST /api/moderators/reviews/agency/:agencyId
Authorization: Bearer {accessToken}
Role: MODERATOR

Request Body:
{
  "action": "APPROVE" | "REJECT" | "REQUEST_CHANGES",
  "recommendation": "HIGHLY_RECOMMENDED" | "RECOMMENDED" | "NOT_RECOMMENDED",
  "notes": "Agency license verified. All documents in order.",
  "documentReviews": [
    {
      "documentId": "doc-uuid",
      "status": "APPROVED",
      "notes": "Valid trade license"
    }
  ]
}

Response:
{
  "success": true,
  "message": "Agency review submitted successfully",
  "data": {
    "companyId": "company-uuid",
    "status": "PENDING_ADMIN_APPROVAL",
    "moderatorReview": {
      "moderatorId": "moderator-uuid",
      "action": "APPROVE",
      "recommendation": "HIGHLY_RECOMMENDED",
      "reviewedAt": "2025-12-11T10:45:00Z"
    }
  }
}
```

---

### **5. Request Changes**

```typescript
POST /api/moderators/reviews/request-changes/:userId
Authorization: Bearer {accessToken}
Role: MODERATOR

Request Body:
{
  "type": "CAREGIVER" | "AGENCY",
  "requiredChanges": [
    {
      "field": "NID_DOCUMENT",
      "reason": "NID photo is blurry. Please upload a clear image.",
      "priority": "HIGH"
    },
    {
      "field": "POLICE_CLEARANCE",
      "reason": "Police clearance is expired. Please upload a current one.",
      "priority": "CRITICAL"
    }
  ],
  "deadline": "2025-12-18T23:59:59Z"
}

Response:
{
  "success": true,
  "message": "Change request sent to user",
  "data": {
    "status": "CHANGES_REQUESTED",
    "requiredChanges": [...],
    "deadline": "2025-12-18T23:59:59Z"
  }
}

// Email + SMS + Push notification sent to user
// User receives notification with specific requirements
```

---

### **6. Get Review History**

```typescript
GET /api/moderators/reviews/history/:userId
Authorization: Bearer {accessToken}
Role: MODERATOR or ADMIN

Response:
{
  "success": true,
  "data": [
    {
      "id": "review-uuid",
      "reviewerType": "MODERATOR",
      "reviewerName": "Sarah Johnson",
      "action": "APPROVE",
      "recommendation": "HIGHLY_RECOMMENDED",
      "notes": "All documents verified",
      "reviewedAt": "2025-12-11T10:30:00Z"
    },
    {
      "id": "review-uuid-2",
      "reviewerType": "ADMIN",
      "reviewerName": "John Admin",
      "action": "APPROVE",
      "notes": "Final approval",
      "reviewedAt": "2025-12-11T11:00:00Z"
    }
  ]
}
```

---

### **7. Assign Moderator**

```typescript
POST /api/moderators/assign
Authorization: Bearer {accessToken}
Role: ADMIN

Request Body:
{
  "moderatorId": "moderator-uuid",
  "reviewId": "review-uuid",
  "type": "CAREGIVER" | "AGENCY"
}

Response:
{
  "success": true,
  "message": "Moderator assigned successfully",
  "data": {
    "reviewId": "review-uuid",
    "assignedTo": {
      "id": "moderator-uuid",
      "fullName": "Sarah Johnson"
    },
    "assignedAt": "2025-12-11T10:00:00Z"
  }
}
```

---

### **8. Get Moderator Performance**

```typescript
GET /api/moderators/performance/:moderatorId
Authorization: Bearer {accessToken}
Role: ADMIN

Response:
{
  "success": true,
  "data": {
    "moderatorId": "moderator-uuid",
    "fullName": "Sarah Johnson",
    "totalReviews": 245,
    "approved": 210,
    "rejected": 25,
    "changesRequested": 10,
    "averageReviewTime": "18 minutes",
    "accuracyRate": 94.5,
    "last30Days": {
      "totalReviews": 42,
      "approved": 38,
      "rejected": 3,
      "changesRequested": 1
    },
    "reviewBreakdown": {
      "caregivers": 180,
      "agencies": 65
    }
  }
}
```

---

## 📊 Review Workflow

```
┌─────────────────┐
│ User Submits    │
│ Registration    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PENDING_        │
│ MODERATOR_      │
│ APPROVAL        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Moderator       │
│ Reviews         │
└────┬────┬───┬───┘
     │    │   │
     │    │   └──────────────┐
     │    │                  │
     ▼    ▼                  ▼
  APPROVE REJECT    REQUEST_CHANGES
     │                      │
     │                      │
     ▼                      ▼
┌─────────────────┐  ┌──────────────┐
│ PENDING_ADMIN_  │  │ CHANGES_     │
│ APPROVAL        │  │ REQUESTED    │
└────────┬────────┘  └──────┬───────┘
         │                  │
         ▼                  │
┌─────────────────┐         │
│ Admin Reviews   │         │
└────┬────┬───────┘         │
     │    │                 │
     ▼    ▼                 │
  APPROVE REJECT            │
     │                      │
     ▼                      │
┌─────────────────┐         │
│ ACTIVE          │         │
└─────────────────┘         │
                            │
┌─────────────────┐         │
│ User Resubmits  │◄────────┘
│ Documents       │
└─────────────────┘
```

---

## 📊 Database Schema

```prisma
model ModeratorReview {
  id              String      @id @default(uuid())
  
  // Subject
  caregiverId     String?
  companyId       String?
  
  // Reviewer
  moderatorId     String
  moderator       User        @relation("ModeratorReviews", fields: [moderatorId], references: [id])
  
  // Review Details
  action          ReviewAction
  recommendation  Recommendation?
  notes           String
  
  // Document Reviews
  documentReviews Json[]      @default([])
  
  reviewedAt      DateTime    @default(now())
  
  caregiver       Caregiver?  @relation(fields: [caregiverId], references: [id])
  company         Company?    @relation(fields: [companyId], references: [id])
}

model AdminReview {
  id              String      @id @default(uuid())
  
  // Subject
  caregiverId     String?
  companyId       String?
  
  // Reviewer
  adminId         String
  admin           User        @relation("AdminReviews", fields: [adminId], references: [id])
  
  // Review Details
  action          ReviewAction
  notes           String
  
  reviewedAt      DateTime    @default(now())
  
  caregiver       Caregiver?  @relation(fields: [caregiverId], references: [id])
  company         Company?    @relation(fields: [companyId], references: [id])
}

model ChangeRequest {
  id              String      @id @default(uuid())
  
  // Subject
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  
  type            UserType    // CAREGIVER or AGENCY
  
  // Request Details
  requiredChanges Json[]
  deadline        DateTime
  
  status          ChangeRequestStatus @default(PENDING)
  
  createdAt       DateTime    @default(now())
  resolvedAt      DateTime?
}

enum ReviewAction {
  APPROVE
  REJECT
  REQUEST_CHANGES
}

enum Recommendation {
  HIGHLY_RECOMMENDED
  RECOMMENDED
  NOT_RECOMMENDED
}

enum ChangeRequestStatus {
  PENDING
  COMPLETED
  EXPIRED
}
```

---

## 🔐 Role-Based Access

```typescript
// Moderator Guard
@Injectable()
export class ModeratorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return user.role === 'MODERATOR' || user.role === 'ADMIN';
  }
}

// Admin Guard
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return user.role === 'ADMIN';
  }
}

// Usage in Controller
@Controller('moderators')
export class ModeratorsController {
  @Get('reviews/pending')
  @UseGuards(JwtAuthGuard, ModeratorGuard)
  getPendingReviews() {
    // Only MODERATOR or ADMIN can access
  }
  
  @Post('reviews/admin/:caregiverId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  adminReview() {
    // Only ADMIN can access
  }
}
```

---

## 📧 Notification Templates

### **Approval Notification**

```typescript
async function sendApprovalNotification(userId: string, type: string) {
  await notificationService.sendNotification(userId, {
    type: 'VERIFICATION_APPROVED',
    title: `${type} Application Approved`,
    body: 'Congratulations! Your application has been approved.',
    channels: ['EMAIL', 'SMS', 'PUSH'],
    data: {
      screen: '/dashboard'
    }
  });
}
```

### **Rejection Notification**

```typescript
async function sendRejectionNotification(
  userId: string,
  type: string,
  reason: string
) {
  await notificationService.sendNotification(userId, {
    type: 'VERIFICATION_REJECTED',
    title: `${type} Application Rejected`,
    body: `Your application was rejected. Reason: ${reason}`,
    channels: ['EMAIL', 'SMS'],
    data: {
      reason,
      screen: '/profile/verification'
    }
  });
}
```

### **Changes Requested Notification**

```typescript
async function sendChangeRequestNotification(
  userId: string,
  changes: any[]
) {
  await notificationService.sendNotification(userId, {
    type: 'CHANGES_REQUESTED',
    title: 'Changes Required',
    body: `Please update your application. ${changes.length} changes required.`,
    channels: ['EMAIL', 'SMS', 'PUSH'],
    data: {
      changes,
      screen: '/profile/verification'
    }
  });
}
```

---

## 🧪 Testing

```typescript
describe('ModeratorsService', () => {
  it('should get pending reviews');
  it('should approve caregiver (moderator)');
  it('should reject caregiver');
  it('should request changes');
  it('should approve caregiver (admin)');
  it('should get review history');
  it('should assign moderator');
  it('should get moderator performance');
  it('should enforce role-based access');
});
```

---

## 🔧 Environment Variables

```env
# No specific environment variables
# Uses shared JWT, Database, and Notification configs
```

---

## 📚 Related Documentation

- [02 Backend 08.md](02%20Backend%2008.md) - Verification System
- [02 Backend 02.md](02%20Backend%2002.md) - Authentication & User Management
- [02 Backend 15.md](02%20Backend%2015.md) - Notification System

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
