import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { createSetupIntent } from '../../services/stripe/setupIntent';
import { useAuth } from '../../services/auth/context';
import { SubscriptionPaymentModal } from './SubscriptionPayment/SubscriptionPaymentModal';
import { logger } from '../../services/utils/logger';

interface SubscriptionButtonProps {
  sellerId: string;
  totalOrders: number;
}

export function SubscriptionButton({ sellerId, totalOrders }: SubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubscribe = async () => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      setLoading(true);
      setError(null);
      
      const secret = await createSetupIntent(sellerId);
      setClientSecret(secret);
      
      logger.info('Created setup intent for subscription');
    } catch (err) {
      logger.error('Error creating setup intent:', err);
      setError(err instanceof Error ? err.message : 'Failed to setup subscription');
    } finally {
      setLoading(false);
    }
  };

  const ordersRemaining = Math.max(0, 3 - totalOrders);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <CreditCard className="h-6 w-6 text-orange-600" />
        <h3 className="text-lg font-medium text-gray-900">Subscription Required</h3>
      </div>

      <p className="text-gray-600 mb-6">
        {ordersRemaining > 0 ? (
          <>You have {ordersRemaining} free {ordersRemaining === 1 ? 'order' : 'orders'} remaining. After that, a fee of $10 per order will apply.</>
        ) : (
          <>You've used all your free orders. A fee of $10 per order now applies to continue accepting orders.</>
        )}
      </p>

      <div className="space-y-4">
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Setting Up Payment...
            </>
          ) : (
            'Set Up Payment Method'
          )}
        </button>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="text-sm text-gray-500">
          <ul className="list-disc list-inside space-y-1">
            <li>No monthly fees or minimums</li>
            <li>Only pay when you receive orders</li>
            <li>Keep 100% of delivery fees</li>
            <li>Cancel anytime</li>
          </ul>
        </div>
      </div>

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
    </div>
  );
}