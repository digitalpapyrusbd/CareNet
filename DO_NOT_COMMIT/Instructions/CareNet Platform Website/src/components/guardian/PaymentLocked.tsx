import { Lock, AlertTriangle, Check, X, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface PaymentLockedProps {
  accountType?: "guardian" | "agency" | "caregiver" | "shop";
  outstandingAmount?: number;
  daysPastDue?: number;
  onPayNow?: () => void;
  onNavigate?: (page: string) => void;
}

export function PaymentLocked({ 
  accountType = "guardian", 
  outstandingAmount = 5000, 
  daysPastDue = 15, 
  onPayNow, 
  onNavigate 
}: PaymentLockedProps) {
  const restrictedFeatures = {
    guardian: [
      "Browse new packages",
      "Book new care services",
      "Add new patients",
      "Request custom quotes"
    ],
    agency: [
      "Accept new bookings",
      "Add new caregivers",
      "Create new packages",
      "Update package pricing"
    ],
    caregiver: [
      "Accept new job offers",
      "Update availability",
      "Generate new invoices",
      "Apply for new positions"
    ],
    shop: [
      "List new products",
      "Process new orders",
      "Update product listings",
      "Run promotions"
    ]
  };

  const allowedFeatures = {
    guardian: [
      "View existing patients",
      "Communicate with caregivers",
      "Monitor active jobs",
      "Make payment"
    ],
    agency: [
      "Manage existing jobs",
      "Communicate with clients",
      "View caregiver roster",
      "Make payment"
    ],
    caregiver: [
      "Complete existing jobs",
      "Communicate with guardians",
      "View care logs",
      "Make payment"
    ],
    shop: [
      "Fulfill existing orders",
      "Communicate with customers",
      "View inventory",
      "Make payment"
    ]
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Back Button */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={() => onNavigate?.('toc')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: '#535353' }} />
        </button>
      </div>

      {/* Lock Icon */}
      <div 
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{
          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FF6B7A 0%, #FF8FA3 100%)',
          boxShadow: '0px 4px 18px rgba(255, 107, 122, 0.35)'
        }}
      >
        <Lock className="w-10 h-10 text-white" />
      </div>

      {/* Main Message */}
      <div className="w-full max-w-md finance-card p-8 mb-6">
        <div className="text-center mb-6">
          <h2 className="mb-2" style={{ color: '#535353' }}>Account Restricted</h2>
          <p style={{ color: '#848484' }}>
            Your account has been restricted due to outstanding payment
          </p>
        </div>

        {/* Outstanding Amount */}
        <div className="finance-card p-6 mb-6 text-center">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>Outstanding Balance</p>
          <p className="text-3xl mb-2" style={{ color: '#FF6B7A' }}>
            ৳{outstandingAmount.toLocaleString()}
          </p>
          <p className="text-sm" style={{ color: '#848484' }}>
            {daysPastDue} {daysPastDue === 1 ? 'day' : 'days'} past due
          </p>
        </div>

        {/* Pay Now Button */}
        <Button
          onClick={onPayNow}
          className="w-full mb-4"
          size="lg"
          style={{
            background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
            boxShadow: '0px 4px 18px rgba(255, 143, 163, 0.35)',
            color: 'white',
            border: 'none'
          }}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Pay Outstanding Balance
        </Button>

        <p className="text-xs text-center" style={{ color: '#848484' }}>
          Your account will be reactivated immediately after payment
        </p>
      </div>

      {/* Restricted Features */}
      <div className="w-full max-w-md finance-card p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <X className="w-5 h-5" style={{ color: '#FF6B7A' }} />
          <h3 style={{ color: '#535353' }}>Restricted Features</h3>
        </div>
        <ul className="space-y-2">
          {restrictedFeatures[accountType].map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <X className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#FF6B7A' }} />
              <span style={{ color: '#535353' }}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Allowed Features */}
      <div className="w-full max-w-md finance-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Check className="w-5 h-5" style={{ color: '#7CE577' }} />
          <h3 style={{ color: '#535353' }}>Still Available</h3>
        </div>
        <ul className="space-y-2">
          {allowedFeatures[accountType].map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#7CE577' }} />
              <span style={{ color: '#535353' }}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Warning Banner */}
      <div className="w-full max-w-md mt-6">
        <div 
          className="flex items-start gap-3 p-4 rounded-lg"
          style={{ background: 'rgba(255, 107, 122, 0.1)' }}
        >
          <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: '#FF6B7A' }} />
          <p className="text-sm" style={{ color: '#535353' }}>
            Continued non-payment may result in permanent account suspension and legal action.
          </p>
        </div>
      </div>
    </div>
  );
}
