'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

/**
 * Dashboard redirect page
 * Detects user role and redirects to the appropriate role-specific dashboard
 */
export default function DashboardPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Wait for auth to initialize
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    // Map UserRole enum values to dashboard paths
    const getDashboardPath = (role: UserRole): string => {
      switch (role) {
        case UserRole.GUARDIAN:
          return '/guardian/dashboard';
        case UserRole.CAREGIVER:
          return '/caregiver/dashboard';
        case UserRole.AGENCY:
          return '/agency/dashboard';
        case UserRole.MODERATOR:
          return '/moderator/dashboard';
        case UserRole.SUPER_ADMIN:
          return '/admin/dashboard';
        case UserRole.PATIENT:
          return '/patient/dashboard';
        default:
          // Unknown role - redirect to login
          return '/auth/login';
      }
    };

    const dashboardPath = getDashboardPath(user.role);
    router.push(dashboardPath);
  }, [user, isLoading, isAuthenticated, router]);

  // Show loading state while checking auth or redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
