import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ENV } from '../../config/env';
import { SubscriptionPaymentForm } from './Subscription/SubscriptionPaymentForm';
import { useSubscriptionStatus } from './hooks/useSubscriptionStatus';

const stripePromise = loadStripe(ENV.stripe.publishableKey);

interface PaymentSettingsProps {
  sellerId: string;
}

export function PaymentSettings({ sellerId }: PaymentSettingsProps) {
  const [showForm, setShowForm] = useState(false);
  const { status, loading, error } = useSubscriptionStatus(sellerId);

  if (loading || error || !status) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-6 w-6 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900">Current Status</h4>
          {status.subscription_status === 'active' && (
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <CreditCard className="h-4 w-4 mr-2 text-green-500" />
              <span>Card ending in {status.card_last4}</span>
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {status.subscription_status === 'active' ? (
              <>Your subscription is active and payment method is up to date.</>
            ) : (
              <>No payment method on file.</>
            )}
          </p>
        </div>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {status.subscription_status === 'active' ? 'Update Payment Method' : 'Add Payment Method'}
          </button>
        ) : (
          <Elements 
            stripe={stripePromise}
            options={{
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#ea580c',
                },
              },
            }}
          >
            <SubscriptionPaymentForm
              onSuccess={() => {
                sessionStorage.setItem('subscription_success', 'true');
                window.location.href = '/seller-dashboard';
              }}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}