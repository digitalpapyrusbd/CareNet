'use client';

import { useState, useEffect } from 'react';
import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter } from 'next/navigation';
import { Shield, Users, DollarSign, TrendingUp, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiCall } from '@/lib/api-client';

interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  totalCaregivers: number;
  totalPatients: number;
  totalGuardians: number;
  totalJobs: number;
  activeJobs: number;
  totalRevenue: number;
  pendingDisputes: number;
  activeModerators: number;
  pendingVerifications: number;
  supportTickets: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authToken = localStorage.getItem('authToken');
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/dashboard/page.tsx:36',message:'Starting dashboard data fetch',data:{hasAuthToken:!!authToken,authTokenLength:authToken?.length,authTokenPrefix:authToken?.substring(0,30),endpoint:'/dashboard/stats'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      const response = await apiCall('/dashboard/stats', {
        method: 'GET',
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/dashboard/page.tsx:48',message:'API response received',data:{hasResponse:!!response,hasSuccess:response?.success,hasData:!!response?.data,responseKeys:response?Object.keys(response):[]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/dashboard/page.tsx:52',message:'Response validation failed',data:{response},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        setError('Failed to load dashboard data');
      }
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/dashboard/page.tsx:56',message:'API call error caught',data:{errorName:err?.name,errorMessage:err?.message,errorStatus:err?.status,errorData:err?.data,errorStack:err?.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate growth percentages (placeholder - would need historical data)
  const revenueGrowth = 0; // TODO: Calculate from historical data
  const usersGrowth = 0; // TODO: Calculate from historical data

  // System health calculation (placeholder)
  const systemHealth = stats ? 99.8 : 0;

  const adminName = user?.name || 'Administrator';

  if (isLoading) {
    return (
      <>
        <UniversalNav userRole="admin" showBack={true} />
        <div className="min-h-screen pb-6 pb-24 md:pt-14 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p style={{ color: '#848484' }}>Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <UniversalNav userRole="admin" showBack={true} />
        <div className="min-h-screen pb-6 pb-24 md:pt-14 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 rounded-lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                color: 'white',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14" style={{ background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)' }}>
      {/* Header */}
      <div className="p-6">
        <div className="mb-6">
          <h1 style={{ color: '#535353' }}>Admin Dashboard</h1>
          <p style={{ color: '#848484' }}>Welcome back, {adminName}</p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>
              ৳{stats.totalRevenue ? (stats.totalRevenue / 1000).toFixed(0) : 0}K
            </p>
            <p className="text-sm" style={{ color: '#848484' }}>Total Revenue</p>
            {revenueGrowth > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3" style={{ color: '#7CE577' }} />
                <span className="text-xs" style={{ color: '#7CE577' }}>+{revenueGrowth.toFixed(1)}%</span>
              </div>
            )}
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{stats.totalUsers}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Platform Users</p>
            {usersGrowth > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3" style={{ color: '#7CE577' }} />
                <span className="text-xs" style={{ color: '#7CE577' }}>+{usersGrowth.toFixed(1)}%</span>
              </div>
            )}
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{stats.activeModerators}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Active Moderators</p>
          </div>

          <div className="finance-card p-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
              }}
            >
              <Activity className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{systemHealth}%</p>
            <p className="text-sm" style={{ color: '#848484' }}>System Health</p>
          </div>
        </div>

        {/* Moderator Submissions */}
        <div className="finance-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: '#535353' }}>Moderator Submissions</h3>
            <button
              onClick={() => router.push('/admin/moderators')}
              className="text-sm"
              style={{ color: '#5B9FFF' }}
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p style={{ color: '#535353' }}>Verifications</p>
                  <p className="text-sm" style={{ color: '#848484' }}>Awaiting approval</p>
                </div>
              </div>
              <span 
                className="px-3 py-1 rounded-full"
                style={{ background: '#FFB3C1', color: 'white' }}
              >
                {stats.pendingVerifications}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                  }}
                >
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p style={{ color: '#535353' }}>Disputes</p>
                  <p className="text-sm" style={{ color: '#848484' }}>Pending review</p>
                </div>
              </div>
              <span 
                className="px-3 py-1 rounded-full"
                style={{ background: '#FFD180', color: 'white' }}
              >
                {stats.pendingDisputes}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                  }}
                >
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p style={{ color: '#535353' }}>Support Tickets</p>
                  <p className="text-sm" style={{ color: '#848484' }}>Escalated</p>
                </div>
              </div>
              <span 
                className="px-3 py-1 rounded-full"
                style={{ background: '#7CE577', color: 'white' }}
              >
                {stats.supportTickets}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Platform Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Caregivers</p>
              <p className="text-2xl" style={{ color: '#535353' }}>{stats.totalCaregivers}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Agencies</p>
              <p className="text-2xl" style={{ color: '#535353' }}>{stats.totalCompanies}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Guardians</p>
              <p className="text-2xl" style={{ color: '#535353' }}>{stats.totalGuardians || 0}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Patients</p>
              <p className="text-2xl" style={{ color: '#535353' }}>{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => router.push('/admin/verification/caregivers')}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
              }}
            >
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-center" style={{ color: '#535353' }}>Approvals</p>
          </button>

          <button
            onClick={() => router.push('/admin/audit-logs')}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <Activity className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-center" style={{ color: '#535353' }}>Audit Logs</p>
          </button>

          <button
            onClick={() => router.push('/admin/system-settings')}
            className="finance-card p-4 hover:shadow-lg transition-all"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
              }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-center" style={{ color: '#535353' }}>Settings</p>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
