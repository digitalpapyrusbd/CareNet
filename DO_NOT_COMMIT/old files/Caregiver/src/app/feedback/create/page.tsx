'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { apiCall } from '@/lib/api-client';

export default function CreateFeedbackPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [revieweeType, setRevieweeType] = useState('CAREGIVER');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState({
    punctual: false,
    professional: false,
    caring: false,
    skilled: false,
    communicative: false,
    respectful: false,
  });

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
      
      // Fetch completed jobs that user can give feedback for
      const data = await apiCall('/jobs?status=COMPLETED&limit=50', {
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
      setError('Please select a job to give feedback for');
      return;
    }

    try {
      setSubmitting(true);
      
      // Get job details to determine reviewee
      const jobData = await apiCall(`/jobs/${selectedJob}`, {
        method: 'GET',
      });
      
      const job = jobData.data;
      
      // Determine reviewee ID based on reviewee type and user role
      let toUserId = '';
      if (user?.role === 'GUARDIAN') {
        if (revieweeType === 'CAREGIVER') {
          // Guardian rating caregiver - get primary caregiver
          toUserId = job.assignments?.find((a: any) => a.role === 'PRIMARY')?.caregiver?.userId || '';
        } else if (revieweeType === 'COMPANY') {
          // Guardian rating company
          toUserId = job.company?.userId || '';
        }
      } else if (user?.role === 'CAREGIVER' && revieweeType === 'CAREGIVER') {
        // Caregiver rating guardian
        toUserId = job.guardian?.userId || '';
      }
      
      if (!toUserId) {
        setError('Could not determine the recipient of this feedback');
        return;
      }
      
      // Create feedback
      await apiCall('/feedback', {
        method: 'POST',
        body: {
          jobId: selectedJob,
          toUserId,
          revieweeType,
          rating,
          tags,
          comments,
          isPublic,
        }),
      });
      
      if (feedbackResponse.ok) {
        router.push('/feedback');
      } else {
        const errorData = await feedbackResponse.json();
        setError(errorData.error || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (selectedRating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <svg
              className={`h-8 w-8 ${
                star <= selectedRating ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-400 transition-colors`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">({selectedRating}/5)</span>
      </div>
    );
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

  if (user?.role !== 'GUARDIAN' && user?.role !== 'CAREGIVER') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            Only guardians and caregivers can give feedback.
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
                Give Feedback
              </h1>
              <p className="text-gray-600">
                Share your experience and help improve our service
              </p>
            </div>
            <Link href="/feedback">
              <Button variant="outline">
                Back to Feedback
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

        {/* Feedback Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Feedback Details</h2>
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
                <option value="">Select a completed job</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.patient?.name || 'N/A'} - {job.company?.companyName || 'N/A'} - {new Date(job.endDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
              {jobs.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  No completed jobs available for feedback.
                </p>
              )}
            </div>

            {/* Reviewee Type */}
            <div>
              <label htmlFor="revieweeType" className="block text-sm font-medium text-gray-700">
                Who are you rating?
              </label>
              <select
                id="revieweeType"
                value={revieweeType}
                onChange={(e) => setRevieweeType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                {user?.role === 'GUARDIAN' && (
                  <>
                    <option value="CAREGIVER">Caregiver</option>
                    <option value="COMPANY">Company</option>
                  </>
                )}
                {user?.role === 'CAREGIVER' && (
                  <option value="GUARDIAN">Guardian</option>
                )}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              {renderStars(rating)}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select tags that describe your experience
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(tags).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setTags({ ...tags, [key]: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Share your experience..."
              />
            </div>

            {/* Public Visibility */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Make this feedback public (visible to other users)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting || !selectedJob}
                loading={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}