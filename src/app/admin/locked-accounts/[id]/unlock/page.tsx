'use client';

import { UniversalNav } from '@/components/layout/UniversalNav';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Unlock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function ManualUnlockPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [reason, setReason] = useState('');
  const [confirmUnlock, setConfirmUnlock] = useState(false);

  const handleUnlock = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for unlocking this account');
      return;
    }
    if (!confirmUnlock) {
      alert('Please confirm that you want to unlock this account');
      return;
    }
    
    console.log('Manual unlock:', { accountId: id, reason });
    router.push('/admin/locked-accounts');
  };

  return (
    <>
      <UniversalNav userRole="admin" showBack={true} />
      <div className="min-h-screen pb-6 pb-24 md:pt-14">
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/30"
            style={{ color: '#535353' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="mb-6">
            <h1 className="mb-2" style={{ color: '#535353' }}>Manual Account Unlock</h1>
            <p style={{ color: '#848484' }}>Unlock account ID: {id}</p>
          </div>

          {/* Warning */}
          <div className="finance-card p-4 mb-6 border-l-4 border-yellow-500">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#535353' }}>
                  Warning: Manual Unlock
                </h3>
                <p className="text-sm" style={{ color: '#848484' }}>
                  This account was locked due to payment issues. Unlocking manually should only be done
                  after verifying payment arrangements or special circumstances.
                </p>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="finance-card p-6 mb-6">
            <h3 className="mb-4" style={{ color: '#535353' }}>Account Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Account ID:</span>
                <span style={{ color: '#535353' }}>{id}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Locked Since:</span>
                <span style={{ color: '#535353' }}>Dec 1, 2024</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Outstanding Balance:</span>
                <span className="font-semibold text-red-600">BDT 15,000</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#848484' }}>Account Type:</span>
                <span style={{ color: '#535353' }}>Guardian</span>
              </div>
            </div>
          </div>

          {/* Reason Field */}
          <div className="finance-card p-6 mb-6">
            <Label htmlFor="reason" style={{ color: '#535353' }}>
              Reason for Unlock * <span className="text-red-500">(Required)</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g., Payment arrangement made, Payment received via alternative method, Special circumstances..."
              className="mt-2 bg-white/50 border-white/50 min-h-[120px]"
              style={{ color: '#535353' }}
            />
            <p className="text-sm mt-2" style={{ color: '#848484' }}>
              This reason will be logged in the audit trail for accountability.
            </p>
          </div>

          {/* Confirmation Checkbox */}
          <div className="finance-card p-4 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmUnlock}
                onChange={(e) => setConfirmUnlock(e.target.checked)}
                className="mt-1 w-4 h-4"
              />
              <div>
                <span style={{ color: '#535353' }}>I confirm that I have verified the circumstances</span>
                <p className="text-sm mt-1" style={{ color: '#848484' }}>
                  I understand that unlocking this account will restore full access and this action will be recorded.
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleUnlock}
              disabled={!reason.trim() || !confirmUnlock}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Unlock Account
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
