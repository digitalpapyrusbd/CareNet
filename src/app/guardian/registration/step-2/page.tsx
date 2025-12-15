'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function GuardianRegistrationStep2Page() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const canContinue = otp.length === 6;

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24 md:pt-14">
        {/* Progress Indicator */}
        <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
                style={{
                  background: 2 >= s 
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                    : 'rgba(255, 255, 255, 0.5)',
                  color: 2 >= s ? 'white' : '#848484'
                }}
              >
                {2 > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div 
                  className="flex-1 h-1 mx-2"
                  style={{
                    background: 2 > s 
                      ? 'radial-gradient(to right, #FFB3C1, #FF8FA3)'
                      : 'rgba(255, 255, 255, 0.5)'
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs" style={{ color: '#848484' }}>
          <span>Account</span>
          <span>Verify</span>
          <span>Profile</span>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md finance-card p-8">
        <h2 className="text-center mb-6" style={{ color: '#535353' }}>Verify Phone</h2>

        <div className="space-y-4">
          <p className="text-center text-sm mb-6" style={{ color: '#848484' }}>
            Enter the 6-digit code sent to<br />
            <strong style={{ color: '#535353' }}>01XXX-XXX-789</strong>
          </p>

          <div className="space-y-2">
            <Label htmlFor="otp" style={{ color: '#535353' }}>Verification Code</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="bg-white/50 border-white/50 placeholder:text-gray-400 text-center text-lg tracking-widest"
              style={{ color: '#535353' }}
            />
            <p className="text-xs text-center" style={{ color: '#848484' }}>
              {countdown > 0 ? (
                `Resend code in ${countdown}s`
              ) : (
                <button onClick={() => setCountdown(60)} className="hover:underline" style={{ color: '#FFB3C1' }}>
                  Resend Code
                </button>
              )}
            </p>
          </div>

          <Button
            onClick={() => router.push('/guardian/registration/step-3')}
            disabled={!canContinue}
            className="w-full mt-6"
            size="lg"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
              color: 'white',
              border: 'none',
              opacity: canContinue ? 1 : 0.5
            }}
          >
            Verify
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}
