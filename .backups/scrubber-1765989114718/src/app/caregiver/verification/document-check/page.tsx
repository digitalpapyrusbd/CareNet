'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui';

const checklist = [
  {
    id: 'identity',
    title: 'Identity Verification',
    description: 'NID, profile photo, and contact details were cross-checked with the national registry.',
    status: 'verified',
  },
  {
    id: 'address',
    title: 'Address Confirmation',
    description: 'Utility bill and guardian reference confirmed your primary residence.',
    status: 'pending',
  },
  {
    id: 'experience',
    title: 'Experience Proof',
    description: 'Employment history and recommendation letters under manual review.',
    status: 'in-review',
  },
  {
    id: 'medical',
    title: 'Medical Fitness',
    description: 'Medical certificate uploaded. Awaiting doctor confirmation.',
    status: 'pending',
  },
];

const statusMeta = {
  verified: {
    label: 'Verified',
    color: '#7CE577',
    bg: 'rgba(124, 229, 119, 0.15)',
  },
  'in-review': {
    label: 'In Review',
    color: '#FFD180',
    bg: 'rgba(255, 209, 128, 0.15)',
  },
  pending: {
    label: 'Pending',
    color: '#5B9FFF',
    bg: 'rgba(91, 159, 255, 0.15)',
  },
} as const;

export default function CaregiverDocumentCheckPage() {
  const router = useRouter();

  const completedCount = useMemo(
    () => checklist.filter((item) => item.status === 'verified').length,
    [],
  );

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-900 dark:to-gray-950 pb-10 pb-24 md:pt-14">
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <p className="text-sm text-pink-100 uppercase tracking-wide">Step 5</p>
            <h1 className="text-3xl font-bold mt-1">Document Check</h1>
            <p className="text-pink-100 mt-2">
              Our quality team is validating every document you provided. You will be notified if anything else is needed.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div className="finance-card p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm" style={{ color: '#848484' }}>
                Progress
              </p>
              <h2 className="text-2xl font-semibold" style={{ color: '#535353' }}>
                {completedCount} / {checklist.length} sections verified
              </h2>
              <p className="text-sm mt-1" style={{ color: '#848484' }}>
                Typical verification time: 1 business day
              </p>
            </div>
            <div className="flex-1 md:ml-6">
              <div className="w-full h-3 rounded-full bg-white/50">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${(completedCount / checklist.length) * 100}%`,
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {checklist.map((item) => {
              const meta = statusMeta[item.status as keyof typeof statusMeta];
              return (
              <div key={item.id} className="finance-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: '#535353' }}>
                        {item.title}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: '#848484' }}>
                        {item.description}
                      </p>
                    </div>
                    <span
                      className="text-xs px-3 py-1 rounded-full font-medium capitalize"
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="finance-card p-6 space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: '#535353' }}>
              Need to update a document?
            </h3>
            <p className="text-sm" style={{ color: '#848484' }}>
              If you spot an issue or want to upload a newer document, you can restart the verification step and replace
              the files. Our moderators will review the latest submission.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white',
                }}
                onClick={() => router.push('/caregiver/verification/certificates')}
              >
                Replace Documents
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-white/60 border-white/60"
                style={{ color: '#535353' }}
                onClick={() => router.push('/caregiver/messages')}
              >
                Contact Support
              </Button>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm" style={{ color: '#848484' }}>
              Once everything is verified, you will receive a confirmation message and can start accepting jobs.
            </p>
            <Button
              onClick={() => router.push('/caregiver/verification/complete')}
              className="w-full sm:w-auto"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                color: 'white',
              }}
            >
              Continue to Final Approval
            </Button>
          </div>
        </div>
      </div>
    </Layout>
    </>

  );
}


