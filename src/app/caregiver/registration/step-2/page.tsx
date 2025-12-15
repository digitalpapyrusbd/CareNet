'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CaregiverRegistrationStepTwoPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);

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

    const nextInput = document.querySelector<HTMLInputElement>(`input[data-index="${index + 1}"]`);
    if (value && nextInput) nextInput.focus();
  };

  const canContinue = code.every((digit) => digit.trim().length === 1);

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-900 dark:to-amber-950 px-4 py-10 pb-24 md:pt-14">
        <div className="w-full max-w-md finance-card p-8 text-center">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>Step 2 of 6</p>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#535353' }}>Enter 6-digit code</h1>
          <p className="text-sm mb-6" style={{ color: '#848484' }}>
            We sent a code to <strong>+880  12</strong>. Enter it below to continue.
          </p>

          <div className="flex justify-between gap-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                data-index={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(e.target.value, index)}
                className="w-12 h-14 rounded-2xl text-center text-xl font-semibold bg-white/60 border border-white/50 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            ))}
          </div>

          <Button
            className="w-full mb-4"
            disabled={!canContinue}
            onClick={() => router.push('/caregiver/registration/step-3')}
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white',
              opacity: canContinue ? 1 : 0.5,
            }}
          >
            Continue
          </Button>

          <p className="text-xs" style={{ color: '#848484' }}>
            Resend code in <strong>{timer}s</strong>
          </p>
        </div>
      </div>
    </Layout>
    </>

  );
}
