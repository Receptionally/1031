import { logger } from '../utils/logger';

interface ChargeCustomerParams {
  stripeAccountId: string;
  customerId: string;
  amount: number;
  description?: string;
}

export async function chargeCustomer({
  stripeAccountId,
  customerId,
  amount,
  description,
}: ChargeCustomerParams): Promise<{ success: boolean; paymentIntentId: string }> {
  try {
    logger.info('Charging customer:', { 
      stripeAccountId,
      customerId,
      amount 
    });

    const response = await fetch('/.netlify/functions/charge-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stripeAccountId,
        customerId,
        amount,
        description,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to charge customer');
    }

    logger.info('Successfully charged customer:', {
      paymentIntentId: data.paymentIntentId
    });

    return data;
  } catch (error) {
    logger.error('Error charging customer:', error);
    throw error;
  }
}