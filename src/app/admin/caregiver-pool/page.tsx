'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter } from 'next/navigation';

import { Users, Search, Star, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function CVPoolManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const caregivers = [
    { id: '1', name: 'Rashida Begum', rating: 4.9, experience: '8 years', skills: ['Senior Care', 'Diabetes Management'], status: 'available', location: 'Dhaka' },
    { id: '2', name: 'Nasrin Akter', rating: 4.8, experience: '6 years', skills: ['Post-Op Care', 'Physiotherapy'], status: 'available', location: 'Chittagong' },
    { id: '3', name: 'Fatima Rahman', rating: 4.7, experience: '5 years', skills: ['Pediatric Care', 'Special Needs'], status: 'assigned', location: 'Dhaka' },
  ];

  const filtered = caregivers.filter(cg => 
    cg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cg.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>Caregiver Pool</h1>
          <p style={{ color: '#848484' }}>Verified caregivers available for agencies</p>
        </div>

        <div className="finance-card p-4 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#848484' }} />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search caregivers..."
                className="pl-10 bg-white/50 border-white/50"
                style={{ color: '#535353' }}
              />
            </div>
            <Button variant="outline" className="bg-white/50 border-white/50">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="finance-card p-4 mb-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl" style={{ color: '#7CE577' }}>{caregivers.filter(c => c.status === 'available').length}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Available</p>
            </div>
            <div>
              <p className="text-2xl" style={{ color: '#FFB3C1' }}>{caregivers.filter(c => c.status === 'assigned').length}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Assigned</p>
            </div>
            <div>
              <p className="text-2xl" style={{ color: '#5B9FFF' }}>{caregivers.length}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Total</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((caregiver) => (
            <div key={caregiver.id} className="finance-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                  }}
                >
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 style={{ color: '#535353' }}>{caregiver.name}</h3>
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3 fill-current" style={{ color: '#FFD54F' }} />
                        <span className="text-sm" style={{ color: '#535353' }}>{caregiver.rating}</span>
                      </div>
                      <p className="text-xs" style={{ color: '#848484' }}>{caregiver.experience} • {caregiver.location}</p>
                    </div>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: caregiver.status === 'available' ? 'rgba(124, 229, 119, 0.2)' : 'rgba(255, 179, 193, 0.2)',
                        color: caregiver.status === 'available' ? '#7CE577' : '#FFB3C1'
                      }}
                    >
                      {caregiver.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {caregiver.skills.map((skill, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => router.push(`/admin/caregivers/${caregiver.id}`)} 
                size="sm" 
                variant="outline"
                className="w-full bg-white/50 border-white/50 min-h-[48px]"
              >
                <Eye className="w-4 h-4 mr-2" />View Full Profile
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
}





