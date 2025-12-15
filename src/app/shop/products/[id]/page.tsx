'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Package, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function ShopProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [name, setName] = useState('Wheelchair - Standard');
  const [description, setDescription] = useState('Lightweight folding wheelchair');
  const [price, setPrice] = useState('8500');
  const [stock, setStock] = useState('12');

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
          <h1 className="mb-2" style={{ color: '#535353' }}>Product Details</h1>
          <p style={{ color: '#848484' }}>Product ID: {id}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label style={{ color: '#535353' }}>Product Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label style={{ color: '#535353' }}>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 bg-white/50 border-white/50 min-h-24"
                style={{ color: '#535353' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ color: '#535353' }}>Price (BDT)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div>
                <Label style={{ color: '#535353' }}>Stock</Label>
                <Input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.back()}
          className="w-full"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
            color: 'white'
          }}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
    </>

  );
}
