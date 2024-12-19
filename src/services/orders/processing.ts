import { logger } from '../utils/logger';
import { OrderError, ORDER_ERRORS } from './errors';
import { validateOrderData } from './validation';
import { verifyDatabaseConnection, insertOrder } from './db';
import type { OrderData } from './types';

export async function processOrder(orderData: OrderData) {
  try {
    // Validate order data
    const validation = validateOrderData(orderData);
    if (!validation.success) {
      throw new OrderError(validation.error || ORDER_ERRORS.VALIDATION);
    }

    // Verify database connection
    await verifyDatabaseConnection();

    // Create order in database
    const order = await insertOrder(orderData);

    logger.info('Order processed successfully:', { 
      orderId: order.id,
      sellerId: orderData.sellerId 
    });

    return order;
  } catch (err) {
    logger.error('Order processing error:', err);
    throw err instanceof OrderError ? err : new OrderError(ORDER_ERRORS.CREATE);
  }
}