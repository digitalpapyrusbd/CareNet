import { XCircle, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

interface AdminMFAFailedProps {
  attempts: number;
  maxAttempts: number;
  lockoutTime?: string;
  onRetry: () => void;
  onContactSupport: () => void;
}

export function AdminMFAFailed({ attempts, maxAttempts, lockoutTime, onRetry, onContactSupport }: AdminMFAFailedProps) {
  const isLocked = attempts >= maxAttempts;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md finance-card p-8">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
            <XCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="mb-2" style={{ color: '#535353' }}>
            {isLocked ? 'Account Temporarily Locked' : 'MFA Verification Failed'}
          </h2>
          <p style={{ color: '#848484' }}>
            {isLocked 
              ? 'Too many failed attempts. Your account has been temporarily locked.'
              : 'The verification code you entered was incorrect.'
            }
          </p>
        </div>

        <div className="finance-card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: '#848484' }}>Attempts:</span>
            <span style={{ color: isLocked ? '#FF6B7A' : '#FFD180' }}>
              {attempts}/{maxAttempts}
            </span>
          </div>
          {isLocked && lockoutTime && (
            <div className="flex items-center justify-between">
              <span style={{ color: '#848484' }}>Unlock Time:</span>
              <span style={{ color: '#535353' }}>{lockoutTime}</span>
            </div>
          )}
        </div>

        <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(255, 179, 193, 0.1)' }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#FF8FA3' }} />
            <div>
              <p className="text-sm mb-2" style={{ color: '#535353' }}>Security Notice</p>
              <p className="text-xs" style={{ color: '#848484' }}>
                {isLocked 
                  ? 'This incident has been logged. Contact support if you need immediate access.'
                  : 'Multiple failed attempts will result in temporary account lockout for security.'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {!isLocked && (
            <Button onClick={onRetry} className="w-full"
              style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
              <RefreshCw className="w-4 h-4 mr-2" />Try Again
            </Button>
          )}
          
          <Button onClick={onContactSupport} variant="outline" className="w-full bg-white/50 border-white/50">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}

