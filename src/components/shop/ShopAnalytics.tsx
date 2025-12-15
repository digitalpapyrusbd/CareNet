import { TrendingUp, DollarSign, ShoppingCart, Package, BarChart3 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface ShopAnalyticsProps {
  stats: {
    totalRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    ordersGrowth: number;
    avgOrderValue: number;
    topSellingProducts: Array<{
      id: string;
      name: string;
      unitsSold: number;
      revenue: number;
    }>;
    revenueByCategory: Array<{
      category: string;
      revenue: number;
      percentage: number;
    }>;
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
    }>;
  };
  onExport: () => void;
}

export function ShopAnalytics({ stats, onExport }: ShopAnalyticsProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Shop Analytics</h1>
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
            <div className="flex items-center gap-3 mb-2">
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
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Total Orders</p>
                <p className="text-xl" style={{ color: '#535353' }}>{stats.totalOrders}</p>
                <p className="text-xs" style={{ color: stats.ordersGrowth >= 0 ? '#7CE577' : '#FF6B7A' }}>
                  {stats.ordersGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.ordersGrowth)}%
                </p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4 col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Average Order Value</p>
                <p className="text-xl" style={{ color: '#535353' }}>৳{stats.avgOrderValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Top Selling Products</h3>
          <div className="space-y-3">
            {stats.topSellingProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'rgba(142, 197, 252, 0.2)',
                    color: index < 3 ? 'white' : '#5B9FFF'
                  }}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p style={{ color: '#535353' }}>{product.name}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>{product.unitsSold} units sold</p>
                </div>
                <p style={{ color: '#7CE577' }}>৳{product.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Revenue by Category</h3>
          <div className="space-y-3">
            {stats.revenueByCategory.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: '#535353' }}>{cat.category}</span>
                  <span className="text-sm" style={{ color: '#7CE577' }}>৳{cat.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${cat.percentage}%`,
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }} />
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

