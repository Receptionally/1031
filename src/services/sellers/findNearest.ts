import { supabase } from '../../config/supabase';
import { findNearestSellers } from '../../utils/seller-matching';
import { logger } from '../utils/logger';
import type { SellerWithAccount } from '../../types/seller';

export async function findNearestSeller(customerAddress: string): Promise<SellerWithAccount | null> {
  try {
    const { data: sellers, error } = await supabase
      .from('sellers_with_stripe')
      .select('*')
      .eq('can_accept_orders', true)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching sellers:', error);
      throw error;
    }

    if (!sellers?.length) {
      logger.warn('No approved sellers found');
      return null;
    }

    logger.info(`Found ${sellers.length} approved sellers`);

    const matches = await findNearestSellers(customerAddress, sellers);
    if (!matches.length) {
      return null;
    }

    const nearestSeller = matches[0].seller as SellerWithAccount;
    logger.info('Found nearest seller:', {
      id: nearestSeller.id,
      businessName: nearestSeller.business_name,
      hasStripeAccount: nearestSeller.has_stripe_account
    });

    return nearestSeller;
  } catch (err) {
    logger.error('Error finding nearest seller:', err);
    throw err;
  }
}