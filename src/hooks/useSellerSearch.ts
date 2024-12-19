import { useState, useEffect } from 'react';
import { findNearestSeller } from '../services/sellers.service';
import { calculateDistance } from '../utils/distance';
import { calculateDeliveryCost } from '../utils/delivery';
import type { SellerWithAccount } from '../types/seller';
import type { DeliveryCost } from '../utils/delivery';
import { logger } from '../services/utils/logger';

interface UseSellerSearchResult {
  seller: SellerWithAccount | null;
  deliveryCost: DeliveryCost | null;
  loading: boolean;
  error: string | null;
}

export function useSellerSearch(deliveryAddress: string | null): UseSellerSearchResult {
  const [seller, setSeller] = useState<SellerWithAccount | null>(null);
  const [deliveryCost, setDeliveryCost] = useState<DeliveryCost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function findSeller() {
      try {
        setLoading(true);
        setError(null);

        if (!deliveryAddress) {
          setError('Please provide a delivery address');
          setLoading(false);
          return;
        }

        // Find nearest seller based on delivery address
        logger.info('Finding nearest seller for address:', deliveryAddress);
        const nearestSeller = await findNearestSeller(deliveryAddress);
        
        if (!nearestSeller) {
          logger.warn('No sellers available for address:', deliveryAddress);
          setError('No sellers currently available in your area. Please try again later.');
          setLoading(false);
          return;
        }

        logger.info('Found seller:', {
          id: nearestSeller.id,
          businessName: nearestSeller.business_name,
          hasStripeAccount: nearestSeller.has_stripe_account
        });
        setSeller(nearestSeller);

        // Calculate delivery cost using seller's address as origin
        const distance = await calculateDistance(
          nearestSeller.business_address,
          deliveryAddress
        );
        
        const cost = calculateDeliveryCost(nearestSeller, distance);
        setDeliveryCost(cost);
      } catch (err) {
        logger.error('Error finding seller:', err);
        setError('Failed to find sellers in your area');
      } finally {
        setLoading(false);
      }
    }

    findSeller();
  }, [deliveryAddress]);

  return { seller, deliveryCost, loading, error };
}