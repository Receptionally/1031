import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { logger } from '../../../services/utils/logger';

interface PageviewStats {
  total_views: number;
  unique_visitors: number;
  last_view: string;
}

export function usePageviewStats(sellerId: string) {
  const [stats, setStats] = useState<PageviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('seller_pageview_stats')
          .select('*')
          .eq('seller_id', sellerId)
          .single();

        if (fetchError) throw fetchError;

        setStats(data);
        logger.info('Fetched pageview stats:', data);
      } catch (err) {
        logger.error('Error fetching pageview stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch pageview statistics');
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