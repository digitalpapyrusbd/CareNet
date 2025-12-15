'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui';

const lockedFeatures = [
  { label: 'Create new caregiver jobs', allowed: false },
  { label: 'Publish new packages', allowed: false },
  { label: 'Message guardians & caregivers', allowed: true },
  { label: 'View existing schedules', allowed: true },
  { label: 'Receive payouts', allowed: false },
];

export default function AgencyAccountLockedPage() {
  const router = useRouter();

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 pb-10 pb-24 md:pt-14">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="finance-card p-10 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl"
              style={{ background: 'rgba(255, 107, 122, 0.15)' }}>
              🔒
            </div>
            <h1 className="text-3xl font-bold" style={{ color: '#535353' }}>
              Agency Account Locked
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#848484' }}>
              Outstanding invoices older than 7 days have restricted premium functionality. Please settle the balance to
              restore job creation, package publishing, and payouts.
            </p>
          </div>

          <div className="finance-card p-6 space-y-4 text-left">
            <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>
              Feature Access
            </h2>
            <ul className="space-y-3">
              {lockedFeatures.map((feature) => (
                <li key={feature.label} className="flex items-center justify-between text-sm">
                  <span style={{ color: '#535353' }}>{feature.label}</span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: feature.allowed ? 'rgba(124,229,119,0.2)' : 'rgba(255,107,122,0.2)',
                      color: feature.allowed ? '#7CE577' : '#FF6B7A',
                    }}
                  >
                    {feature.allowed ? 'Allowed' : 'Restricted'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="finance-card p-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white',
                }}
                onClick={() => router.push('/agency/billing')}
              >
                Pay Outstanding Balance
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-white/70 border-white/60"
                style={{ color: '#535353' }}
                onClick={() => router.push('/agency/messages/support')}
              >
                Contact CareNet Support
              </Button>
            </div>
            <p className="text-xs text-center" style={{ color: '#848484' }}>
              Access will be automatically restored once payment is confirmed.
            </p>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}


