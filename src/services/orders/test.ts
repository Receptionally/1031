import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';
import { ORDER_STATUS, PAYMENT_STATUS } from './constants';
import { getApprovedSeller } from '../sellers/queries';
import { verifyDatabaseConnection } from './db';

export async function createTestOrder() {
  try {
    // First verify database connection
    await verifyDatabaseConnection();

    // Get an approved seller
    const seller = await getApprovedSeller();
    if (!seller) {
      throw new Error('No approved sellers found. Please create and approve a seller first.');
    }

    // Create test order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        seller_id: seller.id,
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        product_name: '2 cords of Firewood',
        quantity: 2,
        total_amount: 599.98,
        status: ORDER_STATUS.PENDING,
        stripe_customer_id: 'cus_test123',
        stripe_payment_intent: 'pi_test123',
        stripe_payment_status: PAYMENT_STATUS.SUCCEEDED,
        stripe_account_id: seller.stripe_account_id || 'acct_test123',
        stacking_included: true,
        stacking_fee: 50.00,
        delivery_fee: 75.00,
        delivery_address: '123 Test St, Portland, OR 97201',
        delivery_distance: 15.5,
      }])
      .select()
      .single();

    if (orderError) {
      logger.error('Error creating test order:', orderError);
      throw new Error('Failed to create test order');
    }

    logger.info('✓ Test order created successfully:', {
      orderId: order.id,
      sellerId: order.seller_id
    });

    return order;
  } catch (err) {
    logger.error('❌ Error creating test order:', err);
    throw new Error(err instanceof Error ? err.message : 'Failed to create test order');
  }
}