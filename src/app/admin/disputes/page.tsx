'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AdminDisputesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved' | 'escalated'>('all');

  const disputes = [
    { id: 'D-1001', parties: 'Guardian vs Agency', issue: 'Service quality complaint', status: 'open', priority: 'high', date: 'Dec 4' },
    { id: 'D-1002', parties: 'Caregiver vs Guardian', issue: 'Payment dispute', status: 'escalated', priority: 'high', date: 'Dec 3' },
    { id: 'D-1003', parties: 'Agency vs Caregiver', issue: 'Schedule conflict', status: 'resolved', priority: 'medium', date: 'Dec 1' },
  ];

  const filtered = disputes.filter(d => filter === 'all' || d.status === filter);

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Dispute Center</h1>

        <div className="flex gap-2 mb-6">
          {['all', 'open', 'resolved', 'escalated'].map((f) => (
            <button key={f} onClick={() => setFilter(f as unknown)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((dispute) => (
            <div key={dispute.id} className="finance-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: dispute.priority === 'high'
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                  }}
                >
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 style={{ color: '#535353' }}>{dispute.id}</h3>
                    <span 
                      className="text-xs px-2 py-1 rounded-full capitalize"
                      style={{
                        background: dispute.status === 'open' ? 'rgba(255, 179, 193, 0.2)' : dispute.status === 'escalated' ? 'rgba(255, 107, 122, 0.2)' : 'rgba(124, 229, 119, 0.2)',
                        color: dispute.status === 'open' ? '#FFB3C1' : dispute.status === 'escalated' ? '#FF6B7A' : '#7CE577'
                      }}
                    >
                      {dispute.status}
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: '#535353' }}>{dispute.parties}</p>
                  <p className="text-xs mb-2" style={{ color: '#848484' }}>{dispute.issue}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>{dispute.date}</p>
                </div>
              </div>

              <Button onClick={() => router.push(`/admin/disputes/${dispute.id}`)} size="sm" variant="outline"
                className="w-full bg-white/50 border-white/50">
                <Eye className="w-4 h-4 mr-2" />View Details
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
}
