'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { DollarSign, TrendingUp, CreditCard, Percent } from 'lucide-react';

const summary = [
  { label: 'Total Earned', value: '284K', icon: DollarSign, accent: '#A8E063' },
  { label: 'This Month', value: '52K', icon: TrendingUp, accent: '#8EC5FC' },
  { label: 'Pending Payout', value: '18K', icon: CreditCard, accent: '#FFD180' },
  { label: 'Commission Paid', value: '22K', icon: Percent, accent: '#FFB3C1' },
];

const invoices = [
  { id: 'INV-SHP-401', date: 'Dec 5', amount: 5000, description: 'Platform subscription', status: 'Pending' },
  { id: 'INV-SHP-398', date: 'Nov 28', amount: 4200, description: 'Commission (Nov)', status: 'Paid' },
];

export default function ShopBillingPage() {
  return (
    <>
      <UniversalNav userRole="shop" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6" style={{ color: '#535353' }}>Billing & Finance</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {summary.map((stat) => {
              const Icon = stat.icon;
              return (
              <div key={stat.label} className="finance-card p-5 rounded-3xl">
                  <Icon className="w-6 h-6 mb-2" style={{ color: stat.accent }} />
                  <p className="text-2xl font-semibold" style={{ color: stat.accent }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="finance-card p-6 rounded-3xl">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#535353' }}>Platform Charges</h2>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <div>
                    <p className="font-medium" style={{ color: '#535353' }}>{invoice.description}</p>
                    <p className="text-sm" style={{ color: '#848484' }}>{invoice.id}  {invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: '#535353' }}>{invoice.amount.toLocaleString()}</p>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: invoice.status === 'Paid' ? 'rgba(124,229,119,0.2)' : 'rgba(255,209,128,0.2)', color: invoice.status === 'Paid' ? '#2E7D32' : '#B45309' }}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
