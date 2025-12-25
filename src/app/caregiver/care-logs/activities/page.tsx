'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Activity as ActivityIcon, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function ActivitiesLogPage() {
  const router = useRouter();
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');

  const recentActivities = [
    { id: '1', activity: 'Assisted with afternoon walk', duration: '15 minutes', time: '3:00 PM' },
    { id: '2', activity: 'Meal assistance - lunch', duration: '30 minutes', time: '1:00 PM' },
    { id: '3', activity: 'Light exercises', duration: '20 minutes', time: '10:00 AM' },
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
          <h1 className="mb-2" style={{ color: '#535353' }}>Activity Log</h1>
          <p style={{ color: '#848484' }}>Mrs. Fatima Ahmed - Today</p>
        </div>

        {/* Log New Activity */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Log New Activity</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="activity" style={{ color: '#535353' }}>Activity Description *</Label>
              <Textarea
                id="activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="E.g., Assisted with afternoon walk, helped with meal, etc."
                className="mt-2 bg-white/50 border-white/50 min-h-24"
                style={{ color: '#535353' }}
              />
            </div>

            <div>
              <Label htmlFor="duration" style={{ color: '#535353' }}>Duration</Label>
              <input
                id="duration"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="E.g., 15 minutes"
                className="w-full mt-2 px-3 py-2 rounded-lg bg-white/50 border border-white/50"
                style={{ color: '#535353' }}
              />
            </div>

            <Button
              onClick={() => {
                setActivity('');
                setDuration('');
              }}
              disabled={!activity}
              className="w-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                color: 'white',
                opacity: !activity ? 0.5 : 1
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Activity
            </Button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map((item) => (
              <div key={item.id} className="finance-card p-4">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                    }}
                  >
                    <ActivityIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1" style={{ color: '#535353' }}>{item.activity}</p>
                    <p className="text-sm" style={{ color: '#848484' }}>
                      {item.duration} • {item.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => router.push('/caregiver/dashboard')}
          variant="outline"
          className="w-full bg-white/50 border-white/50"
          style={{ color: '#535353' }}
        >
          Done
        </Button>
      </div>
    </div>
    </>

  );
}

