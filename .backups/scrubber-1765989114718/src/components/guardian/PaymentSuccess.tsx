import { CheckCircle, Download, Home, Receipt } from "lucide-react";
import { Button } from "../ui/button";

interface PaymentSuccessProps {
  transactionId: string;
  amount: number;
  invoiceNumber: string;
  paymentMethod: string;
  packageName: string;
  onDownloadReceipt: () => void;
  onGoHome: () => void;
  onViewInvoice: () => void;
}

export function PaymentSuccess({
  transactionId,
  amount,
  invoiceNumber,
  paymentMethod,
  packageName,
  onDownloadReceipt,
  onGoHome,
  onViewInvoice
}: PaymentSuccessProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              boxShadow: '0px 8px 32px rgba(124, 229, 119, 0.4)'
            }}
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="mb-2" style={{ color: '#535353' }}>Payment Successful!</h1>
          <p style={{ color: '#848484' }}>Your payment has been processed</p>
        </div>

        {/* Payment Details */}
        <div className="finance-card p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-sm mb-2" style={{ color: '#848484' }}>Amount Paid</p>
            <p className="text-4xl" style={{ color: '#7CE577' }}>
              ৳{amount.toLocaleString()}
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#848484' }}>Transaction ID:</span>
              <span style={{ color: '#535353' }}>{transactionId}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span style={{ color: '#848484' }}>Invoice Number:</span>
              <span style={{ color: '#535353' }}>{invoiceNumber}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span style={{ color: '#848484' }}>Payment Method:</span>
              <span style={{ color: '#535353' }}>{paymentMethod}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span style={{ color: '#848484' }}>Package:</span>
              <span style={{ color: '#535353' }}>{packageName}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span style={{ color: '#848484' }}>Date & Time:</span>
              <span style={{ color: '#535353' }}>
                {new Date().toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div 
          className="finance-card p-4 mb-6"
          style={{ borderLeft: '4px solid #5B9FFF' }}
        >
          <h3 className="mb-3" style={{ color: '#535353' }}>What's Next?</h3>
          <ul className="space-y-2 text-sm" style={{ color: '#848484' }}>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#5B9FFF' }} />
              Your account has been reactivated
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#5B9FFF' }} />
              Receipt sent to your email
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#5B9FFF' }} />
              Care services will continue as scheduled
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onDownloadReceipt}
            className="w-full"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
              color: 'white'
            }}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Receipt
          </Button>

          <Button
            onClick={onViewInvoice}
            variant="outline"
            className="w-full bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            <Receipt className="w-5 h-5 mr-2" />
            View Invoice
          </Button>

          <Button
            onClick={onGoHome}
            variant="outline"
            className="w-full bg-white/50 border-white/50"
            style={{ color: '#535353' }}
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Button>
        </div>

        {/* Support */}
        <p className="text-xs text-center mt-6" style={{ color: '#848484' }}>
          Need help? Contact support at support@carenet.com
        </p>
      </div>
    </div>
  );
}
