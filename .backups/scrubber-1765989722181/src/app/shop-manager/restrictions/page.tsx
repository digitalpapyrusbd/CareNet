'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { CheckCircle, XCircle } from 'lucide-react';

const allowed = [
  'View orders and order details',
  'Process and fulfill orders',
  'Update inventory stock levels',
  'Respond to customer inquiries',
  'Chat with Shop Admin',
  'View analytics (read-only)',
];

const restricted = [
  'Change product pricing',
  'Add or remove products',
  'Manage billing or subscriptions',
  'Run promotions or discounts',
  'Issue refunds or adjustments',
  'Access financial reports',
  'Modify shop settings',
];

export default function ShopManagerRestrictionsPage() {
  const { t } = useTranslationContext();
  return (
    <>
      <UniversalNav userRole="shop-manager" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6" style={{ color: '#535353' }}>{t('page.heading.manageraccesspermiss')}</h1>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="finance-card p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6" style={{ color: '#2E7D32' }} />
                <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>{t('page.heading.whatyoucando')}</h2>
              </div>
              <ul className="space-y-2 text-sm">
                {allowed.map((item) => (
                  <li key={item} className="flex items-start gap-2" style={{ color: '#535353' }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#2E7D32' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="finance-card p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6" style={{ color: '#B91C1C' }} />
                <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>{t('page.heading.restrictedactions')}</h2>
              </div>
              <ul className="space-y-2 text-sm">
                {restricted.map((item) => (
                  <li key={item} className="flex items-start gap-2" style={{ color: '#535353' }}>
                    <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#B91C1C' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 p-5 rounded-2xl" style={{ background: 'rgba(142,197,252,0.1)' }}>
            <p className="text-sm" style={{ color: '#535353' }}>
               <strong>Need more access?</strong> Contact your Shop Admin to request permission upgrades or role changes.
            </p>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
