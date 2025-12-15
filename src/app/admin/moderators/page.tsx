'use client';

import React from 'react';
import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter } from 'next/navigation';
import { UserCog, Plus, Eye, Edit, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ModeratorManagementPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

  const moderators = [
    { id: '1', name: 'Afsana Rahman', email: 'afsana@carenet.bd', phone: '+880 1712-345678', joinedDate: 'Nov 2024', status: 'active' as const, tasksCompleted: 245, avgResponseTime: '2.5h' },
    { id: '2', name: 'Karim Ahmed', email: 'karim@carenet.bd', phone: '+880 1812-345678', joinedDate: 'Oct 2024', status: 'active' as const, tasksCompleted: 189, avgResponseTime: '3.1h' },
    { id: '3', name: 'Nasrin Begum', email: 'nasrin@carenet.bd', phone: '+880 1912-345678', joinedDate: 'Sep 2024', status: 'inactive' as const, tasksCompleted: 156, avgResponseTime: '4.2h' },
  ];

  const filteredModerators = moderators.filter(m => filter === 'all' || m.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'inactive': return { bg: 'rgba(142, 197, 252, 0.2)', text: '#5B9FFF' };
      case 'suspended': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      default: return { bg: 'rgba(255, 255, 255, 0.2)', text: '#848484' };
    }
  };

  return (
    <div className="relative">
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Moderator Management</h1>
          <Button onClick={() => router.push('/admin/moderators/add')} size="sm"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            <Plus className="w-4 h-4 mr-2" />Add Moderator
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'active', 'inactive', 'suspended'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f}
            </button>
          ))}
        </div>

        {filteredModerators.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <UserCog className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No moderators found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredModerators.map((moderator) => {
              const statusStyle = getStatusColor(moderator.status);
              return (
                <div key={moderator.id} className="finance-card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
                      <UserCog className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 style={{ color: '#535353' }}>{moderator.name}</h3>
                        <span className="text-xs px-3 py-1 rounded-full capitalize"
                          style={{ background: statusStyle.bg, color: statusStyle.text }}>
                          {moderator.status}
                        </span>
                      </div>
                      <p className="text-sm mb-1" style={{ color: '#848484' }}>{moderator.email}</p>
                      <p className="text-xs" style={{ color: '#848484' }}>{moderator.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 p-3 rounded-lg"
                    style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#848484' }}>Tasks Completed</p>
                      <p style={{ color: '#535353' }}>{moderator.tasksCompleted}</p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#848484' }}>Avg Response</p>
                      <p style={{ color: '#535353' }}>{moderator.avgResponseTime}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => router.push(`/admin/moderators/${moderator.id}`)} size="sm" variant="outline"
                      className="flex-1 bg-white/50 border-white/50">
                      <Eye className="w-4 h-4 mr-2" />View
                    </Button>
                    <Button onClick={() => router.push(`/admin/moderators/${moderator.id}`)} size="sm" variant="outline"
                      className="flex-1 bg-white/50 border-white/50">
                      <Edit className="w-4 h-4 mr-2" />Edit
                    </Button>
                    {moderator.status === 'active' && (
                      <Button onClick={() => {}} size="sm" variant="outline"
                        className="bg-white/50 border-white/50">
                        <Ban className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
