import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { logger } from '../../../services/utils/logger';

interface Charge {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export function useChargeHistory(sellerId: string) {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCharges() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('payment_intents')
          .select('*')
          .eq('seller_id', sellerId)
          .eq('type', 'subscription_charge')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        logger.info('Fetched charge history:', { count: data?.length });
        setCharges(data || []);
      } catch (err) {
        logger.error('Error fetching charge history:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch charge history');
      } finally {
        setLoading(false);
      }
    }

    if (sellerId) {
      fetchCharges();
    }
  }, [sellerId]);

  return { charges, loading, error };
}