'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { DollarSign, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AdminBillingPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const financials = {
    totalTransactions: 1247,
    totalVolume: 2450000,
    platformCommission: 245000,
    pendingPayouts: 125000,
    completedPayouts: 2205000,
    disputedTransactions: 15,
    transactionsByType: [
      { type: 'Agency Bookings', count: 856, volume: 1850000 },
      { type: 'Direct Caregiver', count: 245, volume: 425000 },
      { type: 'Shop Orders', count: 146, volume: 175000 },
    ],
    recentTransactions: [
      { id: '1', type: 'Agency Booking', amount: 25000, status: 'completed', date: '2 hours ago' },
      { id: '2', type: 'Caregiver Payout', amount: 15000, status: 'pending', date: '5 hours ago' },
      { id: '3', type: 'Shop Order', amount: 3500, status: 'completed', date: '1 day ago' },
    ]
  };

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Financial Oversight</h1>
          <Button onClick={() => {}} size="sm" variant="outline" className="bg-white/50 border-white/50">
            <Download className="w-4 h-4 mr-2" />Export
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
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Total Transactions</p>
                <p className="text-xl" style={{ color: '#535353' }}>{financials.totalTransactions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Transaction Volume</p>
                <p className="text-xl" style={{ color: '#7CE577' }}>৳{financials.totalVolume.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Platform Commission</p>
                <p className="text-xl" style={{ color: '#535353' }}>৳{financials.platformCommission.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB347 100%)' }}>
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: '#848484' }}>Disputed</p>
                <p className="text-xl" style={{ color: '#FFD180' }}>{financials.disputedTransactions}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Payout Status</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg text-center"
              style={{ background: 'rgba(255, 209, 128, 0.2)' }}>
              <p className="text-2xl mb-1" style={{ color: '#FFD180' }}>৳{financials.pendingPayouts.toLocaleString()}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Pending Payouts</p>
            </div>
            <div className="p-4 rounded-lg text-center"
              style={{ background: 'rgba(124, 229, 119, 0.2)' }}>
              <p className="text-2xl mb-1" style={{ color: '#7CE577' }}>৳{financials.completedPayouts.toLocaleString()}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Completed Payouts</p>
            </div>
          </div>
        </div>

        <div className="finance-card p-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Transactions by Type</h3>
          <div className="space-y-3">
            {financials.transactionsByType.map((type) => (
              <div key={type.type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: '#535353' }}>{type.type}</span>
                  <div className="text-right">
                    <p className="text-sm" style={{ color: '#535353' }}>{type.count} txns</p>
                    <p className="text-xs" style={{ color: '#7CE577' }}>৳{type.volume.toLocaleString()}</p>
                  </div>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${(type.volume / financials.totalVolume) * 100}%`,
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>

  );
}
