import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';

export async function updateSellerSubscription(
  sellerId: string,
  status: 'active' | 'past_due' | 'canceled'
): Promise<void> {
  try {
    const { error } = await supabase
      .from('sellers')
      .update({
        subscription_status: status,
        subscription_start_date: status === 'active' ? new Date().toISOString() : null
      })
      .eq('id', sellerId);

    if (error) throw error;
    logger.info('Updated seller subscription:', { sellerId, status });
  } catch (err) {
    logger.error('Error updating seller subscription:', err);
    throw err;
  }
}