'use client';

import { useState } from 'react';
import { PullToRefresh } from './PullToRefresh';

interface EarningsData {
  totalEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  pendingPayments: number;
  completedJobs: number;
  averagePerJob: number;
  weeklyData: Array<{ day: string; amount: number }>;
  monthlyData: Array<{ week: string; amount: number }>;
  recentPayments: Array<{
    id: string;
    date: string;
    amount: number;
    jobTitle: string;
    status: 'completed' | 'pending' | 'processing';
  }>;
}

export function MobileEarnings() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  // Mock data - replace with actual API call
  const earnings: EarningsData = {
    totalEarnings: 45600,
    weeklyEarnings: 8500,
    monthlyEarnings: 32400,
    pendingPayments: 5200,
    completedJobs: 23,
    averagePerJob: 1983,
    weeklyData: [
      { day: 'Mon', amount: 1200 },
      { day: 'Tue', amount: 1500 },
      { day: 'Wed', amount: 800 },
      { day: 'Thu', amount: 2100 },
      { day: 'Fri', amount: 1400 },
      { day: 'Sat', amount: 900 },
      { day: 'Sun', amount: 600 },
    ],
    monthlyData: [
      { week: 'Week 1', amount: 7200 },
      { week: 'Week 2', amount: 8100 },
      { week: 'Week 3', amount: 8500 },
      { week: 'Week 4', amount: 8600 },
    ],
    recentPayments: [
      { id: '1', date: '2024-11-15', amount: 2500, jobTitle: 'Elderly Care - Mrs. Rahman', status: 'completed' },
      { id: '2', date: '2024-11-14', amount: 1800, jobTitle: 'Post-Surgery Care', status: 'completed' },
      { id: '3', date: '2024-11-13', amount: 2100, jobTitle: 'Dementia Care - Mr. Khan', status: 'processing' },
      { id: '4', date: '2024-11-12', amount: 1600, jobTitle: 'Overnight Care', status: 'pending' },
    ],
  };

  const handleRefresh = async () => {
    // TODO: Fetch fresh data from API
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleExportCSV = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    
    // Generate CSV
    const headers = ['Date', 'Job Title', 'Amount', 'Status'];
    const rows = earnings.recentPayments.map(p => [
      p.date,
      p.jobTitle,
      p.amount.toString(),
      p.status,
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const chartData = period === 'week' ? earnings.weeklyData : earnings.monthlyData;
  const maxAmount = Math.max(...chartData.map(d => d.amount));

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">This {period === 'week' ? 'Week' : 'Month'}</p>
            <p className="text-2xl font-bold">
              ৳{(period === 'week' ? earnings.weeklyEarnings : earnings.monthlyEarnings).toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Total Earned</p>
            <p className="text-2xl font-bold">৳{earnings.totalEarnings.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-white rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Pending</p>
            <p className="text-2xl font-bold">৳{earnings.pendingPayments.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Avg/Job</p>
            <p className="text-2xl font-bold">৳{earnings.averagePerJob.toLocaleString()}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Earnings Chart</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod('week')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium min-h-[40px] ${
                  period === 'week'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium min-h-[40px] ${
                  period === 'month'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {chartData.map((item, index) => {
              const percentage = (item.amount / maxAmount) * 100;
              const label = 'day' in item ? item.day : item.week;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {label}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ৳{item.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg transition-all duration-500 flex items-center justify-end px-2"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 20 && (
                        <span className="text-xs font-medium text-white">
                          {Math.round(percentage)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Payments</h3>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium min-h-[44px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>

          <div className="space-y-3">
            {earnings.recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {payment.jobTitle}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(payment.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">
                    ৳{payment.amount.toLocaleString()}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : payment.status === 'processing'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-600">{earnings.completedJobs}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Jobs Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                ৳{earnings.averagePerJob.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average per Job</p>
            </div>
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
}
