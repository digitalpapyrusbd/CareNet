'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function RespondToFeedbackPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!response.trim()) {
      setError('Please provide a response');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('accessToken');
      
      const feedbackResponse = await fetch(`/api/feedback/${params.id}/respond`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response }),
      });
      
      if (feedbackResponse.ok) {
        router.push(`/feedback/${params.id}`);
      } else {
        const errorData = await feedbackResponse.json();
        setError(errorData.error || 'Failed to submit response');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
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

  if (user?.role !== 'COMPANY') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            Only companies can respond to feedback.
          </p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </Layout>
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

  if (feedback.companyResponse) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Already Responded
          </h1>
          <p className="text-gray-600 mb-4">
            This feedback already has a response from your company.
          </p>
          <Link href={`/feedback/${feedback.id}`}>
            <Button>View Feedback</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (feedback.revieweeType !== 'COMPANY') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Cannot Respond
          </h1>
          <p className="text-gray-600 mb-4">
            You can only respond to feedback directed at your company.
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
                Respond to Feedback
              </h1>
              <p className="text-gray-600">
                Provide a professional response to customer feedback
              </p>
            </div>
            <Link href={`/feedback/${feedback.id}`}>
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

        {/* Original Feedback */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Original Feedback</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">From</p>
                <p className="mt-1 text-sm text-gray-900">{feedback.fromUser?.name}</p>
                <p className="text-xs text-gray-500">{feedback.fromUser?.role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Rating</p>
                {renderStars(feedback.rating)}
              </div>
            </div>
            
            {feedback.comments && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Comments:</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{feedback.comments}</p>
              </div>
            )}
            
            <div className="text-sm text-gray-500">
              Submitted on {new Date(feedback.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Response Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Response</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="response" className="block text-sm font-medium text-gray-700">
                Response
              </label>
              <textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Provide a professional response to this feedback..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Your response will be visible to the customer and will be permanently associated with this feedback.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Response Guidelines:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be professional and courteous in your response</li>
                <li>• Address specific concerns raised in the feedback</li>
                <li>• Explain any actions taken to resolve issues</li>
                <li>• Thank the customer for their feedback</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href={`/feedback/${feedback.id}`}>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={submitting || !response.trim()}
                loading={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Response'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}