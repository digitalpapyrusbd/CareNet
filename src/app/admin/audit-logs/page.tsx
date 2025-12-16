'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { FileText, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'moderator' | 'agency' | 'caregiver' | 'guardian'>('all');

  const logs = [
    { id: '1', timestamp: '2 min ago', user: 'Admin Karim', userRole: 'admin', action: 'approved verification', entity: 'Caregiver', entityId: 'CG-1234', details: 'Verification approved for Rashida Begum', ipAddress: '103.92.123.45' },
    { id: '2', timestamp: '15 min ago', user: 'Moderator Afsana', userRole: 'moderator', action: 'resolved dispute', entity: 'Dispute', entityId: 'D-5678', details: 'Dispute case closed with resolution', ipAddress: '103.92.123.46' },
    { id: '3', timestamp: '1 hour ago', user: 'Agency SafeHands', userRole: 'agency', action: 'created package', entity: 'Package', entityId: 'PKG-9012', details: 'New senior care package created', ipAddress: '103.92.123.47' },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.entity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || log.userRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getActionColor = (action: string) => {
    if (action.includes('create') || action.includes('approve')) return '#7CE577';
    if (action.includes('delete') || action.includes('reject')) return '#FF6B7A';
    if (action.includes('update') || action.includes('edit')) return '#5B9FFF';
    return '#848484';
  };

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ color: '#535353' }}>Audit Logs</h1>
          <Button onClick={() => {}} size="sm" variant="outline" className="bg-white/50 border-white/50">
            <Download className="w-4 h-4 mr-2" />Export
          </Button>
        </div>

        <div className="finance-card p-4 mb-6">
          <div className="flex gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search logs..."
                className="pl-10 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {['all', 'admin', 'moderator', 'agency', 'caregiver', 'guardian'].map((role) => (
              <button key={role} onClick={() => setRoleFilter(role as unknown)}
                className="px-3 py-1 rounded-lg capitalize text-xs whitespace-nowrap" style={{
                  background: roleFilter === role ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                  color: roleFilter === role ? 'white' : '#535353'
                }}>
                {role}
              </button>
            ))}
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No logs found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div key={log.id} className="finance-card p-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ background: getActionColor(log.action) }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate" style={{ color: '#535353' }}>
                          <strong>{log.user}</strong> ({log.userRole}) - {log.action}
                        </p>
                        <p className="text-xs truncate" style={{ color: '#848484' }}>
                          {log.entity} #{log.entityId}
                        </p>
                      </div>
                      <span className="text-xs whitespace-nowrap" style={{ color: '#848484' }}>
                        {log.timestamp}
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-xs" style={{ color: '#848484' }}>{log.details}</p>
                    )}
                    <p className="text-xs mt-1" style={{ color: '#848484' }}>IP: {log.ipAddress}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>

  );
}
