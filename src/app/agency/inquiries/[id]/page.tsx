'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function InquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [response, setResponse] = useState('');

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
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
          <h1 className="mb-2" style={{ color: '#535353' }}>Inquiry Details</h1>
          <p style={{ color: '#848484' }}>Inquiry ID: {id}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Guardian Request</h3>
          <p style={{ color: '#535353' }}>Package inquiry details would appear here</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Your Response</h3>
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your response..."
            className="bg-white/50 border-white/50 min-h-32"
            style={{ color: '#535353' }}
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex-1 bg-white/50 border-white/50"
            style={{ color: '#FF6B7A' }}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Decline
          </Button>
          <Button
            onClick={() => router.back()}
            disabled={!response}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              color: 'white'
            }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Send Response
          </Button>
        </div>
      </div>
    </div>
    </>

  );
}
