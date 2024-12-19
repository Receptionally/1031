import { Stripe } from 'stripe';
import { logger } from './logger';
import { stripe } from './stripe';

interface CreateCustomerParams {
  sellerId: string;
  paymentMethodId: string;
  email: string;
}

export async function createStripeCustomer({
  sellerId,
  paymentMethodId,
  email,
}: CreateCustomerParams): Promise<Stripe.Customer> {
  try {
    // Create customer with payment method
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email,
      metadata: {
        seller_id: sellerId
      }
    });

    // Set as default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    logger.info('Created Stripe customer:', { 
      customerId: customer.id,
      sellerId 
    });

    return customer;
  } catch (err) {
    logger.error('Error creating Stripe customer:', err);
    throw err;
  }
}