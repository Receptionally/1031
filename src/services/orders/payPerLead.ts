import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';

export async function unlockOrder(orderId: string, sellerId: string): Promise<boolean> {
  try {
    // Create payment intent for $10
    const response = await fetch('/.netlify/functions/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1000, // $10.00 in cents
        sellerId,
        orderId,
        type: 'lead_unlock'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment');
    }

    // Update order visibility
    const { error: updateError } = await supabase
      .from('orders')
      .update({ is_hidden: false })
      .eq('id', orderId)
      .eq('seller_id', sellerId);

    if (updateError) throw updateError;

    logger.info('Order unlocked successfully:', { orderId, sellerId });
    return true;
  } catch (err) {
    logger.error('Error unlocking order:', err);
    throw err;
  }
}

export async function shouldHideOrder(sellerId: string, orderId: string): Promise<boolean> {
  try {
    // Get total orders for seller
    const { count } = await supabase
      .from('orders')
      .select('id', { count: 'exact' })
      .eq('seller_id', sellerId)
      .lt('created_at', (await supabase.from('orders').select('created_at').eq('id', orderId).single()).data?.created_at);

    // First 3 orders are free
    if (count && count <= 3) {
      return false;
    }

    // Check if order is already unlocked
    const { data: order } = await supabase
      .from('orders')
      .select('is_hidden')
      .eq('id', orderId)
      .single();

    return order?.is_hidden ?? true;
  } catch (err) {
    logger.error('Error checking order visibility:', err);
    return true;
  }
}