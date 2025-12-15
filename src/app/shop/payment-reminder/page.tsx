'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export default function ShopPaymentReminderPage() {
  return (
    <>
      <UniversalNav userRole="shop" showBack={true} />
      <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950 px-4 py-10 pb-24 md:pt-14">
        <div className="w-full max-w-md finance-card p-8">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-center mb-3" style={{ color: '#535353' }}>Payment Reminder</h1>
          <p className="text-sm text-center mb-6" style={{ color: '#848484' }}>
            Invoice #INV-SHP-401 for 5,000 is due in 4 days.
          </p>

          <div className="finance-card p-5 rounded-2xl mb-6" style={{ background: 'rgba(142,197,252,0.1)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: '#535353' }}>Amount Due</span>
              <span className="text-xl font-bold" style={{ color: '#535353' }}>5,000</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: '#848484' }}>Due Date</span>
              <span style={{ color: '#848484' }}>Dec 14, 2024</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
              Pay Now
            </Button>
            <Button variant="outline" className="w-full bg-white/60 border-white/60" style={{ color: '#535353' }}>
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
