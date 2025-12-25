'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';

const info = [
  { label: 'Full Name', value: 'Anwar Hossain' },
  { label: 'Date of Birth', value: '18 July 1952' },
  { label: 'Blood Group', value: 'B+' },
  { label: 'Conditions', value: 'Type 2 Diabetes, Hypertension' },
  { label: 'Allergies', value: 'Penicillin' },
  { label: 'Emergency Contact', value: 'Fahima Rahman (+880 1711-889900)' },
];

export default function PatientProfilePage() {
  return (
    <>
      <UniversalNav userRole="patient" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 px-4 py-8 pb-24 md:pt-14">
        <div className="max-w-2xl mx-auto finance-card p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-white/70 flex items-center justify-center text-4xl"></div>
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>Patient Profile</p>
              <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>Managed by Guardian</h1>
              <p className="text-sm" style={{ color: '#848484' }}>Read-only view. Contact your guardian for updates.</p>
            </div>
          </div>

          <div className="space-y-4">
            {info.map((item) => (
              <div key={item.label} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.7)' }}>
                <p className="text-xs uppercase tracking-wide" style={{ color: '#848484' }}>{item.label}</p>
                <p className="text-lg font-semibold" style={{ color: '#535353' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
