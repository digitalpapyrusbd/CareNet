'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PatientSchedulePage() {
  const router = useRouter();

  const schedule = [
    { time: '8:00 AM', activity: 'Morning Medications', caregiver: 'Rashida Begum', completed: true },
    { time: '9:00 AM', activity: 'Breakfast', caregiver: 'Rashida Begum', completed: true },
    { time: '10:00 AM', activity: 'Light Exercise', caregiver: 'Rashida Begum', completed: true },
    { time: '12:00 PM', activity: 'Lunch', caregiver: 'Rashida Begum', completed: false },
    { time: '2:00 PM', activity: 'Afternoon Medications', caregiver: 'Rashida Begum', completed: false },
    { time: '6:00 PM', activity: 'Dinner', caregiver: 'Rashida Begum', completed: false },
    { time: '9:00 PM', activity: 'Evening Medications', caregiver: 'Rashida Begum', completed: false },
  ];

  return (
    <>
      <UniversalNav userRole="patient" showBack={true} />
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
          <h1 className="mb-2" style={{ color: '#535353' }}>Today's Schedule</h1>
          <p style={{ color: '#848484' }}>Your daily care activities</p>
        </div>

        <div className="space-y-3">
          {schedule.map((item, idx) => (
            <div key={idx} className="finance-card p-4">
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: item.completed
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  }}
                >
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="mb-1" style={{ color: '#535353' }}>{item.activity}</p>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    {item.time} • {item.caregiver}
                  </p>
                  {item.completed && (
                    <p className="text-xs mt-1" style={{ color: '#7CE577' }}>✓ Completed</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
}

