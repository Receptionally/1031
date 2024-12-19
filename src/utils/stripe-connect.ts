import { ENV } from '../config/env';

export function getStripeConnectUrl(): string {
  const redirectUri = `${ENV.app.url}/stripe/callback`;
  const state = generateRandomState();
  
  // Store state in sessionStorage for validation
  sessionStorage.setItem('stripe_connect_state', state);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: ENV.stripe.clientId,
    scope: 'read_write',
    redirect_uri: redirectUri,
    state: state,
    'stripe_user[business_type]': 'company',
    'stripe_user[country]': 'US',
  });

  return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
}

export function validateStripeCode(code: string | null): boolean {
  if (!code) return false;
  // Stripe authorization codes start with 'ac_'
  return /^ac_[a-zA-Z0-9]+$/.test(code);
}

export function validateStripeState(state: string | null): boolean {
  if (!state) return false;
  const savedState = sessionStorage.getItem('stripe_connect_state');
  sessionStorage.removeItem('stripe_connect_state'); // Clear after checking
  return state === savedState;
}

function generateRandomState(): string {
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  return Array.from(array, dec => dec.toString(16)).join('');
}