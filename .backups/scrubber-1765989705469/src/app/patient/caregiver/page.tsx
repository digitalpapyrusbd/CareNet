'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function PatientCaregiverPage() {
  const { t } = useTranslationContext();
  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 dark:from-gray-900 dark:to-rose-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-2xl mx-auto finance-card p-8">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-3xl bg-white/60 flex items-center justify-center text-4xl"></div>
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>{t('page.text.assignedcaregiver')}</p>
              <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>{t('page.heading.shailakhatun')}</h1>
              <p className="text-sm" style={{ color: '#848484' }}>4.9   78 completed jobs</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
              <p className="text-xs" style={{ color: '#848484' }}>{t('page.text.experience1')}</p>
              <p className="text-lg font-semibold" style={{ color: '#535353' }}>{t('page.text.5years')}</p>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
              <p className="text-xs" style={{ color: '#848484' }}>{t('page.text.specialties')}</p>
              <p className="text-lg font-semibold" style={{ color: '#535353' }}>{t('page.text.postsurgerydiabetes')}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#535353' }}>{t('page.heading.certifications')}</h2>
            <ul className="space-y-2 text-sm" style={{ color: '#535353' }}>
              <li> {t('page.text.nursingdiplomadhakam')}</li>
              <li> {t('page.text.carenetpsychological')}</li>
              <li> {t('page.text.advancedwoundcaretra')}</li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#535353' }}>{t('page.heading.recentreviews')}</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.7)' }}>
                <p className="text-sm" style={{ color: '#535353' }}>Always on time and explains every medication clearly.</p>
                <p className="text-xs mt-2" style={{ color: '#848484' }}> {t('page.text.fahimarahman')}</p>
              </div>
              <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.7)' }}>
                <p className="text-sm" style={{ color: '#535353' }}>Helped my father recover faster with daily exercises.</p>
                <p className="text-xs mt-2" style={{ color: '#848484' }}> {t('page.text.selinarahman')}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
              Chat with Shaila
            </Button>
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" style={{ color: '#535353' }}>
              View Schedule
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
