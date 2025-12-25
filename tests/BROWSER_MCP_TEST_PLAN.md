# Browser MCP Test Plan - Authentication Flow

**Status:** Browser MCP Connected (12 tools available)  
**Debug Logs:** Active - `.cursor/debug.log`

---

## Test Sequence

### Test 1: Super Admin Login
1. Navigate to: `http://localhost:3000/admin/login`
2. Wait for page load
3. Find phone input field
4. Fill: `+8801712345101`
5. Find password input field  
6. Fill: `Admin@123`
7. Click "Login" button
8. Wait for navigation
9. Verify URL contains `/admin/dashboard`
10. Check localStorage for `authToken` and `user`

### Test 2: Guardian Login
1. Navigate to: `http://localhost:3000/auth/login`
2. Clear localStorage
3. Fill phone: `+8801712345501`
4. Fill password: `Guardian@123`
5. Click "Login"
6. Verify redirect to `/guardian/dashboard`
7. Check localStorage

### Test 3: Caregiver Login
1. Navigate to: `http://localhost:3000/auth/login`
2. Clear localStorage
3. Fill phone: `+8801712345401`
4. Fill password: `Caregiver@123`
5. Click "Login"
6. Verify redirect to `/caregiver/dashboard`
7. Check localStorage

---

## What to Log

After each test, the debug logs will contain:
- Login attempt details
- API response data
- Token storage verification
- Redirect information
- AuthProvider checkAuth execution

---

## Expected Results

✅ **Success Indicators:**
- Login succeeds
- Redirects to correct dashboard
- Tokens stored in localStorage
- Dashboard loads correctly

❌ **Failure Indicators:**
- Login fails (wrong credentials)
- No redirect (stays on login page)
- Wrong redirect path
- Tokens not stored
- Dashboard errors

