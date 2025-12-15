# Backend Documentation 07 - Job Lifecycle Management

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Module**: Jobs  
**Priority**: 🔴 Critical

---

## 📋 Overview

This document covers the **Job Lifecycle Management** system, which handles job creation from package purchases, caregiver assignments, GPS check-in/out, status transitions, and job completion.

### **Module Covered**
- **Jobs Module** - Job creation, assignments, status management, GPS tracking, completion

### **Key Features**
- Job creation from package purchase
- Caregiver assignment workflow
- Multi-caregiver assignments (primary + backup)
- Job acceptance/decline by caregivers
- GPS-based check-in/check-out
- Job status state machine
- Job completion and evaluation
- Job cancellation handling
- Payment integration

---

## 💼 Jobs Module

**Path**: `/backend/src/jobs/`

### **Module Files**
```
jobs/
├── jobs.module.ts              # Module configuration
├── jobs.service.ts             # Business logic (315 lines)
├── jobs.controller.ts          # HTTP endpoints
├── jobs.service.spec.ts        # Unit tests
└── dto/
    ├── job.dto.ts              # Create/Update DTOs
    ├── assignment.dto.ts       # Assignment management
    └── checkin.dto.ts          # GPS check-in/out
```

---

## 🎯 Job Status State Machine

```typescript
enum JobStatus {
  PENDING_ASSIGNMENT = "PENDING_ASSIGNMENT",   // Created, waiting for caregiver assignment
  ACTIVE = "ACTIVE",                           // Caregiver assigned and active
  COMPLETED = "COMPLETED",                     // Job finished successfully
  CANCELLED = "CANCELLED",                     // Cancelled by guardian or agency
  DISPUTED = "DISPUTED"                        // Under dispute resolution
}

// Valid State Transitions
const STATE_TRANSITIONS = {
  PENDING_ASSIGNMENT: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['COMPLETED', 'CANCELLED', 'DISPUTED'],
  COMPLETED: ['DISPUTED'],
  CANCELLED: [],  // Terminal state
  DISPUTED: ['COMPLETED', 'CANCELLED']  // After resolution
};
```

---

## 🎯 Core Job Features

### **1. Job Creation (From Package Purchase)**

#### **Create Job**
```typescript
POST /api/jobs

Authorization: Bearer {guardianToken}
Request Body:
{
  "package_id": "pkg_001",
  "patient_id": "pat_001",
  "start_date": "2025-12-20",
  "end_date": "2026-01-19",
  "special_instructions": "Patient requires medication at 8 AM, 2 PM, and 8 PM. Please log vital signs 3 times daily. Call emergency contact if blood pressure exceeds 140/90."
}

Response:
{
  "success": true,
  "data": {
    "id": "job_001",
    "package_id": "pkg_001",
    "patient_id": "pat_001",
    "company_id": "comp_abc123",
    "guardian_id": "user_xyz",
    "start_date": "2025-12-20T00:00:00Z",
    "end_date": "2026-01-19T23:59:59Z",
    "status": "PENDING_ASSIGNMENT",
    "total_price": "25000.00",
    "commission_amount": "2500.00",
    "payout_amount": "22500.00",
    "special_instructions": "Patient requires medication at 8 AM...",
    "created_at": "2025-12-11T10:00:00Z"
  },
  "next_steps": {
    "payment_required": true,
    "payment_amount": "25000.00",
    "caregiver_assignment": "Agency will assign caregiver within 24 hours"
  }
}
```

**Implementation**:
```typescript
// File: jobs.service.ts - create()

async create(guardianId: string, createJobDto: CreateJobDto) {
  // Validate package exists
  const pkg = await this.prisma.packages.findUnique({
    where: { id: createJobDto.package_id },
    include: { companies: true },
  });

  if (!pkg || !pkg.is_active) {
    throw new NotFoundException('Package not found or inactive');
  }

  // Validate patient belongs to guardian
  const patient = await this.prisma.patients.findUnique({
    where: { id: createJobDto.patient_id },
  });

  if (!patient || patient.guardian_id !== guardianId) {
    throw new ForbiddenException('Patient not found or not owned by you');
  }

  // Validate start date is in future with minimum advance notice
  const startDate = new Date(createJobDto.start_date);
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + pkg.min_advance_days);

  if (startDate < minDate) {
    throw new BadRequestException(
      `Package requires ${pkg.min_advance_days} days advance booking`
    );
  }

  // Calculate end date if not provided
  const endDate = createJobDto.end_date
    ? new Date(createJobDto.end_date)
    : new Date(startDate.getTime() + pkg.duration_days * 24 * 60 * 60 * 1000);

  // Calculate pricing
  const totalPrice = Number(pkg.price);
  const commissionRate = Number(pkg.companies.commission_rate) / 100;
  const commissionAmount = totalPrice * commissionRate;
  const payoutAmount = totalPrice - commissionAmount;

  // Create job
  const job = await this.prisma.jobs.create({
    data: {
      package_id: createJobDto.package_id,
      guardian_id: guardianId,
      patient_id: createJobDto.patient_id,
      company_id: pkg.company_id,
      start_date: startDate,
      end_date: endDate,
      special_instructions: createJobDto.special_instructions,
      status: JobStatus.PENDING_ASSIGNMENT,
      total_price: totalPrice,
      commission_amount: commissionAmount,
      payout_amount: payoutAmount,
    },
  });

  // Notify agency about new job
  await this.notificationService.send({
    userId: pkg.companies.userId,
    type: 'NEW_JOB',
    title: 'New Job Request',
    body: `New job for ${pkg.name} starting ${startDate.toDateString()}`,
    data: { job_id: job.id },
  });

  return job;
}
```

**Business Rules**:
- ✅ Package must be active
- ✅ Patient must belong to requesting guardian
- ✅ Start date must respect min_advance_days
- ✅ Commission calculated from package price
- ✅ Job starts in `PENDING_ASSIGNMENT` status
- ✅ Agency notified immediately

---

### **2. Caregiver Assignment (By Agency)**

#### **Assign Caregivers to Job**
```typescript
POST /api/jobs/:jobId/assign

Authorization: Bearer {agencyAdminToken}
Request Body:
{
  "assignments": [
    {
      "caregiver_id": "care_001",
      "role": "PRIMARY",
      "shift_start_time": "08:00",
      "shift_end_time": "20:00",
      "days_of_week": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    },
    {
      "caregiver_id": "care_002",
      "role": "BACKUP",
      "shift_start_time": "20:00",
      "shift_end_time": "08:00",
      "days_of_week": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    }
  ]
}

Response:
{
  "success": true,
  "data": {
    "job_id": "job_001",
    "status": "ACTIVE",
    "assignments": [
      {
        "id": "assign_001",
        "caregiver_id": "care_001",
        "role": "PRIMARY",
        "shift_start_time": "08:00",
        "shift_end_time": "20:00",
        "status": "ASSIGNED",
        "caregiver": {
          "name": "Fatima Rahman",
          "photo_url": "https://r2.example.com/photos/caregiver1.jpg",
          "rating": "4.9"
        }
      },
      {
        "id": "assign_002",
        "caregiver_id": "care_002",
        "role": "BACKUP",
        "shift_start_time": "20:00",
        "shift_end_time": "08:00",
        "status": "ASSIGNED",
        "caregiver": {
          "name": "Ayesha Begum",
          "photo_url": "https://r2.example.com/photos/caregiver2.jpg",
          "rating": "4.8"
        }
      }
    ]
  }
}
```

**Implementation**:
```typescript
// File: jobs.service.ts - assignCaregivers()

async assignCaregivers(
  jobId: string,
  userId: string,
  assignDto: AssignCaregiverDto
) {
  const job = await this.prisma.jobs.findUnique({
    where: { id: jobId },
    include: { companies: true },
  });

  if (!job) {
    throw new NotFoundException('Job not found');
  }

  // Authorization: Only agency admin/manager can assign
  if (job.companies.userId !== userId) {
    throw new ForbiddenException('Only the agency can assign caregivers');
  }

  // Validate job status
  if (job.status !== JobStatus.PENDING_ASSIGNMENT) {
    throw new BadRequestException('Job is not pending assignment');
  }

  // Validate all caregivers belong to the company
  for (const assignment of assignDto.assignments) {
    const caregiver = await this.prisma.caregivers.findUnique({
      where: { id: assignment.caregiver_id },
    });

    if (!caregiver || caregiver.company_id !== job.company_id) {
      throw new BadRequestException(
        `Caregiver ${assignment.caregiver_id} does not belong to your company`
      );
    }

    if (!caregiver.is_verified || !caregiver.is_available) {
      throw new BadRequestException(
        `Caregiver ${assignment.caregiver_id} is not available or verified`
      );
    }
  }

  // Create assignments
  const assignments = await Promise.all(
    assignDto.assignments.map(assignment =>
      this.prisma.assignments.create({
        data: {
          job_id: jobId,
          caregiver_id: assignment.caregiver_id,
          role: assignment.role,
          shift_start_time: assignment.shift_start_time,
          shift_end_time: assignment.shift_end_time,
          days_of_week: assignment.days_of_week,
          status: AssignmentStatus.ASSIGNED,
        },
        include: {
          caregivers_assignments_caregiver_idTocaregivers: {
            include: {
              users: { select: { name: true } },
            },
          },
        },
      })
    )
  );

  // Update job status to ACTIVE
  await this.prisma.jobs.update({
    where: { id: jobId },
    data: { status: JobStatus.ACTIVE },
  });

  // Notify guardian about assignment
  await this.notificationService.send({
    userId: job.guardian_id,
    type: 'CAREGIVER_ASSIGNED',
    title: 'Caregiver Assigned',
    body: `Caregivers have been assigned to your job`,
    data: { job_id: jobId },
  });

  // Notify caregivers about new assignment
  for (const assignment of assignments) {
    await this.notificationService.send({
      userId: assignment.caregivers_assignments_caregiver_idTocaregivers.userId,
      type: 'JOB_ASSIGNED',
      title: 'New Job Assignment',
      body: `You have been assigned to a new job`,
      data: { job_id: jobId, assignment_id: assignment.id },
    });
  }

  return { job_id: jobId, status: JobStatus.ACTIVE, assignments };
}
```

---

### **3. GPS Check-In/Check-Out**

#### **Check-In to Job**
```typescript
POST /api/jobs/:jobId/check-in

Authorization: Bearer {caregiverToken}
Request Body:
{
  "assignment_id": "assign_001",
  "location_lat": 23.8103,
  "location_lng": 90.4125,
  "timestamp": "2025-12-20T08:00:00Z",
  "notes": "Arrived on time. Patient is awake and alert."
}

Response:
{
  "success": true,
  "data": {
    "care_log_id": "log_001",
    "job_id": "job_001",
    "assignment_id": "assign_001",
    "log_type": "CHECK_IN",
    "timestamp": "2025-12-20T08:00:00Z",
    "location_lat": "23.8103",
    "location_lng": "90.4125",
    "location_verified": true,
    "distance_from_patient_meters": 15
  }
}
```

#### **Check-Out from Job**
```typescript
POST /api/jobs/:jobId/check-out

Authorization: Bearer {caregiverToken}
Request Body:
{
  "assignment_id": "assign_001",
  "location_lat": 23.8103,
  "location_lng": 90.4125,
  "timestamp": "2025-12-20T20:00:00Z",
  "notes": "Shift completed. Patient had a good day. All medications administered as scheduled."
}

Response:
{
  "success": true,
  "data": {
    "care_log_id": "log_002",
    "job_id": "job_001",
    "assignment_id": "assign_001",
    "log_type": "CHECK_OUT",
    "timestamp": "2025-12-20T20:00:00Z",
    "shift_duration_hours": 12,
    "location_verified": true
  }
}
```

**Implementation**:
```typescript
// File: jobs.service.ts - checkIn()

async checkIn(
  jobId: string,
  userId: string,
  checkInDto: CheckInDto
) {
  const job = await this.prisma.jobs.findUnique({
    where: { id: jobId },
    include: {
      assignments: {
        where: { id: checkInDto.assignment_id },
        include: {
          caregivers_assignments_caregiver_idTocaregivers: true,
        },
      },
      patients: true,
    },
  });

  if (!job) {
    throw new NotFoundException('Job not found');
  }

  const assignment = job.assignments[0];
  if (!assignment || assignment.caregivers_assignments_caregiver_idTocaregivers.userId !== userId) {
    throw new ForbiddenException('Assignment not found or unauthorized');
  }

  // Verify location if patient has address coordinates
  let locationVerified = false;
  let distanceFromPatient = null;

  if (job.patients.location_lat && job.patients.location_lng) {
    distanceFromPatient = this.calculateDistance(
      checkInDto.location_lat,
      checkInDto.location_lng,
      Number(job.patients.location_lat),
      Number(job.patients.location_lng)
    );

    // Verify within 100 meters
    locationVerified = distanceFromPatient <= 0.1; // km
  }

  // Create check-in care log
  const careLog = await this.careLogsService.create(
    assignment.caregiver_id,
    jobId,
    {
      log_type: CareLogType.CHECK_IN,
      assignment_id: checkInDto.assignment_id,
      location_lat: checkInDto.location_lat,
      location_lng: checkInDto.location_lng,
      notes: checkInDto.notes,
      data: {
        location_verified: locationVerified,
        distance_from_patient_meters: distanceFromPatient ? Math.round(distanceFromPatient * 1000) : null,
      },
    }
  );

  // Update assignment status to ACTIVE
  await this.prisma.assignments.update({
    where: { id: checkInDto.assignment_id },
    data: { status: AssignmentStatus.ACTIVE },
  });

  return {
    care_log_id: careLog.id,
    job_id: jobId,
    assignment_id: checkInDto.assignment_id,
    log_type: 'CHECK_IN',
    timestamp: careLog.timestamp,
    location_verified: locationVerified,
    distance_from_patient_meters: distanceFromPatient ? Math.round(distanceFromPatient * 1000) : null,
  };
}
```

---

### **4. Get All Jobs (Role-Based)**

#### **Guardian View**
```typescript
GET /api/jobs?status=ACTIVE&page=1&limit=20

Authorization: Bearer {guardianToken}

Response:
{
  "success": true,
  "data": [
    {
      "id": "job_001",
      "status": "ACTIVE",
      "start_date": "2025-12-20",
      "end_date": "2026-01-19",
      "packages": {
        "name": "24/7 Elderly Care - Premium"
      },
      "patients": {
        "name": "Mr. Abdul Rahman"
      },
      "assignments": [
        {
          "role": "PRIMARY",
          "caregivers": {
            "name": "Fatima Rahman",
            "photo_url": "https://r2.example.com/photos/caregiver1.jpg"
          }
        }
      ],
      "days_remaining": 39,
      "total_price": "25000.00"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

#### **Agency View**
```typescript
GET /api/jobs?status=PENDING_ASSIGNMENT&page=1&limit=20

Authorization: Bearer {agencyAdminToken}

Response:
{
  "success": true,
  "data": [
    {
      "id": "job_002",
      "status": "PENDING_ASSIGNMENT",
      "start_date": "2025-12-25",
      "packages": {
        "name": "12-Hour Elderly Care"
      },
      "patients": {
        "name": "Mrs. Rahima Begum"
      },
      "guardian": {
        "name": "Dr. Kamal Hassan",
        "phone": "+8801712345678"
      },
      "created_at": "2025-12-11T10:00:00Z",
      "requires_assignment": true
    }
  ]
}
```

#### **Caregiver View**
```typescript
GET /api/jobs?status=ACTIVE&page=1&limit=20

Authorization: Bearer {caregiverToken}

Response:
{
  "success": true,
  "data": [
    {
      "id": "job_001",
      "status": "ACTIVE",
      "start_date": "2025-12-20",
      "end_date": "2026-01-19",
      "patient": {
        "name": "Mr. Abdul Rahman",
        "age": 70,
        "address": "123 Dhanmondi Road, Dhaka 1209"
      },
      "my_assignment": {
        "role": "PRIMARY",
        "shift_start_time": "08:00",
        "shift_end_time": "20:00",
        "days_of_week": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      },
      "special_instructions": "Patient requires medication at 8 AM...",
      "next_shift": "2025-12-21T08:00:00Z"
    }
  ]
}
```

**Implementation**:
```typescript
// File: jobs.service.ts - findAll()

async findAll(
  userId: string,
  userRole: UserRole,
  page: number = 1,
  limit: number = 20,
  status?: JobStatus
) {
  const skip = (page - 1) * limit;
  const where: Prisma.jobsWhereInput = {};

  // Apply status filter if provided
  if (status) {
    where.status = status;
  }

  // Role-based filtering
  if (userRole === UserRole.GUARDIAN) {
    where.guardian_id = userId;
  } else if (userRole === UserRole.AGENCY_ADMIN || userRole === UserRole.AGENCY_MANAGER) {
    const company = await this.prisma.companies.findUnique({
      where: { userId },
    });
    if (company) {
      where.company_id = company.id;
    }
  } else if (userRole === UserRole.CAREGIVER) {
    const caregiver = await this.prisma.caregivers.findUnique({
      where: { userId },
    });
    if (caregiver) {
      where.assignments = {
        some: { caregiver_id: caregiver.id },
      };
    }
  }

  const [jobs, total] = await Promise.all([
    this.prisma.jobs.findMany({
      where,
      skip,
      take: limit,
      include: {
        packages: { select: { name: true } },
        patients: { select: { name: true } },
        assignments: {
          include: {
            caregivers_assignments_caregiver_idTocaregivers: {
              include: {
                users: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    }),
    this.prisma.jobs.count({ where }),
  ]);

  return {
    data: jobs,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
```

---

### **5. Update Job**

#### **Update Job Details (Guardian Only)**
```typescript
PATCH /api/jobs/:id

Authorization: Bearer {guardianToken}
Request Body:
{
  "special_instructions": "Updated: Patient now requires medication at 7 AM, 1 PM, and 7 PM. Additional monitoring needed."
}

Response:
{
  "success": true,
  "data": {
    "id": "job_001",
    "special_instructions": "Updated: Patient now requires medication at 7 AM...",
    "updated_at": "2025-12-11T11:00:00Z"
  }
}
```

---

### **6. Complete Job**

#### **Mark Job as Completed**
```typescript
POST /api/jobs/:id/complete

Authorization: Bearer {guardianToken} or {agencyAdminToken}
Request Body:
{
  "completion_notes": "Job completed successfully. Patient showed great improvement. Caregiver was professional and caring."
}

Response:
{
  "success": true,
  "data": {
    "id": "job_001",
    "status": "COMPLETED",
    "completion_notes": "Job completed successfully...",
    "completed_at": "2026-01-19T23:59:59Z"
  },
  "next_steps": {
    "feedback_required": true,
    "payout_processing": "Caregiver payout will be processed within 3-5 business days"
  }
}
```

**Implementation**:
```typescript
// File: jobs.service.ts - complete()

async complete(
  jobId: string,
  userId: string,
  completionDto: CompleteJobDto
) {
  const job = await this.prisma.jobs.findUnique({
    where: { id: jobId },
    include: {
      companies: true,
      assignments: {
        include: {
          caregivers_assignments_caregiver_idTocaregivers: {
            include: { users: true },
          },
        },
      },
    },
  });

  if (!job) {
    throw new NotFoundException('Job not found');
  }

  // Authorization check
  const isGuardian = job.guardian_id === userId;
  const isAgency = job.companies.userId === userId;

  if (!isGuardian && !isAgency) {
    throw new ForbiddenException('Access denied');
  }

  // Validate job status
  if (job.status !== JobStatus.ACTIVE) {
    throw new BadRequestException('Only active jobs can be completed');
  }

  // Check if end date has passed
  const now = new Date();
  if (now < job.end_date) {
    throw new BadRequestException('Job end date has not been reached yet');
  }

  // Update job status
  const updatedJob = await this.prisma.jobs.update({
    where: { id: jobId },
    data: {
      status: JobStatus.COMPLETED,
      completion_notes: completionDto.completion_notes,
    },
  });

  // Update all assignments to COMPLETED
  await this.prisma.assignments.updateMany({
    where: { job_id: jobId },
    data: { status: AssignmentStatus.COMPLETED },
  });

  // Update caregiver statistics
  for (const assignment of job.assignments) {
    await this.prisma.caregivers.update({
      where: { id: assignment.caregiver_id },
      data: {
        total_jobs_completed: { increment: 1 },
      },
    });
  }

  // Trigger payout processing
  await this.paymentService.processCaregiverPayout(jobId);

  // Notify all parties
  await this.notificationService.send({
    userId: job.guardian_id,
    type: 'JOB_COMPLETED',
    title: 'Job Completed',
    body: 'Your care job has been completed. Please provide feedback.',
    data: { job_id: jobId },
  });

  return updatedJob;
}
```

---

### **7. Cancel Job**

#### **Cancel Job**
```typescript
POST /api/jobs/:id/cancel

Authorization: Bearer {guardianToken} or {agencyAdminToken}
Request Body:
{
  "cancelled_reason": "Patient hospitalized. Will reschedule after discharge."
}

Response:
{
  "success": true,
  "data": {
    "id": "job_001",
    "status": "CANCELLED",
    "cancelled_by": "user_xyz",
    "cancelled_reason": "Patient hospitalized...",
    "cancelled_at": "2025-12-11T12:00:00Z"
  },
  "refund": {
    "eligible": true,
    "amount": "25000.00",
    "processing_time": "5-7 business days"
  }
}
```

---

### **8. Replace Caregiver**

#### **Replace Caregiver in Active Job**
```typescript
POST /api/jobs/:jobId/assignments/:assignmentId/replace

Authorization: Bearer {agencyAdminToken}
Request Body:
{
  "new_caregiver_id": "care_003",
  "replacement_reason": "Original caregiver fell ill. Replacement is experienced and verified."
}

Response:
{
  "success": true,
  "data": {
    "assignment_id": "assign_001",
    "old_caregiver": {
      "id": "care_001",
      "name": "Fatima Rahman"
    },
    "new_caregiver": {
      "id": "care_003",
      "name": "Sumaiya Akter"
    },
    "replacement_reason": "Original caregiver fell ill...",
    "replaced_at": "2025-12-11T13:00:00Z"
  }
}
```

---

## 📦 DTOs (Data Transfer Objects)

### **CreateJobDto**
```typescript
// File: dto/job.dto.ts

import { IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @IsString()
  package_id: string;

  @IsString()
  patient_id: string;

  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end_date?: Date;

  @IsString()
  @IsOptional()
  special_instructions?: string;
}
```

### **AssignCaregiverDto**
```typescript
export class AssignCaregiverDto {
  @IsArray()
  assignments: {
    caregiver_id: string;
    role: AssignmentRole;
    shift_start_time: string;
    shift_end_time: string;
    days_of_week: string[];
  }[];
}
```

### **CheckInDto**
```typescript
export class CheckInDto {
  @IsString()
  assignment_id: string;

  @IsNumber()
  location_lat: number;

  @IsNumber()
  location_lng: number;

  @IsDate()
  @Type(() => Date)
  timestamp: Date;

  @IsString()
  @IsOptional()
  notes?: string;
}
```

---

## 🗄️ Database Schema

### **jobs Table**
```sql
CREATE TABLE jobs (
  id                   VARCHAR(25) PRIMARY KEY,
  package_id           VARCHAR(25) NOT NULL,
  patient_id           VARCHAR(25) NOT NULL,
  company_id           VARCHAR(25) NOT NULL,
  guardian_id          VARCHAR(25) NOT NULL,
  start_date           TIMESTAMP NOT NULL,
  end_date             TIMESTAMP NOT NULL,
  status               VARCHAR(30) DEFAULT 'PENDING_ASSIGNMENT',
  total_price          DECIMAL(10,2) NOT NULL,
  commission_amount    DECIMAL(10,2) NOT NULL,
  payout_amount        DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  completion_notes     TEXT,
  cancelled_reason     TEXT,
  cancelled_at         TIMESTAMP,
  cancelled_by         VARCHAR(25),
  created_at           TIMESTAMP DEFAULT NOW(),
  updated_at           TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (guardian_id) REFERENCES users(id),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (package_id) REFERENCES packages(id),
  INDEX idx_guardian_id (guardian_id),
  INDEX idx_start_date_end_date (start_date, end_date),
  INDEX idx_status (status),
  INDEX idx_company_id (company_id),
  INDEX idx_patient_id (patient_id)
);
```

### **assignments Table**
```sql
CREATE TABLE assignments (
  id               VARCHAR(25) PRIMARY KEY,
  job_id           VARCHAR(25) NOT NULL,
  caregiver_id     VARCHAR(25) NOT NULL,
  role             VARCHAR(20) DEFAULT 'PRIMARY',
  shift_start_time VARCHAR(5) NOT NULL,
  shift_end_time   VARCHAR(5) NOT NULL,
  days_of_week     JSONB NOT NULL,
  status           VARCHAR(20) DEFAULT 'ASSIGNED',
  replaced_by      VARCHAR(25),
  replacement_reason TEXT,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (job_id, caregiver_id, role),
  FOREIGN KEY (caregiver_id) REFERENCES caregivers(id),
  FOREIGN KEY (replaced_by) REFERENCES caregivers(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  INDEX idx_caregiver_id (caregiver_id),
  INDEX idx_job_id (job_id)
);
```

---

## 🧪 Testing

### **Unit Tests**
```typescript
describe('JobsService', () => {
  describe('create', () => {
    it('should create job', async () => {
      const result = await service.create(guardianId, createDto);
      expect(result.status).toBe(JobStatus.PENDING_ASSIGNMENT);
    });

    it('should throw error if patient not owned', async () => {
      await expect(service.create(wrongGuardianId, createDto))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('assignCaregivers', () => {
    it('should assign caregivers and activate job', async () => {
      const result = await service.assignCaregivers(jobId, agencyUserId, assignDto);
      expect(result.status).toBe(JobStatus.ACTIVE);
    });

    it('should notify guardian and caregivers', async () => {
      await service.assignCaregivers(jobId, agencyUserId, assignDto);
      expect(notificationService.send).toHaveBeenCalledTimes(3);
    });
  });

  describe('complete', () => {
    it('should complete job', async () => {
      const result = await service.complete(jobId, guardianId, completeDto);
      expect(result.status).toBe(JobStatus.COMPLETED);
    });

    it('should update caregiver stats', async () => {
      await service.complete(jobId, guardianId, completeDto);
      const caregiver = await prisma.caregivers.findUnique({ where: { id: caregiverId } });
      expect(caregiver.total_jobs_completed).toBeGreaterThan(0);
    });
  });
});
```

---

## 🚀 API Usage Examples

### **Complete Job Flow (React)**
```javascript
const JobManagement = () => {
  const createJob = async (jobData) => {
    // Step 1: Create job
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(jobData)
    });
    
    const job = await response.json();
    
    // Step 2: Process payment
    await processPayment(job.data.id, job.data.total_price);
    
    return job.data;
  };

  const trackJob = async (jobId) => {
    const response = await fetch(`/api/jobs/${jobId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    const job = await response.json();
    return job.data;
  };

  return <JobDashboard onCreate={createJob} onTrack={trackJob} />;
};
```

---

## 📚 Related Documentation

- [02 Backend 01.md](02%20Backend%2001.md) - Architecture & Project Structure
- [02 Backend 04.md](02%20Backend%2004.md) - Caregiver Management
- [02 Backend 05.md](02%20Backend%2005.md) - Patient Management
- [02 Backend 06.md](02%20Backend%2006.md) - Package Management
- [02 Backend 10.md](02%20Backend%2010.md) - Care Logging System

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
