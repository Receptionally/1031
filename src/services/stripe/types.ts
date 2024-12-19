export interface StripeConnectResponse {
  stripe_user_id: string;
  access_token: string;
  error?: string;
  error_description?: string;
}

export interface StripeConnectParams {
  response_type: string;
  client_id: string;
  scope: string;
  redirect_uri: string;
  state: string;
  'stripe_user[business_type]': string;
  'stripe_user[country]': string;
}

export interface StripeError extends Error {
  type?: string;
  code?: string;
  decline_code?: string;
  param?: string;
}