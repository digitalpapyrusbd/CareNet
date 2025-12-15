'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { BillingHistory } from '@/components/agency/BillingHistory';
import { Button } from '@/components/ui';

const invoices = [
  {
    id: 'INV-3021',
    date: 'Dec 01, 2024',
    amount: 18000,
    status: 'pending' as const,
    type: 'subscription' as const,
    description: 'Enterprise Subscription - December 2024',
  },
  {
    id: 'INV-3002',
    date: 'Nov 15, 2024',
    amount: 12650,
    status: 'paid' as const,
    type: 'commission' as const,
    description: 'Platform Commission - Guardian Jobs',
  },
  {
    id: 'INV-2980',
    date: 'Nov 01, 2024',
    amount: 18000,
    status: 'paid' as const,
    type: 'subscription' as const,
    description: 'Enterprise Subscription - November 2024',
  },
];

export default function AgencyBillingPage() {
  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 pb-6 pb-24 md:pt-14">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-2">
            <p className="text-sm text-blue-100 uppercase tracking-wide">Billing & Finance</p>
            <h1 className="text-3xl font-bold">Manage Agency Payments</h1>
            <p className="text-blue-100">
              Track subscription renewals, commissions, and download invoices for your records.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          <div className="finance-card p-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>
                Outstanding Balance
              </p>
              <p className="text-3xl font-bold" style={{ color: '#535353' }}>
                ৳18,000
              </p>
            </div>
            <Button
              className="w-full sm:w-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
              }}
            >
              Pay Now
            </Button>
          </div>

          <BillingHistory
            invoices={invoices}
            onViewInvoice={(id) => alert(`Viewing invoice ${id}`)}
            onDownloadInvoice={(id) => alert(`Downloading invoice ${id}`)}
          />
        </div>
      </div>
    </Layout>
    </>

  );
}


