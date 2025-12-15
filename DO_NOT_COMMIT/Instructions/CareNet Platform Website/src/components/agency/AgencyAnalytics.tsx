import { TrendingUp, Users, DollarSign, Briefcase, BarChart3 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface AgencyAnalyticsProps {
  stats: {
    totalRevenue: number;
    revenueGrowth: number;
    activeJobs: number;
    jobsGrowth: number;
    totalCaregivers: number;
    avgJobValue: number;
    topPerformers: Array<{
      name: string;
      jobsCompleted: number;
      rating: number;
    }>;
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
    }>;
  };
  onExport: () => void;
}

export function AgencyAnalytics({ stats, onExport }: AgencyAnalyticsProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Agency Analytics</h1>
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
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Active Jobs</p>
                <p className="text-xl" style={{ color: '#535353' }}>{stats.activeJobs}</p>
                <p className="text-xs" style={{ color: stats.jobsGrowth >= 0 ? '#7CE577' : '#FF6B7A' }}>
                  {stats.jobsGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.jobsGrowth)}%
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Total Caregivers</p>
                <p className="text-xl" style={{ color: '#535353' }}>{stats.totalCaregivers}</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Avg Job Value</p>
                <p className="text-xl" style={{ color: '#535353' }}>৳{stats.avgJobValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Top Performing Caregivers</h3>
          <div className="space-y-3">
            {stats.topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'rgba(142, 197, 252, 0.2)',
                    color: index < 3 ? 'white' : '#5B9FFF'
                  }}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p style={{ color: '#535353' }}>{performer.name}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>
                    {performer.jobsCompleted} jobs • {performer.rating}★
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="finance-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5" style={{ color: '#5B9FFF' }} />
            <h3 style={{ color: '#535353' }}>Monthly Revenue Trend</h3>
          </div>
          <div className="space-y-2">
            {stats.monthlyRevenue.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-2 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                <span className="text-sm" style={{ color: '#535353' }}>{month.month}</span>
                <span className="text-sm" style={{ color: '#7CE577' }}>৳{month.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

