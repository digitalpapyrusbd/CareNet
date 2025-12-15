# Backend Documentation 04 - Caregiver Management

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Module**: Caregivers  
**Priority**: 🔴 Critical

---

## 📋 Overview

This document covers the **Caregiver Management** system, which handles caregiver profiles, skills, certifications, availability, GPS tracking, earnings, and performance metrics.

### **Module Covered**
- **Caregivers Module** - Profile creation, verification, availability, GPS tracking, performance

### **Key Features**
- Caregiver profile creation with NID verification
- Skills and certifications management
- Dynamic availability calendar
- Real-time GPS location tracking
- Earnings and payout tracking
- Performance metrics and ratings
- Background check integration
- Job application management

---

## 👨‍⚕️ Caregivers Module

**Path**: `/backend/src/caregivers/`

### **Module Files**
```
caregivers/
├── caregivers.module.ts         # Module configuration
├── caregivers.service.ts        # Business logic
├── caregivers.controller.ts     # HTTP endpoints
├── caregivers.service.spec.ts   # Unit tests
└── dto/
    ├── caregiver.dto.ts         # Create/Update DTOs
    ├── availability.dto.ts       # Availability calendar
    └── location.dto.ts           # GPS tracking
```

---

## 🎯 Core Caregiver Features

### **1. Caregiver Profile Creation**

#### **Create Caregiver Profile**
```typescript
POST /api/caregivers

Authorization: Bearer {accessToken}
Request Body:
{
  "nid": "1234567890123",
  "nid_url": "https://r2.example.com/nid/front-back.pdf",
  "photo_url": "https://r2.example.com/photos/caregiver.jpg",
  "date_of_birth": "1990-05-15",
  "gender": "FEMALE",
  "address": "456 Mirpur Road, Dhaka 1216",
  "skills": ["ELDERLY_CARE", "MEDICATION_ADMIN", "MOBILITY_ASSISTANCE"],
  "certifications": [
    {
      "name": "Basic Life Support (BLS)",
      "issuer": "Bangladesh Medical Association",
      "issued_date": "2023-01-15",
      "expiry_date": "2026-01-15",
      "certificate_url": "https://r2.example.com/certs/bls.pdf"
    }
  ],
  "experience_years": 5,
  "languages": ["bn", "en"],
  "hourly_rate": 200.00,
  "company_id": "comp_abc123"
}

Response:
{
  "success": true,
  "data": {
    "id": "care_001",
    "userId": "user_xyz",
    "nid": "1234567890123",
    "photo_url": "https://r2.example.com/photos/caregiver.jpg",
    "experience_years": 5,
    "hourly_rate": "200.00",
    "rating_avg": "0.0",
    "rating_count": 0,
    "is_available": true,
    "is_verified": false,
    "background_check_status": "PENDING",
    "created_at": "2025-12-11T10:00:00Z"
  }
}
```

**Implementation**:
```typescript
// File: caregivers.service.ts - create()

async create(userId: string, createCaregiverDto: CreateCaregiverDto) {
  // Check if profile already exists
  const existing = await this.prisma.caregivers.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new BadRequestException('Caregiver profile already exists');
  }

  // Validate NID uniqueness
  const nidExists = await this.prisma.caregivers.findUnique({
    where: { nid: createCaregiverDto.nid },
  });

  if (nidExists) {
    throw new BadRequestException('NID already registered');
  }

  // Update user role to CAREGIVER
  await this.prisma.users.update({
    where: { id: userId },
    data: { role: UserRole.CAREGIVER },
  });

  // Create caregiver profile
  const caregiver = await this.prisma.caregivers.create({
    data: {
      userId,
      nid: createCaregiverDto.nid,
      nid_url: createCaregiverDto.nid_url,
      photo_url: createCaregiverDto.photo_url,
      date_of_birth: new Date(createCaregiverDto.date_of_birth),
      gender: createCaregiverDto.gender,
      address: createCaregiverDto.address,
      skills: createCaregiverDto.skills,
      certifications: createCaregiverDto.certifications || [],
      experience_years: createCaregiverDto.experience_years || 0,
      languages: createCaregiverDto.languages || ['bn'],
      hourly_rate: createCaregiverDto.hourly_rate,
      company_id: createCaregiverDto.company_id,
      is_available: true,
      is_verified: false,
      background_check_status: BackgroundCheckStatus.PENDING,
    },
  });

  // Trigger background check process
  await this.verificationService.initiateBackgroundCheck(caregiver.id);

  return caregiver;
}
```

**Business Rules**:
- ✅ One profile per user
- ✅ NID must be unique across all caregivers
- ✅ Automatic role upgrade to `CAREGIVER`
- ✅ Default availability: `true`
- ✅ Default verification status: `false`
- ✅ Background check auto-initiated on creation
- ✅ Company association optional (independent caregivers allowed)

---

### **2. Get All Caregivers (Search & Filter)**

#### **List Caregivers with Advanced Filters**
```typescript
GET /api/caregivers?page=1&limit=20&isVerified=true&isAvailable=true&skills=ELDERLY_CARE,NURSING&location=23.8103,90.4125&radius=10

Response:
{
  "success": true,
  "data": [
    {
      "id": "care_001",
      "userId": "user_xyz",
      "photo_url": "https://r2.example.com/photos/caregiver.jpg",
      "experience_years": 5,
      "skills": ["ELDERLY_CARE", "MEDICATION_ADMIN", "MOBILITY_ASSISTANCE"],
      "languages": ["bn", "en"],
      "hourly_rate": "200.00",
      "rating_avg": "4.9",
      "rating_count": 89,
      "total_jobs_completed": 156,
      "is_available": true,
      "is_verified": true,
      "background_check_status": "CLEARED",
      "location_lat": "23.8103",
      "location_lng": "90.4125",
      "users": {
        "name": "Fatima Rahman",
        "phone": "+8801812345678"
      },
      "companies": {
        "company_name": "Premium Care Services Ltd."
      }
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

**Implementation with Geographic Search**:
```typescript
// File: caregivers.service.ts - findAll()

async findAll(
  page: number = 1,
  limit: number = 20,
  filters?: {
    isVerified?: boolean;
    isAvailable?: boolean;
    skills?: string[];
    location?: { lat: number; lng: number };
    radius?: number; // in km
    minRating?: number;
  }
) {
  const skip = (page - 1) * limit;
  const where: Prisma.caregiversWhereInput = { 
    deleted_at: null 
  };

  // Filter by verification status
  if (filters?.isVerified !== undefined) {
    where.is_verified = filters.isVerified;
  }

  // Filter by availability
  if (filters?.isAvailable !== undefined) {
    where.is_available = filters.isAvailable;
  }

  // Filter by skills (JSON array contains)
  if (filters?.skills && filters.skills.length > 0) {
    where.skills = {
      array_contains: filters.skills,
    };
  }

  // Filter by minimum rating
  if (filters?.minRating) {
    where.rating_avg = {
      gte: filters.minRating,
    };
  }

  let caregivers = await this.prisma.caregivers.findMany({
    where,
    skip,
    take: limit,
    include: {
      users: {
        select: { name: true, phone: true },
      },
      companies: {
        select: { company_name: true },
      },
    },
    orderBy: { rating_avg: 'desc' },
  });

  // Geographic filtering (if location provided)
  if (filters?.location && filters?.radius) {
    caregivers = this.filterByDistance(
      caregivers,
      filters.location,
      filters.radius
    );
  }

  const total = await this.prisma.caregivers.count({ where });

  return {
    data: caregivers,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// Haversine formula for distance calculation
private filterByDistance(
  caregivers: any[],
  center: { lat: number; lng: number },
  radiusKm: number
): any[] {
  return caregivers.filter(caregiver => {
    if (!caregiver.location_lat || !caregiver.location_lng) return false;

    const distance = this.calculateDistance(
      center.lat,
      center.lng,
      Number(caregiver.location_lat),
      Number(caregiver.location_lng)
    );

    return distance <= radiusKm;
  });
}

private calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = this.toRad(lat2 - lat1);
  const dLon = this.toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRad(lat1)) *
    Math.cos(this.toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

private toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
```

---

### **3. Get Caregiver Profile Details**

#### **Fetch Complete Profile**
```typescript
GET /api/caregivers/:id

Response:
{
  "success": true,
  "data": {
    "id": "care_001",
    "userId": "user_xyz",
    "nid": "1234567890123",
    "nid_url": "https://r2.example.com/nid/front-back.pdf",
    "photo_url": "https://r2.example.com/photos/caregiver.jpg",
    "date_of_birth": "1990-05-15",
    "gender": "FEMALE",
    "address": "456 Mirpur Road, Dhaka 1216",
    "location_lat": "23.8103",
    "location_lng": "90.4125",
    "skills": ["ELDERLY_CARE", "MEDICATION_ADMIN", "MOBILITY_ASSISTANCE"],
    "certifications": [
      {
        "name": "Basic Life Support (BLS)",
        "issuer": "Bangladesh Medical Association",
        "issued_date": "2023-01-15",
        "expiry_date": "2026-01-15",
        "certificate_url": "https://r2.example.com/certs/bls.pdf"
      }
    ],
    "experience_years": 5,
    "languages": ["bn", "en"],
    "availabilityCalendar": {
      "monday": ["09:00-17:00"],
      "tuesday": ["09:00-17:00"],
      "wednesday": ["09:00-17:00"],
      "thursday": ["09:00-17:00"],
      "friday": ["09:00-17:00"],
      "saturday": ["09:00-13:00"],
      "sunday": []
    },
    "hourly_rate": "200.00",
    "background_check_status": "CLEARED",
    "background_check_date": "2025-01-10T00:00:00Z",
    "rating_avg": "4.9",
    "rating_count": 89,
    "total_jobs_completed": 156,
    "is_available": true,
    "is_verified": true,
    "created_at": "2024-06-01T08:00:00Z",
    "updated_at": "2025-12-11T10:00:00Z",
    "users": {
      "name": "Fatima Rahman",
      "phone": "+8801812345678",
      "email": "fatima.rahman@example.com"
    },
    "companies": {
      "company_name": "Premium Care Services Ltd."
    }
  }
}
```

---

### **4. Update Caregiver Profile**

#### **Update Profile Information**
```typescript
PATCH /api/caregivers/:id

Authorization: Bearer {caregiverToken}
Request Body:
{
  "address": "New Address, Dhaka 1207",
  "hourly_rate": 250.00,
  "skills": ["ELDERLY_CARE", "MEDICATION_ADMIN", "MOBILITY_ASSISTANCE", "WOUND_CARE"],
  "languages": ["bn", "en", "hi"],
  "is_available": true
}

Response:
{
  "success": true,
  "data": {
    "id": "care_001",
    "address": "New Address, Dhaka 1207",
    "hourly_rate": "250.00",
    "skills": ["ELDERLY_CARE", "MEDICATION_ADMIN", "MOBILITY_ASSISTANCE", "WOUND_CARE"],
    "languages": ["bn", "en", "hi"],
    "is_available": true,
    "updated_at": "2025-12-11T11:00:00Z"
  }
}
```

**Implementation with Authorization**:
```typescript
// File: caregivers.service.ts - update()

async update(
  id: string,
  userId: string,
  updateCaregiverDto: UpdateCaregiverDto
) {
  const caregiver = await this.prisma.caregivers.findUnique({
    where: { id },
  });

  if (!caregiver || caregiver.deleted_at) {
    throw new NotFoundException('Caregiver not found');
  }

  // Authorization: Only owner can update
  if (caregiver.userId !== userId) {
    throw new ForbiddenException('You can only update your own profile');
  }

  // If changing hourly rate, validate range
  if (updateCaregiverDto.hourly_rate) {
    if (updateCaregiverDto.hourly_rate < 100 || updateCaregiverDto.hourly_rate > 1000) {
      throw new BadRequestException('Hourly rate must be between ৳100 and ৳1000');
    }
  }

  const updated = await this.prisma.caregivers.update({
    where: { id },
    data: updateCaregiverDto,
  });

  // Log audit trail
  await this.auditService.log({
    actor_id: userId,
    action_type: 'UPDATE_CAREGIVER_PROFILE',
    entity_type: 'CAREGIVER',
    entity_id: id,
    changes: updateCaregiverDto,
  });

  return updated;
}
```

---

### **5. Availability Calendar Management**

#### **Update Availability Calendar**
```typescript
PATCH /api/caregivers/:id/availability

Authorization: Bearer {caregiverToken}
Request Body:
{
  "availabilityCalendar": {
    "monday": ["09:00-17:00"],
    "tuesday": ["09:00-17:00"],
    "wednesday": ["09:00-17:00", "19:00-22:00"],
    "thursday": ["09:00-17:00"],
    "friday": ["09:00-17:00"],
    "saturday": ["09:00-13:00"],
    "sunday": []
  }
}

Response:
{
  "success": true,
  "data": {
    "id": "care_001",
    "availabilityCalendar": {
      "monday": ["09:00-17:00"],
      "tuesday": ["09:00-17:00"],
      "wednesday": ["09:00-17:00", "19:00-22:00"],
      "thursday": ["09:00-17:00"],
      "friday": ["09:00-17:00"],
      "saturday": ["09:00-13:00"],
      "sunday": []
    },
    "updated_at": "2025-12-11T11:30:00Z"
  }
}
```

#### **Check Availability for Specific Time**
```typescript
GET /api/caregivers/:id/check-availability?date=2025-12-15&time=14:00

Response:
{
  "success": true,
  "available": true,
  "message": "Caregiver is available on 2025-12-15 at 14:00"
}
```

**Implementation**:
```typescript
// File: caregivers.service.ts - updateAvailability()

async updateAvailability(
  id: string,
  userId: string,
  availabilityDto: UpdateAvailabilityDto
) {
  const caregiver = await this.prisma.caregivers.findUnique({
    where: { id },
  });

  if (!caregiver || caregiver.userId !== userId) {
    throw new ForbiddenException('Access denied');
  }

  // Validate time slot format
  this.validateAvailabilityFormat(availabilityDto.availabilityCalendar);

  return this.prisma.caregivers.update({
    where: { id },
    data: {
      availabilityCalendar: availabilityDto.availabilityCalendar,
    },
  });
}

private validateAvailabilityFormat(calendar: any): void {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const timeSlotRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]-([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

  for (const day of days) {
    if (calendar[day]) {
      for (const slot of calendar[day]) {
        if (!timeSlotRegex.test(slot)) {
          throw new BadRequestException(`Invalid time format for ${day}: ${slot}`);
        }
      }
    }
  }
}

async checkAvailability(
  id: string,
  date: string,
  time: string
): Promise<boolean> {
  const caregiver = await this.prisma.caregivers.findUnique({
    where: { id },
  });

  if (!caregiver || !caregiver.is_available) {
    return false;
  }

  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const calendar = caregiver.availabilityCalendar as any;

  if (!calendar[dayOfWeek] || calendar[dayOfWeek].length === 0) {
    return false;
  }

  // Check if time falls within any available slot
  for (const slot of calendar[dayOfWeek]) {
    const [start, end] = slot.split('-');
    if (this.isTimeInRange(time, start, end)) {
      return true;
    }
  }

  return false;
}

private isTimeInRange(time: string, start: string, end: string): boolean {
  const timeMinutes = this.timeToMinutes(time);
  const startMinutes = this.timeToMinutes(start);
  const endMinutes = this.timeToMinutes(end);
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

private timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
```

---

### **6. GPS Location Tracking**

#### **Update GPS Location**
```typescript
PATCH /api/caregivers/:id/location

Authorization: Bearer {caregiverToken}
Request Body:
{
  "location_lat": 23.8103,
  "location_lng": 90.4125,
  "timestamp": "2025-12-11T12:00:00Z"
}

Response:
{
  "success": true,
  "data": {
    "id": "care_001",
    "location_lat": "23.8103",
    "location_lng": "90.4125",
    "updated_at": "2025-12-11T12:00:00Z"
  }
}
```

#### **Get Nearby Caregivers**
```typescript
GET /api/caregivers/nearby?lat=23.8103&lng=90.4125&radius=5&limit=10

Response:
{
  "success": true,
  "data": [
    {
      "id": "care_001",
      "name": "Fatima Rahman",
      "photo_url": "https://r2.example.com/photos/caregiver.jpg",
      "distance_km": 1.2,
      "rating_avg": "4.9",
      "hourly_rate": "200.00",
      "is_available": true
    }
  ]
}
```

**Implementation**:
```typescript
// File: caregivers.service.ts - updateLocation()

async updateLocation(
  id: string,
  userId: string,
  locationDto: UpdateLocationDto
) {
  const caregiver = await this.prisma.caregivers.findUnique({
    where: { id },
  });

  if (!caregiver || caregiver.userId !== userId) {
    throw new ForbiddenException('Access denied');
  }

  return this.prisma.caregivers.update({
    where: { id },
    data: {
      location_lat: locationDto.location_lat,
      location_lng: locationDto.location_lng,
    },
  });
}

async getNearby(
  lat: number,
  lng: number,
  radiusKm: number = 10,
  limit: number = 20
) {
  // Fetch all available and verified caregivers with location
  const caregivers = await this.prisma.caregivers.findMany({
    where: {
      is_available: true,
      is_verified: true,
      location_lat: { not: null },
      location_lng: { not: null },
      deleted_at: null,
    },
    include: {
      users: {
        select: { name: true },
      },
    },
  });

  // Calculate distances and filter by radius
  const nearby = caregivers
    .map(caregiver => {
      const distance = this.calculateDistance(
        lat,
        lng,
        Number(caregiver.location_lat),
        Number(caregiver.location_lng)
      );

      return {
        ...caregiver,
        distance_km: Math.round(distance * 10) / 10,
      };
    })
    .filter(c => c.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);

  return nearby;
}
```

---

### **7. Earnings & Payouts**

#### **Get Caregiver Earnings**
```typescript
GET /api/caregivers/:id/earnings?month=2025-12

Authorization: Bearer {caregiverToken}

Response:
{
  "success": true,
  "data": {
    "caregiver_id": "care_001",
    "month": "2025-12",
    "total_jobs": 18,
    "completed_jobs": 16,
    "total_earnings": "32000.00",
    "platform_deductions": "3200.00",
    "net_earnings": "28800.00",
    "pending_payouts": "5000.00",
    "paid_out": "23800.00",
    "breakdown": [
      {
        "job_id": "job_001",
        "patient_name": "Mr. Rahman",
        "start_date": "2025-12-01",
        "end_date": "2025-12-05",
        "earnings": "2000.00",
        "status": "PAID"
      }
    ]
  }
}
```

#### **Request Payout**
```typescript
POST /api/caregivers/:id/request-payout

Authorization: Bearer {caregiverToken}
Request Body:
{
  "amount": 5000.00,
  "payout_method": "BKASH",
  "account_number": "01812345678"
}

Response:
{
  "success": true,
  "data": {
    "payout_id": "payout_001",
    "amount": "5000.00",
    "status": "PENDING",
    "requested_at": "2025-12-11T12:00:00Z",
    "estimated_processing_time": "2-3 business days"
  }
}
```

---

### **8. Performance Metrics**

#### **Get Performance Dashboard**
```typescript
GET /api/caregivers/:id/performance

Authorization: Bearer {caregiverToken}

Response:
{
  "success": true,
  "data": {
    "caregiver_id": "care_001",
    "overall_rating": "4.9",
    "total_reviews": 89,
    "total_jobs_completed": 156,
    "completion_rate": "97.5",
    "on_time_check_in_rate": "98.2",
    "average_response_time_minutes": 12,
    "specialization_breakdown": {
      "ELDERLY_CARE": { "jobs": 89, "rating": "4.9" },
      "MEDICATION_ADMIN": { "jobs": 45, "rating": "5.0" },
      "MOBILITY_ASSISTANCE": { "jobs": 22, "rating": "4.8" }
    },
    "monthly_performance": [
      {
        "month": "2025-11",
        "jobs_completed": 14,
        "rating": "4.9",
        "earnings": "28000.00"
      },
      {
        "month": "2025-12",
        "jobs_completed": 16,
        "rating": "4.9",
        "earnings": "32000.00"
      }
    ],
    "badges": ["TOP_RATED", "VERIFIED", "EXPERIENCED"]
  }
}
```

---

### **9. Skills & Certifications Management**

#### **Add Certification**
```typescript
POST /api/caregivers/:id/certifications

Authorization: Bearer {caregiverToken}
Request Body:
{
  "name": "Advanced Cardiac Life Support (ACLS)",
  "issuer": "Bangladesh Medical Association",
  "issued_date": "2025-11-01",
  "expiry_date": "2028-11-01",
  "certificate_url": "https://r2.example.com/certs/acls.pdf"
}

Response:
{
  "success": true,
  "data": {
    "id": "care_001",
    "certifications": [
      {
        "name": "Basic Life Support (BLS)",
        "issuer": "Bangladesh Medical Association",
        "issued_date": "2023-01-15",
        "expiry_date": "2026-01-15",
        "certificate_url": "https://r2.example.com/certs/bls.pdf"
      },
      {
        "name": "Advanced Cardiac Life Support (ACLS)",
        "issuer": "Bangladesh Medical Association",
        "issued_date": "2025-11-01",
        "expiry_date": "2028-11-01",
        "certificate_url": "https://r2.example.com/certs/acls.pdf"
      }
    ]
  }
}
```

#### **Update Skills**
```typescript
PATCH /api/caregivers/:id/skills

Authorization: Bearer {caregiverToken}
Request Body:
{
  "skills": [
    "ELDERLY_CARE",
    "MEDICATION_ADMIN",
    "MOBILITY_ASSISTANCE",
    "WOUND_CARE",
    "DEMENTIA_CARE"
  ]
}

Response:
{
  "success": true,
  "data": {
    "id": "care_001",
    "skills": [
      "ELDERLY_CARE",
      "MEDICATION_ADMIN",
      "MOBILITY_ASSISTANCE",
      "WOUND_CARE",
      "DEMENTIA_CARE"
    ],
    "updated_at": "2025-12-11T13:00:00Z"
  }
}
```

---

### **10. Background Check Status**

#### **Get Background Check Details**
```typescript
GET /api/caregivers/:id/background-check

Authorization: Bearer {caregiverToken}

Response:
{
  "success": true,
  "data": {
    "caregiver_id": "care_001",
    "background_check_status": "CLEARED",
    "background_check_date": "2025-01-10T00:00:00Z",
    "checks_performed": [
      {
        "type": "CRIMINAL_RECORD",
        "status": "CLEARED",
        "checked_date": "2025-01-08"
      },
      {
        "type": "EMPLOYMENT_VERIFICATION",
        "status": "CLEARED",
        "checked_date": "2025-01-09"
      },
      {
        "type": "REFERENCE_CHECK",
        "status": "CLEARED",
        "checked_date": "2025-01-10"
      }
    ],
    "next_check_due": "2026-01-10"
  }
}
```

---

## 📦 DTOs (Data Transfer Objects)

### **CreateCaregiverDto**
```typescript
// File: dto/caregiver.dto.ts

import { IsString, IsDate, IsEnum, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { Gender } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateCaregiverDto {
  @IsString()
  nid: string;

  @IsString()
  nid_url: string;

  @IsString()
  photo_url: string;

  @IsDate()
  @Type(() => Date)
  date_of_birth: Date;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  address: string;

  @IsArray()
  skills: string[];

  @IsArray()
  @IsOptional()
  certifications?: any[];

  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @IsArray()
  @IsOptional()
  languages?: string[];

  @IsNumber()
  @IsOptional()
  hourly_rate?: number;

  @IsString()
  @IsOptional()
  company_id?: string;
}
```

### **UpdateCaregiverDto**
```typescript
export class UpdateCaregiverDto {
  @IsString()
  @IsOptional()
  address?: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsOptional()
  languages?: string[];

  @IsNumber()
  @IsOptional()
  hourly_rate?: number;

  @IsBoolean()
  @IsOptional()
  is_available?: boolean;
}
```

### **UpdateLocationDto**
```typescript
export class UpdateLocationDto {
  @IsNumber()
  location_lat: number;

  @IsNumber()
  location_lng: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  timestamp?: Date;
}
```

### **UpdateAvailabilityDto**
```typescript
export class UpdateAvailabilityDto {
  @IsObject()
  availabilityCalendar: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
}
```

---

## 🗄️ Database Schema

### **caregivers Table**
```sql
CREATE TABLE caregivers (
  id                      VARCHAR(25) PRIMARY KEY,
  userId                  VARCHAR(25) UNIQUE NOT NULL,
  company_id              VARCHAR(25),
  nid                     VARCHAR(20) UNIQUE NOT NULL,
  nid_url                 TEXT NOT NULL,
  photo_url               TEXT NOT NULL,
  date_of_birth           DATE NOT NULL,
  gender                  VARCHAR(10) NOT NULL,
  address                 TEXT NOT NULL,
  location_lat            DECIMAL(10,8),
  location_lng            DECIMAL(11,8),
  skills                  JSONB NOT NULL,
  certifications          JSONB,
  experience_years        INTEGER DEFAULT 0,
  languages               JSONB DEFAULT '["bn"]',
  availabilityCalendar    JSONB,
  hourly_rate             DECIMAL(10,2),
  background_check_status VARCHAR(20) DEFAULT 'PENDING',
  background_check_date   TIMESTAMP,
  rating_avg              DECIMAL(3,2) DEFAULT 0.0,
  rating_count            INTEGER DEFAULT 0,
  total_jobs_completed    INTEGER DEFAULT 0,
  is_available            BOOLEAN DEFAULT TRUE,
  is_verified             BOOLEAN DEFAULT FALSE,
  deleted_at              TIMESTAMP,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  INDEX idx_skills (skills),
  INDEX idx_rating_avg (rating_avg),
  INDEX idx_is_verified_is_available (is_verified, is_available),
  INDEX idx_company_id (company_id),
  INDEX idx_location (location_lat, location_lng)
);
```

---

## 🧪 Testing

### **Unit Tests**
```typescript
describe('CaregiversService', () => {
  describe('create', () => {
    it('should create caregiver profile', async () => {
      const result = await service.create(userId, createDto);
      expect(result.nid).toBe('1234567890123');
      expect(result.is_verified).toBe(false);
    });

    it('should throw error if NID already exists', async () => {
      await expect(service.create(userId, createDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should update user role to CAREGIVER', async () => {
      await service.create(userId, createDto);
      const user = await prisma.users.findUnique({ where: { id: userId } });
      expect(user.role).toBe(UserRole.CAREGIVER);
    });
  });

  describe('findAll with filters', () => {
    it('should filter by skills', async () => {
      const result = await service.findAll(1, 20, { 
        skills: ['ELDERLY_CARE'] 
      });
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should filter by location radius', async () => {
      const result = await service.findAll(1, 20, {
        location: { lat: 23.8103, lng: 90.4125 },
        radius: 10
      });
      expect(result.data.every(c => c.distance_km <= 10)).toBe(true);
    });
  });

  describe('updateAvailability', () => {
    it('should update availability calendar', async () => {
      const result = await service.updateAvailability(id, userId, availabilityDto);
      expect(result.availabilityCalendar).toBeDefined();
    });

    it('should validate time slot format', async () => {
      await expect(service.updateAvailability(id, userId, invalidDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('checkAvailability', () => {
    it('should return true for available time slot', async () => {
      const result = await service.checkAvailability(id, '2025-12-15', '14:00');
      expect(result).toBe(true);
    });

    it('should return false for unavailable time', async () => {
      const result = await service.checkAvailability(id, '2025-12-15', '23:00');
      expect(result).toBe(false);
    });
  });
});
```

---

## 🚀 API Usage Examples

### **Complete Caregiver Onboarding (React)**
```javascript
const CaregiverOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleSubmit = async () => {
    // Upload NID document
    const nidUrl = await uploadFile(nidFile);
    const photoUrl = await uploadFile(photoFile);

    // Create caregiver profile
    const response = await fetch('/api/caregivers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        ...formData,
        nid_url: nidUrl,
        photo_url: photoUrl
      })
    });

    const result = await response.json();
    console.log('Profile created:', result.data.id);
    router.push('/caregiver/dashboard');
  };

  return (
    <OnboardingFlow
      currentStep={step}
      onStepChange={setStep}
      onComplete={handleSubmit}
    />
  );
};
```

---

## 📚 Related Documentation

- [02 Backend 01.md](02%20Backend%2001.md) - Architecture & Project Structure
- [02 Backend 03.md](02%20Backend%2003.md) - Companies & Agency Management
- [02 Backend 07.md](02%20Backend%2007.md) - Job Lifecycle Management
- [02 Backend 08.md](02%20Backend%2008.md) - Verification System
- [02 Backend 11.md](02%20Backend%2011.md) - Care Logging System

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
