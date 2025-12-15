'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui';
import { BillingInvoices } from '@/components/guardian/BillingInvoices';

export default function GuardianPlatformBillingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleBack = () => {
    router.push('/guardian/billing');
  };

  const handlePayInvoice = (invoiceId: string) => {
    setActionMessage(`Payment initiated for ${invoiceId}. Redirecting to checkout...`);
    setTimeout(() => router.push('/payments/create'), 1200);
  };

  const handleViewInvoice = (invoiceId: string) => {
    setActionMessage(`Opening invoice ${invoiceId}...`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    setActionMessage(`Downloading invoice ${invoiceId}...`);
  };

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <Layout>
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <p className="text-sm text-emerald-100">
              {t('guardian.billing.platform.badge', { defaultValue: 'Platform Fees' })}
            </p>
            <h1 className="text-3xl font-bold mt-1">
              {t('guardian.billing.platform.title', { defaultValue: 'CareNet Platform Invoices' })}
            </h1>
            <p className="text-emerald-100 mt-2 max-w-2xl">
              {t('guardian.billing.platform.subtitle', {
                defaultValue: 'Review subscription charges, service fees, and maintain uninterrupted platform access.',
              })}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {actionMessage && (
            <div
              className="finance-card p-4 text-sm flex items-center justify-between"
              style={{ color: '#535353' }}
            >
              <span>{actionMessage}</span>
              <Button
                variant='outline'
                className="bg-white/50 border-white/50"
                style={{ color: '#535353' }}
                onClick={() => setActionMessage(null)}
              >
                Dismiss
              </Button>
            </div>
          )}

          <BillingInvoices
            type="platform"
            onBack={handleBack}
            onPayInvoice={handlePayInvoice}
            onViewInvoice={handleViewInvoice}
            onDownloadInvoice={handleDownloadInvoice}
          />
        </div>
      </div>
    </Layout>
    </>

  );
}


