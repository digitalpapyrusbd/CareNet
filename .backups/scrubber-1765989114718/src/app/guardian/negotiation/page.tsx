'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function NegotiationSendPage() {
  const router = useRouter();
  const [proposedPrice, setProposedPrice] = useState('');
  const [notes, setNotes] = useState('');

  const packageData = {
    name: '24/7 Senior Care - Basic',
    agency: 'Green Care Agency',
    originalPrice: 35000
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

        {/* Counter-Offer Form */}
        <div className="space-y-6">
          <div className="finance-card p-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>Send Counter-Offer</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="price" style={{ color: '#535353' }}>Your Proposed Price *</Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#848484' }}>৳</span>
                  <Input
                    id="price"
                    type="number"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    placeholder="30000"
                    className="pl-8 bg-white/50 border-white/50"
                    style={{ color: '#535353' }}
                  />
                </div>
                {proposedPrice && (
                  <p className="text-sm mt-2" style={{ color: packageData.originalPrice - Number(proposedPrice) > 0 ? '#7CE577' : '#FF6B7A' }}>
                    {packageData.originalPrice - Number(proposedPrice) > 0 ? '-' : '+'}৳{Math.abs(packageData.originalPrice - Number(proposedPrice)).toLocaleString()} from original
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="notes" style={{ color: '#535353' }}>Message to Agency (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain your offer or any special requirements..."
                  className="mt-2 bg-white/50 border-white/50 min-h-24"
                  style={{ color: '#535353' }}
                />
              </div>
            </div>
          </div>

          <div 
            className="p-4 rounded-lg"
            style={{ background: 'rgba(142, 197, 252, 0.1)' }}
          >
            <p className="text-sm" style={{ color: '#535353' }}>
              💡 <strong>Negotiation Tips:</strong> Agencies typically respond within 24-48 hours. Be reasonable with your offer to increase chances of acceptance.
            </p>
          </div>

          <Button
            onClick={() => router.push('/guardian/negotiation/waiting')}
            disabled={!proposedPrice}
            className="w-full"
            size="lg"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white',
              opacity: !proposedPrice ? 0.5 : 1
            }}
          >
            <Send className="w-5 h-5 mr-2" />
            Send Counter-Offer
          </Button>
        </div>
      </div>
    </div>
    </>

  );
}
