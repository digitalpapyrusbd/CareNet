import { Wallet, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

interface AgencyRegistrationStep5Props {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export function AgencyRegistrationStep5({ onSubmit, onBack }: AgencyRegistrationStep5Props) {
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'bank' | ''>('');
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    accountName: "",
    bankName: "",
    branchName: "",
    routingNumber: ""
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md finance-card p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)' }}>
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h2 style={{ color: '#535353' }}>Payout Setup</h2>
          <p className="text-sm" style={{ color: '#848484' }}>Step 5 of 5</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label style={{ color: '#535353' }}>Payment Method *</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { value: 'bkash', label: 'bKash' },
                { value: 'nagad', label: 'Nagad' },
                { value: 'bank', label: 'Bank' }
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value as any)}
                  className="p-3 rounded-lg text-sm transition-all"
                  style={{
                    background: paymentMethod === method.value
                      ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)'
                      : 'rgba(255, 255, 255, 0.5)',
                    color: paymentMethod === method.value ? 'white' : '#535353'
                  }}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod && (
            <>
              <div>
                <Label style={{ color: '#535353' }}>
                  {paymentMethod === 'bank' ? 'Account Number' : 'Mobile Number'} *
                </Label>
                <Input
                  value={accountDetails.accountNumber}
                  onChange={(e) => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })}
                  placeholder={paymentMethod === 'bank' ? 'Enter account number' : '01XXXXXXXXX'}
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              <div>
                <Label style={{ color: '#535353' }}>Account Name *</Label>
                <Input
                  value={accountDetails.accountName}
                  onChange={(e) => setAccountDetails({ ...accountDetails, accountName: e.target.value })}
                  placeholder="Account holder name"
                  className="mt-2 bg-white/50 border-white/50"
                  style={{ color: '#535353' }}
                />
              </div>

              {paymentMethod === 'bank' && (
                <>
                  <div>
                    <Label style={{ color: '#535353' }}>Bank Name *</Label>
                    <Input
                      value={accountDetails.bankName}
                      onChange={(e) => setAccountDetails({ ...accountDetails, bankName: e.target.value })}
                      placeholder="Enter bank name"
                      className="mt-2 bg-white/50 border-white/50"
                      style={{ color: '#535353' }}
                    />
                  </div>

                  <div>
                    <Label style={{ color: '#535353' }}>Branch Name *</Label>
                    <Input
                      value={accountDetails.branchName}
                      onChange={(e) => setAccountDetails({ ...accountDetails, branchName: e.target.value })}
                      placeholder="Enter branch name"
                      className="mt-2 bg-white/50 border-white/50"
                      style={{ color: '#535353' }}
                    />
                  </div>

                  <div>
                    <Label style={{ color: '#535353' }}>Routing Number</Label>
                    <Input
                      value={accountDetails.routingNumber}
                      onChange={(e) => setAccountDetails({ ...accountDetails, routingNumber: e.target.value })}
                      placeholder="Optional"
                      className="mt-2 bg-white/50 border-white/50"
                      style={{ color: '#535353' }}
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div className="p-3 rounded-lg" style={{ background: 'rgba(142, 197, 252, 0.1)' }}>
            <p className="text-xs" style={{ color: '#535353' }}>
              Your payout information will be securely stored and used for transferring earnings.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onBack} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Back
          </Button>
          <Button
            onClick={() => onSubmit({ paymentMethod, ...accountDetails })}
            disabled={!paymentMethod || !accountDetails.accountNumber || !accountDetails.accountName || (paymentMethod === 'bank' && (!accountDetails.bankName || !accountDetails.branchName))}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              color: 'white',
              opacity: (!paymentMethod || !accountDetails.accountNumber || !accountDetails.accountName || (paymentMethod === 'bank' && (!accountDetails.bankName || !accountDetails.branchName))) ? 0.5 : 1
            }}
          >
            <Send className="w-4 h-4 mr-2" />Submit for Verification
          </Button>
        </div>
      </div>
    </div>
  );
}

