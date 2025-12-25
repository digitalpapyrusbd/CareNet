'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CaregiverRegistrationStepOnePage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = async () => {
    if (!phone.trim()) return;
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push('/caregiver/registration/step-2');
  };

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50 dark:from-gray-900 dark:to-rose-950 px-4 py-10 pb-24 md:pt-14">
        <div className="w-full max-w-md finance-card p-8">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>Step 1 of 6</p>
          <h1 className="text-2xl font-semibold mb-3" style={{ color: '#535353' }}>Verify your phone number</h1>
          <p className="text-sm mb-6" style={{ color: '#848484' }}>
            Enter the Bangladeshi mobile number you will use for CareNet. We will send a 6-digit code to continue.
          </p>

          <label className="text-sm font-medium mb-2 block" style={{ color: '#535353' }}>Phone Number (BD)</label>
          <Input
            type="tel"
            placeholder="01XXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-6 bg-white/60 border-white/60"
          />

          <Button
            className="w-full"
            disabled={!phone.trim() || isSending}
            onClick={handleSendCode}
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white',
              opacity: !phone.trim() ? 0.6 : 1,
            }}
          >
            {isSending ? 'Sending...' : 'Send Verification Code'}
          </Button>

          <p className="text-xs text-center mt-4" style={{ color: '#848484' }}>
            By continuing you agree to the CareNet Terms & Privacy.
          </p>
        </div>
      </div>
    </Layout>
    </>

  );
}
