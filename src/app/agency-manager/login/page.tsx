'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { AgencyManagerLogin } from '@/components/agency/AgencyManagerLogin';

export default function AgencyManagerLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  const handleLogin = async (_credentials: { email: string; password: string }) => {
    setStatus('Signing in...');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus(null);
    router.push('/agency-manager/qa');
  };

  return (
    <>
      <UniversalNav userRole="agency-manager" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 pb-10 pb-24 md:pt-14">
        {status && (
          <div className="max-w-2xl mx-auto px-4 pt-6">
            <div className="finance-card p-4 text-sm text-center" style={{ color: '#535353' }}>
              {status}
            </div>
          </div>
        )}
        <AgencyManagerLogin onLogin={handleLogin} />
      </div>
    </Layout>
    </>

  );
}


