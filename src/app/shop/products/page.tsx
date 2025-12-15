'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

const products = [
  { id: 'PRD-101', name: 'Wheelchair - Standard', category: 'Equipment Sale', price: 8500, stock: 12, status: 'Active' },
  { id: 'PRD-102', name: 'Blood Pressure Monitor', category: 'Medical Device', price: 2200, stock: 28, status: 'Active' },
  { id: 'PRD-103', name: 'Hospital Bed (Rental)', category: 'Equipment Rental', price: 3500, stock: 5, status: 'Active' },
  { id: 'PRD-104', name: 'Oxygen Concentrator', category: 'Equipment Rental', price: 5000, stock: 0, status: 'Out of Stock' },
];

export default function ShopProductsPage() {
  const [search, setSearch] = useState('');
  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <UniversalNav userRole="shop" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold" style={{ color: '#535353' }}>Product Management</h1>
              <p className="text-sm" style={{ color: '#848484' }}>Manage your shop inventory</p>
            </div>
            <Link href="/shop/products/new">
              <Button style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)', color: 'white' }}>
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            </Link>
          </div>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="mb-6 bg-white/70 border-white/60"
          />

          <div className="grid gap-4">
            {filtered.map((product) => (
              <div key={product.id} className="finance-card p-5 rounded-3xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>{product.name}</h2>
                      <span className="px-3 py-1 text-xs rounded-full" style={{ background: product.status === 'Active' ? 'rgba(124,229,119,0.2)' : 'rgba(244,63,94,0.2)', color: product.status === 'Active' ? '#2E7D32' : '#B91C1C' }}>
                        {product.status}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: '#848484' }}>{product.category}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span style={{ color: '#535353' }}>{product.price.toLocaleString()}</span>
                      <span style={{ color: product.stock > 0 ? '#2E7D32' : '#B91C1C' }}>Stock: {product.stock}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/shop/products/${product.id}`}>
                      <Button variant="outline" size="sm" className="bg-white/50 border-white/50" style={{ color: '#535353' }}>Edit</Button>
                    </Link>
                    <Button variant="outline" size="sm" className="bg-white/50 border-white/50" style={{ color: '#B91C1C' }}>Deactivate</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
