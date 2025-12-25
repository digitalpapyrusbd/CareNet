import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface WithdrawEarningsProps {
  availableBalance: number;
  onWithdraw: (data: any) => void;
  onCancel: () => void;
}

export function WithdrawEarnings({ availableBalance, onWithdraw, onCancel }: WithdrawEarningsProps) {
  const { t } = useTranslationContext();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [accountNumber, setAccountNumber] = useState("");

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="mb-6" style={{ color: '#535353' }}>{t('withdrawearnings.heading.withdrawearnings')}</h1>

        <div className="finance-card p-6 mb-6">
          <p className="text-sm mb-2" style={{ color: '#848484' }}>{t('withdrawearnings.text.availablebalance')}</p>
          <p className="text-3xl" style={{ color: '#7CE577' }}>৳{availableBalance.toLocaleString()}</p>
        </div>

        <div className="finance-card p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label>Amount to Withdraw *</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder={t('withdrawearnings.placeholder.enteramount')} className="mt-2 bg-white/50 border-white/50" />
            </div>

            <div>
              <Label>Withdrawal Method *</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['bank', 'mobile'].map((m) => (
                  <button key={m} onClick={() => setMethod(m)}
                    className="p-3 rounded-lg capitalize" style={{
                      background: method === m ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                      color: method === m ? 'white' : '#535353'
                    }}>
                    {m} Transfer
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Account Number *</Label>
              <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={method === 'bank' ? 'Bank account number' : 'Mobile number'}
                className="mt-2 bg-white/50 border-white/50" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-white/50 border-white/50">{t('withdrawearnings.text.cancel')}</Button>
          <Button onClick={() => onWithdraw({ amount: Number(amount), method, accountNumber })} 
            disabled={!amount || !accountNumber} className="flex-1"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)', color: 'white' }}>
            <Send className="w-4 h-4 mr-2" />Withdraw
          </Button>
        </div>
      </div>
    </div>
  );
}

