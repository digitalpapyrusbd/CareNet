import { MapPin, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";

interface PhysicalVerification {
  id: string;
  agencyName: string;
  address: string;
  verificationDate: string;
  verifierName?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'failed';
  notes?: string;
}

interface AgencyPhysicalVerificationQueueProps {
  verifications: PhysicalVerification[];
  onSchedule: (id: string) => void;
  onReview: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function AgencyPhysicalVerificationQueue({
  verifications,
  onSchedule,
  onReview,
  onApprove,
  onReject
}: AgencyPhysicalVerificationQueueProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#7CE577';
      case 'failed': return '#FF6B7A';
      case 'scheduled': return '#5B9FFF';
      default: return '#FFD180';
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Physical Verification Queue</h1>

        <div className="space-y-3">
          {verifications.map((verification) => {
            const statusColor = getStatusColor(verification.status);

            return (
              <div key={verification.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${statusColor}33` }}>
                    <MapPin className="w-6 h-6" style={{ color: statusColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p style={{ color: '#535353' }}>{verification.agencyName}</p>
                      <span className="text-xs px-2 py-1 rounded-full capitalize"
                        style={{ background: `${statusColor}33`, color: statusColor }}>
                        {verification.status}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#848484' }} />
                      <p className="text-sm" style={{ color: '#848484' }}>{verification.address}</p>
                    </div>
                    {verification.verificationDate && (
                      <p className="text-xs" style={{ color: '#848484' }}>
                        Date: {verification.verificationDate}
                      </p>
                    )}
                    {verification.verifierName && (
                      <p className="text-xs" style={{ color: '#848484' }}>
                        Verifier: {verification.verifierName}
                      </p>
                    )}
                    {verification.notes && (
                      <p className="text-xs mt-1" style={{ color: '#535353' }}>
                        Notes: {verification.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => onReview(verification.id)} variant="outline" className="bg-white/50 border-white/50">
                    <Eye className="w-4 h-4 mr-1" />View
                  </Button>
                  {verification.status === 'pending' && (
                    <Button onClick={() => onSchedule(verification.id)} className="col-span-2"
                      style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
                      <Clock className="w-4 h-4 mr-1" />Schedule
                    </Button>
                  )}
                  {verification.status === 'completed' && (
                    <>
                      <Button onClick={() => onApprove(verification.id)}
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                        <CheckCircle className="w-4 h-4 mr-1" />Approve
                      </Button>
                      <Button onClick={() => onReject(verification.id)}
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                        <XCircle className="w-4 h-4 mr-1" />Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {verifications.length === 0 && (
            <div className="finance-card p-8 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-3" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No verifications in queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

