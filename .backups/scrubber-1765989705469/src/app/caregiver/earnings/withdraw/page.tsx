'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useTranslationContext } from '@/components/providers/TranslationProvider';

import { useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, Send, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function WithdrawEarningsPage() {
  const { t } = useTranslationContext();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [accountNumber, setAccountNumber] = useState('');

  const availableBalance = 45000;

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6 max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="mb-6" style={{ color: '#535353' }}>{t('page.heading.withdrawearnings')}</h1>

        <div className="finance-card p-6 mb-6">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>{t('page.text.availablebalance')}</p>
          <p className="text-3xl" style={{ color: '#7CE577' }}>৳{availableBalance.toLocaleString()}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label style={{ color: '#535353' }}>Amount to Withdraw *</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder={t('page.placeholder.enteramount')} className="mt-2 bg-white/50 border-white/50" 
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Withdrawal Method *</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['bank', 'mobile'].map((m) => (
                  <button key={m} onClick={() => setMethod(m)}
                    className="p-3 rounded-lg capitalize" style={{
                      background: method === m ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                      color: method === m ? 'white' : '#535353'
                    }}>
                    {m} Transfer
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Account Number *</Label>
              <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={method === 'bank' ? 'Bank account number' : 'Mobile number'}
                className="mt-2 bg-white/50 border-white/50" 
                style={{ color: '#535353' }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => router.back()} variant="outline" className="flex-1 bg-white/50 border-white/50">{t('page.text.cancel')}</Button>
          <Button onClick={() => router.push('/caregiver/earnings')} 
            disabled={!amount || !accountNumber} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
            <Send className="w-4 h-4 mr-2" />Withdraw
          </Button>
        </div>
      </div>
    </div>
    </>

  );
}

