import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';

export async function createSellerCustomer(sellerId: string): Promise<string> {
  try {
    // Create customer via Netlify function
    const response = await fetch('/.netlify/functions/create-seller-setup-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sellerId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create customer');
    }

    const { clientSecret } = await response.json();
    logger.info('Created setup intent for seller:', { sellerId });
    
    return clientSecret;
  } catch (err) {
    logger.error('Error creating seller customer:', err);
    throw err;
  }
}