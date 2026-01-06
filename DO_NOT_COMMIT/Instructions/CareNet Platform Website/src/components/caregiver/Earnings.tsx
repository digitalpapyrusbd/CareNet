import { ArrowLeft, DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

interface EarningsProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

const EARNINGS_DATA = {
  weekly: '৳8,500',
  monthly: '৳32,400',
  total: '৳98,750',
  pending: '৳4,200'
};

const EARNINGS_HISTORY = [
  { month: 'December 2024', jobs: 12, hours: 96, amount: '৳32,400', status: 'paid' },
  { month: 'November 2024', jobs: 15, hours: 120, amount: '৳38,600', status: 'paid' },
  { month: 'October 2024', jobs: 10, hours: 80, amount: '৳27,750', status: 'paid' }
];

export function Earnings({ onNavigate, onBack }: EarningsProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'total'>('month');

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F5F7FA' }}>
      <div className="finance-card p-6 mb-4">
        <Button variant="ghost" onClick={() => onBack?.()} className="mb-4 hover:bg-white/30" style={{ color: '#535353' }}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 style={{ color: '#535353' }}>Earnings Summary</h1>
        <p style={{ color: '#848484' }}>Track your income and payments</p>
      </div>

      {/* Period Selector */}
      <div className="px-6 mb-4">
        <div className="finance-card p-2 flex gap-2">
          {(['week', 'month', 'total'] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`flex-1 py-3 rounded-lg transition-all ${period === p ? 'finance-card' : ''}`}
              style={{ color: period === p ? '#FEB4C5' : '#848484', background: period === p ? 'white' : 'transparent' }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="finance-card p-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'rgba(254, 180, 197, 0.2)' }}>
              <DollarSign className="w-5 h-5" style={{ color: '#FEB4C5' }} />
            </div>
            <p className="text-sm mb-1" style={{ color: '#848484' }}>
              {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'Total Earnings'}
            </p>
            <p className="text-2xl" style={{ color: '#535353' }}>
              {period === 'week' ? EARNINGS_DATA.weekly : period === 'month' ? EARNINGS_DATA.monthly : EARNINGS_DATA.total}
            </p>
          </div>

          <div className="finance-card p-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'rgba(255, 213, 79, 0.2)' }}>
              <TrendingUp className="w-5 h-5" style={{ color: '#FFD54F' }} />
            </div>
            <p className="text-sm mb-1" style={{ color: '#848484' }}>Pending</p>
            <p className="text-2xl" style={{ color: '#535353' }}>{EARNINGS_DATA.pending}</p>
          </div>
        </div>
      </div>

      {/* Withdraw Button */}
      <div className="px-6 mb-4">
        <Button onClick={() => onNavigate?.('caregiver-earnings-withdraw')} className="w-full py-4"
          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)', color: 'white' }}>
          <Download className="w-5 h-5 mr-2" />
          Withdraw Earnings
        </Button>
      </div>

      {/* Earnings History */}
      <div className="px-6">
        <h2 className="mb-3" style={{ color: '#535353' }}>Earnings History</h2>
        <div className="space-y-3">
          {EARNINGS_HISTORY.map((item, idx) => (
            <div key={idx} className="finance-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" style={{ color: '#FEB4C5' }} />
                  <div>
                    <h3 style={{ color: '#535353' }}>{item.month}</h3>
                    <p className="text-sm" style={{ color: '#848484' }}>{item.jobs} jobs • {item.hours} hours</p>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ color: '#535353' }}>{item.amount}</p>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#7CE577', color: 'white' }}>
                    Paid
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
