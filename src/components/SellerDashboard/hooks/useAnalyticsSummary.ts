import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { logger } from '../../../services/utils/logger';

interface AnalyticsSummary {
  total_views: number;
  views_last_7_days: number;
  total_appearances: number;
  appearances_last_7_days: number;
  total_orders: number;
  subscription_status: 'none' | 'active' | 'past_due' | 'canceled';
}

export function useAnalyticsSummary(sellerId: string) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('seller_analytics_summary')
          .select('*')
          .eq('seller_id', sellerId)
          .single();

        if (fetchError) {
          // Don't treat missing data as an error
          if (fetchError.code === 'PGRST116') {
            setSummary({
              total_views: 0,
              views_last_7_days: 0,
              total_appearances: 0,
              appearances_last_7_days: 0,
              total_orders: 0,
              subscription_status: 'none'
            });
            return;
          }
          throw fetchError;
        }

        setSummary(data);
        logger.info('Fetched analytics summary:', { sellerId });
      } catch (err) {
        logger.error('Error fetching analytics summary:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics summary');
      } finally {
        setLoading(false);
      }
    }

    if (sellerId) {
      fetchSummary();
    }
  }, [sellerId]);

  return { summary, loading, error };
}