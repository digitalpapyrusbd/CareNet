'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Pill, Plus, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function MedicationLogsPage() {
  const router = useRouter();
  const [medications, setMedications] = useState([
    { id: '1', name: 'Metformin 500mg', time: '8:00 AM', administered: true, note: '' },
    { id: '2', name: 'Amlodipine 5mg', time: '2:00 PM', administered: false, note: '' },
  ]);

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
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
          <h1 className="mb-2" style={{ color: '#535353' }}>Medication Log</h1>
          <p style={{ color: '#848484' }}>Mrs. Fatima Ahmed - Today</p>
        </div>

        <div className="space-y-3">
          {medications.map((med) => (
            <div key={med.id} className="finance-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: med.administered
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  }}
                >
                  {med.administered ? <Check className="w-5 h-5 text-white" /> : <Pill className="w-5 h-5 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="mb-1" style={{ color: '#535353' }}>{med.name}</p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#848484' }}>
                    <Clock className="w-3 h-3" />
                    <span>{med.time}</span>
                  </div>
                </div>
              </div>

              {!med.administered && (
                <Button
                  onClick={() => {
                    setMedications(medications.map(m => 
                      m.id === med.id ? { ...m, administered: true } : m
                    ));
                  }}
                  className="w-full"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                    color: 'white'
                  }}
                >
                  Mark as Administered
                </Button>
              )}

              {med.administered && (
                <div className="p-3 rounded-lg" style={{ background: 'rgba(124, 229, 119, 0.1)' }}>
                  <p className="text-sm flex items-center gap-2" style={{ color: '#7CE577' }}>
                    <Check className="w-4 h-4" />
                    Administered successfully
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={() => router.push('/caregiver/dashboard')}
          variant="outline"
          className="w-full mt-6 bg-white/50 border-white/50"
          style={{ color: '#535353' }}
        >
          Done
        </Button>
      </div>
    </div>
    </>

  );
}

