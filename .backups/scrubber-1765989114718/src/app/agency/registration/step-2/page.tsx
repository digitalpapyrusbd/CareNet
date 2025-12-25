'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AgencyRegistrationStep2Page() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);

  React.useEffect(() => {
    if (timer === 0) return;
    const id = setInterval(() => setTimer((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleInput = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value) document.querySelector<HTMLInputElement>(`input[data-index="${index + 1}"]`)?.focus();
  };

  const canContinue = code.every((digit) => digit.length === 1);

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
      <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-100 dark:from-gray-900 dark:to-indigo-950 px-4 py-12 pb-24 md:pt-14">
        <div className="w-full max-w-md finance-card p-8 text-center">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>Step 2 of 5</p>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#535353' }}>OTP Verification</h1>
          <p className="text-sm mb-6" style={{ color: '#848484' }}>Enter code sent to your phone</p>

          <div className="flex justify-between gap-2 mb-6">
            {code.map((digit, index) => (
              <input key={index} data-index={index} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleInput(e.target.value, index)} className="w-12 h-14 rounded-2xl text-center text-xl font-semibold bg-white/60 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            ))}
          </div>

          <div className="mt-6 p-4 rounded-2xl" style={{ background: 'rgba(184,167,255,0.1)' }}>
            <p className="text-xs" style={{ color: '#535353' }}>Progress: 40% complete</p>
            <div className="mt-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <div className="h-full rounded-full" style={{ width: '40%', background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }} />
            </div>
          </div>

          <Button className="w-full mt-6 mb-4" disabled={!canContinue} onClick={() => router.push('/agency/registration/step-3')} style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white', opacity: canContinue ? 1 : 0.5 }}>
            Verify & Continue
          </Button>

          <p className="text-xs" style={{ color: '#848484' }}>Resend code in <strong>{timer}s</strong></p>
        </div>
      </div>
    </Layout>
    </>

  );
}
