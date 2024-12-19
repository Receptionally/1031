import { supabase } from '../../../config/supabase';
import { logger } from '../../utils/logger';
import type { Seller } from '../../../types/seller';

const TEST_SELLER_DATA = {
  name: 'Test Seller',
  business_name: 'Test Firewood Co.',
  business_address: '123 Wood St, Portland, OR 97201',
  email: 'test.seller@example.com',
  phone: '(555) 123-4567',
  firewood_unit: 'cords',
  price_per_unit: 299.99,
  max_delivery_distance: 50,
  min_delivery_fee: 25,
  price_per_mile: 2,
  payment_timing: 'delivery',
  provides_stacking: true,
  stacking_fee_per_unit: 25,
  bio: 'Test seller providing quality firewood',
  status: 'approved'
} as const;

export async function createTestSeller(): Promise<Seller> {
  try {
    // First verify database connection
    const { error: connectionError } = await supabase
      .from('sellers')
      .select('count');

    if (connectionError) {
      logger.error('Database connection error:', connectionError);
      throw new Error('Database connection failed');
    }

    // Check if test seller exists
    const { data: existingSeller } = await supabase
      .from('sellers')
      .select('*')
      .eq('email', TEST_SELLER_DATA.email)
      .single();

    if (existingSeller) {
      logger.info('Test seller already exists:', { 
        sellerId: existingSeller.id,
        email: existingSeller.email
      });
      return existingSeller;
    }

    // Create new test seller
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .insert([TEST_SELLER_DATA])
      .select()
      .single();

    if (sellerError || !seller) {
      logger.error('Failed to create test seller:', sellerError);
      throw new Error('Failed to create test seller');
    }

    logger.info('Test seller created:', { 
      sellerId: seller.id,
      email: seller.email
    });

    return seller;
  } catch (err) {
    logger.error('Error in createTestSeller:', err);
    throw new Error('Failed to create test seller');
  }
}