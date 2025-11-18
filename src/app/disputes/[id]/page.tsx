'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { apiCall } from '@/lib/api-client';

export default function DisputeDetailPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedModerator, setSelectedModerator] = useState('');
  const [resolution, setResolution] = useState('');
  const [resolutionAction, setResolutionAction] = useState('');
  const [moderators, setModerators] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user && isAuthenticated && params.id) {
      fetchDispute();
      if (user?.role === 'SUPER_ADMIN' || user?.role === 'MODERATOR') {
        fetchModerators();
      }
    }
  }, [user, isAuthenticated, params.id]);

  const fetchDispute = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`/api/disputes/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDispute(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch dispute details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchModerators = async () => {
    try {
      const data = await apiCall('/users?role=MODERATOR', {
        method: 'GET',
      });
      
      setModerators(data.data || []);
    } catch (err) {
      console.error('Failed to fetch moderators:', err);
    }
  };

  const handleAssignModerator = async () => {
    if (!selectedModerator) {
      setError('Please select a moderator');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`/api/disputes/${params.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'assign',
          moderatorId: selectedModerator,
        }),
      });
      
      if (response.ok) {
        setShowAssignModal(false);
        setSelectedModerator('');
        fetchDispute(); // Refresh dispute data
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to assign moderator');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveDispute = async () => {
    if (!resolution.trim() || !resolutionAction.trim()) {
      setError('Please provide resolution details');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`/api/disputes/${params.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'resolve',
          resolution,
          resolutionAction,
        }),
      });
      
      if (response.ok) {
        setShowResolveModal(false);
        setResolution('');
        setResolutionAction('');
        fetchDispute(); // Refresh dispute data
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to resolve dispute');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisputeTypeColor = (type: string) => {
    switch (type) {
      case 'PAYMENT':
        return 'bg-red-100 text-red-800';
      case 'QUALITY':
        return 'bg-orange-100 text-orange-800';
      case 'SAFETY':
        return 'bg-purple-100 text-purple-800';
      case 'NO_SHOW':
        return 'bg-indigo-100 text-indigo-800';
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

  if (error && !dispute) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </Layout>
    );
  }

  if (!dispute) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Dispute Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The dispute you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/disputes">
            <Button>Back to Disputes</Button>
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
                Dispute Details
              </h1>
              <p className="text-gray-600">
                Dispute ID: {dispute.id}
              </p>
            </div>
            <Link href="/disputes">
              <Button variant="outline">
                Back to Disputes
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

        {/* Dispute Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Dispute Information</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Parties Involved */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Raised By</p>
                <p className="mt-1 text-sm text-gray-900">{dispute.raisedByUser?.name}</p>
                <p className="text-xs text-gray-500">{dispute.raisedByUser?.role}</p>
              </div>
              <div className="text-center">
                <svg
                  className="h-6 w-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Against</p>
                <p className="mt-1 text-sm text-gray-900">{dispute.againstUser?.name}</p>
                <p className="text-xs text-gray-500">{dispute.againstUser?.role}</p>
              </div>
            </div>

            {/* Dispute Details */}
            <div>
              <p className="text-sm font-medium text-gray-500">Dispute Type</p>
              <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDisputeTypeColor(dispute.disputeType)}`}>
                {dispute.disputeType}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dispute.status)}`}>
                {dispute.status}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-4 rounded-md">{dispute.description}</p>
            </div>

            {dispute.evidenceUrls && dispute.evidenceUrls.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-500">Evidence</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {dispute.evidenceUrls.map((url: string, index: number) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      View Evidence {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Job Information */}
            <div>
              <p className="text-sm font-medium text-gray-500">Job Information</p>
              <div className="mt-1 text-sm text-gray-900">
                <p><strong>Job ID:</strong> {dispute.job?.id}</p>
                <p><strong>Patient:</strong> {dispute.job?.patient?.name}</p>
                <p><strong>Company:</strong> {dispute.job?.company?.companyName}</p>
                <p><strong>Package:</strong> {dispute.job?.package?.name}</p>
                <p><strong>Duration:</strong> {new Date(dispute.job?.startDate).toLocaleDateString()} - {new Date(dispute.job?.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Assigned Moderator */}
            {dispute.assignedModerator && (
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned Moderator</p>
                <p className="mt-1 text-sm text-gray-900">{dispute.assignedModerator?.name}</p>
                <p className="text-xs text-gray-500">{dispute.assignedModerator?.phone}</p>
              </div>
            )}

            {/* Resolution */}
            {dispute.resolution && (
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm font-medium text-gray-500">Resolution</p>
                <p className="mt-1 text-sm text-gray-900 bg-green-50 p-4 rounded-md">{dispute.resolution}</p>
                <p className="mt-1 text-sm text-gray-500">
                  <strong>Action Taken:</strong> {dispute.resolutionAction}
                </p>
                <p className="text-xs text-gray-500">
                  Resolved on {new Date(dispute.resolvedAt).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Admin/Moderator Actions */}
            {(user?.role === 'SUPER_ADMIN' || user?.role === 'MODERATOR') && (
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                {dispute.status === 'OPEN' && (
                  <Button
                    variant="primary"
                    onClick={() => setShowAssignModal(true)}
                  >
                    Assign Moderator
                  </Button>
                )}
                {(dispute.status === 'OPEN' || dispute.status === 'UNDER_REVIEW') && (
                  <Button
                    variant="primary"
                    onClick={() => setShowResolveModal(true)}
                  >
                    Resolve Dispute
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Assign Moderator Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Assign Moderator
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="moderator" className="block text-sm font-medium text-gray-700">
                    Select Moderator
                  </label>
                  <select
                    id="moderator"
                    value={selectedModerator}
                    onChange={(e) => setSelectedModerator(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select a moderator</option>
                    {moderators.map((moderator) => (
                      <option key={moderator.id} value={moderator.id}>
                        {moderator.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedModerator('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignModerator}
                  disabled={submitting || !selectedModerator}
                  loading={submitting}
                >
                  {submitting ? 'Assigning...' : 'Assign'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Resolve Dispute Modal */}
        {showResolveModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Resolve Dispute
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="resolution" className="block text-sm font-medium text-gray-700">
                    Resolution
                  </label>
                  <textarea
                    id="resolution"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Describe how this dispute was resolved..."
                  />
                </div>
                <div>
                  <label htmlFor="resolutionAction" className="block text-sm font-medium text-gray-700">
                    Action Taken
                  </label>
                  <input
                    type="text"
                    id="resolutionAction"
                    value={resolutionAction}
                    onChange={(e) => setResolutionAction(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Refund issued, Warning issued, etc."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResolveModal(false);
                    setResolution('');
                    setResolutionAction('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleResolveDispute}
                  disabled={submitting || !resolution.trim() || !resolutionAction.trim()}
                  loading={submitting}
                >
                  {submitting ? 'Resolving...' : 'Resolve'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}