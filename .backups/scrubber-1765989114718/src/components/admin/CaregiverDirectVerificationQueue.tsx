import { Users, Clock, CheckCircle, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface CaregiverDirectVerificationQueueProps {
  caregivers: {
    id: string;
    name: string;
    phone: string;
    submittedDate: string;
    currentStep: 'nid' | 'certificates' | 'police' | 'interview' | 'psych' | 'final';
    stepsCompleted: number;
    totalSteps: number;
  }[];
  onViewDetails: (caregiverId: string) => void;
}

export function CaregiverDirectVerificationQueue({ caregivers, onViewDetails }: CaregiverDirectVerificationQueueProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getStepLabel = (step: string) => {
    const labels: Record<string, string> = {
      'nid': 'NID Verification',
      'certificates': 'Certificate Review',
      'police': 'Police Clearance',
      'interview': 'Interview',
      'psych': 'Psychological Analysis',
      'final': 'Final Approval'
    };
    return labels[step] || step;
  };

  const filteredCaregivers = caregivers.filter(cg =>
    cg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cg.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Direct Caregiver Verification Queue</h1>

        {/* Search */}
        <div className="finance-card p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or phone..."
              className="pl-10 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>
        </div>

        {/* Queue List */}
        <div className="space-y-4">
          {filteredCaregivers.map((caregiver) => (
            <div key={caregiver.id} className="finance-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: '#535353' }}>{caregiver.name}</h3>
                    <p className="text-sm" style={{ color: '#848484' }}>{caregiver.phone}</p>
                  </div>
                </div>

                <Button
                  onClick={() => onViewDetails(caregiver.id)}
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                    color: 'white'
                  }}
                >
                  View Details
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm" style={{ color: '#848484' }}>Submitted</p>
                  <p style={{ color: '#535353' }}>{caregiver.submittedDate}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#848484' }}>Current Step</p>
                  <p style={{ color: '#535353' }}>{getStepLabel(caregiver.currentStep)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: '#848484' }}>Progress</span>
                  <span className="text-sm" style={{ color: '#535353' }}>
                    {caregiver.stepsCompleted}/{caregiver.totalSteps} steps
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${(caregiver.stepsCompleted / caregiver.totalSteps) * 100}%`,
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {filteredCaregivers.length === 0 && (
            <div className="finance-card p-12 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No caregivers in verification queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

