import { Lock, AlertCircle, CheckCircle, XCircle, CreditCard } from "lucide-react";
import { Button } from "../ui/button";

interface AccountLockedCaregiverProps {
  outstandingAmount: number;
  daysOverdue: number;
  invoiceId: string;
  onPayNow: () => void;
  onContactSupport: () => void;
}

export function AccountLockedCaregiver({ 
  outstandingAmount, 
  daysOverdue, 
  invoiceId,
  onPayNow, 
  onContactSupport 
}: AccountLockedCaregiverProps) {
  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="finance-card p-8 mb-6 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}>
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#535353' }}>Account Restricted</h1>
          <p className="mb-4" style={{ color: '#848484' }}>
            Your account has been restricted due to pending payment.
          </p>
          <div className="inline-block px-4 py-2 rounded-lg"
            style={{ background: 'rgba(255, 107, 122, 0.2)' }}>
            <p className="text-sm" style={{ color: '#FF6B7A' }}>
              Overdue: {daysOverdue} days
            </p>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Outstanding Balance</h3>
          <div className="flex items-center justify-between p-4 rounded-lg mb-4"
            style={{ background: 'rgba(255, 107, 122, 0.1)' }}>
            <div>
              <p className="text-sm mb-1" style={{ color: '#848484' }}>Invoice #{invoiceId}</p>
              <p className="text-2xl" style={{ color: '#FF6B7A' }}>৳{outstandingAmount.toLocaleString()}</p>
            </div>
            <CreditCard className="w-8 h-8" style={{ color: '#FF6B7A' }} />
          </div>
          <Button onClick={onPayNow} className="w-full"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
            <CreditCard className="w-4 h-4 mr-2" />Pay Now
          </Button>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Account Status</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 mt-0.5" style={{ color: '#FF6B7A' }} />
              <div className="flex-1">
                <p style={{ color: '#535353' }}>Cannot accept new jobs</p>
                <p className="text-sm" style={{ color: '#848484' }}>New job offers are hidden</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 mt-0.5" style={{ color: '#FF6B7A' }} />
              <div className="flex-1">
                <p style={{ color: '#535353' }}>Cannot update availability</p>
                <p className="text-sm" style={{ color: '#848484' }}>Schedule changes are locked</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 mt-0.5" style={{ color: '#FF6B7A' }} />
              <div className="flex-1">
                <p style={{ color: '#535353' }}>Cannot generate invoices</p>
                <p className="text-sm" style={{ color: '#848484' }}>Invoice generation disabled</p>
              </div>
            </div>

            <div className="h-px bg-white/50 my-3" />

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#7CE577' }} />
              <div className="flex-1">
                <p style={{ color: '#535353' }}>Can complete existing jobs</p>
                <p className="text-sm" style={{ color: '#848484' }}>Active assignments remain accessible</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#7CE577' }} />
              <div className="flex-1">
                <p style={{ color: '#535353' }}>Can communicate about active jobs</p>
                <p className="text-sm" style={{ color: '#848484' }}>Messaging for current jobs only</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#7CE577' }} />
              <div className="flex-1">
                <p style={{ color: '#535353' }}>Can make payment</p>
                <p className="text-sm" style={{ color: '#848484' }}>Payment portal remains open</p>
              </div>
            </div>
          </div>
        </div>

        <div className="finance-card p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: '#5B9FFF' }} />
            <div>
              <p style={{ color: '#535353' }}>Need Help?</p>
              <p className="text-sm" style={{ color: '#848484' }}>
                Contact support if you have questions about your payment or account status.
              </p>
            </div>
          </div>
          <Button onClick={onContactSupport} variant="outline" className="w-full bg-white/50 border-white/50">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}

