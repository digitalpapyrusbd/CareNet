'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock, XCircle, FileText, Shield, UserCheck, Brain, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type PipelineStep = {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending';
  completedDate?: string;
};

export default function CaregiverVerificationPipelinePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [pipelineSteps] = useState<PipelineStep[]>([
    {
      id: 'certificates',
      name: 'Certificates',
      icon: <FileText className="w-5 h-5" />,
      status: 'completed',
      completedDate: '2024-12-15'
    },
    {
      id: 'police',
      name: 'Police Clearance',
      icon: <Shield className="w-5 h-5" />,
      status: 'completed',
      completedDate: '2024-12-18'
    },
    {
      id: 'interview',
      name: 'Interview',
      icon: <UserCheck className="w-5 h-5" />,
      status: 'current'
    },
    {
      id: 'psych',
      name: 'Psychological Assessment',
      icon: <Brain className="w-5 h-5" />,
      status: 'pending'
    },
    {
      id: 'documents',
      name: 'Document Check',
      icon: <FileCheck className="w-5 h-5" />,
      status: 'pending'
    },
    {
      id: 'final',
      name: 'Final Approval',
      icon: <CheckCircle className="w-5 h-5" />,
      status: 'pending'
    }
  ]);

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'current':
        return <Clock className="w-5 h-5 text-white" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <>
      <UniversalNav userRole="moderator" showBack={true} />
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
            <h1 className="mb-2" style={{ color: '#535353' }}>Caregiver Verification Pipeline</h1>
            <p style={{ color: '#848484' }}>6-step verification process status for Application ID: {id || 'N/A'}</p>
          </div>

          <div className="finance-card p-6 mb-6">
            <div className="space-y-6">
              {pipelineSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepColor(step.status)}`}
                    >
                      {getStepIcon(step.status)}
                    </div>
                    {index < pipelineSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-16 mt-2 ${
                          step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 style={{ color: '#535353' }}>{step.name}</h3>
                      {step.status === 'completed' && step.completedDate && (
                        <span className="text-sm" style={{ color: '#848484' }}>
                          {new Date(step.completedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {step.status === 'completed' && (
                        <span className="text-sm text-green-600">✓ Completed</span>
                      )}
                      {step.status === 'current' && (
                        <span className="text-sm text-blue-600">⏳ In Progress</span>
                      )}
                      {step.status === 'pending' && (
                        <span className="text-sm" style={{ color: '#848484' }}>○ Pending</span>
                      )}
                    </div>
                    {step.status === 'current' && (
                      <Button
                        onClick={() => router.push(`/moderator/verification/caregivers/${id}`)}
                        className="mt-3 bg-blue-500 hover:bg-blue-600"
                        size="sm"
                      >
                        Review Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="finance-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" style={{ color: '#848484' }} />
              <span style={{ color: '#535353' }}>Estimated Time Remaining</span>
            </div>
            <p className="text-lg font-semibold" style={{ color: '#535353' }}>
              2-3 business days
            </p>
            <p className="text-sm mt-1" style={{ color: '#848484' }}>
              Current step: Interview (typically 1-2 days)
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
