'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function UpdateAvailabilityPage() {
  const router = useRouter();
  const [availability, setAvailability] = useState({
    monday: { available: true, start: '08:00', end: '20:00' },
    tuesday: { available: true, start: '08:00', end: '20:00' },
    wednesday: { available: true, start: '08:00', end: '20:00' },
    thursday: { available: true, start: '08:00', end: '20:00' },
    friday: { available: true, start: '08:00', end: '20:00' },
    saturday: { available: false, start: '', end: '' },
    sunday: { available: false, start: '', end: '' },
  });

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

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
          <h1 className="mb-2" style={{ color: '#535353' }}>Update Availability</h1>
          <p style={{ color: '#848484' }}>Set your weekly availability schedule</p>
        </div>

        <div className="space-y-3 mb-6">
          {days.map((day) => {
            const dayAvail = availability[day.key as keyof typeof availability];
            return (
              <div key={day.key} className="finance-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <p style={{ color: '#535353' }}>{day.label}</p>
                  <button
                    onClick={() => setAvailability({
                      ...availability,
                      [day.key]: { ...dayAvail, available: !dayAvail.available }
                    })}
                    className="px-4 py-2 rounded-lg text-sm"
                    style={{
                      background: dayAvail.available
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : 'rgba(255, 255, 255, 0.5)',
                      color: dayAvail.available ? 'white' : '#535353'
                    }}
                  >
                    {dayAvail.available ? 'Available' : 'Unavailable'}
                  </button>
                </div>

                {dayAvail.available && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: '#848484' }}>Start Time</label>
                      <input
                        type="time"
                        value={dayAvail.start}
                        onChange={(e) => setAvailability({
                          ...availability,
                          [day.key]: { ...dayAvail, start: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/50 text-sm"
                        style={{ color: '#535353' }}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: '#848484' }}>End Time</label>
                      <input
                        type="time"
                        value={dayAvail.end}
                        onChange={(e) => setAvailability({
                          ...availability,
                          [day.key]: { ...dayAvail, end: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/50 text-sm"
                        style={{ color: '#535353' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Button
          onClick={() => router.back()}
          className="w-full"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
            color: 'white'
          }}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Availability
        </Button>
      </div>
    </div>
    </>

  );
}

