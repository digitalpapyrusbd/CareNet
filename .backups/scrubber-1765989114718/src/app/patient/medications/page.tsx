'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';

const schedule = [
  { period: 'Morning', items: [{ name: 'Metformin', dosage: '500mg', time: '9:00 AM', status: 'Taken' }] },
  { period: 'Afternoon', items: [{ name: 'Losartan', dosage: '50mg', time: '2:00 PM', status: 'Due' }] },
  { period: 'Evening', items: [{ name: 'Vitamin D', dosage: '1000 IU', time: '8:00 PM', status: 'Scheduled' }] },
];

const statusColors: Record<string, string> = {
  Taken: '#2E7D32',
  Due: '#B45309',
  Scheduled: '#1D4ED8',
};

export default function PatientMedicationsPage() {
  return (
    <>
      <UniversalNav userRole="patient" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold mb-1" style={{ color: '#535353' }}>Medication Schedule</h1>
          <p className="text-sm mb-6" style={{ color: '#848484' }}>Tap a medication to mark it as taken or add a note.</p>

          <div className="space-y-5">
            {schedule.map((block) => (
              <div key={block.period} className="finance-card p-5 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: '#535353' }}>{block.period}</h2>
                  <span className="text-xs" style={{ color: '#848484' }}>{block.items.length} doses</span>
                </div>
                <div className="space-y-3">
                  {block.items.map((med) => (
                    <div key={med.name} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.8)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold" style={{ color: '#535353' }}>{med.name}</p>
                          <p className="text-xs" style={{ color: '#848484' }}>{med.dosage}  {med.time}</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full" style={{ background: `${statusColors[med.status]}20`, color: statusColors[med.status] }}>{med.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
