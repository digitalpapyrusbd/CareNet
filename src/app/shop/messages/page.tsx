'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

const conversations = [
  { id: 'msg-301', customer: 'Fahima Rahman', preview: 'Is the wheelchair foldable?', unread: 1, time: '15m ago' },
  { id: 'msg-298', customer: 'CareNet Support', preview: 'Your payout is processed', unread: 0, time: '2h ago' },
  { id: 'msg-295', customer: 'Karim Uddin', preview: 'When will my order ship?', unread: 2, time: '1d ago' },
];

export default function ShopMessagesPage() {
  const [search, setSearch] = useState('');
  const filtered = conversations.filter((conv) => conv.customer.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <UniversalNav userRole="shop" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-violet-50 dark:from-gray-900 dark:to-violet-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6" style={{ color: '#535353' }}>Messages</h1>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="mb-6 bg-white/70 border-white/60"
          />

          <div className="space-y-3">
            {filtered.map((conv) => (
              <Link key={conv.id} href={`/shop/messages/${conv.id}`}>
                <div className="finance-card p-5 rounded-3xl flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold" style={{ color: '#535353' }}>{conv.customer}</p>
                      <span className="text-xs" style={{ color: '#848484' }}>{conv.time}</span>
                    </div>
                    <p className="text-sm" style={{ color: '#848484' }}>{conv.preview}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="ml-3 px-3 py-1 text-xs rounded-full" style={{ background: '#8B7AE8', color: 'white' }}>{conv.unread}</span>
                  )}
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
