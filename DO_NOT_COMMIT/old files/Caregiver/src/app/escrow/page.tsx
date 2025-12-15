'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { useAuth } from '@/hooks/useAuth';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import Link from 'next/link';

interface Escrow {
  id: string;
  paymentId: string;
  amount: number;
  fee: number;
  status: string;
  createdAt: string;
  releasedAt?: string;
  payment: {
    id: string;
    payer: {
      id: string;
      name: string;
      email: string;
    };
    job?: {
      id: string;
      title: string;
    };
  };
}

interface EscrowTableRow {
  id: string;
  paymentId: string;
  amount: number;
  fee: number;
  status: Element;
  createdAt: string;
  releasedAt: string;
  payment: {
    id: string;
    payer: {
      id: string;
      name: string;
      email: string;
    };
    job?: {
      id: string;
      title: string;
    };
  };
  actions: Element;
}

export default function EscrowPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslationContext();
  const router = useRouter();
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated && user?.role !== 'SUPER_ADMIN' && user?.role !== 'MODERATOR') {
      router.push('/dashboard');
      return;
    }

    fetchEscrows();
  }, [isAuthenticated, isLoading, user]);

  const fetchEscrows = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`/api/escrow?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEscrows(data.escrows || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch escrows');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (escrowId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`/api/escrow`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          escrowId,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Refresh escrows list
        fetchEscrows();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to release escrow');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleRefund = async (escrowId: string) => {
    if (!confirm('Are you sure you want to refund this escrow?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`/api/escrow`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          escrowId,
          amount: escrows.find(e => e.id === escrowId)?.amount || 0,
          reason: 'Service cancelled',
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Refresh escrows list
        fetchEscrows();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to refund escrow');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HELD':
        return 'bg-yellow-100 text-yellow-800';
      case 'RELEASED':
        return 'bg-green-100 text-green-800';
      case 'REFUNDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            Please log in to access this page.
          </p>
          <Button
            onClick={() => router.push('/auth/login')}
            className="mt-4"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'MODERATOR') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            Only administrators and moderators can access escrow management.
          </p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {t('escrow.title')}
              </h1>
              <p className="text-gray-600">
                {t('escrow.description')}
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                {t('common.back')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Escrows Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">{t('escrow.escrows')}</h2>
          </div>
          <Table
            headers={[
              { key: 'paymentId', label: t('escrow.paymentId') },
              { key: 'amount', label: t('escrow.amount') },
              { key: 'fee', label: t('escrow.fee') },
              { key: 'status', label: t('escrow.status') },
              { key: 'createdAt', label: t('escrow.createdAt') },
              { key: 'releasedAt', label: t('escrow.releasedAt') },
              { key: 'actions', label: t('common.actions') },
            ]}
            data={escrows.map((escrow): EscrowTableRow => ({
              id: escrow.id,
              paymentId: escrow.paymentId,
              amount: escrow.amount,
              fee: escrow.fee,
              status: (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(escrow.status)}`}>
                  {escrow.status}
                </span>
              ) as React.ReactElement,
              createdAt: formatDate(escrow.createdAt),
              releasedAt: escrow.releasedAt ? formatDate(escrow.releasedAt) : '-',
              payment: {
                id: escrow.payment?.id || '',
                payer: {
                  id: escrow.payment?.payer?.id || '',
                  name: escrow.payment?.payer?.name || '',
                  email: escrow.payment?.payer?.email || '',
                },
                job: {
                  id: escrow.payment?.job?.id || '',
                  title: escrow.payment?.job?.title || '',
                },
              },
              actions: (
                <div className="flex space-x-2">
                  {escrow.status === 'HELD' && (
                    <Button
                      size="sm"
                      onClick={() => handleRelease(escrow.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {t('escrow.release')}
                    </Button>
                  )}
                  {escrow.status === 'HELD' && (
                    <Button
                      size="sm"
                      onClick={() => handleRefund(escrow.id)}
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      {t('escrow.refund')}
                    </Button>
                  )}
                </div>
              ) as React.ReactElement,
            }))}
            pagination={{
              currentPage: page,
              totalPages: totalPages,
              onPageChange: setPage,
            }}
          />
        </div>
      </div>
    </Layout>
  );
}