'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { AlertCircle, CreditCard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentReminderPage() {
  const router = useRouter();
  const invoiceId = 'INV-2024-001';
  const amount = 35000;
  const daysRemaining = 4;

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-24 md:pt-14">
      <div className="w-full max-w-md">
        <div 
          className="finance-card p-6 mb-4"
          style={{ borderLeft: '4px solid #FFD180' }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
              }}
            >
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-1" style={{ color: '#535353' }}>Payment Reminder</h2>
              <p className="text-sm" style={{ color: '#848484' }}>
                Invoice {invoiceId} is due in {daysRemaining} days
              </p>
            </div>
          </div>

          <div className="finance-card p-4 mb-4">
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Amount Due:</span>
              <span style={{ color: '#FFD180' }}>৳{amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex-1 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              <X className="w-4 h-4 mr-2" />
              Dismiss
            </Button>
            <Button
              onClick={() => router.push('/guardian/billing')}
              className="flex-1"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white'
              }}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>
          </div>
        </div>

        <div className="finance-card p-4">
          <p className="text-xs text-center" style={{ color: '#848484' }}>
            Paying on time helps maintain your account in good standing
          </p>
        </div>
      </div>
    </div>
    </>

  );
}
