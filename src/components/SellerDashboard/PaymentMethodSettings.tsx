import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { createSetupIntent } from '../../services/stripe/setupIntent';
import { SubscriptionPaymentModal } from './SubscriptionPayment/SubscriptionPaymentModal';
import { logger } from '../../services/utils/logger';

interface PaymentMethodSettingsProps {
  sellerId: string;
  subscriptionStatus: string;
}

export function PaymentMethodSettings({ sellerId, subscriptionStatus }: PaymentMethodSettingsProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdatePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const secret = await createSetupIntent(sellerId);
      setClientSecret(secret);
      sessionStorage.setItem('setup_intent_id', secret.split('_secret_')[0]);
      
      logger.info('Created setup intent for payment update');
    } catch (err) {
      logger.error('Error creating setup intent:', err);
      setError(err instanceof Error ? err.message : 'Failed to setup payment update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Update your subscription payment method
          </p>
        </div>
        <button
          onClick={handleUpdatePayment}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Updating...
            </>
          ) : (
            'Update Payment Method'
          )}
        </button>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {clientSecret && (
        <SubscriptionPaymentModal
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

      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900">Subscription Status</h4>
        <p className="mt-1 text-sm text-gray-500">
          {subscriptionStatus === 'active' 
            ? 'Your subscription is active and payment method is up to date.'
            : 'Add a payment method to enable subscription charges.'}
        </p>
      </div>
    </div>
  );
}