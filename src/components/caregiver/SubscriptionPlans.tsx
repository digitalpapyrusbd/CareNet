import { Check, Crown, Zap, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface SubscriptionPlansProps {
  currentPlan: 'free' | 'basic' | 'premium' | null;
  onSelectPlan: (planId: string) => void;
  onBack: () => void;
}

export function SubscriptionPlans({ currentPlan, onSelectPlan, onBack }: SubscriptionPlansProps) {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      icon: Check,
      gradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
      features: [
        'Accept up to 3 jobs per month',
        'Basic profile listing',
        'Standard support',
        '10% platform fee',
        'Manual payouts'
      ],
      limitations: [
        'Limited job visibility',
        'No priority placement',
        'No analytics'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 299,
      period: 'month',
      icon: Zap,
      gradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
      popular: true,
      features: [
        'Unlimited job applications',
        'Enhanced profile visibility',
        'Priority support',
        '7% platform fee',
        'Automated weekly payouts',
        'Basic analytics dashboard',
        'Profile badge'
      ],
      limitations: []
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 599,
      period: 'month',
      icon: Crown,
      gradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
      features: [
        'Everything in Basic',
        'Top placement in search',
        'Dedicated account manager',
        '5% platform fee',
        'Instant payouts',
        'Advanced analytics',
        'Featured caregiver badge',
        'Priority job matching',
        'Training resources',
        'Insurance assistance'
      ],
      limitations: []
    }
  ];

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#535353' }}>Subscription Plans</h1>
          <p style={{ color: '#848484' }}>Choose the plan that works best for you</p>
        </div>

        {/* Current Plan Banner */}
        {currentPlan && (
          <div 
            className="finance-card p-4 mb-6"
            style={{ borderLeft: '4px solid #7CE577' }}
          >
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" style={{ color: '#7CE577' }} />
              <p style={{ color: '#535353' }}>
                Current Plan: <strong className="capitalize">{currentPlan}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Plans */}
        <div className="space-y-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.id;

            return (
              <div
                key={plan.id}
                className="finance-card p-6 relative"
                style={{
                  borderLeft: plan.popular ? '4px solid #FFB3C1' : 'none',
                  opacity: isCurrent ? 0.8 : 1
                }}
              >
                {plan.popular && (
                  <div 
                    className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs"
                    style={{ background: '#FFB3C1', color: 'white' }}
                  >
                    Most Popular
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: plan.gradient }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 style={{ color: '#535353' }}>{plan.name}</h3>
                      {isCurrent && (
                        <span className="text-xs" style={{ color: '#7CE577' }}>Active</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl" style={{ color: '#535353' }}>
                      {plan.price === 0 ? 'Free' : `৳${plan.price}`}
                    </p>
                    {plan.price > 0 && (
                      <p className="text-sm" style={{ color: '#848484' }}>/{plan.period}</p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-sm mb-3" style={{ color: '#848484' }}>Features:</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#7CE577' }} />
                        <span style={{ color: '#535353' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="mb-4 pb-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <p className="text-sm mb-2" style={{ color: '#848484' }}>Limitations:</p>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-sm" style={{ color: '#848484' }}>
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                {isCurrent ? (
                  <div 
                    className="w-full py-3 rounded-lg text-center text-sm"
                    style={{ background: 'rgba(124, 229, 119, 0.2)', color: '#7CE577' }}
                  >
                    Current Plan
                  </div>
                ) : (
                  <Button
                    onClick={() => onSelectPlan(plan.id)}
                    className="w-full"
                    style={{
                      background: plan.gradient,
                      color: 'white'
                    }}
                  >
                    {currentPlan ? (currentPlan === 'free' ? 'Upgrade' : 'Switch') : 'Choose'} Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div 
          className="mt-6 p-4 rounded-lg"
          style={{ background: 'rgba(142, 197, 252, 0.1)' }}
        >
          <p className="text-sm" style={{ color: '#535353' }}>
            💡 <strong>Platform fees</strong> are only charged on successful job completions. You can upgrade, downgrade, or cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
