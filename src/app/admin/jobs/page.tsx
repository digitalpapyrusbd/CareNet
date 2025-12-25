'use client';

import React, { useState, useEffect } from 'react';
import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter } from 'next/navigation';
import { Briefcase, Search, Eye, Edit, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import { apiCall } from '@/lib/api-client';

interface Job {
  id: string;
  patients: {
    id: string;
    name: string;
  };
  users_jobs_guardian_idTousers: {
    id: string;
    name: string | null;
    phone: string;
    email: string | null;
  };
  agencies: {
    id: string;
    agency_name: string;
    is_verified: boolean;
  };
  packages: {
    id: string;
    name: string;
    category: string;
    price: number;
    duration_days: number;
    hours_per_day: number;
  };
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: Date;
  assignments?: {
    caregivers_assignments_caregiver_idTocaregivers: {
      users: {
        name: string | null;
      };
    };
  }[];
  payments?: {
    id: string;
    amount: number;
    status: string;
  }[];
}

export default function JobsManagementPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PENDING'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [filter, search, page]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (filter !== 'all') {
        params.append('status', filter);
      }
      
      if (search) {
        params.append('search', search);
      }

      const response = await apiCall(`/jobs?${params.toString()}`);
      setJobs(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'COMPLETED':
        return { bg: 'rgba(142, 197, 252, 0.2)', text: '#5B9FFF' };
      case 'CANCELLED':
        return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      case 'PENDING':
        return { bg: 'rgba(255, 179, 193, 0.2)', text: '#FF8FA3' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  return (
    <div className="relative">
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 style={{ color: '#535353' }}>Job Management</h1>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
              <Input
                type="text"
                placeholder="Search by patient name or special instructions..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 bg-white/50 border-white/50"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {['all', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'PENDING'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f as 'all' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PENDING');
                  setPage(1);
                }}
                className="flex-shrink-0 px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap"
                style={{
                  background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                  color: filter === f ? 'white' : '#535353'
                }}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="finance-card p-8 text-center">
              <p style={{ color: '#848484' }}>Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="finance-card p-8 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No jobs found</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {jobs.map((job) => {
                  const statusStyle = getStatusColor(job.status);
                  const totalAmount = job.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
                  return (
                    <div key={job.id} className="finance-card p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h3 style={{ color: '#535353' }}>{job.patients?.name || 'Unknown Patient'}</h3>
                              <p className="text-sm" style={{ color: '#848484' }}>
                                {job.packages?.name} - {job.users_jobs_guardian_idTousers?.name || 'Unknown Guardian'}
                              </p>
                            </div>
                            <span className="text-xs px-3 py-1 rounded-full capitalize"
                              style={{ background: statusStyle.bg, color: statusStyle.text }}>
                              {job.status}
                            </span>
                          </div>
                          {job.agencies && (
                            <p className="text-xs mt-1" style={{ color: '#848484' }}>
                              Agency: {job.agencies.agency_name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 p-3 rounded-lg"
                        style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                        <div>
                          <p className="text-xs mb-1" style={{ color: '#848484' }}>Start Date</p>
                          <p className="text-sm" style={{ color: '#535353' }}>
                            {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: '#848484' }}>Duration</p>
                          <p className="text-sm" style={{ color: '#535353' }}>
                            {job.packages?.duration_days || 'N/A'} days
                          </p>
                        </div>
                        <div>
                          <p className="text-xs mb-1" style={{ color: '#848484' }}>Hours/Day</p>
                          <p className="text-sm" style={{ color: '#535353' }}>
                            {job.packages?.hours_per_day || 'N/A'} hrs
                          </p>
                        </div>
                        {totalAmount > 0 && (
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#848484' }}>Total Amount</p>
                            <p className="text-sm flex items-center gap-1" style={{ color: '#535353' }}>
                              <DollarSign className="w-4 h-4" />৳{totalAmount}
                            </p>
                          </div>
                        )}
                      </div>

                      {job.assignments && job.assignments.length > 0 && (
                        <div className="mb-3 p-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                          <p className="text-xs mb-1" style={{ color: '#848484' }}>Assigned Caregivers</p>
                          <p className="text-sm" style={{ color: '#535353' }}>
                            {job.assignments.map(a => a.caregivers_assignments_caregiver_idTocaregivers?.users?.name).filter(Boolean).join(', ') || 'None'}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => router.push(`/admin/jobs/${job.id}`)} 
                          size="sm" 
                          variant="outline"
                          className="flex-1 bg-white/50 border-white/50"
                        >
                          <Eye className="w-4 h-4 mr-2" />View
                        </Button>
                        <Button 
                          onClick={() => router.push(`/admin/jobs/${job.id}/edit`)} 
                          size="sm" 
                          variant="outline"
                          className="flex-1 bg-white/50 border-white/50"
                        >
                          <Edit className="w-4 h-4 mr-2" />Edit
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    size="sm"
                    variant="outline"
                    className="bg-white/50 border-white/50"
                  >
                    Previous
                  </Button>
                  <span style={{ color: '#535353' }}>
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    size="sm"
                    variant="outline"
                    className="bg-white/50 border-white/50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
