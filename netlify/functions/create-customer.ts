import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { ENV } from './utils/env';
import { supabase } from './utils/supabase';
import { logger } from './utils/logger';

if (!ENV.stripe.secretKey) {
  throw new Error('Missing Stripe secret key');
}

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
    if (!event.body) {
      throw new Error('Missing request body');
    }

    const { 
      customerName, 
      email, 
      phone, 
      address, 
      paymentMethod,
      stripeAccountId,
      sellerId,
    } = JSON.parse(event.body);

    // Validate required fields
    if (!customerName || !email || !paymentMethod || !stripeAccountId || !sellerId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    logger.info('Creating customer:', { email, stripeAccountId });

    // Create customer with payment method
    const customer = await stripe.customers.create({
      payment_method: paymentMethod,
      email,
      name: customerName,
      phone,
      address: address ? { line1: address } : undefined,
      metadata: {
        seller_id: sellerId
      }
    }, {
      stripeAccount: stripeAccountId,
    });

    // Set as default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    }, {
      stripeAccount: stripeAccountId,
    });

    logger.info('Customer created successfully:', { 
      customerId: customer.id,
      sellerId
    });

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