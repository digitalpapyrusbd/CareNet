'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const orders = [
  { id: 'ORD-2402', customer: 'Selina Akter', items: 2, total: 7200, status: 'Confirm', time: '5m ago' },
  { id: 'ORD-2401', customer: 'Fahima Rahman', items: 3, total: 12500, status: 'Process', time: '2h ago' },
  { id: 'ORD-2398', customer: 'Karim Uddin', items: 1, total: 8500, status: 'Ship', time: '5h ago' },
];

export default function ShopManagerOrdersPage() {
  return (
    <>
      <UniversalNav userRole="shop-manager" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6" style={{ color: '#535353' }}>Order Queue</h1>

          <div className="space-y-3">
            {orders.map((order) => (
              <Link key={order.id} href={`/shop-manager/orders/${order.id}`}>
                <div className="finance-card p-5 rounded-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ color: '#848484' }}>{order.id}  {order.time}</p>
                      <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>{order.customer}</h2>
                      <p className="text-sm" style={{ color: '#848484' }}>{order.items} items  {order.total.toLocaleString()}</p>
                    </div>
                    <Button size="sm" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
                      {order.status}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
