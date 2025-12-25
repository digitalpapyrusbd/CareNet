'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

const orders = [
  { id: 'ORD-2401', customer: 'Fahima Rahman', items: 3, total: 12500, status: 'Pending', time: '2h ago' },
  { id: 'ORD-2398', customer: 'Karim Uddin', items: 1, total: 8500, status: 'Processing', time: '5h ago' },
  { id: 'ORD-2395', customer: 'Selina Akter', items: 2, total: 7200, status: 'Shipped', time: '1d ago' },
  { id: 'ORD-2392', customer: 'Rahim Islam', items: 1, total: 5000, status: 'Delivered', time: '3d ago' },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: 'rgba(255,209,128,0.2)', text: '#B45309' },
  Processing: { bg: 'rgba(142,197,252,0.2)', text: '#1976D2' },
  Shipped: { bg: 'rgba(184,167,255,0.2)', text: '#6B21A8' },
  Delivered: { bg: 'rgba(124,229,119,0.2)', text: '#2E7D32' },
};

export default function ShopOrdersPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const filtered = orders.filter((order) => 
    (filterStatus === 'all' || order.status === filterStatus) &&
    (order.id.includes(search.toUpperCase()) || order.customer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <UniversalNav userRole="shop" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold" style={{ color: '#535353' }}>Order Management</h1>
              <p className="text-sm" style={{ color: '#848484' }}>Track and process customer orders</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="flex-1 bg-white/70 border-white/60"
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-2xl border bg-white/60 px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#535353' }}>
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="space-y-3">
            {filtered.map((order) => (
              <Link key={order.id} href={`/shop/orders/${order.id}`}>
                <div className="finance-card p-5 rounded-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ color: '#848484' }}>{order.id}  {order.time}</p>
                      <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>{order.customer}</h2>
                      <p className="text-sm" style={{ color: '#848484' }}>{order.items} items  {order.total.toLocaleString()}</p>
                    </div>
                    <span className="px-3 py-1 text-xs rounded-full" style={{ background: statusColors[order.status].bg, color: statusColors[order.status].text }}>
                      {order.status}
                    </span>
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
