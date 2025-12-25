'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';

import { useRouter } from 'next/navigation';
import { Brain, CheckCircle, XCircle, Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function VerificationPsychTestPage() {
  const router = useRouter();
  const [status] = useState<'not_started' | 'in_progress' | 'completed' | 'passed' | 'failed'>('not_started');
  const estimatedTime = 30;

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>Step 4: Psychological Assessment</h1>
          <p style={{ color: '#848484' }}>Complete the psychological fitness evaluation</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>Psychological Fitness Test</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Online assessment</p>
            </div>
          </div>

          <div className="p-4 rounded-lg mb-4" style={{ background: 'rgba(184, 167, 255, 0.1)' }}>
            <p className="text-sm mb-2" style={{ color: '#535353' }}>What to Expect:</p>
            <ul className="space-y-1 text-sm" style={{ color: '#848484' }}>
              <li>• Stress management scenarios</li>
              <li>• Emotional intelligence questions</li>
              <li>• Patient interaction assessments</li>
              <li>• Decision-making evaluations</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(142, 197, 252, 0.1)' }}>
              <Clock className="w-6 h-6 mx-auto mb-2" style={{ color: '#5B9FFF' }} />
              <p className="text-sm" style={{ color: '#535353' }}>{estimatedTime} minutes</p>
              <p className="text-xs" style={{ color: '#848484' }}>Estimated time</p>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(168, 224, 99, 0.1)' }}>
              <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: '#7CE577' }} />
              <p className="text-sm" style={{ color: '#535353' }}>Multiple choice</p>
              <p className="text-xs" style={{ color: '#848484' }}>Question format</p>
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 179, 193, 0.1)' }}>
            <p className="text-sm mb-2" style={{ color: '#535353' }}>Important Notes:</p>
            <ul className="space-y-1 text-sm" style={{ color: '#848484' }}>
              <li>• Answer honestly - there are no "wrong" answers</li>
              <li>• Complete in one sitting</li>
              <li>• Find a quiet environment</li>
              <li>• Results reviewed by moderator</li>
            </ul>
          </div>
        </div>

        {status === 'not_started' && (
          <Button onClick={() => router.push('/caregiver/pending-verification')} className="w-full"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            <Play className="w-4 h-4 mr-2" />Start Assessment
          </Button>
        )}
      </div>
    </div>
    </>

  );
}

