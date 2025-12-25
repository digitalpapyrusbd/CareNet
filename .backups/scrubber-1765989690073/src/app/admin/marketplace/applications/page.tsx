'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Save, Check, X, RefreshCw, Filter } from 'lucide-react';
import { apiCall } from '@/lib/api-client';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

export default function AdminApplicationsPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<{ id: string; company_name: string }[]>([]);
  const [status, setStatus] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    load();
    loadCompanies();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (companyId) params.set('companyId', companyId);
      if (search) params.set('search', search);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      if (page) params.set('page', String(page));
      const query = params.toString();
      const res = await apiCall(`/admin/marketplace/applications${query ? `?${query}` : ''}`);
      setApps(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages || 1);
      } else {
        setTotalPages(1);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  async function loadCompanies() {
    try {
      const res = await apiCall('/admin/companies/options');
      setCompanies(res.data || []);
    } catch (e) {
      // ignore
    }
  }

  async function createDemo() {
    try {
      setError('');
      await apiCall('/admin/dev/create-demo-caregiver-application', { method: 'POST' });
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to create demo application');
    }
  }

  async function updateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    try {
      setUpdatingId(id);
      setError('');
      await apiCall(`/admin/marketplace/applications/${id}`, {
        method: 'PATCH',
        body: { status },
      });
      await load();
    } catch (e: any) {
      setError(e.message || `Failed to set status ${status}`);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14" style={{ background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)' }}>
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="mb-2" style={{ color: '#535353' }}>{t('page.heading.marketplaceapplicati')}</h1>
            <Button onClick={createDemo} style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
              <Save className="w-4 h-4 mr-2" />Create Demo Application
            </Button>
          </div>

          {error && (
            <div className="finance-card p-4 mb-4" style={{ borderLeft: '4px solid #FF8FA3' }}>
              <p className="text-sm" style={{ color: '#FF8FA3' }}>{error}</p>
            </div>
          )}

          <div className="finance-card p-4 mb-4">
            <div className="space-y-3">
              {/* First row: Status, Company, Search */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-sm" style={{ color: '#535353' }}>{t('page.text.status')}</label>
                  <select
                    className="w-full mt-1 bg-white/50 border rounded p-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">{t('page.text.all')}</option>
                    <option value="PENDING">{t('page.text.pending')}</option>
                    <option value="APPROVED">{t('page.text.approved')}</option>
                    <option value="REJECTED">{t('page.text.rejected')}</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm" style={{ color: '#535353' }}>{t('page.text.company')}</label>
                  <select
                    className="w-full mt-1 bg-white/50 border rounded p-2"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                  >
                    <option value="">{t('page.text.allcompanies')}</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.company_name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm" style={{ color: '#535353' }}>{t('page.text.search')}</label>
                  <input
                    className="w-full mt-1 bg-white/50 border rounded p-2"
                    placeholder={t('page.placeholder.jobtitleorcaregivern')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Second row: Date filters and buttons */}
              <div className="flex flex-col md:flex-row md:items-end gap-3">
                <div className="flex-1">
                  <label className="text-sm" style={{ color: '#535353' }}>{t('page.text.fromdate')}</label>
                  <input
                    type="date"
                    className="w-full mt-1 bg-white/50 border rounded p-2"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm" style={{ color: '#535353' }}>{t('page.text.todate')}</label>
                  <input
                    type="date"
                    className="w-full mt-1 bg-white/50 border rounded p-2"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-white/60 border-white/50" onClick={() => { setPage(1); load(); }}>
                    <Filter className="w-4 h-4 mr-1" /> Apply
                  </Button>
                  <Button variant="outline" className="bg-white/60 border-white/50" onClick={() => { setStatus(''); setCompanyId(''); setSearch(''); setDateFrom(''); setDateTo(''); setPage(1); load(); }}>
                    <RefreshCw className="w-4 h-4 mr-1" /> Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-3">
                {apps.length === 0 ? (
                  <p style={{ color: '#848484' }}>No applications yet.</p>
                ) : (
                  apps.map((a) => (
                    <div key={a.id} className="p-3 rounded-md border border-white/40 bg-white/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium" style={{ color: '#535353' }}>{a.marketplace_jobs?.title}</div>
                          <div className="text-sm" style={{ color: '#848484' }}>
                            {a.marketplace_jobs?.location} • ৳{a.marketplace_jobs?.offered_rate}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium" style={{ color: '#535353' }}>{a.caregivers?.users?.name}</div>
                          <div className="text-sm" style={{ color: '#848484' }}>{a.caregivers?.users?.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm" style={{ color: '#535353' }}>Status: {a.status}</div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === a.id}
                            onClick={() => updateStatus(a.id, 'APPROVED')}
                            className="bg-white/60 border-white/50"
                          >
                            <Check className="w-4 h-4 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === a.id}
                            onClick={() => updateStatus(a.id, 'REJECTED')}
                            className="bg-white/60 border-white/50"
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                      {a.coverLetter && (
                        <div className="text-sm mt-1" style={{ color: '#848484' }}>{a.coverLetter}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm" style={{ color: '#848484' }}>Page {page} of {totalPages}</div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-white/60 border-white/50"
                  disabled={page <= 1}
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); setTimeout(load, 0); }}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/60 border-white/50"
                  disabled={page >= totalPages}
                  onClick={() => { setPage((p) => p + 1); setTimeout(load, 0); }}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
