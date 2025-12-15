'use client';

import { useRouter } from 'next/navigation';
import { Shield, Copy, CheckCircle, Smartphone, Key, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function MFASetupPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'scan' | 'verify'>('scan');
  const secret = 'JBSWY3DPEHPK3PXP';
  const backupCodes = ['ABCD-1234', 'EFGH-5678', 'IJKL-9012', 'MNOP-3456'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div 
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{
          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
          boxShadow: '0px 4px 18px rgba(124, 229, 119, 0.35)'
        }}
      >
        <Shield className="w-10 h-10 text-white" />
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-center mb-2" style={{ color: '#535353' }}>
          {step === 'scan' ? 'Step 1: Setup Authenticator' : 'Step 2: Verify Setup'}
        </h2>
        <p className="text-center text-sm mb-6" style={{ color: '#848484' }}>
          {step === 'scan' 
            ? 'Scan the QR code with Google Authenticator or Authy' 
            : 'Enter the code from your app to confirm'}
        </p>

        {step === 'scan' && (
          <>
            {/* Instructions */}
            <div className="finance-card p-6 mb-4">
              <div className="flex items-start gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(142, 197, 252, 0.2)' }}
                >
                  <Smartphone className="w-5 h-5" style={{ color: '#5B9FFF' }} />
                </div>
                <div>
                  <h3 className="text-sm mb-1" style={{ color: '#535353' }}>Step 1: Download an authenticator app</h3>
                  <p className="text-xs" style={{ color: '#848484' }}>Google Authenticator, Authy, or Microsoft Authenticator</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(168, 224, 99, 0.2)' }}
                >
                  <Key className="w-5 h-5" style={{ color: '#7CE577' }} />
                </div>
                <div>
                  <h3 className="text-sm mb-1" style={{ color: '#535353' }}>Step 2: Scan QR code or enter key</h3>
                  <p className="text-xs" style={{ color: '#848484' }}>Use your app to scan the QR code below</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="finance-card p-6 mb-4 text-center">
              <div className="w-48 h-48 mx-auto mb-4 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <p className="text-sm" style={{ color: '#848484' }}>QR Code<br/>Placeholder</p>
              </div>
              
              <p className="text-xs mb-2" style={{ color: '#848484' }}>Or enter this key manually:</p>
              <div className="flex items-center gap-2 justify-center">
                <code className="text-sm px-3 py-2 rounded-lg font-mono" style={{ background: 'rgba(255, 255, 255, 0.5)', color: '#535353' }}>
                  {secret}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(secret)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
                  style={{ color: '#5B9FFF' }}
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Backup Codes Warning */}
            <div 
              className="finance-card p-4 mb-6"
              style={{ borderLeft: '4px solid #FFD180' }}
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#FFD180' }} />
                <div>
                  <p className="text-sm mb-1" style={{ color: '#535353' }}>Important: Save your backup codes</p>
                  <p className="text-xs" style={{ color: '#848484' }}>You'll receive backup codes after verification to access your account if you lose your device</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep('verify')}
              className="w-full"
              size="lg"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                boxShadow: '0px 4px 18px rgba(124, 229, 119, 0.35)',
                color: 'white',
                border: 'none'
              }}
            >
              I've Scanned the Code
            </Button>
          </>
        )}

        {step === 'verify' && (
          <>
            {/* Verify Code */}
            <div className="finance-card p-6 mb-6">
              <label className="text-sm mb-3 block text-center" style={{ color: '#535353' }}>
                Enter the 6-digit code from your authenticator app
              </label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl bg-white/50 border-white/50 tracking-widest"
                style={{ color: '#535353' }}
              />
            </div>

            {/* Backup Codes */}
            <div className="finance-card p-6 mb-6">
              <h3 className="text-sm mb-3 text-center" style={{ color: '#535353' }}>Your Backup Codes</h3>
              <p className="text-xs mb-4 text-center" style={{ color: '#848484' }}>
                Save these codes in a secure place. Each can be used once if you lose access to your authenticator.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((backupCode, idx) => (
                  <div key={idx} className="p-2 rounded-lg text-center font-mono text-sm"
                    style={{ background: 'rgba(255, 255, 255, 0.5)', color: '#535353' }}>
                    {backupCode}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep('scan')}
                variant="outline"
                className="flex-1 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              >
                Back
              </Button>
              <Button
                onClick={() => router.push('/admin/dashboard')}
                disabled={code.length !== 6}
                className="flex-1"
                size="lg"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                  boxShadow: '0px 4px 18px rgba(124, 229, 119, 0.35)',
                  color: 'white',
                  border: 'none',
                  opacity: code.length !== 6 ? 0.5 : 1
                }}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Setup
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
