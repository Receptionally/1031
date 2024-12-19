import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';
import type { Seller } from '../../types/seller';

export async function updateSellerStatus(sellerId: string, status: Seller['status']) {
  try {
    logger.info(`Updating seller ${sellerId} status to ${status}`);
    
    const { error: updateError } = await supabase
      .from('sellers')
      .update({ status })
      .eq('id', sellerId)
      .single();

    if (updateError) {
      logger.error('Error updating seller status:', updateError);
      throw new Error(updateError.message);
    }

    logger.info(`Successfully updated seller ${sellerId} status to ${status}`);
  } catch (err) {
    logger.error('Error updating seller status:', err);
    throw new Error(err instanceof Error ? err.message : 'Failed to update seller status');
  }
}