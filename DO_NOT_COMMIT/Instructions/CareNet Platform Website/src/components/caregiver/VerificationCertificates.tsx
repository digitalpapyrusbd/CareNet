import { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { Button } from '../ui/button';

interface VerificationCertificatesProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function VerificationCertificates({ onNavigate, onBack }: VerificationCertificatesProps) {
  const [status] = useState<'submitted' | 'under-review' | 'approved' | 'needs-resubmission'>('under-review');
  const [certificates, setCertificates] = useState<string[]>([
    'Basic Life Support Certificate.pdf',
    'First Aid Training.pdf'
  ]);
  const [feedback] = useState('Your certificates are being reviewed by our team. This usually takes 2-3 hours.');

  const handleAddCertificate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newCerts = Array.from(files).map(f => f.name);
      setCertificates(prev => [...prev, ...newCerts]);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: '#7CE577',
          bg: 'rgba(124, 229, 119, 0.1)',
          label: 'Approved',
          message: 'Your certificates have been verified successfully!'
        };
      case 'needs-resubmission':
        return {
          icon: XCircle,
          color: '#FF6B6B',
          bg: 'rgba(255, 107, 107, 0.1)',
          label: 'Needs Resubmission',
          message: 'Please upload clearer images of your certificates.'
        };
      case 'under-review':
        return {
          icon: Clock,
          color: '#FEB4C5',
          bg: 'rgba(254, 180, 197, 0.1)',
          label: 'Under Review',
          message: 'Your certificates are being reviewed. Estimated time: 2-3 hours.'
        };
      default:
        return {
          icon: FileText,
          color: '#848484',
          bg: 'rgba(132, 132, 132, 0.1)',
          label: 'Submitted',
          message: 'Your certificates have been submitted.'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => onBack?.()}
          className="mb-6 hover:bg-white/30"
          style={{ color: '#535353' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{
              background: statusConfig.bg,
            }}
          >
            <StatusIcon className="w-10 h-10" style={{ color: statusConfig.color }} />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Certificate Verification</h1>
          <p style={{ color: '#848484' }}>{statusConfig.label}</p>
        </div>
      </div>

      {/* Status Message */}
      <div className="finance-card p-5 mb-6" style={{ background: statusConfig.bg }}>
        <p className="text-center" style={{ color: '#535353' }}>
          {statusConfig.message}
        </p>
      </div>

      {/* Feedback (if needs resubmission) */}
      {status === 'needs-resubmission' && (
        <div className="finance-card p-4 mb-6" style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
          <p className="text-sm mb-2" style={{ color: '#535353' }}>
            <strong>Moderator Feedback:</strong>
          </p>
          <p className="text-sm" style={{ color: '#848484' }}>
            {feedback}
          </p>
        </div>
      )}

      {/* Uploaded Certificates */}
      <div className="flex-1">
        <h2 className="mb-3" style={{ color: '#535353' }}>Uploaded Certificates</h2>
        <div className="space-y-3 mb-6">
          {certificates.map((cert, index) => (
            <div key={index} className="finance-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(254, 180, 197, 0.1)' }}
                >
                  <FileText className="w-5 h-5" style={{ color: '#FEB4C5' }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#535353' }}>{cert}</p>
                  <p className="text-xs" style={{ color: '#848484' }}>Uploaded</p>
                </div>
              </div>
              {status === 'approved' && (
                <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />
              )}
            </div>
          ))}
        </div>

        {/* Upload More / Resubmit */}
        {(status === 'needs-resubmission' || status === 'submitted') && (
          <div className="relative">
            <div
              className="finance-card p-6 text-center cursor-pointer"
              style={{ background: 'rgba(254, 180, 197, 0.1)' }}
            >
              <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#FEB4C5' }} />
              <p className="text-sm" style={{ color: '#535353' }}>
                {status === 'needs-resubmission' ? 'Upload New Certificates' : 'Add More Certificates'}
              </p>
              <p className="text-xs mt-1" style={{ color: '#848484' }}>
                PDF, JPG, PNG (Max 5MB each)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleAddCertificate}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        )}

        {/* Info */}
        <div className="finance-card p-4 mt-6" style={{ background: 'rgba(254, 180, 197, 0.1)' }}>
          <p className="text-sm" style={{ color: '#848484' }}>
            💡 <strong>Accepted Certificates:</strong>
          </p>
          <ul className="text-xs mt-2 space-y-1" style={{ color: '#848484' }}>
            <li>• Basic Life Support (BLS)</li>
            <li>• First Aid Training</li>
            <li>• Caregiver Certification</li>
            <li>• Nursing Diploma/Degree</li>
            <li>• Specialized Training (Dementia, Palliative, etc.)</li>
          </ul>
        </div>
      </div>

      {/* Action Button */}
      {status === 'needs-resubmission' && (
        <Button
          onClick={() => onNavigate?.('caregiver-pending-verification')}
          className="w-full py-6 mt-6"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
            color: 'white',
            boxShadow: '0px 4px 18px rgba(240, 161, 180, 0.4)'
          }}
        >
          Resubmit Certificates
        </Button>
      )}

      {status === 'approved' && (
        <Button
          onClick={() => onNavigate?.('caregiver-pending-verification')}
          className="w-full py-6 mt-6"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #7CE577 0%, #5FB865 100%)',
            color: 'white'
          }}
        >
          Continue to Next Step
        </Button>
      )}
    </div>
  );
}
