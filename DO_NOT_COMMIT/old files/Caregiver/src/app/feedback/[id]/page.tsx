'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function FeedbackDetailPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user && isAuthenticated && params.id) {
      fetchFeedback();
    }
  }, [user, isAuthenticated, params.id]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`/api/feedback/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch feedback details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const getRevieweeTypeColor = (type: string) => {
    switch (type) {
      case 'CAREGIVER':
        return 'bg-blue-100 text-blue-800';
      case 'COMPANY':
        return 'bg-purple-100 text-purple-800';
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

  if (error && !feedback) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </Layout>
    );
  }

  if (!feedback) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Feedback Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The feedback you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/feedback">
            <Button>Back to Feedback</Button>
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
                Feedback Details
              </h1>
              <p className="text-gray-600">
                Review ID: {feedback.id}
              </p>
            </div>
            <Link href="/feedback">
              <Button variant="outline">
                Back to Feedback
              </Button>
            </Link>
          </div>
        </div>

        {/* Feedback Details */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Review Information</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* From/To Information */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">From</p>
                <p className="mt-1 text-sm text-gray-900">{feedback.fromUser?.name}</p>
                <p className="text-xs text-gray-500">{feedback.fromUser?.role}</p>
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
                <p className="text-sm font-medium text-gray-500">To</p>
                <p className="mt-1 text-sm text-gray-900">{feedback.toUser?.name}</p>
                <div className="flex items-center justify-end space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRevieweeTypeColor(feedback.revieweeType)}`}>
                    {feedback.revieweeType}
                  </span>
                  <p className="text-xs text-gray-500">{feedback.toUser?.role}</p>
                </div>
              </div>
            </div>

            {/* Job Information */}
            <div>
              <p className="text-sm font-medium text-gray-500">Job Information</p>
              <p className="mt-1 text-sm text-gray-900">
                Job ID: {feedback.jobId} | {new Date(feedback.job?.startDate).toLocaleDateString()} - {new Date(feedback.job?.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Patient: {feedback.job?.patient?.name} | Company: {feedback.job?.company?.companyName}
              </p>
            </div>

            {/* Rating */}
            <div>
              <p className="text-sm font-medium text-gray-500">Rating</p>
              {renderStars(feedback.rating)}
            </div>

            {/* Tags */}
            {feedback.tags && Object.keys(feedback.tags).length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(feedback.tags).map(([key, value]) => (
                    <span
                      key={key}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                    >
                      {key}: {value ? 'Yes' : 'No'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            {feedback.comments && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Comments:</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{feedback.comments}</p>
              </div>
            )}

            {/* Company Response */}
            {feedback.companyResponse && (
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Company Response:</p>
                <p className="text-gray-700 bg-blue-50 p-4 rounded-md">{feedback.companyResponse}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Responded on {new Date(feedback.respondedAt).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Created Date</p>
                  <p className="mt-1 text-sm text-gray-900">{new Date(feedback.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Visibility</p>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    feedback.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {feedback.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              {(user?.role === 'COMPANY' && feedback.revieweeType === 'COMPANY' && !feedback.companyResponse) && (
                <Link href={`/feedback/${feedback.id}/respond`}>
                  <Button variant="primary">
                    Respond
                  </Button>
                </Link>
              )}
              {(user?.role === 'SUPER_ADMIN' || user?.role === 'MODERATOR') && (
                <Button
                  variant={feedback.flaggedInappropriate ? "outline" : "danger"}
                  onClick={async () => {
                    if (confirm(feedback.flaggedInappropriate ? 'Unflag this feedback?' : 'Flag this feedback as inappropriate?')) {
                      try {
                        const token = localStorage.getItem('accessToken');
                        const response = await fetch(`/api/feedback/${feedback.id}/flag`, {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                          },
                        });
                        
                        if (response.ok) {
                          const data = await response.json();
                          setFeedback(data.data);
                        } else {
                          const errorData = await response.json();
                          setError(errorData.error || 'Failed to update feedback');
                        }
                      } catch (err) {
                        setError('Network error. Please try again.');
                      }
                    }
                  }}
                >
                  {feedback.flaggedInappropriate ? 'Unflag' : 'Flag as Inappropriate'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}