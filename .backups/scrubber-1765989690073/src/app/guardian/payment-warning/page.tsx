'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { PaymentReminder } from '@/components/guardian/PaymentReminders';
import { Button } from '@/components/ui';

const invoiceDetails = {
  id: 'INV-2045',
  amount: 18500,
  dueDate: 'December 8, 2024',
  daysRemaining: 2,
};

export default function GuardianPaymentWarningPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [showReminder, setShowReminder] = useState(true);

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <Layout>
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-1">
            <p className="text-sm text-emerald-100 uppercase tracking-wide">{t('page.text.paymentnotice')}</p>
            <h1 className="text-3xl font-bold">{t('page.heading.actionneededpaymentp')}</h1>
            <p className="text-emerald-100">
              Your guardian account will be restricted in 2 days unless the outstanding invoice is paid.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          <div className="finance-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm" style={{ color: '#848484' }}>
                  Invoice Number
                </p>
                <p className="text-2xl font-semibold" style={{ color: '#535353' }}>
                  {invoiceDetails.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-amber-500">Due in {invoiceDetails.daysRemaining} days</p>
                <p className="text-2xl font-bold text-amber-600">৳{invoiceDetails.amount.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#848484' }}>
                  Due Date
                </p>
                <p style={{ color: '#535353' }}>{invoiceDetails.dueDate}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#848484' }}>
                  Payment Methods
                </p>
                <p style={{ color: '#535353' }}>{t('page.text.bkashnagadbanktransf')}</p>
              </div>
            </div>
            <Button
              className="w-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
              }}
              onClick={() => setShowReminder(true)}
            >
              View Warning Banner
            </Button>
          </div>

          <div className="finance-card p-6 bg-orange-50 border border-orange-100" style={{ color: '#B45309' }}>
            <p className="font-semibold mb-2">What happens in 2 days?</p>
            <ul className="text-sm space-y-1">
              <li>{t('page.text.bookingnewserviceswi')}</li>
              <li>{t('page.text.accesstopremiumcareg')}</li>
              <li>{t('page.text.existingbookingsrema')}</li>
            </ul>
          </div>
        </div>
      </div>

      {showReminder && (
        <PaymentReminder
          stage="day5"
          invoiceNumber={invoiceDetails.id}
          amount={invoiceDetails.amount}
          dueDate={invoiceDetails.dueDate}
          daysRemaining={invoiceDetails.daysRemaining}
          onPayNow={() => router.push('/payments/create')}
          onDismiss={() => setShowReminder(false)}
        />
      )}
    </Layout>
    </>

  );
}


