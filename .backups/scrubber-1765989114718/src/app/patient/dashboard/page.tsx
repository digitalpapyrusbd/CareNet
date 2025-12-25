'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Pill, Activity, PhoneCall } from 'lucide-react';

const meds = [
  { id: 1, name: 'Metformin', time: '9:00 AM', status: 'Due' },
  { id: 2, name: 'Losartan', time: '9:00 AM', status: 'Taken' },
  { id: 3, name: 'Vitamin D', time: '8:00 PM', status: 'Scheduled' },
];

export default function PatientDashboardPage() {
  return (
    <>
      <UniversalNav userRole="patient" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 pb-24 pb-24 md:pt-14">
        <div className="px-5 pt-6">
          <p className="text-sm" style={{ color: '#848484' }}>Tuesday, Dec 10</p>
          <h1 className="text-3xl font-semibold" style={{ color: '#535353' }}>Hello, Anwar</h1>
          <p className="text-sm" style={{ color: '#848484' }}>Your caregiver arrives at 9:00 AM</p>
        </div>

        <div className="px-5 mt-5">
          <div className="finance-card p-5 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center text-2xl"></div>
              <div>
                <p className="text-xs" style={{ color: '#848484' }}>Today&apos;s Caregiver</p>
                <h2 className="text-xl font-semibold" style={{ color: '#535353' }}>Shaila Khatun</h2>
                <p className="text-sm" style={{ color: '#848484' }}>4.9  Caring & punctual</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <Link href="/patient/chat">
                <Button className="w-full" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
                  Chat
                </Button>
              </Link>
              <Button variant="outline" className="w-full bg-white/60 border-white/60" style={{ color: '#535353' }}>
                <PhoneCall className="w-4 h-4 mr-2" /> Call Guardian
              </Button>
            </div>
          </div>
        </div>

        <div className="px-5 mt-5">
          <div className="finance-card p-5 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#535353' }}>Today&apos;s Medications</h3>
              <Link href="/patient/medications" className="text-sm" style={{ color: '#5B9FFF' }}>View All</Link>
            </div>
            <div className="space-y-3">
              {meds.map((med) => (
                <div key={med.id} className="flex items-center justify-between p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <div>
                    <p className="font-medium" style={{ color: '#535353' }}>{med.name}</p>
                    <p className="text-xs" style={{ color: '#848484' }}>{med.time}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: med.status === 'Taken' ? 'rgba(124,229,119,0.2)' : 'rgba(255,183,77,0.2)', color: med.status === 'Taken' ? '#2E7D32' : '#B45309' }}>{med.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 mt-5 grid grid-cols-2 gap-3">
          <Link href="/patient/care-logs">
            <div className="finance-card p-4 rounded-3xl text-center">
              <Activity className="w-5 h-5 mx-auto mb-2" style={{ color: '#5B9FFF' }} />
              <p className="text-sm font-semibold" style={{ color: '#535353' }}>Care Logs</p>
            </div>
          </Link>
          <Link href="/patient/appointments">
            <div className="finance-card p-4 rounded-3xl text-center">
              <Calendar className="w-5 h-5 mx-auto mb-2" style={{ color: '#7CE577' }} />
              <p className="text-sm font-semibold" style={{ color: '#535353' }}>Appointments</p>
            </div>
          </Link>
        </div>

        <div className="px-5 mt-5 mb-16">
          <div className="finance-card p-5 rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ color: '#848484' }}>Next reminder</p>
                <p className="text-lg font-semibold" style={{ color: '#535353' }}>Vitamin D at 8:00 PM</p>
              </div>
              <Link href="/patient/medication-reminder" className="text-sm" style={{ color: '#5B9FFF' }}>Details</Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
