import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ENV } from '../../../config/env';
import { SubscriptionPaymentForm } from './SubscriptionPaymentForm';

const stripePromise = loadStripe(ENV.stripe.publishableKey);

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
            clientSecret: clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#ea580c',
              },
            },
          }}
        >
          <SubscriptionPaymentForm
            clientSecret={clientSecret}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </Elements>
      </div>
    </div>
  );
}