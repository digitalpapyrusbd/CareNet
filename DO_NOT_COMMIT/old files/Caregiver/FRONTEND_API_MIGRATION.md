# Frontend API Migration Guide

## Overview
All frontend API route handlers have been migrated to NestJS backend. Frontend pages need to be updated to call the backend directly using `api-client.ts`.

## Migration Pattern

### Before (Old Pattern):
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});

if (response.ok) {
  const result = await response.json();
  // handle success
} else {
  const error = await response.json();
  // handle error
}
```

### After (New Pattern):
```typescript
import { api } from '@/lib/api-client';

try {
  const result = await api.post('/auth/login', data);
  // handle success
} catch (error: any) {
  // handle error (error.message contains the message)
}
```

## Files Requiring Updates

### Authentication Pages (High Priority)
- [x] `/src/app/auth/register/page.tsx` - Import added
  - Line 144: `fetch('/api/auth/register')` → `api.post('/auth/register')`
  - Line 178: `fetch('/api/auth/verify-otp')` → `api.post('/auth/verify-otp')`

- [ ] `/src/app/auth/login/page.tsx`
  - Line 105: `fetch('/api/auth/send-otp')` → `api.post('/auth/send-otp')`

- [ ] `/src/app/auth/setup-mfa/page.tsx`
  - Line 51: `fetch('/api/auth/setup-mfa')` → `api.post('/auth/setup-mfa')`
  - Line 77: `fetch('/api/auth/verify-mfa-setup')` → `api.post('/auth/verify-mfa-setup')`
  - Line 109: `fetch('/api/auth/generate-backup-codes')` → `api.post('/auth/generate-backup-codes')`

- [ ] `/src/app/auth/reset-password/page.tsx`
  - Line 86: `fetch('/api/auth/reset-password')` → `api.post('/auth/reset-password')`
  - Line 111: `fetch('/api/auth/verify-reset-otp')` → `api.post('/auth/verify-reset-otp')`

### Dashboard Pages (High Priority)
- [ ] `/src/app/dashboard/super-admin/page.tsx`
  - Line 58: `fetch('/api/admin/metrics')` → `api.get('/analytics/overview')`
  - Line 65: `fetch('/api/admin/activities')` → `api.get('/audit-logs')` (needs endpoint)

- [ ] `/src/app/dashboard/moderator/page.tsx`
  - Line 56: `fetch('/api/moderation/verifications')` → `api.get('/users?kyc_status=PENDING')`
  - Line 63: `fetch('/api/moderation/disputes')` → `api.get('/disputes')`
  - Line 146: `fetch('/api/moderation/verifications/action')` → `api.patch('/users/{id}')`
  - Line 172: `fetch('/api/moderation/disputes/action')` → `api.patch('/disputes/{id}/resolve')`

### Feature Pages (Medium Priority)
- [ ] `/src/app/feedback/create/page.tsx`
  - Line 49: `fetch('/api/jobs?status=COMPLETED&limit=50')` → `api.get('/jobs?status=COMPLETED&limit=50')`
  - Line 82: `fetch(\`/api/jobs/\${selectedJob}\`)` → `api.get(\`/jobs/\${selectedJob}\`)`
  - Line 118: `fetch('/api/feedback')` → `api.post('/feedback')`

- [ ] `/src/app/feedback/[id]/page.tsx`
  - Line 35: `fetch(\`/api/feedback/\${params.id}\`)` → `api.get(\`/feedback/\${params.id}\`)`
  - Line 289: `fetch(\`/api/feedback/\${feedback.id}/flag\`)` → `api.patch(\`/feedback/\${feedback.id}\`)` (flag action)

- [ ] `/src/app/feedback/[id]/respond/page.tsx`
  - Line 37: `fetch(\`/api/feedback/\${params.id}\`)` → `api.get(\`/feedback/\${params.id}\`)`
  - Line 69: `fetch(\`/api/feedback/\${params.id}/respond\`)` → `api.patch(\`/feedback/\${params.id}\`)`

- [ ] `/src/app/feedback/page.tsx`
  - Line 58: `fetch(url)` → `api.get(url)` (where url = '/feedback/...')

- [ ] `/src/app/care-logs/page.tsx`
  - Line 58: `fetch(url)` → `api.get(url)` (where url = '/care-logs/...')
  - Line 86: `fetch(\`/api/care-logs/\${logId}\`)` → `api.delete(\`/care-logs/\${logId}\`)`

- [ ] `/src/app/jobs/page.tsx`
  - Line 46: `fetch(url)` → `api.get(url)` (where url = '/jobs/...')
  - Line 74: `fetch(\`/api/jobs/\${jobId}\`)` → `api.delete(\`/jobs/\${jobId}\`)`

### Other Pages (Low Priority)
- [ ] `/src/app/profile/page.tsx`
  - Line 51: `fetch('/api/users/[id]')` → `api.get(\`/users/\${userId}\`)`
  - Line 86: `fetch('/api/auth/setup-mfa')` → `api.post('/auth/setup-mfa')`

- [ ] `/src/app/notifications/page.tsx`
  - Line 123: `fetch('/api/notifications?markAsRead=true')` → `api.patch('/notifications/{id}/read')`

- [ ] `/src/app/verification/page.tsx`
  - Line 48: `fetch(url)` → `api.get(url)`
  - Line 89: `fetch('/api/verification')` → `api.post('/verification')`
  - Line 129: `fetch('/api/verification')` → `api.patch('/verification/{id}')`

## Backend Endpoint Mapping

| Old Frontend Route | New Backend Endpoint | Method |
|-------------------|---------------------|--------|
| `/api/auth/register` | `/auth/register` | POST |
| `/api/auth/login` | `/auth/login` | POST |
| `/api/auth/verify-otp` | `/auth/verify-otp` | POST |
| `/api/auth/refresh` | `/auth/refresh` | POST |
| `/api/auth/me` | `/auth/me` | GET |
| `/api/feedback` | `/feedback` | POST |
| `/api/feedback/{id}` | `/feedback/{id}` | GET |
| `/api/feedback/{id}` | `/feedback/{id}` | PATCH |
| `/api/care-logs` | `/care-logs` | POST |
| `/api/care-logs/job/{jobId}` | `/care-logs/job/{jobId}` | GET |
| `/api/care-logs/{id}` | `/care-logs/{id}` | PATCH |
| `/api/notifications` | `/notifications` | GET |
| `/api/notifications/{id}/read` | `/notifications/{id}/read` | PATCH |
| `/api/disputes` | `/disputes` | POST |
| `/api/disputes/{id}` | `/disputes/{id}` | GET |
| `/api/disputes/{id}/assign` | `/disputes/{id}/assign` | PATCH |
| `/api/disputes/{id}/resolve` | `/disputes/{id}/resolve` | PATCH |
| `/api/payments/create` | `/payments/create` | POST |
| `/api/payments/bkash/callback` | `/payments/bkash/callback` | GET |
| `/api/payments/nagad/callback` | `/payments/nagad/callback` | GET |
| `/api/payments/refund` | `/payments/refund` | POST |
| `/api/admin/metrics` | `/analytics/overview` | GET |
| `/api/analytics/users` | `/analytics/users` | GET |
| `/api/analytics/revenue` | `/analytics/revenue` | GET |
| `/api/analytics/caregivers` | `/analytics/caregivers` | GET |
| `/api/analytics/companies` | `/analytics/companies` | GET |

## Implementation Steps

1. **Import api-client in each file:**
   ```typescript
   import { api } from '@/lib/api-client';
   ```

2. **Replace fetch calls with api methods:**
   - GET requests: `api.get(endpoint)`
   - POST requests: `api.post(endpoint, data)`
   - PATCH requests: `api.patch(endpoint, data)`
   - DELETE requests: `api.delete(endpoint)`

3. **Update error handling:**
   ```typescript
   try {
     const result = await api.post('/endpoint', data);
     // Success
   } catch (error: any) {
     console.error(error.message);
     // Show error to user
   }
   ```

4. **Remove frontend API route handlers** (optional cleanup):
   - Can delete `/src/app/api/**` folders once migration is complete
   - Or keep as proxy/backward compatibility layer

## Testing Checklist

After migrating each file:
- [ ] Import works correctly
- [ ] API calls execute without errors
- [ ] Authentication token is sent automatically
- [ ] Error messages display properly
- [ ] Success flows work end-to-end
- [ ] Loading states function correctly

## Environment Variables Required

Ensure `.env.local` has:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Backend Must Be Running

Start the backend server before testing:
```bash
cd backend
npm run start:dev
```

## Status: 5% Complete
- Authentication register page import added
- Remaining: ~40 files to update
- Estimated time: 6-8 hours for complete migration
