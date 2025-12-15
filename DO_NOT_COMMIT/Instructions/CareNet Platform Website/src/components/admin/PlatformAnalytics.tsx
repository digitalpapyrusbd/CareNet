import { TrendingUp, Users, Building, DollarSign, Activity } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface PlatformAnalyticsProps {
  stats: {
    totalUsers: number;
    usersGrowth: number;
    totalAgencies: number;
    agenciesGrowth: number;
    totalRevenue: number;
    revenueGrowth: number;
    platformCommission: number;
    activeJobs: number;
    userBreakdown: {
      guardians: number;
      caregivers: number;
      agencies: number;
      shops: number;
    };
    monthlyGrowth: Array<{
      month: string;
      users: number;
      revenue: number;
    }>;
  };
  onExport: () => void;
}

export function PlatformAnalytics({ stats, onExport }: PlatformAnalyticsProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Platform Analytics</h1>
          <Button onClick={onExport} size="sm" variant="outline" className="bg-white/50 border-white/50">
            Export Report
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {['week', 'month', 'year'].map((p) => (
            <button key={p} onClick={() => setPeriod(p as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" style={{
                background: period === p ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: period === p ? 'white' : '#535353'
              }}>
              {p}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Total Users</p>
                <p className="text-xl" style={{ color: '#535353' }}>{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs" style={{ color: stats.usersGrowth >= 0 ? '#7CE577' : '#FF6B7A' }}>
                  {stats.usersGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.usersGrowth)}%
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
                <Building className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Total Agencies</p>
                <p className="text-xl" style={{ color: '#535353' }}>{stats.totalAgencies}</p>
                <p className="text-xs" style={{ color: stats.agenciesGrowth >= 0 ? '#7CE577' : '#FF6B7A' }}>
                  {stats.agenciesGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.agenciesGrowth)}%
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Total Revenue</p>
                <p className="text-xl" style={{ color: '#7CE577' }}>৳{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs" style={{ color: stats.revenueGrowth >= 0 ? '#7CE577' : '#FF6B7A' }}>
                  {stats.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueGrowth)}%
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Active Jobs</p>
                <p className="text-xl" style={{ color: '#535353' }}>{stats.activeJobs}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>User Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(stats.userBreakdown).map(([type, count]) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm capitalize" style={{ color: '#535353' }}>{type}</span>
                  <span className="text-sm" style={{ color: '#535353' }}>{count.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${(count / stats.totalUsers) * 100}%`,
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Platform Commission</h3>
          <div className="p-4 rounded-lg text-center"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
            <p className="text-3xl text-white mb-2">৳{stats.platformCommission.toLocaleString()}</p>
            <p className="text-sm text-white opacity-90">This {period}</p>
          </div>
        </div>

        <div className="finance-card p-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Monthly Growth Trend</h3>
          <div className="space-y-2">
            {stats.monthlyGrowth.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                <span className="text-sm" style={{ color: '#535353' }}>{month.month}</span>
                <div className="text-right">
                  <p className="text-sm" style={{ color: '#5B9FFF' }}>{month.users} users</p>
                  <p className="text-xs" style={{ color: '#7CE577' }}>৳{month.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

