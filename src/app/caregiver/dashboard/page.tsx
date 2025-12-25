'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Navigation, CheckCircle2, DollarSign, Bell } from 'lucide-react';
import { UniversalNav } from '@/components/layout/UniversalNav';

const todaysJob = {
  patient: 'Anwar Hossain',
  package: 'Post-Surgery Recovery Care',
  time: '9:00 AM - 5:00 PM',
  location: 'House 12, Road 7, Banani',
  guardian: 'Fahima Rahman',
};

const weeklyStats = [
  { label: 'Hours Worked', value: '32h' },
  { label: 'Jobs', value: '6' },
  { label: 'Rating', value: '4.9' },
];

const upcomingJobs = [
  { id: 'JOB-4522', patient: 'Selina Rahman', date: 'Tomorrow', time: '8:00 PM - 6:00 AM', location: 'Gulshan 1' },
  { id: 'JOB-4523', patient: 'Rahim Uddin', date: 'Thu, Dec 12', time: '10:00 AM - 4:00 PM', location: 'Dhanmondi' },
];

export default function CaregiverDashboardPage() {
  const router = useRouter();

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={false} />
      <div className="min-h-screen pb-24 md:pt-14">
        <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm" style={{ color: '#848484' }}>Tuesday, Dec 10</p>
            <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>Hi, Shaila</h1>
            <p className="text-sm" style={{ color: '#848484' }}>You have 1 job today</p>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
            <Bell className="w-5 h-5" style={{ color: '#535353' }} />
          </button>
        </div>

        {/* Today's Job Card */}
        <div className="finance-card p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#848484' }}>Today&apos;s Visit</p>
              <h2 className="text-xl font-semibold" style={{ color: '#535353' }}>{todaysJob.patient}</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(124,229,119,0.15)', color: '#2E7D32' }}>On Time</span>
          </div>
          <p className="text-sm mb-3" style={{ color: '#848484' }}>{todaysJob.package}</p>
          <div className="space-y-2 text-sm mb-5" style={{ color: '#535353' }}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: '#848484' }} /> {todaysJob.time}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: '#848484' }} /> {todaysJob.location}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => router.push('/caregiver/checkin')}
              className="w-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                boxShadow: '0px 4px 18px rgba(124, 229, 119, 0.35)',
                color: 'white',
                border: 'none'
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Check In
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              <Navigation className="w-4 h-4 mr-2" /> Navigate
            </Button>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {weeklyStats.map((stat) => (
            <div key={stat.label} className="finance-card p-4 text-center">
              <p className="text-xs mb-1" style={{ color: '#848484' }}>{stat.label}</p>
              <p className="text-xl font-semibold" style={{ color: '#535353' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Upcoming Jobs */}
        <div className="finance-card p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#535353' }}>Upcoming Jobs</h3>
            <Link href="/caregiver/jobs" className="text-sm hover:underline" style={{ color: '#7CE577' }}>View All</Link>
          </div>
          <div className="space-y-3">
            {upcomingJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium" style={{ color: '#535353' }}>{job.patient}</p>
                  <span className="text-xs" style={{ color: '#848484' }}>{job.date}</span>
                </div>
                <p className="text-sm mb-1" style={{ color: '#848484' }}>{job.time}</p>
                <div className="flex items-center gap-1 text-xs" style={{ color: '#535353' }}>
                  <MapPin className="w-3 h-3" style={{ color: '#848484' }} /> {job.location}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Earnings */}
        <div className="finance-card p-5 mb-16 flex items-center justify-between">
          <div>
            <p className="text-xs mb-1" style={{ color: '#848484' }}>Pending Earnings</p>
            <p className="text-2xl font-semibold" style={{ color: '#535353' }}>৳8,900</p>
          </div>
          <Button
            onClick={() => router.push('/caregiver/earnings')}
            variant="outline"
            className="bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            <DollarSign className="w-4 h-4 mr-2" /> View
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
