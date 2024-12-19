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
    const { code } = JSON.parse(event.body || '{}');

    if (!code || typeof code !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Authorization code is required' }),
      };
    }

    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        stripe_user_id: response.stripe_user_id,
        access_token: response.access_token,
      }),
    };
  } catch (error) {
    console.error('Stripe Connect Error:', error);

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
        error: error instanceof Error ? error.message : 'Failed to connect Stripe account'
      }),
    };
  }
};