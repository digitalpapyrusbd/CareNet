# Backend Documentation 03 - Companies & Agency Management

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Module**: Companies  
**Priority**: 🔴 Critical

---

## 📋 Overview

This document covers the **Companies & Agency Management** system, which manages care agencies, their verification, service zones, caregiver rosters, and commission structures.

### **Module Covered**
- **Companies Module** - Agency registration, verification, service zones, caregiver management

### **Key Features**
- Company registration with trade license
- 2-step agency verification process
- Service zone management (geographic coverage)
- Agency admin and manager roles
- Caregiver roster management
- Commission rate configuration
- Subscription tier management
- Agency ratings and reviews

---

## 🏢 Companies Module

**Path**: `/backend/src/companies/`

### **Module Files**
```
companies/
├── companies.module.ts          # Module configuration
├── companies.service.ts         # Business logic (363 lines)
├── companies.controller.ts      # HTTP endpoints
├── companies.service.spec.ts    # Unit tests
└── dto/
    ├── company.dto.ts           # Company creation/update
    ├── verify-company.dto.ts    # Verification DTO
    └── service-zone.dto.ts      # Service zone management
```

---

## 🎯 Core Company Features

### **1. Company Registration**

#### **Create Company (Agency Registration)**
```typescript
POST /api/companies

Authorization: Bearer {accessToken}
Request Body:
{
  "company_name": "Premium Care Services Ltd.",
  "trade_license": "TRAD-2024-12345",
  "trade_license_url": "https://r2.example.com/trade-license.pdf",
  "tin": "123456789012",
  "contact_person": "Ahmed Hassan",
  "contact_phone": "+8801712345678",
  "contact_email": "info@premiumcare.com",
  "address": "123 Gulshan Avenue, Dhaka 1212",
  "description": "Providing premium elderly care services since 2020",
  "specializations": ["ELDERLY_CARE", "POST_SURGERY", "NURSING"],
  "payout_method": "BANK_TRANSFER",
  "payout_account": "1234567890123"
}

Response:
{
  "success": true,
  "data": {
    "id": "comp_abc123",
    "company_name": "Premium Care Services Ltd.",
    "is_verified": false,
    "subscription_tier": "STARTER",
    "commission_rate": "12.00",
    "rating_avg": "0.0",
    "rating_count": 0,
    "created_at": "2025-12-11T10:00:00Z",
    "users": {
      "id": "user_xyz",
      "name": "Ahmed Hassan",
      "phone": "+8801712345678",
      "email": "info@premiumcare.com"
    }
  }
}
```

**Implementation Details**:
```typescript
// File: companies.service.ts - create()

async create(userId: string, createCompanyDto: CreateCompanyDto) {
  // 1. Check if user already has a company
  const existingCompany = await this.prisma.companies.findUnique({
    where: { userId },
  });

  if (existingCompany) {
    throw new BadRequestException('User already has a company registered');
  }

  // 2. Update user role to AGENCY_ADMIN
  await this.prisma.users.update({
    where: { id: userId },
    data: { role: UserRole.AGENCY_ADMIN },
  });

  // 3. Create company record
  const company = await this.prisma.companies.create({
    data: {
      userId,
      ...createCompanyDto,
      specializations: createCompanyDto.specializations || [],
      commission_rate: 12.00, // Default 12%
      subscription_tier: SubscriptionTier.STARTER,
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      },
    },
  });

  return company;
}
```

**Business Rules**:
- ✅ One company per user (agency admin)
- ✅ Automatic role upgrade to `AGENCY_ADMIN`
- ✅ Default commission rate: 12%
- ✅ Default subscription tier: `STARTER`
- ✅ Company starts as unverified (`is_verified: false`)
- ✅ Specializations stored as JSON array

---

### **2. Company Verification (2-Step Process)**

#### **Verification Workflow**
```
┌─────────────────────────────────────────────────────┐
│ STEP 1: DOCUMENT SUBMISSION                         │
│ - Trade license upload                              │
│ - TIN certificate                                   │
│ - Contact verification                              │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ STEP 2: MODERATOR REVIEW                            │
│ - Document authenticity check                       │
│ - Business registration verification                │
│ - Recommendation to admin                           │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ STEP 3: ADMIN APPROVAL                              │
│ - Final approval decision                           │
│ - Company activation                                │
│ - Enable package creation                           │
└─────────────────────────────────────────────────────┘
```

#### **Verify Company (Admin Only)**
```typescript
PATCH /api/companies/:id/verify

Authorization: Bearer {adminToken}
Request Body:
{
  "is_verified": true,
  "verification_notes": "All documents verified. Trade license valid until 2026."
}

Response:
{
  "success": true,
  "data": {
    "id": "comp_abc123",
    "company_name": "Premium Care Services Ltd.",
    "is_verified": true,
    "verification_notes": "All documents verified...",
    "updated_at": "2025-12-11T11:00:00Z"
  }
}
```

**Implementation**:
```typescript
// File: companies.service.ts - verify()

async verify(id: string, verifyDto: VerifyCompanyDto) {
  const company = await this.prisma.companies.findUnique({
    where: { id },
  });

  if (!company) {
    throw new NotFoundException('Company not found');
  }

  const updated = await this.prisma.companies.update({
    where: { id },
    data: {
      is_verified: verifyDto.is_verified,
      verification_notes: verifyDto.verification_notes,
    },
  });

  // If verified, send notification to company admin
  if (verifyDto.is_verified) {
    await this.notificationService.send({
      userId: company.userId,
      type: 'COMPANY_VERIFIED',
      message: 'Your company has been verified! You can now create packages.',
    });
  }

  return updated;
}
```

---

### **3. Get All Companies (Public Listing)**

#### **List Companies with Filters**
```typescript
GET /api/companies?page=1&limit=20&isVerified=true&search=premium

Response:
{
  "success": true,
  "data": [
    {
      "id": "comp_abc123",
      "company_name": "Premium Care Services Ltd.",
      "logo_url": "https://r2.example.com/logos/premium-care.png",
      "description": "Providing premium elderly care services since 2020",
      "address": "123 Gulshan Avenue, Dhaka 1212",
      "specializations": ["ELDERLY_CARE", "POST_SURGERY", "NURSING"],
      "rating_avg": "4.8",
      "rating_count": 156,
      "is_verified": true,
      "created_at": "2024-01-15T08:00:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

**Implementation**:
```typescript
// File: companies.service.ts - findAll()

async findAll(
  page: number = 1,
  limit: number = 20,
  isVerified?: boolean,
  search?: string,
) {
  const skip = (page - 1) * limit;

  const where: Prisma.companiesWhereInput = { 
    deleted_at: null 
  };

  // Filter by verification status
  if (isVerified !== undefined) {
    where.is_verified = isVerified;
  }

  // Search by company name or contact person
  if (search) {
    where.OR = [
      { company_name: { contains: search, mode: 'insensitive' } },
      { contact_person: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [companies, total] = await Promise.all([
    this.prisma.companies.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        company_name: true,
        logo_url: true,
        description: true,
        address: true,
        specializations: true,
        rating_avg: true,
        rating_count: true,
        is_verified: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    }),
    this.prisma.companies.count({ where }),
  ]);

  return {
    data: companies,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

---

### **4. Get Company Details**

#### **Fetch Single Company with Stats**
```typescript
GET /api/companies/:id

Response:
{
  "success": true,
  "data": {
    "id": "comp_abc123",
    "company_name": "Premium Care Services Ltd.",
    "trade_license": "TRAD-2024-12345",
    "trade_license_url": "https://r2.example.com/trade-license.pdf",
    "tin": "123456789012",
    "contact_person": "Ahmed Hassan",
    "contact_phone": "+8801712345678",
    "contact_email": "info@premiumcare.com",
    "address": "123 Gulshan Avenue, Dhaka 1212",
    "logo_url": "https://r2.example.com/logos/premium-care.png",
    "description": "Providing premium elderly care services since 2020",
    "specializations": ["ELDERLY_CARE", "POST_SURGERY", "NURSING"],
    "payout_method": "BANK_TRANSFER",
    "payout_account": "1234567890123",
    "commission_rate": "12.00",
    "subscription_tier": "GROWTH",
    "subscription_expires_at": "2026-01-15T00:00:00Z",
    "rating_avg": "4.8",
    "rating_count": 156,
    "is_verified": true,
    "created_at": "2024-01-15T08:00:00Z",
    "updated_at": "2025-12-11T10:00:00Z",
    "users": {
      "id": "user_xyz",
      "name": "Ahmed Hassan",
      "phone": "+8801712345678",
      "email": "info@premiumcare.com"
    },
    "service_zones": [
      {
        "id": "zone_001",
        "zone_name": "Dhaka North",
        "region_code": "DHA-N",
        "is_active": true
      }
    ],
    "_count": {
      "caregivers": 42,
      "packages": 12,
      "jobs": 235
    }
  }
}
```

**Implementation**:
```typescript
// File: companies.service.ts - findOne()

async findOne(id: string) {
  const company = await this.prisma.companies.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      },
      service_zones: true,
      _count: {
        select: {
          caregivers: true,
          packages: true,
          jobs: true,
        },
      },
    },
  });

  if (!company || company.deleted_at) {
    throw new NotFoundException('Company not found');
  }

  return company;
}
```

---

### **5. Update Company Profile**

#### **Update Company Information**
```typescript
PATCH /api/companies/:id

Authorization: Bearer {agencyAdminToken}
Request Body:
{
  "description": "Updated description with new services",
  "contact_email": "newemail@premiumcare.com",
  "logo_url": "https://r2.example.com/logos/new-logo.png",
  "specializations": ["ELDERLY_CARE", "POST_SURGERY", "NURSING", "CHRONIC_ILLNESS"]
}

Response:
{
  "success": true,
  "data": {
    "id": "comp_abc123",
    "company_name": "Premium Care Services Ltd.",
    "description": "Updated description with new services",
    "contact_email": "newemail@premiumcare.com",
    "logo_url": "https://r2.example.com/logos/new-logo.png",
    "specializations": ["ELDERLY_CARE", "POST_SURGERY", "NURSING", "CHRONIC_ILLNESS"],
    "updated_at": "2025-12-11T12:00:00Z"
  }
}
```

**Implementation**:
```typescript
// File: companies.service.ts - update()

async update(id: string, userId: string, updateCompanyDto: UpdateCompanyDto) {
  const company = await this.prisma.companies.findUnique({
    where: { id },
  });

  if (!company || company.deleted_at) {
    throw new NotFoundException('Company not found');
  }

  // Authorization check
  if (company.userId !== userId) {
    throw new ForbiddenException('Only the company owner can update this profile');
  }

  const updated = await this.prisma.companies.update({
    where: { id },
    data: updateCompanyDto,
  });

  return updated;
}
```

---

### **6. Service Zone Management**

#### **Add Service Zone**
```typescript
POST /api/companies/:companyId/service-zones

Authorization: Bearer {agencyAdminToken}
Request Body:
{
  "zone_name": "Dhaka North",
  "region_code": "DHA-N",
  "boundary_geojson": {
    "type": "Polygon",
    "coordinates": [...]
  }
}

Response:
{
  "success": true,
  "data": {
    "id": "zone_001",
    "company_id": "comp_abc123",
    "zone_name": "Dhaka North",
    "region_code": "DHA-N",
    "is_active": true,
    "created_at": "2025-12-11T10:00:00Z"
  }
}
```

#### **Get Company Service Zones**
```typescript
GET /api/companies/:companyId/service-zones

Response:
{
  "success": true,
  "data": [
    {
      "id": "zone_001",
      "zone_name": "Dhaka North",
      "region_code": "DHA-N",
      "is_active": true
    },
    {
      "id": "zone_002",
      "zone_name": "Dhaka South",
      "region_code": "DHA-S",
      "is_active": true
    }
  ]
}
```

**Implementation**:
```typescript
// File: companies.service.ts - addServiceZone()

async addServiceZone(companyId: string, userId: string, zoneDto: CreateServiceZoneDto) {
  const company = await this.prisma.companies.findUnique({
    where: { id: companyId },
  });

  if (!company || company.userId !== userId) {
    throw new ForbiddenException('Access denied');
  }

  const zone = await this.prisma.service_zones.create({
    data: {
      company_id: companyId,
      zone_name: zoneDto.zone_name,
      region_code: zoneDto.region_code,
      boundary_geojson: zoneDto.boundary_geojson,
    },
  });

  return zone;
}
```

---

### **7. Commission Rate Management**

#### **Update Commission Rate (Admin Only)**
```typescript
PATCH /api/companies/:id/commission-rate

Authorization: Bearer {adminToken}
Request Body:
{
  "commission_rate": 10.00
}

Response:
{
  "success": true,
  "data": {
    "id": "comp_abc123",
    "company_name": "Premium Care Services Ltd.",
    "commission_rate": "10.00",
    "updated_at": "2025-12-11T12:00:00Z"
  }
}
```

**Implementation**:
```typescript
// File: companies.service.ts - updateCommissionRate()

async updateCommissionRate(
  id: string,
  commissionRate: number,
  adminId: string
) {
  if (commissionRate < 0 || commissionRate > 30) {
    throw new BadRequestException('Commission rate must be between 0 and 30%');
  }

  const company = await this.prisma.companies.update({
    where: { id },
    data: { commission_rate: commissionRate },
  });

  // Log audit trail
  await this.auditService.log({
    actor_id: adminId,
    action_type: 'UPDATE_COMMISSION_RATE',
    entity_type: 'COMPANY',
    entity_id: id,
    changes: { commission_rate: commissionRate },
  });

  return company;
}
```

---

### **8. Caregiver Roster Management**

#### **Get Company Caregivers**
```typescript
GET /api/companies/:companyId/caregivers?page=1&limit=20&isVerified=true&isAvailable=true

Response:
{
  "success": true,
  "data": [
    {
      "id": "care_001",
      "userId": "user_abc",
      "photo_url": "https://r2.example.com/photos/caregiver1.jpg",
      "experience_years": 5,
      "skills": ["ELDERLY_CARE", "MEDICATION_ADMIN"],
      "rating_avg": "4.9",
      "rating_count": 89,
      "is_available": true,
      "is_verified": true,
      "users": {
        "name": "Fatima Rahman",
        "phone": "+8801812345678"
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

**Implementation**:
```typescript
// File: companies.service.ts - getCaregivers()

async getCaregivers(
  companyId: string,
  page: number = 1,
  limit: number = 20,
  filters?: { isVerified?: boolean; isAvailable?: boolean }
) {
  const skip = (page - 1) * limit;
  
  const where: Prisma.caregiversWhereInput = {
    company_id: companyId,
    deleted_at: null,
  };

  if (filters?.isVerified !== undefined) {
    where.is_verified = filters.isVerified;
  }

  if (filters?.isAvailable !== undefined) {
    where.is_available = filters.isAvailable;
  }

  const [caregivers, total] = await Promise.all([
    this.prisma.caregivers.findMany({
      where,
      skip,
      take: limit,
      include: {
        users: {
          select: { name: true, phone: true },
        },
      },
      orderBy: { rating_avg: 'desc' },
    }),
    this.prisma.caregivers.count({ where }),
  ]);

  return {
    data: caregivers,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
```

---

### **9. Subscription Tier Management**

#### **Subscription Tiers**
```typescript
enum SubscriptionTier {
  STARTER = "STARTER",      // Up to 10 caregivers, 3 service zones
  GROWTH = "GROWTH",        // Up to 50 caregivers, 10 service zones
  ENTERPRISE = "ENTERPRISE" // Unlimited caregivers, unlimited zones
}
```

#### **Upgrade Subscription (Payment Required)**
```typescript
POST /api/companies/:id/upgrade-subscription

Authorization: Bearer {agencyAdminToken}
Request Body:
{
  "tier": "GROWTH",
  "billing_cycle": "ANNUAL"
}

Response:
{
  "success": true,
  "data": {
    "id": "comp_abc123",
    "subscription_tier": "GROWTH",
    "subscription_expires_at": "2026-12-11T00:00:00Z",
    "updated_at": "2025-12-11T12:00:00Z"
  },
  "invoice": {
    "invoice_number": "INV-2025-12345",
    "amount": "50000.00",
    "due_date": "2025-12-18T00:00:00Z"
  }
}
```

---

### **10. Company Statistics & Analytics**

#### **Get Company Stats (Dashboard)**
```typescript
GET /api/companies/:id/stats

Authorization: Bearer {agencyAdminToken}

Response:
{
  "success": true,
  "data": {
    "total_caregivers": 42,
    "verified_caregivers": 38,
    "active_caregivers": 35,
    "total_jobs": 235,
    "active_jobs": 18,
    "completed_jobs": 210,
    "total_packages": 12,
    "active_packages": 10,
    "total_revenue": "1250000.00",
    "platform_commission_paid": "150000.00",
    "average_rating": "4.8",
    "total_reviews": 156,
    "service_zones_count": 3,
    "subscription_tier": "GROWTH",
    "subscription_expires_at": "2026-01-15T00:00:00Z"
  }
}
```

---

## 📦 DTOs (Data Transfer Objects)

### **CreateCompanyDto**
```typescript
// File: dto/company.dto.ts

import { IsString, IsEmail, IsOptional, IsArray, IsEnum } from 'class-validator';
import { PayoutMethod } from '@prisma/client';

export class CreateCompanyDto {
  @IsString()
  company_name: string;

  @IsString()
  trade_license: string;

  @IsString()
  trade_license_url: string;

  @IsString()
  @IsOptional()
  tin?: string;

  @IsString()
  contact_person: string;

  @IsString()
  contact_phone: string;

  @IsEmail()
  @IsOptional()
  contact_email?: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  specializations?: string[];

  @IsEnum(PayoutMethod)
  payout_method: PayoutMethod;

  @IsString()
  payout_account: string;
}
```

### **UpdateCompanyDto**
```typescript
export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  contact_phone?: string;

  @IsEmail()
  @IsOptional()
  contact_email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  specializations?: string[];

  @IsEnum(PayoutMethod)
  @IsOptional()
  payout_method?: PayoutMethod;

  @IsString()
  @IsOptional()
  payout_account?: string;
}
```

### **VerifyCompanyDto**
```typescript
export class VerifyCompanyDto {
  @IsBoolean()
  is_verified: boolean;

  @IsString()
  @IsOptional()
  verification_notes?: string;
}
```

### **CreateServiceZoneDto**
```typescript
export class CreateServiceZoneDto {
  @IsString()
  zone_name: string;

  @IsString()
  region_code: string;

  @IsObject()
  @IsOptional()
  boundary_geojson?: any;
}
```

---

## 🗄️ Database Schema

### **companies Table**
```sql
CREATE TABLE companies (
  id                      VARCHAR(25) PRIMARY KEY,
  userId                  VARCHAR(25) UNIQUE NOT NULL,
  company_name            VARCHAR(255) NOT NULL,
  trade_license           VARCHAR(100) NOT NULL,
  trade_license_url       TEXT,
  tin                     VARCHAR(50),
  contact_person          VARCHAR(255) NOT NULL,
  contact_phone           VARCHAR(20) NOT NULL,
  contact_email           VARCHAR(255),
  address                 TEXT NOT NULL,
  logo_url                TEXT,
  description             TEXT,
  specializations         JSONB,
  payout_method           VARCHAR(20) NOT NULL,
  payout_account          VARCHAR(100) NOT NULL,
  commission_rate         DECIMAL(5,2) DEFAULT 12.00,
  subscription_tier       VARCHAR(20) DEFAULT 'STARTER',
  subscription_expires_at TIMESTAMP,
  rating_avg              DECIMAL(3,2) DEFAULT 0.0,
  rating_count            INTEGER DEFAULT 0,
  is_verified             BOOLEAN DEFAULT FALSE,
  verification_notes      TEXT,
  deleted_at              TIMESTAMP,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_rating_avg (rating_avg),
  INDEX idx_userId (userId),
  INDEX idx_is_verified (is_verified)
);
```

### **service_zones Table**
```sql
CREATE TABLE service_zones (
  id               VARCHAR(25) PRIMARY KEY,
  company_id       VARCHAR(25) NOT NULL,
  zone_name        VARCHAR(255) NOT NULL,
  region_code      VARCHAR(20) NOT NULL,
  boundary_geojson JSONB,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (company_id) REFERENCES companies(id),
  INDEX idx_region_code (region_code),
  INDEX idx_company_id (company_id)
);
```

---

## 🧪 Testing

### **Unit Tests**
```typescript
// File: companies.service.spec.ts

describe('CompaniesService', () => {
  describe('create', () => {
    it('should create a new company', async () => {
      const result = await service.create(userId, createCompanyDto);
      expect(result.company_name).toBe('Premium Care Services Ltd.');
      expect(result.is_verified).toBe(false);
    });

    it('should throw error if user already has a company', async () => {
      await expect(service.create(userId, createCompanyDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should update user role to AGENCY_ADMIN', async () => {
      await service.create(userId, createCompanyDto);
      const user = await prisma.users.findUnique({ where: { id: userId } });
      expect(user.role).toBe(UserRole.AGENCY_ADMIN);
    });
  });

  describe('findAll', () => {
    it('should return verified companies only', async () => {
      const result = await service.findAll(1, 20, true);
      expect(result.data.every(c => c.is_verified)).toBe(true);
    });

    it('should search by company name', async () => {
      const result = await service.findAll(1, 20, undefined, 'Premium');
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should paginate correctly', async () => {
      const result = await service.findAll(2, 10);
      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(10);
    });
  });

  describe('verify', () => {
    it('should verify company', async () => {
      const result = await service.verify(companyId, { 
        is_verified: true, 
        verification_notes: 'Approved' 
      });
      expect(result.is_verified).toBe(true);
    });

    it('should send notification on verification', async () => {
      await service.verify(companyId, { is_verified: true });
      expect(notificationService.send).toHaveBeenCalled();
    });
  });

  describe('addServiceZone', () => {
    it('should add service zone to company', async () => {
      const result = await service.addServiceZone(companyId, userId, zoneDto);
      expect(result.company_id).toBe(companyId);
    });

    it('should throw error if unauthorized', async () => {
      await expect(service.addServiceZone(companyId, wrongUserId, zoneDto))
        .rejects.toThrow(ForbiddenException);
    });
  });
});
```

### **E2E Tests**
```typescript
describe('Companies (e2e)', () => {
  it('POST /companies - create company', () => {
    return request(app.getHttpServer())
      .post('/companies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createCompanyDto)
      .expect(201)
      .expect(res => {
        expect(res.body.data.company_name).toBe('Premium Care Services Ltd.');
      });
  });

  it('GET /companies - list companies', () => {
    return request(app.getHttpServer())
      .get('/companies?isVerified=true&page=1&limit=10')
      .expect(200)
      .expect(res => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.meta.total).toBeGreaterThan(0);
      });
  });

  it('GET /companies/:id - get company details', () => {
    return request(app.getHttpServer())
      .get(`/companies/${companyId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.data.id).toBe(companyId);
        expect(res.body.data._count).toBeDefined();
      });
  });

  it('PATCH /companies/:id/verify - verify company (admin)', () => {
    return request(app.getHttpServer())
      .patch(`/companies/${companyId}/verify`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ is_verified: true, verification_notes: 'Approved' })
      .expect(200);
  });
});
```

---

## 🔧 Environment Variables

```env
# No specific environment variables for companies module
# Uses shared database and file storage configuration
```

---

## 🚀 API Usage Examples

### **Complete Company Registration Flow (Frontend)**
```javascript
// Step 1: Register company
const registerCompany = async (companyData) => {
  const response = await fetch('/api/companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(companyData)
  });
  
  const result = await response.json();
  return result.data;
};

// Step 2: Upload trade license
const uploadTradeLicense = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/files/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}` },
    body: formData
  });
  
  const result = await response.json();
  return result.data.url;
};

// Complete flow
const createCompany = async () => {
  // Upload trade license first
  const tradeLicenseUrl = await uploadTradeLicense(tradeLicenseFile);
  
  // Register company with uploaded document URL
  const company = await registerCompany({
    company_name: 'Premium Care Services Ltd.',
    trade_license: 'TRAD-2024-12345',
    trade_license_url: tradeLicenseUrl,
    // ... other fields
  });
  
  console.log('Company registered:', company.id);
  console.log('Verification status:', company.is_verified);
};
```

### **Company Dashboard Stats (React Component)**
```javascript
import { useState, useEffect } from 'react';

const CompanyDashboard = ({ companyId }) => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetchStats();
  }, [companyId]);
  
  const fetchStats = async () => {
    const response = await fetch(`/api/companies/${companyId}/stats`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const result = await response.json();
    setStats(result.data);
  };
  
  if (!stats) return <div>Loading...</div>;
  
  return (
    <div className="dashboard">
      <h1>Company Dashboard</h1>
      <div className="stats-grid">
        <StatCard title="Total Caregivers" value={stats.total_caregivers} />
        <StatCard title="Active Jobs" value={stats.active_jobs} />
        <StatCard title="Total Revenue" value={`৳${stats.total_revenue}`} />
        <StatCard title="Rating" value={stats.average_rating} />
      </div>
      <SubscriptionInfo 
        tier={stats.subscription_tier}
        expiresAt={stats.subscription_expires_at}
      />
    </div>
  );
};
```

---

## 📚 Related Documentation

- [02 Backend 01.md](02%20Backend%2001.md) - Architecture & Project Structure
- [02 Backend 02.md](02%20Backend%2002.md) - Authentication & User Management
- [02 Backend 04.md](02%20Backend%2004.md) - Caregiver Management
- [02 Backend 06.md](02%20Backend%2006.md) - Package Management
- [02 Backend 08.md](02%20Backend%2008.md) - Verification System

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
