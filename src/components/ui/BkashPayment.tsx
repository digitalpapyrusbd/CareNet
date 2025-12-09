'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import { apiCall } from '@/lib/api-client';

interface BkashPaymentProps {
  amount: number;
  jobId?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function BkashPayment({
  amount,
  jobId,
  onSuccess,
  onError,
  disabled = false,
  className = '',
}: BkashPaymentProps) {
  const { t } = useTranslationContext();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);

    try {
      const data = await apiCall('/payments/bkash/create', {
        method: 'POST',
        body: {
          amount,
          jobId,
          intent: 'sale',
          currency: 'BDT',
        },
      });

      if (data.success && data.payment.paymentURL) {
        // Redirect to bKash payment page
        window.location.href = data.payment.paymentURL;
      } else {
        throw new Error('Invalid payment response');
      }
    } catch (error: any) {
      console.error('bKash payment error:', error);
      onError?.(error.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      loading={isLoading}
      className={`w-full bg-pink-600 hover:bg-pink-700 text-white ${className}`}
    >
      {isLoading ? t('common.loading') : t('payments.payWithBkash')}
    </Button>
  );
}