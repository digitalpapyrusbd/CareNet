'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ShopRegistrationPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [form, setForm] = useState({
    shopName: '',
    license: '',
    tin: '',
    ownerName: '',
    phone: '',
    address: '',
  });

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const canSubmit = form.shopName && form.license && form.ownerName && form.phone && form.address;

  return (
    <>
      <UniversalNav userRole="shop" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-3xl mx-auto finance-card p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
              <span className="text-3xl"></span>
            </div>
            <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>{t('page.heading.shopregistration')}</h1>
            <p className="text-sm" style={{ color: '#848484' }}>{t('page.text.registeryourmedicale')}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Shop Name *</label>
              <Input value={form.shopName} onChange={(e) => update('shopName', e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder={t('page.placeholder.egmedcarepharmacy')} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>Trade License Number *</label>
                <Input value={form.license} onChange={(e) => update('license', e.target.value)} className="mt-2 bg-white/60 border-white/60" />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>TIN (optional)</label>
                <Input value={form.tin} onChange={(e) => update('tin', e.target.value)} className="mt-2 bg-white/60 border-white/60" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>Owner Name *</label>
                <Input value={form.ownerName} onChange={(e) => update('ownerName', e.target.value)} className="mt-2 bg-white/60 border-white/60" />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>Contact Phone *</label>
                <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder={t('page.placeholder.01xxxxxxxxx8')} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Shop Address *</label>
              <Textarea value={form.address} onChange={(e) => update('address', e.target.value)} className="mt-2 bg-white/60 border-white/60" rows={3} placeholder={t('page.placeholder.completeaddresswitha')} />
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Upload Documents *</label>
              <div className="mt-2 p-6 rounded-2xl border-2 border-dashed text-center" style={{ borderColor: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.3)' }}>
                <p className="text-sm" style={{ color: '#535353' }}>{t('page.text.tradelicensetincerti')}</p>
                <input type="file" multiple className="hidden" id="docs" />
                <label htmlFor="docs">
                  <Button type="button" variant="outline" className="mt-3 bg-white/50 border-white/50">{t('page.text.selectfiles')}</Button>
                </label>
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-8"
            disabled={!canSubmit}
            onClick={() => router.push('/shop/pending-verification')}
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)',
              color: 'white',
              opacity: canSubmit ? 1 : 0.5,
            }}
          >
            Submit for Verification
          </Button>
        </div>
      </div>
    </Layout>
    </>

  );
}
