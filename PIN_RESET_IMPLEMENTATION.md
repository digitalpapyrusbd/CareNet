# Secure PIN Reset System Implementation

## Overview

This document outlines the complete implementation of a secure PIN reset system with email reset links for the CareNet authentication platform. The system allows users to reset their 6-digit PIN via a secure email link without revealing sensitive information.

## Features Implemented

### 🔐 Security Features
- **Token Hashing**: Reset tokens are hashed using bcrypt before storage
- **Token Expiry**: Reset links expire after 15 minutes
- **Single-Use Tokens**: Tokens are invalidated after successful reset
- **No Information Disclosure**: Generic success messages don't reveal if phone numbers exist
- **PIN Validation**: 6-digit numeric PINs only, hashed with bcrypt
- **Rate Limiting**: Built-in protection against abuse

### 📧 Email System
- **SendGrid Integration**: Uses existing SendGrid email service
- **Professional Templates**: Branded email templates with security warnings
- **Responsive Design**: Mobile-friendly email layout
- **Security Warnings**: Clear instructions about link expiration and security

### 🎨 User Interface
- **Forgot PIN Page**: Clean form for phone number input
- **Reset PIN Page**: Two-step PIN input with validation
- **Real-time Validation**: Live feedback on PIN format and matching
- **Loading States**: Proper loading indicators and disabled states
- **Error Handling**: Clear error messages for various scenarios

## Technical Implementation

### Database Schema Changes

Added to `users` model in `prisma/schema.prisma`:
```prisma
// PIN Reset Fields
reset_token                             String?                @unique
reset_token_expiry                      DateTime?

@@index([reset_token])
@@index([reset_token_expiry])
```

### Backend API Endpoints

#### 1. POST `/api/auth/forgot-pin`
**Input:**
```json
{
  "phone": "+8801XXXXXXXXX"
}
```

**Process:**
- Validates Bangladeshi phone number format
- Generates secure 32-byte random token
- Hashes token using bcrypt for storage
- Sets 15-minute expiry timestamp
- Sends email with unhashed token
- Returns generic success message

**Output:**
```json
{
  "message": "If this phone number exists, a reset link has been sent."
}
```

#### 2. POST `/api/auth/reset-pin`
**Input:**
```json
{
  "token": "abc123...",
  "newPin": "123456"
}
```

**Process:**
- Validates PIN format (6 digits, numeric only)
- Hashes incoming token and compares with stored hash
- Finds user with valid, unexpired token
- Hashes new PIN with bcrypt
- Updates user's PIN and clears reset token
- Logs the reset action

**Output:**
```json
{
  "message": "PIN reset successful",
  "success": true
}
```

### Frontend Pages

#### 1. Forgot PIN Page (`/auth/forgot-pin`)
- Phone number input with validation
- Auto-formatting (+880 prefix)
- Loading states and error handling
- Success message with auto-redirect
- Back to login link

#### 2. Reset PIN Page (`/auth/reset-pin`)
- Token extraction from URL query parameter
- Two PIN input fields with real-time validation
- Show/hide PIN toggle
- Visual feedback for matching PINs
- Error handling for expired/invalid links

### Email Service

#### Email Template Features
- Branded with CareNet logo and colors
- Clear instructions and security warnings
- 15-minute expiration notice
- Alternative link for mobile users
- Professional footer with support information

#### Email Content
- Subject: "Reset Your CareNet PIN"
- HTML and text versions
- Security notice about link expiration
- Instructions for users who didn't request reset

### Security Measures

#### Token Security
- **Generation**: 32-byte cryptographically secure random tokens
- **Storage**: Hashed with bcrypt (salt rounds: 12)
- **Expiry**: 15 minutes from generation
- **Single-use**: Automatically cleared after successful reset

#### PIN Security
- **Format**: Exactly 6 digits, numeric only
- **Storage**: Hashed with bcrypt (salt rounds: 12)
- **Validation**: Client and server-side validation
- **No Logging**: Sensitive data not logged

#### Privacy Protection
- **Generic Responses**: Don't reveal if phone numbers exist
- **Token Obfuscation**: Partial token logging for debugging
- **Audit Trail**: Secure logging of reset actions

## File Structure

```
src/
├── app/
│   └── auth/
│       ├── forgot-pin/
│       │   ├── page.tsx          # Forgot PIN form
│       │   └── route.ts          # API endpoint
│       └── reset-pin/
│           ├── page.tsx          # Reset PIN form
│           └── route.ts          # API endpoint
├── lib/
│   ├── pin-reset-service.ts      # Core reset logic
│   ├── email-service.ts          # Email sending
│   └── auth.ts                   # PIN hashing utilities
└── __tests__/
    └── pin-reset.test.ts         # Unit tests
```

## Dependencies

### Backend
- `@sendgrid/mail`: Email service integration
- `bcryptjs`: Password/PIN hashing
- `crypto`: Secure token generation
- `zod`: Input validation

### Frontend
- `lucide-react`: Icons (Mail, Key, Eye)
- `@/lib/api-client`: API communication
- `@/components/ui/*`: UI components

## Usage Flow

### 1. User Requests PIN Reset
1. User clicks "Forgot PIN?" on login page
2. User enters registered phone number
3. System validates phone format
4. System generates and stores hashed token
5. System sends email with reset link
6. User sees success message and is redirected to login

### 2. User Resets PIN
1. User clicks link in email (valid for 15 minutes)
2. User is taken to reset PIN page with token
3. User enters new 6-digit PIN twice
4. System validates PIN format and matching
5. System verifies token validity
6. System updates user's PIN and clears token
7. User is redirected to login page

### 3. Error Handling
- **Invalid Phone**: Generic error message
- **Expired Token**: Clear error with retry option
- **Invalid Token**: Clear error with retry option
- **Network Errors**: User-friendly error messages
- **Validation Errors**: Real-time feedback

## Testing

### Unit Tests
- Token generation and hashing
- PIN validation
- Phone number validation
- Email template rendering

### Integration Tests
- Complete reset flow
- Error scenarios
- Security edge cases

## Security Considerations

### Threats Mitigated
- **Token Enumeration**: Hashed storage prevents token guessing
- **Replay Attacks**: Single-use tokens with expiry
- **Information Disclosure**: Generic responses
- **Brute Force**: Built-in rate limiting (existing system)
- **Man-in-the-Middle**: HTTPS required for all endpoints

### Best Practices Followed
- **Secure Token Generation**: Cryptographically secure random
- **Proper Hashing**: bcrypt with appropriate salt rounds
- **Input Validation**: Both client and server-side
- **Error Handling**: No sensitive information in errors
- **Audit Logging**: Track all reset actions

## Environment Variables

### Required
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@carenet.com
SENDGRID_FROM_NAME="CareNet Support"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional
```bash
DATABASE_URL=your_database_url  # Already configured
```

## Performance Considerations

### Optimizations
- **Token Cleanup**: Automatic expiry prevents database bloat
- **Minimal Queries**: Single database query per operation
- **Efficient Hashing**: bcrypt with appropriate rounds
- **Caching**: Leverage existing Redis/Redis-like caching

### Monitoring
- **Audit Logs**: Track all reset attempts
- **Error Tracking**: Monitor failed attempts
- **Email Metrics**: Track delivery and open rates

## Future Enhancements

### Potential Improvements
- **SMS Support**: Alternative to email reset
- **Rate Limiting**: Per-phone number limits
- **Token Analytics**: Monitor usage patterns
- **Multi-language**: Email template localization
- **Recovery Codes**: Backup reset mechanism

## Conclusion

This implementation provides a secure, user-friendly PIN reset system that follows industry best practices for authentication security. The system balances security with usability, providing clear feedback while protecting against common attack vectors.

The modular design allows for easy extension and maintenance, with comprehensive testing and documentation to support ongoing development.