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
    const { sellerId } = JSON.parse(event.body || '{}');

    // Get seller's Stripe account ID
    const { data: account, error: accountError } = await supabase
      .from('connected_accounts')
      .select('stripe_account_id')
      .eq('seller_id', sellerId)
      .single();

    if (accountError || !account) {
      throw new Error('Stripe account not found');
    }

    // Get balance
    const balance = await stripe.balance.retrieve({
      stripeAccount: account.stripe_account_id,
    });

    // Get recent payouts
    const payouts = await stripe.payouts.list({
      limit: 1,
      stripeAccount: account.stripe_account_id,
    });

    const lastPayout = payouts.data[0];

    logger.info('Retrieved balance for seller:', {
      sellerId,
      stripeAccountId: account.stripe_account_id
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        available: balance.available.reduce((sum, bal) => sum + bal.amount, 0),
        pending: balance.pending.reduce((sum, bal) => sum + bal.amount, 0),
        lastPayout: lastPayout ? {
          amount: lastPayout.amount,
          date: lastPayout.arrival_date,
        } : undefined,
      }),
    };
  } catch (error) {
    logger.error('Error getting balance:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to get balance'
      }),
    };
  }
};