'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const lowStockItems = [
  { id: 'PRD-103', name: 'Hospital Bed (Rental)', current: 5, threshold: 10, category: 'Equipment Rental' },
  { id: 'PRD-104', name: 'Oxygen Concentrator', current: 0, threshold: 5, category: 'Equipment Rental' },
  { id: 'PRD-108', name: 'Digital Thermometer', current: 8, threshold: 15, category: 'Medical Device' },
];

export default function ShopManagerAlertsPage() {
  return (
    <>
      <UniversalNav userRole="shop-manager" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-gray-900 dark:to-amber-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8" style={{ color: '#D97706' }} />
            <div>
              <h1 className="text-3xl font-semibold" style={{ color: '#535353' }}>Low Stock Alerts</h1>
              <p className="text-sm" style={{ color: '#848484' }}>Items below threshold</p>
            </div>
          </div>

          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="finance-card p-5 rounded-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: '#848484' }}>{item.id}  {item.category}</p>
                    <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>{item.name}</h2>
                    <p className="text-sm" style={{ color: item.current === 0 ? '#B91C1C' : '#B45309' }}>
                      Stock: {item.current} / Threshold: {item.threshold}
                    </p>
                  </div>
                  <Button size="sm" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)', color: 'white' }}>
                    Notify Admin
                  </Button>
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
