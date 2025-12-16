'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { Lock, Unlock, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function LockedAccountsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const lockedAccounts = [
    { id: '1', name: 'Fahima Ahmed', type: 'Guardian', reason: 'Overdue payment (12 days)', amount: 15000, lockedDate: 'Dec 1, 2024' },
    { id: '2', name: 'SafeHands Agency', type: 'Agency', reason: 'Overdue payment (8 days)', amount: 45000, lockedDate: 'Dec 3, 2024' },
    { id: '3', name: 'Medical Supplies BD', type: 'Shop', reason: 'Overdue payment (15 days)', amount: 28000, lockedDate: 'Nov 28, 2024' },
  ];

  const filtered = lockedAccounts.filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>Locked Accounts</h1>
          <p style={{ color: '#848484' }}>Accounts restricted due to payment issues</p>
        </div>

        <div className="finance-card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search accounts..."
              className="pl-10 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>
        </div>

        <div className="finance-card p-4 mb-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl" style={{ color: '#FF6B7A' }}>{lockedAccounts.length}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Locked</p>
            </div>
            <div>
              <p className="text-2xl" style={{ color: '#FFD180' }}>৳{lockedAccounts.reduce((sum, acc) => sum + acc.amount, 0).toLocaleString()}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Outstanding</p>
            </div>
            <div>
              <p className="text-2xl" style={{ color: '#5B9FFF' }}>8</p>
              <p className="text-xs" style={{ color: '#848484' }}>Avg Days</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((account) => (
            <div key={account.id} className="finance-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF4757 100%)'
                  }}
                >
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 style={{ color: '#535353' }}>{account.name}</h3>
                  <p className="text-sm mb-1" style={{ color: '#848484' }}>{account.type}</p>
                  <p className="text-xs" style={{ color: '#FF6B7A' }}>{account.reason}</p>
                </div>
              </div>

              <div className="finance-card p-3 mb-3">
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#848484' }}>Outstanding:</span>
                  <span style={{ color: '#FF6B7A' }}>৳{account.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span style={{ color: '#848484' }}>Locked Since:</span>
                  <span style={{ color: '#848484' }}>{account.lockedDate}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => {}} size="sm" variant="outline"
                  className="flex-1 bg-white/50 border-white/50">
                  <Eye className="w-4 h-4 mr-2" />View Details
                </Button>
                <Button onClick={() => {}} size="sm"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                  <Unlock className="w-4 h-4 mr-2" />Manual Unlock
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
}
