import { XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface AgencyRejectionViewProps {
  reasons: string[];
  onResubmit: () => void;
  onContactSupport: () => void;
}

export function AgencyRejectionView({ reasons, onResubmit, onContactSupport }: AgencyRejectionViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
            <XCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Application Not Approved</h1>
          <p style={{ color: '#848484' }}>
            Your application requires corrections before approval
          </p>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Rejection Reasons</h3>
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

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Resubmission Instructions</h3>
          <ul className="text-sm space-y-2" style={{ color: '#848484' }}>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#5B9FFF' }} />
              <span>Address all the issues mentioned above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#5B9FFF' }} />
              <span>Ensure all documents are clear and valid</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#5B9FFF' }} />
              <span>Double-check all information for accuracy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#5B9FFF' }} />
              <span>Submit your corrected application</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button onClick={onResubmit} className="w-full"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
            <RefreshCw className="w-4 h-4 mr-2" />Edit & Resubmit
          </Button>
          
          <Button onClick={onContactSupport} variant="outline" className="w-full bg-white/50 border-white/50">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}

