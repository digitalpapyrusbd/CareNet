import { DollarSign, TrendingUp, Users, Building, Download } from "lucide-react";
import { Button } from "../ui/button";

interface AdminBillingManagementProps {
  stats: {
    totalRevenue: number;
    monthlyRevenue: number;
    activeSubscriptions: number;
    pendingPayments: number;
  };
  revenueByType: {
    caregivers: number;
    agencies: number;
    shops: number;
  };
  onExportReport: () => void;
}

export function AdminBillingManagement({ stats, revenueByType, onExportReport }: AdminBillingManagementProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Billing Management</h1>
          <Button onClick={onExportReport} variant="outline" className="bg-white/50 border-white/50">
            <Download className="w-4 h-4 mr-2" />Export Report
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="finance-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm mb-1" style={{ color: '#848484' }}>Total Revenue</p>
            <p className="text-2xl" style={{ color: '#535353' }}>৳{stats.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="finance-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm mb-1" style={{ color: '#848484' }}>Monthly Revenue</p>
            <p className="text-2xl" style={{ color: '#535353' }}>৳{stats.monthlyRevenue.toLocaleString()}</p>
          </div>

          <div className="finance-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm mb-1" style={{ color: '#848484' }}>Active Subscriptions</p>
            <p className="text-2xl" style={{ color: '#535353' }}>{stats.activeSubscriptions}</p>
          </div>

          <div className="finance-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm mb-1" style={{ color: '#848484' }}>Pending Payments</p>
            <p className="text-2xl" style={{ color: '#535353' }}>{stats.pendingPayments}</p>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Revenue by User Type</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: '#535353' }}>Caregivers</span>
                <span style={{ color: '#535353' }}>৳{revenueByType.caregivers.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <div
                  className="h-full"
                  style={{
                    width: `${(revenueByType.caregivers / (revenueByType.caregivers + revenueByType.agencies + revenueByType.shops)) * 100}%`,
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: '#535353' }}>Agencies</span>
                <span style={{ color: '#535353' }}>৳{revenueByType.agencies.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <div
                  className="h-full"
                  style={{
                    width: `${(revenueByType.agencies / (revenueByType.caregivers + revenueByType.agencies + revenueByType.shops)) * 100}%`,
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: '#535353' }}>Shops</span>
                <span style={{ color: '#535353' }}>৳{revenueByType.shops.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <div
                  className="h-full"
                  style={{
                    width: `${(revenueByType.shops / (revenueByType.caregivers + revenueByType.agencies + revenueByType.shops)) * 100}%`,
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

