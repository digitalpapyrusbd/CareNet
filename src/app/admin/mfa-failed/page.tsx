'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { XCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminMFAFailedPage() {
  const router = useRouter();

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24 md:pt-14">
      <div 
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{
          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)',
          boxShadow: '0px 4px 18px rgba(255, 107, 122, 0.35)'
        }}
      >
        <XCircle className="w-10 h-10 text-white" />
      </div>

      <div className="w-full max-w-md finance-card p-8 text-center">
        <h2 className="mb-2" style={{ color: '#535353' }}>MFA Verification Failed</h2>
        <p className="mb-6" style={{ color: '#848484' }}>
          The verification code you entered was incorrect or has expired.
        </p>

        <div className="finance-card p-4 mb-6">
          <p className="text-sm mb-2" style={{ color: '#535353' }}>Common Issues:</p>
          <ul className="text-xs space-y-1 text-left" style={{ color: '#848484' }}>
            <li>• Code expired (codes are valid for 5 minutes)</li>
            <li>• Incorrect code entered</li>
            <li>• Time sync issue on authenticator app</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.push('/auth/verify-mfa')}
            className="w-full"
            size="lg"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
              color: 'white'
            }}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>

          <Button
            onClick={() => router.push('/admin/login')}
            variant="outline"
            className="w-full bg-white/50 border-white/50"
            size="lg"
            style={{ color: '#535353' }}
          >
            Back to Login
          </Button>
        </div>

        <button
          onClick={() => {}}
          className="mt-6 text-sm hover:underline"
          style={{ color: '#5B9FFF' }}
        >
          <HelpCircle className="w-4 h-4 inline mr-1" />
          Need help with MFA?
        </button>
      </div>
    </div>
    </>

  );
}
