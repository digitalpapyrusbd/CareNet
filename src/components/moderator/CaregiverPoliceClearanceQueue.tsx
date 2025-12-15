import { Shield, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface PoliceClearance {
  id: string;
  caregiverName: string;
  clearanceNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingStation: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  submittedDate: string;
  verificationNotes?: string;
}

interface CaregiverPoliceClearanceQueueProps {
  clearances: PoliceClearance[];
  onReview: (id: string) => void;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
}

export function CaregiverPoliceClearanceQueue({
  clearances,
  onReview,
  onVerify,
  onReject
}: CaregiverPoliceClearanceQueueProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#7CE577';
      case 'rejected': return '#FF6B7A';
      case 'expired': return '#848484';
      default: return '#FFD180';
    }
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Police Clearance Queue</h1>

        <div className="space-y-3">
          {clearances.map((clearance) => {
            const statusColor = getStatusColor(clearance.status);
            const expired = isExpired(clearance.expiryDate);

            return (
              <div key={clearance.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${statusColor}33` }}>
                    <Shield className="w-6 h-6" style={{ color: statusColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p style={{ color: '#535353' }}>{clearance.caregiverName}</p>
                      <span className="text-xs px-2 py-1 rounded-full capitalize"
                        style={{ background: `${statusColor}33`, color: statusColor }}>
                        {clearance.status}
                      </span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#535353' }}>
                      Clearance #{clearance.clearanceNumber}
                    </p>
                    <p className="text-xs mb-1" style={{ color: '#848484' }}>
                      Issuing Station: {clearance.issuingStation}
                    </p>
                    <div className="flex items-center gap-3 text-xs mb-1" style={{ color: '#848484' }}>
                      <span>Issued: {clearance.issueDate}</span>
                      <span className={expired ? 'text-red-500' : ''}>
                        Expires: {clearance.expiryDate}
                      </span>
                    </div>
                    {expired && (
                      <div className="flex items-center gap-1 mb-1 text-xs" style={{ color: '#FF6B7A' }}>
                        <AlertTriangle className="w-3 h-3" />
                        <span>Expired - Requires renewal</span>
                      </div>
                    )}
                    <p className="text-xs" style={{ color: '#848484' }}>
                      Submitted: {clearance.submittedDate}
                    </p>
                    {clearance.verificationNotes && (
                      <p className="text-xs mt-2 p-2 rounded" style={{ 
                        background: 'rgba(142, 197, 252, 0.1)', 
                        color: '#535353' 
                      }}>
                        Note: {clearance.verificationNotes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => onReview(clearance.id)} variant="outline" className="bg-white/50 border-white/50">
                    <Eye className="w-4 h-4 mr-1" />View
                  </Button>
                  {clearance.status === 'pending' && !expired && (
                    <>
                      <Button onClick={() => onVerify(clearance.id)}
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                        <CheckCircle className="w-4 h-4 mr-1" />Verify
                      </Button>
                      <Button onClick={() => onReject(clearance.id)}
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                        <XCircle className="w-4 h-4 mr-1" />Reject
                      </Button>
                    </>
                  )}
                  {expired && (
                    <Button className="col-span-2" disabled
                      style={{ background: '#848484', color: 'white', opacity: 0.5 }}>
                      Expired - Renewal Required
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {clearances.length === 0 && (
            <div className="finance-card p-8 text-center">
              <Shield className="w-12 h-12 mx-auto mb-3" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No clearances in queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

