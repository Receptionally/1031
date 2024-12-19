import { calculateDistance } from '../distance';
import { getStateFromAddress } from '../address';
import { canTransportBetweenStates } from '../stateRules';
import { logger } from '../../services/utils/logger';
import type { MatchedSeller, SellerMatchCriteria } from './types';
import type { Seller } from '../../types/seller';

export async function findNearestSellers(
  customerAddress: string,
  sellers: Seller[],
  criteria?: SellerMatchCriteria
): Promise<MatchedSeller[]> {
  try {
    const customerState = await getStateFromAddress(customerAddress);
    if (!customerState) {
      logger.warn('Could not determine state from customer address:', customerAddress);
      return [];
    }

    logger.info('Finding sellers for customer in state:', customerState);

    const matchPromises = sellers.map(async (seller) => {
      try {
        // Check if seller can accept orders
        if (!seller.can_accept_orders) {
          logger.info(`Seller ${seller.id} cannot accept orders`);
          return null;
        }

        // Get seller's state and check transport rules
        const sellerState = await getStateFromAddress(seller.business_address);
        if (!sellerState) {
          logger.warn(`Could not determine state for seller ${seller.id}`);
          return null;
        }

        const transportRules = await canTransportBetweenStates(sellerState, customerState);
        if (!transportRules.allowed) {
          logger.info(`Transport not allowed from ${sellerState} to ${customerState}: ${transportRules.reason}`);
          return null;
        }

        // Calculate distance
        const distance = await calculateDistance(seller.business_address, customerAddress);
        if (distance > seller.max_delivery_distance) {
          logger.info(`Seller ${seller.id} is too far: ${distance} miles`);
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

    const results = await Promise.all(matchPromises);
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

export * from './types';