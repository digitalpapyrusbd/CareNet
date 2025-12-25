'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui';

const summary = {
  patient: 'Anwar Hossain',
  checkInTime: '08:57 AM',
  locationVerified: true,
  photoCaptured: true,
};

export default function CaregiverCheckInConfirmationPage() {
  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-900 dark:to-emerald-950 px-4 py-10 pb-24 md:pt-14">
        <div className="w-full max-w-md finance-card p-8 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
            <span className="text-3xl"></span>
          </div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#535353' }}>Check-In Complete</h1>
          <p className="text-sm mb-6" style={{ color: '#848484' }}>
            Great! The guardian and CareNet moderators can now see that you\'re on site.
          </p>

          <div className="finance-card p-5 mb-6 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: '#848484' }}>Patient</span>
              <span className="font-medium" style={{ color: '#535353' }}>{summary.patient}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: '#848484' }}>Check-In Time</span>
              <span className="font-semibold" style={{ color: '#535353' }}>{summary.checkInTime}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: '#848484' }}>Location</span>
              <span className="text-emerald-600 font-medium">{summary.locationVerified ? 'Verified' : 'Override'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#848484' }}>Photo</span>
              <span className="text-emerald-600 font-medium">{summary.photoCaptured ? 'Captured' : 'Missing'}</span>
            </div>
          </div>

          <Button className="w-full" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
            Start Care Session
          </Button>
        </div>
      </div>
    </Layout>
    </>

  );
}
