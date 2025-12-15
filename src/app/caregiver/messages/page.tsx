'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useMemo, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  role: 'guardian' | 'support' | 'caregiver';
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const conversations: Conversation[] = [
  {
    id: 'conv-rahman',
    name: 'Fahima Rahman',
    avatar: '',
    role: 'guardian',
    lastMessage: 'Thanks for the update. Please remind baba about fluids.',
    timestamp: '2m ago',
    unread: 1,
  },
  {
    id: 'conv-support',
    name: 'CareNet Support',
    avatar: '',
    role: 'support',
    lastMessage: 'Your verification documents were approved! ',
    timestamp: '1h ago',
    unread: 0,
  },
  {
    id: 'conv-tamanna',
    name: 'Tamanna (Nurse Lead)',
    avatar: '',
    role: 'caregiver',
    lastMessage: 'Need help swapping Saturday shift?',
    timestamp: '4h ago',
    unread: 0,
  },
];

export default function CaregiverMessagesPage() {
  const [filter, setFilter] = useState<'all' | 'guardian' | 'support' | 'caregiver'>('all');
  const filtered = useMemo(() => conversations.filter((conv) => filter === 'all' || conv.role === filter), [filter]);

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold" style={{ color: '#535353' }}>Messages</h1>
            <p className="text-sm" style={{ color: '#848484' }}>Stay in touch with guardians, the support team, and fellow caregivers.</p>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'guardian', label: 'Guardians' },
              { id: 'support', label: 'Support' },
              { id: 'caregiver', label: 'Peers' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                style={{
                  background: filter === tab.id ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255,255,255,0.7)',
                  color: filter === tab.id ? 'white' : '#535353',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((conv) => (
              <Link key={conv.id} href={`/caregiver/messages/${conv.id}`}>
                <div className="finance-card p-5 flex items-center gap-4 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.65)' }}>
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold" style={{ color: '#535353' }}>{conv.name}</p>
                      <span className="text-xs" style={{ color: '#848484' }}>{conv.timestamp}</span>
                    </div>
                    <p className="text-sm truncate" style={{ color: '#848484' }}>{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#FF6B7A', color: 'white' }}>{conv.unread}</span>
                  )}
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="finance-card p-10 text-center text-sm" style={{ color: '#848484' }}>
                No conversations in this category yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
