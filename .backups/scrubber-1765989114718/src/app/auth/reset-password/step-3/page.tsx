'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

export default function PasswordResetStep3Page() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const canContinue = newPassword && confirmPassword && newPassword === confirmPassword;

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
        <h2 className="text-center mb-2" style={{ color: '#535353' }}>Create New Password</h2>
        <p className="text-center text-sm mb-6" style={{ color: '#848484' }}>
          Choose a strong password for your account
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" style={{ color: '#535353' }}>New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white/50 border-white/50 placeholder:text-gray-400"
              style={{ color: '#535353' }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" style={{ color: '#535353' }}>Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white/50 border-white/50 placeholder:text-gray-400"
              style={{ color: '#535353' }}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-destructive">Passwords don't match</p>
            )}
          </div>

          <Button
            onClick={() => router.push('/auth/reset-password/success')}
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
            Reset Password
          </Button>
        </div>
      </div>
    </div>
  );
}
