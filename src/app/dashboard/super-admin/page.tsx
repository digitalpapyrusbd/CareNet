'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, Card, Table, Chart } from '@/components/ui';
import { Layout } from '@/components/layout/Layout';
import { Sidebar } from '@/components/layout/Sidebar';
import { apiCall } from '@/lib/api-client';

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalCompanies: number;
  verifiedCompanies: number;
  totalCaregivers: number;
  verifiedCaregivers: number;
  totalJobs: number;
  completedJobs: number;
  totalRevenue: number;
  systemUptime: string;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'companies' | 'system'>('overview');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Fetch dashboard data
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch system metrics
      const metricsData = await apiCall('/admin/metrics', {
        method: 'GET',
      });
      setMetrics(metricsData);

      // Fetch recent activities
      const activitiesData = await apiCall('/admin/activities', {
        method: 'GET',
      });
      setRecentActivities(activitiesData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'User Registrations',
        data: [120, 150, 180, 140, 200, 160],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
      {
        label: 'Company Verifications',
        data: [45, 52, 48, 58, 62, 70],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
      },
      {
        label: 'Revenue Growth',
        data: [50000, 55000, 62000, 58000, 70000, 75000],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
      },
    ],
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('common.loading')}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.superAdmin.welcome')}, {user?.name}! 👑‍💼
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard.superAdmin.subtitle')}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: t('dashboard.superAdmin.overview') },
                { key: 'users', label: t('dashboard.superAdmin.users') },
                { key: 'companies', label: t('dashboard.superAdmin.companies') },
                { key: 'system', label: t('dashboard.superAdmin.system') },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && metrics && (
            <div className="space-y-6">
              {/* System Health */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-600 rounded-full">
                        <span className="text-white text-2xl">🟢</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                          {t('dashboard.superAdmin.systemStatus')}
                        </p>
                        <p className="text-2xl font-bold text-green-900 dark:text-white">
                          Operational
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-600 rounded-full">
                        <span className="text-white text-2xl">⏱</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {t('dashboard.superAdmin.systemUptime')}
                        </p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-white">
                          {metrics.systemUptime}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-600 rounded-full">
                        <span className="text-white text-2xl">💾</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                          {t('dashboard.superAdmin.databaseSize')}
                        </p>
                        <p className="text-2xl font-bold text-yellow-900 dark:text-white">
                          2.4 GB
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-600 rounded-full">
                        <span className="text-white text-2xl">🔒</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          {t('dashboard.superAdmin.securityScore')}
                        </p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-white">
                          9.8/10
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card title={t('dashboard.superAdmin.userGrowthChart')}>
                  <Chart
                    type="line"
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }}
                  />
                </Card>

                <Card title={t('dashboard.superAdmin.revenueChart')}>
                  <Chart
                    type="bar"
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                      datasets: [
                        {
                          label: 'Revenue (BDT)',
                          data: [50000, 55000, 62000, 58000, 70000, 75000],
                          backgroundColor: 'rgba(168, 85, 247, 0.8)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </Card>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <Card title={t('dashboard.superAdmin.userManagement')} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-600 rounded-full">
                          <span className="text-white text-2xl">👥</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {t('dashboard.superAdmin.totalUsers')}
                          </p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-white">
                            {metrics?.totalUsers || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-green-600 rounded-full">
                          <span className="text-white text-2xl">✅</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            {t('dashboard.superAdmin.activeUsers')}
                          </p>
                          <p className="text-2xl font-bold text-green-900 dark:text-white">
                            {metrics?.activeUsers || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-yellow-600 rounded-full">
                          <span className="text-white text-2xl">📈</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                            {t('dashboard.superAdmin.userGrowthRate')}
                          </p>
                          <p className="text-2xl font-bold text-yellow-900 dark:text-white">
                            +12.5%
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          )}

          {/* Companies Tab */}
          {activeTab === 'companies' && (
            <div className="space-y-6">
              <Card title={t('dashboard.superAdmin.companyManagement')} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-600 rounded-full">
                          <span className="text-white text-2xl">🏢</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {t('dashboard.superAdmin.totalCompanies')}
                          </p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-white">
                            {metrics?.totalCompanies || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-green-600 rounded-full">
                          <span className="text-white text-2xl">✅</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            {t('dashboard.superAdmin.verifiedCompanies')}
                          </p>
                          <p className="text-2xl font-bold text-green-900 dark:text-white">
                            {metrics?.verifiedCompanies || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-yellow-600 rounded-full">
                          <span className="text-white text-2xl">📊</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                            {t('dashboard.superAdmin.verificationRate')}
                          </p>
                          <p className="text-2xl font-bold text-yellow-900 dark:text-white">
                            78.5%
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <Card title={t('dashboard.superAdmin.systemSettings')} className="mb-8">
                <div className="space-y-4">
                  <Button className="w-full justify-start">
                    🔧 {t('dashboard.superAdmin.databaseMaintenance')}
                  </Button>
                  <Button className="w-full justify-start">
                    🔄 {t('dashboard.superAdmin.systemRestart')}
                  </Button>
                  <Button className="w-full justify-start">
                    📧 {t('dashboard.superAdmin.backupSystem')}
                  </Button>
                  <Button className="w-full justify-start">
                    📊 {t('dashboard.superAdmin.viewLogs')}
                  </Button>
                </div>
              </Card>

              <Card title={t('dashboard.superAdmin.recentActivities')} className="mb-8">
                <div className="overflow-x-auto">
                  <Table
                    headers={[
                      { key: 'user', label: t('dashboard.superAdmin.user') },
                      { key: 'action', label: t('dashboard.superAdmin.action') },
                      { key: 'details', label: t('dashboard.superAdmin.details') },
                      { key: 'timestamp', label: t('dashboard.superAdmin.timestamp') },
                    ]}
                    data={recentActivities.slice(0, 10)}
                    renderRow={(activity) => (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {activity.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {activity.action}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {activity.details}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(activity.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    )}
                  />
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline">
                    {t('dashboard.superAdmin.viewAllActivities')}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}