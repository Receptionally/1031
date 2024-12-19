import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';
import type { Seller } from '../../types/seller';

export async function getApprovedSeller(): Promise<Seller | null> {
  try {
    const { data: sellers, error } = await supabase
      .from('sellers')
      .select(`
        id,
        business_name,
        stripe_account_id,
        status
      `)
      .eq('status', 'approved')
      .limit(1);

    if (error) {
      logger.error('Failed to fetch approved seller:', error);
      throw error;
    }

    if (!sellers || sellers.length === 0) {
      logger.warn('No approved sellers found');
      return null;
    }

    logger.info('Found approved seller:', { 
      sellerId: sellers[0].id,
      businessName: sellers[0].business_name 
    });

    return sellers[0];
  } catch (err) {
    logger.error('Error in getApprovedSeller:', err);
    throw new Error('Failed to fetch approved seller');
  }
}