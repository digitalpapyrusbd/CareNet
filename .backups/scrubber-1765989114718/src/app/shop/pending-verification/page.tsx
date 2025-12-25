'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';

const steps = [
  { name: 'Document Upload', status: 'completed', description: 'Trade license and documents submitted' },
  { name: 'Legal Verification', status: 'in-progress', description: 'Verifying trade license and TIN' },
  { name: 'Physical Verification', status: 'pending', description: 'Site visit to be scheduled' },
  { name: 'Final Approval', status: 'pending', description: 'Admin approval pending' },
];

export default function ShopPendingVerificationPage() {
  return (
    <>
      <UniversalNav userRole="shop" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-3xl mx-auto finance-card p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <span className="text-3xl"></span>
            </div>
            <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>Verification in Progress</h1>
            <p className="text-sm" style={{ color: '#848484' }}>Estimated time: 24-48 hours</p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.name} className="finance-card p-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: step.status === 'completed' ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' : step.status === 'in-progress' ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255,255,255,0.5)' }}>
                    <span className="text-white">{step.status === 'completed' ? '' : step.status === 'in-progress' ? '' : index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: '#535353' }}>{step.name}</p>
                    <p className="text-sm" style={{ color: '#848484' }}>{step.description}</p>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full" style={{ background: step.status === 'completed' ? 'rgba(124,229,119,0.2)' : step.status === 'in-progress' ? 'rgba(142,197,252,0.2)' : 'rgba(132,132,132,0.2)', color: step.status === 'completed' ? '#2E7D32' : step.status === 'in-progress' ? '#1976D2' : '#616161' }}>
                    {step.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-2xl" style={{ background: 'rgba(142,197,252,0.1)' }}>
            <p className="text-sm" style={{ color: '#535353' }}>
               <strong>What happens next?</strong> Our team will verify your documents and schedule a physical site visit. You'll receive notifications at each step.
            </p>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
