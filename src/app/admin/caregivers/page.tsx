'use client';

import React, { useState, useEffect } from 'react';
import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter } from 'next/navigation';
import { UserCog, Search, Eye, Edit, CheckCircle, XCircle, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import { apiCall } from '@/lib/api-client';

interface Caregiver {
  id: string;
  users: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string;
  };
  agencies?: {
    id: string;
    agency_name: string;
    is_verified: boolean;
  } | null;
  address: string | null;
  skills: string[] | null;
  experience_years: number | null;
  hourly_rate: number | null;
  rating_avg: number | null;
  rating_count: number | null;
  is_verified: boolean;
  is_available: boolean;
  created_at: Date;
}

export default function CaregiversManagementPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified' | 'available'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCaregivers();
  }, [filter, search, page]);

  const fetchCaregivers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (filter === 'verified') {
        params.append('isVerified', 'true');
      } else if (filter === 'unverified') {
        params.append('isVerified', 'false');
      } else if (filter === 'available') {
        params.append('isAvailable', 'true');
      }
      
      if (search) {
        params.append('search', search);
      }

      const response = await apiCall(`/caregivers?${params.toString()}`);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'caregivers/page.tsx:71',message:'API response received',data:{caregiverCount:response.data?.length,firstCaregiverRating:response.data?.[0]?.rating_avg,firstCaregiverRatingType:typeof response.data?.[0]?.rating_avg},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      setCaregivers(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 style={{ color: '#535353' }}>Caregiver Management</h1>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
              <Input
                type="text"
                placeholder="Search by name, phone, or address..."
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
            {['all', 'verified', 'unverified', 'available'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f as 'all' | 'verified' | 'unverified' | 'available');
                  setPage(1);
                }}
                className="flex-shrink-0 px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap"
                style={{
                  background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                  color: filter === f ? 'white' : '#535353'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="finance-card p-8 text-center">
              <p style={{ color: '#848484' }}>Loading caregivers...</p>
            </div>
          ) : caregivers.length === 0 ? (
            <div className="finance-card p-8 text-center">
              <UserCog className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No caregivers found</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {caregivers.map((caregiver) => {
                  return (
                    <div key={caregiver.id} className="finance-card p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #4CAF50 100%)' }}>
                          <UserCog className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 style={{ color: '#535353' }}>{caregiver.users?.name || 'No Name'}</h3>
                            <div className="flex gap-2">
                              {caregiver.is_verified ? (
                                <span className="text-xs px-3 py-1 rounded-full flex items-center gap-1"
                                  style={{ background: 'rgba(124, 229, 119, 0.2)', color: '#7CE577' }}>
                                  <CheckCircle className="w-3 h-3" />Verified
                                </span>
                              ) : (
                                <span className="text-xs px-3 py-1 rounded-full flex items-center gap-1"
                                  style={{ background: 'rgba(255, 107, 122, 0.2)', color: '#FF6B7A' }}>
                                  <XCircle className="w-3 h-3" />Unverified
                                </span>
                              )}
                              {caregiver.is_available && (
                                <span className="text-xs px-3 py-1 rounded-full"
                                  style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                                  Available
                                </span>
                              )}
                            </div>
                          </div>
                          {caregiver.users?.email && (
                            <p className="text-sm mb-1" style={{ color: '#848484' }}>{caregiver.users.email}</p>
                          )}
                          <p className="text-xs" style={{ color: '#848484' }}>{caregiver.users?.phone}</p>
                          {caregiver.address && (
                            <p className="text-xs flex items-center gap-1 mt-1" style={{ color: '#848484' }}>
                              <MapPin className="w-3 h-3" />{caregiver.address}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3 p-3 rounded-lg"
                        style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                        {/* #region agent log */}
                        {(() => {
                          fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'caregivers/page.tsx:186',message:'Before rating_avg check',data:{rating_avg:caregiver.rating_avg,rating_avgType:typeof caregiver.rating_avg,isNull:caregiver.rating_avg===null,isUndefined:caregiver.rating_avg===undefined,hasToFixed:typeof caregiver.rating_avg?.toFixed==='function'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                          return null;
                        })()}
                        {/* #endregion */}
                        {caregiver.rating_avg !== null && caregiver.rating_avg !== undefined && typeof caregiver.rating_avg === 'number' && (
                          <div>
                            {/* #region agent log */}
                            {(() => {
                              fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'caregivers/page.tsx:189',message:'Inside rating_avg block',data:{rating_avg:caregiver.rating_avg,rating_avgType:typeof caregiver.rating_avg,hasToFixed:typeof caregiver.rating_avg?.toFixed==='function'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                              return null;
                            })()}
                            {/* #endregion */}
                            <p className="text-xs mb-1" style={{ color: '#848484' }}>Rating</p>
                            <p className="text-sm flex items-center gap-1" style={{ color: '#535353' }}>
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {Number(caregiver.rating_avg).toFixed(1)} ({caregiver.rating_count || 0})
                            </p>
                          </div>
                        )}
                        {caregiver.experience_years !== null && (
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#848484' }}>Experience</p>
                            <p className="text-sm" style={{ color: '#535353' }}>{caregiver.experience_years} years</p>
                          </div>
                        )}
                        {caregiver.hourly_rate !== null && (
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#848484' }}>Rate</p>
                            <p className="text-sm" style={{ color: '#535353' }}>৳{caregiver.hourly_rate}/hr</p>
                          </div>
                        )}
                      </div>

                      {caregiver.agencies && (
                        <div className="mb-3 p-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                          <p className="text-xs mb-1" style={{ color: '#848484' }}>Agency</p>
                          <p className="text-sm" style={{ color: '#535353' }}>{caregiver.agencies.agency_name}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => router.push(`/admin/caregivers/${caregiver.id}`)} 
                          size="sm" 
                          variant="outline"
                          className="flex-1 bg-white/50 border-white/50"
                        >
                          <Eye className="w-4 h-4 mr-2" />View
                        </Button>
                        <Button 
                          onClick={() => router.push(`/admin/caregivers/${caregiver.id}/edit`)} 
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
