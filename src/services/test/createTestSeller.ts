import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';

const TEST_SELLER_DATA = {
  name: 'Kai Kalani',
  business_name: 'Aloha Firewood Co.',
  business_address: '123 Ala Moana Blvd, Honolulu, HI 96815',
  email: 'kai@alohafirewood.com',
  phone: '(808) 555-0123',
  firewood_unit: 'cords',
  price_per_unit: 399.99,
  max_delivery_distance: 100,
  min_delivery_fee: 50,
  price_per_mile: 2.50,
  payment_timing: 'delivery',
  provides_stacking: true,
  stacking_fee_per_unit: 50,
  bio: 'Serving the Hawaiian islands with premium ohia and kiawe firewood since 1995. Our wood is locally sourced and properly seasoned to ensure the best burning experience.',
  profile_image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  status: 'approved'
} as const;

export async function createTestSeller() {
  try {
    logger.info('Creating test seller...');

    // First check if test seller exists
    const { data: existingSeller } = await supabase
      .from('sellers')
      .select('*')
      .eq('email', TEST_SELLER_DATA.email)
      .single();

    if (existingSeller) {
      // Update the existing seller to ensure it's approved and has correct location
      const { data: updatedSeller, error: updateError } = await supabase
        .from('sellers')
        .update({
          status: 'approved',
          max_delivery_distance: TEST_SELLER_DATA.max_delivery_distance,
          business_address: TEST_SELLER_DATA.business_address
        })
        .eq('id', existingSeller.id)
        .select()
        .single();

      if (updateError) {
        logger.error('Failed to update test seller:', updateError);
        throw updateError;
      }

      logger.info('Test seller already exists and updated:', { id: updatedSeller.id });
      return updatedSeller;
    }

    // Create new test seller
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .insert([TEST_SELLER_DATA])
      .select()
      .single();

    if (sellerError) {
      logger.error('Failed to create test seller:', sellerError);
      throw sellerError;
    }

    logger.info('Test seller created successfully:', { id: seller.id });
    return seller;
  } catch (err) {
    logger.error('Error in createTestSeller:', err);
    throw new Error('Failed to create test seller');
  }
}