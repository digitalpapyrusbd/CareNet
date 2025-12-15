'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function PaymentDetailPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user && isAuthenticated && params.id) {
      fetchPayment();
    }
  }, [user, isAuthenticated, params.id]);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`/api/payments/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPayment(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch payment details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (action: 'approve' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this payment?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/payments/${params.id}/process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setPayment(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || `Failed to ${action} payment`);
      }
    } catch (err) {
      setError(`Network error while trying to ${action} payment.`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800';
      case 'FROZEN':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'BKASH':
        return 'bg-pink-100 text-pink-800';
      case 'NAGAD':
        return 'bg-orange-100 text-orange-800';
      case 'CARD':
        return 'bg-indigo-100 text-indigo-800';
      case 'BANK_TRANSFER':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || loading) {
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

  if (error && !payment) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </Layout>
    );
  }

  if (!payment) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Payment Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The payment you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/payments">
            <Button>Back to Payments</Button>
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
                Payment Details
              </h1>
              <p className="text-gray-600">
                Invoice #{payment.invoiceNumber}
              </p>
            </div>
            <Link href="/payments">
              <Button variant="outline">
                Back to Payments
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

        {/* Payment Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                <p className="mt-1 text-sm text-gray-900">{payment.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                <p className="mt-1 text-sm text-gray-900">{payment.transactionId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">৳{payment.amount?.toLocaleString()}</p>
                {payment.refundAmount && (
                  <p className="text-sm text-red-500">Refunded: ৳{payment.refundAmount?.toLocaleString()}</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(payment.method)}`}>
                  {payment.method}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created Date</p>
                <p className="mt-1 text-sm text-gray-900">{new Date(payment.createdAt).toLocaleDateString()}</p>
              </div>
              {payment.paidAt && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Paid Date</p>
                  <p className="mt-1 text-sm text-gray-900">{new Date(payment.paidAt).toLocaleDateString()}</p>
                </div>
              )}
              {payment.refundReason && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Refund Reason</p>
                  <p className="mt-1 text-sm text-gray-900">{payment.refundReason}</p>
                </div>
              )}
            </div>
            
            {/* Actions for Admin/Moderator */}
            {(user?.role === 'SUPER_ADMIN' || user?.role === 'MODERATOR') && 
             payment.status === 'PENDING' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-4">Admin Actions</p>
                <div className="flex space-x-4">
                  <Button
                    onClick={() => handleProcessPayment('approve')}
                    variant="primary"
                  >
                    Approve Payment
                  </Button>
                  <Button
                    onClick={() => handleProcessPayment('reject')}
                    variant="danger"
                  >
                    Reject Payment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Information */}
        {payment.job && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Job Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Patient</p>
                  <p className="mt-1 text-sm text-gray-900">{payment.job.patient?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Company</p>
                  <p className="mt-1 text-sm text-gray-900">{payment.job.company?.companyName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Package</p>
                  <p className="mt-1 text-sm text-gray-900">{payment.job.package?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Job Status</p>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    payment.job.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    payment.job.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    payment.job.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {payment.job.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                  <p className="mt-1 text-sm text-gray-900">{new Date(payment.job.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p className="mt-1 text-sm text-gray-900">{new Date(payment.job.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href={`/jobs/${payment.job.id}`}>
                  <Button variant="outline">
                    View Job Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Documents</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payment.invoiceUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(payment.invoiceUrl, '_blank')}
                  className="justify-center"
                >
                  Download Invoice
                </Button>
              )}
              {payment.receiptUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(payment.receiptUrl, '_blank')}
                  className="justify-center"
                >
                  Download Receipt
                </Button>
              )}
            </div>
            {!payment.invoiceUrl && !payment.receiptUrl && (
              <p className="text-sm text-gray-500">No documents available for this payment.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}