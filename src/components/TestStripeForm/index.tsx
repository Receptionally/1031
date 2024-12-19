import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ENV } from '../../config/env';
import { TestStripeFormContent } from './TestStripeFormContent';

// Test seller data
const TEST_SELLER = {
  id: 'test-seller',
  stripe_account_id: 'acct_1OWWuYB77t0h07Rw',
  has_stripe_account: true,
};

export function TestStripeForm() {
  // Initialize Stripe with connected account
  const stripePromise = loadStripe(ENV.stripe.publishableKey, {
    stripeAccount: TEST_SELLER.stripe_account_id
  });

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <Elements stripe={stripePromise}>
        <TestStripeFormContent />
      </Elements>
    </div>
  );
}