import { Upload, FileText, Image, ArrowRight, X } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useState } from "react";

interface AgencyRegistrationStep4Props {
  onContinue: (data: any) => void;
  onBack: () => void;
}

export function AgencyRegistrationStep4({ onContinue, onBack }: AgencyRegistrationStep4Props) {
  const [files, setFiles] = useState({
    tradeLicense: null as File | null,
    tinCertificate: null as File | null,
    companyLogo: null as File | null
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md finance-card p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 style={{ color: '#535353' }}>Document Upload</h2>
          <p className="text-sm" style={{ color: '#848484' }}>Step 4 of 5</p>
        </div>

        <div className="space-y-4">
          {/* Trade License */}
          <div>
            <Label style={{ color: '#535353' }}>Trade License * (Required)</Label>
            <label className="mt-2 flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed cursor-pointer hover:bg-white/30 transition-all"
              style={{ borderColor: files.tradeLicense ? '#7CE577' : 'rgba(255, 255, 255, 0.5)' }}>
              {files.tradeLicense ? (
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#7CE577' }} />
                  <p className="text-sm mb-1" style={{ color: '#535353' }}>{files.tradeLicense.name}</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setFiles({ ...files, tradeLicense: null });
                    }}
                    className="text-xs" style={{ color: '#FF6B7A' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#848484' }} />
                  <p className="text-sm" style={{ color: '#535353' }}>Upload Trade License</p>
                  <p className="text-xs" style={{ color: '#848484' }}>PDF, JPG, PNG (Max 5MB)</p>
                </div>
              )}
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFiles({ ...files, tradeLicense: e.target.files?.[0] || null })}
                className="hidden"
              />
            </label>
          </div>

          {/* TIN Certificate */}
          <div>
            <Label style={{ color: '#535353' }}>TIN Certificate (Optional)</Label>
            <label className="mt-2 flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed cursor-pointer hover:bg-white/30 transition-all"
              style={{ borderColor: files.tinCertificate ? '#7CE577' : 'rgba(255, 255, 255, 0.5)' }}>
              {files.tinCertificate ? (
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#7CE577' }} />
                  <p className="text-sm mb-1" style={{ color: '#535353' }}>{files.tinCertificate.name}</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setFiles({ ...files, tinCertificate: null });
                    }}
                    className="text-xs" style={{ color: '#FF6B7A' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#848484' }} />
                  <p className="text-sm" style={{ color: '#535353' }}>Upload TIN Certificate</p>
                  <p className="text-xs" style={{ color: '#848484' }}>PDF, JPG, PNG (Max 5MB)</p>
                </div>
              )}
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFiles({ ...files, tinCertificate: e.target.files?.[0] || null })}
                className="hidden"
              />
            </label>
          </div>

          {/* Company Logo */}
          <div>
            <Label style={{ color: '#535353' }}>Company Logo (Optional)</Label>
            <label className="mt-2 flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed cursor-pointer hover:bg-white/30 transition-all"
              style={{ borderColor: files.companyLogo ? '#7CE577' : 'rgba(255, 255, 255, 0.5)' }}>
              {files.companyLogo ? (
                <div className="text-center">
                  <Image className="w-8 h-8 mx-auto mb-2" style={{ color: '#7CE577' }} />
                  <p className="text-sm mb-1" style={{ color: '#535353' }}>{files.companyLogo.name}</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setFiles({ ...files, companyLogo: null });
                    }}
                    className="text-xs" style={{ color: '#FF6B7A' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#848484' }} />
                  <p className="text-sm" style={{ color: '#535353' }}>Upload Company Logo</p>
                  <p className="text-xs" style={{ color: '#848484' }}>PNG, JPG (Max 2MB)</p>
                </div>
              )}
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => setFiles({ ...files, companyLogo: e.target.files?.[0] || null })}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Back
          </Button>
          <Button
            onClick={() => onContinue(files)}
            disabled={!files.tradeLicense}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white',
              opacity: !files.tradeLicense ? 0.5 : 1
            }}
          >
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

