import { Award, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

interface Certificate {
  id: string;
  caregiverName: string;
  certificateType: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  submittedDate: string;
}

interface CaregiverCertificateQueueProps {
  certificates: Certificate[];
  onReview: (id: string) => void;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
}

export function CaregiverCertificateQueue({
  certificates,
  onReview,
  onVerify,
  onReject
}: CaregiverCertificateQueueProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#7CE577';
      case 'rejected': return '#FF6B7A';
      case 'expired': return '#848484';
      default: return '#FFD180';
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow;
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Certificate Verification Queue</h1>

        <div className="space-y-3">
          {certificates.map((cert) => {
            const statusColor = getStatusColor(cert.status);
            const expiringSoon = isExpiringSoon(cert.expiryDate);

            return (
              <div key={cert.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${statusColor}33` }}>
                    <Award className="w-6 h-6" style={{ color: statusColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p style={{ color: '#535353' }}>{cert.caregiverName}</p>
                      <span className="text-xs px-2 py-1 rounded-full capitalize"
                        style={{ background: `${statusColor}33`, color: statusColor }}>
                        {cert.status}
                      </span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#535353' }}>{cert.certificateType}</p>
                    <p className="text-xs mb-1" style={{ color: '#848484' }}>
                      Issued by: {cert.issuingOrganization}
                    </p>
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#848484' }}>
                      <span>Issued: {cert.issueDate}</span>
                      {cert.expiryDate && (
                        <span className={expiringSoon ? 'text-orange-500' : ''}>
                          Expires: {cert.expiryDate}
                        </span>
                      )}
                    </div>
                    {expiringSoon && (
                      <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: '#FFD180' }}>
                        <AlertCircle className="w-3 h-3" />
                        <span>Expiring soon</span>
                      </div>
                    )}
                    <p className="text-xs mt-1" style={{ color: '#848484' }}>
                      Submitted: {cert.submittedDate}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => onReview(cert.id)} variant="outline" className="bg-white/50 border-white/50">
                    <Eye className="w-4 h-4 mr-1" />View
                  </Button>
                  {cert.status === 'pending' && (
                    <>
                      <Button onClick={() => onVerify(cert.id)}
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
                        <CheckCircle className="w-4 h-4 mr-1" />Verify
                      </Button>
                      <Button onClick={() => onReject(cert.id)}
                        style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
                        <XCircle className="w-4 h-4 mr-1" />Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {certificates.length === 0 && (
            <div className="finance-card p-8 text-center">
              <Award className="w-12 h-12 mx-auto mb-3" style={{ color: '#848484' }} />
              <p style={{ color: '#848484' }}>No certificates in queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

