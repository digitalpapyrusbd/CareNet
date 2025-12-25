# Manual Test Execution - Authentication Flow

**Date:** December 25, 2025  
**Test Plan:** AUTH1.2 - Valid Login (TESTER_MANUAL_AUTH.md)  
**Debug Logs:** `.cursor/debug.log`

---

## Test Execution Steps

### Test 1: Super Admin Login
- **URL:** `http://localhost:3000/admin/login`
- **Phone:** `+8801712345101`
- **Password:** `Admin@123`
- **Expected:** Redirect to `/admin/dashboard`

### Test 2: Guardian Login
- **URL:** `http://localhost:3000/auth/login`
- **Phone:** `+8801712345501`
- **Password:** `Guardian@123`
- **Expected:** Redirect to `/guardian/dashboard`

### Test 3: Caregiver Login
- **URL:** `http://localhost:3000/auth/login`
- **Phone:** `+8801712345401`
- **Password:** `Caregiver@123`
- **Expected:** Redirect to `/caregiver/dashboard`

---

## What Gets Logged

The instrumentation will automatically log:
- Login attempt start (phone, password length)
- API response (access_token, user, role, MFA flags)
- Token storage (before/after verification)
- User data storage
- Redirect path calculation
- AuthProvider checkAuth execution
- localStorage reads/writes
- Navigation events

All logs written to: `.cursor/debug.log`

---

## After Testing

After completing the tests, I'll analyze the debug logs to identify:
- Whether login API calls succeed
- If tokens are stored correctly
- If redirects happen as expected
- Any errors or failures in the flow
- AuthProvider behavior

