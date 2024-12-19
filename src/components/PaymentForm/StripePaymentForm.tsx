import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ENV } from '../../config/env';
import { PaymentFormContent } from './PaymentFormContent';
import type { SellerWithAccount } from '../../types/seller';
import { logger } from '../../services/utils/logger';

interface StripePaymentFormProps {
  seller: SellerWithAccount;
  productId: string;
  quantity: number;
  amount: number;
  deliveryAddress: string;
  onSuccess: () => void;
}

export function StripePaymentForm(props: StripePaymentFormProps) {
  const { seller } = props;

  // Initialize Stripe with the seller's connected account
  const stripePromise = loadStripe(ENV.stripe.publishableKey, {
    stripeAccount: seller.stripe_account_id
  });

  logger.info('Initializing Stripe payment form:', {
    sellerId: seller.id,
    stripeAccountId: seller.stripe_account_id
  });

  return (
    <div className="space-y-6">
      <Elements stripe={stripePromise}>
        <PaymentFormContent {...props} />
      </Elements>
    </div>
  );
}