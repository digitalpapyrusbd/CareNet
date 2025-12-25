'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

export default function ShopAddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Medicines',
    price: '',
    stock: '',
    isActive: true,
  });
  const [images, setImages] = useState<string[]>([]);

  const update = (key: keyof typeof form, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));
  const canSubmit = form.name && form.description && form.price && form.stock;

  return (
    <>
      <UniversalNav userRole="shop" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 dark:from-gray-900 dark:to-violet-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-3xl mx-auto finance-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>Add New Product</h1>
            <Button variant="outline" onClick={() => router.back()} className="bg-white/50 border-white/50" style={{ color: '#535353' }}>
              Cancel
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Product Images</label>
              <div className="mt-2 p-6 rounded-2xl border-2 border-dashed text-center" style={{ borderColor: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.3)' }}>
                <input type="file" multiple accept="image/*" className="hidden" id="images" />
                <label htmlFor="images">
                  <Button type="button" variant="outline" className="bg-white/50 border-white/50">
                    <Plus className="w-4 h-4 mr-2" /> Upload Images
                  </Button>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Product Name *</label>
              <Input value={form.name} onChange={(e) => update('name', e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder="e.g., Digital Thermometer" />
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Description *</label>
              <Textarea value={form.description} onChange={(e) => update('description', e.target.value)} className="mt-2 bg-white/60 border-white/60" rows={4} placeholder="Product details and specifications" />
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Category *</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value)} className="mt-2 w-full rounded-2xl border bg-white/60 px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#535353' }}>
                <option value="Medicines">Medicines</option>
                <option value="Equipment Sale">Equipment Sale</option>
                <option value="Equipment Rental">Equipment Rental</option>
                <option value="Services">Services</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>Price () *</label>
                <Input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder="0" />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>Stock Quantity *</label>
                <Input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="mt-2 bg-white/60 border-white/60" placeholder="0" />
              </div>
            </div>

            <label className="flex items-center gap-3">
              <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} />
              <span className="text-sm" style={{ color: '#535353' }}>Active (visible to customers)</span>
            </label>
          </div>

          <Button
            className="w-full mt-8"
            disabled={!canSubmit}
            onClick={() => router.push('/shop/products')}
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)',
              color: 'white',
              opacity: canSubmit ? 1 : 0.5,
            }}
          >
            Add Product
          </Button>
        </div>
      </div>
    </Layout>
    </>

  );
}
