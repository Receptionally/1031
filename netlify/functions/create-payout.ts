import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { supabase } from './utils/supabase';
import { logger } from './utils/logger';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
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
    const { sellerId, amount } = JSON.parse(event.body || '{}');

    // Get seller's Stripe account ID
    const { data: account, error: accountError } = await supabase
      .from('connected_accounts')
      .select('stripe_account_id')
      .eq('seller_id', sellerId)
      .single();

    if (accountError || !account) {
      throw new Error('Stripe account not found');
    }

    // Create payout
    const payout = await stripe.payouts.create(
      {
        amount: amount,
        currency: 'usd',
        method: 'standard',
      },
      {
        stripeAccount: account.stripe_account_id,
      }
    );

    logger.info('Created payout for seller:', {
      sellerId,
      stripeAccountId: account.stripe_account_id,
      payoutId: payout.id,
      amount: amount
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        payoutId: payout.id,
      }),
    };
  } catch (error) {
    logger.error('Error creating payout:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to create payout'
      }),
    };
  }
};