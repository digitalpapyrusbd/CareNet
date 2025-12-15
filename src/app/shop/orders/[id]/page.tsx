'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Package, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShopOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

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
          <h1 className="mb-2" style={{ color: '#535353' }}>Order Details</h1>
          <p style={{ color: '#848484' }}>Order ID: {id}</p>
        </div>

        <div className="finance-card p-6">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
            }}
          >
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <p style={{ color: '#535353' }}>Order details for {id}</p>
        </div>
      </div>
    </div>
    </>

  );
}
