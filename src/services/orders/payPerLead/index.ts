import { logger } from '../../utils/logger';
import { createUnlockPayment } from './api';
import { updateOrderVisibility, getOrderCount, getOrderVisibility } from './db';

export async function unlockOrder(orderId: string, sellerId: string): Promise<boolean> {
  try {
    // Check if order is already visible
    const isHidden = await getOrderVisibility(orderId);
    if (!isHidden) {
      return true; // Already visible
    }

    // Create payment
    const payment = await createUnlockPayment({ orderId, sellerId });
    
    if (!payment.success) {
      throw new Error(payment.error || 'Payment failed');
    }

    // Update order visibility
    await updateOrderVisibility(orderId, sellerId, false);

    logger.info('Order unlocked successfully:', { orderId, sellerId });
    return true;
  } catch (err) {
    logger.error('Error unlocking order:', err);
    throw err;
  }
}

export async function shouldHideOrder(sellerId: string, orderId: string): Promise<boolean> {
  try {
    // Check if order is already unlocked
    const isHidden = await getOrderVisibility(orderId);
    if (!isHidden) {
      return false;
    }

    // Get total orders
    const orderCount = await getOrderCount(sellerId);

    // First 3 orders are free
    if (orderCount <= 3) {
      // Auto-unlock the order
      await updateOrderVisibility(orderId, sellerId, false);
      return false;
    }

    return true;
  } catch (err) {
    logger.error('Error checking order visibility:', err);
    return true;
  }
}

export * from './types';