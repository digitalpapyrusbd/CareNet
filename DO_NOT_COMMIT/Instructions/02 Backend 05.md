# Backend Documentation 05 - Patient & Guardian Management

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Module**: Patients  
**Priority**: 🔴 Critical

---

## 📋 Overview

This document covers the **Patient & Guardian Management** system, which handles patient profiles, health records, medical history, guardian-patient relationships, emergency contacts, and care preferences.

### **Module Covered**
- **Patients Module** - Patient profiles, health records, guardian relationships, care preferences

### **Key Features**
- Patient profile creation and management
- Health records and medical history
- Guardian-patient relationships (multiple patients per guardian)
- Emergency contact information
- Care preferences and requirements
- Medical conditions and allergies tracking
- Mobility and cognitive status assessment
- Consent management (data sharing, marketing)

---

## 👴 Patients Module

**Path**: `/backend/src/patients/`

### **Module Files**
```
patients/
├── patients.module.ts           # Module configuration
├── patients.service.ts          # Business logic
├── patients.controller.ts       # HTTP endpoints
└── dto/
    ├── patient.dto.ts           # Create/Update DTOs
    ├── health-record.dto.ts     # Health records
    └── consent.dto.ts           # Consent management
```

---

## 🎯 Core Patient Features

### **1. Patient Profile Creation**

#### **Create Patient (By Guardian)**
```typescript
POST /api/patients

Authorization: Bearer {guardianToken}
Request Body:
{
  "name": "Mr. Abdul Rahman",
  "date_of_birth": "1955-03-20",
  "gender": "MALE",
  "blood_group": "B+",
  "address": "123 Dhanmondi Road, Dhaka 1209",
  "emergency_contact_name": "Dr. Kamal Hassan (Son)",
  "emergency_contact_phone": "+8801712345678",
  "primaryConditions": ["DIABETES", "HYPERTENSION", "ARTHRITIS"],
  "allergies": "Penicillin, Shellfish",
  "mobility_level": "ASSISTED",
  "cognitive_status": "MILD_IMPAIRMENT",
  "photoUrl": "https://r2.example.com/patients/photo.jpg",
  "consent_data_sharing": true,
  "consent_marketing": false
}

Response:
{
  "success": true,
  "data": {
    "id": "pat_001",
    "guardian_id": "user_xyz",
    "name": "Mr. Abdul Rahman",
    "date_of_birth": "1955-03-20",
    "gender": "MALE",
    "blood_group": "B+",
    "address": "123 Dhanmondi Road, Dhaka 1209",
    "emergency_contact_name": "Dr. Kamal Hassan (Son)",
    "emergency_contact_phone": "+8801712345678",
    "primaryConditions": ["DIABETES", "HYPERTENSION", "ARTHRITIS"],
    "allergies": "Penicillin, Shellfish",
    "mobility_level": "ASSISTED",
    "cognitive_status": "MILD_IMPAIRMENT",
    "consent_data_sharing": true,
    "consent_marketing": false,
    "createdAt": "2025-12-11T10:00:00Z",
    "updatedAt": "2025-12-11T10:00:00Z"
  }
}
```

**Implementation**:
```typescript
// File: patients.service.ts - create()

async create(guardianId: string, createPatientDto: CreatePatientDto) {
  // Validate guardian exists and has proper role
  const guardian = await this.prisma.users.findUnique({
    where: { id: guardianId },
  });

  if (!guardian || guardian.role !== UserRole.GUARDIAN) {
    throw new BadRequestException('Invalid guardian account');
  }

  // Create patient profile
  const patient = await this.prisma.patients.create({
    data: {
      guardian_id: guardianId,
      name: createPatientDto.name,
      date_of_birth: new Date(createPatientDto.date_of_birth),
      gender: createPatientDto.gender,
      blood_group: createPatientDto.blood_group,
      address: createPatientDto.address,
      emergency_contact_name: createPatientDto.emergency_contact_name,
      emergency_contact_phone: createPatientDto.emergency_contact_phone,
      primaryConditions: createPatientDto.primaryConditions || [],
      allergies: createPatientDto.allergies,
      mobility_level: createPatientDto.mobility_level,
      cognitive_status: createPatientDto.cognitive_status,
      photoUrl: createPatientDto.photoUrl,
      consent_data_sharing: createPatientDto.consent_data_sharing || false,
      consent_marketing: createPatientDto.consent_marketing || false,
    },
  });

  // Log audit trail
  await this.auditService.log({
    actor_id: guardianId,
    action_type: 'CREATE_PATIENT',
    entity_type: 'PATIENT',
    entity_id: patient.id,
  });

  return patient;
}
```

**Business Rules**:
- ✅ Multiple patients can be created per guardian
- ✅ Guardian must have `GUARDIAN` role
- ✅ Patient name and DOB are required
- ✅ Emergency contact is mandatory
- ✅ Consent flags default to `false`
- ✅ Primary conditions stored as JSON array
- ✅ Mobility and cognitive status use predefined enums

---

### **2. Get All Patients (Guardian's List)**

#### **List Guardian's Patients**
```typescript
GET /api/patients

Authorization: Bearer {guardianToken}

Response:
{
  "success": true,
  "data": [
    {
      "id": "pat_001",
      "name": "Mr. Abdul Rahman",
      "date_of_birth": "1955-03-20",
      "gender": "MALE",
      "age": 70,
      "photoUrl": "https://r2.example.com/patients/photo1.jpg",
      "primaryConditions": ["DIABETES", "HYPERTENSION"],
      "mobility_level": "ASSISTED",
      "cognitive_status": "MILD_IMPAIRMENT",
      "active_jobs_count": 2,
      "createdAt": "2024-01-15T08:00:00Z"
    },
    {
      "id": "pat_002",
      "name": "Mrs. Rahima Begum",
      "date_of_birth": "1960-08-12",
      "gender": "FEMALE",
      "age": 65,
      "photoUrl": "https://r2.example.com/patients/photo2.jpg",
      "primaryConditions": ["ARTHRITIS"],
      "mobility_level": "INDEPENDENT",
      "cognitive_status": "NORMAL",
      "active_jobs_count": 0,
      "createdAt": "2024-03-20T10:00:00Z"
    }
  ]
}
```

**Implementation**:
```typescript
// File: patients.service.ts - findAll()

async findAll(guardianId: string) {
  const patients = await this.prisma.patients.findMany({
    where: {
      guardian_id: guardianId,
      deletedAt: null,
    },
    include: {
      _count: {
        select: {
          jobs: {
            where: {
              status: {
                in: [JobStatus.PENDING_ASSIGNMENT, JobStatus.ACTIVE],
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate age for each patient
  const enrichedPatients = patients.map(patient => ({
    ...patient,
    age: this.calculateAge(patient.date_of_birth),
    active_jobs_count: patient._count.jobs,
  }));

  return enrichedPatients;
}

private calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
```

---

### **3. Get Patient Details**

#### **Fetch Complete Patient Profile**
```typescript
GET /api/patients/:id

Authorization: Bearer {guardianToken}

Response:
{
  "success": true,
  "data": {
    "id": "pat_001",
    "guardian_id": "user_xyz",
    "name": "Mr. Abdul Rahman",
    "date_of_birth": "1955-03-20",
    "age": 70,
    "gender": "MALE",
    "blood_group": "B+",
    "address": "123 Dhanmondi Road, Dhaka 1209",
    "emergency_contact_name": "Dr. Kamal Hassan (Son)",
    "emergency_contact_phone": "+8801712345678",
    "primaryConditions": ["DIABETES", "HYPERTENSION", "ARTHRITIS"],
    "allergies": "Penicillin, Shellfish",
    "mobility_level": "ASSISTED",
    "cognitive_status": "MILD_IMPAIRMENT",
    "photoUrl": "https://r2.example.com/patients/photo.jpg",
    "consent_data_sharing": true,
    "consent_marketing": false,
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2025-12-11T10:00:00Z",
    "health_records": [
      {
        "id": "hr_001",
        "record_type": "PRESCRIPTION",
        "title": "Monthly Medication - December 2025",
        "description": "Metformin 500mg twice daily",
        "file_url": "https://r2.example.com/records/prescription.pdf",
        "uploaded_by": "Dr. Ahmed",
        "valid_from": "2025-12-01",
        "valid_until": "2025-12-31",
        "created_at": "2025-12-01T09:00:00Z"
      }
    ],
    "active_jobs": [
      {
        "id": "job_001",
        "package_name": "24/7 Elderly Care",
        "status": "ACTIVE",
        "start_date": "2025-12-01",
        "end_date": "2025-12-31"
      }
    ]
  }
}
```

**Implementation**:
```typescript
// File: patients.service.ts - findOne()

async findOne(id: string, guardianId: string) {
  const patient = await this.prisma.patients.findUnique({
    where: { id },
    include: {
      health_records: {
        where: { is_archived: false },
        orderBy: { created_at: 'desc' },
        take: 10,
      },
      jobs: {
        where: {
          status: {
            in: [JobStatus.PENDING_ASSIGNMENT, JobStatus.ACTIVE],
          },
        },
        include: {
          packages: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!patient || patient.deletedAt) {
    throw new NotFoundException('Patient not found');
  }

  // Authorization check
  if (patient.guardian_id !== guardianId) {
    throw new ForbiddenException('You do not have access to this patient');
  }

  return {
    ...patient,
    age: this.calculateAge(patient.date_of_birth),
    active_jobs: patient.jobs.map(job => ({
      id: job.id,
      package_name: job.packages.name,
      status: job.status,
      start_date: job.start_date,
      end_date: job.end_date,
    })),
  };
}
```

---

### **4. Update Patient Information**

#### **Update Patient Profile**
```typescript
PATCH /api/patients/:id

Authorization: Bearer {guardianToken}
Request Body:
{
  "address": "456 New Address, Dhaka 1212",
  "emergency_contact_phone": "+8801812345678",
  "primaryConditions": ["DIABETES", "HYPERTENSION", "ARTHRITIS", "ASTHMA"],
  "allergies": "Penicillin, Shellfish, Peanuts",
  "mobility_level": "WHEELCHAIR",
  "cognitive_status": "MODERATE"
}

Response:
{
  "success": true,
  "data": {
    "id": "pat_001",
    "address": "456 New Address, Dhaka 1212",
    "emergency_contact_phone": "+8801812345678",
    "primaryConditions": ["DIABETES", "HYPERTENSION", "ARTHRITIS", "ASTHMA"],
    "allergies": "Penicillin, Shellfish, Peanuts",
    "mobility_level": "WHEELCHAIR",
    "cognitive_status": "MODERATE",
    "updatedAt": "2025-12-11T11:00:00Z"
  }
}
```

**Implementation**:
```typescript
// File: patients.service.ts - update()

async update(
  id: string,
  guardianId: string,
  updatePatientDto: UpdatePatientDto
) {
  const patient = await this.prisma.patients.findUnique({
    where: { id },
  });

  if (!patient || patient.deletedAt) {
    throw new NotFoundException('Patient not found');
  }

  if (patient.guardian_id !== guardianId) {
    throw new ForbiddenException('Access denied');
  }

  const updated = await this.prisma.patients.update({
    where: { id },
    data: updatePatientDto,
  });

  // Log audit trail
  await this.auditService.log({
    actor_id: guardianId,
    action_type: 'UPDATE_PATIENT',
    entity_type: 'PATIENT',
    entity_id: id,
    changes: updatePatientDto,
  });

  return updated;
}
```

---

### **5. Health Records Management**

#### **Add Health Record**
```typescript
POST /api/patients/:patientId/health-records

Authorization: Bearer {guardianToken}
Request Body:
{
  "record_type": "PRESCRIPTION",
  "title": "Monthly Medication - December 2025",
  "description": "Metformin 500mg twice daily, Amlodipine 5mg once daily",
  "file_url": "https://r2.example.com/records/prescription.pdf",
  "uploaded_by": "Dr. Ahmed Rahman",
  "valid_from": "2025-12-01",
  "valid_until": "2025-12-31",
  "metadata": {
    "doctor_name": "Dr. Ahmed Rahman",
    "hospital": "United Hospital",
    "prescription_number": "RX-2025-12345"
  }
}

Response:
{
  "success": true,
  "data": {
    "id": "hr_001",
    "patient_id": "pat_001",
    "record_type": "PRESCRIPTION",
    "title": "Monthly Medication - December 2025",
    "description": "Metformin 500mg twice daily, Amlodipine 5mg once daily",
    "file_url": "https://r2.example.com/records/prescription.pdf",
    "uploaded_by": "Dr. Ahmed Rahman",
    "valid_from": "2025-12-01",
    "valid_until": "2025-12-31",
    "is_archived": false,
    "created_at": "2025-12-01T09:00:00Z"
  }
}
```

#### **Get Patient Health Records**
```typescript
GET /api/patients/:patientId/health-records?type=PRESCRIPTION&limit=20

Authorization: Bearer {guardianToken}

Response:
{
  "success": true,
  "data": [
    {
      "id": "hr_001",
      "record_type": "PRESCRIPTION",
      "title": "Monthly Medication - December 2025",
      "description": "Metformin 500mg twice daily",
      "file_url": "https://r2.example.com/records/prescription.pdf",
      "valid_from": "2025-12-01",
      "valid_until": "2025-12-31",
      "created_at": "2025-12-01T09:00:00Z"
    },
    {
      "id": "hr_002",
      "record_type": "LAB_REPORT",
      "title": "Blood Sugar Test",
      "description": "Fasting: 110 mg/dL, Post-meal: 145 mg/dL",
      "file_url": "https://r2.example.com/records/lab-report.pdf",
      "created_at": "2025-11-15T10:00:00Z"
    }
  ]
}
```

**Implementation**:
```typescript
// File: patients.service.ts - addHealthRecord()

async addHealthRecord(
  patientId: string,
  guardianId: string,
  recordDto: CreateHealthRecordDto
) {
  // Verify patient belongs to guardian
  const patient = await this.findOne(patientId, guardianId);

  const healthRecord = await this.prisma.health_records.create({
    data: {
      patient_id: patientId,
      record_type: recordDto.record_type,
      title: recordDto.title,
      description: recordDto.description,
      file_url: recordDto.file_url,
      uploaded_by: recordDto.uploaded_by,
      valid_from: recordDto.valid_from ? new Date(recordDto.valid_from) : null,
      valid_until: recordDto.valid_until ? new Date(recordDto.valid_until) : null,
      metadata: recordDto.metadata || {},
    },
  });

  return healthRecord;
}

async getHealthRecords(
  patientId: string,
  guardianId: string,
  filters?: {
    type?: HealthRecordType;
    limit?: number;
  }
) {
  // Verify access
  await this.findOne(patientId, guardianId);

  const where: Prisma.health_recordsWhereInput = {
    patient_id: patientId,
    is_archived: false,
  };

  if (filters?.type) {
    where.record_type = filters.type;
  }

  const records = await this.prisma.health_records.findMany({
    where,
    orderBy: { created_at: 'desc' },
    take: filters?.limit || 50,
  });

  return records;
}
```

---

### **6. Medical Conditions & Allergies**

#### **Update Medical Conditions**
```typescript
PATCH /api/patients/:id/conditions

Authorization: Bearer {guardianToken}
Request Body:
{
  "primaryConditions": [
    "DIABETES",
    "HYPERTENSION",
    "ARTHRITIS",
    "ASTHMA",
    "CHRONIC_KIDNEY_DISEASE"
  ],
  "allergies": "Penicillin, Shellfish, Peanuts, Latex"
}

Response:
{
  "success": true,
  "data": {
    "id": "pat_001",
    "primaryConditions": [
      "DIABETES",
      "HYPERTENSION",
      "ARTHRITIS",
      "ASTHMA",
      "CHRONIC_KIDNEY_DISEASE"
    ],
    "allergies": "Penicillin, Shellfish, Peanuts, Latex",
    "updatedAt": "2025-12-11T12:00:00Z"
  }
}
```

---

### **7. Mobility & Cognitive Assessment**

#### **Mobility Levels**
```typescript
enum MobilityLevel {
  INDEPENDENT = "INDEPENDENT",       // Can move without assistance
  ASSISTED = "ASSISTED",             // Needs help with walking
  WHEELCHAIR = "WHEELCHAIR",         // Uses wheelchair
  BEDRIDDEN = "BEDRIDDEN"            // Cannot leave bed
}
```

#### **Cognitive Status**
```typescript
enum CognitiveStatus {
  NORMAL = "NORMAL",                 // No cognitive impairment
  MILD_IMPAIRMENT = "MILD_IMPAIRMENT",   // Mild memory issues
  MODERATE = "MODERATE",             // Moderate dementia
  SEVERE = "SEVERE"                  // Severe dementia/Alzheimer's
}
```

#### **Update Assessment**
```typescript
PATCH /api/patients/:id/assessment

Authorization: Bearer {guardianToken}
Request Body:
{
  "mobility_level": "WHEELCHAIR",
  "cognitive_status": "MODERATE"
}

Response:
{
  "success": true,
  "data": {
    "id": "pat_001",
    "mobility_level": "WHEELCHAIR",
    "cognitive_status": "MODERATE",
    "updatedAt": "2025-12-11T13:00:00Z"
  }
}
```

---

### **8. Consent Management**

#### **Update Consent Preferences**
```typescript
PATCH /api/patients/:id/consent

Authorization: Bearer {guardianToken}
Request Body:
{
  "consent_data_sharing": true,
  "consent_marketing": false
}

Response:
{
  "success": true,
  "data": {
    "id": "pat_001",
    "consent_data_sharing": true,
    "consent_marketing": false,
    "updatedAt": "2025-12-11T14:00:00Z"
  }
}
```

**Consent Types**:
- **Data Sharing**: Allow sharing patient data with caregivers and medical professionals
- **Marketing**: Opt-in for marketing communications

---

### **9. Delete Patient (Soft Delete)**

#### **Delete Patient Profile**
```typescript
DELETE /api/patients/:id

Authorization: Bearer {guardianToken}

Response:
{
  "success": true,
  "message": "Patient deleted successfully"
}
```

**Implementation**:
```typescript
// File: patients.service.ts - remove()

async remove(id: string, guardianId: string) {
  const patient = await this.prisma.patients.findUnique({
    where: { id },
    include: {
      jobs: {
        where: {
          status: {
            in: [JobStatus.PENDING_ASSIGNMENT, JobStatus.ACTIVE],
          },
        },
      },
    },
  });

  if (!patient || patient.guardian_id !== guardianId) {
    throw new NotFoundException('Patient not found');
  }

  // Prevent deletion if there are active jobs
  if (patient.jobs.length > 0) {
    throw new BadRequestException(
      'Cannot delete patient with active jobs. Please complete or cancel jobs first.'
    );
  }

  // Soft delete
  await this.prisma.patients.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  // Log audit trail
  await this.auditService.log({
    actor_id: guardianId,
    action_type: 'DELETE_PATIENT',
    entity_type: 'PATIENT',
    entity_id: id,
  });

  return { message: 'Patient deleted successfully' };
}
```

---

## 📦 DTOs (Data Transfer Objects)

### **CreatePatientDto**
```typescript
// File: dto/patient.dto.ts

import { IsString, IsDate, IsEnum, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { Gender, MobilityLevel, CognitiveStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsDate()
  @Type(() => Date)
  date_of_birth: Date;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsOptional()
  blood_group?: string;

  @IsString()
  address: string;

  @IsString()
  emergency_contact_name: string;

  @IsString()
  emergency_contact_phone: string;

  @IsArray()
  @IsOptional()
  primaryConditions?: string[];

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsEnum(MobilityLevel)
  mobility_level: MobilityLevel;

  @IsEnum(CognitiveStatus)
  cognitive_status: CognitiveStatus;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsBoolean()
  @IsOptional()
  consent_data_sharing?: boolean;

  @IsBoolean()
  @IsOptional()
  consent_marketing?: boolean;
}
```

### **UpdatePatientDto**
```typescript
export class UpdatePatientDto {
  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  emergency_contact_name?: string;

  @IsString()
  @IsOptional()
  emergency_contact_phone?: string;

  @IsArray()
  @IsOptional()
  primaryConditions?: string[];

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsEnum(MobilityLevel)
  @IsOptional()
  mobility_level?: MobilityLevel;

  @IsEnum(CognitiveStatus)
  @IsOptional()
  cognitive_status?: CognitiveStatus;

  @IsBoolean()
  @IsOptional()
  consent_data_sharing?: boolean;

  @IsBoolean()
  @IsOptional()
  consent_marketing?: boolean;
}
```

### **CreateHealthRecordDto**
```typescript
export class CreateHealthRecordDto {
  @IsEnum(HealthRecordType)
  record_type: HealthRecordType;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  file_url: string;

  @IsString()
  @IsOptional()
  uploaded_by?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  valid_from?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  valid_until?: Date;

  @IsObject()
  @IsOptional()
  metadata?: any;
}
```

---

## 🗄️ Database Schema

### **patients Table**
```sql
CREATE TABLE patients (
  id                      VARCHAR(25) PRIMARY KEY,
  user_id                 VARCHAR(25),
  guardian_id             VARCHAR(25) NOT NULL,
  name                    VARCHAR(255) NOT NULL,
  date_of_birth           DATE NOT NULL,
  gender                  VARCHAR(10) NOT NULL,
  blood_group             VARCHAR(10),
  address                 TEXT NOT NULL,
  emergency_contact_name  VARCHAR(255) NOT NULL,
  emergency_contact_phone VARCHAR(20) NOT NULL,
  primaryConditions       JSONB,
  allergies               TEXT,
  mobility_level          VARCHAR(20) DEFAULT 'INDEPENDENT',
  cognitive_status        VARCHAR(20) DEFAULT 'NORMAL',
  photoUrl                TEXT,
  consent_data_sharing    BOOLEAN DEFAULT FALSE,
  consent_marketing       BOOLEAN DEFAULT FALSE,
  deletedAt               TIMESTAMP,
  createdAt               TIMESTAMP DEFAULT NOW(),
  updatedAt               TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (guardian_id) REFERENCES users(id),
  INDEX idx_primaryConditions (primaryConditions),
  INDEX idx_guardian_id (guardian_id)
);
```

### **health_records Table**
```sql
CREATE TABLE health_records (
  id          VARCHAR(25) PRIMARY KEY,
  patient_id  VARCHAR(25) NOT NULL,
  record_type VARCHAR(50) NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  file_url    TEXT,
  metadata    JSONB,
  uploaded_by VARCHAR(255),
  valid_from  DATE,
  valid_until DATE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  INDEX idx_record_type (record_type),
  INDEX idx_patient_id (patient_id)
);
```

---

## 🧪 Testing

### **Unit Tests**
```typescript
describe('PatientsService', () => {
  describe('create', () => {
    it('should create patient profile', async () => {
      const result = await service.create(guardianId, createDto);
      expect(result.name).toBe('Mr. Abdul Rahman');
      expect(result.guardian_id).toBe(guardianId);
    });

    it('should throw error if guardian role invalid', async () => {
      await expect(service.create(invalidUserId, createDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all guardian patients', async () => {
      const result = await service.findAll(guardianId);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].age).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update patient information', async () => {
      const result = await service.update(patientId, guardianId, updateDto);
      expect(result.address).toBe('New Address');
    });

    it('should throw error if unauthorized', async () => {
      await expect(service.update(patientId, wrongGuardianId, updateDto))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should soft delete patient', async () => {
      await service.remove(patientId, guardianId);
      const patient = await prisma.patients.findUnique({ where: { id: patientId } });
      expect(patient.deletedAt).toBeDefined();
    });

    it('should prevent deletion with active jobs', async () => {
      await expect(service.remove(patientIdWithJobs, guardianId))
        .rejects.toThrow(BadRequestException);
    });
  });
});
```

---

## 🚀 API Usage Examples

### **Complete Patient Management Flow (React)**
```javascript
const PatientManagement = () => {
  const [patients, setPatients] = useState([]);

  const createPatient = async (patientData) => {
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(patientData)
    });
    
    const result = await response.json();
    setPatients([...patients, result.data]);
  };

  const addHealthRecord = async (patientId, recordData) => {
    // Upload file first
    const fileUrl = await uploadFile(recordData.file);
    
    const response = await fetch(`/api/patients/${patientId}/health-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        ...recordData,
        file_url: fileUrl
      })
    });
    
    return response.json();
  };

  return (
    <div>
      <PatientList patients={patients} />
      <AddPatientForm onSubmit={createPatient} />
    </div>
  );
};
```

---

## 📚 Related Documentation

- [02 Backend 01.md](02%20Backend%2001.md) - Architecture & Project Structure
- [02 Backend 02.md](02%20Backend%2002.md) - Authentication & User Management
- [02 Backend 07.md](02%20Backend%2007.md) - Job Lifecycle Management
- [02 Backend 10.md](02%20Backend%2010.md) - Care Logging System

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
