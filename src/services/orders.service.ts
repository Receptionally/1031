import { supabase } from '../config/supabase';
import { logger } from './utils/logger';
import type { Order } from '../types/order';

export async function getOrders(sellerId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    logger.error('Error fetching orders:', err);
    throw new Error('Failed to fetch orders');
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<void> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
    logger.info(`Updated order ${orderId} status to ${status}`);
  } catch (err) {
    logger.error('Error updating order status:', err);
    throw new Error('Failed to update order status');
  }
}

export async function createOrder(data: {
  sellerId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  stripeCustomerId?: string;
  stripeAccountId: string;
}): Promise<string> {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .insert([{
        seller_id: data.sellerId,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        product_name: data.productName,
        quantity: data.quantity,
        total_amount: data.totalAmount,
        status: 'pending',
        stripe_customer_id: data.stripeCustomerId,
        stripe_account_id: data.stripeAccountId,
        stripe_payment_status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    
    logger.info('Created order:', order);
    return order.id;
  } catch (err) {
    logger.error('Error creating order:', err);
    throw new Error('Failed to create order');
  }
}