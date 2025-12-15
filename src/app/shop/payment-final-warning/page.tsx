'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShopPaymentFinalWarningPage() {
  const router = useRouter();

  return (
    <>
      <UniversalNav userRole="shop" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>Final Payment Warning</h1>
          <p style={{ color: '#848484' }}>Account will be locked soon</p>
        </div>

        <div className="finance-card p-6">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)'
            }}
          >
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <p style={{ color: '#535353' }}>Content for Final Payment Warning</p>
        </div>
      </div>
    </div>
    </>

  );
}
