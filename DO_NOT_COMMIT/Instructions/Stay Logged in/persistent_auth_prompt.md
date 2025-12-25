# Cursor Prompt: Add Persistent Authentication (Remember Me)

## Context
I have a CareNet application with login functionality. Currently, users have to log in every time they visit the app. I need to implement persistent authentication so users stay logged in until they explicitly log out.

## Requirements

### 1. Remember Me Functionality

**Login Behavior:**
- User logs in successfully
- Authentication token/session is saved to localStorage (or secure storage)
- User closes browser/tab
- User reopens app → **Automatically logged in** (no login screen)
- Only show login screen if:
  - User explicitly logged out
  - Session expired
  - Token invalid

**Login Page Enhancement:**
```jsx
// Add "Remember Me" checkbox (optional, can default to ON)
<form>
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  
  <label>
    <input type="checkbox" checked={true} />
    Keep me logged in
  </label>
  
  <button>Login</button>
</form>
```

### 2. Session Persistence Strategy

**Token Storage:**
```javascript
// After successful login
const authData = {
  token: "jwt_token_here",
  user: {
    id: "user123",
    email: "user@example.com",
    role: "user" // or "admin"
  },
  expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
};

// Save to localStorage
localStorage.setItem('auth', JSON.stringify(authData));
```

**Session Validation:**
```javascript
// On app load, check if user is logged in
const checkAuth = () => {
  const authData = localStorage.getItem('auth');
  
  if (!authData) {
    return null; // Not logged in
  }
  
  const parsed = JSON.parse(authData);
  
  // Check if token expired
  if (parsed.expiresAt < Date.now()) {
    localStorage.removeItem('auth');
    return null; // Session expired
  }
  
  // Validate token with backend (optional but recommended)
  return parsed;
};
```

### 3. Protected Routes Implementation

**Route Protection:**
```jsx
// Wrap protected pages with auth check
function ProtectedRoute({ children }) {
  const auth = checkAuth();
  
  if (!auth) {
    // Redirect to login
    return <Navigate to="/login" />;
  }
  
  return children;
}

// Usage
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  
  {/* Protected routes */}
  <Route path="/home" element={
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  } />
  
  <Route path="/profile" element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  } />
  
  <Route path="/admin/*" element={
    <ProtectedRoute adminOnly={true}>
      <AdminDashboard />
    </ProtectedRoute>
  } />
</Routes>
```

### 4. Auto-Login on App Load

**App.jsx or main component:**
```jsx
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check authentication on app load
    const auth = checkAuth();
    
    if (auth) {
      setUser(auth.user);
      // Optionally validate with backend
      validateToken(auth.token).then(valid => {
        if (!valid) {
          logout();
        }
      });
    }
    
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />; // Show spinner while checking auth
  }
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        {/* Routes */}
      </Router>
    </AuthContext.Provider>
  );
}
```

### 5. Logout Functionality

**Clear Session:**
```javascript
function logout() {
  // Remove auth data
  localStorage.removeItem('auth');
  
  // Clear user state
  setUser(null);
  
  // Redirect to login
  navigate('/login');
  
  // Optional: Notify backend to invalidate token
  api.post('/auth/logout', { token });
}
```

**Logout Button:**
```jsx
// In profile page or navigation menu
<button onClick={logout}>
  Logout
</button>
```

### 6. Security Considerations

**Important Security Features:**

1. **Token Expiration:**
   ```javascript
   // Set reasonable expiration (7-30 days)
   expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
   ```

2. **Token Refresh (Optional but Recommended):**
   ```javascript
   // Refresh token before expiration
   async function refreshToken() {
     const response = await api.post('/auth/refresh');
     const newAuth = {
       ...currentAuth,
       token: response.data.token,
       expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
     };
     localStorage.setItem('auth', JSON.stringify(newAuth));
   }
   ```

3. **CSRF Protection:**
   - Use secure, httpOnly cookies for sensitive operations
   - Include CSRF tokens for state-changing requests

4. **XSS Prevention:**
   - Never store passwords
   - Sanitize user input
   - Use Content Security Policy headers

5. **Secure Storage (Enhanced):**
   ```javascript
   // For sensitive apps, consider using sessionStorage for shorter sessions
   // Or implement encrypted localStorage
   ```

### 7. User Experience Enhancements

**Remember Last Used Account:**
```javascript
// Save email (not password!) for convenience
const rememberEmail = (email) => {
  if (rememberMe) {
    localStorage.setItem('lastEmail', email);
  }
};

// Pre-fill on login page
const lastEmail = localStorage.getItem('lastEmail');
```

**Session Expiry Warning:**
```jsx
// Warn user before session expires
useEffect(() => {
  const auth = checkAuth();
  if (!auth) return;
  
  const timeUntilExpiry = auth.expiresAt - Date.now();
  
  // Show warning 5 minutes before expiry
  if (timeUntilExpiry < 5 * 60 * 1000) {
    showNotification('Your session will expire soon. Please save your work.');
  }
}, []);
```

**Multi-Device Sync:**
```javascript
// Listen for auth changes across tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'auth') {
    if (!e.newValue) {
      // Logged out in another tab
      window.location.href = '/login';
    } else {
      // Logged in in another tab
      setUser(JSON.parse(e.newValue).user);
    }
  }
});
```

### 8. Different User Roles

**Role-Based Authentication:**
```javascript
function ProtectedRoute({ children, adminOnly = false }) {
  const auth = checkAuth();
  
  if (!auth) {
    return <Navigate to="/login" />;
  }
  
  // Check if admin access required
  if (adminOnly && auth.user.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}
```

**Usage:**
```jsx
// Regular user pages
<Route path="/home" element={
  <ProtectedRoute>
    <HomePage />
  </ProtectedRoute>
} />

// Admin-only pages
<Route path="/admin/translations" element={
  <ProtectedRoute adminOnly={true}>
    <TranslationDashboard />
  </ProtectedRoute>
} />
```

### 9. Backend Integration

**API Request Interceptor:**
```javascript
// Automatically add auth token to all requests
axios.interceptors.request.use(config => {
  const auth = checkAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// Handle 401 (unauthorized) responses
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token invalid or expired
      logout();
    }
    return Promise.reject(error);
  }
);
```

### 10. Testing Scenarios

**Test Cases:**
```
✓ User logs in → Stays logged in after closing browser
✓ User logs in → Stays logged in after 24 hours (if token valid)
✓ User logs out → Login screen appears
✓ User logs in on Tab A → Also logged in on Tab B
✓ User logs out on Tab A → Also logged out on Tab B
✓ Session expires → Redirects to login with message
✓ Invalid token → Redirects to login
✓ Admin logs in → Can access admin pages
✓ Regular user → Cannot access admin pages
```

---

## Implementation Checklist

**Step 1: Auth Context**
```
☐ Create AuthContext for global auth state
☐ Implement checkAuth() function
☐ Implement login() function
☐ Implement logout() function
☐ Add token validation
```

**Step 2: Protected Routes**
```
☐ Create ProtectedRoute component
☐ Wrap all protected pages
☐ Add role-based access control
☐ Add redirect logic
```

**Step 3: Auto-Login**
```
☐ Check auth on app load
☐ Show loading screen while checking
☐ Auto-redirect based on auth status
```

**Step 4: Logout**
```
☐ Add logout button to navigation
☐ Clear localStorage on logout
☐ Redirect to login page
☐ Optional: Notify backend
```

**Step 5: Security**
```
☐ Set token expiration
☐ Validate token on critical operations
☐ Implement token refresh (optional)
☐ Add CSRF protection
☐ Handle expired sessions gracefully
```

**Step 6: UX Enhancements**
```
☐ Remember last email (optional)
☐ Add "Remember Me" checkbox
☐ Show session expiry warning
☐ Sync across tabs
```

---

## Output Required

Please provide:

1. **Complete AuthContext** with all authentication logic
2. **ProtectedRoute component** with role-based access
3. **Updated Login page** with "Remember Me" option
4. **Updated App.jsx** with auto-login on load
5. **Logout functionality** integrated into navigation
6. **API interceptors** for automatic token handling
7. **Token validation utility** functions
8. **Loading screen** component for auth check
9. **Documentation** on how the auth flow works

---

## Success Criteria

✅ User logs in → Stays logged in after closing browser
✅ User doesn't see login screen on every visit
✅ Session persists for 30 days (configurable)
✅ User can explicitly logout
✅ Invalid/expired tokens handled gracefully
✅ Admin pages protected from regular users
✅ Auth state syncs across multiple tabs
✅ Smooth loading experience (no flash of login page)
✅ Secure implementation (tokens, CSRF, XSS protection)

---

## Priority Features

**Must Have (P0):**
- Persistent login with localStorage
- Auto-login on app load
- Protected routes
- Logout functionality

**Should Have (P1):**
- Token expiration handling
- Role-based access control
- Loading screen during auth check

**Nice to Have (P2):**
- Token refresh
- Multi-tab sync
- Session expiry warning
- Remember last email

Please implement this persistent authentication system with all P0 and P1 features.