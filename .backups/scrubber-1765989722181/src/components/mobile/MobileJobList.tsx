'use client';

import { useState } from 'react';
import { MobileJobCard } from './MobileJobCard';
import { PullToRefresh } from './PullToRefresh';
import { Job } from '@/types';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface MobileJobListProps {
  jobs: Array<Job & {
    package?: { name: string; description: string };
    patient?: { name: string };
    company?: { companyName: string };
  }>;
  onRefresh?: () => {t('mobilejoblist.text.promise')}<void>;
  onAccept?: (jobId: string) => void;
  onDecline?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  isLoading?: boolean;
}

export function MobileJobList({
  const { t } = useTranslationContext();
  jobs,
  onRefresh,
  onAccept,
  onDecline,
  onViewDetails,
  isLoading,
}: MobileJobListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status.toLowerCase() === filter.toLowerCase());

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} enabled={!!onRefresh}>
      <div className="space-y-4">
        {/* Filter Tabs */}
        <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['all', 'active', 'pending', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as typeof filter)}
                className={`flex-shrink-0 px-4 py-2 min-h-[44px] rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Job Count */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </p>
          {isLoading && (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs text-gray-500">Loading...</span>
            </div>
          )}
        </div>

        {/* Job Cards */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <MobileJobCard
                key={job.id}
                job={job}
                onAccept={onAccept}
                onDecline={onDecline}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              No jobs found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {filter === 'all' 
                ? 'Check back later for new opportunities' 
                : `No ${filter} jobs at the moment`}
            </p>
          </div>
        )}
      </div>
    </PullToRefresh>
  );
}
