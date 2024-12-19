import { logger } from '../utils/logger';
import type { OrderData } from './types';

const ORDER_DATA_KEY = 'woodheat_order_data';

export function storeOrderData(orderData: OrderData): void {
  try {
    const data = JSON.stringify(orderData);
    sessionStorage.setItem(ORDER_DATA_KEY, data);
    logger.info('Order data stored successfully:', { orderId: orderData.stripePaymentIntent });
  } catch (err) {
    logger.error('Failed to store order data:', err);
    throw new Error('Failed to store order data');
  }
}

export function getStoredOrderData(): OrderData | null {
  try {
    const data = sessionStorage.getItem(ORDER_DATA_KEY);
    if (!data) {
      logger.warn('No order data found in session storage');
      return null;
    }
    return JSON.parse(data);
  } catch (err) {
    logger.error('Failed to retrieve order data:', err);
    return null;
  }
}

export function clearOrderData(): void {
  try {
    sessionStorage.removeItem(ORDER_DATA_KEY);
    logger.info('Order data cleared successfully');
  } catch (err) {
    logger.error('Failed to clear order data:', err);
  }
}