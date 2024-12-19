import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

// Get environment variables directly
const STRIPE_SECRET_KEY = process.env.VITE_STRIPE_SECRET_KEY;
const STRIPE_CLIENT_ID = process.env.VITE_STRIPE_CLIENT_ID;
const APP_URL = process.env.VITE_APP_URL;

if (!STRIPE_SECRET_KEY || !STRIPE_CLIENT_ID) {
  throw new Error('Missing required Stripe configuration');
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': APP_URL || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { stripeAccountId } = JSON.parse(event.body || '{}');

    if (!stripeAccountId || typeof stripeAccountId !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Stripe account ID is required' }),
      };
    }

    await stripe.oauth.deauthorize({
      client_id: STRIPE_CLIENT_ID,
      stripe_user_id: stripeAccountId,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Stripe Disconnect Error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return {
        statusCode: error.statusCode || 500,
        headers,
        body: JSON.stringify({ 
          error: error.message,
          type: error.type,
          code: error.code
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to disconnect Stripe account'
      }),
    };
  }
};