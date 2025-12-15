# Backend Documentation 10 - Care Logging System

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Module**: Care Logs  
**Priority**: 🔴 Critical

---

## 📋 Overview

The **Care Logging System** enables caregivers to document patient care activities in real-time, providing guardians and agencies with transparent visibility into care delivery. This module is critical for quality assurance, compliance, and family peace of mind.

### **Key Features**
- Real-time care activity logging
- 8 log types (Check-in, Vitals, Medication, etc.)
- Photo evidence attachment
- GPS location tracking
- Structured vitals data (BP, heart rate, temperature)
- Activity and meal tracking
- Guardian auto-notifications
- Timeline view by job/patient

**Module Path**: `/backend/src/care-logs/`

---

## 📁 Module Structure

```
care-logs/
├── care-logs.module.ts          # Module configuration
├── care-logs.service.ts         # Business logic
├── care-logs.controller.ts      # HTTP endpoints
└── dto/
    └── care-log.dto.ts          # Request validation
```

---

## 🎯 Log Types

### **CareLogType Enum**

```typescript
enum CareLogType {
  CHECK_IN      // Caregiver arrival
  VITALS        // Blood pressure, temperature, pulse
  MEDICATION    // Medicine administration
  MEAL          // Meal preparation/serving
  ACTIVITY      // Exercise, therapy, entertainment
  INCIDENT      // Falls, emergencies, concerns
  CHECK_OUT     // Caregiver departure
}
```

### **Log Type Descriptions**

| Type | Purpose | Required Data | Example |
|------|---------|---------------|---------|
| `CHECK_IN` | Mark shift start | GPS location, timestamp | "Arrived at 8:00 AM" |
| `VITALS` | Record health metrics | BP, pulse, temp, O2 | "BP: 120/80, Pulse: 72" |
| `MEDICATION` | Track medicine given | Drug name, dosage, time | "Gave Aspirin 100mg" |
| `MEAL` | Document meals | Meal type, food items | "Breakfast: Rice, eggs" |
| `ACTIVITY` | Log activities | Activity type, duration | "Walked 15 minutes" |
| `INCIDENT` | Report issues | Description, severity | "Patient fell, minor bruise" |
| `CHECK_OUT` | Mark shift end | GPS location, summary | "Departed at 8:00 PM" |

---

## 🔌 API Endpoints

### **1. Create Care Log**

**Endpoint**: `POST /api/care-logs`  
**Access**: CAREGIVER  
**Description**: Create a new care log entry

```typescript
POST /api/care-logs
Authorization: Bearer {accessToken}
Role: CAREGIVER

Request Body:
{
  "job_id": "job-uuid-123",
  "log_type": "VITALS",
  "vitals": {
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "heartRate": 72,
    "temperature": 37.2,
    "oxygenSaturation": 98,
    "respiratoryRate": 16
  },
  "notes": "Patient vitals normal. No concerns.",
  "photoUrls": []
}

Response: 201 Created
{
  "id": "log-uuid-456",
  "job_id": "job-uuid-123",
  "assignment_id": "assign-uuid-789",
  "caregiver_id": "caregiver-uuid-101",
  "patient_id": "patient-uuid-202",
  "log_type": "VITALS",
  "timestamp": "2025-12-11T14:30:00Z",
  "location_lat": null,
  "location_lng": null,
  "data": {},
  "notes": "Patient vitals normal. No concerns.",
  "vitals": {
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "heartRate": 72,
    "temperature": 37.2,
    "oxygenSaturation": 98,
    "respiratoryRate": 16
  },
  "activities": null,
  "photo_urls": [],
  "guardian_notified": false,
  "createdAt": "2025-12-11T14:30:00Z"
}
```

**Validation**:
- Job must exist and caregiver must be assigned
- `log_type` must be valid CareLogType enum
- Vitals data must match expected structure
- Photo URLs must be valid HTTPS URLs

**Business Logic**:
```typescript
async create(caregiverId: string, jobId: string, data: CreateCareLogDto) {
  // 1. Verify job exists
  const job = await this.prisma.jobs.findUnique({
    where: { id: jobId },
    include: {
      assignments: {
        where: { caregiver_id: { in: [caregiverId] } }
      }
    }
  });
  
  if (!job) throw new NotFoundException('Job not found');
  
  // 2. Resolve caregiver entity from userId
  const caregiver = await this.prisma.caregivers.findUnique({
    where: { userId: caregiverId }
  });
  
  if (!caregiver) {
    throw new NotFoundException('Caregiver profile not found');
  }
  
  // 3. Find assignment
  const assignment = await this.prisma.assignments.findFirst({
    where: { 
      job_id: jobId, 
      caregiver_id: caregiver.id 
    }
  });
  
  if (!assignment) {
    throw new NotFoundException('Assignment not found');
  }
  
  // 4. Create log
  const log = await this.prisma.care_logs.create({
    data: {
      job_id: jobId,
      assignment_id: assignment.id,
      caregiver_id: caregiver.id,
      patient_id: job.patient_id,
      log_type: data.log_type || CareLogType.ACTIVITY,
      timestamp: new Date(),
      data: (data.data || {}) as Prisma.InputJsonValue,
      notes: data.notes,
      vitals: data.vitals as Prisma.InputJsonValue,
      activities: data.activities as Prisma.InputJsonValue,
      photo_urls: data.photoUrls || []
    }
  });
  
  // 5. Notify guardian
  await this.notificationsService.create(
    job.guardian_id,
    `New ${data.log_type} Log`,
    `Caregiver logged: ${data.notes || data.log_type}`
  );
  
  return log;
}
```

---

### **2. CHECK_IN Log Example**

```typescript
POST /api/care-logs

Request:
{
  "job_id": "job-uuid-123",
  "log_type": "CHECK_IN",
  "notes": "Arrived on time. Patient is awake and comfortable.",
  "data": {
    "location": {
      "latitude": 23.8103,
      "longitude": 90.4125
    }
  }
}

Response: 201 Created
{
  "id": "log-uuid-789",
  "log_type": "CHECK_IN",
  "timestamp": "2025-12-11T08:00:00Z",
  "location_lat": 23.8103,
  "location_lng": 90.4125,
  "notes": "Arrived on time. Patient is awake and comfortable.",
  ...
}
```

---

### **3. MEDICATION Log Example**

```typescript
POST /api/care-logs

Request:
{
  "job_id": "job-uuid-123",
  "log_type": "MEDICATION",
  "data": {
    "medication": {
      "name": "Aspirin",
      "dosage": "100mg",
      "route": "oral",
      "time": "09:00"
    }
  },
  "notes": "Administered morning medication with breakfast.",
  "photoUrls": ["https://r2.cloudflare.com/medications/photo123.jpg"]
}

Response: 201 Created
{
  "id": "log-uuid-890",
  "log_type": "MEDICATION",
  "data": {
    "medication": {
      "name": "Aspirin",
      "dosage": "100mg",
      "route": "oral",
      "time": "09:00"
    }
  },
  "photo_urls": ["https://r2.cloudflare.com/medications/photo123.jpg"],
  ...
}
```

---

### **4. MEAL Log Example**

```typescript
POST /api/care-logs

Request:
{
  "job_id": "job-uuid-123",
  "log_type": "MEAL",
  "activities": [
    {
      "mealType": "lunch",
      "items": ["Rice", "Dal", "Fish curry", "Vegetables"],
      "time": "13:00",
      "consumed": "75%"
    }
  ],
  "notes": "Patient ate well. Good appetite.",
  "photoUrls": ["https://r2.cloudflare.com/meals/lunch123.jpg"]
}

Response: 201 Created
{
  "id": "log-uuid-901",
  "log_type": "MEAL",
  "activities": [...],
  "photo_urls": ["https://r2.cloudflare.com/meals/lunch123.jpg"],
  ...
}
```

---

### **5. ACTIVITY Log Example**

```typescript
POST /api/care-logs

Request:
{
  "job_id": "job-uuid-123",
  "log_type": "ACTIVITY",
  "activities": [
    {
      "activityType": "walking",
      "duration": 15,
      "intensity": "light",
      "notes": "Walked around the garden"
    }
  ],
  "notes": "Patient completed light exercise. No discomfort."
}

Response: 201 Created
{
  "id": "log-uuid-012",
  "log_type": "ACTIVITY",
  "activities": [
    {
      "activityType": "walking",
      "duration": 15,
      "intensity": "light",
      "notes": "Walked around the garden"
    }
  ],
  ...
}
```

---

### **6. INCIDENT Log Example**

```typescript
POST /api/care-logs

Request:
{
  "job_id": "job-uuid-123",
  "log_type": "INCIDENT",
  "data": {
    "incident": {
      "type": "fall",
      "severity": "minor",
      "actionTaken": "Helped patient up, checked for injuries",
      "emergencyContact": false
    }
  },
  "notes": "Patient tripped on carpet. Minor bruise on left knee. Applied ice pack.",
  "photoUrls": ["https://r2.cloudflare.com/incidents/fall123.jpg"]
}

Response: 201 Created
{
  "id": "log-uuid-123",
  "log_type": "INCIDENT",
  "data": {
    "incident": {
      "type": "fall",
      "severity": "minor",
      "actionTaken": "Helped patient up, checked for injuries",
      "emergencyContact": false
    }
  },
  "notes": "Patient tripped on carpet. Minor bruise on left knee. Applied ice pack.",
  "guardian_notified": true,  // Auto-notify on incidents
  ...
}
```

---

### **7. Get Logs by Job**

**Endpoint**: `GET /api/care-logs/job/:jobId`  
**Access**: CAREGIVER, GUARDIAN, AGENCY_ADMIN  
**Description**: Get all care logs for a specific job

```typescript
GET /api/care-logs/job/job-uuid-123
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "data": [
    {
      "id": "log-uuid-456",
      "log_type": "CHECK_IN",
      "timestamp": "2025-12-11T08:00:00Z",
      "notes": "Arrived on time",
      "caregivers": {
        "id": "caregiver-uuid-101",
        "userId": "user-uuid-202"
      }
    },
    {
      "id": "log-uuid-789",
      "log_type": "VITALS",
      "timestamp": "2025-12-11T09:00:00Z",
      "vitals": {
        "bloodPressure": { "systolic": 120, "diastolic": 80 },
        "heartRate": 72
      },
      "notes": "Vitals normal",
      "caregivers": {
        "id": "caregiver-uuid-101",
        "userId": "user-uuid-202"
      }
    }
  ],
  "meta": {
    "total": 15,
    "jobId": "job-uuid-123"
  }
}
```

**Implementation**:
```typescript
async findByJob(jobId: string) {
  const logs = await this.prisma.care_logs.findMany({
    where: { job_id: jobId },
    orderBy: { timestamp: 'desc' },
    include: {
      caregivers: {
        select: {
          id: true,
          userId: true
        }
      }
    }
  });
  
  return logs;
}
```

---

### **8. Get Single Log**

**Endpoint**: `GET /api/care-logs/:id`  
**Access**: Authenticated  
**Description**: Get care log details by ID

```typescript
GET /api/care-logs/log-uuid-456
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": "log-uuid-456",
  "job_id": "job-uuid-123",
  "assignment_id": "assign-uuid-789",
  "caregiver_id": "caregiver-uuid-101",
  "patient_id": "patient-uuid-202",
  "log_type": "VITALS",
  "timestamp": "2025-12-11T14:30:00Z",
  "vitals": {
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "heartRate": 72,
    "temperature": 37.2,
    "oxygenSaturation": 98
  },
  "notes": "Patient vitals normal. No concerns.",
  "photo_urls": [],
  "guardian_notified": true,
  "createdAt": "2025-12-11T14:30:00Z",
  "caregivers": {
    "id": "caregiver-uuid-101",
    "userId": "user-uuid-202"
  }
}
```

---

### **9. Update Care Log**

**Endpoint**: `PATCH /api/care-logs/:id`  
**Access**: CAREGIVER (creator only)  
**Description**: Update care log (within 1 hour of creation)

```typescript
PATCH /api/care-logs/log-uuid-456
Authorization: Bearer {accessToken}

Request:
{
  "notes": "Patient vitals normal. Updated: Added O2 saturation reading.",
  "vitals": {
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "heartRate": 72,
    "temperature": 37.2,
    "oxygenSaturation": 98
  }
}

Response: 200 OK
{
  "id": "log-uuid-456",
  "notes": "Patient vitals normal. Updated: Added O2 saturation reading.",
  "vitals": {
    ...
    "oxygenSaturation": 98
  },
  ...
}
```

**Edit Window**: Logs can only be edited within 1 hour of creation

```typescript
async update(id: string, dto: UpdateCareLogDto) {
  const log = await this.prisma.care_logs.findUnique({
    where: { id }
  });
  
  if (!log) throw new NotFoundException('Care log not found');
  
  // Check edit window (1 hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if (log.createdAt < oneHourAgo) {
    throw new BadRequestException('Edit window expired (1 hour)');
  }
  
  return this.prisma.care_logs.update({
    where: { id },
    data: {
      log_type: dto.log_type,
      notes: dto.notes,
      vitals: dto.vitals as Prisma.InputJsonValue,
      activities: dto.activities as Prisma.InputJsonValue,
      photo_urls: dto.photoUrls,
      data: dto.data as Prisma.InputJsonValue
    },
    include: {
      caregivers: {
        select: { id: true, userId: true }
      }
    }
  });
}
```

---

### **10. Get Logs by Caregiver**

**Endpoint**: `GET /api/care-logs/caregiver/me`  
**Access**: CAREGIVER  
**Description**: Get all logs created by current caregiver

```typescript
GET /api/care-logs/caregiver/me?job_id=job-uuid-123
Authorization: Bearer {accessToken}

Query Parameters:
- job_id: string (optional - filter by job)
- date: string (optional - filter by date YYYY-MM-DD)
- log_type: CareLogType (optional - filter by type)

Response: 200 OK
{
  "data": [
    // Caregiver's logs
  ],
  "meta": {
    "total": 42,
    "caregiverId": "caregiver-uuid-101"
  }
}
```

**Implementation**:
```typescript
async findByCaregiver(caregiverId: string, jobId?: string) {
  const caregiver = await this.prisma.caregivers.findUnique({
    where: { userId: caregiverId }
  });
  
  if (!caregiver) {
    throw new NotFoundException('Caregiver profile not found');
  }
  
  const where: Prisma.care_logsWhereInput = { 
    caregiver_id: caregiver.id 
  };
  
  if (jobId) {
    where.job_id = jobId;
  }
  
  return this.prisma.care_logs.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    include: {
      caregivers: {
        select: { id: true, userId: true }
      }
    }
  });
}
```

---

## 📊 Database Schema

### **care_logs Model**

```prisma
model care_logs {
  id                String      @id @default(cuid())
  job_id            String
  assignment_id     String
  caregiver_id      String
  patient_id        String
  log_type          CareLogType
  timestamp         DateTime
  location_lat      Decimal?
  location_lng      Decimal?
  data              Json        // Generic data field
  notes             String?
  photo_urls        Json?       // Array of photo URLs
  guardian_notified Boolean     @default(false)
  createdAt         DateTime    @default(now())
  vitals            Json?       // Structured vitals data
  activities        Json?       // Structured activities data
  
  patients          patients    @relation(fields: [patient_id], references: [id])
  caregivers        caregivers  @relation(fields: [caregiver_id], references: [id])
  assignments       assignments @relation(fields: [assignment_id], references: [id])
  jobs              jobs        @relation(fields: [job_id], references: [id])

  @@index([log_type])
  @@index([timestamp])
  @@index([patient_id])
  @@index([caregiver_id])
  @@index([job_id])
}

enum CareLogType {
  CHECK_IN
  VITALS
  MEDICATION
  MEAL
  ACTIVITY
  INCIDENT
  CHECK_OUT
}
```

---

## 📋 Data Structures

### **Vitals Structure**

```typescript
interface VitalsData {
  bloodPressure?: {
    systolic: number;      // 90-180 mmHg
    diastolic: number;     // 60-120 mmHg
  };
  heartRate?: number;      // 40-120 bpm
  temperature?: number;    // 35-41 °C
  oxygenSaturation?: number; // 85-100 %
  respiratoryRate?: number;  // 12-25 breaths/min
  bloodSugar?: number;     // mg/dL
  weight?: number;         // kg
}
```

### **Activities Structure**

```typescript
interface ActivityData {
  activityType: 'walking' | 'exercise' | 'therapy' | 'entertainment' | 'personal_care';
  duration: number;        // minutes
  intensity?: 'light' | 'moderate' | 'vigorous';
  notes?: string;
}

interface MealData {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: string[];
  time: string;            // HH:mm
  consumed: string;        // e.g., "75%", "all", "half"
  notes?: string;
}
```

### **Incident Structure**

```typescript
interface IncidentData {
  type: 'fall' | 'medication_error' | 'behavioral' | 'equipment' | 'other';
  severity: 'minor' | 'moderate' | 'severe';
  actionTaken: string;
  emergencyContact: boolean;  // Was emergency contact called?
  witnessPresent?: boolean;
}
```

---

## 🔄 Auto-Notification Rules

### **Notification Triggers**

```typescript
const notificationRules = {
  CHECK_IN: {
    notify: false,
    reason: 'Routine arrival'
  },
  VITALS: {
    notify: true,
    condition: 'Always notify on vitals',
    urgency: 'normal'
  },
  MEDICATION: {
    notify: true,
    condition: 'Medication administration',
    urgency: 'normal'
  },
  MEAL: {
    notify: false,
    reason: 'Routine meal log'
  },
  ACTIVITY: {
    notify: false,
    reason: 'Routine activity'
  },
  INCIDENT: {
    notify: true,
    condition: 'Immediate notification required',
    urgency: 'high'
  },
  CHECK_OUT: {
    notify: true,
    condition: 'End of shift summary',
    urgency: 'normal'
  }
};
```

### **Implementation**

```typescript
async notifyGuardian(log: care_logs, job: jobs) {
  const shouldNotify = [
    CareLogType.VITALS,
    CareLogType.MEDICATION,
    CareLogType.INCIDENT,
    CareLogType.CHECK_OUT
  ].includes(log.log_type);
  
  if (shouldNotify) {
    const urgency = log.log_type === CareLogType.INCIDENT ? 'high' : 'normal';
    
    await this.notificationsService.create(
      job.guardian_id,
      `${log.log_type} Log`,
      log.notes || `Caregiver logged ${log.log_type}`,
      urgency
    );
    
    // Mark as notified
    await this.prisma.care_logs.update({
      where: { id: log.id },
      data: { guardian_notified: true }
    });
  }
}
```

---

## 🧪 Testing

### **Unit Tests**

```typescript
describe('CareLogsService', () => {
  describe('create', () => {
    it('should create care log', async () => {
      const result = await service.create(caregiverId, jobId, createDto);
      
      expect(result.log_type).toBe('VITALS');
      expect(result.caregiver_id).toBe(caregiverId);
      expect(result.timestamp).toBeDefined();
    });
    
    it('should throw error if job not found', async () => {
      await expect(
        service.create(caregiverId, invalidJobId, createDto)
      ).rejects.toThrow('Job not found');
    });
    
    it('should throw error if caregiver not assigned', async () => {
      await expect(
        service.create(unassignedCaregiverId, jobId, createDto)
      ).rejects.toThrow('Assignment not found');
    });
  });
  
  describe('update', () => {
    it('should update log within 1 hour', async () => {
      const result = await service.update(logId, updateDto);
      
      expect(result.notes).toBe(updateDto.notes);
    });
    
    it('should reject update after 1 hour', async () => {
      // Create log with createdAt = 2 hours ago
      const oldLog = await createOldLog();
      
      await expect(
        service.update(oldLog.id, updateDto)
      ).rejects.toThrow('Edit window expired');
    });
  });
  
  describe('findByJob', () => {
    it('should return logs ordered by timestamp desc', async () => {
      const result = await service.findByJob(jobId);
      
      expect(result).toBeInstanceOf(Array);
      expect(result[0].timestamp >= result[1].timestamp).toBe(true);
    });
  });
});
```

### **E2E Tests**

```typescript
describe('Care Logs API', () => {
  it('POST /care-logs - create vitals log', () => {
    return request(app.getHttpServer())
      .post('/care-logs')
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send({
        job_id: jobId,
        log_type: 'VITALS',
        vitals: {
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 72
        },
        notes: 'Vitals normal'
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.log_type).toBe('VITALS');
        expect(res.body.vitals).toBeDefined();
      });
  });
  
  it('GET /care-logs/job/:jobId - get job logs', () => {
    return request(app.getHttpServer())
      .get(`/care-logs/job/${jobId}`)
      .set('Authorization', `Bearer ${guardianToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });
  
  it('PATCH /care-logs/:id - update log', () => {
    return request(app.getHttpServer())
      .patch(`/care-logs/${logId}`)
      .set('Authorization', `Bearer ${caregiverToken}`)
      .send({
        notes: 'Updated notes'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.notes).toBe('Updated notes');
      });
  });
});
```

---

## 🔒 Security & Permissions

### **Authorization Checks**

```typescript
// Caregiver can only create logs for jobs they're assigned to
async create(caregiverId: string, jobId: string, data: CreateCareLogDto) {
  const assignment = await this.prisma.assignments.findFirst({
    where: {
      job_id: jobId,
      caregiver_id: caregiverId,
      status: AssignmentStatus.ACTIVE
    }
  });
  
  if (!assignment) {
    throw new ForbiddenException('Not assigned to this job');
  }
  
  // Create log
}

// Guardian can view logs for their jobs only
async findByJob(jobId: string, requesterId: string) {
  const job = await this.prisma.jobs.findUnique({
    where: { id: jobId }
  });
  
  if (job.guardian_id !== requesterId) {
    throw new ForbiddenException('Not authorized');
  }
  
  return this.prisma.care_logs.findMany({ where: { job_id: jobId } });
}
```

---

## 🔧 Environment Variables

```env
# Care Logs Configuration
LOG_EDIT_WINDOW_HOURS=1
AUTO_NOTIFY_GUARDIAN=true
REQUIRE_GPS_LOCATION=false
MAX_PHOTO_UPLOADS=5
PHOTO_MAX_SIZE_MB=10
```

---

## 📈 Analytics & Reports

### **Daily Care Summary**

```typescript
async getDailySummary(jobId: string, date: string) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const logs = await this.prisma.care_logs.findMany({
    where: {
      job_id: jobId,
      timestamp: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    orderBy: { timestamp: 'asc' }
  });
  
  return {
    date,
    totalLogs: logs.length,
    logsByType: {
      checkIn: logs.filter(l => l.log_type === 'CHECK_IN').length,
      vitals: logs.filter(l => l.log_type === 'VITALS').length,
      medication: logs.filter(l => l.log_type === 'MEDICATION').length,
      meals: logs.filter(l => l.log_type === 'MEAL').length,
      activities: logs.filter(l => l.log_type === 'ACTIVITY').length,
      incidents: logs.filter(l => l.log_type === 'INCIDENT').length,
      checkOut: logs.filter(l => l.log_type === 'CHECK_OUT').length
    },
    timeline: logs
  };
}
```

---

## 📚 Related Documentation

- [02 Backend 05.md](02%20Backend%2005.md) - Jobs & Assignments
- [02 Backend 06.md](02%20Backend%2006.md) - Patients
- [02 Backend 15.md](02%20Backend%2015.md) - Notifications
- [Backend Development Plan](Backend_Development_Plan.md)

---

## 🎓 Best Practices

1. **Log frequently** - Encourage caregivers to log every significant activity
2. **Use structured data** - Prefer vitals/activities JSON over free-text
3. **Attach photos** - Visual evidence increases trust
4. **Auto-notify on incidents** - Guardian should know immediately
5. **Timeline view** - Present logs chronologically for easy review
6. **Edit window** - Allow 1-hour edit window for corrections
7. **GPS tracking** - Optional but recommended for check-in/out
8. **Validate vitals** - Ensure values are within reasonable ranges

---

**Last Updated**: December 11, 2025  
**Document Version**: 2.0  
**Next Review**: January 11, 2026
