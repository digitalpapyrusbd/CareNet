'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { Calendar } from 'lucide-react';

const appointments = [
  { id: 1, title: 'Physio Session', date: 'Wed, Dec 11', time: '10:00 AM', location: 'CareNet Rehab Center' },
  { id: 2, title: 'Diabetes Checkup', date: 'Fri, Dec 13', time: '12:30 PM', location: 'Popular Diagnostic, Dhanmondi' },
  { id: 3, title: 'Caregiver Shift', date: 'Daily', time: '9:00 AM - 5:00 PM', location: 'Home' },
];

export default function PatientAppointmentsPage() {
  return (
    <>
      <UniversalNav userRole="patient" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8" style={{ color: '#8B5CF6' }} />
            <div>
              <h1 className="text-3xl font-semibold" style={{ color: '#535353' }}>Upcoming Schedule</h1>
              <p className="text-sm" style={{ color: '#848484' }}>Doctor visits, therapy, and caregiver shifts</p>
            </div>
          </div>

          <div className="space-y-3">
            {appointments.map((item) => (
              <div key={item.id} className="finance-card p-4 rounded-3xl">
                <p className="text-xs uppercase tracking-wide" style={{ color: '#848484' }}>{item.date}</p>
                <p className="text-lg font-semibold" style={{ color: '#535353' }}>{item.title}</p>
                <p className="text-sm" style={{ color: '#848484' }}>{item.time}</p>
                <p className="text-sm" style={{ color: '#535353' }}>{item.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
