'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, UserPlus, User, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AssignCaregiverPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [selected, setSelected] = useState('');

  const caregivers = [
    { id: '1', name: 'Rashida Begum', rating: 4.9, availability: 'Available', match: 95 },
    { id: '2', name: 'Nasrin Akter', rating: 4.8, availability: 'Available', match: 88 },
  ];

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>Assign Caregiver</h1>
          <p style={{ color: '#848484' }}>Job ID: {id}</p>
        </div>

        <div className="space-y-3 mb-6">
          {caregivers.map((cg) => (
            <button
              key={cg.id}
              onClick={() => setSelected(cg.id)}
              className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
              style={{
                borderLeft: selected === cg.id ? '4px solid #A8E063' : 'none'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 style={{ color: '#535353' }}>{cg.name}</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 fill-current" style={{ color: '#FFD54F' }} />
                    <span className="text-sm" style={{ color: '#535353' }}>{cg.rating}</span>
                    <span className="text-xs" style={{ color: '#7CE577' }}>• {cg.match}% match</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={() => router.back()}
          disabled={!selected}
          className="w-full"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
            color: 'white',
            opacity: !selected ? 0.5 : 1
          }}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Assign Caregiver
        </Button>
      </div>
    </div>
    </>

  );
}
