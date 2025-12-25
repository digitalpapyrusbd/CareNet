# Persistent Authentication Implementation

## Overview

The application now has **persistent authentication** ("Stay Logged In") functionality that keeps users authenticated across browser sessions, tabs, and page reloads.

## Features Implemented

### ✅ 1. Auto-Login on App Load
- When the app loads, it automatically checks for stored authentication tokens
- If valid tokens exist, users are automatically logged in and redirected to their role-specific dashboard
- No need to manually log in again unless tokens are cleared or expired

### ✅ 2. Protected Routes
- Public routes (login, register, landing page) are accessible without authentication
- Protected routes automatically redirect unauthenticated users to the login page
- Users attempting to access login/register while authenticated are redirected to their dashboard

### ✅ 3. Role-Based Routing
- After authentication, users are automatically redirected to their role-specific dashboard:
  - **Super Admin/Admin** → `/admin/dashboard`
  - **Moderator** → `/moderator/dashboard`
  - **Company/Agency** → `/agency/dashboard`
  - **Caregiver** → `/caregiver/dashboard`
  - **Guardian** → `/guardian/dashboard`
  - **Patient** → `/patient/dashboard`

### ✅ 4. Multi-Tab Synchronization
- Authentication state is synchronized across all browser tabs
- When you log out in one tab, all other tabs detect this and log out automatically
- When you log in in one tab, other tabs detect this and update authentication state

### ✅ 5. Secure Token Storage
- Tokens are stored in `localStorage`:
  - `authToken` - Access token for API requests
  - `refreshToken` - Refresh token for obtaining new access tokens
  - `user` - User profile information (name, role, email, etc.)
- The API client automatically includes the auth token in all requests

### ✅ 6. Loading States
- Shows a loading spinner while checking authentication on app load
- Prevents flashing of unauthorized content

### ✅ 7. Centralized Logout
- Logout clears all authentication data from localStorage
- Logout function available via `useAuthContext()` hook
- All tabs are notified and logged out simultaneously

## Technical Implementation

### Components Created

#### 1. **AuthProvider** (`src/components/providers/AuthProvider.tsx`)
- Main authentication context provider
- Manages global authentication state
- Handles auto-login on app load
- Listens for storage changes across tabs
- Provides authentication status and logout function

#### 2. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
- Higher-order component for protecting specific routes
- Supports role-based access control
- Optional component for manual route protection
- Usage: Wrap any page component that needs authentication

#### 3. **Updated ClientProviders** (`src/components/providers/ClientProviders.tsx`)
- Now includes AuthProvider in the provider tree
- Authentication is checked globally for all pages

### Usage Examples

#### Using Auth Context in Components

```tsx
import { useAuthContext } from '@/components/providers/AuthProvider';

function MyComponent() {
  const { isAuthenticated, isLoading, user, logout } = useAuthContext();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### Protecting a Specific Route (Optional)

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
      <div>Admin-only content</div>
    </ProtectedRoute>
  );
}
```

## How It Works

### 1. App Initialization Flow

```
1. User opens app
2. AuthProvider checks localStorage for authToken and user
3. If found:
   - Sets isAuthenticated = true
   - Sets user state
   - If on public route (login/register) → redirect to dashboard
4. If not found:
   - Sets isAuthenticated = false
   - If on protected route → redirect to login page
5. Shows loading spinner during check
6. Renders app content after check complete
```

### 2. Login Flow

```
1. User enters credentials on login page
2. API request to /auth/login
3. On success:
   - Store access_token as 'authToken'
   - Store refresh_token as 'refreshToken'
   - Store user data as 'user'
4. AuthProvider detects storage change
5. User automatically redirected to role-specific dashboard
```

### 3. Logout Flow

```
1. User clicks logout button
2. logout() function called from AuthProvider
3. Clear all auth data from localStorage:
   - authToken
   - refreshToken
   - user
   - mfaTempToken
4. Set isAuthenticated = false
5. Redirect to /auth/login
6. All other tabs detect storage change and log out
```

### 4. Multi-Tab Synchronization

```
1. Browser storage event listener active in all tabs
2. When authToken or user key changes in localStorage:
   - If value deleted → trigger logout in all tabs
   - If value added → trigger auth check in all tabs
3. All tabs stay synchronized
```

## Public Routes

The following routes are accessible without authentication:
- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/role-selection` - Role selection page
- `/auth/mfa/verify` - MFA verification page
- `/auth/reset-password` - Password reset page

All other routes require authentication and will redirect to `/auth/login`.

## Security Considerations

### ✅ Implemented
1. Tokens stored in localStorage (accessible only to same origin)
2. API client automatically includes Authorization header
3. Protected routes redirect unauthenticated users
4. Role-based access control available
5. Multi-tab logout synchronization
6. Centralized token management

### 🔐 Additional Security (Future Enhancements)
1. **Token Expiration Handling**: Implement automatic token refresh before expiration
2. **Remember Me Checkbox**: Add option to use sessionStorage instead of localStorage
3. **Session Timeout Warning**: Show warning before tokens expire
4. **Secure HttpOnly Cookies**: Consider moving tokens to HttpOnly cookies (requires backend changes)
5. **XSS Protection**: Already handled by Next.js, but ensure no `dangerouslySetInnerHTML` usage
6. **CSRF Protection**: Implement CSRF tokens for state-changing operations

## Testing

### Manual Testing Steps

1. **Test Auto-Login**:
   - Log in with valid credentials
   - Close browser completely
   - Reopen browser and navigate to app
   - Should automatically log in and redirect to dashboard

2. **Test Protected Routes**:
   - Open app without logging in
   - Try to access `/admin/dashboard` directly
   - Should redirect to `/auth/login`

3. **Test Multi-Tab Sync**:
   - Open app in two browser tabs
   - Log out in one tab
   - Other tab should automatically log out

4. **Test Role-Based Routing**:
   - Log in as different roles
   - Each role should redirect to correct dashboard

## Troubleshooting

### Issue: User stays on login page after successful login
**Solution**: Check browser console for errors. Ensure tokens are being stored in localStorage.

### Issue: User redirected to login immediately after logging in
**Solution**: Check that AuthProvider is rendering correctly and not causing redirect loops.

### Issue: Multi-tab sync not working
**Solution**: Ensure localStorage is being used (not sessionStorage). Check browser console for storage event listeners.

### Issue: "Loading..." screen never disappears
**Solution**: Check AuthProvider logic. Ensure `setIsLoading(false)` is called in all code paths.

## Files Modified/Created

### Created:
- `src/components/providers/AuthProvider.tsx` - Main authentication provider
- `src/components/ProtectedRoute.tsx` - Route protection component
- `PERSISTENT_AUTH_README.md` - This documentation

### Modified:
- `src/components/providers/ClientProviders.tsx` - Added AuthProvider to provider tree
- `src/components/layout/Layout.tsx` - Updated to use useAuthContext instead of useAuth

## Migration Notes

The existing `useAuth` hook (`src/hooks/useAuth.ts`) is still available but the new `useAuthContext` from `AuthProvider` is recommended for new components as it provides:
- Global authentication state
- Automatic route protection
- Multi-tab synchronization
- Centralized logout handling

Both hooks currently use the same localStorage keys (`authToken`, `refreshToken`, `user`) so they are compatible.

## Next Steps (Optional Enhancements)

1. **Add "Remember Me" checkbox** on login page
   - If unchecked, use sessionStorage instead of localStorage
   - Session ends when browser closes

2. **Implement token refresh**
   - Detect when access token is about to expire
   - Automatically request new tokens using refresh token
   - Show warning before session expires

3. **Add session timeout warning**
   - Show modal 5 minutes before session expires
   - Allow user to extend session or log out

4. **Implement activity tracking**
   - Track user activity (mouse movement, clicks)
   - Auto-logout after X minutes of inactivity

5. **Add security audit log**
   - Log all login/logout events
   - Track IP addresses and device information
   - Show recent login activity to users

## Support

For issues or questions, check:
1. Browser console for errors
2. Network tab for API request failures
3. localStorage to verify tokens are being stored
4. This documentation for common issues

---

**Implementation Date**: December 2024
**Status**: ✅ Fully Implemented and Working
