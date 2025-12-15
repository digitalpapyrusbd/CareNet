import { Shield, Upload, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface VerificationPoliceClearanceProps {
  onSubmit: (file: File) => void;
  onSkip: () => void;
  status?: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

export function VerificationPoliceClearance({ onSubmit, onSkip, status, feedback }: VerificationPoliceClearanceProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>Step 2: Police Clearance</h1>
          <p style={{ color: '#848484' }}>Upload your police clearance certificate</p>
        </div>

        {status && (
          <div className="finance-card p-4 mb-6" style={{
            borderLeft: `4px solid ${status === 'approved' ? '#7CE577' : status === 'rejected' ? '#FF6B7A' : '#FFD180'}`
          }}>
            <div className="flex items-center gap-3 mb-2">
              {status === 'approved' && <CheckCircle className="w-5 h-5" style={{ color: '#7CE577' }} />}
              {status === 'rejected' && <XCircle className="w-5 h-5" style={{ color: '#FF6B7A' }} />}
              <p style={{ color: '#535353' }}>
                {status === 'approved' && 'Police Clearance Approved'}
                {status === 'rejected' && 'Police Clearance Rejected'}
                {status === 'pending' && 'Under Review'}
              </p>
            </div>
            {feedback && <p className="text-sm" style={{ color: '#848484' }}>{feedback}</p>}
          </div>
        )}

        <div className="finance-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #B8A7FF 0%, #8B7AE8 100%)' }}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 style={{ color: '#535353' }}>Police Clearance Certificate</h3>
              <p className="text-sm" style={{ color: '#848484' }}>Must be issued within last 6 months</p>
            </div>
          </div>

          <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(142, 197, 252, 0.1)' }}>
            <p className="text-sm mb-2" style={{ color: '#535353' }}>Requirements:</p>
            <ul className="space-y-1 text-sm" style={{ color: '#848484' }}>
              <li>• Clear scan or photo of certificate</li>
              <li>• All text must be readable</li>
              <li>• Certificate must be valid</li>
              <li>• PDF or Image format (max 5MB)</li>
            </ul>
          </div>

          <div className="border-2 border-dashed rounded-lg p-8 text-center"
            style={{ borderColor: 'rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.3)' }}>
            <Upload className="w-12 h-12 mx-auto mb-3" style={{ color: '#848484' }} />
            <p className="mb-2" style={{ color: '#535353' }}>Drop file here or click to browse</p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="clearance-upload"
            />
            <label htmlFor="clearance-upload">
              <Button type="button" variant="outline" className="bg-white/50 border-white/50"
                onClick={() => document.getElementById('clearance-upload')?.click()}>
                Select File
              </Button>
            </label>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'rgba(124, 229, 119, 0.1)' }}>
              <span className="text-sm" style={{ color: '#535353' }}>{file.name}</span>
              <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button onClick={onSkip} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Skip for Now
          </Button>
          <Button onClick={() => file && onSubmit(file)} disabled={!file} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)', color: 'white' }}>
            Submit Clearance
          </Button>
        </div>
      </div>
    </div>
  );
}

