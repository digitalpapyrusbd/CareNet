import { Check, Crown } from "lucide-react";
import { Button } from "../ui/button";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
}

interface SubscriptionPlansProps {
  plans: Plan[];
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
}

export function SubscriptionPlans({ plans, currentPlan, onSelectPlan }: SubscriptionPlansProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-2" style={{ color: '#535353' }}>Subscription Plans</h1>
        <p className="mb-6" style={{ color: '#848484' }}>Choose the plan that fits your agency needs</p>

        <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan.id} className="finance-card p-6"
              style={{ borderLeft: plan.recommended ? '4px solid #FFB3C1' : 'none' }}>
              {plan.recommended && (
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-4 h-4" style={{ color: '#FFB3C1' }} />
                  <span className="text-xs px-2 py-1 rounded-full"
                    style={{ background: 'rgba(255, 179, 193, 0.2)', color: '#FF8FA3' }}>
                    Recommended
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="mb-1" style={{ color: '#535353' }}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl" style={{ color: '#535353' }}>৳{plan.price.toLocaleString()}</span>
                    <span className="text-sm" style={{ color: '#848484' }}>/{plan.period}</span>
                  </div>
                </div>
                {currentPlan === plan.id && (
                  <span className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(124, 229, 119, 0.2)', color: '#7CE577' }}>
                    Current Plan
                  </span>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#7CE577' }} />
                    <span style={{ color: '#535353' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => onSelectPlan(plan.id)}
                disabled={currentPlan === plan.id}
                className="w-full"
                style={{
                  background: plan.recommended 
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)'
                    : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                  color: 'white'
                }}>
                {currentPlan === plan.id ? 'Current Plan' : currentPlan ? 'Switch Plan' : 'Subscribe'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

