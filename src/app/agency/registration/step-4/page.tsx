'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle } from 'lucide-react';

export default function AgencyRegistrationStep4Page() {
  const router = useRouter();
  const [uploads, setUploads] = useState({ tradeLicense: false, tin: false, logo: false });

  const canContinue = uploads.tradeLicense;

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-950 px-4 py-10 pb-24 md:pt-14">
        <div className="max-w-2xl mx-auto finance-card p-8">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>Step 4 of 5</p>
          <h1 className="text-2xl font-semibold mb-4" style={{ color: '#535353' }}>Upload Documents</h1>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#535353' }}>Trade License * (Required)</label>
              <div className="p-6 rounded-2xl border-2 border-dashed text-center" style={{ borderColor: uploads.tradeLicense ? '#7CE577' : 'rgba(255,255,255,0.5)', background: uploads.tradeLicense ? 'rgba(124,229,119,0.1)' : 'rgba(255,255,255,0.3)' }}>
                {uploads.tradeLicense ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
                    <span style={{ color: '#2E7D32' }}>Uploaded </span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#848484' }} />
                    <input type="file" accept=".pdf,image/*" className="hidden" id="license" onChange={() => setUploads({ ...uploads, tradeLicense: true })} />
                    <label htmlFor="license">
                      <Button type="button" variant="outline" className="bg-white/50 border-white/50">Select File</Button>
                    </label>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#535353' }}>TIN Certificate (Optional)</label>
              <div className="p-6 rounded-2xl border-2 border-dashed text-center" style={{ borderColor: uploads.tin ? '#7CE577' : 'rgba(255,255,255,0.5)', background: uploads.tin ? 'rgba(124,229,119,0.1)' : 'rgba(255,255,255,0.3)' }}>
                {uploads.tin ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
                    <span style={{ color: '#2E7D32' }}>Uploaded </span>
                  </div>
                ) : (
                  <>
                    <input type="file" accept=".pdf,image/*" className="hidden" id="tin" onChange={() => setUploads({ ...uploads, tin: true })} />
                    <label htmlFor="tin">
                      <Button type="button" variant="outline" className="bg-white/50 border-white/50">Select File</Button>
                    </label>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#535353' }}>Company Logo (Optional)</label>
              <div className="p-6 rounded-2xl border-2 border-dashed text-center" style={{ borderColor: uploads.logo ? '#7CE577' : 'rgba(255,255,255,0.5)', background: uploads.logo ? 'rgba(124,229,119,0.1)' : 'rgba(255,255,255,0.3)' }}>
                {uploads.logo ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
                    <span style={{ color: '#2E7D32' }}>Uploaded </span>
                  </div>
                ) : (
                  <>
                    <input type="file" accept="image/*" className="hidden" id="logo" onChange={() => setUploads({ ...uploads, logo: true })} />
                    <label htmlFor="logo">
                      <Button type="button" variant="outline" className="bg-white/50 border-white/50">Select Image</Button>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl" style={{ background: 'rgba(255,179,193,0.1)' }}>
            <p className="text-xs" style={{ color: '#535353' }}>Progress: 80% complete</p>
            <div className="mt-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <div className="h-full rounded-full" style={{ width: '80%', background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }} />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1 bg-white/60 border-white/60" onClick={() => router.back()} style={{ color: '#535353' }}>Back</Button>
            <Button className="flex-1" disabled={!canContinue} onClick={() => router.push('/agency/registration/step-5')} style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)', color: 'white', opacity: canContinue ? 1 : 0.5 }}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}
