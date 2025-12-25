'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ArrowLeft } from 'lucide-react';

export default function PasswordResetStep1Page() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const canContinue = phone.length >= 11;

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
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>

        <h2 className="text-center mb-2" style={{ color: '#535353' }}>Reset Password</h2>
        <p className="text-center text-sm mb-6" style={{ color: '#848484' }}>
          Enter your phone number to receive a reset code
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" style={{ color: '#535353' }}>Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white/50 border-white/50 placeholder:text-gray-400"
              style={{ color: '#535353' }}
            />
          </div>

          <Button
            onClick={() => router.push('/auth/reset-password/step-2')}
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
            Send Reset Code
          </Button>
        </div>
      </div>
    </div>
  );
}
