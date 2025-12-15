'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubmissionReviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>Review Submission</h1>
          <p style={{ color: '#848484' }}>Submission ID: {id}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
            }}
          >
            <FileText className="w-6 h-6 text-white" />
          </div>
          <p style={{ color: '#535353' }}>Moderator submission details for {id}</p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex-1 bg-white/50 border-white/50"
            style={{ color: '#FF6B7A' }}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button
            onClick={() => router.back()}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              color: 'white'
            }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </div>
      </div>
    </div>
    </>

  );
}
