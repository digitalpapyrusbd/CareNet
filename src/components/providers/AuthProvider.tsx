'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  logout: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/admin/login',
  '/auth/register',
  '/auth/role-selection',
  '/auth/verify-mfa',
  '/auth/mfa/verify', // Keep for backward compatibility
  '/auth/reset-password',
];

// Get role-based dashboard path
function getDashboardPath(role: string): string {
  const normalizedRole = role?.toLowerCase() || '';
  
  if (normalizedRole.includes('super') || normalizedRole.includes('admin')) {
    return '/admin/dashboard';
  } else if (normalizedRole.includes('moderator')) {
    return '/moderator/dashboard';
  } else if (normalizedRole.includes('agency')) {
    return '/agency/dashboard';
  } else if (normalizedRole.includes('caregiver')) {
    return '/caregiver/dashboard';
  } else if (normalizedRole.includes('guardian')) {
    return '/guardian/dashboard';
  } else if (normalizedRole.includes('patient')) {
    return '/patient/dashboard';
  } else if (normalizedRole.includes('shop')) {
    return '/shop/dashboard';
  }
  
  return '/';
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = useCallback(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthProvider.tsx:70',message:'checkAuth called',data:{pathname,isPublicRoute:PUBLIC_ROUTES.includes(pathname)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    try {
      const authToken = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthProvider.tsx:74',message:'localStorage check',data:{hasAuthToken:!!authToken,authTokenLength:authToken?.length,hasUserStr:!!userStr,userStrLength:userStr?.length,pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      
      if (authToken && userStr) {
        const userData = JSON.parse(userStr) as User;
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthProvider.tsx:78',message:'User authenticated',data:{userRole:userData.role,pathname,isPublicRoute:PUBLIC_ROUTES.includes(pathname)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        setUser(userData);
        setIsAuthenticated(true);
        
        // If user is on a public route (like login), redirect to their dashboard
        if (PUBLIC_ROUTES.includes(pathname)) {
          const dashboardPath = getDashboardPath(userData.role);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthProvider.tsx:83',message:'Redirecting from public route',data:{dashboardPath,userRole:userData.role,pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
          // #endregion
          router.push(dashboardPath);
        }
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthProvider.tsx:89',message:'User not authenticated',data:{pathname,isPublicRoute:PUBLIC_ROUTES.includes(pathname),willRedirect:!PUBLIC_ROUTES.includes(pathname)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        setUser(null);
        setIsAuthenticated(false);
        
        // If user is trying to access a protected route, redirect to login
        if (!PUBLIC_ROUTES.includes(pathname)) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthProvider.tsx:93',message:'Redirecting to login',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
          // #endregion
          router.push('/auth/login');
        }
      }
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthProvider.tsx:97',message:'checkAuth error',data:{errorMessage:error?.message,pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      // Silent error handling - just reset auth state
      setUser(null);
      setIsAuthenticated(false);
      
      if (!PUBLIC_ROUTES.includes(pathname)) {
        router.push('/auth/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router]);

  // Check authentication on mount and path change
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('mfaTempToken');
    
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/login');
  }, [router]);

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        if (!e.newValue) {
          // Logged out in another tab
          logout();
        } else {
          // Logged in in another tab
          checkAuth();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuth, logout]);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#FF8FA3' }}></div>
          <p style={{ color: '#848484' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
