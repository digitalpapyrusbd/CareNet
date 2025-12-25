'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { PaymentReminder } from '@/components/guardian/PaymentReminders';
import { Button } from '@/components/ui';

const finalNotice = {
  id: 'INV-2046',
  amount: 26500,
  dueDate: 'December 7, 2024',
  daysRemaining: 1,
  lockedFeatures: [
    'Book new caregivers or services',
    'Access premium caregiver messaging',
    'Upload new prescriptions',
    'Request emergency support',
  ],
};

export default function GuardianPaymentFinalWarningPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [showReminder, setShowReminder] = useState(true);

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <Layout>
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white">
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-1">
            <p className="text-sm text-red-100 uppercase tracking-wide">{t('page.text.finalwarning')}</p>
            <h1 className="text-3xl font-bold">{t('page.heading.accountlockimminent')}</h1>
            <p className="text-red-100">
              Immediate action is required to avoid losing access to essential guardian features.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          <div className="finance-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm" style={{ color: '#848484' }}>
                  Outstanding Invoice
                </p>
                <p className="text-2xl font-semibold" style={{ color: '#535353' }}>
                  {finalNotice.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-red-500">{t('page.text.lockingtomorrow')}</p>
                <p className="text-2xl font-bold text-red-600">৳{finalNotice.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#848484' }}>
                  Due Date
                </p>
                <p style={{ color: '#535353' }}>{finalNotice.dueDate}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#848484' }}>
                  Remaining Time
                </p>
                <p style={{ color: '#535353' }}>{finalNotice.daysRemaining} day</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <p className="text-sm font-semibold mb-2" style={{ color: '#B91C1C' }}>
                Features that will be locked:
              </p>
              <ul className="space-y-1 text-sm" style={{ color: '#7F1D1D' }}>
                {finalNotice.lockedFeatures.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </div>

            <Button
              className="w-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)',
                color: 'white',
              }}
              onClick={() => setShowReminder(true)}
            >
              Pay Outstanding Balance
            </Button>
          </div>

          <div className="finance-card p-6 text-sm space-y-3" style={{ color: '#535353' }}>
            <p className="font-semibold">Need assistance?</p>
            <p>
              Contact CareNet Support immediately if you have already made a payment or need a temporary extension. Keep
              your payment reference number ready for faster resolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
                onClick={() => router.push('/guardian/messages')}
              >
                Message Support
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
                onClick={() => router.push('/guardian/billing')}
              >
                View All Invoices
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showReminder && (
        <PaymentReminder
          stage="day6"
          invoiceNumber={finalNotice.id}
          amount={finalNotice.amount}
          dueDate={finalNotice.dueDate}
          daysRemaining={finalNotice.daysRemaining}
          onPayNow={() => router.push('/payments/create')}
          onDismiss={() => setShowReminder(false)}
        />
      )}
    </Layout>
    </>

  );
}


