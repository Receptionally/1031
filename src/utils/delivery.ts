import type { Seller } from '../types/seller';
import { logger } from '../services/utils/logger';

export interface DeliveryCost {
  baseFee: number;
  mileageFee: number;
  totalFee: number;
  distance: number;
  price_per_mile: number;
}

export function calculateDeliveryCost(
  seller: Seller,
  distance: number
): DeliveryCost | null {
  try {
    // Return null if distance exceeds max delivery range
    if (distance > seller.max_delivery_distance) {
      logger.info('Distance exceeds max delivery range:', {
        distance,
        maxDistance: seller.max_delivery_distance
      });
      return null;
    }

    const mileageFee = seller.price_per_mile * distance;
    // Use seller's minimum delivery fee if mileage fee is lower
    const baseFee = seller.min_delivery_fee;
    const totalFee = Math.max(baseFee, mileageFee);

    logger.info('Calculated delivery cost:', {
      baseFee,
      mileageFee,
      totalFee,
      distance
    });

    return {
      baseFee,
      mileageFee,
      totalFee,
      distance,
      price_per_mile: seller.price_per_mile
    };
  } catch (err) {
    logger.error('Error calculating delivery cost:', err);
    throw err;
  }
}