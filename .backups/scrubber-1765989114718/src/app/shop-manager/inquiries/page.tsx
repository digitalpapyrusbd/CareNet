'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const inquiries = [
  { id: 'INQ-512', customer: 'Fahima Rahman', question: 'Is the wheelchair foldable?', product: 'Wheelchair - Standard', time: '15m ago' },
  { id: 'INQ-509', customer: 'Karim Uddin', question: 'Do you deliver to Mirpur?', product: 'Oxygen Concentrator', time: '2h ago' },
];

export default function ShopManagerInquiriesPage() {
  return (
    <>
      <UniversalNav userRole="shop-manager" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 dark:from-gray-900 dark:to-sky-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6" style={{ color: '#535353' }}>Customer Inquiries</h1>

          <div className="space-y-3">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="finance-card p-5 rounded-3xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: '#848484' }}>{inquiry.id}  {inquiry.time}</p>
                    <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>{inquiry.customer}</h2>
                    <p className="text-sm mb-2" style={{ color: '#535353' }}>"{inquiry.question}"</p>
                    <p className="text-xs" style={{ color: '#848484' }}>Product: {inquiry.product}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
                      Respond
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white/50 border-white/50" style={{ color: '#535353' }}>
                      Escalate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
