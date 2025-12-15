'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface RelatedProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface RelatedUser {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  profile?: RelatedProfile;
}

interface AssignmentSummary {
  id?: string;
  caregiver?: RelatedUser;
  role?: string;
  status?: string;
}

interface PaymentSummary {
  id: string;
  amount?: number;
  status?: string;
  paidAt?: string;
}

interface CareLogEntry {
  id: string;
  logType?: string;
  timestamp?: string;
  notes?: string;
  caregiver?: RelatedUser;
}

interface JobDetail {
  id: string;
  status?: string;
  patient?: RelatedUser & { diagnosis?: string; age?: number };
  guardian?: RelatedUser;
  company?: { companyName?: string };
  package?: { name?: string; hoursPerDay?: number; price?: number };
  startDate?: string;
  endDate?: string;
  scheduleSummary?: string;
  totalPrice?: number;
  paymentStatus?: string;
  payments?: PaymentSummary[];
  caregiverAssignments?: AssignmentSummary[];
  careLogs?: CareLogEntry[];
  specialInstructions?: string;
}

interface JobDetailPanelProps {
  jobId: string;
  onClose?: () => void;
}

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
  DISPUTED: 'bg-yellow-100 text-yellow-800',
  PENDING_ASSIGNMENT: 'bg-purple-100 text-purple-800',
};

const formatDate = (input?: string | Date) => {
  if (!input) return 'N/A';
  const date = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

export function JobDetailPanel({ jobId, onClose }: JobDetailPanelProps) {
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const primaryAssignment = useMemo(() => job?.caregiverAssignments?.[0], [job]);
  const paymentSummary = useMemo(() => job?.payments?.[0], [job]);
  const careLogs = useMemo(() => job?.careLogs ?? [], [job]);

  const fetchJobDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const response = await fetch(`/api/jobs/${jobId}`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      if (!response.ok) {
        throw new Error('Unable to load job details');
      }

      const payload = await response.json();
      setJob(payload?.data ?? payload ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetail();
  }, [fetchJobDetail]);

  const handleAssignCaregiver = () => {
    router.push(`/jobs/${jobId}/assign`);
  };

  const handleCancelJob = async () => {
    if (!confirm('Cancel this job? Caregivers will be notified.')) {
      return;
    }

    try {
      setIsCancelling(true);
      setError(null);
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const response = await fetch(`/api/jobs/${jobId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || 'Failed to cancel job');
      }

      await fetchJobDetail();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to cancel job.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (!jobId) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] flex flex-col">
      <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <p className="text-sm text-gray-500">Selected Job</p>
          <h2 className="text-xl font-semibold text-gray-900">
            {job?.patient?.name || 'Job details'}
          </h2>
          <p className="text-sm text-gray-500">
            {job?.package?.name || 'Uncategorized package'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {job?.status && (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[job.status] || 'bg-gray-100 text-gray-800'}`}
            >
              {job.status.replace(/_/g, ' ')}
            </span>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {loading && (
          <div className="text-center text-gray-500">Loading job details…</div>
        )}

        {!loading && error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && job && (
          <>
            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500">Patient</p>
                <p className="text-base font-medium text-gray-900">
                  {job.patient?.name || 'Not provided'}
                </p>
                <p className="text-sm text-gray-500">
                  {job.patient?.diagnosis || 'Diagnosis unavailable'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500">Primary caregiver</p>
                <p className="text-base font-medium text-gray-900">
                  {primaryAssignment?.caregiver?.profile?.firstName
                    ? `${primaryAssignment.caregiver.profile.firstName} ${primaryAssignment.caregiver.profile.lastName ?? ''}`.trim()
                    : primaryAssignment?.caregiver?.name || 'Unassigned'}
                </p>
                <p className="text-sm text-gray-500">
                  {primaryAssignment?.role || 'Role pending'} · {primaryAssignment?.status || 'Status pending'}
                </p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase text-gray-500">Schedule</p>
                <p className="text-sm text-gray-900 font-medium">
                  {formatDate(job.startDate)} – {formatDate(job.endDate)}
                </p>
                <p className="text-xs text-gray-500">{job.scheduleSummary || `${job.package?.hoursPerDay ?? 0} hrs / day`}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Total price</p>
                <p className="text-sm text-gray-900 font-medium">{formatCurrency(job.totalPrice)}</p>
                <p className="text-xs text-gray-500">Package: {job.package?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Payment status</p>
                <p className="text-sm text-gray-900 font-medium">
                  {job.paymentStatus || paymentSummary?.status || 'Pending'}
                </p>
                {paymentSummary?.paidAt && (
                  <p className="text-xs text-gray-500">Paid on {formatDate(paymentSummary.paidAt)}</p>
                )}
              </div>
            </section>

            {job.specialInstructions && (
              <section className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs uppercase text-gray-500 mb-1">Special instructions</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{job.specialInstructions}</p>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Care logs</p>
                  <p className="text-xs text-gray-500">Latest caregiver updates</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push(`/jobs/${jobId}/logs`)}>
                  View all
                </Button>
              </div>
              {careLogs.length === 0 && (
                <p className="text-sm text-gray-500">No care logs recorded yet.</p>
              )}
              {careLogs.length > 0 && (
                <ol className="relative border-l border-gray-200 pl-6 space-y-4">
                  {careLogs.slice(0, 4).map((log) => (
                    <li key={log.id} className="relative">
                      <span className="absolute -left-[9px] top-1 h-3 w-3 rounded-full bg-blue-500"></span>
                      <p className="text-xs text-gray-500">{formatDate(log.timestamp)}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {log.logType?.replace(/_/g, ' ') || 'Update'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {log.notes || 'No notes captured.'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {log.caregiver?.profile?.firstName
                          ? `${log.caregiver.profile.firstName} ${log.caregiver.profile.lastName ?? ''}`.trim()
                          : log.caregiver?.name || 'Caregiver'}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        )}
      </div>

      <div className="border-t border-gray-100 px-6 py-4 flex flex-wrap gap-3">
        <Link href={`/jobs/${jobId}/edit`}>
          <Button variant="outline" size="sm">
            Edit job
          </Button>
        </Link>
        <Button variant="secondary" size="sm" onClick={handleAssignCaregiver}>
          Assign caregiver
        </Button>
        <Button variant="danger" size="sm" onClick={handleCancelJob} loading={isCancelling}>
          Cancel job
        </Button>
      </div>
    </div>
  );
}

export default JobDetailPanel;
