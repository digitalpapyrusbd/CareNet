import { DollarSign, TrendingUp, Calendar, Download, Eye, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface EarningsSummaryProps {
  onGenerateInvoice?: () => void;
  onWithdraw?: () => void;
  onNavigate?: (page: string) => void;
}

export function EarningsSummary({ onGenerateInvoice, onWithdraw, onNavigate }: EarningsSummaryProps) {
  const earnings = {
    thisMonth: 24000,
    lastMonth: 32000,
    pending: 8000,
    available: 16000,
    total: 156000
  };

  const recentPayments = [
    { id: "1", date: "Dec 1, 2024", amount: 8000, jobs: 4, status: "paid" },
    { id: "2", date: "Nov 25, 2024", amount: 12000, jobs: 6, status: "paid" },
    { id: "3", date: "Nov 18, 2024", amount: 10000, jobs: 5, status: "paid" },
  ];

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => onNavigate?.('toc')}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: '#535353' }} />
        </button>

        <h1 className="mb-6" style={{ color: '#535353' }}>Earnings</h1>

        {/* Balance Card */}
        <div className="finance-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Available Balance</p>
              <p className="text-3xl" style={{ color: '#535353' }}>৳{earnings.available.toLocaleString()}</p>
            </div>
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              }}
            >
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onWithdraw}
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white'
              }}
            >
              Withdraw
            </Button>
            <Button
              onClick={onGenerateInvoice}
              variant="outline"
              className="bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              Generate Invoice
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="finance-card p-4">
            <p className="text-sm mb-1" style={{ color: '#848484' }}>This Month</p>
            <p className="text-2xl mb-2" style={{ color: '#535353' }}>৳{earnings.thisMonth.toLocaleString()}</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" style={{ color: '#7CE577' }} />
              <span className="text-sm" style={{ color: '#7CE577' }}>+15%</span>
            </div>
          </div>

          <div className="finance-card p-4">
            <p className="text-sm mb-1" style={{ color: '#848484' }}>Pending</p>
            <p className="text-2xl" style={{ color: '#FFD180' }}>৳{earnings.pending.toLocaleString()}</p>
          </div>

          <div className="finance-card p-4">
            <p className="text-sm mb-1" style={{ color: '#848484' }}>Last Month</p>
            <p className="text-2xl" style={{ color: '#535353' }}>৳{earnings.lastMonth.toLocaleString()}</p>
          </div>

          <div className="finance-card p-4">
            <p className="text-sm mb-1" style={{ color: '#848484' }}>Total Earned</p>
            <p className="text-2xl" style={{ color: '#535353' }}>৳{earnings.total.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Payments */}
        <div>
          <h3 className="mb-4" style={{ color: '#535353' }}>Recent Payments</h3>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="finance-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                      }}
                    >
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p style={{ color: '#535353' }}>{payment.date}</p>
                      <p className="text-sm" style={{ color: '#848484' }}>{payment.jobs} jobs completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p style={{ color: '#7CE577' }}>৳{payment.amount.toLocaleString()}</p>
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: '#7CE577', color: 'white' }}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
