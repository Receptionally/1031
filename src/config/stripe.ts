import { ENV } from './env';

export const STRIPE_CONFIG = {
  publishableKey: ENV.stripe.publishableKey,
  clientId: ENV.stripe.clientId,
  connectEndpoint: ENV.stripe.connectEndpoint,
} as const;