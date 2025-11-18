'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, Card, Table, Chart } from '@/components/ui';
import { Layout } from '@/components/layout/Layout';
import { Sidebar } from '@/components/layout/Sidebar';
import { apiCall } from '@/lib/api-client';

interface VerificationRequest {
  id: string;
  type: 'company' | 'caregiver';
  name: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
}

interface Dispute {
  id: string;
  jobId: string;
  reporter: string;
  respondent: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  createdAt: string;
}

export default function ModeratorDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'disputes'>('overview');

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
      
      // Fetch verification requests
      const verificationData = await apiCall('/moderation/verifications', {
        method: 'GET',
      });
      setVerificationRequests(verificationData);

      // Fetch disputes
      const disputesData = await apiCall('/moderation/disputes', {
        method: 'GET',
      });
      setDisputes(disputesData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'resolved':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
      case 'investigating':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'rejected':
      case 'closed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
      'approved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
      'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
      'investigating': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      'open': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200',
      'resolved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
      'closed': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
    };
    
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Verifications Processed',
        data: [45, 52, 48, 58, 62, 70],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
      {
        label: 'Disputes Resolved',
        data: [12, 15, 18, 14, 20, 25],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
      },
      {
        label: 'Pending Items',
        data: [8, 12, 10, 6, 4, 2],
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
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

  const handleVerificationAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      await apiCall('/moderation/verifications/action', {
        method: 'POST',
        body: {
          requestId,
          action,
        },
      });

      // Refresh data
      fetchDashboardData();
    } catch (error: any) {
      console.error('Verification action failed:', error);
      alert(error.message || 'Action failed. Please try again.');
    }
  };

  const handleDisputeAction = async (disputeId: string, action: 'resolve' | 'close') => {
    try {
      await apiCall('/moderation/disputes/action', {
        method: 'POST',
        body: {
          disputeId,
          action,
        },
      });

      // Refresh data
      fetchDashboardData();
    } catch (error: any) {
      console.error('Dispute action failed:', error);
      alert(error.message || 'Action failed. Please try again.');
    }
  };

  return (
    <Layout>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.moderator.welcome')}, {user?.name}! 🛡️
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard.moderator.subtitle')}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: t('dashboard.moderator.overview') },
                { key: 'verifications', label: t('dashboard.moderator.verifications') },
                { key: 'disputes', label: t('dashboard.moderator.disputes') },
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-600 rounded-full">
                      <span className="text-white text-2xl">📋</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {t('dashboard.moderator.pendingVerifications')}
                      </p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-white">
                        {verificationRequests.filter(v => v.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-600 rounded-full">
                      <span className="text-white text-2xl">⚖️</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        {t('dashboard.moderator.openDisputes')}
                      </p>
                      <p className="text-2xl font-bold text-yellow-900 dark:text-white">
                        {disputes.filter(d => d.status === 'open').length}
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
                        {t('dashboard.moderator.resolvedToday')}
                      </p>
                      <p className="text-2xl font-bold text-green-900 dark:text-white">
                        {disputes.filter(d => d.status === 'resolved' && new Date(d.createdAt).toDateString() === new Date().toDateString()).length}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Verifications Tab */}
          {activeTab === 'verifications' && (
            <Card title={t('dashboard.moderator.verificationManagement')} className="mb-8">
              <div className="overflow-x-auto">
                <Table
                  headers={[
                    { key: 'name', label: t('dashboard.moderator.name') },
                    { key: 'type', label: t('dashboard.moderator.type') },
                    { key: 'submittedAt', label: t('dashboard.moderator.submittedAt') },
                    { key: 'status', label: t('common.status') },
                    { key: 'actions', label: t('common.actions') },
                  ]}
                  data={verificationRequests}
                  renderRow={(request) => (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {request.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request.type === 'company' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
                        }`}>
                          {request.type === 'company' ? '🏢' : '👩‍⚕️'}
                        </span>
                        <span className="ml-2">{request.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                          {t(`dashboard.moderator.status.${request.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            {t('common.view')}
                          </Button>
                          {request.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleVerificationAction(request.id, 'approve')}
                                className="text-green-600 hover:text-green-700"
                              >
                                {t('dashboard.moderator.approve')}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleVerificationAction(request.id, 'reject')}
                                className="text-red-600 hover:text-red-700"
                              >
                                {t('dashboard.moderator.reject')}
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                />
              </div>
            </Card>
          )}

          {/* Disputes Tab */}
          {activeTab === 'disputes' && (
            <Card title={t('dashboard.moderator.disputeManagement')} className="mb-8">
              <div className="overflow-x-auto">
                <Table
                  headers={[
                    { key: 'id', label: t('dashboard.moderator.disputeId') },
                    { key: 'jobId', label: t('dashboard.moderator.jobId') },
                    { key: 'reporter', label: t('dashboard.moderator.reporter') },
                    { key: 'respondent', label: t('dashboard.moderator.respondent') },
                    { key: 'description', label: t('dashboard.moderator.description') },
                    { key: 'createdAt', label: t('dashboard.moderator.createdAt') },
                    { key: 'status', label: t('common.status') },
                    { key: 'actions', label: t('common.actions') },
                  ]}
                  data={disputes}
                  renderRow={(dispute) => (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{dispute.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {dispute.jobId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {dispute.reporter}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {dispute.respondent || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {dispute.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(dispute.status)}`}>
                          {t(`dashboard.moderator.status.${dispute.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            {t('common.view')}
                          </Button>
                          {(dispute.status === 'open' || dispute.status === 'investigating') && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleDisputeAction(dispute.id, 'resolve')}
                                className="text-green-600 hover:text-green-700"
                              >
                                {t('dashboard.moderator.resolve')}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDisputeAction(dispute.id, 'close')}
                                className="text-red-600 hover:text-red-700"
                              >
                                {t('dashboard.moderator.close')}
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                />
              </div>
            </Card>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card title={t('dashboard.moderator.activityChart')}>
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

            <Card title={t('dashboard.moderator.performanceMetrics')}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('dashboard.moderator.avgResponseTime')}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    2.4 hours
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('dashboard.moderator.resolutionRate')}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    87%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('dashboard.moderator.satisfactionScore')}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    4.6/5.0
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}