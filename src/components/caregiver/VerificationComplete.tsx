import { CheckCircle, ArrowRight, Star } from "lucide-react";
import { Button } from "../ui/button";

interface VerificationCompleteProps {
  caregiverName: string;
  verificationDate: string;
  onContinueToDashboard: () => void;
}

export function VerificationComplete({ caregiverName, verificationDate, onContinueToDashboard }: VerificationCompleteProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Success Animation */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        <h1 className="mb-4" style={{ color: '#535353' }}>Verification Complete!</h1>
        <p className="mb-8" style={{ color: '#848484' }}>
          Congratulations {caregiverName}! Your account has been fully verified and activated.
        </p>

        {/* Success Details */}
        <div className="finance-card p-6 mb-6 text-left">
          <h3 className="mb-4 text-center" style={{ color: '#535353' }}>What's Next?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(142, 197, 252, 0.2)' }}>
                <CheckCircle className="w-4 h-4" style={{ color: '#5B9FFF' }} />
              </div>
              <div>
                <p style={{ color: '#535353' }}>Browse Job Offers</p>
                <p className="text-sm" style={{ color: '#848484' }}>
                  Start receiving job offers matched to your skills
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(168, 224, 99, 0.2)' }}>
                <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />
              </div>
              <div>
                <p style={{ color: '#535353' }}>Complete Your Profile</p>
                <p className="text-sm" style={{ color: '#848484' }}>
                  Add more details to attract more opportunities
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255, 179, 193, 0.2)' }}>
                <Star className="w-4 h-4" style={{ color: '#FFB3C1' }} />
              </div>
              <div>
                <p style={{ color: '#535353' }}>Build Your Reputation</p>
                <p className="text-sm" style={{ color: '#848484' }}>
                  Provide excellent care to earn high ratings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Date */}
        <p className="text-sm mb-6" style={{ color: '#848484' }}>
          Verified on: {verificationDate}
        </p>

        {/* Continue Button */}
        <Button onClick={onContinueToDashboard} className="w-full"
          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
          Continue to Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

