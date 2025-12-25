'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AgencyRegistrationStep3Page() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [form, setForm] = useState({ companyName: '', tradeLicense: '', tin: '', contactPerson: '', contactPhone: '', address: '', area: 'Gulshan' });

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const canContinue = form.companyName && form.tradeLicense && form.contactPerson && form.contactPhone && form.address;

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 dark:from-gray-900 dark:to-violet-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-3xl mx-auto finance-card p-8">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>{t('page.text.step3of5')}</p>
          <h1 className="text-2xl font-semibold mb-4" style={{ color: '#535353' }}>{t('page.heading.companydetails')}</h1>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Company/Agency Name *</label>
              <Input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder={t('page.placeholder.egsafehandscareservi')} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>Trade License Number *</label>
                <Input value={form.tradeLicense} onChange={(e) => update('tradeLicense', e.target.value)} className="mt-2 bg-white/60 border-white/60" />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>TIN (optional)</label>
                <Input value={form.tin} onChange={(e) => update('tin', e.target.value)} className="mt-2 bg-white/60 border-white/60" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>Contact Person *</label>
                <Input value={form.contactPerson} onChange={(e) => update('contactPerson', e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder={t('page.placeholder.ownerormanagername')} />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>Contact Phone *</label>
                <Input value={form.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder={t('page.placeholder.01xxxxxxxxx1')} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Service Area/Zone *</label>
              <select value={form.area} onChange={(e) => update('area', e.target.value)} className="mt-2 w-full rounded-2xl border bg-white/60 px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#535353' }}>
                <option value="Gulshan">{t('page.text.gulshan')}</option>
                <option value="Banani">{t('page.text.banani')}</option>
                <option value="Dhanmondi">{t('page.text.dhanmondi')}</option>
                <option value="Uttara">{t('page.text.uttara')}</option>
                <option value="Mirpur">{t('page.text.mirpur')}</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Company Address *</label>
              <Textarea value={form.address} onChange={(e) => update('address', e.target.value)} className="mt-2 bg-white/60 border-white/60" rows={3} placeholder={t('page.placeholder.completeofficeaddres')} />
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl" style={{ background: 'rgba(142,197,252,0.1)' }}>
            <p className="text-xs" style={{ color: '#535353' }}>{t('page.text.progress60complete')}</p>
            <div className="mt-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <div className="h-full rounded-full" style={{ width: '60%', background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }} />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" onClick={() => router.back()} style={{ color: '#535353' }}>{t('page.text.back')}</Button>
            <Button className="flex-1" disabled={!canContinue} onClick={() => router.push('/agency/registration/step-4')} style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white', opacity: canContinue ? 1 : 0.5 }}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
