import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { ENV } from '../../src/config/env';
import { supabase } from '../../src/config/supabase';

const stripe = new Stripe(ENV.stripe.secretKey, {
  apiVersion: '2023-10-16',
});

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
    const { sellerId, orderId, amount, type } = JSON.parse(event.body || '{}');

    // Get seller's payment method
    const { data: seller } = await supabase
      .from('sellers')
      .select('stripe_customer_id, default_payment_method')
      .eq('id', sellerId)
      .single();

    if (!seller?.stripe_customer_id || !seller?.default_payment_method) {
      throw new Error('No payment method found');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: seller.stripe_customer_id,
      payment_method: seller.default_payment_method,
      off_session: true,
      confirm: true,
      metadata: {
        seller_id: sellerId,
        order_id: orderId,
        type
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        paymentIntentId: paymentIntent.id,
      }),
    };
  } catch (error) {
    console.error('Payment error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process payment'
      }),
    };
  }
};