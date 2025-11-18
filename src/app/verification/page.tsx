'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Table, TableColumn } from '@/components/ui/Table';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { apiCall } from '@/lib/api-client';

export default function VerificationPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [type, setType] = useState('company'); // 'company' or 'caregiver'
  const [status, setStatus] = useState('pending'); // 'pending', 'verified', 'rejected'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchVerifications();
    }
  }, [user, isAuthenticated, currentPage, type, status]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      
      let url = `/verification?page=${currentPage}&limit=10&type=${type}`;
      if (status !== 'all') {
        url += `&status=${status}`;
      }
      
      const data = await apiCall(url, {
        method: 'GET',
      });
      
      setVerifications(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (item: any, isVerified: boolean) => {
    setSelectedItem(item);
    setVerificationNotes('');
    setShowModal(true);
  };

  const submitVerification = async () => {
    if (!selectedItem) return;

    try {
      setSubmitting(true);
      
      const body = {
        type,
        [type === 'company' ? 'companyId' : 'caregiverId']: selectedItem.id,
        isVerified: true,
        verificationNotes,
      };
      
      await apiCall('/verification', {
        method: 'POST',
        body,
      });
      
      setShowModal(false);
      setSelectedItem(null);
      fetchVerifications(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (item: any) => {
    if (!confirm('Are you sure you want to reject this verification?')) {
      return;
    }

    try {
      setSubmitting(true);
      
      const body = {
        type,
        [type === 'company' ? 'companyId' : 'caregiverId']: item.id,
        isVerified: false,
        verificationNotes: 'Rejected by moderator',
      };
      
      await apiCall('/verification', {
        method: 'POST',
        body,
      });
      
      fetchVerifications(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getVerificationStatusColor = (isVerified: boolean) => {
    return isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Define table columns
  const columns: TableColumn<any>[] = [
    {
      key: type === 'company' ? 'user' : 'user',
      header: 'Name',
      render: (value, row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row.user?.name || 'N/A'}
          </div>
          <div className="text-sm text-gray-500">
            {row.user?.phone || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      key: type === 'company' ? 'companyName' : 'company',
      header: type === 'company' ? 'Company Name' : 'Company',
      render: (value, row) => (
        <div className="text-sm text-gray-900">
          {type === 'company' ? row.companyName : row.company?.companyName || 'N/A'}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Applied Date',
      render: (value) => (
        <div className="text-sm text-gray-900">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'isVerified',
      header: 'Status',
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getVerificationStatusColor(value)}`}>
          {value === true ? 'Verified' : value === false ? 'Rejected' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          {row.isVerified === null && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleVerify(row, true)}
                disabled={submitting}
              >
                Verify
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleReject(row)}
                disabled={submitting}
              >
                Reject
              </Button>
            </>
          )}
          {row.verificationNotes && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                alert(row.verificationNotes);
              }}
            >
              View Notes
            </Button>
          )}
        </div>
      ),
    },
  ];

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

  if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'MODERATOR') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            Only administrators and moderators can access verification management.
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
          <h1 className="text-2xl font-semibold text-gray-900">
            Verification Management
          </h1>
          <p className="text-gray-600">
            Review and verify company and caregiver applications
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setCurrentPage(1);
                }}
                className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="company">Companies</option>
                <option value="caregiver">Caregivers</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Verifications Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Table
            data={verifications}
            columns={columns}
            loading={loading}
            error={error}
            emptyMessage="No verifications found"
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Verification Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Verify {type === 'company' ? 'Company' : 'Caregiver'}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Name:</strong> {selectedItem.user?.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Phone:</strong> {selectedItem.user?.phone}
                  </p>
                  {type === 'company' ? (
                    <p className="text-sm text-gray-700">
                      <strong>Company:</strong> {selectedItem.companyName}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-700">
                      <strong>Company:</strong> {selectedItem.company?.companyName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Verification Notes
                  </label>
                  <textarea
                    id="notes"
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Add any notes about this verification..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedItem(null);
                    setVerificationNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitVerification}
                  disabled={submitting}
                  loading={submitting}
                >
                  {submitting ? 'Processing...' : 'Verify'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}