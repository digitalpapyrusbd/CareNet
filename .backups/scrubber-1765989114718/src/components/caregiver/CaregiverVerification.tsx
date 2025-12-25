import { Check, Clock, AlertCircle, Upload, Calendar, FileText, Shield } from "lucide-react";
import { Button } from "../ui/button";

interface CaregiverVerificationProps {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  onNavigateToStep: (step: number) => void;
  onComplete?: () => void;
}

export function CaregiverVerification({ currentStep, onNavigateToStep, onComplete }: CaregiverVerificationProps) {
  const steps = [
    { 
      id: 1, 
      name: "Certificates", 
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "pending",
      icon: FileText,
      estimatedTime: "1-2 days"
    },
    { 
      id: 2, 
      name: "Police Clearance", 
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "pending",
      icon: Shield,
      estimatedTime: "3-5 days"
    },
    { 
      id: 3, 
      name: "Interview", 
      status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "pending",
      icon: Calendar,
      estimatedTime: "1-2 days"
    },
    { 
      id: 4, 
      name: "Psych Assessment", 
      status: currentStep > 4 ? "completed" : currentStep === 4 ? "current" : "pending",
      icon: FileText,
      estimatedTime: "2-3 days"
    },
    { 
      id: 5, 
      name: "Document Check", 
      status: currentStep > 5 ? "completed" : currentStep === 5 ? "current" : "pending",
      icon: FileText,
      estimatedTime: "1 day"
    },
    { 
      id: 6, 
      name: "Final Approval", 
      status: currentStep === 6 ? "current" : "pending",
      icon: Check,
      estimatedTime: "1 day"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#7CE577';
      case 'current': return '#FFB3C1';
      case 'pending': return '#848484';
      default: return '#848484';
    }
  };

  const getStatusIcon = (status: string, Icon: any) => {
    if (status === 'completed') return Check;
    if (status === 'current') return Clock;
    return Icon;
  };

  const totalEstimatedDays = "10-14 days";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2" style={{ color: '#535353' }}>Verification Process</h1>
          <p style={{ color: '#848484' }}>
            Estimated completion: {totalEstimatedDays}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="finance-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: '#535353' }}>Overall Progress</h3>
            <span style={{ color: '#FFB3C1' }}>{currentStep}/6 Steps</span>
          </div>
          <div className="w-full h-3 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(currentStep / 6) * 100}%`,
                background: 'radial-gradient(to right, #FFB3C1, #FF8FA3)'
              }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const StatusIcon = getStatusIcon(step.status, step.icon);
            const isClickable = step.status === 'current' || step.status === 'completed';

            return (
              <button
                key={step.id}
                onClick={() => isClickable && onNavigateToStep(step.id)}
                disabled={!isClickable}
                className="w-full finance-card p-4 hover:shadow-lg transition-all text-left"
                style={{ opacity: step.status === 'pending' ? 0.6 : 1 }}
              >
                <div className="flex items-center gap-4">
                  {/* Step Number */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: step.status === 'completed'
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                        : step.status === 'current'
                        ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                        : 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <StatusIcon className="w-6 h-6" style={{ color: step.status === 'pending' ? '#848484' : 'white' }} />
                  </div>

                  {/* Step Info */}
                  <div className="flex-1">
                    <h3 className="mb-1" style={{ color: '#535353' }}>{step.name}</h3>
                    <p className="text-sm" style={{ color: '#848484' }}>
                      {step.status === 'completed' && '✓ Completed'}
                      {step.status === 'current' && `In Progress • ${step.estimatedTime}`}
                      {step.status === 'pending' && `Est. ${step.estimatedTime}`}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div 
                    className="px-3 py-1 rounded-full text-xs capitalize"
                    style={{
                      background: step.status === 'completed' 
                        ? 'rgba(124, 229, 119, 0.2)'
                        : step.status === 'current'
                        ? 'rgba(255, 179, 193, 0.2)'
                        : 'rgba(132, 132, 132, 0.2)',
                      color: getStatusColor(step.status)
                    }}
                  >
                    {step.status}
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div 
                      className="absolute left-10 top-16 w-0.5 h-8"
                      style={{
                        background: step.status === 'completed' 
                          ? getStatusColor('completed')
                          : 'rgba(255, 255, 255, 0.5)'
                      }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Step Details */}
        <div className="mt-6 finance-card p-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Current Step: {steps[currentStep - 1]?.name}</h3>
          
          {currentStep === 1 && (
            <div>
              <p className="mb-4" style={{ color: '#535353' }}>
                Upload your professional certifications and training documents.
              </p>
              <ul className="space-y-2 mb-4 text-sm" style={{ color: '#848484' }}>
                <li>• Caregiver training certificate</li>
                <li>• First aid certification (if available)</li>
                <li>• Specialized training certificates</li>
              </ul>
              <Button
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white'
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <p className="mb-4" style={{ color: '#535353' }}>
                Submit your police clearance certificate.
              </p>
              <p className="text-sm mb-4" style={{ color: '#848484' }}>
                This document verifies you have no criminal record. You can obtain it from your local police station.
              </p>
              <Button
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white'
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Certificate
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <p className="mb-4" style={{ color: '#535353' }}>
                Schedule your verification interview with our team.
              </p>
              <p className="text-sm mb-4" style={{ color: '#848484' }}>
                We'll discuss your experience, skills, and commitment to quality care.
              </p>
              <Button
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white'
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <p className="mb-4" style={{ color: '#535353' }}>
                Complete the psychological assessment.
              </p>
              <p className="text-sm mb-4" style={{ color: '#848484' }}>
                This online assessment evaluates your suitability for caregiving work. It takes approximately 30 minutes.
              </p>
              <Button
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white'
                }}
              >
                Start Assessment
              </Button>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <p className="mb-4" style={{ color: '#535353' }}>
                Our team is reviewing your submitted documents.
              </p>
              <p className="text-sm" style={{ color: '#848484' }}>
                We'll notify you once the review is complete. This typically takes 1 business day.
              </p>
            </div>
          )}

          {currentStep === 6 && (
            <div>
              <p className="mb-4" style={{ color: '#535353' }}>
                Final approval from platform admin is pending.
              </p>
              <p className="text-sm" style={{ color: '#848484' }}>
                You'll receive a notification once your account is approved. This is the final step!
              </p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div 
          className="mt-6 p-4 rounded-lg"
          style={{ background: 'rgba(142, 197, 252, 0.1)' }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#5B9FFF' }} />
            <div>
              <p className="text-sm mb-1" style={{ color: '#535353' }}>
                <strong>Need Help?</strong>
              </p>
              <p className="text-sm" style={{ color: '#848484' }}>
                Contact our support team at support@carenet.bd or call +880 1XXX-XXXXXX
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
