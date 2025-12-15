'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { Shield, Users, Building2, DollarSign, TrendingUp, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const router = useRouter();
  const adminName = 'Administrator';

  const kpis = {
    totalRevenue: 2450000,
    activeModerators: 8,
    platformUsers: 1247,
    systemHealth: 99.8
  };

  const moderatorSubmissions = {
    verifications: 5,
    disputes: 2,
    tickets: 3
  };

  const platformStats = {
    caregivers: 156,
    agencies: 42,
    guardians: 234,
    patients: 312
  };

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
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
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>৳{(kpis.totalRevenue / 1000).toFixed(0)}K</p>
            <p className="text-sm" style={{ color: '#848484' }}>Total Revenue</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" style={{ color: '#7CE577' }} />
              <span className="text-xs" style={{ color: '#7CE577' }}>+12.5%</span>
            </div>
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
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{kpis.platformUsers}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Platform Users</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" style={{ color: '#7CE577' }} />
              <span className="text-xs" style={{ color: '#7CE577' }}>+8.2%</span>
            </div>
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
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{kpis.activeModerators}</p>
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
            <p className="text-2xl mb-1" style={{ color: '#535353' }}>{kpis.systemHealth}%</p>
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
                {moderatorSubmissions.verifications}
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
                {moderatorSubmissions.disputes}
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
                {moderatorSubmissions.tickets}
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
              <p className="text-2xl" style={{ color: '#535353' }}>{platformStats.caregivers}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Agencies</p>
              <p className="text-2xl" style={{ color: '#535353' }}>{platformStats.agencies}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Guardians</p>
              <p className="text-2xl" style={{ color: '#535353' }}>{platformStats.guardians}</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Patients</p>
              <p className="text-2xl" style={{ color: '#535353' }}>{platformStats.patients}</p>
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
