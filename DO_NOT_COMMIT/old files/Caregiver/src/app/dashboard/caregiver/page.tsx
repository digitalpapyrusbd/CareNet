'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, Card, Table } from '@/components/ui';
import { Layout } from '@/components/layout/Layout';
import { Sidebar } from '@/components/layout/Sidebar';
import { apiCall } from '@/lib/api-client';

interface Job {
  id: string;
  title: string;
  patient: string;
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  duration: string;
  pay: number;
}

interface Earning {
  period: string;
  amount: number;
  jobs: number;
}

export default function CaregiverDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

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
      
      // Fetch jobs
      const jobsData = await apiCall('/jobs?caregiverId=' + user?.id, {
        method: 'GET',
      });
      setJobs(jobsData);

      // Fetch earnings
      const earningsData = await apiCall('/earnings?caregiverId=' + user?.id, {
        method: 'GET',
      });
      setEarnings(earningsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 dark:text-blue-400';
      case 'in-progress':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
    };
    
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
  };

  const filteredJobs = jobs.filter(job => {
    const jobDate = new Date(job.date);
    const now = new Date();
    
    switch (activeFilter) {
      case 'today':
        return jobDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return jobDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return jobDate >= monthAgo;
      default:
        return true;
    }
  });

  const todayJobs = jobs.filter(job => {
    const jobDate = new Date(job.date);
    const today = new Date();
    return jobDate.toDateString() === today.toDateString();
  });

  const handleCheckIn = async (jobId: string) => {
    try {
      // Get current location
      if (!navigator.geolocation) {
        alert('Location services are not available. Please enable location access.');
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      await apiCall('/jobs/check-in', {
        method: 'POST',
        body: {
          jobId,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        },
      });

      // Refresh jobs data
      fetchDashboardData();
    } catch (error: any) {
      console.error('Check-in failed:', error);
      alert(error.message || 'Check-in failed. Please try again.');
    }
  };

  const handleCheckOut = async (jobId: string) => {
    try {
      await apiCall('/jobs/check-out', {
        method: 'POST',
        body: {
          jobId,
        },
      });

      // Refresh jobs data
      fetchDashboardData();
    } catch (error: any) {
      console.error('Check-out failed:', error);
      alert(error.message || 'Check-out failed. Please try again.');
    }
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
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.caregiver.welcome')}, {user?.name}! 👩‍⚕️
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard.caregiver.subtitle')}
            </p>
          </div>

          {/* Mobile-Optimized Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">📅</div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">
                    {t('dashboard.caregiver.todayJobs')}
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-white">
                    {todayJobs.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">💰</div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                    {t('dashboard.caregiver.weeklyEarnings')}
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-white">
                    ৳{earnings
                      .filter(e => e.period === 'This Week')
                      .reduce((sum, e) => sum + e.amount, 0)
                      .toLocaleString('bn-BD')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <div className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">⭐</div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mt-2">
                    {t('dashboard.caregiver.averageRating')}
                  </p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-white">
                    4.8
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <div className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">🏃</div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mt-2">
                    {t('dashboard.caregiver.completedJobs')}
                  </p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-white">
                    {jobs.filter(job => job.status === 'completed').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex">
                {[
                  { key: 'all', label: t('dashboard.caregiver.allJobs') },
                  { key: 'today', label: t('dashboard.caregiver.todayJobs') },
                  { key: 'week', label: t('dashboard.caregiver.thisWeek') },
                  { key: 'month', label: t('dashboard.caregiver.thisMonth') },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key as any)}
                    className={`py-3 px-4 border-b-2 font-medium text-sm ${
                      activeFilter === filter.key
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Today's Jobs - Mobile Priority */}
          {activeFilter === 'today' && todayJobs.length > 0 && (
            <Card title={t('dashboard.caregiver.todayJobs')} className="mb-6 lg:hidden">
              <div className="space-y-4">
                {todayJobs.map((job) => (
                  <div key={job.id} className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          👤 {job.patient} • {job.time}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          📍 {job.location}
                        </p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(job.status)}`}>
                        {t(`dashboard.caregiver.status.${job.status}`)}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      {job.status === 'scheduled' && (
                        <Button
                          onClick={() => handleCheckIn(job.id)}
                          className="flex-1"
                          size="sm"
                        >
                          📍 {t('dashboard.caregiver.checkIn')}
                        </Button>
                      )}
                      
                      {job.status === 'in-progress' && (
                        <Button
                          onClick={() => handleCheckOut(job.id)}
                          className="flex-1"
                          variant="outline"
                          size="sm"
                        >
                          🏠 {t('dashboard.caregiver.checkOut')}
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => router.push(`/jobs/${job.id}`)}
                        className="flex-1"
                        variant="outline"
                        size="sm"
                      >
                        📋 {t('dashboard.caregiver.viewDetails')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Jobs Table - Desktop */}
          <Card title={t('dashboard.caregiver.myJobs')} className="hidden lg:block">
            <div className="overflow-x-auto">
              <Table
                headers={[
                  { key: 'title', label: t('dashboard.caregiver.jobTitle') },
                  { key: 'patient', label: t('dashboard.caregiver.patient') },
                  { key: 'date', label: t('dashboard.caregiver.date') },
                  { key: 'time', label: t('dashboard.caregiver.time') },
                  { key: 'location', label: t('dashboard.caregiver.location') },
                  { key: 'status', label: t('common.status') },
                  { key: 'actions', label: t('common.actions') },
                ]}
                data={filteredJobs}
                renderRow={(job) => (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {job.patient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(job.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {job.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {job.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(job.status)}`}>
                        {t(`dashboard.caregiver.status.${job.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-2">
                        {job.status === 'scheduled' && (
                          <Button
                            onClick={() => handleCheckIn(job.id)}
                            size="sm"
                          >
                            📍 {t('dashboard.caregiver.checkIn')}
                          </Button>
                        )}
                        
                        {job.status === 'in-progress' && (
                          <Button
                            onClick={() => handleCheckOut(job.id)}
                            variant="outline"
                            size="sm"
                          >
                            🏠 {t('dashboard.caregiver.checkOut')}
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => router.push(`/jobs/${job.id}`)}
                          variant="outline"
                          size="sm"
                        >
                          📋 {t('dashboard.caregiver.details')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              />
            </div>
          </Card>

          {/* Earnings Summary */}
          <Card title={t('dashboard.caregiver.earnings')} className="mb-6">
            <div className="space-y-4">
              {earnings.map((earning, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {earning.period}
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ৳{earning.amount.toLocaleString('bn-BD')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {earning.jobs} {t('dashboard.caregiver.jobs')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions - Mobile */}
          <div className="lg:hidden">
            <Card title={t('dashboard.caregiver.quickActions')}>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => router.push('/profile')}
                  className="w-full"
                >
                  👤 {t('dashboard.caregiver.myProfile')}
                </Button>
                <Button
                  onClick={() => router.push('/earnings')}
                  variant="outline"
                  className="w-full"
                >
                  💰 {t('dashboard.caregiver.earningsHistory')}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}