'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AgencyRegistrationStep5Page() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');

  const canSubmit = accountNumber && accountName && (paymentMethod !== 'bank' || (bankName && branchName));

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-emerald-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-2xl mx-auto finance-card p-8">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>{t('page.text.step5of5')}</p>
          <h1 className="text-2xl font-semibold mb-4" style={{ color: '#535353' }}>{t('page.heading.payoutsetup')}</h1>
          <p className="text-sm mb-6" style={{ color: '#848484' }}>{t('page.text.configurehowyourecei')}</p>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block" style={{ color: '#535353' }}>Payment Method *</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'bkash', label: 'bKash', emoji: '' },
                  { value: 'nagad', label: 'Nagad', emoji: '' },
                  { value: 'bank', label: 'Bank', emoji: '' },
                ].map((method) => (
                  <button key={method.value} onClick={() => setPaymentMethod(method.value as any)} className="p-4 rounded-2xl text-center" style={{ background: paymentMethod === method.value ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' : 'rgba(255,255,255,0.6)', color: paymentMethod === method.value ? 'white' : '#535353' }}>
                    <span className="text-2xl block mb-1">{method.emoji}</span>
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>
                {paymentMethod === 'bank' ? 'Account Number' : `${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Number`} *
              </label>
              <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder={paymentMethod === 'bank' ? 'Bank account number' : '01XXXXXXXXX'} />
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Account Holder Name *</label>
              <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder={t('page.placeholder.nameasperaccount')} />
            </div>

            {paymentMethod === 'bank' && (
              <>
                <div>
                  <label className="text-sm font-medium" style={{ color: '#535353' }}>Bank Name *</label>
                  <Input value={bankName} onChange={(e) => setBankName(e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder={t('page.placeholder.egdutchbanglabank')} />
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: '#535353' }}>Branch Name *</label>
                  <Input value={branchName} onChange={(e) => setBranchName(e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder={t('page.placeholder.eggulshanbranch')} />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 p-4 rounded-2xl" style={{ background: 'rgba(168,224,99,0.1)' }}>
            <p className="text-xs" style={{ color: '#535353' }}>{t('page.text.progress100complete')}</p>
            <div className="mt-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <div className="h-full rounded-full" style={{ width: '100%', background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }} />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" onClick={() => router.back()} style={{ color: '#535353' }}>{t('page.text.back2')}</Button>
            <Button className="flex-1" disabled={!canSubmit} onClick={() => router.push('/agency/pending-verification')} style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white', opacity: canSubmit ? 1 : 0.5 }}>
              Submit for Verification
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
