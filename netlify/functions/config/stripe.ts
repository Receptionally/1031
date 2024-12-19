import Stripe from 'stripe';
import { logger } from '../../../src/services/utils/logger';

// Get environment variables without VITE_ prefix
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_SECRET_KEY || !STRIPE_PUBLISHABLE_KEY) {
  logger.error('Missing required Stripe configuration');
  throw new Error('Missing required Stripe configuration');
}

// Initialize Stripe client
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Export publishable key for client usage
export const stripePublishableKey = STRIPE_PUBLISHABLE_KEY;