'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function JobHistoryPage() {
  const router = useRouter();

  const jobHistory = [
    { id: '1', patient: 'Mrs. Fatima Ahmed', dates: 'Nov 1-30, 2024', hours: 240, rating: 5, earnings: 36000 },
    { id: '2', patient: 'Mr. Abdul Rahman', dates: 'Oct 15-31, 2024', hours: 136, rating: 4.8, earnings: 20400 },
    { id: '3', patient: 'Mrs. Amina Khatun', dates: 'Sep 1-30, 2024', hours: 240, rating: 4.9, earnings: 36000 },
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
          <h1 className="mb-2" style={{ color: '#535353' }}>Job History</h1>
          <p style={{ color: '#848484' }}>Your completed care assignments</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl" style={{ color: '#7CE577' }}>{jobHistory.length}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Completed Jobs</p>
            </div>
            <div>
              <p className="text-2xl" style={{ color: '#FFB3C1' }}>{jobHistory.reduce((sum, j) => sum + j.hours, 0)}</p>
              <p className="text-xs" style={{ color: '#848484' }}>Total Hours</p>
            </div>
            <div>
              <p className="text-2xl" style={{ color: '#5B9FFF' }}>4.9</p>
              <p className="text-xs" style={{ color: '#848484' }}>Avg. Rating</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {jobHistory.map((job) => (
            <div key={job.id} className="finance-card p-4">
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)'
                  }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="mb-1" style={{ color: '#535353' }}>{job.patient}</p>
                  <p className="text-sm mb-2" style={{ color: '#848484' }}>
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {job.dates}
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <span style={{ color: '#848484' }}>{job.hours}h</span>
                    <span style={{ color: '#848484' }}>৳{job.earnings.toLocaleString()}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" style={{ color: '#FFD54F' }} />
                      <span style={{ color: '#535353' }}>{job.rating}</span>
                    </div>
                  </div>
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

