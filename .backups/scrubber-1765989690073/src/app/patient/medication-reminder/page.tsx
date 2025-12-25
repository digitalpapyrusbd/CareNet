'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function PatientMedicationReminderPage() {
  const { t } = useTranslationContext();
  return (
    <>
      <UniversalNav userRole="patient" showBack={true} />
      <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-900 dark:to-amber-950 px-4 py-10 pb-24 md:pt-14">
        <div className="w-full max-w-md finance-card p-8 text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
            <span className="text-3xl"></span>
          </div>
          <p className="text-sm mb-1" style={{ color: '#848484' }}>{t('page.text.reminder')}</p>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#535353' }}>{t('page.heading.vitamind1000iu')}</h1>
          <p className="text-sm mb-6" style={{ color: '#848484' }}>It&apos;s time for your evening dose. Take with water after dinner.</p>

          <div className="space-y-3">
            <Button className="w-full" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
              Mark as Taken
            </Button>
            <Button variant="outline" className="w-full bg-white/60 border-white/60" style={{ color: '#535353' }}>
              Remind Me in 10 Minutes
            </Button>
          </div>

          <p className="text-xs mt-4" style={{ color: '#848484' }}>Caregiver will be notified automatically.</p>
        </div>
      </div>
    </Layout>
    </>

  );
}
