import { loadStripe } from '@stripe/stripe-js';
import { ENV } from '../../../config/env';
import { logger } from '../../../services/utils/logger';
import type { SellerWithAccount } from '../../../types/seller';

export function useStripeSetup(seller: SellerWithAccount) {
  const stripePromise = loadStripe(ENV.stripe.publishableKey, {
    stripeAccount: seller.stripe_account_id || undefined
  });

  logger.info('Setting up payment form:', {
    sellerId: seller.id,
    stripeAccountId: seller.stripe_account_id
  });

  return stripePromise;
}