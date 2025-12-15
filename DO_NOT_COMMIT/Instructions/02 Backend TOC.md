# Backend Documentation - Table of Contents

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Project**: CareNet Caregiver Marketplace - Backend API  
**Framework**: NestJS + TypeScript + Prisma

---

## 📚 Documentation Structure

This backend documentation is split into **20 comprehensive files** covering all **25 modules**, **100+ API endpoints**, and complete implementation details.

---

## 📋 Documentation Files

### **Core Architecture & Setup**

#### [02 Backend 01.md](02%20Backend%2001.md) - Architecture & Project Structure
- Technology stack (NestJS, Prisma, PostgreSQL, Redis)
- Project structure and module organization
- Database schema overview
- Environment configuration
- Development setup and deployment
- **Modules**: Common, Config, Database

---

### **Authentication & Authorization**

#### [02 Backend 02.md](02%20Backend%2002.md) - Authentication & User Management
- JWT authentication with refresh tokens
- MFA setup with speakeasy
- OTP verification via Redis
- Password reset flow (3-step process)
- Role-based access control (10 user roles)
- Session management
- **Modules**: Auth, Users (2 modules)

---

### **Core Business Entities**

#### [02 Backend 03.md](02%20Backend%2003.md) - Companies & Agency Management
- Company registration and verification
- Service zone management
- Agency admin and manager roles
- Caregiver roster management
- Commission rate configuration
- **Modules**: Companies (1 module)

#### [02 Backend 04.md](02%20Backend%2004.md) - Caregiver Management
- Caregiver profile creation
- Skills and certifications
- Availability calendar
- GPS location tracking
- Earnings and payouts
- Performance metrics
- **Modules**: Caregivers (1 module)

#### [02 Backend 05.md](02%20Backend%2005.md) - Patient & Guardian Management
- Patient profile management
- Health records and medical history
- Guardian-patient relationships
- Emergency contact information
- Care preferences and requirements
- **Modules**: Patients (1 module)

#### [02 Backend 06.md](02%20Backend%2006.md) - Package Management
- Care package creation
- Service definitions and pricing
- Package categories and filters
- Custom package builder
- Package availability
- **Modules**: Packages (1 module)

---

### **Critical Workflows**

#### [02 Backend 07.md](02%20Backend%2007.md) - Job Lifecycle Management
- Job creation from package purchase
- Job assignment to caregivers
- Job acceptance/decline workflow
- GPS check-in/check-out
- Job status transitions
- Job completion and evaluation
- **Modules**: Jobs (1 module)

#### [02 Backend 08.md](02%20Backend%2008.md) - Verification System (Two-Tier)
- 6-step caregiver verification pipeline
- 2-step agency verification
- Moderator review queue
- Admin approval workflow
- Document verification
- Send-back and resubmission process
- **Modules**: Verification (1 module)

#### [02 Backend 09.md](02%20Backend%2009.md) - Package Negotiations
- Counter-offer creation
- 48-hour negotiation timeout
- Multi-round negotiation support
- Agency response options
- Auto-conversion to job on acceptance
- Negotiation history tracking
- **Modules**: Negotiations (1 module)

#### [02 Backend 10.md](02%20Backend%2010.md) - Care Logging System
- Real-time care log creation
- Vital signs recording
- Medication administration tracking
- Activity logging
- Incident reporting
- Photo/video attachments
- **Modules**: Care Logs (1 module)

---

### **Financial Operations**

#### [02 Backend 11.md](02%20Backend%2011.md) - Payment Processing
- bKash payment integration
- Nagad payment integration
- Payment gateway webhooks
- Escrow management
- Payment status tracking
- Refund processing
- **Modules**: Payments (1 module)

#### [02 Backend 12.md](02%20Backend%2012.md) - Invoicing System (3-Tier)
- Caregiver → Agency invoices
- Agency → Guardian invoices
- Platform commission invoices
- Automatic invoice generation
- Invoice PDF generation
- Payment tracking
- **Modules**: Invoicing (1 module)

#### [02 Backend 13.md](02%20Backend%2013.md) - Lockout & Payment Enforcement
- 7-day payment enforcement flow
- Day 3, 5, 6 reminder system
- Account lockout on Day 7
- Feature restriction management
- Auto-unlock on payment
- Grace period extension
- **Modules**: Lockout (1 module)

---

### **Communication & Support**

#### [02 Backend 14.md](02%20Backend%2014.md) - Messaging System
- Real-time chat with Socket.io
- Conversation management
- Message read receipts
- Typing indicators
- File attachments
- Push notifications
- **Modules**: Messages, Messages Gateway (2 modules)

#### [02 Backend 15.md](02%20Backend%2015.md) - Notification System
- SMS notifications (Twilio)
- Email notifications (SendGrid)
- Push notifications (FCM)
- In-app notifications
- Notification preferences
- Template management
- **Modules**: Notifications (1 module)

#### [02 Backend 16.md](02%20Backend%2016.md) - Moderator Management
- Two-tier approval system
- Moderator queue management
- Review and recommendation workflow
- Admin decision queue
- Escalation rules
- Activity tracking
- **Modules**: Moderator (1 module)

#### [02 Backend 17.md](02%20Backend%2017.md) - Dispute Resolution
- Dispute creation and categorization
- Evidence submission
- Moderator review process
- Admin final decision
- Resolution execution
- Appeal process
- **Modules**: Disputes (1 module)

---

### **Additional Features**

#### [02 Backend 18.md](02%20Backend%2018.md) - Subscription Management
- Subscription plans and tiers
- Billing cycle management
- Auto-renewal handling
- Subscription cancellation
- Plan upgrades/downgrades
- Feature access control
- **Modules**: Subscriptions (1 module)

#### [02 Backend 19.md](02%20Backend%2019.md) - Shop & E-commerce
- Shop registration and management
- Product catalog management
- Order processing
- Inventory tracking
- Order fulfillment
- Customer reviews
- **Modules**: Shops (1 module)

#### [02 Backend 20.md](02%20Backend%2020.md) - Analytics, Feedback & Testing
- Platform analytics dashboard
- Company performance metrics
- Revenue reporting
- User feedback and ratings
- Review system
- Testing strategies
- CI/CD integration
- **Modules**: Analytics, Feedback, Audit (3 modules)

---

## 📊 Implementation Summary

### **Module Distribution (25 Total)**

| Category | Modules | Priority |
|----------|---------|----------|
| **Core Infrastructure** | 6 modules | 🔴 Critical |
| **Business Entities** | 5 modules | 🔴 Critical |
| **Critical Workflows** | 8 modules | 🔴 Critical |
| **Communication** | 2 modules | 🟠 High |
| **Support Systems** | 4 modules | 🟠 High |

### **Technology Stack**

```typescript
const backendStack = {
  framework: 'NestJS (TypeScript)',
  database: 'PostgreSQL',
  orm: 'Prisma',
  cache: 'Redis',
  storage: 'Cloudflare R2',
  payments: 'bKash + Nagad APIs',
  notifications: 'Twilio + SendGrid + FCM',
  realtime: 'Socket.io (WebSocket)',
  auth: 'JWT + MFA (speakeasy)',
  docs: 'Swagger/OpenAPI',
  testing: 'Jest + Supertest',
};
```

### **User Roles (10 Total)**

```typescript
enum UserRole {
  SUPER_ADMIN       // Supreme platform authority
  PLATFORM_ADMIN    // Platform operations
  MODERATOR         // First-line quality control
  AGENCY_ADMIN      // Agency owner/admin
  AGENCY_MANAGER    // Delegated QA role
  CAREGIVER         // Care providers
  GUARDIAN          // Family purchasing care
  PATIENT           // Care recipients
  SHOP_ADMIN        // Shop owner
  SHOP_MANAGER      // Shop operations
}
```

### **API Endpoints**

- **Total Endpoints**: 100+
- **Public Endpoints**: 15
- **Authenticated Endpoints**: 85+
- **Admin-Only Endpoints**: 25
- **WebSocket Events**: 12

### **Database Statistics**

- **Total Tables**: 35+
- **Core Entities**: 10
- **Workflow Tables**: 12
- **Support Tables**: 8
- **Enums**: 15+

---

## 🎯 Key Features

### **7-Day Payment Lockout**
```
Day 0: Invoice generated
Day 3: First reminder (Email + SMS + Push)
Day 5: Second warning
Day 6: Final warning (24 hours)
Day 7: ACCOUNT LOCKED
Payment: Auto-unlock within 1 hour
```

### **Two-Tier Authority System**
```
ALL verifications, disputes, tickets require:
1. Moderator reviews → Recommends
2. Admin decides: Approve | Send Back | Reject
```

### **6-Step Caregiver Verification**
1. Certificates → Moderator + Admin
2. Police Clearance → Moderator + Admin
3. Interview → Moderator + Admin
4. Psychological Test → Moderator + Admin
5. Document Check → Moderator + Admin
6. Final Approval → Admin ONLY

### **48-Hour Negotiation Timeout**
```
Guardian counter-offer → 
Agency responds (Discount/Add Services/Decline) →
Guardian accepts/counters again →
On Accept: Auto-convert to Job
```

---

## 📈 Development Timeline

| Phase | Duration | Modules |
|-------|----------|---------|
| **Phase 0**: Scaffolding | 3 days | Project setup, Prisma schema |
| **Phase 1**: Core | 2 weeks | Auth, Users, Common (3 modules) |
| **Phase 2**: Entities | 2 weeks | Companies, Caregivers, Patients, Packages (4 modules) |
| **Phase 3**: Workflows | 3 weeks | Verification, Jobs, Negotiations, Invoicing, Lockout (5 modules) |
| **Phase 4**: Payments | 2 weeks | Payments, Messages (2 modules) |
| **Phase 5**: Support | 2 weeks | Subscriptions, Disputes, Shops (3 modules) |
| **Phase 6**: Analytics | 1 week | Analytics, Care Logs, Feedback (3 modules) |

**Total Duration**: ~12 weeks

---

## ✅ Success Criteria

- [x] 25 modules implemented
- [x] 100+ API endpoints functional
- [x] 7-day lockout working
- [x] 3-tier billing operational
- [x] 6-step verification functional
- [x] WebSocket messaging working
- [x] 80%+ test coverage
- [x] Swagger documentation complete
- [x] Two-tier approval system active
- [x] Payment gateway integration complete

---

## 🔗 Related Documentation

- [Frontend Documentation TOC](01%20Frontend%20TOC.md)
- [Database Schema Documentation](../../backend/prisma/schema.prisma)
- [API Documentation](http://localhost:4000/api/docs) (Swagger)
- [Deployment Guide](../../backend/DEPLOYMENT_GUIDE.md)

---

**Last Updated**: December 11, 2025  
**Maintained By**: Backend Development Team  
**Contact**: backend@caregiver-platform.com
