import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';

export async function createTestSeller() {
  try {
    // First check if test seller already exists
    const { data: existingSeller } = await supabase
      .from('sellers')
      .select('id')
      .eq('email', 'test.seller@example.com')
      .single();

    if (existingSeller) {
      logger.info('Test seller already exists:', { sellerId: existingSeller.id });
      return existingSeller;
    }

    // Create test seller
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .insert([{
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
      }])
      .select()
      .single();

    if (sellerError) {
      logger.error('Error creating seller:', sellerError);
      throw sellerError;
    }

    // Create test Stripe connected account
    const { error: accountError } = await supabase
      .from('connected_accounts')
      .insert([{
        seller_id: seller.id,
        stripe_account_id: 'acct_test123',
        access_token: 'sk_test_123',
      }]);

    if (accountError) {
      logger.error('Error creating connected account:', accountError);
      throw accountError;
    }

    logger.info('✓ Test seller created successfully:', {
      sellerId: seller.id,
      businessName: seller.business_name
    });

    return seller;
  } catch (err) {
    logger.error('❌ Error creating test seller:', err);
    throw new Error('Failed to create test seller');
  }
}