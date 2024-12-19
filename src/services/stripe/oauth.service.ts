import { ENV } from '../../config/env';
import { logger } from '../utils/logger';
import type { StripeConnectResponse } from './types';

export async function exchangeStripeCode(code: string): Promise<StripeConnectResponse> {
  try {
    logger.info('Exchanging authorization code for access token');
    
    const response = await fetch('/.netlify/functions/stripe-connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to connect Stripe account');
    }

    if (!data.stripe_user_id || !data.access_token) {
      throw new Error('Invalid response from Stripe OAuth');
    }

    return {
      stripe_user_id: data.stripe_user_id,
      access_token: data.access_token,
    };
  } catch (error) {
    logger.error('Error exchanging Stripe code:', error);
    throw error;
  }
}

export function generateStripeAuthUrl(): string {
  const state = generateSecureState();
  
  sessionStorage.setItem('stripe_connect_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: ENV.stripe.clientId,
    scope: 'read_write',
    redirect_uri: `${ENV.app.url}/stripe/callback`,
    state,
    'stripe_user[business_type]': 'company',
    'stripe_user[country]': 'US',
    'stripe_user[product_description]': 'Firewood delivery platform',
    'stripe_user[url]': ENV.app.url,
  });

  return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
}

export function validateStripeState(state: string): boolean {
  const savedState = sessionStorage.getItem('stripe_connect_state');
  
  // Clean up stored value immediately
  sessionStorage.removeItem('stripe_connect_state');

  if (!savedState || state !== savedState) {
    throw new Error('Invalid state parameter - possible CSRF attack');
  }

  return true;
}

function generateSecureState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}