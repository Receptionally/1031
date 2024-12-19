import { ENV } from '../../config/env';

if (!ENV.stripe.publishableKey || !ENV.stripe.clientId || !ENV.app.url) {
  throw new Error('Missing required Stripe configuration');
}

// Ensure URL has no trailing slash before adding path
const baseUrl = ENV.app.url.replace(/\/+$/, '');

export const STRIPE_CONFIG = {
  publishableKey: ENV.stripe.publishableKey,
  clientId: ENV.stripe.clientId,
  redirectUri: `${baseUrl}/stripe/callback`,
} as const;