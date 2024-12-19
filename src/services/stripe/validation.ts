import { StripeValidationError } from './errors';
import { ENV } from '../../config/env';
import { STRIPE_CONSTANTS } from './constants';

export function validateStripeCode(code: string | null): boolean {
  if (!code) {
    throw new StripeValidationError('Authorization code is required');
  }
  
  if (!code.startsWith(STRIPE_CONSTANTS.AUTH_CODE_PREFIX)) {
    throw new StripeValidationError('Invalid authorization code format');
  }
  
  const codePattern = new RegExp(
    `^${STRIPE_CONSTANTS.AUTH_CODE_PREFIX}[a-zA-Z0-9]{${STRIPE_CONSTANTS.MIN_AUTH_CODE_LENGTH},}$`
  );
  
  if (!codePattern.test(code)) {
    throw new StripeValidationError('Invalid authorization code length or characters');
  }
  
  return true;
}

export function validateStripeState(state: string | null): boolean {
  if (!state) {
    throw new StripeValidationError('State parameter is required');
  }
  
  const savedState = sessionStorage.getItem('stripe_connect_state');
  if (!savedState) {
    throw new StripeValidationError('No saved state found');
  }
  
  // Clear the state immediately after reading it
  sessionStorage.removeItem('stripe_connect_state');
  
  if (state !== savedState) {
    throw new StripeValidationError('State mismatch - possible CSRF attack');
  }
  
  return true;
}

export function validateEnvironment(): void {
  if (!ENV.stripe.publishableKey || !ENV.stripe.clientId || !ENV.app.url) {
    throw new Error('Missing required Stripe environment variables');
  }
}