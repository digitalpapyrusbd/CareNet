'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AgencyRegistrationStep1Page() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: '', password: '', confirmPassword: '' });

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const canContinue = form.phone && form.password && form.password === form.confirmPassword;

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
      <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950 px-4 py-12 pb-24 md:pt-14">
        <div className="w-full max-w-md finance-card p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <span className="text-3xl"></span>
            </div>
            <p className="text-sm mb-2" style={{ color: '#848484' }}>Step 1 of 5</p>
            <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>Register Your Agency</h1>
            <p className="text-sm" style={{ color: '#848484' }}>Phone verification</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Phone Number *</label>
              <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder="01XXXXXXXXX" />
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Password *</label>
              <Input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder="" />
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Confirm Password *</label>
              <Input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder="" />
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl" style={{ background: 'rgba(142,197,252,0.1)' }}>
            <p className="text-xs" style={{ color: '#535353' }}>Progress: 20% complete</p>
            <div className="mt-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <div className="h-full rounded-full" style={{ width: '20%', background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }} />
            </div>
          </div>

          <Button className="w-full mt-6" disabled={!canContinue} onClick={() => router.push('/agency/registration/step-2')} style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white', opacity: canContinue ? 1 : 0.5 }}>
            Send Verification Code
          </Button>
        </div>
      </div>
    </Layout>
    </>

  );
}
