'use client';

import { useState, useRef, useEffect } from 'react';
import { Job } from '@/types';
import { formatDistance } from 'date-fns';

interface MobileJobCardProps {
  job: Job & {
    package?: { name: string; description: string };
    patient?: { name: string };
    company?: { companyName: string };
  };
  onAccept?: (jobId: string) => void;
  onDecline?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

export function MobileJobCard({
  job,
  onAccept,
  onDecline,
  onViewDetails,
}: MobileJobCardProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 100;
  const MAX_SWIPE = 150;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      startX.current = touchStartX;
      setIsSwiping(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping) return;

      currentX.current = e.touches[0].clientX;
      const deltaX = currentX.current - touchStartX;

      // Limit swipe distance
      const limitedDeltaX = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, deltaX));
      setSwipeX(limitedDeltaX);
    };

    const handleTouchEnd = () => {
      setIsSwiping(false);

      // Right swipe (accept)
      if (swipeX > SWIPE_THRESHOLD && onAccept) {
        if (navigator.vibrate) navigator.vibrate(10);
        onAccept(job.id);
      }
      // Left swipe (decline)
      else if (swipeX < -SWIPE_THRESHOLD && onDecline) {
        if (navigator.vibrate) navigator.vibrate(10);
        onDecline(job.id);
      }

      // Reset position
      setSwipeX(0);
    };

    card.addEventListener('touchstart', handleTouchStart, { passive: true });
    card.addEventListener('touchmove', handleTouchMove, { passive: true });
    card.addEventListener('touchend', handleTouchEnd);

    return () => {
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchmove', handleTouchMove);
      card.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isSwiping, swipeX, job.id, onAccept, onDecline]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const swipeProgress = Math.abs(swipeX) / SWIPE_THRESHOLD;
  const showAccept = swipeX > 0;
  const showDecline = swipeX < 0;

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Swipe Actions Background */}
      <div className="absolute inset-0 flex items-center justify-between px-6">
        {/* Accept (Right Swipe) */}
        <div
          className="flex items-center gap-2 transition-opacity"
          style={{ opacity: showAccept ? swipeProgress : 0 }}
        >
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold text-green-600">Accept</span>
        </div>

        {/* Decline (Left Swipe) */}
        <div
          className="flex items-center gap-2 transition-opacity ml-auto"
          style={{ opacity: showDecline ? swipeProgress : 0 }}
        >
          <span className="text-sm font-semibold text-red-600">Decline</span>
          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Card Content */}
      <div
        ref={cardRef}
        className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-transform touch-pan-y"
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
              {job.package?.name || 'Care Package'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {job.company?.companyName}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
        </div>

        {/* Patient Info */}
        {job.patient && (
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Patient: {job.patient.name}
            </span>
          </div>
        )}

        {/* Date Range */}
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {formatDistance(new Date(job.startDate), new Date(job.endDate))}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
          <span className="text-xl font-bold text-primary-600">
            ৳{job.totalPrice.toLocaleString()}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onViewDetails?.(job.id)}
          className="mt-4 w-full min-h-[48px] px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors active:scale-95"
        >
          View Details
        </button>

        {/* Swipe Hint */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Swipe right to accept • Swipe left to decline
          </p>
        </div>
      </div>
    </div>
  );
}
