'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CaregiverRegistrationStepThreePage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', dob: '', gender: 'female', address: '', languages: 'Bangla, English' });

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const canContinue = form.name && form.dob && form.address;

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-2xl mx-auto finance-card p-8">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>{t('page.text.step3of6')}</p>
          <h1 className="text-2xl font-semibold mb-4" style={{ color: '#535353' }}>{t('page.heading.basicinformation')}</h1>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Full Name *</label>
              <Input className="mt-2 bg-white/60 border-white/60" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>Date of Birth *</label>
                <Input type="date" className="mt-2 bg-white/60 border-white/60" value={form.dob} onChange={(e) => update('dob', e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>{t('page.text.gender')}</label>
                <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="mt-2 w-full rounded-2xl border bg-white/60 px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#535353' }}>
                  <option value="female">{t('page.text.female')}</option>
                  <option value="male">{t('page.text.male')}</option>
                  <option value="other">{t('page.text.other')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Current Address *</label>
              <Textarea className="mt-2 bg-white/60 border-white/60" rows={3} value={form.address} onChange={(e) => update('address', e.target.value)} placeholder={t('page.placeholder.houseroadareacity')} />
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>{t('page.text.languages')}</label>
              <Input className="mt-2 bg-white/60 border-white/60" value={form.languages} onChange={(e) => update('languages', e.target.value)} />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" onClick={() => router.back()} style={{ color: '#535353' }}>
              Back
            </Button>
            <Button className="flex-1" disabled={!canContinue} onClick={() => router.push('/caregiver/registration/step-4')} style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white', opacity: canContinue ? 1 : 0.5 }}>
              Save & Continue
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
