'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function UpdateOrderStatusPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [status, setStatus] = useState('processing');

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
          <h1 className="mb-2" style={{ color: '#535353' }}>Update Order Status</h1>
          <p style={{ color: '#848484' }}>Order ID: {id}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <Label style={{ color: '#535353' }}>Order Status</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full mt-2 px-3 py-2 rounded-lg bg-white/50 border border-white/50"
            style={{ color: '#535353' }}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <Button
          onClick={() => router.back()}
          className="w-full"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
            color: 'white'
          }}
        >
          <Save className="w-4 h-4 mr-2" />
          Update Status
        </Button>
      </div>
    </div>
    </>

  );
}
