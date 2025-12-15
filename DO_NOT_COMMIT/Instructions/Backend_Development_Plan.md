# Backend Development Plan - Caregiver Platform

## 1. File Architecture

### 1.1 Core Application Files

#### `/backend/src/main.ts`

**Functionality**: Application entry point

**Code Instructions**:

- Initialize NestJS application
- Configure CORS for frontend origins (localhost:3000, Vercel domains)
- Enable global validation pipe (class-validator)
- Set up global exception filters
- Configure Helmet for security headers
- Enable compression middleware
- Set up rate limiting
- Configure Swagger/OpenAPI documentation (optional)
- Start server on PORT from environment (default: 4000)

#### `/backend/src/app.module.ts`

**Functionality**: Root application module

**Code Instructions**:

- Import all feature modules (auth, users, companies, caregivers, patients, jobs, payments, etc.)
- Import common modules (PrismaModule, ConfigModule)
- Configure global modules (ThrottlerModule, ScheduleModule for cron jobs)
- Export shared services

#### `/backend/src/app.controller.ts` & `app.service.ts`

**Functionality**: Health check and basic app info

**Code Instructions**:

- GET `/health` endpoint returning API status, database connection, Redis connection
- GET `/` endpoint returning API version and basic info

---

### 1.2 Authentication Module (`/backend/src/auth/`)

#### `auth.module.ts`

**Functionality**: Authentication module configuration

**Code Instructions**:

- Import JwtModule with configuration
- Import PassportModule
- Import UsersModule (for user lookup)
- Register AuthService, AuthController
- Export JwtModule for use in other modules

#### `auth.service.ts`

**Functionality**: Core authentication business logic

**Code Instructions**:

- `register()`: Create new user, hash password, send OTP
- `verifyOtp()`: Validate OTP from Redis, activate user
- `login()`: Validate credentials, generate JWT tokens (access + refresh)
- `refreshToken()`: Validate refresh token, issue new access token
- `setupMfa()`: Generate TOTP secret, QR code, backup codes
- `verifyMfa()`: Validate TOTP code
- `requestPasswordReset()`: Generate OTP, send SMS/email
- `verifyPasswordReset()`: Validate OTP
- `completePasswordReset()`: Update password
- `logout()`: Invalidate refresh token
- Use bcryptjs for password hashing
- Use speakeasy for MFA
- Use Redis for OTP storage (10-minute expiry)

#### `auth.controller.ts`

**Functionality**: Authentication HTTP endpoints

**Code Instructions**:

- POST `/auth/register/step1`: Register with phone/password
- POST `/auth/register/verify-otp`: Verify OTP
- POST `/auth/login`: Login endpoint
- POST `/auth/mfa/setup`: Setup MFA (requires auth)
- POST `/auth/mfa/verify`: Verify MFA code
- POST `/auth/password-reset/request`: Request password reset
- POST `/auth/password-reset/verify`: Verify reset OTP
- POST `/auth/password-reset/complete`: Complete password reset
- POST `/auth/refresh`: Refresh access token
- POST `/auth/logout`: Logout (invalidate token)
- Use @Public() decorator for public endpoints
- Use @UseGuards(JwtAuthGuard) for protected endpoints
- Return standardized response format

#### `dto/login.dto.ts`

**Functionality**: Login request validation

**Code Instructions**:

- `phone`: string, required, valid Bangladesh phone format
- `password`: string, required, min 8 characters
- Use class-validator decorators

#### `dto/register.dto.ts`

**Functionality**: Registration request validation

**Code Instructions**:

- `phone`: string, required, unique, valid Bangladesh phone format
- `password`: string, required, min 8 characters, matches pattern
- `role`: UserRole enum, required
- `fullName`: string, optional
- `email`: string, optional, valid email format

#### `dto/mfa.dto.ts`

**Functionality**: MFA request validation

**Code Instructions**:

- `code`: string, required, 6 digits
- `tempToken`: string, optional (for MFA verification during login)

#### `dto/password-reset.dto.ts`

**Functionality**: Password reset request validation

**Code Instructions**:

- `phone`: string, required (for request)
- `otp`: string, required (for verify)
- `newPassword`: string, required, min 8 characters (for complete)

#### `guards/jwt-auth.guard.ts`

**Functionality**: JWT authentication guard

**Code Instructions**:

- Extend Passport JWT strategy
- Extract token from Authorization header
- Validate token signature and expiry
- Attach user to request object
- Handle expired token errors

#### `guards/roles.guard.ts`

**Functionality**: Role-based access control guard

**Code Instructions**:

- Check user role against required roles from @Roles() decorator
- Allow access if user role matches any required role
- Throw ForbiddenException if access denied

#### `strategies/jwt.strategy.ts`

**Functionality**: Passport JWT strategy

**Code Instructions**:

- Extract JWT from Authorization header
- Validate token signature using JWT_SECRET
- Load user from database
- Return user object for request.user

---

### 1.3 Users Module (`/backend/src/users/`)

#### `users.module.ts`

**Functionality**: User management module

**Code Instructions**:

- Import PrismaModule
- Register UsersService, UsersController
- Export UsersService for use in other modules

#### `users.service.ts`

**Functionality**: User CRUD operations

**Code Instructions**:

- `findAll()`: Get all users with pagination, filtering by role/status
- `findOne()`: Get user by ID with profile relations
- `update()`: Update user profile (phone, email, fullName, profilePhoto)
- `updateStatus()`: Update user status (ACTIVE, SUSPENDED, etc.)
- `delete()`: Soft delete user (set deletedAt)
- `getProfile()`: Get current user's full profile with relations
- Validate permissions (users can only update their own profile, admins can update any)

#### `users.controller.ts`

**Functionality**: User HTTP endpoints

**Code Instructions**:

- GET `/users`: List users (admin/moderator only)
- GET `/users/:id`: Get user by ID
- GET `/users/me/profile`: Get current user profile
- PATCH `/users/me`: Update own profile
- PATCH `/users/:id`: Update user (admin/moderator only)
- PATCH `/users/:id/status`: Update user status (admin/moderator only)
- DELETE `/users/:id`: Soft delete user (admin only)
- Use @Roles() decorator for authorization
- Use @CurrentUser() decorator to get authenticated user

#### `dto/update-user.dto.ts`

**Functionality**: User update validation

**Code Instructions**:

- All fields optional
- `fullName`: string, optional
- `email`: string, optional, valid email
- `profilePhoto`: string, optional, URL
- `language`: string, optional, enum ['en', 'bn']

---

### 1.4 Companies Module (`/backend/src/companies/`)

#### `companies.module.ts`

**Functionality**: Company management module

**Code Instructions**:

- Import PrismaModule, FilesModule (for document uploads)
- Register CompaniesService, CompaniesController

#### `companies.service.ts`

**Functionality**: Company business logic

**Code Instructions**:

- `create()`: Create company profile linked to user
- `findAll()`: List companies with filters (status, location, verified)
- `findOne()`: Get company with packages, caregivers, ratings
- `update()`: Update company profile
- `verify()`: Verify company (moderator only, update verification status)
- `getPackages()`: Get company's care packages
- `getCaregivers()`: Get company's caregiver roster
- `getAnalytics()`: Get company analytics (revenue, jobs, ratings)

#### `companies.controller.ts`

**Functionality**: Company HTTP endpoints

**Code Instructions**:

- POST `/companies`: Create company (AGENCY_ADMIN role)
- GET `/companies`: List companies (public with filters)
- GET `/companies/:id`: Get company details (public)
- PATCH `/companies/:id`: Update company (company owner or admin)
- POST `/companies/:id/verify`: Verify company (moderator only)
- GET `/companies/:id/packages`: Get company packages
- GET `/companies/:id/caregivers`: Get company caregivers
- GET `/companies/:id/analytics`: Get analytics (company owner or admin)

#### `dto/create-company.dto.ts`

**Functionality**: Company creation validation

**Code Instructions**:

- `name`: string, required
- `description`: string, optional
- `address`: string, required
- `city`: string, required
- `district`: string, required
- `phone`: string, required, valid phone
- `email`: string, optional, valid email
- `website`: string, optional, valid URL
- `licenseNumber`: string, required
- `licenseDocument`: string, optional, file URL

#### `dto/update-company.dto.ts`

**Functionality**: Company update validation

**Code Instructions**:

- All fields optional, same structure as create

---

### 1.5 Caregivers Module (`/backend/src/caregivers/`)

#### `caregivers.module.ts`

**Functionality**: Caregiver management module

**Code Instructions**:

- Import PrismaModule, FilesModule
- Register CaregiversService, CaregiversController

#### `caregivers.service.ts`

**Functionality**: Caregiver business logic

**Code Instructions**:

- `create()`: Create caregiver profile
- `findAll()`: List caregivers with filters (verified, available, location, skills)
- `findOne()`: Get caregiver with ratings, certifications, availability
- `update()`: Update caregiver profile
- `verify()`: Verify caregiver (6-step verification process)
- `updateAvailability()`: Update caregiver availability calendar
- `getJobs()`: Get caregiver's assigned jobs
- `getEarnings()`: Get caregiver earnings summary
- `uploadDocuments()`: Upload NID, certificates, photos

#### `caregivers.controller.ts`

**Functionality**: Caregiver HTTP endpoints

**Code Instructions**:

- POST `/caregivers`: Create caregiver profile
- GET `/caregivers`: List caregivers (public with filters)
- GET `/caregivers/:id`: Get caregiver details (public)
- PATCH `/caregivers/:id`: Update caregiver (caregiver or company admin)
- POST `/caregivers/:id/verify`: Verify caregiver (moderator only)
- PATCH `/caregivers/:id/availability`: Update availability
- GET `/caregivers/:id/jobs`: Get caregiver jobs
- GET `/caregivers/:id/earnings`: Get earnings (caregiver only)
- POST `/caregivers/:id/documents`: Upload documents

#### `dto/create-caregiver.dto.ts`

**Functionality**: Caregiver creation validation

**Code Instructions**:

- `userId`: string, required (link to User)
- `nidNumber`: string, required
- `nidDocument`: string, required, file URL
- `dateOfBirth`: Date, required
- `gender`: enum, required
- `address`: string, required
- `city`: string, required
- `district`: string, required
- `skills`: string[], optional (array of skill tags)
- `certifications`: string[], optional
- `experienceYears`: number, optional
- `hourlyRate`: Decimal, optional
- `availability`: JSON, optional (availability calendar)

---

### 1.6 Patients Module (`/backend/src/patients/`)

#### `patients.module.ts`

**Functionality**: Patient management module

**Code Instructions**:

- Import PrismaModule, FilesModule
- Register PatientsService, PatientsController

#### `patients.service.ts`

**Functionality**: Patient business logic

**Code Instructions**:

- `create()`: Create patient profile (guardian only)
- `findAll()`: Get guardian's patients
- `findOne()`: Get patient with health records, care plans
- `update()`: Update patient profile
- `addHealthRecord()`: Add health record (prescription, report, etc.)
- `updateCarePlan()`: Update care plan
- `getCareHistory()`: Get care logs for patient
- `delete()`: Soft delete patient

#### `patients.controller.ts`

**Functionality**: Patient HTTP endpoints

**Code Instructions**:

- POST `/patients`: Create patient (guardian only)
- GET `/patients`: Get guardian's patients
- GET `/patients/:id`: Get patient details
- PATCH `/patients/:id`: Update patient (guardian only)
- POST `/patients/:id/health-records`: Add health record
- PATCH `/patients/:id/care-plan`: Update care plan
- GET `/patients/:id/care-history`: Get care history
- DELETE `/patients/:id`: Delete patient (guardian only)

#### `dto/create-patient.dto.ts`

**Functionality**: Patient creation validation

**Code Instructions**:

- `guardianId`: string, required (from authenticated user)
- `fullName`: string, required
- `dateOfBirth`: Date, required
- `gender`: enum, required
- `phone`: string, optional
- `address`: string, required
- `medicalConditions`: string[], optional
- `allergies`: string[], optional
- `medications`: string[], optional
- `emergencyContact`: JSON, required (name, phone, relation)

---

### 1.7 Packages Module (`/backend/src/packages/`)

#### `packages.module.ts`

**Functionality**: Care package management module

**Code Instructions**:

- Import PrismaModule
- Register PackagesService, PackagesController

#### `packages.service.ts`

**Functionality**: Package business logic

**Code Instructions**:

- `create()`: Create care package (company only)
- `findAll()`: List packages with filters (company, price range, services)
- `findOne()`: Get package with details, reviews
- `update()`: Update package
- `delete()`: Soft delete package
- `negotiate()`: Handle package price negotiation (guardian requests, company responds)

#### `packages.controller.ts`

**Functionality**: Package HTTP endpoints

**Code Instructions**:

- POST `/packages`: Create package (company only)
- GET `/packages`: List packages (public)
- GET `/packages/:id`: Get package details
- PATCH `/packages/:id`: Update package (company owner)
- DELETE `/packages/:id`: Delete package (company owner)
- POST `/packages/:id/negotiate`: Request negotiation (guardian)
- PATCH `/packages/:id/negotiate/:requestId`: Respond to negotiation (company)

#### `dto/create-package.dto.ts`

**Functionality**: Package creation validation

**Code Instructions**:

- `companyId`: string, required
- `name`: string, required
- `description`: string, required
- `services`: string[], required (list of services included)
- `duration`: enum, required (HOURLY, DAILY, WEEKLY, MONTHLY)
- `price`: Decimal, required
- `negotiable`: boolean, default false
- `available`: boolean, default true

---

### 1.8 Jobs Module (`/backend/src/jobs/`)

#### `jobs.module.ts`

**Functionality**: Job assignment module

**Code Instructions**:

- Import PrismaModule, ScheduleModule (for cron jobs)
- Register JobsService, JobsController, JobSchedulerService

#### `jobs.service.ts`

**Functionality**: Job business logic

**Code Instructions**:

- `create()`: Create job from package purchase
- `findAll()`: List jobs with filters (status, company, caregiver, patient)
- `findOne()`: Get job with assignments, care logs
- `assignCaregiver()`: Assign primary caregiver (company only)
- `assignBackup()`: Assign backup caregiver
- `updateStatus()`: Update job status (IN_PROGRESS, COMPLETED, CANCELLED)
- `getSchedule()`: Get job schedule with conflicts detection
- `checkIn()`: Caregiver check-in (GPS verified)
- `checkOut()`: Caregiver check-out

#### `jobs.controller.ts`

**Functionality**: Job HTTP endpoints

**Code Instructions**:

- POST `/jobs`: Create job (from package purchase)
- GET `/jobs`: List jobs (filtered by role)
- GET `/jobs/:id`: Get job details
- POST `/jobs/:id/assign`: Assign caregiver (company)
- POST `/jobs/:id/assign-backup`: Assign backup caregiver
- PATCH `/jobs/:id/status`: Update status
- GET `/jobs/:id/schedule`: Get schedule
- POST `/jobs/:id/check-in`: Check-in (caregiver)
- POST `/jobs/:id/check-out`: Check-out (caregiver)

#### `dto/create-job.dto.ts`

**Functionality**: Job creation validation

**Code Instructions**:

- `packageId`: string, required
- `patientId`: string, required
- `startDate`: Date, required
- `endDate`: Date, optional
- `schedule`: JSON, required (recurring schedule or one-time)
- `notes`: string, optional

#### `dto/assign-caregiver.dto.ts`

**Functionality**: Caregiver assignment validation

**Code Instructions**:

- `caregiverId`: string, required
- `isBackup`: boolean, default false
- `startTime`: DateTime, required
- `endTime`: DateTime, required

#### `cron/job-scheduler.service.ts`

**Functionality**: Background job scheduling

**Code Instructions**:

- `@Cron('0 */6 * * *')`: Auto-release escrow after 48 hours
- `@Cron('0 0 * * *')`: Send daily job reminders
- `@Cron('0 0 * * 1')`: Weekly analytics reports
- Use @nestjs/schedule decorators

---

### 1.9 Payments Module (`/backend/src/payments/`)

#### `payments.module.ts`

**Functionality**: Payment processing module

**Code Instructions**:

- Import PrismaModule, ScheduleModule
- Register PaymentsService, PaymentsController, EscrowService
- Register payment providers (BkashService, NagadService)
- Register webhook controllers

#### `payments.service.ts`

**Functionality**: Payment orchestration

**Code Instructions**:

- `createPayment()`: Create payment record from package purchase
- `initiatePayment()`: Initiate payment with gateway (bKash/Nagad)
- `processWebhook()`: Process payment webhook, update status
- `refund()`: Process refund
- `getPaymentHistory()`: Get payment history for user/company
- `getInvoice()`: Generate invoice PDF
- Validate payment amounts, handle currency (BDT)

#### `payments.controller.ts`

**Functionality**: Payment HTTP endpoints

**Code Instructions**:

- POST `/payments`: Create payment
- POST `/payments/:id/initiate`: Initiate payment (returns gateway URL)
- GET `/payments`: Get payment history
- GET `/payments/:id`: Get payment details
- GET `/payments/:id/invoice`: Download invoice
- POST `/payments/:id/refund`: Request refund (admin/guardian)

#### `providers/bkash.service.ts`

**Functionality**: bKash payment gateway integration

**Code Instructions**:

- `getToken()`: Get bKash access token
- `createPayment()`: Create bKash checkout URL
- `executePayment()`: Execute payment
- `queryPayment()`: Query payment status
- `refund()`: Process refund
- Handle HMAC signature verification
- Use bKash sandbox for development

#### `providers/nagad.service.ts`

**Functionality**: Nagad payment gateway integration

**Code Instructions**:

- Similar structure to bKash service
- Implement Nagad PGW API
- Handle webhook verification

#### `escrow/escrow.service.ts`

**Functionality**: Escrow management

**Code Instructions**:

- `holdFunds()`: Hold funds in escrow
- `releaseFunds()`: Release funds to company/caregiver
- `refundFunds()`: Refund to guardian
- `getEscrowStatus()`: Get escrow status
- Auto-release after 48 hours (cron job)

#### `webhooks/bkash-webhook.controller.ts`

**Functionality**: bKash webhook handler

**Code Instructions**:

- POST `/payments/webhooks/bkash`: Receive bKash webhooks
- Verify HMAC signature
- Update payment status
- Trigger escrow hold

#### `dto/create-payment.dto.ts`

**Functionality**: Payment creation validation

**Code Instructions**:

- `packageId`: string, required
- `patientId`: string, required
- `amount`: Decimal, required
- `gateway`: enum, required ('BKASH', 'NAGAD')
- `installmentPlan`: JSON, optional

---

### 1.10 Care Logs Module (`/backend/src/care-logs/`)

#### `care-logs.module.ts`

**Functionality**: Care logging module

**Code Instructions**:

- Import PrismaModule, FilesModule
- Register CareLogsService, CareLogsController

#### `care-logs.service.ts`

**Functionality**: Care log business logic

**Code Instructions**:

- `create()`: Create care log entry
- `findAll()`: Get care logs for job/patient
- `findOne()`: Get care log details
- `update()`: Update care log
- `addVitals()`: Add vitals entry (BP, glucose, temperature)
- `addMedication()`: Log medication given
- `addActivity()`: Log activity performed
- `addIncident()`: Log incident/concern
- `uploadPhoto()`: Upload care log photo

#### `care-logs.controller.ts`

**Functionality**: Care log HTTP endpoints

**Code Instructions**:

- POST `/care-logs`: Create care log (caregiver)
- GET `/care-logs`: Get care logs (filtered by job/patient)
- GET `/care-logs/:id`: Get care log details
- PATCH `/care-logs/:id`: Update care log (caregiver)
- POST `/care-logs/:id/vitals`: Add vitals
- POST `/care-logs/:id/medication`: Log medication
- POST `/care-logs/:id/activity`: Log activity
- POST `/care-logs/:id/incident`: Log incident
- POST `/care-logs/:id/photo`: Upload photo

#### `dto/create-care-log.dto.ts`

**Functionality**: Care log creation validation

**Code Instructions**:

- `jobId`: string, required
- `assignmentId`: string, required
- `checkInTime`: DateTime, required
- `checkOutTime`: DateTime, optional
- `location`: JSON, required (lat, lng from GPS)
- `notes`: string, optional

---

### 1.11 Notifications Module (`/backend/src/notifications/`)

#### `notifications.module.ts`

**Functionality**: Notification module

**Code Instructions**:

- Import PrismaModule
- Register NotificationsService, NotificationsController
- Register notification providers (SmsService, EmailService, PushService)

#### `notifications.service.ts`

**Functionality**: Notification orchestration

**Code Instructions**:

- `send()`: Send notification via preferred channel
- `sendSms()`: Send SMS via Twilio
- `sendEmail()`: Send email via SendGrid
- `sendPush()`: Send push notification via FCM
- `createNotification()`: Save notification to database
- `getNotifications()`: Get user notifications
- `markAsRead()`: Mark notification as read
- Support bilingual (English/Bengali) templates

#### `providers/sms.service.ts`

**Functionality**: SMS provider (Twilio)

**Code Instructions**:

- `send()`: Send SMS
- Format phone numbers for Bangladesh (+880)
- Use Twilio API
- Handle errors and retries

#### `providers/email.service.ts`

**Functionality**: Email provider (SendGrid)

**Code Instructions**:

- `send()`: Send email
- Support HTML templates
- Handle attachments
- Use SendGrid API

#### `providers/push.service.ts`

**Functionality**: Push notification provider (FCM)

**Code Instructions**:

- `send()`: Send push notification
- Handle device tokens
- Support notification payloads
- Use Firebase Cloud Messaging

#### `notifications.controller.ts`

**Functionality**: Notification HTTP endpoints

**Code Instructions**:

- GET `/notifications`: Get user notifications
- PATCH `/notifications/:id/read`: Mark as read
- DELETE `/notifications/:id`: Delete notification
- POST `/notifications/preferences`: Update notification preferences

---

### 1.12 Files Module (`/backend/src/files/`)

#### `files.module.ts`

**Functionality**: File upload module

**Code Instructions**:

- Register FilesService, FilesController
- Configure multer for file uploads
- Set up Cloudflare R2 client

#### `files.service.ts`

**Functionality**: File storage service

**Code Instructions**:

- `upload()`: Upload file to Cloudflare R2
- `delete()`: Delete file from R2
- `getSignedUrl()`: Generate signed URL for private files
- `validateFile()`: Validate file type, size
- Support: images (JPG, PNG), documents (PDF), max 10MB

#### `files.controller.ts`

**Functionality**: File upload endpoints

**Code Instructions**:

- POST `/files/upload`: Upload file (multipart/form-data)
- DELETE `/files/:id`: Delete file
- GET `/files/:id/url`: Get file URL

---

### 1.13 Disputes Module (`/backend/src/disputes/`)

#### `disputes.module.ts`

**Functionality**: Dispute resolution module

**Code Instructions**:

- Import PrismaModule
- Register DisputesService, DisputesController

#### `disputes.service.ts`

**Functionality**: Dispute business logic

**Code Instructions**:

- `create()`: Create dispute (guardian/caregiver)
- `findAll()`: List disputes (moderator/admin)
- `findOne()`: Get dispute with evidence
- `addEvidence()`: Add evidence (photos, documents)
- `respond()`: Add response from company/caregiver
- `resolve()`: Resolve dispute (moderator/admin)
- `escalate()`: Escalate to super admin

#### `disputes.controller.ts`

**Functionality**: Dispute HTTP endpoints

**Code Instructions**:

- POST `/disputes`: Create dispute
- GET `/disputes`: List disputes (filtered by role)
- GET `/disputes/:id`: Get dispute details
- POST `/disputes/:id/evidence`: Add evidence
- POST `/disputes/:id/respond`: Add response
- PATCH `/disputes/:id/resolve`: Resolve dispute (moderator)
- PATCH `/disputes/:id/escalate`: Escalate (moderator)

---

### 1.14 Feedback Module (`/backend/src/feedback/`)

#### `feedback.module.ts`

**Functionality**: Ratings and reviews module

**Code Instructions**:

- Import PrismaModule
- Register FeedbackService, FeedbackController

#### `feedback.service.ts`

**Functionality**: Feedback business logic

**Code Instructions**:

- `create()`: Create rating/review
- `findAll()`: Get feedback with filters
- `update()`: Update feedback (within 24 hours)
- `delete()`: Delete feedback
- `getAverageRating()`: Calculate average rating
- `getFeedbackStats()`: Get feedback statistics

#### `feedback.controller.ts`

**Functionality**: Feedback HTTP endpoints

**Code Instructions**:

- POST `/feedback`: Create feedback
- GET `/feedback`: List feedback
- GET `/feedback/:id`: Get feedback details
- PATCH `/feedback/:id`: Update feedback
- DELETE `/feedback/:id`: Delete feedback
- GET `/feedback/stats/:entityId`: Get feedback stats

---

### 1.15 Analytics Module (`/backend/src/analytics/`)

#### `analytics.module.ts`

**Functionality**: Analytics and reporting module

**Code Instructions**:

- Import PrismaModule
- Register AnalyticsService, AnalyticsController

#### `analytics.service.ts`

**Functionality**: Analytics business logic

**Code Instructions**:

- `getDashboardStats()`: Get platform-wide stats (admin)
- `getCompanyAnalytics()`: Get company-specific analytics
- `getCaregiverAnalytics()`: Get caregiver performance metrics
- `getRevenueReport()`: Generate revenue reports
- `getUserGrowthReport()`: User growth over time
- `getJobCompletionRate()`: Job completion statistics

#### `analytics.controller.ts`

**Functionality**: Analytics HTTP endpoints

**Code Instructions**:

- GET `/analytics/dashboard`: Platform dashboard (admin)
- GET `/analytics/company/:id`: Company analytics
- GET `/analytics/caregiver/:id`: Caregiver analytics
- GET `/analytics/revenue`: Revenue report (admin)
- GET `/analytics/users`: User growth report (admin)

---

### 1.16 Common Module (`/backend/src/common/`)

#### `common/prisma/prisma.service.ts`

**Functionality**: Prisma database service

**Code Instructions**:

- Extend PrismaClient
- Handle connection lifecycle
- Implement onModuleInit, onModuleDestroy
- Export PrismaService for dependency injection

#### `common/prisma/prisma.module.ts`

**Functionality**: Prisma module

**Code Instructions**:

- Export PrismaService globally
- Make available to all modules

#### `common/decorators/current-user.decorator.ts`

**Functionality**: Get current user decorator

**Code Instructions**:

- Extract user from request object
- Use with @UseGuards(JwtAuthGuard)

#### `common/decorators/roles.decorator.ts`

**Functionality**: Roles decorator

**Code Instructions**:

- Set metadata for required roles
- Used with RolesGuard

#### `common/decorators/public.decorator.ts`

**Functionality**: Public endpoint decorator

**Code Instructions**:

- Mark endpoint as public (skip auth)
- Used to bypass JWT guard

#### `common/filters/http-exception.filter.ts`

**Functionality**: Global exception filter

**Code Instructions**:

- Catch all HTTP exceptions
- Format error responses consistently
- Log errors
- Return standardized error format

#### `common/filters/prisma-exception.filter.ts`

**Functionality**: Prisma exception filter

**Code Instructions**:

- Catch Prisma errors (unique constraint, foreign key, etc.)
- Convert to user-friendly HTTP exceptions
- Handle database connection errors

#### `common/guards/throttle.guard.ts`

**Functionality**: Rate limiting guard

**Code Instructions**:

- Implement rate limiting using Redis
- Use @nestjs/throttler or custom implementation
- Limit requests per IP/user

#### `common/interceptors/logging.interceptor.ts`

**Functionality**: Request logging interceptor

**Code Instructions**:

- Log all incoming requests
- Log response times
- Log errors
- Use structured logging (JSON format)

#### `common/interceptors/transform.interceptor.ts`

**Functionality**: Response transformation interceptor

**Code Instructions**:

- Transform responses to consistent format
- Add metadata (timestamp, request ID)
- Format pagination responses

#### `common/pipes/validation.pipe.ts`

**Functionality**: Global validation pipe

**Code Instructions**:

- Use class-validator
- Transform DTOs
- Return detailed validation errors

#### `common/utils/helpers.ts`

**Functionality**: Utility functions

**Code Instructions**:

- `formatPhone()`: Format Bangladesh phone numbers
- `generateOtp()`: Generate 6-digit OTP
- `hashPassword()`: Hash password wrapper
- `comparePassword()`: Compare password wrapper
- `generateInvoiceNumber()`: Generate unique invoice number
- `calculateDistance()`: Calculate GPS distance

#### `common/utils/constants.ts`

**Functionality**: Application constants

**Code Instructions**:

- User roles enum
- Job statuses enum
- Payment statuses enum
- File upload limits
- Rate limit values
- Escrow hold duration (48 hours)

#### `common/utils/validators.ts`

**Functionality**: Custom validators

**Code Instructions**:

- `IsBangladeshPhone()`: Validate BD phone format
- `IsValidNID()`: Validate NID format
- `IsFutureDate()`: Validate future dates
- Custom class-validator decorators

---

### 1.17 Configuration Files

#### `/backend/.env.example`

**Functionality**: Environment variables template

**Code Instructions**:

- Database connection string
- JWT secrets
- Payment gateway credentials
- Redis connection
- Cloudflare R2 credentials
- Notification service credentials
- Frontend URL for CORS
- Port configuration

#### `/backend/tsconfig.json`

**Functionality**: TypeScript configuration

**Code Instructions**:

- Strict mode enabled
- ES2021 target
- Decorator support
- Path aliases

#### `/backend/nest-cli.json`

**Functionality**: NestJS CLI configuration

**Code Instructions**:

- Source root: src
- Delete output directory on build

#### `/backend/jest.config.js`

**Functionality**: Jest test configuration

**Code Instructions**:

- Test environment: node
- Coverage thresholds
- Test file patterns (*.spec.ts)
- Setup files

---

## 2. Detailed Testing Plan

### 2.1 Unit Testing Strategy

#### Test File Naming Convention

- Service tests: `*.service.spec.ts`
- Controller tests: `*.controller.spec.ts`
- Guard tests: `*.guard.spec.ts`
- Utility tests: `*.spec.ts`

#### Test Structure for Each Module

**Example: `auth.service.spec.ts`**

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  
  beforeEach(async () => {
    // Setup test module
    // Mock PrismaService
    // Mock Redis
  });
  
  describe('register', () => {
    it('should create user and send OTP', async () => {
      // Test implementation
    });
    
    it('should throw error if phone exists', async () => {
      // Test implementation
    });
  });
  
  describe('login', () => {
    it('should return tokens on valid credentials', async () => {
      // Test implementation
    });
    
    it('should throw error on invalid credentials', async () => {
      // Test implementation
    });
  });
  
  // More test cases...
});
```

#### Unit Test Coverage Requirements

**Auth Module:**

- `auth.service.spec.ts`: Test all service methods (register, login, MFA, password reset)
- `auth.controller.spec.ts`: Test all endpoints, request/response validation
- `jwt.strategy.spec.ts`: Test JWT validation, user extraction
- `roles.guard.spec.ts`: Test role-based access control

**Users Module:**

- `users.service.spec.ts`: Test CRUD operations, permissions
- `users.controller.spec.ts`: Test endpoints, authorization

**Companies Module:**

- `companies.service.spec.ts`: Test company creation, verification, analytics
- `companies.controller.spec.ts`: Test endpoints, role restrictions

**Caregivers Module:**

- `caregivers.service.spec.ts`: Test caregiver operations, verification workflow
- `caregivers.controller.spec.ts`: Test endpoints

**Patients Module:**

- `patients.service.spec.ts`: Test patient CRUD, health records
- `patients.controller.spec.ts`: Test endpoints, guardian-only access

**Packages Module:**

- `packages.service.spec.ts`: Test package CRUD, negotiation
- `packages.controller.spec.ts`: Test endpoints

**Jobs Module:**

- `jobs.service.spec.ts`: Test job creation, assignment, scheduling
- `jobs.controller.spec.ts`: Test endpoints
- `job-scheduler.service.spec.ts`: Test cron job logic

**Payments Module:**

- `payments.service.spec.ts`: Test payment creation, processing
- `bkash.service.spec.ts`: Test bKash integration (mocked)
- `nagad.service.spec.ts`: Test Nagad integration (mocked)
- `escrow.service.spec.ts`: Test escrow hold/release/refund

**Care Logs Module:**

- `care-logs.service.spec.ts`: Test care log operations
- `care-logs.controller.spec.ts`: Test endpoints

**Notifications Module:**

- `notifications.service.spec.ts`: Test notification sending
- `sms.service.spec.ts`: Test SMS provider (mocked)
- `email.service.spec.ts`: Test email provider (mocked)
- `push.service.spec.ts`: Test push provider (mocked)

**Files Module:**

- `files.service.spec.ts`: Test file upload/download
- `files.controller.spec.ts`: Test endpoints

**Disputes Module:**

- `disputes.service.spec.ts`: Test dispute workflow
- `disputes.controller.spec.ts`: Test endpoints

**Feedback Module:**

- `feedback.service.spec.ts`: Test feedback operations, rating calculations
- `feedback.controller.spec.ts`: Test endpoints

**Analytics Module:**

- `analytics.service.spec.ts`: Test analytics calculations
- `analytics.controller.spec.ts`: Test endpoints

**Common Module:**

- `prisma.service.spec.ts`: Test database connection
- `helpers.spec.ts`: Test utility functions
- `validators.spec.ts`: Test custom validators

#### Mocking Strategy

- Mock PrismaService for all database operations
- Mock Redis for caching/OTP storage
- Mock external services (Twilio, SendGrid, FCM, bKash, Nagad, Cloudflare R2)
- Use Jest mocks and spies

#### Test Data Management

- Create test factories for entities (UserFactory, CompanyFactory, etc.)
- Use test database (separate from development)
- Seed test data before each test suite
- Clean up after each test

---

### 2.2 Integration Testing Strategy

#### Test File Naming Convention

- Integration tests: `*.integration.spec.ts`
- E2E tests: `*.e2e-spec.ts` (in `/backend/test/` directory)

#### Integration Test Structure

**Example: `auth.integration.spec.ts`**

```typescript
describe('Auth Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  beforeAll(async () => {
    // Setup test app with real database
    // Seed test data
  });
  
  afterAll(async () => {
    // Cleanup
    // Close app
  });
  
  describe('POST /auth/register/step1', () => {
    it('should register new user', async () => {
      // Test with real database
    });
  });
  
  describe('POST /auth/login', () => {
    it('should login and return tokens', async () => {
      // Test with real database
    });
  });
});
```

#### Integration Test Coverage

**Authentication Flow:**

- `auth.integration.spec.ts`: Full registration → OTP verification → login flow
- Test JWT token generation and validation
- Test MFA setup and verification
- Test password reset flow

**User Management:**

- `users.integration.spec.ts`: User CRUD with database
- Test role-based access
- Test profile updates

**Company Workflow:**

- `companies.integration.spec.ts`: Company creation → verification → package creation
- Test company analytics calculation

**Caregiver Workflow:**

- `caregivers.integration.spec.ts`: Caregiver registration → verification → availability update
- Test 6-step verification process

**Job Assignment Flow:**

- `jobs.integration.spec.ts`: Package purchase → job creation → caregiver assignment → check-in/out
- Test scheduling conflicts
- Test status transitions

**Payment Flow:**

- `payments.integration.spec.ts`: Payment creation → gateway initiation → webhook processing → escrow hold
- Test refund flow
- Test escrow auto-release (mocked cron)

**Care Logging Flow:**

- `care-logs.integration.spec.ts`: Check-in → vitals entry → medication log → check-out
- Test file uploads

#### Test Database Setup

- Use separate PostgreSQL database for integration tests
- Run migrations before tests
- Seed minimal test data
- Clean up after each test suite

---

### 2.3 End-to-End (E2E) Testing Strategy

#### E2E Test Structure

**Location:** `/backend/test/`

**Example: `auth.e2e-spec.ts`**

```typescript
describe('Auth E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  beforeAll(async () => {
    // Setup test app
    // Setup test database
  });
  
  afterAll(async () => {
    // Cleanup
  });
  
  describe('Complete User Journey', () => {
    it('should complete full registration and login flow', async () => {
      // 1. Register user
      // 2. Verify OTP
      // 3. Login
      // 4. Setup MFA
      // 5. Login with MFA
    });
  });
});
```

#### E2E Test Scenarios

**1. Guardian Journey (`guardian-journey.e2e-spec.ts`):**

- Register as guardian
- Add patient
- Browse companies
- Purchase package
- Monitor care logs
- Rate caregiver
- Request refund

**2. Company Journey (`company-journey.e2e-spec.ts`):**

- Register company
- Get verified by moderator
- Add caregivers
- Create packages
- Receive job assignments
- Assign caregivers
- View analytics

**3. Caregiver Journey (`caregiver-journey.e2e-spec.ts`):**

- Register as caregiver
- Complete verification
- Update availability
- Accept job assignment
- Check-in with GPS
- Log care activities
- Check-out
- View earnings

**4. Payment Flow (`payment-flow.e2e-spec.ts`):**

- Create payment
- Initiate bKash payment (mocked)
- Process webhook
- Verify escrow hold
- Complete job
- Auto-release escrow after 48 hours

**5. Dispute Resolution (`dispute-resolution.e2e-spec.ts`):**

- Guardian creates dispute
- Add evidence
- Company responds
- Moderator resolves
- Verify refund if applicable

#### E2E Test Database

- Use dedicated E2E test database
- Full schema with all migrations
- Seed comprehensive test data
- Reset between test suites

---

### 2.4 Performance Testing

#### Load Testing Scenarios

- **Concurrent Users**: Test with 100, 500, 1000 concurrent users
- **API Endpoints**: Test high-traffic endpoints (login, job list, care logs)
- **Database Queries**: Test complex queries with large datasets
- **File Uploads**: Test concurrent file uploads

#### Tools

- Use `artillery` or `k6` for load testing
- Test scripts in `/backend/test/load/`

#### Performance Benchmarks

- API response time: < 200ms (p95)
- Database query time: < 100ms (p95)
- File upload: < 2s for 5MB file
- Concurrent request handling: 1000 req/s

---

### 2.5 Security Testing

#### Security Test Cases

- **Authentication**: Test JWT token validation, expiry, refresh
- **Authorization**: Test role-based access, permission checks
- **Input Validation**: Test SQL injection, XSS prevention
- **Rate Limiting**: Test rate limit enforcement
- **Password Security**: Test password hashing, strength requirements
- **MFA**: Test MFA bypass attempts
- **File Upload**: Test file type validation, size limits, malicious file detection

#### Security Test Files

- `security.spec.ts`: Security-focused unit tests
- `security.integration.spec.ts`: Security integration tests

---

### 2.6 Test Execution Commands

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:cov

# Watch mode
npm run test:watch

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all

# Load tests
npm run test:load
```

---

## 3. Progress Tracking System

### 3.1 Progress Tracking File Structure

Create `/backend/BACKEND_PROGRESS.md` with the following structure:

```markdown
# Backend Development Progress Tracker

## Overview
- **Start Date**: [Date]
- **Target Completion**: [Date]
- **Current Status**: [In Progress/Testing/Complete]

## Module Development Progress

### Core Application
- [ ] main.ts
- [ ] app.module.ts
- [ ] app.controller.ts
- [ ] app.service.ts

### Authentication Module
- [ ] auth.module.ts
- [ ] auth.service.ts
- [ ] auth.controller.ts
- [ ] DTOs (login, register, mfa, password-reset)
- [ ] Guards (jwt-auth, roles)
- [ ] Strategies (jwt)

### Users Module
- [ ] users.module.ts
- [ ] users.service.ts
- [ ] users.controller.ts
- [ ] DTOs

[... Continue for all modules ...]

## Testing Progress

### Unit Tests
- [ ] Auth module tests
- [ ] Users module tests
- [ ] Companies module tests
[... Continue for all modules ...]

### Integration Tests
- [ ] Auth integration tests
- [ ] Payment flow integration tests
[... Continue for all flows ...]

### E2E Tests
- [ ] Guardian journey
- [ ] Company journey
- [ ] Caregiver journey
- [ ] Payment flow
- [ ] Dispute resolution

### Performance Tests
- [ ] Load testing setup
- [ ] API endpoint benchmarks
- [ ] Database query optimization

### Security Tests
- [ ] Authentication security
- [ ] Authorization security
- [ ] Input validation
- [ ] File upload security

## Code Quality Metrics
- **Test Coverage**: [X]%
- **Linting Errors**: [X]
- **TypeScript Errors**: [X]
- **Code Duplication**: [X]%

## Notes
- [Add development notes, blockers, decisions]
```

### 3.2 Testing Progress File

Create `/backend/TESTING_PROGRESS.md`:

```markdown
# Backend Testing Progress Tracker

## Test Coverage Goals
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: All critical flows
- **E2E Tests**: All user journeys

## Unit Test Progress

### Auth Module
- [ ] auth.service.spec.ts (0/X tests)
- [ ] auth.controller.spec.ts (0/X tests)
- [ ] jwt.strategy.spec.ts (0/X tests)
- [ ] roles.guard.spec.ts (0/X tests)

[... Continue for all modules ...]

## Integration Test Progress

### Authentication Flow
- [ ] Registration flow (0/X tests)
- [ ] Login flow (0/X tests)
- [ ] MFA flow (0/X tests)
- [ ] Password reset flow (0/X tests)

[... Continue for all flows ...]

## E2E Test Progress

### User Journeys
- [ ] Guardian journey (0/X scenarios)
- [ ] Company journey (0/X scenarios)
- [ ] Caregiver journey (0/X scenarios)

[... Continue for all journeys ...]

## Test Execution Log

### [Date]
- Executed: Unit tests for Auth module
- Results: 15/15 passed
- Coverage: 85%
- Notes: All auth service methods tested

### [Date]
- Executed: Integration tests for Payment flow
- Results: 8/10 passed, 2 failed
- Issues: Escrow auto-release timing issue
- Notes: Fixed cron job scheduling

## Test Metrics
- **Total Unit Tests**: [X]
- **Total Integration Tests**: [X]
- **Total E2E Tests**: [X]
- **Overall Coverage**: [X]%
- **Passing Rate**: [X]%
```

### 3.3 Progress Tracking Workflow

1. **Daily Updates**: Update progress files at end of each day
2. **Checkbox System**: Use checkboxes to track completion
3. **Test Counts**: Track number of tests written vs. planned
4. **Coverage Reports**: Update coverage percentages after test runs
5. **Issue Logging**: Document blockers and resolutions in Notes section

### 3.4 Automated Progress Tracking (Optional)

Create `/backend/scripts/track-progress.js`:

- Scans test files and counts tests
- Calculates coverage from Jest reports
- Updates progress markdown files automatically
- Run via: `npm run track-progress`

---

## Implementation Priority

### Phase 1: Core Infrastructure (Week 1-2)

1. Core application files (main.ts, app.module.ts)
2. Common module (Prisma, decorators, guards, filters)
3. Auth module (complete implementation)
4. Users module (basic CRUD)

### Phase 2: Business Modules (Week 3-5)

1. Companies module
2. Caregivers module
3. Patients module
4. Packages module

### Phase 3: Workflow Modules (Week 6-8)

1. Jobs module
2. Care logs module
3. Payments module (with escrow)
4. Notifications module

### Phase 4: Supporting Modules (Week 9-10)

1. Files module
2. Disputes module
3. Feedback module
4. Analytics module

### Phase 5: Testing (Week 11-12)

1. Unit tests for all modules
2. Integration tests for critical flows
3. E2E tests for user journeys
4. Performance and security testing

---

## Success Criteria

### Development Complete When:

- [ ] All modules implemented
- [ ] All endpoints functional
- [ ] Database migrations complete
- [ ] Environment configuration documented
- [ ] API documentation complete (Swagger)

### Testing Complete When:

- [ ] 80%+ unit test coverage
- [ ] All integration tests passing
- [ ] All E2E scenarios passing
- [ ] Performance benchmarks met
- [ ] Security tests passing
- [ ] No critical bugs

### Ready for Production When:

- [ ] All tests passing
- [ ] Code review completed
- [ ] Documentation complete
- [ ] Deployment scripts ready
- [ ] Monitoring configured
- [ ] Backup strategy in place
