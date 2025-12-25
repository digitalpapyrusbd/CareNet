import { Clock, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface AgencyPendingVerificationProps {
  estimatedTime: string;
  documents: {
    tradeLicense: 'uploaded' | 'verified' | 'pending';
    tinCertificate?: 'uploaded' | 'verified' | 'pending';
    companyInfo: 'uploaded' | 'verified' | 'pending';
  };
}

export function AgencyPendingVerification({ estimatedTime, documents }: AgencyPendingVerificationProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'uploaded': return Clock;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#7CE577';
      case 'uploaded': return '#5B9FFF';
      default: return '#FFD180';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
            <Clock className="w-12 h-12 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Under Review</h1>
          <p style={{ color: '#848484' }}>
            Your application is being reviewed by our team
          </p>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Estimated Time</h3>
          <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(255, 209, 128, 0.2)' }}>
            <p className="text-2xl mb-1" style={{ color: '#FFB74D' }}>{estimatedTime}</p>
            <p className="text-sm" style={{ color: '#848484' }}>Review Period</p>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Document Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getStatusIcon(documents.tradeLicense);
                  return <Icon className="w-5 h-5" style={{ color: getStatusColor(documents.tradeLicense) }} />;
                })()}
                <span style={{ color: '#535353' }}>Trade License</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full capitalize"
                style={{ background: `${getStatusColor(documents.tradeLicense)}33`, color: getStatusColor(documents.tradeLicense) }}>
                {documents.tradeLicense}
              </span>
            </div>

            {documents.tinCertificate && (
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getStatusIcon(documents.tinCertificate);
                    return <Icon className="w-5 h-5" style={{ color: getStatusColor(documents.tinCertificate) }} />;
                  })()}
                  <span style={{ color: '#535353' }}>TIN Certificate</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full capitalize"
                  style={{ background: `${getStatusColor(documents.tinCertificate)}33`, color: getStatusColor(documents.tinCertificate) }}>
                  {documents.tinCertificate}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getStatusIcon(documents.companyInfo);
                  return <Icon className="w-5 h-5" style={{ color: getStatusColor(documents.companyInfo) }} />;
                })()}
                <span style={{ color: '#535353' }}>Company Information</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full capitalize"
                style={{ background: `${getStatusColor(documents.companyInfo)}33`, color: getStatusColor(documents.companyInfo) }}>
                {documents.companyInfo}
              </span>
            </div>
          </div>
        </div>

        <div className="finance-card p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#5B9FFF' }} />
            <div>
              <p className="mb-2" style={{ color: '#535353' }}>What happens next?</p>
              <ul className="text-sm space-y-1" style={{ color: '#848484' }}>
                <li>• Our team will verify your documents</li>
                <li>• You'll receive an email notification</li>
                <li>• Once approved, you can start operations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

