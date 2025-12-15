'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NegotiationReviewPage() {
  const router = useRouter();

  const packageData = {
    name: '24/7 Senior Care - Basic',
    agency: 'Green Care Agency',
    originalPrice: 35000,
    proposedPrice: 30000
  };

  const agencyResponse = {
    counterPrice: 32000,
    message: 'We appreciate your interest. We can offer this package at ৳32,000, which includes all premium services. This is our best offer considering the quality of care provided.',
    respondedAt: '2 hours ago'
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

        {/* Agency Response */}
        <div className="space-y-6">
          <div className="finance-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5" style={{ color: '#5B9FFF' }} />
              <h3 style={{ color: '#535353' }}>Agency Response</h3>
            </div>
            <p className="text-sm mb-4" style={{ color: '#848484' }}>
              Received {agencyResponse.respondedAt}
            </p>
            <p className="mb-4" style={{ color: '#535353' }}>
              {agencyResponse.message}
            </p>
          </div>

          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>Price Comparison</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Original Price:</span>
                <span style={{ color: '#535353' }}>৳{packageData.originalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Your Offer:</span>
                <span style={{ color: '#848484' }}>৳{packageData.proposedPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Agency Counter:</span>
                <span style={{ color: '#FFB3C1' }}>৳{agencyResponse.counterPrice.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t flex justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
                <span style={{ color: '#848484' }}>Your Savings:</span>
                <span style={{ color: '#7CE577' }}>৳{(packageData.originalPrice - agencyResponse.counterPrice).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => router.push('/guardian/packages')}
              variant="outline"
              className="bg-white/50 border-white/50"
              style={{ color: '#FF6B7A' }}
            >
              <X className="w-4 h-4 mr-2" />
              Decline
            </Button>
            <Button
              onClick={() => alert('Accepting offer - would proceed to booking')}
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                color: 'white'
              }}
            >
              <Check className="w-4 h-4 mr-2" />
              Accept Offer
            </Button>
          </div>

          <Button
            onClick={() => router.push('/guardian/negotiation')}
            variant="outline"
            className="w-full bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            Send Another Counter-Offer
          </Button>
        </div>
      </div>
    </div>
    </>

  );
}
