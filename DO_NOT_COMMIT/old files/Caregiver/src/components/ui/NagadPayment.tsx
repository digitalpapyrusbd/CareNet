'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useTranslationContext } from '@/components/providers/TranslationProvider';
import { apiCall } from '@/lib/api-client';

interface NagadPaymentProps {
  amount: number;
  jobId?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function NagadPayment({
  amount,
  jobId,
  onSuccess,
  onError,
  disabled = false,
  className = '',
}: NagadPaymentProps) {
  const { t } = useTranslationContext();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);

    try {
      const data = await apiCall('/payments/nagad/create', {
        method: 'POST',
        body: {
          amount,
          jobId,
          currency: 'BDT',
        },
      });

      if (data.success && data.payment.paymentURL) {
        // Redirect to Nagad payment page
        window.location.href = data.payment.paymentURL;
      } else {
        throw new Error('Invalid payment response');
      }
    } catch (error: any) {
      console.error('Nagad payment error:', error);
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
      className={`w-full bg-orange-600 hover:bg-orange-700 text-white ${className}`}
    >
      {isLoading ? t('common.loading') : t('payments.payWithNagad')}
    </Button>
  );
}