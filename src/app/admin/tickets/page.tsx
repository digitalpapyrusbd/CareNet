'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { MessageSquare, Search, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function AdminTicketsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const tickets = [
    { id: 'T-2001', user: 'Fahima Ahmed', type: 'Guardian', subject: 'Cannot access patient records', status: 'open', priority: 'high', date: '2 hours ago' },
    { id: 'T-2002', user: 'SafeHands Agency', type: 'Agency', subject: 'Payment processing issue', status: 'open', priority: 'medium', date: '5 hours ago' },
    { id: 'T-2003', user: 'Rashida Begum', type: 'Caregiver', subject: 'Profile update not saving', status: 'resolved', priority: 'low', date: '1 day ago' },
  ];

  const filtered = tickets.filter(t => 
    (filter === 'all' || t.status === filter) &&
    (t.user.toLowerCase().includes(searchTerm.toLowerCase()) || t.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Support Tickets</h1>

        <div className="finance-card p-4 mb-6">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tickets..."
              className="pl-10 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>

          <div className="flex gap-2">
            {['all', 'open', 'resolved'].map((f) => (
              <button key={f} onClick={() => setFilter(f as any)}
                className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" style={{
                  background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' : 'rgba(255, 255, 255, 0.5)',
                  color: filter === f ? 'white' : '#535353'
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((ticket) => (
            <div key={ticket.id} className="finance-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: ticket.priority === 'high'
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)'
                      : ticket.priority === 'medium'
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                  }}
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 style={{ color: '#535353' }}>{ticket.id}</h3>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: ticket.status === 'open' ? 'rgba(255, 179, 193, 0.2)' : 'rgba(124, 229, 119, 0.2)',
                        color: ticket.status === 'open' ? '#FFB3C1' : '#7CE577'
                      }}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: '#535353' }}>{ticket.subject}</p>
                  <p className="text-xs mb-2" style={{ color: '#848484' }}>{ticket.user} ({ticket.type})</p>
                  <div className="flex items-center gap-1 text-xs" style={{ color: '#848484' }}>
                    <Clock className="w-3 h-3" />
                    <span>{ticket.date}</span>
                  </div>
                </div>
              </div>

              <Button onClick={() => {}} size="sm" variant="outline"
                className="w-full bg-white/50 border-white/50">
                <Eye className="w-4 h-4 mr-2" />View Ticket
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
}
