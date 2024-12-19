import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ENV } from '../../../config/env';
import { SubscriptionPaymentForm } from './SubscriptionPaymentForm';

const stripePromise = loadStripe(ENV.stripe.publishableKey);

interface SubscriptionButtonProps {
  sellerId: string;
}

export function SubscriptionButton({ sellerId }: SubscriptionButtonProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Set Up Payment Method
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
  );
}