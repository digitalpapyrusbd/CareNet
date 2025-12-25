'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

export default function PasswordResetSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Card */}
      <div className="w-full max-w-md finance-card p-8">
        <div className="text-center py-8">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              boxShadow: '0px 4px 18px rgba(124, 229, 119, 0.35)'
            }}
          >
            <Check className="w-10 h-10 text-white" />
          </div>

          <h2 className="mb-2" style={{ color: '#535353' }}>Password Reset Successful</h2>
          <p className="text-sm" style={{ color: '#848484' }}>
            Redirecting you to login...
          </p>
        </div>
      </div>
    </div>
  );
}
