import { type Seller } from '../types/seller';
import { calculateDistance } from './distance';
import { getStateFromAddress } from './address';
import { canTransportBetweenStates } from './stateRules';
import { logger } from '../services/utils/logger';

export interface MatchedSeller {
  seller: Seller;
  distance: number;
  transportRequirements?: string[];
}

export async function findNearestSellers(
  customerAddress: string,
  sellers: Seller[]
): Promise<MatchedSeller[]> {
  try {
    // Get customer's state first
    const customerState = await getStateFromAddress(customerAddress);
    if (!customerState) {
      logger.warn('Could not determine state from customer address:', customerAddress);
      return [];
    }

    logger.info('Finding sellers for customer in state:', customerState);

    // Process all sellers in parallel
    const matchPromises = sellers.map(async (seller) => {
      try {
        // Get seller's state first - cheapest operation
        const sellerState = await getStateFromAddress(seller.business_address);
        if (!sellerState) {
          logger.warn(`Could not determine state for seller ${seller.id}`);
          return null;
        }

        // Check state rules before calculating distance
        const transportRules = await canTransportBetweenStates(sellerState, customerState);
        if (!transportRules.allowed) {
          logger.info(`Transport not allowed from ${sellerState} to ${customerState}: ${transportRules.reason}`);
          return null;
        }

        // Calculate distance
        const distance = await calculateDistance(seller.business_address, customerAddress);
        
        // Check if within delivery range
        if (distance > seller.max_delivery_distance) {
          logger.info(`Seller ${seller.id} is too far: ${distance} miles`);
          return null;
        }
        // Check if seller can accept orders
        const canAcceptOrders = seller.subscription_status === 'active' || seller.total_orders < 3;
        if (!canAcceptOrders) {
          logger.info(`Seller ${seller.id} cannot accept orders due to subscription status`);
          return null;
        }

        return {
          seller,
          distance,
          transportRequirements: transportRules.requirements
        };
      } catch (err) {
        logger.error(`Error processing seller ${seller.id}:`, err);
        return null;
      }
    });

    // Wait for all seller checks to complete
    const results = await Promise.all(matchPromises);

    // Filter out null results and sort by distance
    const matchedSellers = results
      .filter((result): result is MatchedSeller => result !== null)
      .sort((a, b) => a.distance - b.distance);

    logger.info(`Found ${matchedSellers.length} matching sellers for ${customerState}`);
    return matchedSellers;
  } catch (error) {
    logger.error('Error finding nearest sellers:', error);
    throw error;
  }
}