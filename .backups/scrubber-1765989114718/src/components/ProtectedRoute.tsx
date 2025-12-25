'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/providers/AuthProvider';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && allowedRoles && allowedRoles.length > 0) {
      const userRole = user?.role?.toLowerCase() || '';
      const hasAccess = allowedRoles.some(role => userRole.includes(role.toLowerCase()));
      
      if (!hasAccess) {
        // User doesn't have the required role, redirect to their dashboard
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

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

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role?.toLowerCase() || '';
    const hasAccess = allowedRoles.some(role => userRole.includes(role.toLowerCase()));
    
    if (!hasAccess) {
      return null; // Will redirect in useEffect
    }
  }

  return <>{children}</>;
}
