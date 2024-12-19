import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { logger } from '../services/utils/logger';
import type { SellerWithAccount } from '../types/seller';

export function useSellerProfile(sellerId: string | undefined) {
  const [seller, setSeller] = useState<SellerWithAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSeller() {
      if (!sellerId) {
        setError('Seller ID is required');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('sellers_with_stripe')
          .select('*')
          .eq('id', sellerId)
          .eq('status', 'approved')
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Seller not found');

        setSeller(data);
        logger.info('Fetched seller profile:', { sellerId });
      } catch (err) {
        logger.error('Error fetching seller:', err);
        setError(err instanceof Error ? err.message : 'Failed to load seller profile');
      } finally {
        setLoading(false);
      }
    }

    fetchSeller();
  }, [sellerId]);

  return { seller, loading, error };
}