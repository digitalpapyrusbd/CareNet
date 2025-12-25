'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';

export default function CaregiverVitalsLogPage() {
  const [form, setForm] = useState({
    systolic: '128',
    diastolic: '82',
    heartRate: '76',
    temp: '98.4',
    oxygen: '98',
    glucose: '108',
  });

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-rose-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-3xl mx-auto finance-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
              <span className="text-xl"></span>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>Care Log</p>
              <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>Vitals  Anwar Hossain</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Systolic BP (mmHg)', key: 'systolic', placeholder: '120' },
              { label: 'Diastolic BP (mmHg)', key: 'diastolic', placeholder: '80' },
              { label: 'Heart Rate (bpm)', key: 'heartRate', placeholder: '72' },
              { label: 'Temperature (F)', key: 'temp', placeholder: '98.6' },
              { label: 'Oxygen Saturation (%)', key: 'oxygen', placeholder: '98' },
              { label: 'Blood Glucose (mg/dL)', key: 'glucose', placeholder: '110' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-sm font-medium" style={{ color: '#535353' }}>{label}</label>
                <Input
                  type="number"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => update(key as keyof typeof form, e.target.value)}
                  placeholder={placeholder}
                  className="mt-2 bg-white/70 border-white/60"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" style={{ color: '#535353' }}>
              Cancel
            </Button>
            <Button className="flex-1" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
              Save Vitals
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
