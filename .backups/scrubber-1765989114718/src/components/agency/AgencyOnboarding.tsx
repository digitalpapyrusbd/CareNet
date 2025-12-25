import { MapPin, Wallet, Package, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

interface AgencyOnboardingProps {
  onComplete: () => void;
}

export function AgencyOnboarding({ onComplete }: AgencyOnboardingProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-6 text-center" style={{ color: '#535353' }}>Welcome to CareNet!</h1>
        <p className="mb-8 text-center" style={{ color: '#848484' }}>
          Let's set up your agency profile to start operations
        </p>

        <div className="space-y-4 mb-8">
          <div className="finance-card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' }}>
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2" style={{ color: '#535353' }}>Service Zones</h3>
                <p className="text-sm mb-3" style={{ color: '#848484' }}>
                  Select the areas where your agency provides services
                </p>
                <Button size="sm" style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                  color: 'white'
                }}>
                  Configure Zones
                </Button>
              </div>
            </div>
          </div>

          <div className="finance-card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2" style={{ color: '#535353' }}>Payment Method</h3>
                <p className="text-sm mb-3" style={{ color: '#848484' }}>
                  Verify your payout information
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />
                  <span className="text-sm" style={{ color: '#7CE577' }}>Configured</span>
                </div>
              </div>
            </div>
          </div>

          <div className="finance-card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2" style={{ color: '#535353' }}>Create Your First Package</h3>
                <p className="text-sm mb-3" style={{ color: '#848484' }}>
                  Create care packages to offer to guardians
                </p>
                <Button size="sm" style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                  color: 'white'
                }}>
                  Create Package
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={onComplete} className="w-full"
          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
          Complete Setup
        </Button>
      </div>
    </div>
  );
}

