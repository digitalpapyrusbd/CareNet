'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';

const activities = ['Range of motion', 'Light walk', 'Breathing exercise', 'Meal prep assistance'];

export default function CaregiverActivityLogPage() {
  const [type, setType] = useState('Range of motion');
  const [duration, setDuration] = useState('20 minutes');
  const [notes, setNotes] = useState('Patient completed seated stretches without discomfort.');

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-900 dark:to-sky-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-2xl mx-auto finance-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <span className="text-xl"></span>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>Care Log</p>
              <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>Activity Entry</h1>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: '#535353' }}>Activity Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-2xl border bg-white/70 px-4 py-3"
                style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#535353' }}
              >
                {activities.map((activity) => (
                  <option key={activity}>{activity}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: '#535353' }}>Duration</label>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-2xl border bg-white/70 px-4 py-3"
                style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#535353' }}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: '#535353' }}>Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white/70 border-white/60 min-h-[140px]"
                placeholder="Describe how the patient responded..."
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" style={{ color: '#535353' }}>
              Cancel
            </Button>
            <Button className="flex-1" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
              Save Activity
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
