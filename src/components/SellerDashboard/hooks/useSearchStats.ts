import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { logger } from '../../../services/utils/logger';

interface SearchStats {
  total_appearances: number;
  unique_searches: number;
  avg_distance: number;
  last_appearance: string;
}

export function useSearchStats(sellerId: string) {
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('seller_search_stats')
          .select('*')
          .eq('seller_id', sellerId)
          .single();

        if (fetchError) throw fetchError;

        setStats(data);
        logger.info('Fetched search stats:', data);
      } catch (err) {
        logger.error('Error fetching search stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch search statistics');
      } finally {
        setLoading(false);
      }
    }

    if (sellerId) {
      fetchStats();
    }
  }, [sellerId]);

  return { stats, loading, error };
}