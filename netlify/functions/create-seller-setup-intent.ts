import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { logger } from '../../src/services/utils/logger';

// Get environment variables
const STRIPE_SECRET_KEY = process.env.VITE_STRIPE_SECRET_KEY;
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

if (!STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': APP_URL,
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
    if (!event.body) {
      throw new Error('Missing request body');
    }

    const { sellerId } = JSON.parse(event.body);

    if (!sellerId) {
      throw new Error('Seller ID is required');
    }

    logger.info('Creating setup intent for seller:', { sellerId });

    // Create setup intent
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['card'],
      usage: 'off_session', // Allow charging later
      metadata: {
        seller_id: sellerId,
        type: 'subscription'
      }
    });

    logger.info('Setup intent created:', { 
      setupIntentId: setupIntent.id,
      sellerId 
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clientSecret: setupIntent.client_secret,
      }),
    };
  } catch (err) {
    logger.error('Error creating setup intent:', err);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: err instanceof Error ? err.message : 'Failed to create setup intent'
      }),
    };
  }
};