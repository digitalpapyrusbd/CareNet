import { useState } from 'react';
import { ArrowLeft, Brain, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface VerificationPsychTestProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function VerificationPsychTest({ onNavigate, onBack }: VerificationPsychTestProps) {
  const [status] = useState<'ready' | 'in-progress' | 'completed'>('ready');

  const handleStart = () => {
    onNavigate?.('caregiver-pending-verification');
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onBack?.()}
          className="mb-6 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
              boxShadow: '0px 4px 18px rgba(240, 161, 180, 0.4)'
            }}
          >
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Psychological Assessment</h1>
          <p style={{ color: '#848484' }}>Evaluate Your Suitability</p>
        </div>
      </div>

      {status === 'completed' && (
        <div className="finance-card p-5 mb-6" style={{ background: 'rgba(124, 229, 119, 0.1)' }}>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6" style={{ color: '#7CE577' }} />
            <div>
              <p style={{ color: '#535353' }}>Assessment completed</p>
              <p className="text-sm" style={{ color: '#848484' }}>Results under review (24-48 hours)</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1">
        <div className="finance-card p-5 mb-6">
          <h2 className="mb-3" style={{ color: '#535353' }}>About This Assessment</h2>
          <p className="text-sm mb-4" style={{ color: '#848484' }}>
            This online psychological assessment evaluates your emotional intelligence, stress management, and suitability for caregiving roles.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" style={{ color: '#FEB4C5' }} />
              <span className="text-sm" style={{ color: '#535353' }}>Duration: 15-20 minutes</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
              <span className="text-sm" style={{ color: '#535353' }}>25 scenario-based questions</span>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" style={{ color: '#848484' }} />
              <span className="text-sm" style={{ color: '#535353' }}>No right or wrong answers</span>
            </div>
          </div>
        </div>

        <div className="finance-card p-5 mb-6">
          <h2 className="mb-3" style={{ color: '#535353' }}>What We Assess</h2>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(254, 180, 197, 0.2)' }}>
                <span className="text-xs" style={{ color: '#FEB4C5' }}>✓</span>
              </div>
              <div>
                <p style={{ color: '#535353' }}>Emotional Stability</p>
                <p className="text-xs" style={{ color: '#848484' }}>Ability to remain calm under pressure</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(254, 180, 197, 0.2)' }}>
                <span className="text-xs" style={{ color: '#FEB4C5' }}>✓</span>
              </div>
              <div>
                <p style={{ color: '#535353' }}>Empathy & Compassion</p>
                <p className="text-xs" style={{ color: '#848484' }}>Understanding patient needs</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(254, 180, 197, 0.2)' }}>
                <span className="text-xs" style={{ color: '#FEB4C5' }}>✓</span>
              </div>
              <div>
                <p style={{ color: '#535353' }}>Problem Solving</p>
                <p className="text-xs" style={{ color: '#848484' }}>Quick thinking in emergencies</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(254, 180, 197, 0.2)' }}>
                <span className="text-xs" style={{ color: '#FEB4C5' }}>✓</span>
              </div>
              <div>
                <p style={{ color: '#535353' }}>Communication Skills</p>
                <p className="text-xs" style={{ color: '#848484' }}>Clear and effective interaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="finance-card p-4" style={{ background: 'rgba(254, 180, 197, 0.1)' }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#FEB4C5' }} />
            <div>
              <p className="text-sm mb-1" style={{ color: '#535353' }}>
                <strong>Before You Start:</strong>
              </p>
              <ul className="text-xs space-y-1" style={{ color: '#848484' }}>
                <li>• Find a quiet place without distractions</li>
                <li>• Answer honestly - there are no wrong answers</li>
                <li>• You cannot pause once started</li>
                <li>• Results will be reviewed by a psychologist</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleStart}
        className="w-full py-6 mt-6"
        style={{
          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
          color: 'white',
          boxShadow: '0px 4px 18px rgba(240, 161, 180, 0.4)'
        }}
      >
        {status === 'completed' ? 'Back to Verification' : 'Start Assessment'}
      </Button>
    </div>
  );
}
