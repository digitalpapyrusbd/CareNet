'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui';

const meds = [
  { id: 'med-1', name: 'Metformin', dosage: '500mg', time: '9:00 AM' },
  { id: 'med-2', name: 'Losartan', dosage: '50mg', time: '9:00 AM' },
  { id: 'med-3', name: 'Calcium', dosage: '250mg', time: '2:00 PM' },
];

export default function CaregiverMedicationLogPage() {
  const [status, setStatus] = useState<Record<string, 'given' | 'skipped' | null>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const toggle = (id: string, value: 'given' | 'skipped') => setStatus((prev) => ({ ...prev, [id]: prev[id] === value ? null : value }));

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-emerald-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-3xl mx-auto finance-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
              <span className="text-xl"></span>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>Care Log</p>
              <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>Medication Checklist</h1>
            </div>
          </div>

          <div className="space-y-4">
            {meds.map((med) => (
              <div key={med.id} className="finance-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold" style={{ color: '#535353' }}>{med.name}</p>
                    <p className="text-sm" style={{ color: '#848484' }}>{med.dosage}  {med.time}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.4)', color: '#535353' }}>Guardian verified</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => toggle(med.id, 'given')}
                    className="w-full"
                    style={{
                      background: status[med.id] === 'given'
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : 'rgba(255,255,255,0.6)',
                      color: status[med.id] === 'given' ? 'white' : '#535353',
                    }}
                  >
                    Given
                  </Button>
                  <Button
                    onClick={() => toggle(med.id, 'skipped')}
                    className="w-full"
                    style={{
                      background: status[med.id] === 'skipped'
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                        : 'rgba(255,255,255,0.6)',
                      color: status[med.id] === 'skipped' ? 'white' : '#535353',
                    }}
                  >
                    Skipped
                  </Button>
                </div>

                {status[med.id] === 'skipped' && (
                  <textarea
                    className="w-full mt-4 rounded-2xl bg-white/60 border border-white/50 px-4 py-3 text-sm"
                    placeholder="Add reason for skipping"
                    value={notes[med.id] ?? ''}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [med.id]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" style={{ color: '#535353' }}>
              Cancel
            </Button>
            <Button className="flex-1" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
              Submit Medication Log
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
