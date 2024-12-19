import { loadStripe } from '@stripe/stripe-js';
import { ENV } from '../config/env';
import { getStripeConnectUrl } from './stripe-connect';

export async function initializeStripeConnect() {
  try {
    const stripe = await loadStripe(ENV.stripe.publishableKey);
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }
    return stripe;
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    throw error;
  }
}

export function handleStripeConnect() {
  const connectUrl = getStripeConnectUrl();
  window.location.href = connectUrl;
}