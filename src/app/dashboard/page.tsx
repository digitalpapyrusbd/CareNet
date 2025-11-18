'use client';

import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/lib/api-client';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user && !isLoading) {
      // Redirect to role-specific dashboard
      switch (user.role) {
        case 'GUARDIAN':
          router.push('/dashboard/guardian');
          break;
        case 'COMPANY':
          router.push('/dashboard/company');
          break;
        case 'CAREGIVER':
          router.push('/dashboard/caregiver');
          break;
        case 'MODERATOR':
        case 'SUPER_ADMIN':
          router.push('/dashboard/moderator');
          break;
        default:
          // For any other role or unknown, stay on main dashboard
          fetchDashboardStats();
          break;
      }
    }
  }, [user, isLoading, router]);

  const fetchDashboardStats = async () => {
    try {
      const data = await apiCall('/dashboard/stats', {
        method: 'GET',
      });
      
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            Please log in to access your dashboard.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="mt-4"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const renderRoleSpecificContent = () => {
    // This is now a fallback for unknown roles
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Welcome to Your Dashboard
        </h3>
        <p className="text-gray-600">
          Your role: <span className="font-medium">{user?.role || 'Unknown'}</span>
        </p>
        <p className="text-gray-600 mt-2">
          You should be redirected to your role-specific dashboard automatically.
        </p>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-medium">{user.name}</span>!
          </p>
        </div>

        {renderRoleSpecificContent()}

        {stats && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {stats.recentActivity?.map((activity: any, index: number) => (
                <div key={index} className="border-l-4 border-gray-200 pl-4">
                  <div className="text-sm text-gray-600">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-gray-900">
                    {activity.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}