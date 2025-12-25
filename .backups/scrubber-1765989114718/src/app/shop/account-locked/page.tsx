'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle, XCircle } from 'lucide-react';

const restricted = [
  'Cannot list new products',
  'Cannot process new orders',
  'Cannot update listings',
  'Cannot access analytics',
];

const allowed = [
  'Can fulfill existing orders',
  'Can communicate with customers',
  'Can make payment',
  'Can view billing history',
];

export default function ShopAccountLockedPage() {
  return (
    <>
      <UniversalNav userRole="shop" showBack={true} />
      <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-slate-200 dark:from-gray-900 dark:to-slate-950 px-4 py-10 pb-24 md:pt-14">
        <div className="w-full max-w-md finance-card p-8 text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #DC2626 0%, #7F1D1D 100%)' }}>
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-semibold mb-3" style={{ color: '#B91C1C' }}>Account Locked</h1>
          <p className="text-sm mb-6" style={{ color: '#7F1D1D' }}>
            Your shop account has been locked due to outstanding payment.
          </p>

          <div className="p-5 rounded-2xl mb-6" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: '#B91C1C' }}>Outstanding Balance</p>
            <p className="text-3xl font-bold" style={{ color: '#DC2626' }}>5,000</p>
          </div>

          <div className="text-left mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#535353' }}>Restricted Features</h2>
            <ul className="space-y-2 text-sm">
              {restricted.map((feature) => (
                <li key={feature} className="flex items-center gap-2" style={{ color: '#B91C1C' }}>
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-left mb-8">
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#535353' }}>Still Available</h2>
            <ul className="space-y-2 text-sm">
              {allowed.map((feature) => (
                <li key={feature} className="flex items-center gap-2" style={{ color: '#2E7D32' }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <Button className="w-full" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #EF4444 0%, #DC2626 100%)', color: 'white' }}>
            Pay Outstanding Balance
          </Button>
        </div>
      </div>
    </Layout>
    </>

  );
}
