import React, { useState } from 'react';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ENV } from '../../config/env';
import { logger } from '../../services/utils/logger';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../services/auth/context';

const stripePromise = loadStripe(ENV.stripe.publishableKey);

interface SubscriptionPaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onClose: () => void;
}

function SubscriptionPaymentFormContent({ clientSecret, onSuccess, onClose }: SubscriptionPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !user) return;

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) throw submitError;

      const { setupIntent, error: setupError } = await stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: 'if_required',
      });

      if (setupError) throw setupError;
      
      // Update seller status
      const { error: updateError } = await supabase
        .from('sellers')
        .update({
          setup_intent_status: setupIntent.status,
          subscription_status: setupIntent.status === 'succeeded' ? 'active' : 'none'
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      logger.info('Successfully set up subscription payment method');
      onSuccess();
    } catch (err) {
      logger.error('Error setting up subscription payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to set up payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Card Details
        </label>
        <PaymentElement />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {loading ? 'Setting up...' : 'Set Up Payment'}
        </button>
      </div>
    </form>
  );
}

interface SubscriptionPaymentModalProps {
  clientSecret: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function SubscriptionPaymentModal({ clientSecret, onSuccess, onClose }: SubscriptionPaymentModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Set Up Subscription Payment
        </h2>
        <Elements 
          stripe={stripePromise} 
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#ea580c',
              },
            },
          }}
        >
          <SubscriptionPaymentFormContent
            clientSecret={clientSecret}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </Elements>
      </div>
    </div>
  );
}