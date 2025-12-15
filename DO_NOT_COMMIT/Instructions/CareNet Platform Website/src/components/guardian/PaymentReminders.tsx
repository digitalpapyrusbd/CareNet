import { AlertTriangle, Clock, CreditCard, X } from "lucide-react";
import { Button } from "../ui/button";

interface PaymentReminderProps {
  stage: "day3" | "day5" | "day6";
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
  onPayNow: () => void;
  onDismiss?: () => void;
}

export function PaymentReminder({ stage, invoiceNumber, amount, dueDate, daysRemaining, onPayNow, onDismiss }: PaymentReminderProps) {
  const config = {
    day3: {
      title: "Payment Reminder",
      icon: Clock,
      iconGradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
      message: `Your invoice is due in ${daysRemaining} days`,
      urgency: "low",
      showDismiss: true
    },
    day5: {
      title: "Payment Due Soon",
      icon: AlertTriangle,
      iconGradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)',
      message: `Account will be restricted in ${daysRemaining} days`,
      urgency: "medium",
      showDismiss: true
    },
    day6: {
      title: "Urgent: Payment Required",
      icon: AlertTriangle,
      iconGradient: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)',
      message: "Account will be locked tomorrow if payment is not received",
      urgency: "high",
      showDismiss: false
    }
  };

  const current = config[stage];
  const Icon = current.icon;

  const featuresToLock = [
    "Browse new care packages",
    "Book new services",
    "Add new patients",
    "Request custom quotes"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={current.showDismiss ? onDismiss : undefined} />

      <div className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl finance-card p-6">
        {/* Dismiss Button */}
        {current.showDismiss && onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/50"
            style={{ color: '#848484' }}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: current.iconGradient,
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)'
            }}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="mb-2" style={{ color: '#535353' }}>{current.title}</h2>
          <p className="mb-4" style={{ color: '#848484' }}>
            {current.message}
          </p>
        </div>

        {/* Invoice Details */}
        <div className="finance-card p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Invoice Number:</span>
              <span style={{ color: '#535353' }}>{invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Amount Due:</span>
              <span className="text-lg" style={{ color: current.urgency === 'high' ? '#FF6B7A' : '#535353' }}>
                ৳{amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Due Date:</span>
              <span style={{ color: '#535353' }}>{dueDate}</span>
            </div>
            {daysRemaining >= 0 && (
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Days Remaining:</span>
                <span style={{ color: current.urgency === 'high' ? '#FF6B7A' : current.urgency === 'medium' ? '#FFB74D' : '#535353' }}>
                  {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Warning for Day 6 */}
        {stage === 'day6' && (
          <div className="mb-6">
            <div 
              className="p-4 rounded-lg mb-4"
              style={{ background: 'rgba(255, 107, 122, 0.1)' }}
            >
              <p className="text-sm mb-3" style={{ color: '#535353' }}>
                <strong>The following features will be locked:</strong>
              </p>
              <ul className="space-y-1">
                {featuresToLock.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF6B7A' }} />
                    <span style={{ color: '#535353' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onPayNow}
            className="w-full"
            size="lg"
            style={{
              background: current.urgency === 'high' 
                ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)'
                : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
              color: 'white',
              border: 'none'
            }}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Pay Now
          </Button>

          {current.showDismiss && onDismiss && (
            <Button
              onClick={onDismiss}
              variant="outline"
              className="w-full bg-white/50 border-white/50"
              style={{ color: '#535353' }}
            >
              Remind Me Later
            </Button>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-xs text-center mt-4" style={{ color: '#848484' }}>
          {stage === 'day6' 
            ? "Your account will be automatically restricted if payment is not received by the due date."
            : "You can make payments through bKash, Nagad, or bank transfer."
          }
        </p>
      </div>
    </div>
  );
}
