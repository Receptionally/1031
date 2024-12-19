import { supabase } from '../../../config/supabase';
import { logger } from '../../utils/logger';
import { ORDER_STATUS, PAYMENT_STATUS } from '../constants';
import type { Seller } from '../../../types/seller';

const TEST_ORDER_DATA = {
  customer_name: 'Test Customer',
  customer_email: 'test@example.com',
  product_name: '2 cords of Firewood',
  quantity: 2,
  total_amount: 599.98,
  status: ORDER_STATUS.PENDING,
  stripe_customer_id: 'cus_test123',
  stripe_payment_intent: 'pi_test123',
  stripe_payment_status: PAYMENT_STATUS.SUCCEEDED,
  stacking_included: true,
  stacking_fee: 50.00,
  delivery_fee: 75.00,
  delivery_address: '123 Test St, Portland, OR 97201',
  delivery_distance: 15.5,
} as const;

export async function createTestOrder(seller: Seller) {
  try {
    // Create test order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        seller_id: seller.id,
        stripe_account_id: 'acct_test123',
        ...TEST_ORDER_DATA
      }])
      .select()
      .single();

    if (orderError || !order) {
      logger.error('Failed to create test order:', orderError);
      throw new Error('Failed to create test order');
    }

    logger.info('Test order created:', {
      orderId: order.id,
      sellerId: order.seller_id
    });

    return order;
  } catch (err) {
    logger.error('Error in createTestOrder:', err);
    throw new Error('Failed to create test order');
  }
}