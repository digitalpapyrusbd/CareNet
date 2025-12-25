'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PatientLoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <UniversalNav userRole="patient" showBack={true} />
      <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950 px-4 py-12 pb-24 md:pt-14">
        <div className="w-full max-w-sm finance-card p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <span className="text-2xl"></span>
            </div>
            <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>Patient Login</h1>
            <p className="text-sm" style={{ color: '#848484' }}>Use the credentials shared by your guardian</p>
          </div>

          <label className="text-sm font-medium" style={{ color: '#535353' }}>Phone Number</label>
          <Input className="mt-2 mb-4 bg-white/70 border-white/60" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />

          <label className="text-sm font-medium" style={{ color: '#535353' }}>Password</label>
          <Input type="password" className="mt-2 mb-6 bg-white/70 border-white/60" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" />

          <Button className="w-full" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
            Sign In
          </Button>

          <Link href="/auth/help" className="text-sm block text-center mt-4" style={{ color: '#5B9FFF' }}>
            Need help logging in?
          </Link>
        </div>
      </div>
    </Layout>
    </>

  );
}
