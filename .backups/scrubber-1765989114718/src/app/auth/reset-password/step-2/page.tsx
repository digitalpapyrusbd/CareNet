'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

export default function PasswordResetStep2Page() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const canContinue = otp.length === 6;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div 
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{
          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
          boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
        }}
      >
        <Lock className="w-10 h-10 text-white" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md finance-card p-8">
        <h2 className="text-center mb-2" style={{ color: '#535353' }}>Verify Code</h2>
        <p className="text-center text-sm mb-6" style={{ color: '#848484' }}>
          Enter the 6-digit code sent to 01XXX-XXX-789
        </p>

        <div className="space-y-4">
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
                <button 
                  onClick={() => setCountdown(60)}
                  className="hover:underline" 
                  style={{ color: '#FFB3C1' }}
                >
                  Resend Code
                </button>
              )}
            </p>
          </div>

          <Button
            onClick={() => router.push('/auth/reset-password/step-3')}
            disabled={!canContinue}
            className="w-full"
            size="lg"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
              color: 'white',
              border: 'none',
              opacity: canContinue ? 1 : 0.5
            }}
          >
            Verify Code
          </Button>
        </div>
      </div>
    </div>
  );
}
