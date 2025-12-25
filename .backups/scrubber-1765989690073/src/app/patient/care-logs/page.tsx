'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React from 'react';
import Layout from '@/components/layout/Layout';

const logs = [
  { time: '09:05 AM', title: 'Vitals Recorded', detail: 'BP 128/82, HR 78, Temp 98.4F', icon: '' },
  { time: '09:15 AM', title: 'Medication', detail: 'Metformin 500mg taken with water', icon: '' },
  { time: '11:30 AM', title: 'Exercise', detail: '15 min seated stretches completed', icon: '' },
];

export default function PatientCareLogsPage() {
  const { t } = useTranslationContext();
  return (
    <>
      <UniversalNav userRole="patient" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-slate-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold mb-1" style={{ color: '#535353' }}>{t('page.heading.todayaposscarelogs')}</h1>
          <p className="text-sm mb-6" style={{ color: '#848484' }}>All activities logged by your caregiver.</p>

          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.time} className="finance-card p-4 rounded-3xl flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center text-xl">{log.icon}</div>
                <div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#848484' }}>
                    <span>{log.time}</span>
                    <span></span>
                    <span>{t('page.text.caregiverupdate')}</span>
                  </div>
                  <p className="text-lg font-semibold" style={{ color: '#535353' }}>{log.title}</p>
                  <p className="text-sm" style={{ color: '#535353' }}>{log.detail}</p>
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
