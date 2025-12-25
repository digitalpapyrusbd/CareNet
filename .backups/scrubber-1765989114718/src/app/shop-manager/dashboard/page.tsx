'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Package, AlertTriangle, ShoppingCart } from 'lucide-react';

const kpis = [
  { label: 'Pending Orders', value: 8, accent: '#FFD180' },
  { label: 'Processing', value: 5, accent: '#8EC5FC' },
  { label: 'Low Stock Items', value: 3, accent: '#FFB3C1' },
];

export default function ShopManagerDashboardPage() {
  return (
    <>
      <UniversalNav userRole="shop-manager" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-purple-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl mb-6" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" style={{ color: '#D97706' }} />
              <div>
                <p className="font-semibold" style={{ color: '#92400E' }}>Manager Access - Operations Only</p>
                <p className="text-xs" style={{ color: '#78350F' }}>Limited permissions. Contact admin for full access.</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-semibold" style={{ color: '#535353' }}>Manager Dashboard</h1>
            <p className="text-sm" style={{ color: '#848484' }}>Process orders and manage inventory</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="finance-card p-5 rounded-3xl text-center">
                <p className="text-3xl font-bold" style={{ color: kpi.accent }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: '#848484' }}>{kpi.label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/shop-manager/orders">
              <div className="finance-card p-6 rounded-3xl">
                <ShoppingCart className="w-8 h-8 mb-3" style={{ color: '#8EC5FC' }} />
                <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>Order Queue</h2>
                <p className="text-sm" style={{ color: '#848484' }}>Process pending orders</p>
              </div>
            </Link>

            <Link href="/shop-manager/inventory">
              <div className="finance-card p-6 rounded-3xl">
                <Package className="w-8 h-8 mb-3" style={{ color: '#A8E063' }} />
                <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>Inventory</h2>
                <p className="text-sm" style={{ color: '#848484' }}>Update stock levels</p>
              </div>
            </Link>

            <Link href="/shop-manager/alerts">
              <div className="finance-card p-6 rounded-3xl">
                <AlertTriangle className="w-8 h-8 mb-3" style={{ color: '#FFB3C1' }} />
                <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>Low Stock Alerts</h2>
                <p className="text-sm" style={{ color: '#848484' }}>Items needing restock</p>
              </div>
            </Link>

            <Link href="/shop-manager/inquiries">
              <div className="finance-card p-6 rounded-3xl">
                <span className="text-3xl mb-3 block"></span>
                <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>Customer Inquiries</h2>
                <p className="text-sm" style={{ color: '#848484' }}>Respond to questions</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
