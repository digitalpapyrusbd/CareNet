'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CaregiverRegistrationStepSixPage() {
  const router = useRouter();
  const [availability, setAvailability] = useState<Record<string, { enabled: boolean; start: string; end: string }>>(
    () => Object.fromEntries(days.map((day) => [day, { enabled: day !== 'Sunday', start: '09:00', end: '18:00' }]))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDay = (day: string) => {
    setAvailability((prev) => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
  };

  const updateTime = (day: string, key: 'start' | 'end', value: string) => {
    setAvailability((prev) => ({ ...prev, [day]: { ...prev[day], [key]: value } }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    router.push('/caregiver/pending-verification');
  };

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-gray-900 dark:to-cyan-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-3xl mx-auto finance-card p-8">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>Step 6 of 6</p>
          <h1 className="text-2xl font-semibold mb-4" style={{ color: '#535353' }}>Weekly Availability</h1>
          <p className="text-sm mb-6" style={{ color: '#848484' }}>
            Toggle the days you can work and set your preferred time range. You can edit this later from the app.
          </p>

          <div className="space-y-3">
            {days.map((day) => (
              <div key={day} className="finance-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: '#535353' }}>{day}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>{availability[day].enabled ? 'Available' : 'Not available'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" checked={availability[day].enabled} onChange={() => toggleDay(day)} />
                    <span className={`w-10 h-5 rounded-full transition ${availability[day].enabled ? 'bg-emerald-400' : 'bg-gray-300'}`}></span>
                  </label>
                  <input
                    type="time"
                    disabled={!availability[day].enabled}
                    value={availability[day].start}
                    onChange={(e) => updateTime(day, 'start', e.target.value)}
                    className="rounded-xl border bg-white/60 px-3 py-2 text-sm"
                  />
                  <span style={{ color: '#848484' }}>to</span>
                  <input
                    type="time"
                    disabled={!availability[day].enabled}
                    value={availability[day].end}
                    onChange={(e) => updateTime(day, 'end', e.target.value)}
                    className="rounded-xl border bg-white/60 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" onClick={() => router.back()} style={{ color: '#535353' }}>
              Back
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting} style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #5B9FFF 0%, #3768FF 100%)', color: 'white' }}>
              {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
