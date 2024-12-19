import { supabase } from '../config/supabase';
import type { SellerWithAccount } from '../types/seller';
import { logger } from './utils/logger';
import { findNearestSellers } from '../utils/seller-matching';

export async function findNearestSeller(customerAddress: string): Promise<SellerWithAccount | null> {
  try {
    // Get all approved sellers with their Stripe accounts using the view
    const { data: sellers, error } = await supabase
      .from('sellers_with_stripe')
      .select(`
        *
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching sellers:', error);
      throw error;
    }

    if (!sellers || sellers.length === 0) {
      logger.warn('No approved sellers found');
      return null;
    }

    logger.info(`Found ${sellers.length} approved sellers`);

    // Find nearest sellers using utility function
    const matches = await findNearestSellers(customerAddress, sellers);
    
    if (matches.length > 0) {
      const nearestSeller = matches[0].seller as SellerWithAccount;
      logger.info('Found nearest seller:', {
        id: nearestSeller.id,
        businessName: nearestSeller.business_name,
        hasStripeAccount: nearestSeller.has_stripe_account
      });
      return nearestSeller;
    }

    return null;
  } catch (err) {
    logger.error('Error finding nearest seller:', err);
    throw err;
  }
}