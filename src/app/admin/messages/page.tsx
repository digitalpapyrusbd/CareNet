'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { MessageSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function AdminMessagesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    { id: '1', name: 'Moderator Afsana', lastMessage: 'Verification queue update', time: '10 min ago', unread: 2 },
    { id: '2', name: 'SafeHands Agency', lastMessage: 'Subscription inquiry', time: '1 hour ago', unread: 0 },
    { id: '3', name: 'System Alerts', lastMessage: 'Server maintenance scheduled', time: '3 hours ago', unread: 1 },
  ];

  const filtered = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Messages</h1>

        <div className="finance-card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="pl-10 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {}}
              className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 style={{ color: '#535353' }}>{conv.name}</h3>
                    {conv.unread > 0 && (
                      <span 
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                        style={{ background: '#FF6B7A' }}
                      >
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-1" style={{ color: '#848484' }}>{conv.lastMessage}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>{conv.time}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
    </>

  );
}
