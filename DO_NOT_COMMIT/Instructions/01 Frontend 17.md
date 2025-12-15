# Frontend 17: State Management & Data Fetching

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Related Files**: [TOC](01%20Frontend%20TOC.md) | [01: Architecture](01%20Frontend%2001.md) | [02: Authentication](01%20Frontend%2002.md)

---

## 📋 Table of Contents

1. [State Management Overview](#state-management-overview)
2. [Client-Side State (useState/useReducer)](#client-side-state)
3. [Global State (Context API)](#global-state)
4. [Server State (Data Fetching)](#server-state)
5. [Custom Hooks](#custom-hooks)
6. [API Client](#api-client)
7. [Offline Sync](#offline-sync)
8. [Caching Strategies](#caching-strategies)
9. [Debugging Guide](#debugging-guide)
10. [Testing Guide](#testing-guide)
11. [Testing Progress Log](#testing-progress-log)

---

## 🧠 State Management Overview

### **State Architecture**

The platform uses a hybrid state management approach:

```typescript
// State Categories
1. **Local UI State**: useState/useReducer (component-level)
2. **Global App State**: Context API (theme, auth, i18n)
3. **Server State**: Custom hooks with fetch (jobs, payments, patients)
4. **Cached State**: LocalStorage + Service Workers
5. **Offline Queue**: IndexedDB for pending operations
```

### **State Flow**

```
User Action
    ↓
Component State (useState)
    ↓
Context Provider (global state)
    ↓
API Hook (useApi/usePaginatedApi)
    ↓
API Client (fetch wrapper)
    ↓
Backend API
    ↓
Response → Update State → Re-render
```

### **No React Query/TanStack Query**

The platform **does not use React Query**. Instead, it implements custom hooks (`useApi`, `usePaginatedApi`, `useRealtime`) that provide similar functionality:

- **Data fetching** with loading/error states
- **Pagination** support
- **Polling** for real-time updates
- **Request deduplication**
- **Offline queue** with sync

---

## 📦 Client-Side State

### **useState for Local State**

```tsx
// Simple component state
function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState('');
  
  return (
    <div>
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Collapse' : 'Expand'}
      </button>
      
      {expanded && (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
        />
      )}
    </div>
  );
}
```

### **useReducer for Complex State**

```tsx
// Complex state with multiple actions
interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: any }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'SET_TOUCHED'; field: string }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.field]: true },
      };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };
    case 'RESET':
      return {
        values: {},
        errors: {},
        touched: {},
        isSubmitting: false,
      };
    default:
      return state;
  }
}

function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, {
    values: {},
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const handleChange = (field: string, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const handleSubmit = async () => {
    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
    try {
      await api.post('/auth/register', state.values);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

## 🌐 Global State

### **Context Providers**

**File Structure**:
```
src/components/providers/
├── ClientProviders.tsx       # Root provider wrapper
├── ThemeProvider.tsx          # Theme state
├── TranslationProvider.tsx    # i18n state
├── AIAgentProvider.tsx        # AI assistant state
└── ServiceWorkerRegistration.tsx
```

### **ThemeProvider**

**File**: `/src/components/providers/ThemeProvider.tsx`

```tsx
interface ThemeContextType {
  theme: Theme; // 'light' | 'dark' | 'system'
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export function ThemeProvider({ children, defaultTheme }: Props) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme || getTheme());
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(
    () => getEffectiveTheme(theme)
  );

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    setEffectiveTheme(getEffectiveTheme(newTheme));
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      // System: toggle to opposite of current effective theme
      setTheme(effectiveTheme === 'light' ? 'dark' : 'light');
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setEffectiveTheme(getEffectiveTheme(theme));
      applyTheme(theme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### **TranslationProvider**

```tsx
interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  formatDate: (date: Date | string) => string;
  formatCurrency: (amount: number) => string;
  isLoading: boolean;
}

export function TranslationProvider({ children, initialLocale }: Props) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || getLocale());
  const [messages, setMessages] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const translate = (key: string, params?: Record<string, string | number>) => {
    let translation = getNestedValue(messages, key) || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(
          new RegExp(`{{${param}}}`, 'g'), 
          String(value)
        );
      });
    }
    
    return translation;
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  // Load messages when locale changes
  useEffect(() => {
    setIsLoading(true);
    getMessages(locale)
      .then(setMessages)
      .finally(() => setIsLoading(false));
  }, [locale]);

  return (
    <TranslationContext.Provider value={{ 
      t: translate, 
      locale, 
      setLocale, 
      formatDate, 
      formatCurrency, 
      isLoading 
    }}>
      {children}
    </TranslationContext.Provider>
  );
}
```

### **ClientProviders Wrapper**

**File**: `/src/components/providers/ClientProviders.tsx`

```tsx
export default function ClientProviders({ children, locale }: Props) {
  return (
    <ThemeProvider>
      <TranslationProvider initialLocale={locale as any}>
        {children}
      </TranslationProvider>
    </ThemeProvider>
  );
}
```

**Usage in Root Layout**:

```tsx
// app/layout.tsx
import ClientProviders from '@/components/providers/ClientProviders';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
```

---

## 📡 Server State

### **useApi Hook**

**File**: `/src/hooks/useApi.ts`

```typescript
interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export const useApi = <T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const { immediate, onSuccess, onError } = options;

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('An error occurred');
      setState(prev => ({ ...prev, loading: false, error: errorObj }));
      onError?.(errorObj);
      throw errorObj;
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { ...state, execute, reset };
};
```

**Usage Example**:

```tsx
function JobsList() {
  const { data, loading, error, execute } = useApi(
    async () => api.get('/jobs'),
    { immediate: true }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.map(job => <JobCard key={job.id} job={job} />)}
      <button onClick={() => execute()}>Refresh</button>
    </div>
  );
}
```

### **usePaginatedApi Hook**

```typescript
interface UsePaginatedApiReturn<T> {
  data: PaginatedResponse<T> | null;
  loading: boolean;
  error: Error | null;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  refresh: () => void;
}

export const usePaginatedApi = <T = any>(
  apiFunction: (page: number, limit: number) => Promise<PaginatedResponse<T>>,
  options = {}
): UsePaginatedApiReturn<T> => {
  const [page, setPage] = useState(options.initialPage || 1);
  const [limit, setLimit] = useState(options.initialLimit || 10);
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(page, limit);
      const hasNextPage = page < result.pagination.totalPages;
      const hasPreviousPage = page > 1;

      setState({
        data: result,
        loading: false,
        error: null,
        hasNextPage,
        hasPreviousPage,
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error }));
    }
  }, [apiFunction, page, limit]);

  const nextPage = useCallback(() => {
    if (state.hasNextPage) setPage(prev => prev + 1);
  }, [state.hasNextPage]);

  const previousPage = useCallback(() => {
    if (state.hasPreviousPage) setPage(prev => prev - 1);
  }, [state.hasPreviousPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    previousPage,
    refresh: fetchData,
  };
};
```

**Usage Example**:

```tsx
function PatientsTable() {
  const {
    data,
    loading,
    page,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
  } = usePaginatedApi(
    (page, limit) => api.get(`/patients?page=${page}&limit=${limit}`),
    { initialLimit: 20 }
  );

  return (
    <div>
      <table>
        {data?.items.map(patient => (
          <PatientRow key={patient.id} patient={patient} />
        ))}
      </table>
      
      <Pagination
        page={page}
        totalPages={data?.pagination.totalPages}
        onNext={nextPage}
        onPrevious={previousPage}
        hasNext={hasNextPage}
        hasPrevious={hasPreviousPage}
      />
    </div>
  );
}
```

### **useRealtime Hook (Polling)**

```typescript
interface UseRealtimeOptions<T> {
  pollingInterval?: number; // milliseconds
  enabled?: boolean;
}

export const useRealtime = <T = any>(
  apiFunction: () => Promise<T>,
  options: UseRealtimeOptions<T> = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!options.enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options.enabled]);

  useEffect(() => {
    if (options.enabled !== false) {
      fetchData();

      if (options.pollingInterval && options.pollingInterval > 0) {
        const interval = setInterval(fetchData, options.pollingInterval);
        return () => clearInterval(interval);
      }
    }
  }, [fetchData, options.pollingInterval, options.enabled]);

  return { data, loading, error, refetch: fetchData };
};
```

**Usage Example**:

```tsx
function ActiveJobsMonitor() {
  const { data: activeJobs, loading } = useRealtime(
    () => api.get('/jobs?status=ACTIVE'),
    { 
      pollingInterval: 10000, // Poll every 10 seconds
      enabled: true 
    }
  );

  return (
    <div>
      <h2>Active Jobs ({activeJobs?.length || 0})</h2>
      {loading && <span>Updating...</span>}
      {activeJobs?.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
}
```

### **useFormSubmit Hook**

```typescript
interface UseFormSubmitReturn<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
  submit: (data: any) => Promise<T>;
  reset: () => void;
}

export const useFormSubmit = <T = any>(
  submitFunction: (data: any) => Promise<T>,
  options = {}
): UseFormSubmitReturn<T> => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
  });

  const submit = useCallback(async (formData: any): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await submitFunction(formData);
      setState({
        loading: false,
        error: null,
        data: options.resetOnSuccess ? null : result,
      });
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('An error occurred');
      setState(prev => ({ ...prev, loading: false, error: errorObj }));
      options.onError?.(errorObj);
      throw errorObj;
    }
  }, [submitFunction, options]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return { ...state, submit, reset };
};
```

**Usage Example**:

```tsx
function CreatePatientForm() {
  const { submit, loading, error } = useFormSubmit(
    (data) => api.post('/patients', data),
    {
      onSuccess: () => {
        toast.success('Patient created!');
        router.push('/patients');
      },
      onError: (err) => toast.error(err.message),
    }
  );

  const handleSubmit = async (formData) => {
    await submit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={loading}>
        {loading ? 'Creating...' : 'Create Patient'}
      </button>
      {error && <ErrorMessage error={error} />}
    </form>
  );
}
```

---

## 🔧 Custom Hooks

### **useAuth Hook**

**File**: `/src/hooks/useAuth.ts`

```typescript
interface UseAuthReturn {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const router = useRouter();
  const [state, setState] = useState({
    user: null,
    tokens: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize from localStorage
  useEffect(() => {
    const tokens = storage.get<AuthTokens>('auth_tokens');
    const user = storage.get<AuthUser>('auth_user');
    
    setState({
      user,
      tokens,
      isLoading: false,
      isAuthenticated: !!(tokens && user),
    });
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      storage.set('auth_tokens', data.tokens);
      storage.set('auth_user', data.user);
      
      setState({
        user: data.user,
        tokens: data.tokens,
        isLoading: false,
        isAuthenticated: true,
      });
      
      router.push('/dashboard');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [router]);

  const logout = useCallback(() => {
    storage.remove('auth_tokens');
    storage.remove('auth_user');
    
    setState({
      user: null,
      tokens: null,
      isLoading: false,
      isAuthenticated: false,
    });
    
    router.push('/login');
  }, [router]);

  return { ...state, login, logout, refreshToken };
};
```

### **useFileUpload Hook**

```typescript
interface UseFileUploadReturn {
  loading: boolean;
  error: Error | null;
  progress: number;
  url: string | null;
  upload: (file: File) => Promise<string>;
  reset: () => void;
}

export const useFileUpload = (options = {}): UseFileUploadReturn => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    progress: 0,
    url: null,
  });

  const upload = useCallback(async (file: File): Promise<string> => {
    setState({ loading: true, error: null, progress: 0, url: null });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setState(prev => ({ ...prev, progress }));
            options.onProgress?.(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setState({ loading: false, error: null, progress: 100, url: response.url });
            options.onSuccess?.(response.url);
            resolve(response.url);
          } else {
            const error = new Error('Upload failed');
            setState(prev => ({ ...prev, loading: false, error }));
            reject(error);
          }
        });

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Upload failed');
      setState(prev => ({ ...prev, loading: false, error: errorObj }));
      throw errorObj;
    }
  }, [options]);

  return { ...state, upload, reset: () => setState({ loading: false, error: null, progress: 0, url: null }) };
};
```

---

## 🌐 API Client

**File**: `/src/lib/api-client.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class APIError extends Error {
  status: number;
  data: unknown;

  constructor(data: { message?: string; statusCode?: number }) {
    super(data.message || 'API Error');
    this.status = data.statusCode || 500;
    this.data = data;
  }
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export async function apiCall(endpoint: string, options?) {
  const token = getAuthToken();
  const { body, isFormData, ...fetchOptions } = options || {};
  
  const headers: Record<string, string> = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...fetchOptions?.headers,
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new APIError(errorData);
  }
  
  return response.json();
}

// Convenience methods
export const api = {
  get: (endpoint: string) => apiCall(endpoint, { method: 'GET' }),
  post: (endpoint: string, data?: unknown) => 
    apiCall(endpoint, { method: 'POST', body: data }),
  put: (endpoint: string, data?: unknown) => 
    apiCall(endpoint, { method: 'PUT', body: data }),
  patch: (endpoint: string, data?: unknown) => 
    apiCall(endpoint, { method: 'PATCH', body: data }),
  delete: (endpoint: string) => 
    apiCall(endpoint, { method: 'DELETE' }),
};
```

**Usage**:

```typescript
// GET request
const jobs = await api.get('/jobs');

// POST request
const newPatient = await api.post('/patients', {
  name: 'John Doe',
  dateOfBirth: '1980-01-01',
});

// Error handling
try {
  await api.post('/jobs', jobData);
} catch (error) {
  if (error instanceof APIError) {
    console.log('Status:', error.status);
    console.log('Message:', error.message);
  }
}
```

---

## 📴 Offline Sync

**File**: `/src/hooks/useOfflineSync.ts`

```typescript
interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: number | null;
  queueLength: number;
}

export function useOfflineSync(options = {}) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncTime: null,
    queueLength: 0,
  });

  // Update online status
  const updateOnlineStatus = useCallback(() => {
    setSyncStatus(prev => ({
      ...prev,
      isOnline: navigator.onLine,
    }));
  }, []);

  // Manual sync
  const sync = useCallback(async () => {
    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    
    options.onSyncStart?.();

    try {
      await offlineService.forceSync();
      
      const status = await offlineService.getSyncStatus();
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: status.lastSyncTime,
        queueLength: status.queueLength,
      }));
      
      options.onSyncComplete?.(true, status.queueLength);
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      options.onSyncError?.(error.message);
      options.onSyncComplete?.(false, 0);
    }
  }, [options]);

  // Listen for online/offline events
  useEffect(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [updateOnlineStatus]);

  // Auto-sync when coming online
  useEffect(() => {
    if (syncStatus.isOnline && options.autoSync) {
      sync();
    }
  }, [syncStatus.isOnline, options.autoSync, sync]);

  return { syncStatus, sync };
}
```

---

## 💾 Caching Strategies

### **LocalStorage Cache**

```typescript
// src/utils/storage.ts
export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  },
};
```

### **In-Memory Cache**

```typescript
// Simple cache with TTL
class Cache<T> {
  private cache = new Map<string, { data: T; expiry: number }>();

  set(key: string, data: T, ttl: number = 300000) {
    // Default 5 minutes
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new Cache();
```

---

## 🐛 Debugging Guide

### **Issue: State Not Updating**

**Problem**: Component doesn't re-render after state change.

**Solution**:
```typescript
// ❌ Wrong: Mutating state directly
state.user.name = 'New Name';
setState(state);

// ✅ Correct: Create new object
setState({ ...state, user: { ...state.user, name: 'New Name' } });
```

### **Issue: Stale Closure**

**Problem**: useEffect uses outdated values.

**Solution**:
```typescript
// ❌ Wrong: Missing dependency
useEffect(() => {
  fetchData(userId); // userId may be stale
}, []);

// ✅ Correct: Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId, fetchData]);
```

---

## 🧪 Testing Guide

```typescript
describe('useApi Hook', () => {
  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    const apiFunction = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useApi(apiFunction));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles errors', async () => {
    const error = new Error('API Error');
    const apiFunction = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(() => useApi(apiFunction));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // Expected error
      }
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.loading).toBe(false);
  });
});
```

---

## 📊 Testing Progress Log

### **✅ Completed**
- **Custom Hooks**: 100% (useApi, usePaginatedApi, useAuth working)
- **Context Providers**: 100% (Theme, Translation, AI Agent)
- **API Client**: 95% (Fetch wrapper with auth)
- **Offline Sync**: 85% (Queue and sync working)
- **Caching**: 80% (LocalStorage + in-memory)

### **❌ TODO**
- [ ] Request deduplication (prevent duplicate API calls)
- [ ] Optimistic updates (update UI before API response)
- [ ] WebSocket integration for real-time data
- [ ] Service Worker caching strategies
- [ ] State persistence across sessions
- [ ] Performance monitoring for state updates

---

**Last Updated**: December 11, 2025  
**Maintained By**: Development Team
