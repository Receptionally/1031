import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { createSetupIntent } from '../../services/stripe/setupIntent';
import { SetupPaymentModal } from './SetupPaymentForm';
import { logger } from '../../services/utils/logger';

interface UpdatePaymentButtonProps {
  sellerId: string;
}

export function UpdatePaymentButton({ sellerId }: UpdatePaymentButtonProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdatePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const secret = await createSetupIntent(sellerId);
      setClientSecret(secret);
      
      logger.info('Created setup intent for payment update');
    } catch (err) {
      logger.error('Error creating setup intent:', err);
      setError(err instanceof Error ? err.message : 'Failed to setup payment update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleUpdatePayment}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {loading ? 'Setting up...' : 'Update Payment Method'}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {clientSecret && (
        <SetupPaymentModal
          clientSecret={clientSecret}
          onSuccess={() => {
            setClientSecret(null);
            window.location.reload();
          }}
          onClose={() => {
            setClientSecret(null);
          }}
        />
      )}
    </>
  );
}