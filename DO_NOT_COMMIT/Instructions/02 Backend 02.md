# Backend Documentation 02 - Authentication & User Management

**Version**: 2.0  
**Last Updated**: December 11, 2025  
**Modules**: Auth, Users  
**Priority**: 🔴 Critical

---

## 📋 Overview

This document covers the **Authentication & User Management** system, which forms the foundation of security and user access control for the entire platform.

### **Modules Covered**
- **Auth Module** - Authentication, JWT tokens, MFA, password reset
- **Users Module** - User profile management, CRUD operations

### **Key Features**
- JWT authentication with refresh tokens
- Multi-factor authentication (MFA) with TOTP
- OTP verification via Redis
- 3-step password reset flow
- Role-based access control (10 user roles)
- Session management
- Account lockout integration

---

## 🔐 Authentication Module

**Path**: `/backend/src/auth/`

### **Module Files**
```
auth/
├── auth.module.ts           # Module configuration
├── auth.service.ts          # Business logic
├── auth.controller.ts       # HTTP endpoints
├── dto/
│   ├── login.dto.ts        # Login validation
│   ├── register.dto.ts     # Registration validation
│   ├── mfa.dto.ts          # MFA validation
│   └── password-reset.dto.ts
├── guards/
│   ├── jwt-auth.guard.ts   # JWT validation
│   └── roles.guard.ts      # RBAC guard
└── strategies/
    └── jwt.strategy.ts     # Passport JWT strategy
```

---

## 🎯 Core Authentication Features

### **1. Registration Flow (2-Step)**

#### **Step 1: Register**
```typescript
POST /api/auth/register/step1

Request Body:
{
  "phone": "+8801712345678",
  "password": "SecurePass123!",
  "role": "GUARDIAN",
  "fullName": "Ahmed Hassan",
  "email": "ahmed@example.com"
}

Response:
{
  "success": true,
  "message": "OTP sent to +8801712345678",
  "userId": "uuid",
  "expiresIn": 600 // seconds
}
```

**Implementation**:
- Validate phone number format (Bangladesh: +880)
- Check if phone already exists
- Hash password using bcryptjs (10 rounds)
- Create user with status `PENDING_VERIFICATION`
- Generate 6-digit OTP
- Store OTP in Redis with 10-minute expiry
- Send OTP via SMS (Twilio)
- Return userId for Step 2

#### **Step 2: Verify OTP**
```typescript
POST /api/auth/register/verify-otp

Request Body:
{
  "userId": "uuid",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "Account verified successfully",
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "uuid",
    "phone": "+8801712345678",
    "role": "GUARDIAN",
    "status": "ACTIVE"
  }
}
```

**Implementation**:
- Validate OTP from Redis
- Update user status to `ACTIVE`
- Delete OTP from Redis
- Generate JWT access token (15 minutes expiry)
- Generate refresh token (7 days expiry)
- Store refresh token in database
- Return tokens and user profile

---

### **2. Login Flow**

#### **Basic Login**
```typescript
POST /api/auth/login

Request Body:
{
  "phone": "+8801712345678",
  "password": "SecurePass123!"
}

Response (MFA Disabled):
{
  "success": true,
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "user": { ... }
}

Response (MFA Enabled):
{
  "success": true,
  "mfaRequired": true,
  "tempToken": "temp-jwt-token"
}
```

**Implementation**:
- Validate phone and password
- Check account status (ACTIVE, SUSPENDED, LOCKED)
- If account LOCKED, check lockout reason (payment/security)
- If MFA enabled, generate temp token and require MFA
- If MFA disabled, generate tokens and return
- Update lastLoginAt timestamp

#### **MFA Verification**
```typescript
POST /api/auth/mfa/verify

Request Body:
{
  "tempToken": "temp-jwt-token",
  "code": "123456"
}

Response:
{
  "success": true,
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "user": { ... }
}
```

**Implementation**:
- Validate temp token
- Verify TOTP code using speakeasy
- Generate final access and refresh tokens
- Return authenticated session

---

### **3. Multi-Factor Authentication (MFA)**

#### **Setup MFA**
```typescript
POST /api/auth/mfa/setup
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,...",
  "backupCodes": [
    "ABCD-1234",
    "EFGH-5678",
    "IJKL-9012"
  ]
}
```

**Implementation**:
- Generate TOTP secret using speakeasy
- Create QR code using qrcode library
- Generate 5 backup codes (8-character alphanumeric)
- Store secret and backup codes in database (encrypted)
- Return QR code for Google Authenticator/Authy

#### **Enable MFA**
```typescript
POST /api/auth/mfa/enable

Request Body:
{
  "code": "123456"
}

Response:
{
  "success": true,
  "message": "MFA enabled successfully"
}
```

**Implementation**:
- Verify TOTP code
- Set `mfaEnabled` to true
- Update user record

#### **Disable MFA**
```typescript
POST /api/auth/mfa/disable

Request Body:
{
  "password": "CurrentPassword123!",
  "code": "123456"
}

Response:
{
  "success": true,
  "message": "MFA disabled successfully"
}
```

**Implementation**:
- Verify password
- Verify TOTP code
- Set `mfaEnabled` to false
- Clear MFA secret and backup codes

---

### **4. Password Reset (3-Step Process)**

#### **Step 1: Request Reset**
```typescript
POST /api/auth/password-reset/request

Request Body:
{
  "phone": "+8801712345678"
}

Response:
{
  "success": true,
  "message": "OTP sent to +8801712345678",
  "expiresIn": 600
}
```

**Implementation**:
- Validate phone exists
- Generate 6-digit OTP
- Store OTP in Redis (10-minute expiry)
- Send OTP via SMS and Email
- Rate limit: 3 attempts per hour per phone

#### **Step 2: Verify OTP**
```typescript
POST /api/auth/password-reset/verify

Request Body:
{
  "phone": "+8801712345678",
  "otp": "123456"
}

Response:
{
  "success": true,
  "resetToken": "reset-token-jwt"
}
```

**Implementation**:
- Validate OTP from Redis
- Generate reset token (15-minute expiry)
- Store reset token in Redis
- Return reset token

#### **Step 3: Complete Reset**
```typescript
POST /api/auth/password-reset/complete

Request Body:
{
  "resetToken": "reset-token-jwt",
  "newPassword": "NewSecurePass123!"
}

Response:
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Implementation**:
- Validate reset token from Redis
- Hash new password
- Update user password
- Delete reset token from Redis
- Invalidate all existing refresh tokens
- Send confirmation email

---

### **5. Token Management**

#### **Refresh Token**
```typescript
POST /api/auth/refresh

Request Body:
{
  "refreshToken": "refresh-token"
}

Response:
{
  "success": true,
  "accessToken": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```

**Implementation**:
- Validate refresh token from database
- Check expiry (7 days)
- Generate new access token (15 minutes)
- Optionally rotate refresh token
- Return new tokens

#### **Logout**
```typescript
POST /api/auth/logout
Authorization: Bearer {accessToken}

Request Body:
{
  "refreshToken": "refresh-token"
}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Implementation**:
- Invalidate refresh token in database
- Add access token to Redis blacklist (until expiry)
- Clear any session data

---

## 👤 Users Module

**Path**: `/backend/src/users/`

### **Module Files**
```
users/
├── users.module.ts         # Module configuration
├── users.service.ts        # Business logic
├── users.controller.ts     # HTTP endpoints
└── dto/
    └── update-user.dto.ts  # Update validation
```

---

## 🎯 User Management Features

### **1. Get All Users**
```typescript
GET /api/users
Authorization: Bearer {accessToken}
Roles: SUPER_ADMIN, PLATFORM_ADMIN

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- role: UserRole (filter by role)
- status: UserStatus (filter by status)
- search: string (search by name/phone)

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "phone": "+8801712345678",
      "fullName": "Ahmed Hassan",
      "email": "ahmed@example.com",
      "role": "GUARDIAN",
      "status": "ACTIVE",
      "profilePhoto": "https://...",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### **2. Get User by ID**
```typescript
GET /api/users/:id
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "phone": "+8801712345678",
    "fullName": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "role": "GUARDIAN",
    "status": "ACTIVE",
    "profilePhoto": "https://...",
    "mfaEnabled": true,
    "lastLoginAt": "2025-12-11T10:30:00Z",
    "createdAt": "2025-01-01T00:00:00Z",
    // Role-specific profile
    "guardianProfile": {
      "patients": [...],
      "address": "...",
      "emergencyContact": "..."
    }
  }
}
```

### **3. Get Current User Profile**
```typescript
GET /api/users/me
Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "phone": "+8801712345678",
    "fullName": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "role": "GUARDIAN",
    "status": "ACTIVE",
    "profilePhoto": "https://...",
    "mfaEnabled": true,
    "subscription": {
      "tier": "PREMIUM",
      "expiresAt": "2026-01-01T00:00:00Z"
    },
    "guardianProfile": {...}
  }
}
```

### **4. Update User Profile**
```typescript
PATCH /api/users/:id
Authorization: Bearer {accessToken}

Request Body:
{
  "fullName": "Ahmed Hassan Updated",
  "email": "newemail@example.com",
  "profilePhoto": "https://...",
  "guardianProfile": {
    "address": "123 Main St, Dhaka",
    "emergencyContact": "+8801987654321"
  }
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ...updatedUser }
}
```

**Permissions**:
- Users can update their own profile
- Admins can update any profile
- Cannot change: phone, role, status (use dedicated endpoints)

### **5. Update User Status**
```typescript
PATCH /api/users/:id/status
Authorization: Bearer {accessToken}
Roles: PLATFORM_ADMIN, SUPER_ADMIN

Request Body:
{
  "status": "SUSPENDED",
  "reason": "Violation of terms"
}

Response:
{
  "success": true,
  "message": "User status updated to SUSPENDED"
}
```

**Status Options**:
- `ACTIVE` - Normal operation
- `SUSPENDED` - Temporary suspension
- `LOCKED` - Payment or security lockout
- `PENDING_VERIFICATION` - Awaiting verification
- `BANNED` - Permanent ban

### **6. Delete User**
```typescript
DELETE /api/users/:id
Authorization: Bearer {accessToken}
Roles: SUPER_ADMIN

Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Implementation**:
- Soft delete (set `deletedAt` timestamp)
- Anonymize personal data
- Keep records for audit purposes
- Cannot delete users with active jobs/payments

---

## 🔑 User Roles & Permissions

### **Role Hierarchy**
```typescript
enum UserRole {
  SUPER_ADMIN       // Level 10 - Supreme authority
  PLATFORM_ADMIN    // Level 9  - Platform operations
  MODERATOR         // Level 8  - Quality control
  AGENCY_ADMIN      // Level 7  - Agency owner
  AGENCY_MANAGER    // Level 6  - Delegated QA
  CAREGIVER         // Level 5  - Care providers
  GUARDIAN          // Level 4  - Care purchasers
  PATIENT           // Level 3  - Care recipients
  SHOP_ADMIN        // Level 2  - Shop owner
  SHOP_MANAGER      // Level 1  - Shop operations
}
```

### **Permission Matrix**

| Action | Super Admin | Platform Admin | Moderator | Agency Admin | Caregiver | Guardian |
|--------|-------------|----------------|-----------|--------------|-----------|----------|
| View all users | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update any user | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Suspend users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Enable MFA | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🛡️ Security Implementation

### **Password Requirements**
```typescript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

Requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
```

### **JWT Configuration**
```typescript
const jwtConfig = {
  accessToken: {
    secret: process.env.JWT_SECRET,
    expiresIn: '15m'
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d'
  }
};
```

### **Rate Limiting**
```typescript
const rateLimits = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts'
  },
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many reset attempts'
  },
  otpRequest: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many OTP requests'
  }
};
```

### **Account Lockout**
```typescript
// After 5 failed login attempts
const lockoutConfig = {
  maxAttempts: 5,
  lockoutDuration: 30 * 60 * 1000, // 30 minutes
  resetAfterSuccess: true
};

// Auto-unlock after lockout duration
// Admin can manually unlock
```

---

## 📊 Database Schema

### **User Model**
```prisma
model User {
  id                String      @id @default(uuid())
  phone             String      @unique
  email             String?     @unique
  password          String
  fullName          String?
  profilePhoto      String?
  
  role              UserRole
  status            UserStatus  @default(PENDING_VERIFICATION)
  
  // MFA
  mfaEnabled        Boolean     @default(false)
  mfaSecret         String?
  backupCodes       String[]
  
  // Tracking
  lastLoginAt       DateTime?
  failedLoginCount  Int         @default(0)
  lockedUntil       DateTime?
  
  // Timestamps
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  deletedAt         DateTime?
  
  // Relations
  refreshTokens     RefreshToken[]
  guardianProfile   Guardian?
  caregiverProfile  Caregiver?
  companyProfile    Company?
}

model RefreshToken {
  id          String    @id @default(uuid())
  token       String    @unique
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  expiresAt   DateTime
  createdAt   DateTime  @default(now())
  revokedAt   DateTime?
}
```

---

## 🧪 Testing

### **Unit Tests**
```typescript
describe('AuthService', () => {
  it('should register user and send OTP');
  it('should verify OTP and activate account');
  it('should login with valid credentials');
  it('should require MFA if enabled');
  it('should setup MFA correctly');
  it('should handle password reset flow');
  it('should refresh tokens');
  it('should logout and invalidate tokens');
});
```

### **E2E Tests**
```typescript
describe('Auth Endpoints', () => {
  it('POST /auth/register/step1 - success');
  it('POST /auth/register/verify-otp - success');
  it('POST /auth/login - success');
  it('POST /auth/login - invalid credentials');
  it('POST /auth/mfa/setup - success');
  it('POST /auth/mfa/verify - success');
  it('POST /auth/refresh - success');
  it('POST /auth/logout - success');
});
```

---

## 🔧 Environment Variables

```env
# JWT
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# Redis (for OTP storage)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Twilio (for SMS OTP)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid (for email)
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@caregiver-platform.com

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

---

## 🚀 API Usage Examples

### **Complete Registration Flow**
```javascript
// Step 1: Register
const registerResponse = await fetch('/api/auth/register/step1', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+8801712345678',
    password: 'SecurePass123!',
    role: 'GUARDIAN',
    fullName: 'Ahmed Hassan'
  })
});
const { userId } = await registerResponse.json();

// Step 2: Verify OTP (from SMS)
const verifyResponse = await fetch('/api/auth/register/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId,
    otp: '123456'
  })
});
const { accessToken, refreshToken } = await verifyResponse.json();

// Store tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
```

### **Login with MFA**
```javascript
// Step 1: Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+8801712345678',
    password: 'SecurePass123!'
  })
});
const loginData = await loginResponse.json();

if (loginData.mfaRequired) {
  // Step 2: Verify MFA
  const mfaCode = prompt('Enter MFA code from authenticator app');
  const mfaResponse = await fetch('/api/auth/mfa/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tempToken: loginData.tempToken,
      code: mfaCode
    })
  });
  const { accessToken, refreshToken } = await mfaResponse.json();
  // Store tokens
}
```

---

## 📚 Related Documentation

- [02 Backend 01.md](02%20Backend%2001.md) - Architecture & Project Structure
- [02 Backend 03.md](02%20Backend%2003.md) - Companies & Agency Management
- [02 Backend 13.md](02%20Backend%2013.md) - Lockout & Payment Enforcement

---

**Status**: ✅ Implemented & Tested  
**Last Reviewed**: December 11, 2025
