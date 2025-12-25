import { FileText, Upload, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface VerificationCertificatesProps {
  onSubmit: (files: File[]) => void;
  onSkip: () => void;
  status?: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

export function VerificationCertificates({ onSubmit, onSkip, status, feedback }: VerificationCertificatesProps) {
  const { t } = useTranslationContext();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>{t('verificationcertificates.heading.step1certificates')}</h1>
          <p style={{ color: '#848484' }}>{t('verificationcertificates.text.uploadyourmedicalcer')}</p>
        </div>

        {status && (
          <div className="finance-card p-4 mb-6" style={{
            borderLeft: `4px solid ${status === 'approved' ? '#7CE577' : status === 'rejected' ? '#FF6B7A' : '#FFD180'}`
          }}>
            <div className="flex items-center gap-3 mb-2">
              {status === 'approved' && <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />}
              {status === 'rejected' && <XCircle className="w-5 h-5" style={{ color: '#FF6B7A' }} />}
              <p style={{ color: '#535353' }}>
                {status === 'approved' && 'Certificates Approved'}
                {status === 'rejected' && 'Certificates Rejected'}
                {status === 'pending' && 'Under Review'}
              </p>
            </div>
            {feedback && <p className="text-sm" style={{ color: '#848484' }}>{feedback}</p>}
          </div>
        )}

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>{t('verificationcertificates.heading.requireddocuments')}</h3>
              <p className="text-sm" style={{ color: '#848484' }}>PDF or Image files (max 5MB each)</p>
            </div>
          </div>

          <ul className="space-y-2 mb-6 text-sm" style={{ color: '#535353' }}>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#5B9FFF' }} />
              Medical training certificate
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#5B9FFF' }} />
              First aid certification (if applicable)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#5B9FFF' }} />
              Specialized care certifications
            </li>
          </ul>

          <div className="border-2 border-dashed rounded-lg p-8 text-center"
            style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.3)' }}>
            <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: '#848484' }} />
            <p className="mb-2" style={{ color: '#535353' }}>{t('verificationcertificates.text.dropfileshereorclick')}</p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button type="button" variant="outline" className="bg-white/50 border-white/50"
                onClick={() => document.getElementById('file-upload')?.click()}>
                Select Files
              </Button>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'rgba(124, 229, 119, 0.1)' }}>
                  <span className="text-sm" style={{ color: '#535353' }}>{file.name}</span>
                  <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button onClick={onSkip} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Skip for Now
          </Button>
          <Button onClick={() => onSubmit(files)} disabled={files.length === 0} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            Submit Certificates
          </Button>
        </div>
      </div>
    </div>
  );
}

