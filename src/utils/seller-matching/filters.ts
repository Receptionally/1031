import type { Seller } from '../../types/seller';
import { logger } from '../../services/utils/logger';

export function canAcceptOrders(seller: Seller): boolean {
  const hasSubscription = seller.subscription_status === 'active';
  const withinFreeOrders = seller.total_orders < 3;
  
  if (!hasSubscription && !withinFreeOrders) {
    logger.info(`Seller ${seller.id} cannot accept orders: requires subscription`);
    return false;
  }
  
  return true;
}

export function isWithinDistance(seller: Seller, distance: number): boolean {
  if (distance > seller.max_delivery_distance) {
    logger.info(`Seller ${seller.id} is too far: ${distance} miles`);
    return false;
  }
  return true;
}