'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NegotiationWaitingPage() {
  const router = useRouter();

  const packageData = {
    name: '24/7 Senior Care - Basic',
    agency: 'Green Care Agency',
    originalPrice: 35000,
    proposedPrice: 30000
  };

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
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

        {/* Package Header */}
        <div className="finance-card p-6 mb-6">
          <h2 className="mb-2" style={{ color: '#535353' }}>{packageData.name}</h2>
          <p className="text-sm mb-3" style={{ color: '#848484' }}>{packageData.agency}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: '#848484' }}>Original Price:</span>
            <span className="text-xl" style={{ color: '#535353' }}>৳{packageData.originalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Waiting Status */}
        <div className="space-y-6">
          <div className="text-center py-12 finance-card">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
              }}
            >
              <Clock className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h2 className="mb-2" style={{ color: '#535353' }}>Waiting for Agency Response</h2>
            <p style={{ color: '#848484' }}>
              Your counter-offer has been sent to {packageData.agency}
            </p>
          </div>

          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>Your Offer</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Original Price:</span>
                <span style={{ color: '#535353' }}>৳{packageData.originalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Your Offer:</span>
                <span style={{ color: '#FFB3C1' }}>৳{packageData.proposedPrice.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t flex justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
                <span style={{ color: '#848484' }}>Potential Savings:</span>
                <span style={{ color: '#7CE577' }}>৳{(packageData.originalPrice - packageData.proposedPrice).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div 
            className="p-4 rounded-lg"
            style={{ background: 'rgba(255, 211, 128, 0.1)' }}
          >
            <p className="text-sm" style={{ color: '#535353' }}>
              ⏱️ Agencies typically respond within 24-48 hours. You'll receive a notification when they respond.
            </p>
          </div>

          {/* Mock: Simulate response received */}
          <Button
            onClick={() => router.push('/guardian/negotiation/review')}
            variant="outline"
            className="w-full bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            [Demo: View Agency Response]
          </Button>
        </div>
      </div>
    </div>
    </>

  );
}
