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
  '/auth/register',
  '/auth/role-selection',
  '/auth/mfa/verify',
  '/auth/reset-password',
];

// Get role-based dashboard path
function getDashboardPath(role: string): string {
  const { t } = useTranslationContext();
  const normalizedRole = role?.toLowerCase() || '';
  
  if (normalizedRole.includes('super') || normalizedRole.includes('admin')) {
    return '/admin/dashboard';
  } else if (normalizedRole.includes('moderator')) {
    return '/moderator/dashboard';
  } else if (normalizedRole.includes('company') || normalizedRole.includes('agency')) {
    return '/agency/dashboard';
  } else if (normalizedRole.includes('caregiver')) {
    return '/caregiver/dashboard';
  } else if (normalizedRole.includes('guardian')) {
    return '/guardian/dashboard';
  } else if (normalizedRole.includes('patient')) {
    return '/patient/dashboard';
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
    try {
      const authToken = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      
      if (authToken && userStr) {
        const userData = JSON.parse(userStr) as User;
        setUser(userData);
        setIsAuthenticated(true);
        
        // If user is on a public route (like login), redirect to their dashboard
        if (PUBLIC_ROUTES.includes(pathname)) {
          const dashboardPath = getDashboardPath(userData.role);
          router.push(dashboardPath);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        
        // If user is trying to access a protected route, redirect to login
        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.push('/auth/login');
        }
      }
    } catch {
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
