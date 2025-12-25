import { User, Clock, Eye } from "lucide-react";
import { Button } from "../ui/button";

interface VerificationQueueCaregiversTabProps {
  caregivers: {
    id: string;
    name: string;
    phone: string;
    submittedDate: string;
    currentStep: 'nid' | 'certificates' | 'police' | 'interview' | 'psych';
    priority: 'normal' | 'high';
  }[];
  onReview: (caregiverId: string) => void;
}

export function VerificationQueueCaregiversTab({ caregivers, onReview }: VerificationQueueCaregiversTabProps) {
  const getStepLabel = (step: string) => {
    const labels: Record<string, string> = {
      'nid': 'NID Verification',
      'certificates': 'Certificates',
      'police': 'Police Clearance',
      'interview': 'Interview',
      'psych': 'Psych Analysis'
    };
    return labels[step] || step;
  };

  return (
    <div className="space-y-4">
      {caregivers.map((caregiver) => (
        <div key={caregiver.id} className="finance-card p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 style={{ color: '#535353' }}>{caregiver.name}</h3>
                  {caregiver.priority === 'high' && (
                    <span className="px-2 py-1 rounded-full text-xs"
                      style={{ background: 'rgba(255, 107, 122, 0.2)', color: '#FF6B7A' }}>
                      High Priority
                    </span>
                  )}
                </div>
                <p className="text-sm mb-2" style={{ color: '#848484' }}>{caregiver.phone}</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span style={{ color: '#848484' }}>Submitted: </span>
                    <span style={{ color: '#535353' }}>{caregiver.submittedDate}</span>
                  </div>
                  <div>
                    <span style={{ color: '#848484' }}>Step: </span>
                    <span style={{ color: '#535353' }}>{getStepLabel(caregiver.currentStep)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => onReview(caregiver.id)}
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                color: 'white'
              }}
            >
              <Eye className="w-4 h-4 mr-2" />Review
            </Button>
          </div>
        </div>
      ))}

      {caregivers.length === 0 && (
        <div className="finance-card p-12 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
          <p style={{ color: '#848484' }}>No caregivers in queue</p>
        </div>
      )}
    </div>
  );
}

