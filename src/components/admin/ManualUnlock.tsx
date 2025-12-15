import { Unlock, AlertCircle, User } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface ManualUnlockProps {
  account: {
    id: string;
    name: string;
    type: string;
    reason: string;
    lockedDate: string;
    daysLocked: number;
    outstandingAmount?: number;
  };
  onUnlock: (reason: string) => void;
  onCancel: () => void;
}

export function ManualUnlock({ account, onUnlock, onCancel }: ManualUnlockProps) {
  const [unlockReason, setUnlockReason] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl finance-card p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFD180 0%, #FFB74D 100%)' }}>
            <Unlock className="w-8 h-8 text-white" />
          </div>
          <h2 style={{ color: '#535353' }}>Manual Account Unlock</h2>
          <p style={{ color: '#848484' }}>Review and confirm unlock action</p>
        </div>

        {/* Account Information */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-4" style={{ color: '#535353' }}>Account Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Account Name:</span>
              <span style={{ color: '#535353' }}>{account.name}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Account Type:</span>
              <span className="px-2 py-1 rounded-full text-xs capitalize"
                style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                {account.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Locked Date:</span>
              <span style={{ color: '#535353' }}>{account.lockedDate}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#848484' }}>Days Locked:</span>
              <span style={{ color: '#535353' }}>{account.daysLocked} days</span>
            </div>
            {account.outstandingAmount && (
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Outstanding Amount:</span>
                <span style={{ color: '#FF8FA3' }}>৳{account.outstandingAmount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lock Reason */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Lock Reason</h3>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 179, 193, 0.1)' }}>
            <p style={{ color: '#FF8FA3' }}>{account.reason}</p>
          </div>
        </div>

        {/* Unlock Reason */}
        <div className="finance-card p-6 mb-6">
          <h3 className="mb-3" style={{ color: '#535353' }}>Unlock Reason *</h3>
          <Textarea
            value={unlockReason}
            onChange={(e) => setUnlockReason(e.target.value)}
            placeholder="Explain why you are manually unlocking this account..."
            className="bg-white/50 border-white/50 min-h-[100px]"
            style={{ color: '#535353' }}
          />
        </div>

        {/* Warning */}
        <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(255, 209, 128, 0.1)' }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#FFD180' }} />
            <div>
              <p className="text-sm mb-1" style={{ color: '#535353' }}>Important</p>
              <p className="text-xs" style={{ color: '#848484' }}>
                Manual unlocks bypass automatic payment enforcement. Ensure the reason for unlock is valid and documented.
                This action will be logged and auditable.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-white/50 border-white/50">
            Cancel
          </Button>
          <Button
            onClick={() => onUnlock(unlockReason)}
            disabled={!unlockReason}
            className="flex-1"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              color: 'white',
              opacity: !unlockReason ? 0.5 : 1
            }}
          >
            <Unlock className="w-4 h-4 mr-2" />Confirm Unlock
          </Button>
        </div>
      </div>
    </div>
  );
}

