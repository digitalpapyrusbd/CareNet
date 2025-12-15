'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const inventory = [
  { id: 'PRD-101', name: 'Wheelchair - Standard', stock: 12, status: 'Good' },
  { id: 'PRD-102', name: 'Blood Pressure Monitor', stock: 28, status: 'Good' },
  { id: 'PRD-103', name: 'Hospital Bed (Rental)', stock: 5, status: 'Low' },
  { id: 'PRD-104', name: 'Oxygen Concentrator', stock: 0, status: 'Out' },
];

export default function ShopManagerInventoryPage() {
  return (
    <>
      <UniversalNav userRole="shop-manager" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 dark:from-gray-900 dark:to-emerald-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6" style={{ color: '#535353' }}>Inventory Management</h1>

          <div className="space-y-3">
            {inventory.map((item) => (
              <div key={item.id} className="finance-card p-5 rounded-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: '#848484' }}>{item.id}</p>
                    <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>{item.name}</h2>
                    <p className="text-sm" style={{ color: item.status === 'Good' ? '#2E7D32' : item.status === 'Low' ? '#B45309' : '#B91C1C' }}>
                      Stock: {item.stock} {item.status === 'Low' && '(Low)'} {item.status === 'Out' && '(Out of Stock)'}
                    </p>
                  </div>
                  <Link href={`/shop-manager/inventory/update?id=${item.id}`}>
                    <Button size="sm" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                      Update Stock
                    </Button>
                  </Link>
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
