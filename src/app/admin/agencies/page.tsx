'use client';

import React, { useState, useEffect } from 'react';
import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter } from 'next/navigation';
import { Building2, Search, Eye, Edit, CheckCircle, XCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import { apiCall } from '@/lib/api-client';

interface Agency {
  id: string;
  agency_name: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_verified: boolean;
  subscription_tier: string | null;
  rating_avg: number | null;
  rating_count: number | null;
  created_at: string;
  users?: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string;
  };
  caregivers?: {
    id: string;
    users?: {
      name: string | null;
    };
  }[];
  _count?: {
    caregivers?: number;
    jobs?: number;
    packages?: number;
  };
}

export default function AgenciesManagementPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAgencies();
  }, [filter, search, page]);

  const fetchAgencies = async () => {
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
      }
      
      if (search) {
        params.append('search', search);
      }

      const response = await apiCall(`/agencies?${params.toString()}`);
      setAgencies(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionColor = (tier: string | null) => {
    switch (tier) {
      case 'ENTERPRISE':
        return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      case 'GROWTH':
        return { bg: 'rgba(142, 197, 252, 0.2)', text: '#5B9FFF' };
      case 'STARTER':
        return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  const filteredAgencies = agencies;

  return (
    <div className="relative">
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 style={{ color: '#535353' }}>Agency Management</h1>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
              <Input
                type="text"
                placeholder="Search by agency name, contact person, email, or phone..."
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
          <div className="flex gap-2 mb-6">
            {['all', 'verified', 'unverified'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f as 'all' | 'verified' | 'unverified');
                  setPage(1);
                }}
                className="flex-1 px-4 py-2 rounded-lg capitalize text-sm"
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
              <p style={{ color: '#848484' }}>Loading agencies...</p>
            </div>
          ) : agencies.length === 0 ? (
            <div className="finance-card p-8 text-center">
              <Building2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No agencies found</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {agencies.map((agency) => {
                  const subscriptionStyle = getSubscriptionColor(agency.subscription_tier);
                  return (
                    <div key={agency.id} className="finance-card p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 style={{ color: '#535353' }}>{agency.agency_name}</h3>
                            <div className="flex gap-2">
                              {agency.is_verified ? (
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
                              {agency.subscription_tier && (
                                <span className="text-xs px-3 py-1 rounded-full capitalize"
                                  style={{ background: subscriptionStyle.bg, color: subscriptionStyle.text }}>
                                  {agency.subscription_tier}
                                </span>
                              )}
                            </div>
                          </div>
                          {agency.contact_person && (
                            <p className="text-sm mb-1" style={{ color: '#848484' }}>
                              Contact: {agency.contact_person}
                            </p>
                          )}
                          {agency.contact_email && (
                            <p className="text-sm mb-1" style={{ color: '#848484' }}>{agency.contact_email}</p>
                          )}
                          {agency.contact_phone && (
                            <p className="text-xs" style={{ color: '#848484' }}>{agency.contact_phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3 p-3 rounded-lg"
                        style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                        {agency.rating_avg !== null && (
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#848484' }}>Rating</p>
                            <p className="text-sm flex items-center gap-1" style={{ color: '#535353' }}>
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {agency.rating_avg.toFixed(1)} ({agency.rating_count || 0})
                            </p>
                          </div>
                        )}
                        {agency.caregivers && agency.caregivers.length > 0 && (
                          <div>
                            <p className="text-xs mb-1" style={{ color: '#848484' }}>Caregivers</p>
                            <p className="text-sm" style={{ color: '#535353' }}>{agency.caregivers.length}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs mb-1" style={{ color: '#848484' }}>Joined</p>
                          <p className="text-sm" style={{ color: '#535353' }}>
                            {new Date(agency.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => router.push(`/admin/agencies/${agency.id}`)} 
                          size="sm" 
                          variant="outline"
                          className="flex-1 bg-white/50 border-white/50"
                        >
                          <Eye className="w-4 h-4 mr-2" />View
                        </Button>
                        <Button 
                          onClick={() => router.push(`/admin/agencies/${agency.id}/edit`)} 
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
