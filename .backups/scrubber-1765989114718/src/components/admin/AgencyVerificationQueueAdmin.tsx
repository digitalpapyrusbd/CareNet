import { Building, Clock, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface AgencyVerificationQueueAdminProps {
  agencies: {
    id: string;
    name: string;
    contactPerson: string;
    phone: string;
    submittedDate: string;
    currentStep: 'legal' | 'physical' | 'final';
    legalDocsStatus: 'pending' | 'approved' | 'rejected';
    physicalStatus: 'pending' | 'approved' | 'rejected';
  }[];
  onViewDetails: (agencyId: string) => void;
}

export function AgencyVerificationQueueAdmin({ agencies, onViewDetails }: AgencyVerificationQueueAdminProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getStepLabel = (step: string) => {
    const labels: Record<string, string> = {
      'legal': 'Legal Documents',
      'physical': 'Physical Verification',
      'final': 'Final Approval'
    };
    return labels[step] || step;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#7CE577';
      case 'rejected': return '#FF8FA3';
      default: return '#FFD180';
    }
  };

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Agency Verification Queue</h1>

        {/* Search */}
        <div className="finance-card p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#848484' }} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by agency name, contact person, or phone..."
              className="pl-10 bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            />
          </div>
        </div>

        {/* Queue List */}
        <div className="space-y-4">
          {filteredAgencies.map((agency) => (
            <div key={agency.id} className="finance-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: '#535353' }}>{agency.name}</h3>
                    <p className="text-sm" style={{ color: '#848484' }}>{agency.contactPerson} • {agency.phone}</p>
                  </div>
                </div>

                <Button
                  onClick={() => onViewDetails(agency.id)}
                  style={{
                    background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                    color: 'white'
                  }}
                >
                  View Details
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm mb-1" style={{ color: '#848484' }}>Submitted</p>
                  <p style={{ color: '#535353' }}>{agency.submittedDate}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: '#848484' }}>Current Step</p>
                  <p style={{ color: '#535353' }}>{getStepLabel(agency.currentStep)}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: '#848484' }}>Status</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded-full text-xs"
                      style={{
                        background: `${getStatusColor(agency.legalDocsStatus)}33`,
                        color: getStatusColor(agency.legalDocsStatus)
                      }}>
                      Legal: {agency.legalDocsStatus}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs"
                      style={{
                        background: `${getStatusColor(agency.physicalStatus)}33`,
                        color: getStatusColor(agency.physicalStatus)
                      }}>
                      Physical: {agency.physicalStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredAgencies.length === 0 && (
            <div className="finance-card p-12 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No agencies in verification queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

