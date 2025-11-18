export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Ratings & Feedback</h1>
      <p className="text-gray-600">Placeholder for rating and feedback interface. Implement review list, submission form, and moderation controls here.</p>
    </main>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function FeedbackPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [revieweeTypeFilter, setRevieweeTypeFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchFeedback();
    }
  }, [user, isAuthenticated, currentPage, jobFilter, revieweeTypeFilter, ratingFilter]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      let url = `/api/feedback?page=${currentPage}&limit=10`;
      if (jobFilter) {
        url += `&jobId=${jobFilter}`;
      }
      if (revieweeTypeFilter) {
        url += `&revieweeType=${revieweeTypeFilter}`;
      }
      if (ratingFilter) {
        url += `&rating=${ratingFilter}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch feedback');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchFeedback();
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Feedback & Ratings
              </h1>
              <p className="text-gray-600">
                View and manage feedback and ratings
              </p>
            </div>
            {(user?.role === 'GUARDIAN' || user?.role === 'CAREGIVER') && (
              <Link href="/feedback/create">
                <Button>
                  Give Feedback
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Jobs</option>
                {/* Job options would be populated dynamically */}
              </select>
              <select
                value={revieweeTypeFilter}
                onChange={(e) => setRevieweeTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="CAREGIVER">Caregiver</option>
                <option value="COMPANY">Company</option>
              </select>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <Button type="submit">
                Filter
              </Button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Feedback List */}
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.fromUser?.name} → {item.toUser?.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRevieweeTypeColor(item.revieweeType)}`}>
                      {item.revieweeType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Job ID: {item.jobId} | {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {renderStars(item.rating)}
              </div>
              
              {item.comments && (
                <div className="mb-4">
                  <p className="text-gray-700">{item.comments}</p>
                </div>
              )}
              
              {item.tags && Object.keys(item.tags).length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(item.tags).map(([key, value]) => (
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
              
              {item.companyResponse && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Company Response:</p>
                  <p className="text-gray-600">{item.companyResponse}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.respondedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end mt-4 space-x-2">
                <Link href={`/feedback/${item.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                {(user?.role === 'COMPANY' && item.revieweeType === 'COMPANY' && !item.companyResponse) && (
                  <Link href={`/feedback/${item.id}/respond`}>
                    <Button variant="primary" size="sm">
                      Respond
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
          
          {feedback.length === 0 && (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No feedback found
              </h3>
              <p className="text-gray-500">
                {user?.role === 'GUARDIAN' || user?.role === 'CAREGIVER'
                  ? 'You haven\'t given or received any feedback yet.'
                  : 'No feedback available.'}
              </p>
            </div>
          )}
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
      </div>
    </Layout>
  );
}