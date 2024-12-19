import { Handler } from '@netlify/functions';
import { ENV } from './utils/env';
import { logger } from './utils/logger';
import { createStripeCustomer } from './utils/stripe-customer';
import { supabase } from './utils/supabase';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': ENV.app.url || '*',
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

    const { sellerId, paymentMethodId } = JSON.parse(event.body);

    // Validate required fields
    if (!sellerId || !paymentMethodId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Get seller's email
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select('email')
      .eq('id', sellerId)
      .single();

    if (sellerError || !seller) {
      throw new Error('Seller not found');
    }

    // Create Stripe customer
    const customer = await createStripeCustomer({
      sellerId,
      paymentMethodId,
      email: seller.email
    });

    // Update seller with Stripe customer ID
    const { error: updateError } = await supabase
      .from('sellers')
      .update({
        stripe_customer_id: customer.id,
        setup_intent_status: 'succeeded',
        subscription_status: 'active'
      })
      .eq('id', sellerId);

    if (updateError) {
      throw updateError;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        customerId: customer.id,
      }),
    };
  } catch (err) {
    logger.error('Error creating customer:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: err instanceof Error ? err.message : 'Failed to create customer'
      }),
    };
  }
};