import { CheckCircle, Calendar, CreditCard, Package } from "lucide-react";
import { Button } from "../ui/button";

interface SubscriptionActiveProps {
  planName: string;
  monthlyFee: number;
  nextBillingDate: string;
  caregiverLimit: number;
  currentCaregivers: number;
  features: string[];
  onManageSubscription: () => void;
}

export function SubscriptionActive({
  planName,
  monthlyFee,
  nextBillingDate,
  caregiverLimit,
  currentCaregivers,
  features,
  onManageSubscription
}: SubscriptionActiveProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>Active Subscription</h1>

        <div className="finance-card p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="mb-1" style={{ color: '#535353' }}>{planName}</h2>
              <p className="text-sm" style={{ color: '#848484' }}>Monthly Subscription</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(124, 229, 119, 0.2)' }}>
              <CheckCircle className="w-4 h-4" style={{ color: '#7CE577' }} />
              <span style={{ color: '#7CE577' }}>Active</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <CreditCard className="w-5 h-5 mb-2" style={{ color: '#5B9FFF' }} />
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Monthly Fee</p>
              <p className="text-xl" style={{ color: '#535353' }}>৳{monthlyFee.toLocaleString()}</p>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <Calendar className="w-5 h-5 mb-2" style={{ color: '#FFD180' }} />
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Next Billing</p>
              <p className="text-xl" style={{ color: '#535353' }}>{nextBillingDate}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: '#535353' }}>Caregiver Slots</span>
              <span style={{ color: '#535353' }}>{currentCaregivers}/{caregiverLimit}</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <div
                className="h-full transition-all"
                style={{
                  width: `${(currentCaregivers / caregiverLimit) * 100}%`,
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                }}
              />
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Plan Features</h3>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 shrink-0" style={{ color: '#7CE577' }} />
                <span style={{ color: '#535353' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={onManageSubscription} className="w-full"
          style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)', color: 'white' }}>
          <Package className="w-4 h-4 mr-2" />Manage Subscription
        </Button>
      </div>
    </div>
  );
}

