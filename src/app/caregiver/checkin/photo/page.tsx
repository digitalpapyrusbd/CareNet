'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui';

export default function CaregiverCheckInPhotoPage() {
  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 px-4 py-10 pb-24 md:pt-14">
        <div className="w-full max-w-md text-center finance-card p-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
            <span className="text-3xl"></span>
          </div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#535353' }}>Capture Arrival Photo</h1>
          <p className="text-sm mb-6" style={{ color: '#848484' }}>
            Take a quick selfie or location photo so the guardian knows you arrived at Anwar Hossain\'s home.
          </p>

          <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer"
            style={{ borderColor: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.35)' }}>
            <span className="text-lg font-medium" style={{ color: '#535353' }}>Tap to capture</span>
            <span className="text-xs" style={{ color: '#848484' }}>JPEG/PNG up to 5MB</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" />
          </label>

          <div className="mt-6 space-y-3">
            <Button className="w-full" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
              Upload Photo
            </Button>
            <Button variant="outline" className="w-full bg-white/50 border-white/50" style={{ color: '#535353' }}>
              Skip (Not Recommended)
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
