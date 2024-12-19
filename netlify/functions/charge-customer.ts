import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { logger } from '../../src/services/utils/logger';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.APP_URL;

if (!STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
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
    const { stripeAccountId, customerId, amount, description } = JSON.parse(event.body || '{}');

    if (!stripeAccountId || !customerId || !amount) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Get customer's default payment method
    const customer = await stripe.customers.retrieve(customerId, {
      stripeAccount: stripeAccountId,
    });

    if (!customer || customer.deleted) {
      throw new Error('Customer not found');
    }

    const defaultPaymentMethod = customer.invoice_settings?.default_payment_method;
    if (!defaultPaymentMethod) {
      throw new Error('No default payment method found for customer');
    }

    // Create and confirm payment intent
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        customer: customerId,
        payment_method: defaultPaymentMethod as string,
        description,
        confirm: true,
        off_session: true,
        payment_method_types: ['card'],
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    logger.info('Successfully created payment intent:', {
      paymentIntentId: paymentIntent.id,
      amount: amount,
      customerId: customerId,
      stripeAccountId: stripeAccountId
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
    logger.error('Charge Error:', error);
    let errorMessage = 'Failed to charge customer';
    let statusCode = 500;

    if (error instanceof Stripe.errors.StripeError) {
      statusCode = error.statusCode || 500;
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};