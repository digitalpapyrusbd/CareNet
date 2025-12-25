import { CheckCircle, XCircle, ArrowLeft, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface AdminDecisionPanelProps {
  submission: {
    id: string;
    type: string;
    entityName: string;
    moderatorName: string;
    recommendation: string;
    notes: string;
    submittedDate: string;
    documents?: string[];
  };
  onApprove: (feedback: string) => void;
  onSendBack: (feedback: string) => void;
  onOverride: (feedback: string) => void;
  onCancel: () => void;
}

export function AdminDecisionPanel({
  const { t } = useTranslationContext();
  submission,
  onApprove,
  onSendBack,
  onOverride,
  onCancel
}: AdminDecisionPanelProps) {
  const [decision, setDecision] = useState<'approve' | 'send_back' | 'override' | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!decision) return;
    
    switch (decision) {
      case 'approve':
        onApprove(feedback);
        break;
      case 'send_back':
        onSendBack(feedback);
        break;
      case 'override':
        onOverride(feedback);
        break;
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-3xl mx-auto">
        <Button onClick={onCancel} variant="outline" className="mb-6 bg-white/50 border-white/50">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Queue
        </Button>

        <h1 className="mb-6" style={{ color: '#535353' }}>{t('admindecisionpanel.heading.admindecision3wayrev')}</h1>

        {/* Submission Details */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>{t('admindecisionpanel.heading.submissiondetails')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>{t('admindecisionpanel.text.entity')}</span>
              <span style={{ color: '#535353' }}>{submission.entityName}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>{t('admindecisionpanel.text.type')}</span>
              <span style={{ color: '#535353' }}>{submission.type}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>{t('admindecisionpanel.text.moderator')}</span>
              <span style={{ color: '#535353' }}>{submission.moderatorName}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>{t('admindecisionpanel.text.submitted')}</span>
              <span style={{ color: '#535353' }}>{submission.submittedDate}</span>
            </div>
          </div>
        </div>

        {/* Moderator's Recommendation */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>{t('admindecisionpanel.heading.moderatorsrecommenda')}</h3>
          <div className="p-4 rounded-lg mb-3" style={{ background: 'rgba(142, 197, 252, 0.1)' }}>
            <p style={{ color: '#535353' }}>{submission.recommendation}</p>
          </div>
          {submission.notes && (
            <div>
              <p className="text-sm mb-2" style={{ color: '#848484' }}>{t('admindecisionpanel.text.notes')}</p>
              <p className="text-sm" style={{ color: '#535353' }}>{submission.notes}</p>
            </div>
          )}
        </div>

        {/* Decision Options */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>{t('admindecisionpanel.heading.yourdecision')}</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setDecision('approve')}
              className="p-4 rounded-lg text-center transition-all"
              style={{
                background: decision === 'approve' 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: decision === 'approve' ? 'white' : '#535353'
              }}
            >
              <CheckCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">{t('admindecisionpanel.text.approve')}</p>
              <p className="text-xs opacity-80">{t('admindecisionpanel.text.finalizeactivate')}</p>
            </button>

            <button
              onClick={() => setDecision('send_back')}
              className="p-4 rounded-lg text-center transition-all"
              style={{
                background: decision === 'send_back' 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: decision === 'send_back' ? 'white' : '#535353'
              }}
            >
              <ArrowLeft className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">{t('admindecisionpanel.text.sendback')}</p>
              <p className="text-xs opacity-80">{t('admindecisionpanel.text.returnwithfeedback')}</p>
            </button>

            <button
              onClick={() => setDecision('override')}
              className="p-4 rounded-lg text-center transition-all"
              style={{
                background: decision === 'override' 
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                  : 'rgba(255, 255, 255, 0.5)',
                color: decision === 'override' ? 'white' : '#535353'
              }}
            >
              <XCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">{t('admindecisionpanel.text.overridereject')}</p>
              <p className="text-xs opacity-80">{t('admindecisionpanel.text.rejectregardless')}</p>
            </button>
          </div>

          <div>
            <Label style={{ color: '#535353' }}>Feedback Notes *</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t('admindecisionpanel.placeholder.providedetailedfeedb')}
              className="mt-2 bg-white/50 border-white/50 min-h-[120px]"
              style={{ color: '#535353' }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!decision || !feedback.trim()}
          className="w-full"
          style={{
            background: decision === 'approve' 
              ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
              : decision === 'send_back'
              ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)'
              : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
            color: 'white',
            opacity: (!decision || !feedback.trim()) ? 0.5 : 1
          }}
        >
          Submit Decision
        </Button>
      </div>
    </div>
  );
}

