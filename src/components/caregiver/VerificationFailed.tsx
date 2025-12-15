import { XCircle, AlertCircle, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

interface VerificationFailedProps {
  reasons: string[];
  canReapply: boolean;
  reapplicationDate?: string;
  onReapply: () => void;
  onContactSupport: () => void;
}

export function VerificationFailed({
  reasons,
  canReapply,
  reapplicationDate,
  onReapply,
  onContactSupport
}: VerificationFailedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Failure Icon */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
          <XCircle className="w-12 h-12 text-white" />
        </div>

        <h1 className="mb-4 text-center" style={{ color: '#535353' }}>Verification Not Approved</h1>
        <p className="mb-8 text-center" style={{ color: '#848484' }}>
          Unfortunately, your verification application was not approved at this time.
        </p>

        {/* Rejection Reasons */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Reasons for Rejection</h3>
          <div className="space-y-3">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: 'rgba(255, 179, 193, 0.1)' }}>
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#FF8FA3' }} />
                <p className="text-sm" style={{ color: '#535353' }}>{reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reapplication Info */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>What You Can Do</h3>
          
          {canReapply ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(142, 197, 252, 0.2)' }}>
                  <RefreshCw className="w-4 h-4" style={{ color: '#5B9FFF' }} />
                </div>
                <div>
                  <p style={{ color: '#535353' }}>Reapply</p>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    Address the issues mentioned above and submit a new application
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(168, 224, 99, 0.2)' }}>
                  <MessageSquare className="w-4 h-4" style={{ color: '#7CE577' }} />
                </div>
                <div>
                  <p style={{ color: '#535353' }}>Contact Support</p>
                  <p className="text-sm" style={{ color: '#848484' }}>
                    Get clarification on the rejection reasons
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 209, 128, 0.1)' }}>
              <p className="text-sm" style={{ color: '#535353' }}>
                You can reapply starting from: <strong>{reapplicationDate}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {canReapply && (
            <Button onClick={onReapply} className="w-full"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
              <RefreshCw className="w-4 h-4 mr-2" />Start New Application
            </Button>
          )}
          
          <Button onClick={onContactSupport} variant="outline" className="w-full bg-white/50 border-white/50">
            <MessageSquare className="w-4 h-4 mr-2" />Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}

