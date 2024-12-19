import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { logger } from '../services/utils/logger';
import type { Seller } from '../types/seller';
import { updateSellerStatus as updateStatus } from '../services/sellers/updateSeller';

export function useSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSellers() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('admin_seller_view')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Log success
        logger.info('Successfully fetched sellers:', { count: data?.length });
        setSellers(data || []);

      } catch (err) {
        logger.error('Error fetching seller:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch seller data');
      } finally {
        setLoading(false);
      }
    }

    fetchSellers();
  }, []);

  const updateSellerStatus = async (sellerId: string, status: Seller['status']) => {
    try {
      await updateStatus(sellerId, status);
      setSellers(sellers.map(seller => 
        seller.id === sellerId ? { ...seller, status } : seller
      ));
    } catch (err) {
      logger.error('Error updating seller status:', err);
      throw new Error('Failed to update seller status');
    }
  };

  return {
    sellers,
    loading,
    error,
    updateSellerStatus,
  };
}