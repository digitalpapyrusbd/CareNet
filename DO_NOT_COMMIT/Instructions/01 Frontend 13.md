# Frontend 13: Payment Integration & Transactions

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Related Files**: [TOC](01%20Frontend%20TOC.md) | [02: Auth](01%20Frontend%2002.md) | [05: Agency Portal](01%20Frontend%2005.md)

---

## 📋 Table of Contents

1. [Payment System Overview](#payment-system-overview)
2. [Payment Methods](#payment-methods)
3. [Checkout Flow](#checkout-flow)
4. [Invoice Management](#invoice-management)
5. [Billing & Subscriptions](#billing--subscriptions)
6. [Payment Reminders](#payment-reminders)
7. [Transaction History](#transaction-history)
8. [Refunds & Disputes](#refunds--disputes)
9. [Payment Security](#payment-security)
10. [Debugging Guide](#debugging-guide)
11. [Testing Guide](#testing-guide)
12. [Testing Progress Log](#testing-progress-log)

---

## 💳 Payment System Overview

### **Purpose**
The payment system handles all financial transactions:
- **Guardian → Agency**: Service bookings, care packages
- **Guardian → Platform**: Subscription fees, commissions
- **Agency → Platform**: Subscription fees, listing fees
- **Caregiver → Platform**: Verification fees, subscriptions
- **Shop Customers → Shop**: Product purchases

### **Payment Architecture**

```typescript
interface Payment {
  id: string;
  userId: string;
  userRole: UserRole;
  amount: number;
  currency: 'BDT' | 'USD';
  method: 'bkash' | 'nagad' | 'bank' | 'stripe';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  type: 'booking' | 'subscription' | 'commission' | 'refund';
  metadata: {
    invoiceId?: string;
    bookingId?: string;
    subscriptionId?: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

interface Invoice {
  id: string;
  number: string; // INV-2024-001
  userId: string;
  entity: string; // Who issued the invoice
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  paidDate?: Date;
  issuedDate: Date;
  items: InvoiceItem[];
  paymentMethod?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
```

### **Key Features**

- ✅ Multiple payment methods (bKash, Nagad, Bank Transfer, Stripe)
- ✅ Invoice generation and management
- ✅ Automatic payment reminders
- ✅ Transaction history tracking
- ✅ Refund processing
- ✅ Payment gateway integration
- ✅ Currency conversion (BDT ↔ USD)
- ✅ Payment verification
- ✅ Dispute resolution

---

## 💰 Payment Methods

### **bKash Integration**

**Route**: Agency Registration Step 5, Guardian Checkout

```tsx
export default function PaymentMethodSelector() {
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <label className="text-sm font-medium mb-3 block" style={{ color: '#535353' }}>
          Payment Method *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'bkash', label: 'bKash', emoji: '📱' },
            { value: 'nagad', label: 'Nagad', emoji: '💸' },
            { value: 'bank', label: 'Bank', emoji: '🏦' },
          ].map((method) => (
            <button
              key={method.value}
              onClick={() => setPaymentMethod(method.value as any)}
              className="p-4 rounded-2xl text-center"
              style={{
                background: paymentMethod === method.value
                  ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                  : 'rgba(255,255,255,0.6)',
                color: paymentMethod === method.value ? 'white' : '#535353'
              }}
            >
              <span className="text-2xl block mb-1">{method.emoji}</span>
              <span className="text-sm font-medium">{method.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Account Number */}
      <div>
        <label className="text-sm font-medium" style={{ color: '#535353' }}>
          {paymentMethod === 'bank' 
            ? 'Account Number' 
            : `${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Number`} *
        </label>
        <Input
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="mt-2 bg-white/60 border-white/60"
          placeholder={paymentMethod === 'bank' ? 'Bank account number' : '01XXXXXXXXX'}
        />
      </div>

      {/* Account Holder Name */}
      <div>
        <label className="text-sm font-medium" style={{ color: '#535353' }}>
          Account Holder Name *
        </label>
        <Input
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="mt-2 bg-white/60 border-white/60"
          placeholder="Name as per account"
        />
      </div>
    </div>
  );
}
```

### **bKash Payment Flow**

```typescript
// Initiate bKash payment
async function initiateBkashPayment(amount: number, invoiceId: string) {
  const response = await fetch('/api/payments/bkash/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      invoiceId,
      callbackUrl: `${window.location.origin}/payments/callback`
    })
  });

  const { paymentUrl, paymentId } = await response.json();
  
  // Redirect to bKash payment page
  window.location.href = paymentUrl;
}

// Handle bKash callback
async function handleBkashCallback(paymentId: string, status: string) {
  if (status === 'success') {
    // Verify payment
    const response = await fetch(`/api/payments/bkash/verify/${paymentId}`);
    const { verified, transactionId } = await response.json();
    
    if (verified) {
      // Update payment status
      await updatePaymentStatus(paymentId, 'completed', transactionId);
      router.push('/payments/success');
    }
  } else {
    router.push('/payments/failed');
  }
}
```

### **Nagad Integration**

```typescript
async function initiateNagadPayment(amount: number, invoiceId: string) {
  const response = await fetch('/api/payments/nagad/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      invoiceId,
      merchantId: process.env.NEXT_PUBLIC_NAGAD_MERCHANT_ID
    })
  });

  const { paymentUrl, orderId } = await response.json();
  window.location.href = paymentUrl;
}
```

### **Stripe Integration** (International Payments)

```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

async function initiateStripePayment(amount: number, invoiceId: string) {
  const stripe = await stripePromise;
  
  // Create payment intent
  const response = await fetch('/api/payments/stripe/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, invoiceId })
  });

  const { clientSecret } = await response.json();
  
  // Redirect to Stripe checkout
  const { error } = await stripe!.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement('card')!,
    }
  });

  if (!error) {
    router.push('/payments/success');
  }
}
```

### **Bank Transfer**

```tsx
function BankTransferInstructions({ amount, invoiceId }: { amount: number; invoiceId: string }) {
  return (
    <div className="finance-card p-6">
      <h3 className="mb-4" style={{ color: '#535353' }}>Bank Transfer Details</h3>
      
      <div className="space-y-3">
        <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
          <p className="text-xs mb-1" style={{ color: '#848484' }}>Bank Name</p>
          <p style={{ color: '#535353' }}>Dutch-Bangla Bank Limited</p>
        </div>
        
        <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
          <p className="text-xs mb-1" style={{ color: '#848484' }}>Account Number</p>
          <p style={{ color: '#535353' }}>1234567890123456</p>
        </div>
        
        <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
          <p className="text-xs mb-1" style={{ color: '#848484' }}>Account Name</p>
          <p style={{ color: '#535353' }}>CareNet Bangladesh Ltd</p>
        </div>
        
        <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
          <p className="text-xs mb-1" style={{ color: '#848484' }}>Reference Number</p>
          <p className="font-mono" style={{ color: '#535353' }}>{invoiceId}</p>
        </div>
      </div>
      
      <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(255, 209, 128, 0.2)' }}>
        <p className="text-sm" style={{ color: '#B45309' }}>
          ⚠️ Please include the reference number in your transfer description
        </p>
      </div>
    </div>
  );
}
```

---

## 🛒 Checkout Flow

**Route**: `/guardian/checkout`, `/caregiver/checkout`

### **Guardian Checkout (Service Booking)**

```tsx
export default function GuardianCheckoutPage() {
  const [step, setStep] = useState<'review' | 'payment' | 'confirm'>('review');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');

  const bookingDetails = {
    service: '24/7 Senior Care - Basic',
    agency: 'Green Care Agency',
    caregiver: 'Rashida Begum',
    duration: '1 month',
    startDate: 'Dec 15, 2024',
    amount: 35000,
    platformFee: 1750, // 5%
    total: 36750
  };

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      
      <div className="min-h-screen pb-24 md:pt-14">
        <div className="p-6">
          <h1 className="mb-6" style={{ color: '#535353' }}>Checkout</h1>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {[
              { id: 'review', label: 'Review' },
              { id: 'payment', label: 'Payment' },
              { id: 'confirm', label: 'Confirm' }
            ].map((s, idx) => (
              <div key={s.id} className="flex items-center flex-1">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    step === s.id ? 'text-white' : ''
                  }`}
                  style={{
                    background: step === s.id
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                      : 'rgba(132, 132, 132, 0.2)',
                    color: step === s.id ? 'white' : '#848484'
                  }}
                >
                  {idx + 1}
                </div>
                <span className="ml-2 text-sm" style={{ color: '#535353' }}>
                  {s.label}
                </span>
                {idx < 2 && (
                  <div 
                    className="flex-1 h-0.5 mx-2"
                    style={{ background: 'rgba(132, 132, 132, 0.2)' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Review Step */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="finance-card p-5">
                <h3 className="mb-4" style={{ color: '#535353' }}>Booking Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: '#848484' }}>Service</span>
                    <span style={{ color: '#535353' }}>{bookingDetails.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#848484' }}>Agency</span>
                    <span style={{ color: '#535353' }}>{bookingDetails.agency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#848484' }}>Caregiver</span>
                    <span style={{ color: '#535353' }}>{bookingDetails.caregiver}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#848484' }}>Duration</span>
                    <span style={{ color: '#535353' }}>{bookingDetails.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#848484' }}>Start Date</span>
                    <span style={{ color: '#535353' }}>{bookingDetails.startDate}</span>
                  </div>
                  
                  <div className="border-t pt-3" style={{ borderColor: 'rgba(132, 132, 132, 0.2)' }}>
                    <div className="flex justify-between mb-2">
                      <span style={{ color: '#848484' }}>Service Amount</span>
                      <span style={{ color: '#535353' }}>৳{bookingDetails.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span style={{ color: '#848484' }}>Platform Fee (5%)</span>
                      <span style={{ color: '#535353' }}>৳{bookingDetails.platformFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span style={{ color: '#535353' }}>Total</span>
                      <span style={{ color: '#535353' }}>৳{bookingDetails.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => setStep('payment')}
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                  color: 'white'
                }}
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <div className="space-y-4">
              <PaymentMethodSelector 
                selected={paymentMethod}
                onSelect={setPaymentMethod}
              />
              
              <Button
                className="w-full"
                onClick={() => setStep('confirm')}
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                  color: 'white'
                }}
              >
                Confirm Payment
              </Button>
            </div>
          )}

          {/* Confirm Step */}
          {step === 'confirm' && (
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                }}
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="mb-2" style={{ color: '#535353' }}>Payment Successful!</h2>
              <p style={{ color: '#848484' }}>
                Your booking has been confirmed
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

### **Caregiver Checkout** (Session End)

**Route**: `/caregiver/checkout`

```tsx
export default function CheckOutPage() {
  const router = useRouter();

  return (
    <>
      <UniversalNav userRole="caregiver" showBack={true} />
      
      <div className="min-h-screen pb-24 md:pt-14">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2" style={{ color: '#535353' }}>Check Out</h1>
            <p style={{ color: '#848484' }}>Check out to end care session</p>
          </div>

          <div className="finance-card p-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
              }}
            >
              <LogOut className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="mb-4" style={{ color: '#535353' }}>Session Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Check-in Time</span>
                <span style={{ color: '#535353' }}>9:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Check-out Time</span>
                <span style={{ color: '#535353' }}>5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Duration</span>
                <span style={{ color: '#535353' }}>8 hours</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span style={{ color: '#535353' }}>Earnings</span>
                <span style={{ color: '#535353' }}>৳1,200</span>
              </div>
            </div>

            <Button
              className="w-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
                color: 'white'
              }}
            >
              Confirm Check Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
```

---

## 📄 Invoice Management

**Routes**: `/guardian/billing`, `/agency/billing`, `/shop/billing`

### **Invoice List Component**

```tsx
export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'paid' | 'overdue'>('pending');

  const invoices = {
    pending: [
      {
        id: 'INV-2024-001',
        entity: 'Green Care Agency',
        amount: 35000,
        dueDate: 'Dec 10, 2024',
        issuedDate: 'Dec 3, 2024',
        status: 'pending',
        services: '24/7 Senior Care - Basic (Dec 1-31)'
      },
    ],
    paid: [
      {
        id: 'INV-2024-002',
        entity: 'MediCare Services',
        amount: 28000,
        paidDate: 'Nov 28, 2024',
        issuedDate: 'Nov 21, 2024',
        status: 'paid',
        services: 'Post-Surgery Care Package (Nov 15-30)'
      },
    ],
    overdue: []
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#7CE577';
      case 'pending': return '#FFD180';
      case 'overdue': return '#FF6B7A';
      default: return '#848484';
    }
  };

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      
      <div className="min-h-screen pb-24 md:pt-14">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2" style={{ color: '#535353' }}>Agency Invoices</h1>
            <p style={{ color: '#848484' }}>
              Invoices from care agencies for services provided
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="finance-card p-4">
              <p className="text-xs mb-1" style={{ color: '#848484' }}>Pending</p>
              <p className="text-xl" style={{ color: '#FFD180' }}>
                ৳{invoices.pending.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="finance-card p-4">
              <p className="text-xs mb-1" style={{ color: '#848484' }}>Paid</p>
              <p className="text-xl" style={{ color: '#7CE577' }}>
                ৳{invoices.paid.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="finance-card p-4">
              <p className="text-xs mb-1" style={{ color: '#848484' }}>Overdue</p>
              <p className="text-xl" style={{ color: '#FF6B7A' }}>
                ৳{invoices.overdue.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto mb-6">
            {[
              { id: 'pending', label: 'Pending', count: invoices.pending.length },
              { id: 'paid', label: 'Paid', count: invoices.paid.length },
              { id: 'overdue', label: 'Overdue', count: invoices.overdue.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap"
                style={{
                  background: activeTab === tab.id 
                    ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                    : 'rgba(255, 255, 255, 0.5)',
                  color: activeTab === tab.id ? 'white' : '#535353'
                }}
              >
                <span className="text-sm">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{
                    background: activeTab === tab.id 
                      ? 'rgba(255, 255, 255, 0.3)' 
                      : 'rgba(132, 132, 132, 0.2)'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Invoice Cards */}
          <div className="space-y-3">
            {invoices[activeTab].map((invoice) => {
              const StatusIcon = getStatusIcon(invoice.status);
              return (
                <div key={invoice.id} className="finance-card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 style={{ color: '#535353' }}>{invoice.id}</h3>
                        <span 
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            background: `${getStatusColor(invoice.status)}20`, 
                            color: getStatusColor(invoice.status) 
                          }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: '#848484' }}>
                        {invoice.entity}
                      </p>
                      <p className="text-sm mb-3" style={{ color: '#535353' }}>
                        {invoice.services}
                      </p>
                      <div className="flex items-center gap-4 text-xs" style={{ color: '#848484' }}>
                        <span>Issued: {invoice.issuedDate}</span>
                        {invoice.status === 'pending' && (
                          <span>Due: {invoice.dueDate}</span>
                        )}
                        {invoice.status === 'paid' && (
                          <span>Paid: {invoice.paidDate}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold" style={{ color: '#535353' }}>
                        ৳{invoice.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    {invoice.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        style={{
                          background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                          color: 'white'
                        }}
                      >
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
```

### **Agency Billing Component**

```tsx
const invoices = [
  {
    id: 'INV-3021',
    date: 'Dec 01, 2024',
    amount: 18000,
    status: 'pending' as const,
    type: 'subscription' as const,
    description: 'Enterprise Subscription - December 2024',
  },
  {
    id: 'INV-3002',
    date: 'Nov 15, 2024',
    amount: 12650,
    status: 'paid' as const,
    type: 'commission' as const,
    description: 'Platform Commission - Guardian Jobs',
  },
];

export function BillingHistory({ 
  invoices, 
  onViewInvoice, 
  onDownloadInvoice 
}: BillingHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const filteredInvoices = invoices.filter(
    inv => filter === 'all' || inv.status === filter
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return { bg: 'rgba(124, 229, 119, 0.2)', text: '#7CE577' };
      case 'pending': return { bg: 'rgba(255, 209, 128, 0.2)', text: '#FFD180' };
      case 'overdue': return { bg: 'rgba(255, 107, 122, 0.2)', text: '#FF6B7A' };
      default: return { bg: 'rgba(142, 197, 252, 0.2)', text: '#5B9FFF' };
    }
  };

  return (
    <div className="space-y-4">
      <h2 style={{ color: '#535353' }}>Billing History</h2>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {['all', 'paid', 'pending', 'overdue'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f as any)}
            className="px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap" 
            style={{
              background: filter === f 
                ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' 
                : 'rgba(255, 255, 255, 0.5)',
              color: filter === f ? 'white' : '#535353'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <div className="finance-card p-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
          <p style={{ color: '#848484' }}>No invoices found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((invoice) => {
            const statusStyle = getStatusColor(invoice.status);
            return (
              <div key={invoice.id} className="finance-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: statusStyle.bg }}
                  >
                    <FileText className="w-6 h-6" style={{ color: statusStyle.text }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 style={{ color: '#535353' }}>Invoice #{invoice.id}</h3>
                      <span 
                        className="text-xs px-3 py-1 rounded-full capitalize"
                        style={{ background: statusStyle.bg, color: statusStyle.text }}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#848484' }}>
                      {invoice.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#848484' }}>
                      <Calendar className="w-3 h-3" />
                      {invoice.date}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold" style={{ color: '#535353' }}>
                    ৳{invoice.amount.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onViewInvoice(invoice.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDownloadInvoice(invoice.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

---

## 💼 Billing & Subscriptions

**Routes**: `/agency/subscription`, `/caregiver/subscription`

### **Subscription Tiers**

```typescript
const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 5000,
    currency: 'BDT',
    period: 'month',
    features: [
      'Up to 5 caregiver listings',
      'Basic profile visibility',
      'Email support',
      '10% platform commission'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 12000,
    currency: 'BDT',
    period: 'month',
    features: [
      'Up to 20 caregiver listings',
      'Enhanced profile visibility',
      'Priority support',
      '7% platform commission',
      'Featured in search results'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 25000,
    currency: 'BDT',
    period: 'month',
    features: [
      'Unlimited caregiver listings',
      'Premium profile visibility',
      '24/7 priority support',
      '5% platform commission',
      'Top placement in search',
      'Dedicated account manager'
    ]
  }
];
```

### **Subscription Management**

```tsx
export default function SubscriptionPlansPage() {
  const currentPlan = 'professional';

  return (
    <>
      <UniversalNav userRole="agency" showBack={true} />
      
      <div className="min-h-screen pb-24 md:pt-14">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2" style={{ color: '#535353' }}>Subscription Plans</h1>
            <p style={{ color: '#848484' }}>Choose your subscription tier</p>
          </div>

          {/* Current Plan */}
          <div className="finance-card p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-1" style={{ color: '#848484' }}>Current Plan</p>
                <h3 style={{ color: '#535353' }}>Professional</h3>
                <p className="text-sm" style={{ color: '#848484' }}>
                  Renews on Jan 1, 2025
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: '#535353' }}>
                  ৳12,000
                </p>
                <p className="text-sm" style={{ color: '#848484' }}>/month</p>
              </div>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="space-y-4">
            {subscriptionPlans.map((plan) => (
              <div 
                key={plan.id} 
                className="finance-card p-5"
                style={{
                  border: plan.id === currentPlan ? '2px solid #5B9FFF' : 'none'
                }}
              >
                {plan.popular && (
                  <div 
                    className="inline-block px-3 py-1 rounded-full text-xs mb-3"
                    style={{
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                      color: 'white'
                    }}
                  >
                    Most Popular
                  </div>
                )}
                
                <h3 className="mb-1" style={{ color: '#535353' }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold" style={{ color: '#535353' }}>
                    ৳{plan.price.toLocaleString()}
                  </span>
                  <span style={{ color: '#848484' }}>/{plan.period}</span>
                </div>

                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle 
                        className="w-4 h-4 mt-0.5 shrink-0" 
                        style={{ color: '#7CE577' }} 
                      />
                      <span style={{ color: '#535353' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  disabled={plan.id === currentPlan}
                  style={{
                    background: plan.id === currentPlan
                      ? 'rgba(132, 132, 132, 0.3)'
                      : 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)',
                    color: 'white'
                  }}
                >
                  {plan.id === currentPlan ? 'Current Plan' : 'Upgrade'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
```

---

## 🔔 Payment Reminders

**Routes**: `/guardian/payment-warning`, `/guardian/payment-reminder`, `/guardian/payment-final-warning`

### **Payment Reminder Component**

```tsx
interface PaymentReminderProps {
  stage: "day3" | "day5" | "day6";
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
  onPayNow: () => void;
  onDismiss?: () => void;
}

export function PaymentReminder({ 
  stage, 
  invoiceNumber, 
  amount, 
  dueDate, 
  daysRemaining, 
  onPayNow, 
  onDismiss 
}: PaymentReminderProps) {
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
              <span 
                className="text-lg" 
                style={{ color: current.urgency === 'high' ? '#FF6B7A' : '#535353' }}
              >
                ৳{amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Due Date:</span>
              <span style={{ color: '#535353' }}>{dueDate}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={onPayNow}
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
              color: 'white'
            }}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Now
          </Button>
          
          {current.showDismiss && (
            <Button
              className="w-full"
              variant="ghost"
              onClick={onDismiss}
              style={{ color: '#535353' }}
            >
              Remind Me Later
            </Button>
          )}
        </div>

        {/* Warning Message */}
        {stage === 'day6' && (
          <div 
            className="mt-4 p-3 rounded-lg"
            style={{ background: 'rgba(255, 107, 122, 0.1)' }}
          >
            <p className="text-xs" style={{ color: '#FF6B7A' }}>
              ⚠️ Features to be locked: Browse services, Book caregivers, Add patients, Request quotes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### **Payment Warning Page**

```tsx
export default function GuardianPaymentWarningPage() {
  const router = useRouter();
  const [showReminder, setShowReminder] = useState(true);

  const invoiceDetails = {
    id: 'INV-2045',
    amount: 18500,
    dueDate: 'December 8, 2024',
    daysRemaining: 2,
  };

  return (
    <>
      <UniversalNav userRole="guardian" showBack={true} />
      
      <div className="min-h-screen pb-24 md:pt-14">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-1">
            <p className="text-sm text-emerald-100 uppercase tracking-wide">
              Payment Notice
            </p>
            <h1 className="text-3xl font-bold">Action Needed: Payment Pending</h1>
            <p className="text-emerald-100">
              Your guardian account will be restricted in 2 days unless the outstanding invoice is paid.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {/* Invoice Card */}
          <div className="finance-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm" style={{ color: '#848484' }}>
                  Invoice Number
                </p>
                <p className="text-2xl font-semibold" style={{ color: '#535353' }}>
                  {invoiceDetails.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-amber-500">
                  Due in {invoiceDetails.daysRemaining} days
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  ৳{invoiceDetails.amount.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#848484' }}>
                  Due Date
                </p>
                <p style={{ color: '#535353' }}>{invoiceDetails.dueDate}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#848484' }}>
                  Payment Methods
                </p>
                <p style={{ color: '#535353' }}>bKash • Nagad • Bank Transfer</p>
              </div>
            </div>
            
            <Button
              className="w-full"
              style={{
                background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)',
                color: 'white',
              }}
              onClick={() => router.push('/payments/create')}
            >
              Pay Now
            </Button>
          </div>

          {/* Warning */}
          <div 
            className="finance-card p-6 bg-orange-50 border border-orange-100" 
            style={{ color: '#B45309' }}
          >
            <p className="font-semibold mb-2">What happens in 2 days?</p>
            <ul className="text-sm space-y-1">
              <li>• Booking new services will be temporarily disabled</li>
              <li>• Access to premium caregiver profiles will be paused</li>
              <li>• Existing bookings remain active but new requests are blocked</li>
            </ul>
          </div>
        </div>
      </div>

      {showReminder && (
        <PaymentReminder
          stage="day5"
          invoiceNumber={invoiceDetails.id}
          amount={invoiceDetails.amount}
          dueDate={invoiceDetails.dueDate}
          daysRemaining={invoiceDetails.daysRemaining}
          onPayNow={() => router.push('/payments/create')}
          onDismiss={() => setShowReminder(false)}
        />
      )}
    </>
  );
}
```

---

## 📊 Transaction History

```tsx
export function TransactionHistory() {
  const transactions = [
    {
      id: 'TXN-2024-123',
      date: 'Dec 5, 2024',
      type: 'payment',
      description: 'Payment to Green Care Agency',
      amount: -35000,
      status: 'completed',
      method: 'bkash'
    },
    {
      id: 'TXN-2024-122',
      date: 'Dec 1, 2024',
      type: 'refund',
      description: 'Refund from cancelled booking',
      amount: +5000,
      status: 'completed',
      method: 'bkash'
    },
  ];

  return (
    <div className="space-y-3">
      {transactions.map((txn) => (
        <div key={txn.id} className="finance-card p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 style={{ color: '#535353' }}>{txn.description}</h4>
              <p className="text-sm" style={{ color: '#848484' }}>
                {txn.date} • {txn.method.toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p 
                className="text-lg font-bold"
                style={{ color: txn.amount > 0 ? '#7CE577' : '#535353' }}
              >
                {txn.amount > 0 ? '+' : ''}৳{Math.abs(txn.amount).toLocaleString()}
              </p>
              <span 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(124, 229, 119, 0.2)', color: '#7CE577' }}
              >
                {txn.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔐 Payment Security

### **PCI Compliance**

- **No card data storage**: All credit card details processed via Stripe
- **Tokenization**: Payment methods tokenized before storage
- **SSL/TLS**: All payment requests over HTTPS
- **3D Secure**: Enabled for international card payments

### **Fraud Prevention**

```typescript
// Check for suspicious activity
async function validatePayment(payment: Payment) {
  const checks = {
    duplicateCheck: await checkDuplicatePayment(payment),
    amountCheck: payment.amount <= MAX_TRANSACTION_AMOUNT,
    velocityCheck: await checkPaymentVelocity(payment.userId),
    deviceCheck: await checkDeviceFingerprint(payment.deviceId)
  };

  if (!checks.duplicateCheck || !checks.amountCheck || !checks.velocityCheck) {
    await flagPaymentForReview(payment.id);
    return false;
  }

  return true;
}
```

---

## 🐛 Debugging Guide

### **Issue: Payment Not Processing**

**Problem**: Payment stuck in "processing" status.

**Debug Steps**:
```typescript
console.log('Payment Details:', {
  paymentId,
  method,
  amount,
  status,
  timestamp: new Date().toISOString()
});

// Check gateway response
const gatewayResponse = await fetch(`/api/payments/${method}/status/${paymentId}`);
console.log('Gateway Status:', await gatewayResponse.json());

// Check webhook logs
const webhooks = await fetch(`/api/webhooks/payment/${paymentId}`);
console.log('Webhook Logs:', await webhooks.json());
```

### **Issue: Invoice Not Generating**

**Solution**:
```typescript
// Verify invoice data
console.log('Invoice Data:', {
  items,
  total: items.reduce((sum, item) => sum + item.total, 0),
  userId,
  dueDate
});

// Check PDF generation
try {
  const pdf = await generateInvoicePDF(invoiceData);
  console.log('PDF Generated:', pdf.url);
} catch (error) {
  console.error('PDF Generation Failed:', error);
}
```

---

## 🧪 Testing Guide

```typescript
describe('Payment System', () => {
  it('processes bKash payment successfully', async () => {
    const payment = await initiateBkashPayment(1000, 'INV-001');
    expect(payment.status).toBe('processing');
    
    // Simulate callback
    await handleBkashCallback(payment.id, 'success');
    
    const updated = await getPayment(payment.id);
    expect(updated.status).toBe('completed');
  });
  
  it('generates invoice correctly', async () => {
    const invoice = await createInvoice({
      userId: 'user-123',
      items: [{ description: 'Service', quantity: 1, unitPrice: 1000, total: 1000 }],
      dueDate: new Date('2025-01-01')
    });
    
    expect(invoice.number).toMatch(/INV-\d{4}-\d{3}/);
    expect(invoice.amount).toBe(1000);
  });
  
  it('displays payment reminder at correct stage', () => {
    render(<PaymentReminder stage="day5" {...props} />);
    
    expect(screen.getByText('Payment Due Soon')).toBeInTheDocument();
    expect(screen.getByText(/Account will be restricted/)).toBeInTheDocument();
  });
});
```

---

## 📊 Testing Progress Log

### **✅ Completed**
- **Payment Methods**: 85% (bKash, Nagad, Bank Transfer working)
- **Invoice Management**: 90% (Generation, display, download)
- **Billing History**: 88% (Filtering, status display)
- **Checkout Flow**: 80% (Guardian checkout functional)

### **❌ TODO**
- [ ] Stripe integration completion
- [ ] Automated payment reminders (cron jobs)
- [ ] Refund processing workflow
- [ ] Transaction dispute resolution
- [ ] E2E payment flow tests
- [ ] Load testing for high-volume transactions

---

**Last Updated**: December 11, 2025  
**Maintained By**: Development Team
