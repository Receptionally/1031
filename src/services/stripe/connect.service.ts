import { STRIPE_CONFIG } from './config';
import { generateRandomState } from './utils';
import { validateEnvironment } from './validation';
import type { StripeConnectParams } from './types';
import { StripeConnectionError } from './errors';

export function getStripeConnectUrl(): string {
  try {
    // Validate environment before proceeding
    validateEnvironment();

    const state = generateRandomState();
    sessionStorage.setItem('stripe_connect_state', state);
    
    const params: StripeConnectParams = {
      response_type: 'code',
      client_id: STRIPE_CONFIG.clientId,
      scope: 'read_write',
      redirect_uri: STRIPE_CONFIG.redirectUri,
      state,
      'stripe_user[business_type]': 'company',
      'stripe_user[country]': 'US',
      'stripe_user[product_description]': 'Firewood delivery services',
      'stripe_user[url]': STRIPE_CONFIG.redirectUri.split('/stripe')[0]
    };

    const searchParams = new URLSearchParams(params);
    return `https://connect.stripe.com/oauth/authorize?${searchParams.toString()}`;
  } catch (error) {
    console.error('Error generating Stripe connect URL:', error);
    throw new StripeConnectionError(
      error instanceof Error ? error.message : 'Failed to initialize Stripe connection'
    );
  }
}