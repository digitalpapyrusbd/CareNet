'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Button, Input } from '@/components/ui';

type ConversationGroup = 'caregivers' | 'guardians' | 'support';

interface Conversation {
  id: string;
  name: string;
  roleLabel: string;
  lastMessage: string;
  unread: number;
  updatedAt: string;
}

const conversations: Record<ConversationGroup, Conversation[]> = {
  caregivers: [
    {
      id: 'CG-1201',
      name: 'Nusrat Ahmed',
      roleLabel: 'Caregiver',
      lastMessage: 'Can I swap Friday morning with another caregiver?',
      unread: 2,
      updatedAt: '5m ago',
    },
    {
      id: 'CG-1140',
      name: 'Zakir Hossain',
      roleLabel: 'Caregiver',
      lastMessage: 'Submitted care log for Job #4510.',
      unread: 0,
      updatedAt: '1h ago',
    },
  ],
  guardians: [
    {
      id: 'GD-9902',
      name: 'Mariam Rahman',
      roleLabel: 'Guardian',
      lastMessage: 'Counter-offer sent for premium night care.',
      unread: 1,
      updatedAt: '12m ago',
    },
    {
      id: 'GD-9771',
      name: 'Farhan Islam',
      roleLabel: 'Guardian',
      lastMessage: 'Please share updated schedule for next week.',
      unread: 0,
      updatedAt: '2h ago',
    },
  ],
  support: [
    {
      id: 'SUP-01',
      name: 'CareNet Billing',
      roleLabel: 'Support',
      lastMessage: 'Invoice #INV-2041 is now available.',
      unread: 0,
      updatedAt: 'Yesterday',
    },
  ],
};

export default function AgencyMessagesPage() {
  const router = useRouter();
  const [group, setGroup] = useState<ConversationGroup>('caregivers');
  const [search, setSearch] = useState('');

  const filteredConversations = useMemo(() => {
    return conversations[group].filter((conversation) =>
      conversation.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [group, search]);

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 pb-6 pb-24 md:pt-14">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-1">
            <p className="text-sm text-blue-100 uppercase tracking-wide">Messaging</p>
            <h1 className="text-3xl font-bold">Agency Conversations</h1>
            <p className="text-blue-100">
              Stay in sync with caregivers, guardians, and CareNet support from a single inbox.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          {/* Filters */}
          <div className="finance-card p-6 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                {(['caregivers', 'guardians', 'support'] as ConversationGroup[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGroup(g)}
                    className="px-4 py-2 rounded-full text-sm capitalize"
                    style={{
                      background:
                        group === g
                          ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                          : 'rgba(255,255,255,0.7)',
                      color: group === g ? 'white' : '#535353',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div className="w-full sm:w-64">
                <Input
                  placeholder="Search conversation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white/80 border-white/50"
                />
              </div>
            </div>
            <p className="text-xs" style={{ color: '#848484' }}>
              {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''} in{' '}
              {group}.
            </p>
          </div>

          {/* Conversation List */}
          <div className="space-y-3">
            {filteredConversations.length === 0 ? (
              <div className="finance-card p-12 text-center">
                <p className="text-lg mb-2" style={{ color: '#535353' }}>
                  No conversations found
                </p>
                <p className="text-sm" style={{ color: '#848484' }}>
                  Try adjusting your search or selecting a different conversation type.
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => router.push(`/agency/messages/${conversation.id}`)}
                  className="w-full finance-card p-5 text-left transition-all hover:shadow-lg"
                  style={{
                    border: conversation.unread ? '1px solid rgba(91,159,255,0.4)' : '1px solid transparent',
                    background: 'rgba(255,255,255,0.85)',
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold" style={{ color: '#535353' }}>
                          {conversation.name}
                        </h3>
                        <span
                          className="text-xs px-3 py-1 rounded-full capitalize"
                          style={{
                            background: 'rgba(142,197,252,0.2)',
                            color: '#5B9FFF',
                          }}
                        >
                          {conversation.roleLabel}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#848484' }}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs" style={{ color: '#848484' }}>
                        {conversation.updatedAt}
                      </p>
                      {conversation.unread > 0 && (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mt-2"
                          style={{ background: '#FF6B7A', color: 'white' }}
                        >
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}


