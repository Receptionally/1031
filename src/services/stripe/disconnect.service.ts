import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';

export async function disconnectStripeAccount(stripeAccountId: string): Promise<boolean> {
  try {
    logger.info('Disconnecting Stripe account:', stripeAccountId);

    // First, disconnect from Stripe
    const response = await fetch('/.netlify/functions/stripe-disconnect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stripeAccountId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to disconnect account');
    }

    // Then, delete from Supabase
    const { error: deleteError } = await supabase
      .from('connected_accounts')
      .delete()
      .eq('stripe_account_id', stripeAccountId);

    if (deleteError) throw deleteError;
    logger.info('Successfully disconnected Stripe account');

    return true;
  } catch (error) {
    logger.error('Error disconnecting account:', error);
    throw error;
  }
}