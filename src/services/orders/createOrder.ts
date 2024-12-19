import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';
import { OrderError } from './errors';
import type { OrderData } from './types';

export async function createOrder(orderData: OrderData) {
  try {
    logger.info('Creating order:', {
      sellerId: orderData.sellerId,
      customerEmail: orderData.customerEmail,
      amount: orderData.totalAmount
    });

    // Create order with proper snake_case field names
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
        stripe_payment_status: 'succeeded',
        stacking_included: orderData.stackingIncluded,
        stacking_fee: orderData.stackingFee,
        delivery_fee: orderData.deliveryFee,
        delivery_address: orderData.deliveryAddress,
        delivery_distance: orderData.deliveryDistance,
        status: 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      logger.error('Error creating order:', orderError);
      throw new OrderError(orderError.message);
    }

    if (!order) {
      throw new OrderError('No order data returned');
    }

    logger.info('Order created successfully:', { orderId: order.id });
    return order;
  } catch (err) {
    logger.error('Failed to create order:', err);
    throw new OrderError(err instanceof Error ? err.message : 'Failed to create order');
  }
}