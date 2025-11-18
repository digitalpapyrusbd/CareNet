'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, Card, Table, Chart } from '@/components/ui';
import { Layout } from '@/components/layout/Layout';
import { Sidebar } from '@/components/layout/Sidebar';
import { apiCall } from '@/lib/api-client';

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  lastVisit: string;
  status: 'active' | 'inactive';
}

interface Job {
  id: string;
  title: string;
  caregiver: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface Payment {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

export default function GuardianDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
      
      // Fetch patients
      const patientsData = await apiCall('/patients?guardianId=' + user?.id, {
        method: 'GET',
      });
      setPatients(patientsData);

      // Fetch jobs
      const jobsData = await apiCall('/jobs?guardianId=' + user?.id, {
        method: 'GET',
      });
      setJobs(jobsData);

      // Fetch payments
      const paymentsData = await apiCall('/payments?guardianId=' + user?.id, {
        method: 'GET',
      });
      setPayments(paymentsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'scheduled':
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'in-progress':
        return 'text-blue-600 dark:text-blue-400';
      case 'inactive':
      case 'cancelled':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
      'inactive': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
      'scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
      'pending': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200',
      'failed': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
    };
    
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Care Hours',
        data: [120, 150, 180, 140, 200, 160],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
      {
        label: 'Payments',
        data: [5000, 6000, 5500, 7000, 8000, 6500],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
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
              {t('dashboard.guardian.welcome')}, {user?.name}!{'👨‍👩‍👧‍👦'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard.guardian.subtitle')}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-600 rounded-full">
                    <span className="text-white text-2xl">{'👥'}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {t('dashboard.guardian.totalPatients')}
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-white">
                      {patients.length}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-600 rounded-full">
                    <span className="text-white text-2xl">{'📅'}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {t('dashboard.guardian.activeJobs')}
                    </p>
                    <p className="text-2xl font-bold text-green-900 dark:text-white">
                      {jobs.filter(job => job.status === 'scheduled' || job.status === 'in-progress').length}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-600 rounded-full">
                    <span className="text-white text-2xl">{'💳'}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      {t('dashboard.guardian.monthlySpending')}
                    </p>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-white">
                      ৳{payments
                        .filter(p => p.status === 'completed')
                        .reduce((sum, p) => sum + p.amount, 0)
                        .toLocaleString('bn-BD')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-600 rounded-full">
                    <span className="text-white text-2xl">{'⭐'}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {t('dashboard.guardian.averageRating')}
                    </p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-white">
                      4.8
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card title={t('dashboard.guardian.careTrends')}>
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

            <Card title={t('dashboard.guardian.paymentHistory')}>
              <Chart
                type="bar"
                data={{
                  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                  datasets: [
                    {
                      label: 'Payments (BDT)',
                      data: [5000, 6000, 5500, 7000],
                      backgroundColor: 'rgba(34, 197, 94, 0.8)',
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

          {/* Recent Patients */}
          <Card title={t('dashboard.guardian.recentPatients')} className="mb-8">
            <div className="overflow-x-auto">
              <Table
                headers={[
                  { key: 'name', label: t('dashboard.guardian.patientName') },
                  { key: 'age', label: t('dashboard.guardian.age') },
                  { key: 'condition', label: t('dashboard.guardian.condition') },
                  { key: 'lastVisit', label: t('dashboard.guardian.lastVisit') },
                  { key: 'status', label: t('common.status') },
                ]}
                data={patients.slice(0, 5)}
                renderRow={(patient) => (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {patient.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {patient.condition}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(patient.status)}`}>
                        {t(`dashboard.guardian.status.${patient.status}`)}
                      </span>
                    </td>
                  </tr>
                )}
              />
            </div>
            <div className="mt-4 text-center">
              <Button
                onClick={() => router.push('/patients')}
                variant="outline"
              >
                {t('dashboard.guardian.viewAllPatients')}
              </Button>
            </div>
          </Card>

          {/* Recent Jobs */}
          <Card title={t('dashboard.guardian.recentJobs')} className="mb-8">
            <div className="overflow-x-auto">
              <Table
                headers={[
                  { key: 'title', label: t('dashboard.guardian.jobTitle') },
                  { key: 'caregiver', label: t('dashboard.guardian.caregiver') },
                  { key: 'date', label: t('dashboard.guardian.date') },
                  { key: 'time', label: t('dashboard.guardian.time') },
                  { key: 'status', label: t('common.status') },
                ]}
                data={jobs.slice(0, 5)}
                renderRow={(job) => (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {job.caregiver}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(job.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {job.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(job.status)}`}>
                        {t(`dashboard.guardian.jobStatus.${job.status}`)}
                      </span>
                    </td>
                  </tr>
                )}
              />
            </div>
            <div className="mt-4 text-center">
              <Button
                onClick={() => router.push('/jobs')}
                variant="outline"
              >
                {t('dashboard.guardian.viewAllJobs')}
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title={t('dashboard.guardian.quickActions')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push('/patients/new')}
                className="w-full"
              >
                {'👨‍👩‍👧‍👦'} {t('dashboard.guardian.addPatient')}
              </Button>
              <Button
                onClick={() => router.push('/jobs/create')}
                variant="outline"
                className="w-full"
              >
                {'📋'} {t('dashboard.guardian.createJob')}
              </Button>
              <Button
                onClick={() => router.push('/packages')}
                variant="outline"
                className="w-full"
              >
                {'📦'} {t('dashboard.guardian.browsePackages')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}