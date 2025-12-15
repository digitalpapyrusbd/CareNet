'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ShopManagerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <UniversalNav userRole="shop-manager" showBack={true} />
      <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950 px-4 py-12 pb-24 md:pt-14">
        <div className="w-full max-w-sm finance-card p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
              <span className="text-2xl"></span>
            </div>
            <h1 className="text-2xl font-semibold" style={{ color: '#535353' }}>Shop Manager Login</h1>
            <p className="text-sm" style={{ color: '#848484' }}>Operations access only</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 bg-white/70 border-white/60" placeholder="manager@shop.com" />
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: '#535353' }}>Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 bg-white/70 border-white/60" placeholder="" />
            </div>
          </div>

          <Button className="w-full mt-6" style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)', color: 'white' }}>
            Sign In
          </Button>

          <p className="text-xs text-center mt-4" style={{ color: '#848484' }}>
            Manager accounts have limited permissions
          </p>
        </div>
      </div>
    </Layout>
    </>

  );
}
