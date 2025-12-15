# Backend Documentation 06 - Package Management

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Module**: Packages  
**Priority**: 🟠 High

---

## 📋 Overview

This document covers the **Package Management** system, which handles care package creation, service definitions, pricing, categories, custom packages, and availability management.

### **Module Covered**
- **Packages Module** - Care package creation, pricing, service definitions, custom packages

### **Key Features**
- Care package creation by agencies
- Service definitions and inclusions
- Package categories and filters
- Custom package builder
- Dynamic pricing
- Package availability and scheduling
- Minimum advance booking
- Package search and filtering

---

## 📦 Packages Module

**Path**: `/backend/src/packages/`

### **Module Files**
```
packages/
├── packages.module.ts           # Module configuration
├── packages.service.ts          # Business logic
├── packages.controller.ts       # HTTP endpoints
└── dto/
    ├── package.dto.ts           # Create/Update DTOs
    ├── custom-package.dto.ts    # Custom package builder
    └── search.dto.ts            # Search filters
```

---

## 🎯 Core Package Features

### **1. Package Creation (By Agency)**

#### **Create Care Package**
```typescript
POST /api/packages

Authorization: Bearer {agencyAdminToken}
Request Body:
{
  "name": "24/7 Elderly Care - Premium",
  "description": "Round-the-clock professional care for elderly patients with chronic conditions. Includes medication management, mobility assistance, meal preparation, and companionship.",
  "category": "ELDERLY_CARE",
  "price": 25000.00,
  "duration_days": 30,
  "hours_per_day": 24,
  "caregiver_count": 2,
  "inclusions": [
    "24/7 Professional Caregiver",
    "Medication Management",
    "Vital Signs Monitoring (3x daily)",
    "Mobility Assistance",
    "Meal Preparation & Feeding",
    "Personal Hygiene Assistance",
    "Companionship & Entertainment",
    "Daily Care Log Reports",
    "Emergency Response Protocol"
  ],
  "exclusions": [
    "Medical Procedures (Injections, IV)",
    "Nursing Care",
    "Transportation",
    "Medical Equipment Rental"
  ],
  "min_advance_days": 3
}

Response:
{
  "success": true,
  "data": {
    "id": "pkg_001",
    "company_id": "comp_abc123",
    "name": "24/7 Elderly Care - Premium",
    "description": "Round-the-clock professional care...",
    "category": "ELDERLY_CARE",
    "price": "25000.00",
    "duration_days": 30,
    "hours_per_day": 24,
    "caregiver_count": 2,
    "inclusions": [...],
    "exclusions": [...],
    "min_advance_days": 3,
    "is_active": true,
    "created_at": "2025-12-11T10:00:00Z",
    "updated_at": "2025-12-11T10:00:00Z"
  }
}
```

**Implementation**:
```typescript
// File: packages.service.ts - create()

async create(userId: string, createPackageDto: CreatePackageDto) {
  // Get company ID from user
  const company = await this.prisma.companies.findUnique({
    where: { userId },
  });

  if (!company) {
    throw new NotFoundException('Company not found');
  }

  if (!company.is_verified) {
    throw new BadRequestException('Company must be verified to create packages');
  }

  // Validate pricing
  if (createPackageDto.price < 1000) {
    throw new BadRequestException('Package price must be at least ৳1,000');
  }

  // Validate duration and hours
  if (createPackageDto.duration_days < 1) {
    throw new BadRequestException('Duration must be at least 1 day');
  }

  if (createPackageDto.hours_per_day < 1 || createPackageDto.hours_per_day > 24) {
    throw new BadRequestException('Hours per day must be between 1 and 24');
  }

  const pkg = await this.prisma.packages.create({
    data: {
      company_id: company.id,
      name: createPackageDto.name,
      description: createPackageDto.description,
      category: createPackageDto.category,
      price: createPackageDto.price,
      duration_days: createPackageDto.duration_days,
      hours_per_day: createPackageDto.hours_per_day,
      inclusions: createPackageDto.inclusions,
      exclusions: createPackageDto.exclusions || [],
      caregiver_count: createPackageDto.caregiver_count || 1,
      min_advance_days: createPackageDto.min_advance_days || 2,
      is_active: true,
    },
  });

  // Log audit trail
  await this.auditService.log({
    actor_id: userId,
    action_type: 'CREATE_PACKAGE',
    entity_type: 'PACKAGE',
    entity_id: pkg.id,
  });

  return pkg;
}
```

**Business Rules**:
- ✅ Only verified agencies can create packages
- ✅ Minimum price: ৳1,000
- ✅ Duration: 1-365 days
- ✅ Hours per day: 1-24
- ✅ Minimum advance booking: 1-30 days
- ✅ Caregiver count: 1-5
- ✅ Inclusions and exclusions stored as JSON arrays

---

### **2. Package Categories**

#### **Package Category Enum**
```typescript
enum PackageCategory {
  ELDERLY_CARE = "ELDERLY_CARE",           // Elderly care services
  POST_SURGERY = "POST_SURGERY",           // Post-operative recovery
  CHRONIC_ILLNESS = "CHRONIC_ILLNESS",     // Chronic disease management
  COMPANION = "COMPANION",                 // Companionship services
  NURSING = "NURSING"                      // Professional nursing care
}
```

#### **Category Descriptions**
```typescript
const CATEGORY_INFO = {
  ELDERLY_CARE: {
    name: "Elderly Care",
    description: "Comprehensive care for senior citizens including daily living assistance, medication management, and companionship",
    icon: "elderly-icon",
    typical_duration: "30-365 days",
    typical_hours: "8-24 hours/day"
  },
  POST_SURGERY: {
    name: "Post-Surgery Recovery",
    description: "Specialized care for patients recovering from surgery, including wound care, medication, and mobility assistance",
    icon: "surgery-icon",
    typical_duration: "7-30 days",
    typical_hours: "12-24 hours/day"
  },
  CHRONIC_ILLNESS: {
    name: "Chronic Illness Management",
    description: "Long-term care for patients with chronic conditions like diabetes, heart disease, or kidney disease",
    icon: "chronic-icon",
    typical_duration: "30-365 days",
    typical_hours: "8-24 hours/day"
  },
  COMPANION: {
    name: "Companion Services",
    description: "Companionship and light assistance for patients who need social support and minimal care",
    icon: "companion-icon",
    typical_duration: "1-30 days",
    typical_hours: "4-12 hours/day"
  },
  NURSING: {
    name: "Professional Nursing",
    description: "Registered nurse care including medical procedures, injections, wound dressing, and health monitoring",
    icon: "nursing-icon",
    typical_duration: "7-90 days",
    typical_hours: "8-24 hours/day"
  }
};
```

---

### **3. Search & Filter Packages**

#### **Public Package Listing**
```typescript
GET /api/packages?page=1&limit=20&category=ELDERLY_CARE&minPrice=5000&maxPrice=30000&minDuration=7&maxDuration=30&sort=price_asc

Response:
{
  "success": true,
  "data": [
    {
      "id": "pkg_001",
      "name": "24/7 Elderly Care - Premium",
      "description": "Round-the-clock professional care...",
      "category": "ELDERLY_CARE",
      "price": "25000.00",
      "duration_days": 30,
      "hours_per_day": 24,
      "caregiver_count": 2,
      "is_active": true,
      "companies": {
        "company_name": "Premium Care Services Ltd.",
        "logo_url": "https://r2.example.com/logos/premium.png",
        "rating_avg": "4.8",
        "is_verified": true
      }
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  },
  "filters": {
    "categories": ["ELDERLY_CARE", "POST_SURGERY", "CHRONIC_ILLNESS", "COMPANION", "NURSING"],
    "price_range": { "min": 1000, "max": 50000 },
    "duration_range": { "min": 1, "max": 365 }
  }
}
```

**Implementation with Advanced Filters**:
```typescript
// File: packages.service.ts - findAll()

async findAll(filters?: {
  page?: number;
  limit?: number;
  category?: PackageCategory;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  companyId?: string;
  search?: string;
  sort?: string;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where: Prisma.packagesWhereInput = {
    is_active: true,
  };

  // Category filter
  if (filters?.category) {
    where.category = filters.category;
  }

  // Price range filter
  if (filters?.minPrice || filters?.maxPrice) {
    where.price = {};
    if (filters?.minPrice) {
      where.price.gte = filters.minPrice;
    }
    if (filters?.maxPrice) {
      where.price.lte = filters.maxPrice;
    }
  }

  // Duration range filter
  if (filters?.minDuration || filters?.maxDuration) {
    where.duration_days = {};
    if (filters?.minDuration) {
      where.duration_days.gte = filters.minDuration;
    }
    if (filters?.maxDuration) {
      where.duration_days.lte = filters.maxDuration;
    }
  }

  // Company filter
  if (filters?.companyId) {
    where.company_id = filters.companyId;
  }

  // Search by name or description
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // Determine sort order
  let orderBy: Prisma.packagesOrderByWithRelationInput = { created_at: 'desc' };
  
  if (filters?.sort === 'price_asc') {
    orderBy = { price: 'asc' };
  } else if (filters?.sort === 'price_desc') {
    orderBy = { price: 'desc' };
  } else if (filters?.sort === 'duration_asc') {
    orderBy = { duration_days: 'asc' };
  } else if (filters?.sort === 'duration_desc') {
    orderBy = { duration_days: 'desc' };
  }

  const [packages, total] = await Promise.all([
    this.prisma.packages.findMany({
      where,
      skip,
      take: limit,
      include: {
        companies: {
          select: {
            company_name: true,
            logo_url: true,
            rating_avg: true,
            is_verified: true,
          },
        },
      },
      orderBy,
    }),
    this.prisma.packages.count({ where }),
  ]);

  return {
    data: packages,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
```

---

### **4. Get Package Details**

#### **Fetch Single Package**
```typescript
GET /api/packages/:id

Response:
{
  "success": true,
  "data": {
    "id": "pkg_001",
    "company_id": "comp_abc123",
    "name": "24/7 Elderly Care - Premium",
    "description": "Round-the-clock professional care for elderly patients with chronic conditions. Includes medication management, mobility assistance, meal preparation, and companionship.",
    "category": "ELDERLY_CARE",
    "price": "25000.00",
    "duration_days": 30,
    "hours_per_day": 24,
    "caregiver_count": 2,
    "inclusions": [
      "24/7 Professional Caregiver",
      "Medication Management",
      "Vital Signs Monitoring (3x daily)",
      "Mobility Assistance",
      "Meal Preparation & Feeding",
      "Personal Hygiene Assistance",
      "Companionship & Entertainment",
      "Daily Care Log Reports",
      "Emergency Response Protocol"
    ],
    "exclusions": [
      "Medical Procedures (Injections, IV)",
      "Nursing Care",
      "Transportation",
      "Medical Equipment Rental"
    ],
    "min_advance_days": 3,
    "is_active": true,
    "created_at": "2025-12-11T10:00:00Z",
    "updated_at": "2025-12-11T10:00:00Z",
    "companies": {
      "id": "comp_abc123",
      "company_name": "Premium Care Services Ltd.",
      "logo_url": "https://r2.example.com/logos/premium.png",
      "description": "Providing premium elderly care services since 2020",
      "rating_avg": "4.8",
      "rating_count": 156,
      "is_verified": true
    },
    "statistics": {
      "total_bookings": 89,
      "active_bookings": 12,
      "completion_rate": "96.5%",
      "average_rating": "4.7"
    }
  }
}
```

**Implementation**:
```typescript
// File: packages.service.ts - findOne()

async findOne(id: string) {
  const pkg = await this.prisma.packages.findUnique({
    where: { id },
    include: {
      companies: {
        select: {
          id: true,
          company_name: true,
          logo_url: true,
          description: true,
          rating_avg: true,
          rating_count: true,
          is_verified: true,
        },
      },
      _count: {
        select: {
          jobs: true,
        },
      },
    },
  });

  if (!pkg) {
    throw new NotFoundException('Package not found');
  }

  // Get package statistics
  const [totalBookings, activeBookings, completedJobs] = await Promise.all([
    this.prisma.jobs.count({ where: { package_id: id } }),
    this.prisma.jobs.count({
      where: {
        package_id: id,
        status: { in: [JobStatus.PENDING_ASSIGNMENT, JobStatus.ACTIVE] },
      },
    }),
    this.prisma.jobs.count({
      where: { package_id: id, status: JobStatus.COMPLETED },
    }),
  ]);

  const completionRate = totalBookings > 0
    ? ((completedJobs / totalBookings) * 100).toFixed(1)
    : '0.0';

  return {
    ...pkg,
    statistics: {
      total_bookings: totalBookings,
      active_bookings: activeBookings,
      completion_rate: `${completionRate}%`,
    },
  };
}
```

---

### **5. Update Package**

#### **Update Package Information**
```typescript
PATCH /api/packages/:id

Authorization: Bearer {agencyAdminToken}
Request Body:
{
  "name": "24/7 Elderly Care - Premium Plus",
  "description": "Enhanced round-the-clock care with specialized nursing",
  "price": 30000.00,
  "inclusions": [
    "24/7 Professional Caregiver",
    "Medication Management",
    "Vital Signs Monitoring (4x daily)",
    "Mobility Assistance",
    "Meal Preparation & Feeding",
    "Personal Hygiene Assistance",
    "Companionship & Entertainment",
    "Daily Care Log Reports",
    "Emergency Response Protocol",
    "Weekly Health Assessment by RN"
  ]
}

Response:
{
  "success": true,
  "data": {
    "id": "pkg_001",
    "name": "24/7 Elderly Care - Premium Plus",
    "description": "Enhanced round-the-clock care with specialized nursing",
    "price": "30000.00",
    "inclusions": [...],
    "updated_at": "2025-12-11T11:00:00Z"
  }
}
```

**Implementation**:
```typescript
// File: packages.service.ts - update()

async update(
  id: string,
  userId: string,
  updatePackageDto: UpdatePackageDto
) {
  const pkg = await this.prisma.packages.findUnique({
    where: { id },
    include: { companies: true },
  });

  if (!pkg) {
    throw new NotFoundException('Package not found');
  }

  // Authorization: Only package owner can update
  if (pkg.companies.userId !== userId) {
    throw new ForbiddenException('You can only update your own packages');
  }

  // Check if package has active bookings
  const activeBookings = await this.prisma.jobs.count({
    where: {
      package_id: id,
      status: { in: [JobStatus.PENDING_ASSIGNMENT, JobStatus.ACTIVE] },
    },
  });

  // Prevent price changes if there are active bookings
  if (activeBookings > 0 && updatePackageDto.price && updatePackageDto.price !== Number(pkg.price)) {
    throw new BadRequestException(
      'Cannot change price while package has active bookings'
    );
  }

  const updated = await this.prisma.packages.update({
    where: { id },
    data: updatePackageDto,
  });

  // Log audit trail
  await this.auditService.log({
    actor_id: userId,
    action_type: 'UPDATE_PACKAGE',
    entity_type: 'PACKAGE',
    entity_id: id,
    changes: updatePackageDto,
  });

  return updated;
}
```

---

### **6. Activate/Deactivate Package**

#### **Toggle Package Availability**
```typescript
PATCH /api/packages/:id/status

Authorization: Bearer {agencyAdminToken}
Request Body:
{
  "is_active": false
}

Response:
{
  "success": true,
  "data": {
    "id": "pkg_001",
    "name": "24/7 Elderly Care - Premium",
    "is_active": false,
    "updated_at": "2025-12-11T12:00:00Z"
  }
}
```

**Implementation**:
```typescript
// File: packages.service.ts - toggleStatus()

async toggleStatus(id: string, userId: string, isActive: boolean) {
  const pkg = await this.prisma.packages.findUnique({
    where: { id },
    include: { companies: true },
  });

  if (!pkg || pkg.companies.userId !== userId) {
    throw new NotFoundException('Package not found');
  }

  return this.prisma.packages.update({
    where: { id },
    data: { is_active: isActive },
  });
}
```

---

### **7. Custom Package Builder**

#### **Create Custom Package (By Guardian)**
```typescript
POST /api/packages/custom

Authorization: Bearer {guardianToken}
Request Body:
{
  "base_package_id": "pkg_001",
  "duration_days": 45,
  "hours_per_day": 20,
  "special_requirements": [
    "Experience with dementia patients",
    "Fluent in Bengali and English",
    "Female caregiver preferred"
  ],
  "additional_services": [
    "Physical therapy assistance",
    "Special dietary requirements"
  ],
  "start_date": "2025-12-20",
  "notes": "My mother requires extra attention during evening hours"
}

Response:
{
  "success": true,
  "data": {
    "id": "custom_pkg_001",
    "base_package_id": "pkg_001",
    "base_package_name": "24/7 Elderly Care - Premium",
    "base_price": "25000.00",
    "customizations": {
      "duration_days": 45,
      "hours_per_day": 20,
      "special_requirements": [...],
      "additional_services": [...]
    },
    "estimated_price": "37500.00",
    "status": "PENDING_AGENCY_REVIEW",
    "created_at": "2025-12-11T13:00:00Z"
  },
  "message": "Custom package request sent to agency for review"
}
```

---

### **8. Package Comparison**

#### **Compare Multiple Packages**
```typescript
POST /api/packages/compare

Request Body:
{
  "package_ids": ["pkg_001", "pkg_002", "pkg_003"]
}

Response:
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": "pkg_001",
        "name": "24/7 Elderly Care - Premium",
        "category": "ELDERLY_CARE",
        "price": "25000.00",
        "duration_days": 30,
        "hours_per_day": 24,
        "caregiver_count": 2,
        "company_name": "Premium Care Services Ltd.",
        "company_rating": "4.8",
        "inclusions_count": 9,
        "price_per_day": "833.33"
      },
      {
        "id": "pkg_002",
        "name": "12-Hour Elderly Care",
        "category": "ELDERLY_CARE",
        "price": "15000.00",
        "duration_days": 30,
        "hours_per_day": 12,
        "caregiver_count": 1,
        "company_name": "Care Plus Services",
        "company_rating": "4.5",
        "inclusions_count": 7,
        "price_per_day": "500.00"
      }
    ],
    "comparison_matrix": {
      "price": { "best": "pkg_002", "value": 15000 },
      "hours_per_day": { "best": "pkg_001", "value": 24 },
      "caregiver_count": { "best": "pkg_001", "value": 2 },
      "company_rating": { "best": "pkg_001", "value": 4.8 }
    }
  }
}
```

---

### **9. Get Company's Packages**

#### **List Packages by Company**
```typescript
GET /api/packages/company/:companyId?page=1&limit=20&category=ELDERLY_CARE&isActive=true

Response:
{
  "success": true,
  "data": [
    {
      "id": "pkg_001",
      "name": "24/7 Elderly Care - Premium",
      "category": "ELDERLY_CARE",
      "price": "25000.00",
      "is_active": true,
      "total_bookings": 89,
      "active_bookings": 12
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### **10. Popular Packages**

#### **Get Most Popular Packages**
```typescript
GET /api/packages/popular?limit=10

Response:
{
  "success": true,
  "data": [
    {
      "id": "pkg_001",
      "name": "24/7 Elderly Care - Premium",
      "price": "25000.00",
      "total_bookings": 156,
      "company_name": "Premium Care Services Ltd.",
      "rating_avg": "4.8",
      "popularity_score": 95.5
    }
  ]
}
```

---

## 📦 DTOs (Data Transfer Objects)

### **CreatePackageDto**
```typescript
// File: dto/package.dto.ts

import { IsString, IsNumber, IsEnum, IsArray, IsOptional, Min, Max } from 'class-validator';
import { PackageCategory } from '@prisma/client';

export class CreatePackageDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(PackageCategory)
  category: PackageCategory;

  @IsNumber()
  @Min(1000)
  price: number;

  @IsNumber()
  @Min(1)
  @Max(365)
  duration_days: number;

  @IsNumber()
  @Min(1)
  @Max(24)
  hours_per_day: number;

  @IsArray()
  inclusions: string[];

  @IsArray()
  @IsOptional()
  exclusions?: string[];

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  caregiver_count?: number;

  @IsNumber()
  @Min(1)
  @Max(30)
  @IsOptional()
  min_advance_days?: number;
}
```

### **UpdatePackageDto**
```typescript
export class UpdatePackageDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsArray()
  @IsOptional()
  inclusions?: string[];

  @IsArray()
  @IsOptional()
  exclusions?: string[];

  @IsNumber()
  @IsOptional()
  caregiver_count?: number;
}
```

---

## 🗄️ Database Schema

### **packages Table**
```sql
CREATE TABLE packages (
  id               VARCHAR(25) PRIMARY KEY,
  company_id       VARCHAR(25) NOT NULL,
  name             VARCHAR(255) NOT NULL,
  description      TEXT NOT NULL,
  category         VARCHAR(50) NOT NULL,
  price            DECIMAL(10,2) NOT NULL,
  duration_days    INTEGER NOT NULL,
  hours_per_day    INTEGER NOT NULL,
  inclusions       JSONB NOT NULL,
  exclusions       JSONB,
  caregiver_count  INTEGER DEFAULT 1,
  is_active        BOOLEAN DEFAULT TRUE,
  min_advance_days INTEGER DEFAULT 2,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (company_id) REFERENCES companies(id),
  INDEX idx_is_active (is_active),
  INDEX idx_category (category),
  INDEX idx_company_id (company_id),
  INDEX idx_price (price)
);
```

---

## 🧪 Testing

### **Unit Tests**
```typescript
describe('PackagesService', () => {
  describe('create', () => {
    it('should create package', async () => {
      const result = await service.create(userId, createDto);
      expect(result.name).toBe('24/7 Elderly Care');
      expect(result.is_active).toBe(true);
    });

    it('should throw error if company not verified', async () => {
      await expect(service.create(unverifiedUserId, createDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll with filters', () => {
    it('should filter by category', async () => {
      const result = await service.findAll({ category: 'ELDERLY_CARE' });
      expect(result.data.every(p => p.category === 'ELDERLY_CARE')).toBe(true);
    });

    it('should filter by price range', async () => {
      const result = await service.findAll({ minPrice: 5000, maxPrice: 30000 });
      expect(result.data.every(p => p.price >= 5000 && p.price <= 30000)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update package', async () => {
      const result = await service.update(pkgId, userId, updateDto);
      expect(result.name).toBe('Updated Name');
    });

    it('should prevent price change with active bookings', async () => {
      await expect(service.update(pkgIdWithBookings, userId, { price: 40000 }))
        .rejects.toThrow(BadRequestException);
    });
  });
});
```

---

## 🚀 API Usage Examples

### **Package Search (React Component)**
```javascript
const PackageSearch = () => {
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 50000,
    sort: 'price_asc'
  });

  const searchPackages = async () => {
    const query = new URLSearchParams({
      ...filters,
      page: 1,
      limit: 20
    });
    
    const response = await fetch(`/api/packages?${query}`);
    const result = await response.json();
    setPackages(result.data);
  };

  return (
    <div>
      <PackageFilters filters={filters} onChange={setFilters} />
      <PackageGrid packages={packages} />
    </div>
  );
};
```

---

## 📚 Related Documentation

- [02 Backend 01.md](02%20Backend%2001.md) - Architecture & Project Structure
- [02 Backend 03.md](02%20Backend%2003.md) - Companies & Agency Management
- [02 Backend 07.md](02%20Backend%2007.md) - Job Lifecycle Management
- [02 Backend 09.md](02%20Backend%2009.md) - Package Negotiations

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
