import { useState } from 'react';
import { ArrowLeft, Shield, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface VerificationPoliceClearanceProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function VerificationPoliceClearance({ onNavigate, onBack }: VerificationPoliceClearanceProps) {
  const [document, setDocument] = useState<string | null>(null);
  const [status] = useState<'pending' | 'submitted' | 'verified'>('pending');

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument(file.name);
    }
  };

  const handleSubmit = () => {
    onNavigate?.('caregiver-pending-verification');
  };

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
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
              boxShadow: '0px 4px 18px rgba(240, 161, 180, 0.4)'
            }}
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Police Clearance</h1>
          <p style={{ color: '#848484' }}>Background Verification</p>
        </div>
      </div>

      {/* Status Message */}
      {status === 'verified' && (
        <div className="finance-card p-5 mb-6" style={{ background: 'rgba(124, 229, 119, 0.1)' }}>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6" style={{ color: '#7CE577' }} />
            <div>
              <p style={{ color: '#535353' }}>Police clearance verified</p>
              <p className="text-sm" style={{ color: '#848484' }}>Your background check is complete</p>
            </div>
          </div>
        </div>
      )}

      {status === 'submitted' && (
        <div className="finance-card p-5 mb-6" style={{ background: 'rgba(254, 180, 197, 0.1)' }}>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 animate-pulse" style={{ color: '#FEB4C5' }} />
            <div>
              <p style={{ color: '#535353' }}>Under Review</p>
              <p className="text-sm" style={{ color: '#848484' }}>Verification takes 3-5 business days</p>
            </div>
          </div>
        </div>
      )}

      {/* Information Card */}
      <div className="finance-card p-5 mb-6">
        <h2 className="mb-3" style={{ color: '#535353' }}>What is Police Clearance?</h2>
        <p className="text-sm mb-3" style={{ color: '#848484' }}>
          A police clearance certificate is a document that verifies you have no criminal record. This is required for all caregivers to ensure patient safety.
        </p>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(254, 180, 197, 0.2)' }}>
              <span className="text-xs" style={{ color: '#FEB4C5' }}>1</span>
            </div>
            <p className="text-sm" style={{ color: '#848484' }}>
              Visit your local police station or apply online through Bangladesh Police website
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(254, 180, 197, 0.2)' }}>
              <span className="text-xs" style={{ color: '#FEB4C5' }}>2</span>
            </div>
            <p className="text-sm" style={{ color: '#848484' }}>
              Provide your NID and passport-sized photo
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(254, 180, 197, 0.2)' }}>
              <span className="text-xs" style={{ color: '#FEB4C5' }}>3</span>
            </div>
            <p className="text-sm" style={{ color: '#848484' }}>
              Upload the certificate here once received
            </p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="flex-1">
        <h2 className="mb-3" style={{ color: '#535353' }}>Upload Police Clearance Certificate</h2>
        
        {document ? (
          <div className="finance-card p-5 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(124, 229, 119, 0.1)' }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: '#7CE577' }} />
              </div>
              <div className="flex-1">
                <p style={{ color: '#535353' }}>{document}</p>
                <p className="text-sm" style={{ color: '#848484' }}>Document uploaded</p>
              </div>
              <button
                onClick={() => setDocument(null)}
                className="text-sm"
                style={{ color: '#FF6B6B' }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="relative mb-4">
            <div
              className="finance-card p-8 text-center cursor-pointer border-2 border-dashed"
              style={{ borderColor: 'rgba(254, 180, 197, 0.3)', background: 'rgba(254, 180, 197, 0.05)' }}
            >
              <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: '#FEB4C5' }} />
              <p style={{ color: '#535353' }}>Click to upload certificate</p>
              <p className="text-sm mt-1" style={{ color: '#848484' }}>
                PDF or Image (Max 10MB)
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleDocumentUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        )}

        {/* Important Notice */}
        <div className="finance-card p-4" style={{ background: 'rgba(254, 180, 197, 0.1)' }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#FEB4C5' }} />
            <div>
              <p className="text-sm mb-1" style={{ color: '#535353' }}>
                <strong>Important:</strong>
              </p>
              <ul className="text-xs space-y-1" style={{ color: '#848484' }}>
                <li>• Document must be recent (issued within last 6 months)</li>
                <li>• Must be from Bangladesh Police</li>
                <li>• All text must be clearly visible</li>
                <li>• Accepted formats: PDF, JPG, PNG</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleSubmit}
        disabled={!document}
        className="w-full py-6 mt-6"
        style={{
          background: !document
            ? 'rgba(132, 132, 132, 0.3)'
            : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FEB4C5 0%, #DB869A 100%)',
          color: 'white',
          boxShadow: !document ? 'none' : '0px 4px 18px rgba(240, 161, 180, 0.4)',
          cursor: !document ? 'not-allowed' : 'pointer'
        }}
      >
        {status === 'verified' ? 'Continue to Next Step' : 'Submit for Verification'}
      </Button>
    </div>
  );
}
