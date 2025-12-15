# Backend Documentation 09 - Package Negotiations

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Module**: Negotiations  
**Priority**: 🟡 High

---

## 📋 Overview

The **Package Negotiations** module enables guardians to negotiate package prices and terms with agencies, creating a flexible pricing mechanism that benefits both parties while maintaining platform transparency.

### **Key Features**
- Guardian-initiated price negotiations
- 48-hour negotiation window
- Multi-round counter-offer system
- Agency response workflow
- Automatic expiration handling
- Negotiation history tracking
- Status-based filtering

**Module Path**: `/backend/src/negotiations/`

---

## 📁 Module Structure

```
negotiations/
├── negotiations.module.ts         # Module configuration
├── negotiations.service.ts        # Business logic
├── negotiations.controller.ts     # HTTP endpoints
└── dto/
    └── negotiation.dto.ts        # Request validation
```

---

## 🎯 Core Features

### **1. Negotiation Lifecycle**

```
Guardian Proposes → Agency Reviews → Accept/Decline/Counter → Resolution
                        ↓
                    Counter Offer → Guardian Reviews → Accept/Decline
```

**Negotiation Statuses**:
- `PENDING_AGENCY_RESPONSE` - Guardian submitted proposal
- `PENDING_GUARDIAN_DECISION` - Agency countered
- `ACCEPTED` - Agreement reached
- `DECLINED` - Rejected by either party
- `COUNTER_OFFERED` - Counter proposal active

---

## 🔌 API Endpoints

### **1. Create Negotiation**

**Endpoint**: `POST /api/negotiations`  
**Access**: GUARDIAN  
**Description**: Submit a price negotiation request for a package

```typescript
POST /api/negotiations
Authorization: Bearer {accessToken}
Role: GUARDIAN

Request Body:
{
  "package_id": "pkg-uuid-123",
  "proposed_price": 28000.00,
  "notes": "Can we reduce the price to 28,000 BDT? I need care for 3 months."
}

Response: 201 Created
{
  "id": "neg-uuid-456",
  "package_id": "pkg-uuid-123",
  "guardian_id": "user-uuid-789",
  "original_price": 35000.00,
  "proposed_price": 28000.00,
  "guardian_message": "Can we reduce the price to 28,000 BDT? I need care for 3 months.",
  "agency_response": null,
  "counter_price": null,
  "status": "PENDING_AGENCY_RESPONSE",
  "round_number": 1,
  "expires_at": "2025-12-13T10:00:00Z",
  "created_at": "2025-12-11T10:00:00Z",
  "updated_at": "2025-12-11T10:00:00Z"
}
```

**Validation**:
- Package must exist
- Proposed price must be less than original price
- Guardian cannot have active negotiation for same package
- Only ONE pending negotiation per package per guardian

**Business Logic**:
```typescript
async create(guardianId: string, createDto: CreateNegotiationDto) {
  // 1. Verify package exists
  const pkg = await this.prisma.packages.findUnique({
    where: { id: createDto.package_id }
  });
  
  if (!pkg) throw new NotFoundException('Package not found');
  
  // 2. Check for existing active negotiation
  const existing = await this.prisma.package_negotiations.findFirst({
    where: {
      package_id: createDto.package_id,
      guardian_id: guardianId,
      status: { notIn: ['ACCEPTED', 'DECLINED'] }
    }
  });
  
  if (existing) {
    throw new BadRequestException('Active negotiation already exists');
  }
  
  // 3. Create negotiation with 48-hour expiry
  const negotiation = await this.prisma.package_negotiations.create({
    data: {
      package_id: createDto.package_id,
      guardian_id: guardianId,
      original_price: pkg.price,
      proposed_price: createDto.proposed_price,
      guardian_message: createDto.notes,
      status: NegotiationStatus.PENDING_AGENCY_RESPONSE,
      expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000)
    }
  });
  
  // 4. Send notification to agency
  await this.notificationsService.create(
    pkg.company_id,
    'New Price Negotiation',
    `Guardian has proposed ${createDto.proposed_price} BDT for ${pkg.name}`
  );
  
  return negotiation;
}
```

**Error Responses**:
```typescript
// 404 Not Found
{
  "statusCode": 404,
  "message": "Package not found",
  "error": "Not Found"
}

// 400 Bad Request
{
  "statusCode": 400,
  "message": "Active negotiation already exists",
  "error": "Bad Request"
}
```

---

### **2. Get All Negotiations**

**Endpoint**: `GET /api/negotiations`  
**Access**: GUARDIAN, AGENCY_ADMIN, AGENCY_MANAGER  
**Description**: Retrieve user's negotiations with pagination

```typescript
GET /api/negotiations?page=1&limit=20
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "data": [
    {
      "id": "neg-uuid-456",
      "package_id": "pkg-uuid-123",
      "guardian_id": "user-uuid-789",
      "original_price": 35000.00,
      "proposed_price": 28000.00,
      "guardian_message": "Can we reduce the price?",
      "agency_response": "We can offer 32,000 BDT",
      "counter_price": 32000.00,
      "status": "COUNTER_OFFERED",
      "round_number": 2,
      "expires_at": "2025-12-13T10:00:00Z",
      "created_at": "2025-12-11T10:00:00Z",
      "updated_at": "2025-12-11T12:00:00Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `status`: NegotiationStatus (filter by status)
- `package_id`: string (filter by package)

**Implementation**:
```typescript
async findAll(userId: string, page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  
  const [negotiations, total] = await Promise.all([
    this.prisma.package_negotiations.findMany({
      where: { guardian_id: userId },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        guardian: {
          select: { name: true, profilePhoto: true }
        }
      }
    }),
    this.prisma.package_negotiations.count({
      where: { guardian_id: userId }
    })
  ]);
  
  return {
    data: negotiations,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

---

### **3. Get Single Negotiation**

**Endpoint**: `GET /api/negotiations/:id`  
**Access**: Authenticated  
**Description**: Get negotiation details by ID

```typescript
GET /api/negotiations/neg-uuid-456
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": "neg-uuid-456",
  "package_id": "pkg-uuid-123",
  "guardian_id": "user-uuid-789",
  "original_price": 35000.00,
  "proposed_price": 28000.00,
  "guardian_message": "Can we reduce the price to 28,000 BDT?",
  "agency_response": "We appreciate your interest. We can offer 32,000 BDT.",
  "counter_price": 32000.00,
  "additional_services": null,
  "proposed_changes": null,
  "status": "COUNTER_OFFERED",
  "round_number": 2,
  "parent_id": null,
  "expires_at": "2025-12-13T10:00:00Z",
  "created_at": "2025-12-11T10:00:00Z",
  "updated_at": "2025-12-11T12:00:00Z",
  "guardian": {
    "name": "Ahmed Hassan"
  }
}
```

**Authorization**:
- Guardian can view their own negotiations
- Agency admin/manager can view negotiations for their packages
- Platform admins can view all negotiations

---

### **4. Respond to Negotiation**

**Endpoint**: `PATCH /api/negotiations/:id/respond`  
**Access**: AGENCY_ADMIN, AGENCY_MANAGER, GUARDIAN  
**Description**: Accept, decline, or counter a negotiation

```typescript
PATCH /api/negotiations/neg-uuid-456/respond
Authorization: Bearer {accessToken}
Role: AGENCY_ADMIN

Request Body:
{
  "action": "COUNTER",
  "counter_price": 32000.00,
  "notes": "We can offer 32,000 BDT with an additional backup caregiver."
}

Response: 200 OK
{
  "id": "neg-uuid-456",
  "package_id": "pkg-uuid-123",
  "guardian_id": "user-uuid-789",
  "original_price": 35000.00,
  "proposed_price": 28000.00,
  "guardian_message": "Can we reduce the price to 28,000 BDT?",
  "agency_response": "We can offer 32,000 BDT with an additional backup caregiver.",
  "counter_price": 32000.00,
  "status": "COUNTER_OFFERED",
  "round_number": 2,
  "expires_at": "2025-12-13T10:00:00Z",
  "created_at": "2025-12-11T10:00:00Z",
  "updated_at": "2025-12-11T13:00:00Z"
}
```

**Action Types**:
1. **ACCEPT** - Accept the proposed price
2. **DECLINE** - Reject the negotiation
3. **COUNTER** - Make counter offer

**Accept Example**:
```typescript
Request:
{
  "action": "ACCEPT",
  "notes": "Agreed. Let's proceed with the booking."
}

Response:
{
  ...
  "status": "ACCEPTED",
  "agency_response": "Agreed. Let's proceed with the booking."
}
```

**Decline Example**:
```typescript
Request:
{
  "action": "DECLINE",
  "notes": "Sorry, we cannot reduce the price below 35,000 BDT."
}

Response:
{
  ...
  "status": "DECLINED",
  "agency_response": "Sorry, we cannot reduce the price below 35,000 BDT."
}
```

**Implementation**:
```typescript
async respond(id: string, userId: string, respondDto: RespondNegotiationDto) {
  const negotiation = await this.prisma.package_negotiations.findUnique({
    where: { id }
  });
  
  if (!negotiation) {
    throw new NotFoundException('Negotiation not found');
  }
  
  // Check if expired
  if (new Date() > new Date(negotiation.expires_at)) {
    throw new BadRequestException('Negotiation has expired');
  }
  
  // Determine new status based on action
  let newStatus = negotiation.status;
  if (respondDto.action === 'ACCEPT') {
    newStatus = NegotiationStatus.ACCEPTED;
  } else if (respondDto.action === 'DECLINE') {
    newStatus = NegotiationStatus.DECLINED;
  } else if (respondDto.action === 'COUNTER') {
    // Toggle status based on current status
    newStatus = negotiation.status === NegotiationStatus.PENDING_AGENCY_RESPONSE
      ? NegotiationStatus.PENDING_GUARDIAN_DECISION
      : NegotiationStatus.COUNTER_OFFERED;
  }
  
  const updated = await this.prisma.package_negotiations.update({
    where: { id },
    data: {
      status: newStatus,
      agency_response: respondDto.notes,
      counter_price: respondDto.counter_price,
      round_number: respondDto.action === 'COUNTER' 
        ? negotiation.round_number + 1 
        : negotiation.round_number
    }
  });
  
  // Send notification to other party
  const recipientId = negotiation.status === NegotiationStatus.PENDING_AGENCY_RESPONSE
    ? negotiation.guardian_id
    : await this.getAgencyAdminId(negotiation.package_id);
    
  await this.notificationsService.create(
    recipientId,
    'Negotiation Update',
    `Your negotiation has been ${respondDto.action.toLowerCase()}ed`
  );
  
  return updated;
}
```

---

### **5. Cancel Negotiation**

**Endpoint**: `DELETE /api/negotiations/:id`  
**Access**: GUARDIAN (creator only)  
**Description**: Cancel pending negotiation

```typescript
DELETE /api/negotiations/neg-uuid-456
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "message": "Negotiation cancelled successfully"
}
```

**Conditions**:
- Only creator can cancel
- Cannot cancel accepted/declined negotiations
- Status must be PENDING_* or COUNTER_OFFERED

---

## 📊 Database Schema

### **package_negotiations Model**

```prisma
model package_negotiations {
  id                    String              @id @default(cuid())
  package_id            String
  guardian_id           String
  original_price        Decimal
  proposed_price        Decimal?
  proposed_changes      Json?               // Custom changes to package
  guardian_message      String?
  agency_response       String?
  counter_price         Decimal?
  additional_services   Json?               // Extra services offered
  status                NegotiationStatus   @default(PENDING_AGENCY_RESPONSE)
  round_number          Int                 @default(1)
  parent_id             String?             // For tracking negotiation chain
  expires_at            DateTime
  created_at            DateTime            @default(now())
  updated_at            DateTime            @updatedAt
  
  guardian              users               @relation(fields: [guardian_id], references: [id])

  @@index([guardian_id, status])
  @@index([package_id])
}

enum NegotiationStatus {
  PENDING_AGENCY_RESPONSE
  PENDING_GUARDIAN_DECISION
  ACCEPTED
  DECLINED
  COUNTER_OFFERED
}
```

---

## 🔄 Negotiation Flow Examples

### **Scenario 1: Successful Negotiation**

```
Round 1:
Guardian → Proposes 28,000 BDT (Original: 35,000 BDT)
Status: PENDING_AGENCY_RESPONSE

Round 2:
Agency → Counters 32,000 BDT
Status: COUNTER_OFFERED

Round 3:
Guardian → Accepts 32,000 BDT
Status: ACCEPTED

Result: Booking proceeds with 32,000 BDT price
```

### **Scenario 2: Declined Negotiation**

```
Round 1:
Guardian → Proposes 25,000 BDT (Original: 35,000 BDT)
Status: PENDING_AGENCY_RESPONSE

Round 2:
Agency → Declines
Status: DECLINED

Result: Guardian must book at original price or choose different package
```

### **Scenario 3: Multi-Round Negotiation**

```
Round 1:
Guardian → Proposes 28,000 BDT
Status: PENDING_AGENCY_RESPONSE

Round 2:
Agency → Counters 33,000 BDT
Status: PENDING_GUARDIAN_DECISION

Round 3:
Guardian → Counters 30,000 BDT
Status: COUNTER_OFFERED

Round 4:
Agency → Counters 31,000 BDT (Final Offer)
Status: PENDING_GUARDIAN_DECISION

Round 5:
Guardian → Accepts 31,000 BDT
Status: ACCEPTED
```

---

## ⚙️ Business Rules

### **1. Expiration Handling**

```typescript
// Cron job runs every hour
@Cron(CronExpression.EVERY_HOUR)
async handleExpiredNegotiations() {
  const expired = await this.prisma.package_negotiations.updateMany({
    where: {
      expires_at: { lt: new Date() },
      status: {
        in: [
          NegotiationStatus.PENDING_AGENCY_RESPONSE,
          NegotiationStatus.PENDING_GUARDIAN_DECISION,
          NegotiationStatus.COUNTER_OFFERED
        ]
      }
    },
    data: {
      status: NegotiationStatus.DECLINED
    }
  });
  
  console.log(`${expired.count} negotiations expired`);
}
```

### **2. Validation Rules**

- **Proposed Price**: Must be > 0 and < original price
- **Maximum Rounds**: 5 rounds per negotiation
- **Expiry Time**: 48 hours from last action
- **One Active Negotiation**: Per guardian per package

### **3. Notification Rules**

```typescript
const notificationTriggers = {
  CREATE: 'Notify agency admin',
  COUNTER: 'Notify other party',
  ACCEPT: 'Notify both parties + create booking',
  DECLINE: 'Notify initiator',
  EXPIRE: 'Notify both parties'
};
```

---

## 🔍 Advanced Features

### **1. Filter by Status**

```typescript
GET /api/negotiations?status=PENDING_AGENCY_RESPONSE

Response:
{
  "data": [
    // Only negotiations awaiting agency response
  ]
}
```

### **2. Package Details in Response**

```typescript
GET /api/negotiations/neg-uuid-456?include=package

Response:
{
  "id": "neg-uuid-456",
  ...
  "package": {
    "id": "pkg-uuid-123",
    "name": "24-Hour Elderly Care",
    "description": "Comprehensive care for elderly patients",
    "price": 35000.00,
    "duration": "30 days"
  }
}
```

### **3. Negotiation History**

```typescript
GET /api/negotiations/neg-uuid-456/history

Response:
{
  "negotiation_id": "neg-uuid-456",
  "history": [
    {
      "round": 1,
      "actor": "GUARDIAN",
      "action": "PROPOSE",
      "price": 28000.00,
      "message": "Can we reduce the price?",
      "timestamp": "2025-12-11T10:00:00Z"
    },
    {
      "round": 2,
      "actor": "AGENCY",
      "action": "COUNTER",
      "price": 32000.00,
      "message": "We can offer 32,000 BDT",
      "timestamp": "2025-12-11T12:00:00Z"
    }
  ]
}
```

---

## 🧪 Testing

### **Unit Tests**

```typescript
describe('NegotiationsService', () => {
  describe('create', () => {
    it('should create negotiation with 48-hour expiry', async () => {
      const result = await service.create(guardianId, createDto);
      
      expect(result.status).toBe('PENDING_AGENCY_RESPONSE');
      expect(result.expires_at).toBeDefined();
      expect(result.round_number).toBe(1);
    });
    
    it('should throw error if package not found', async () => {
      await expect(
        service.create(guardianId, invalidDto)
      ).rejects.toThrow('Package not found');
    });
    
    it('should prevent duplicate active negotiations', async () => {
      await service.create(guardianId, createDto);
      
      await expect(
        service.create(guardianId, createDto)
      ).rejects.toThrow('Active negotiation already exists');
    });
  });
  
  describe('respond', () => {
    it('should accept negotiation', async () => {
      const result = await service.respond(negotiationId, userId, {
        action: 'ACCEPT',
        notes: 'Agreed'
      });
      
      expect(result.status).toBe('ACCEPTED');
    });
    
    it('should create counter offer', async () => {
      const result = await service.respond(negotiationId, userId, {
        action: 'COUNTER',
        counter_price: 32000,
        notes: 'Counter offer'
      });
      
      expect(result.status).toBe('COUNTER_OFFERED');
      expect(result.counter_price).toBe(32000);
      expect(result.round_number).toBe(2);
    });
    
    it('should decline negotiation', async () => {
      const result = await service.respond(negotiationId, userId, {
        action: 'DECLINE',
        notes: 'Cannot accept'
      });
      
      expect(result.status).toBe('DECLINED');
    });
  });
});
```

### **E2E Tests**

```typescript
describe('Negotiations API', () => {
  it('POST /negotiations - create negotiation', () => {
    return request(app.getHttpServer())
      .post('/negotiations')
      .set('Authorization', `Bearer ${guardianToken}`)
      .send({
        package_id: packageId,
        proposed_price: 28000,
        notes: 'Can we negotiate?'
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('PENDING_AGENCY_RESPONSE');
      });
  });
  
  it('GET /negotiations - get all negotiations', () => {
    return request(app.getHttpServer())
      .get('/negotiations?page=1&limit=20')
      .set('Authorization', `Bearer ${guardianToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.meta).toBeDefined();
      });
  });
  
  it('PATCH /negotiations/:id/respond - counter offer', () => {
    return request(app.getHttpServer())
      .patch(`/negotiations/${negotiationId}/respond`)
      .set('Authorization', `Bearer ${agencyToken}`)
      .send({
        action: 'COUNTER',
        counter_price: 32000,
        notes: 'Counter offer'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('COUNTER_OFFERED');
        expect(res.body.counter_price).toBe('32000');
      });
  });
});
```

---

## 🔒 Security & Permissions

### **Role-Based Access**

```typescript
@Controller('negotiations')
export class NegotiationsController {
  @Post()
  @Roles(UserRole.GUARDIAN)
  create(@CurrentUser('id') userId: string, @Body() dto: CreateNegotiationDto) {
    return this.service.create(userId, dto);
  }
  
  @Patch(':id/respond')
  @Roles(UserRole.AGENCY_ADMIN, UserRole.AGENCY_MANAGER, UserRole.GUARDIAN)
  respond(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: RespondNegotiationDto
  ) {
    return this.service.respond(id, userId, dto);
  }
}
```

### **Authorization Checks**

```typescript
async respond(id: string, userId: string, respondDto: RespondNegotiationDto) {
  const negotiation = await this.findOne(id);
  
  // Check if user is authorized to respond
  const userRole = await this.getUserRole(userId);
  
  if (userRole === UserRole.GUARDIAN) {
    if (negotiation.guardian_id !== userId) {
      throw new ForbiddenException('Not authorized');
    }
  } else if (userRole === UserRole.AGENCY_ADMIN || userRole === UserRole.AGENCY_MANAGER) {
    const package = await this.getPackage(negotiation.package_id);
    if (package.company_id !== await this.getUserCompanyId(userId)) {
      throw new ForbiddenException('Not authorized');
    }
  }
  
  // Proceed with response
}
```

---

## 🔧 Environment Variables

```env
# Negotiations Configuration
NEGOTIATION_EXPIRY_HOURS=48
MAX_NEGOTIATION_ROUNDS=5
ALLOW_NEGOTIATION_ON_PACKAGES=true
MIN_PROPOSED_PRICE_PERCENTAGE=50  # 50% of original
```

---

## 📡 Integration Points

### **1. Package Module**
- Verify package existence
- Get original price
- Check package availability

### **2. Notifications Module**
- Notify agency on new negotiation
- Notify parties on response
- Notify on expiration

### **3. Jobs Module**
- Create booking with negotiated price
- Apply discount to job total_price

### **4. Audit Module**
- Log all negotiation actions
- Track price changes
- Monitor success rate

---

## 📈 Metrics & Analytics

### **Key Metrics**

```typescript
interface NegotiationMetrics {
  totalNegotiations: number;
  acceptanceRate: number;        // % of accepted negotiations
  averageDiscount: number;        // Average discount given
  averageRounds: number;          // Average rounds to completion
  expirationRate: number;         // % of expired negotiations
  responseTime: {                 // Average response time by party
    agency: number;
    guardian: number;
  };
}
```

### **Analytics Queries**

```typescript
// Get negotiation success rate
async getSuccessRate(companyId: string, startDate: Date, endDate: Date) {
  const negotiations = await this.prisma.package_negotiations.groupBy({
    by: ['status'],
    where: {
      created_at: { gte: startDate, lte: endDate }
    },
    _count: true
  });
  
  const total = negotiations.reduce((sum, n) => sum + n._count, 0);
  const accepted = negotiations.find(n => n.status === 'ACCEPTED')?._count || 0;
  
  return {
    total,
    accepted,
    successRate: (accepted / total) * 100
  };
}
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: Expired Negotiations**

**Problem**: Negotiations expire before response  
**Solution**: 
- Increase expiry time to 72 hours
- Send reminder notifications at 24h and 12h marks
- Allow expiry extension request

### **Issue 2: Endless Negotiation Loops**

**Problem**: Parties negotiate indefinitely  
**Solution**:
- Implement max rounds limit (5 rounds)
- Final offer flag that cannot be countered
- Mediator intervention after 3 rounds

### **Issue 3: Price Abuse**

**Problem**: Unrealistic price proposals  
**Solution**:
- Set minimum proposal percentage (50% of original)
- Flag extremely low offers for review
- Allow agencies to block negotiation abuse

---

## 📚 Related Documentation

- [02 Backend 03.md](02%20Backend%2003.md) - Package Management
- [02 Backend 05.md](02%20Backend%2005.md) - Jobs & Assignments
- [02 Backend 15.md](02%20Backend%2015.md) - Notifications
- [Backend Development Plan](Backend_Development_Plan.md)

---

## 🎓 Best Practices

1. **Always validate package existence** before creating negotiation
2. **Set reasonable expiry times** (48 hours minimum)
3. **Limit negotiation rounds** to prevent endless loops
4. **Send notifications** at every status change
5. **Log all actions** for audit trail
6. **Handle expired negotiations** with automated cleanup
7. **Provide clear rejection reasons** to improve transparency
8. **Track metrics** to optimize negotiation success rates

---

**Last Updated**: December 11, 2025  
**Document Version**: 2.0  
**Next Review**: January 11, 2026
