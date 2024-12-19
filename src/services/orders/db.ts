import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';
import { OrderError } from './errors';
import { ORDER_STATUS, PAYMENT_STATUS } from './constants';
import type { OrderData } from './types';

export async function insertOrder(orderData: OrderData) {
  try {
    // First verify seller exists and is approved
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select('id, status')
      .eq('id', orderData.sellerId)
      .single();

    if (sellerError || !seller) {
      throw new Error('Seller not found');
    }

    if (seller.status !== 'approved') {
      throw new Error('Seller is not approved');
    }

    // Create order with proper data structure
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        seller_id: orderData.sellerId,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        product_name: orderData.productName,
        quantity: orderData.quantity,
        total_amount: orderData.totalAmount,
        stripe_customer_id: orderData.stripeCustomerId,
        stripe_account_id: orderData.stripeAccountId,
        stripe_payment_intent: orderData.stripePaymentIntent,
        stripe_payment_status: PAYMENT_STATUS.SUCCEEDED,
        stacking_included: orderData.stackingIncluded,
        stacking_fee: orderData.stackingFee,
        delivery_fee: orderData.deliveryFee,
        delivery_address: orderData.deliveryAddress,
        delivery_distance: orderData.deliveryDistance,
        status: ORDER_STATUS.PENDING
      }])
      .select()
      .single();

    if (orderError) {
      logger.error('Error inserting order:', orderError);
      throw orderError;
    }

    logger.info('✓ Order inserted successfully:', { orderId: order.id });
    return order;
  } catch (err) {
    logger.error('❌ Failed to insert order:', err);
    throw new OrderError(err instanceof Error ? err.message : 'Failed to insert order into database');
  }
}