import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentFormContent } from './PaymentFormContent';
import { NonStripeForm } from './NonStripeForm';
import { ENV } from '../../config/env';
import type { SellerWithAccount } from '../../types/seller';
import { logger } from '../../services/utils/logger';

interface CustomerFormProps {
  seller: SellerWithAccount;
  productId: string;
  quantity: number;
  includeStacking: boolean;
  amount: number;
  deliveryAddress: string;
  onSuccess: () => void;
}

export function CustomerForm(props: CustomerFormProps) {
  const { seller } = props;

  logger.info('Initializing customer form:', {
    sellerId: seller.id,
    hasStripeAccount: seller.has_stripe_account
  });

  // Show Stripe form if seller has a connected account
  if (seller.has_stripe_account && seller.stripe_account_id) {
    const stripePromise = loadStripe(ENV.stripe.publishableKey, {
      stripeAccount: seller.stripe_account_id
    });

    return (
      <div className="space-y-6">
        <Elements stripe={stripePromise}>
          <PaymentFormContent {...props} />
        </Elements>
      </div>
    );
  } else {
    // Show non-Stripe form for sellers without Stripe
    return <NonStripeForm {...props} />;
  }
}