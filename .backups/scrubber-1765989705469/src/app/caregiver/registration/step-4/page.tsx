'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CaregiverRegistrationStepFourPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [nid, setNid] = useState('');
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);

  const canContinue = nid.length >= 10 && frontUploaded && backUploaded;

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-900 dark:to-violet-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-2xl mx-auto finance-card p-8">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>{t('page.text.step4of6')}</p>
            <h1 className="text-2xl font-semibold mb-4" style={{ color: '#535353' }}>{t('page.heading.nationalidverificati')}</h1>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>NID Number *</label>
              <Input className="mt-2 bg-white/60 border-white/60" value={nid} onChange={(e) => setNid(e.target.value)} placeholder={t('page.placeholder.enter1017digitnid')} />
            </div>

            <div>
              <p className="text-sm font-medium mb-2" style={{ color: '#535353' }}>Upload NID Front *</p>
              <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-sm cursor-pointer"
                style={{ borderColor: frontUploaded ? '#7CE577' : 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.4)' }}>
                <span>{frontUploaded ? 'Uploaded ' : 'Tap to upload front photo'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={() => setFrontUploaded(true)} />
              </label>
            </div>

            <div>
              <p className="text-sm font-medium mb-2" style={{ color: '#535353' }}>Upload NID Back *</p>
              <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-sm cursor-pointer"
                style={{ borderColor: backUploaded ? '#7CE577' : 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.4)' }}>
                <span>{backUploaded ? 'Uploaded ' : 'Tap to upload back photo'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={() => setBackUploaded(true)} />
              </label>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" onClick={() => router.back()} style={{ color: '#535353' }}>
              Back
            </Button>
            <Button className="flex-1" disabled={!canContinue} onClick={() => router.push('/caregiver/registration/step-5')} style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)', color: 'white', opacity: canContinue ? 1 : 0.5 }}>
              Save & Continue
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
