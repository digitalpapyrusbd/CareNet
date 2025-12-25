import { Building, Clock, Eye } from "lucide-react";
import { Button } from "../ui/button";

interface VerificationQueueAgenciesTabProps {
  agencies: {
    id: string;
    name: string;
    contactPerson: string;
    submittedDate: string;
    currentStep: 'legal' | 'physical';
    priority: 'normal' | 'high';
  }[];
  onReview: (agencyId: string) => void;
}

export function VerificationQueueAgenciesTab({ agencies, onReview }: VerificationQueueAgenciesTabProps) {
  return (
    <div className="space-y-4">
      {agencies.map((agency) => (
        <div key={agency.id} className="finance-card p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 style={{ color: '#535353' }}>{agency.name}</h3>
                  {agency.priority === 'high' && (
                    <span className="px-2 py-1 rounded-full text-xs"
                      style={{ background: 'rgba(255, 107, 122, 0.2)', color: '#FF6B7A' }}>
                      High Priority
                    </span>
                  )}
                </div>
                <p className="text-sm mb-2" style={{ color: '#848484' }}>{agency.contactPerson}</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span style={{ color: '#848484' }}>Submitted: </span>
                    <span style={{ color: '#535353' }}>{agency.submittedDate}</span>
                  </div>
                  <div>
                    <span style={{ color: '#848484' }}>Step: </span>
                    <span style={{ color: '#535353' }}>{agency.currentStep === 'legal' ? 'Legal Docs' : 'Physical Verification'}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => onReview(agency.id)}
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                color: 'white'
              }}
            >
              <Eye className="w-4 h-4 mr-2" />Review
            </Button>
          </div>
        </div>
      ))}

      {agencies.length === 0 && (
        <div className="finance-card p-12 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
          <p style={{ color: '#848484' }}>No agencies in queue</p>
        </div>
      )}
    </div>
  );
}

