'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, Card, Table, Chart } from '@/components/ui';
import { Layout } from '@/components/layout/Layout';
import { Sidebar } from '@/components/layout/Sidebar';
import { apiCall } from '@/lib/api-client';

interface Caregiver {
  id: string;
  name: string;
  phone: string;
  email: string;
  experience: string;
  skills: string[];
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
}

interface Patient {
  id: string;
  name: string;
  guardian: string;
  condition: string;
  assignedCaregiver: string;
  status: 'active' | 'inactive';
}

interface Package {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isActive: boolean;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'caregivers' | 'patients' | 'packages'>('overview');

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
      
      // Fetch caregivers
      const caregiversData = await apiCall('/caregivers?companyId=' + user?.id, {
        method: 'GET',
      });
      setCaregivers(caregiversData);

      // Fetch patients
      const patientsData = await apiCall('/patients?companyId=' + user?.id, {
        method: 'GET',
      });
      setPatients(patientsData);

      // Fetch packages
      const packagesData = await apiCall('/packages?companyId=' + user?.id, {
        method: 'GET',
      });
      setPackages(packagesData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'inactive':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
      'inactive': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
    };
    
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Caregivers',
        data: [12, 15, 18, 16, 20, 22],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
      {
        label: 'Active Patients',
        data: [45, 52, 48, 58, 62, 70],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
      },
      {
        label: 'Revenue (BDT)',
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
              {t('dashboard.company.welcome')}, {user?.companyName || user?.name}! 🏢
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard.company.subtitle')}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: t('dashboard.company.overview') },
                { key: 'caregivers', label: t('dashboard.company.caregivers') },
                { key: 'patients', label: t('dashboard.company.patients') },
                { key: 'packages', label: t('dashboard.company.packages') },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-600 rounded-full">
                        <span className="text-white text-2xl">👩‍⚕️</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {t('dashboard.company.totalCaregivers')}
                        </p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-white">
                          {caregivers.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-600 rounded-full">
                        <span className="text-white text-2xl">👥</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                          {t('dashboard.company.totalPatients')}
                        </p>
                        <p className="text-2xl font-bold text-green-900 dark:text-white">
                          {patients.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-600 rounded-full">
                        <span className="text-white text-2xl">📦</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                          {t('dashboard.company.activePackages')}
                        </p>
                        <p className="text-2xl font-bold text-yellow-900 dark:text-white">
                          {packages.filter(p => p.isActive).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-600 rounded-full">
                        <span className="text-white text-2xl">💳</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          {t('dashboard.company.monthlyRevenue')}
                        </p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-white">
                          ৳75,000
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card title={t('dashboard.company.growthChart')}>
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

                <Card title={t('dashboard.company.revenueChart')}>
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

          {/* Caregivers Tab */}
          {activeTab === 'caregivers' && (
            <Card title={t('dashboard.company.caregiverManagement')} className="mb-8">
              <div className="overflow-x-auto">
                <Table
                  headers={[
                    { key: 'name', label: t('dashboard.company.caregiverName') },
                    { key: 'phone', label: t('dashboard.company.phone') },
                    { key: 'email', label: t('dashboard.company.email') },
                    { key: 'experience', label: t('dashboard.company.experience') },
                    { key: 'skills', label: t('dashboard.company.skills') },
                    { key: 'rating', label: t('dashboard.company.rating') },
                    { key: 'status', label: t('common.status') },
                    { key: 'actions', label: t('common.actions') },
                  ]}
                  data={caregivers}
                  renderRow={(caregiver) => (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {caregiver.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {caregiver.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {caregiver.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {caregiver.experience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex flex-wrap gap-1">
                          {caregiver.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 rounded">
                              {skill}
                            </span>
                          ))}
                          {caregiver.skills.length > 3 && (
                            <span className="text-xs text-gray-500">+{caregiver.skills.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <span className="text-yellow-400">⭐</span>
                          <span className="ml-1">{caregiver.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(caregiver.status)}`}>
                          {t(`dashboard.company.status.${caregiver.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            {t('common.view')}
                          </Button>
                          <Button size="sm">
                            {t('common.edit')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                />
              </div>
              <div className="mt-4 text-center">
                <Button onClick={() => router.push('/caregivers')}>
                  {t('dashboard.company.viewAllCaregivers')}
                </Button>
              </div>
            </Card>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <Card title={t('dashboard.company.patientManagement')} className="mb-8">
              <div className="overflow-x-auto">
                <Table
                  headers={[
                    { key: 'name', label: t('dashboard.company.patientName') },
                    { key: 'guardian', label: t('dashboard.company.guardian') },
                    { key: 'condition', label: t('dashboard.company.condition') },
                    { key: 'assignedCaregiver', label: t('dashboard.company.assignedCaregiver') },
                    { key: 'status', label: t('common.status') },
                    { key: 'actions', label: t('common.actions') },
                  ]}
                  data={patients}
                  renderRow={(patient) => (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {patient.guardian}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {patient.condition}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {patient.assignedCaregiver || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(patient.status)}`}>
                          {t(`dashboard.company.status.${patient.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            {t('common.view')}
                          </Button>
                          <Button size="sm">
                            {t('common.edit')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                />
              </div>
              <div className="mt-4 text-center">
                <Button onClick={() => router.push('/patients')}>
                  {t('dashboard.company.viewAllPatients')}
                </Button>
              </div>
            </Card>
          )}

          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <Card title={t('dashboard.company.packageManagement')} className="mb-8">
              <div className="overflow-x-auto">
                <Table
                  headers={[
                    { key: 'name', label: t('dashboard.company.packageName') },
                    { key: 'price', label: t('dashboard.company.price') },
                    { key: 'duration', label: t('dashboard.company.duration') },
                    { key: 'features', label: t('dashboard.company.features') },
                    { key: 'status', label: t('common.status') },
                    { key: 'actions', label: t('common.actions') },
                  ]}
                  data={packages}
                  renderRow={(pkg) => (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {pkg.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ৳{pkg.price.toLocaleString('bn-BD')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {pkg.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex flex-wrap gap-1">
                          {pkg.features.slice(0, 2).map((feature, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 rounded">
                              {feature}
                            </span>
                          ))}
                          {pkg.features.length > 2 && (
                            <span className="text-xs text-gray-500">+{pkg.features.length - 2} more</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(pkg.isActive ? 'active' : 'inactive')}`}>
                          {pkg.isActive ? t('dashboard.company.active') : t('dashboard.company.inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            {t('common.view')}
                          </Button>
                          <Button size="sm">
                            {t('common.edit')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                />
              </div>
              <div className="mt-4 text-center">
                <Button onClick={() => router.push('/packages')}>
                  {t('dashboard.company.managePackages')}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}