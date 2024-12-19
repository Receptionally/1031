import { stripe } from '../utils/stripe';
import { logger } from '../utils/logger';

interface CreateCustomerParams {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  paymentMethod: string;
  stripeAccountId: string;
}

export async function createCustomer({
  name,
  email,
  phone,
  address,
  paymentMethod,
  stripeAccountId,
}: CreateCustomerParams) {
  try {
    logger.info('Creating customer:', { email, stripeAccountId });

    const customer = await stripe.customers.create(
      {
        name,
        email,
        phone,
        address: address ? { line1: address } : undefined,
        payment_method: paymentMethod,
        invoice_settings: {
          default_payment_method: paymentMethod,
        },
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    logger.info('Customer created:', { 
      customerId: customer.id,
      stripeAccountId 
    });

    return customer;
  } catch (err) {
    logger.error('Error creating customer:', err);
    throw err;
  }
}