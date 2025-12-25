import { Brain, CheckCircle, XCircle, Play, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface VerificationPsychTestProps {
  onStartTest: () => void;
  status?: 'not_started' | 'in_progress' | 'completed' | 'passed' | 'failed';
  score?: number;
  feedback?: string;
  estimatedTime?: number;
}

export function VerificationPsychTest({ 
  const { t } = useTranslationContext();
  onStartTest, 
  status = 'not_started', 
  score, 
  feedback,
  estimatedTime = 30
}: VerificationPsychTestProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>{t('verificationpsychtest.heading.step4psychologicalas')}</h1>
          <p style={{ color: '#848484' }}>{t('verificationpsychtest.text.completethepsycholog')}</p>
        </div>

        {status === 'passed' && (
          <div className="finance-card p-4 mb-6" style={{ borderLeft: '4px solid #7CE577' }}>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
              <p style={{ color: '#535353' }}>{t('verificationpsychtest.text.assessmentpassed')}</p>
            </div>
            {score && <p className="text-sm mb-2" style={{ color: '#848484' }}>Score: {score}/100</p>}
            {feedback && <p className="text-sm" style={{ color: '#848484' }}>{feedback}</p>}
          </div>
        )}

        {status === 'failed' && (
          <div className="finance-card p-4 mb-6" style={{ borderLeft: '4px solid #FF6B7A' }}>
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-5 h-5" style={{ color: '#FF6B7A' }} />
              <p style={{ color: '#535353' }}>{t('verificationpsychtest.text.assessmentnotpassed')}</p>
            </div>
            {feedback && <p className="text-sm" style={{ color: '#848484' }}>{feedback}</p>}
          </div>
        )}

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>{t('verificationpsychtest.heading.psychologicalfitness')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>{t('verificationpsychtest.text.onlineassessment')}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg mb-4" style={{ background: 'rgba(184, 167, 255, 0.1)' }}>
            <p className="text-sm mb-2" style={{ color: '#535353' }}>{t('verificationpsychtest.text.whattoexpect')}</p>
            <ul className="space-y-1 text-sm" style={{ color: '#848484' }}>
              <li>{t('verificationpsychtest.text.stressmanagementscen')}</li>
              <li>{t('verificationpsychtest.text.emotionalintelligenc')}</li>
              <li>{t('verificationpsychtest.text.patientinteractionas')}</li>
              <li>{t('verificationpsychtest.text.decisionmakingevalua')}</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(142, 197, 252, 0.1)' }}>
              <Clock className="w-6 h-6 mx-auto mb-2" style={{ color: '#5B9FFF' }} />
              <p className="text-sm" style={{ color: '#535353' }}>{estimatedTime} minutes</p>
              <p className="text-xs" style={{ color: '#848484' }}>{t('verificationpsychtest.text.estimatedtime')}</p>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(168, 224, 99, 0.1)' }}>
              <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: '#7CE577' }} />
              <p className="text-sm" style={{ color: '#535353' }}>{t('verificationpsychtest.text.multiplechoice')}</p>
              <p className="text-xs" style={{ color: '#848484' }}>{t('verificationpsychtest.text.questionformat')}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 179, 193, 0.1)' }}>
            <p className="text-sm mb-2" style={{ color: '#535353' }}>{t('verificationpsychtest.text.importantnotes')}</p>
            <ul className="space-y-1 text-sm" style={{ color: '#848484' }}>
              <li>{t('verificationpsychtest.text.answerhonestlytherea')}</li>
              <li>{t('verificationpsychtest.text.completeinonesitting')}</li>
              <li>{t('verificationpsychtest.text.findaquietenvironmen')}</li>
              <li>{t('verificationpsychtest.text.resultsreviewedbymod')}</li>
            </ul>
          </div>
        </div>

        {status === 'not_started' && (
          <Button onClick={onStartTest} className="w-full"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            <Play className="w-4 h-4 mr-2" />Start Assessment
          </Button>
        )}

        {status === 'in_progress' && (
          <div className="finance-card p-4 text-center">
            <p style={{ color: '#535353' }}>Assessment in progress...</p>
            <p className="text-sm mt-2" style={{ color: '#848484' }}>{t('verificationpsychtest.text.pleasecompletethetes')}</p>
          </div>
        )}

        {status === 'completed' && (
          <div className="finance-card p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: '#FFD180' }} />
            <p style={{ color: '#535353' }}>{t('verificationpsychtest.text.underreview')}</p>
            <p className="text-sm mt-2" style={{ color: '#848484' }}>{t('verificationpsychtest.text.yourresultsarebeinge')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

