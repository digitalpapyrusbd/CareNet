import { User, Eye, Clock, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface CaregiverVerification {
  id: string;
  name: string;
  phone: string;
  submittedDate: string;
  verificationSteps: {
    certificates: 'pending' | 'approved' | 'rejected';
    policeClearance: 'pending' | 'approved' | 'rejected';
    interview: 'pending' | 'scheduled' | 'completed' | 'passed' | 'failed';
    psychTest: 'pending' | 'completed' | 'passed' | 'failed';
  };
}

interface CaregiverVerificationQueueProps {
  verifications: CaregiverVerification[];
  onReview: (id: string) => void;
}

export function CaregiverVerificationQueue({ verifications, onReview }: CaregiverVerificationQueueProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress'>('all');

  const getOverallStatus = (steps: CaregiverVerification['verificationSteps']) => {
    const allApproved = steps.certificates === 'approved' && 
                        steps.policeClearance === 'approved' && 
                        steps.interview === 'passed' && 
                        steps.psychTest === 'passed';
    if (allApproved) return 'completed';
    
    const anyInProgress = steps.certificates === 'pending' || 
                          steps.policeClearance === 'pending' ||
                          steps.interview === 'scheduled' ||
                          steps.psychTest === 'completed';
    if (anyInProgress) return 'in_progress';
    
    return 'pending';
  };

  const filteredVerifications = verifications.filter(v => {
    if (filter === 'all') return true;
    return getOverallStatus(v.verificationSteps) === filter;
  });

  const getStepIcon = (status: string) => {
    if (status === 'approved' || status === 'passed') return <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />;
    if (status === 'rejected' || status === 'failed') return <CheckCircle className="w-4 h-4" style={{ color: '#FF6B7A' }} />;
    return <Clock className="w-4 h-4" style={{ color: '#FFD180' }} />;
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Caregiver Verification Queue</h1>

        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'in_progress'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className="flex-1 px-4 py-2 rounded-lg capitalize text-sm" style={{
                background: filter === f ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: filter === f ? 'white' : '#535353'
              }}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {filteredVerifications.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <User className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No verifications in queue</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredVerifications.map((verification) => (
              <div key={verification.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1" style={{ color: '#535353' }}>{verification.name}</h3>
                    <p className="text-xs" style={{ color: '#848484' }}>{verification.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs">
                    {getStepIcon(verification.verificationSteps.certificates)}
                    <span style={{ color: '#535353' }}>Certificates</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {getStepIcon(verification.verificationSteps.policeClearance)}
                    <span style={{ color: '#535353' }}>Police Clearance</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {getStepIcon(verification.verificationSteps.interview)}
                    <span style={{ color: '#535353' }}>Interview</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {getStepIcon(verification.verificationSteps.psychTest)}
                    <span style={{ color: '#535353' }}>Psych Test</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/50">
                  <p className="text-xs" style={{ color: '#848484' }}>Submitted: {verification.submittedDate}</p>
                  <Button onClick={() => onReview(verification.id)} size="sm"
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                    <Eye className="w-4 h-4 mr-2" />Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

