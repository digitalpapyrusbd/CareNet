import { ArrowLeft, Check, Crown, Zap, Star } from 'lucide-react';
import { Button } from '../ui/button';

interface SubscriptionPlansProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

const PLANS = [
  {
    name: 'Basic',
    price: '৳500',
    period: '/month',
    icon: Zap,
    color: '#9B9CF8',
    features: ['Access to job listings', 'Basic profile visibility', 'Up to 5 job applications/month', 'Standard support'],
    popular: false
  },
  {
    name: 'Professional',
    price: '৳1,200',
    period: '/month',
    icon: Crown,
    color: '#FEB4C5',
    features: ['Unlimited job applications', 'Priority profile visibility', 'Featured caregiver badge', 'Direct agency contact', 'Priority support', 'Training resources'],
    popular: true
  },
  {
    name: 'Premium',
    price: '৳2,000',
    period: '/month',
    icon: Star,
    color: '#FFD54F',
    features: ['All Professional features', 'Exclusive job opportunities', 'Personal career coach', 'Advanced analytics', '24/7 premium support', 'Insurance coverage'],
    popular: false
  }
];

export function SubscriptionPlans({ onNavigate, onBack }: SubscriptionPlansProps) {
  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F5F7FA' }}>
      <div className="finance-card p-6 mb-4">
        <Button variant="ghost" onClick={() => onBack?.()} className="mb-4 hover:bg-white/30" style={{ color: '#535353' }}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 style={{ color: '#535353' }}>Subscription Plans</h1>
        <p style={{ color: '#848484' }}>Choose the plan that works for you</p>
      </div>

      <div className="px-6 space-y-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <div key={plan.name} className={`finance-card p-6 ${plan.popular ? 'ring-2' : ''}`}
              style={{ borderColor: plan.popular ? plan.color : 'transparent' }}>
              {plan.popular && (
                <div className="inline-block px-3 py-1 rounded-full text-xs mb-4"
                  style={{ background: `${plan.color}20`, color: plan.color }}>
                  ⭐ Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: `${plan.color}20` }}>
                  <Icon className="w-6 h-6" style={{ color: plan.color }} />
                </div>
                <div>
                  <h2 style={{ color: '#535353' }}>{plan.name}</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl" style={{ color: plan.color }}>{plan.price}</span>
                    <span className="text-sm" style={{ color: '#848484' }}>{plan.period}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#7CE577' }} />
                    <span className="text-sm" style={{ color: '#535353' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <Button onClick={() => onNavigate?.('caregiver-home')} className="w-full py-4"
                style={{
                  background: plan.popular
                    ? `radial-gradient(143.86% 887.35% at -10.97% -22.81%, ${plan.color} 0%, ${plan.color}CC 100%)`
                    : `${plan.color}20`,
                  color: plan.popular ? 'white' : plan.color
                }}>
                {plan.popular ? 'Subscribe Now' : 'Choose Plan'}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="px-6 mt-6">
        <div className="finance-card p-5" style={{ background: 'rgba(254, 180, 197, 0.1)' }}>
          <p className="text-sm text-center" style={{ color: '#848484' }}>
            💡 Cancel anytime • All plans include secure payments • No hidden fees
          </p>
        </div>
      </div>
    </div>
  );
}
