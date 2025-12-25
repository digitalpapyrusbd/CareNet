'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ShopManagerUpdateStockPage() {
  const router = useRouter();
  const [currentStock, setCurrentStock] = useState('5');
  const [adjustment, setAdjustment] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <>
      <UniversalNav userRole="shop-manager" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-emerald-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-2xl mx-auto finance-card p-8">
          <h1 className="text-2xl font-semibold mb-6" style={{ color: '#535353' }}>Update Stock</h1>

          <div className="mb-6">
            <p className="text-sm" style={{ color: '#848484' }}>Product: Hospital Bed (Rental)</p>
            <p className="text-sm" style={{ color: '#848484' }}>Current Stock: {currentStock}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Adjustment (+ to add, - to remove)</label>
              <Input
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(e.target.value)}
                className="mt-2 bg-white/60 border-white/60"
                placeholder="+10 or -3"
              />
              <p className="text-xs mt-1" style={{ color: '#848484' }}>New stock: {parseInt(currentStock) + (parseInt(adjustment) || 0)}</p>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Notes</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2 bg-white/60 border-white/60" rows={3} placeholder="Stock adjustment reason" />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" onClick={() => router.back()} style={{ color: '#535353' }}>
              Cancel
            </Button>
            <Button className="flex-1" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
              Save Update
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
