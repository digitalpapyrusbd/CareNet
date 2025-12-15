import { AlertCircle, CreditCard, Calendar } from "lucide-react";
import { Button } from "../ui/button";

interface ShopPaymentReminderProps {
  day: 3 | 5 | 6;
  invoiceId: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  onPayNow: () => void;
  onContactSupport: () => void;
}

export function ShopPaymentReminder({
  day,
  invoiceId,
  amount,
  dueDate,
  daysOverdue,
  onPayNow,
  onContactSupport
}: ShopPaymentReminderProps) {
  const getWarningLevel = () => {
    if (day === 6) return { color: '#FF6B7A', bg: 'rgba(255, 107, 122, 0.2)', title: 'Final Warning' };
    if (day === 5) return { color: '#FFB74D', bg: 'rgba(255, 183, 77, 0.2)', title: 'Urgent Payment Required' };
    return { color: '#FFD180', bg: 'rgba(255, 209, 128, 0.2)', title: 'Payment Reminder' };
  };

  const warning = getWarningLevel();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="finance-card p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ background: warning.bg }}>
              <AlertCircle className="w-6 h-6" style={{ color: warning.color }} />
            </div>
            <div>
              <h2 className="mb-1" style={{ color: '#535353' }}>{warning.title}</h2>
              <p className="text-sm" style={{ color: '#848484' }}>
                {day === 6 && 'Your account will be locked tomorrow if payment is not received'}
                {day === 5 && 'Payment is now 5 days overdue'}
                {day === 3 && 'Payment is now 3 days overdue'}
              </p>
            </div>
          </div>

          {day === 6 && (
            <div className="p-4 rounded-lg mb-4" style={{ background: 'rgba(255, 107, 122, 0.1)' }}>
              <p className="text-sm" style={{ color: '#FF6B7A' }}>
                ⚠️ Account will be locked on Day 7. You will not be able to process orders or access the platform.
              </p>
            </div>
          )}
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Outstanding Invoice</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Invoice ID:</span>
              <span style={{ color: '#535353' }}>#{invoiceId}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Amount Due:</span>
              <span className="text-xl" style={{ color: warning.color }}>৳{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Due Date:</span>
              <span style={{ color: '#535353' }}>{dueDate}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Days Overdue:</span>
              <span style={{ color: warning.color }}>{daysOverdue} days</span>
            </div>
          </div>
        </div>

        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Consequences Timeline</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${day >= 3 ? 'opacity-100' : 'opacity-30'}`}
                style={{ background: '#FFD180' }} />
              <div className="flex-1">
                <p style={{ color: day >= 3 ? '#535353' : '#848484' }}>Day 3: First reminder sent</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${day >= 5 ? 'opacity-100' : 'opacity-30'}`}
                style={{ background: '#FFB74D' }} />
              <div className="flex-1">
                <p style={{ color: day >= 5 ? '#535353' : '#848484' }}>Day 5: Urgent reminder</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${day >= 6 ? 'opacity-100' : 'opacity-30'}`}
                style={{ background: '#FF8FA3' }} />
              <div className="flex-1">
                <p style={{ color: day >= 6 ? '#535353' : '#848484' }}>Day 6: Final warning</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-2 opacity-30" style={{ background: '#FF6B7A' }} />
              <div className="flex-1">
                <p style={{ color: '#848484' }}>Day 7: Account locked</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={onPayNow} className="w-full"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              color: 'white'
            }}>
            <CreditCard className="w-4 h-4 mr-2" />Pay Now
          </Button>

          <Button onClick={onContactSupport} variant="outline" className="w-full bg-white/50 border-white/50">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}

