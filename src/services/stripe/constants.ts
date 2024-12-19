export const STRIPE_CONSTANTS = {
  OAUTH_BASE_URL: 'https://connect.stripe.com/oauth/authorize',
  REQUIRED_SCOPE: 'read_write',
  BUSINESS_TYPE: 'company',
  COUNTRY: 'US',
  AUTH_CODE_PREFIX: 'ac_',
  MIN_AUTH_CODE_LENGTH: 24,
} as const;