'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { BkashPayment, NagadPayment } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import Link from 'next/link';
import { apiCall } from '@/lib/api-client';

export default function CreatePaymentPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslationContext();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BKASH');

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchJobs();
    }
  }, [user, isAuthenticated]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Fetch jobs that need payment (PENDING_ASSIGNMENT status)
      const data = await apiCall('/jobs?status=PENDING_ASSIGNMENT&limit=50', {
        method: 'GET',
      });
      
      setJobs(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJob) {
      setError('Please select a job to make payment for');
      return;
    }

    try {
      setSubmitting(true);
      
      // Get job details to calculate amount
      const jobData = await apiCall(`/jobs/${selectedJob}`, {
        method: 'GET',
      });
      
      const job = jobData.data;
      
      // Generate invoice number and transaction ID
      const invoiceNumber = `INV-${Date.now()}`;
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create payment
      const paymentData = await apiCall('/payments', {
        method: 'POST',
        body: {
          jobId: selectedJob,
          amount: job.totalPrice,
          method: paymentMethod,
          transactionId,
          invoiceNumber,
        },
      });
      
      router.push(`/payments/${paymentData.data.id}`);
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
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

  if (user?.role !== 'GUARDIAN') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            Only guardians can create payments.
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
                Create Payment
              </h1>
              <p className="text-gray-600">
                Make a payment for a care service
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

        {/* Payment Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Payment Details</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Job Selection */}
            <div>
              <label htmlFor="job" className="block text-sm font-medium text-gray-700">
                Select Job
              </label>
              <select
                id="job"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a job to pay for</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.patient?.name || 'N/A'} - {job.company?.companyName || 'N/A'} - ৳{job.totalPrice?.toLocaleString()}
                  </option>
                ))}
              </select>
              {jobs.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  No pending jobs available for payment.
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                id="method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="BKASH">bKash</option>
                <option value="NAGAD">Nagad</option>
                <option value="CARD">{t('payments.creditCard')}</option>
                <option value="BANK_TRANSFER">{t('payments.bankTransfer')}</option>
              </select>
            </div>

            {/* Payment Gateway Info */}
            {selectedJob && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Information</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>After creating this payment record, you will be redirected to the payment gateway to complete the transaction.</p>
                  <p>Make sure you have your {paymentMethod} account ready.</p>
                </div>
              </div>
            )}

            {/* Payment Gateway Buttons */}
            {selectedJob && paymentMethod === 'BKASH' && (
              <div className="mt-6">
                <div className="bg-pink-50 border border-pink-200 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-pink-900 mb-2">{t('payments.bkashPayment')}</h3>
                  <BkashPayment
                    amount={jobs.find(j => j.id === selectedJob)?.totalPrice || 0}
                    jobId={selectedJob}
                    onSuccess={(paymentId) => {
                      // Payment will be handled by bKash redirect
                    }}
                    onError={(error) => setError(error)}
                  />
                </div>
              </div>
            )}

            {selectedJob && paymentMethod === 'NAGAD' && (
              <div className="mt-6">
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-orange-900 mb-2">{t('payments.nagadPayment')}</h3>
                  <NagadPayment
                    amount={jobs.find(j => j.id === selectedJob)?.totalPrice || 0}
                    jobId={selectedJob}
                    onSuccess={(paymentId) => {
                      // Payment will be handled by Nagad redirect
                    }}
                    onError={(error) => setError(error)}
                  />
                </div>
              </div>
            )}

            {/* Submit Button for other payment methods */}
            {!['BKASH', 'NAGAD'].includes(paymentMethod) && (
              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  disabled={submitting || !selectedJob}
                  loading={submitting}
                >
                  {submitting ? t('common.loading') : t('payments.createPayment')}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}