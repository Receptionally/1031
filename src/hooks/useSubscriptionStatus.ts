import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { logger } from '../services/utils/logger';
import type { SubscriptionStatus } from '../types/seller';

export function useSubscriptionStatus(sellerId: string) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('seller_subscription_status')
          .select('*')
          .eq('seller_id', sellerId)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setStatus({
            total_orders: 0,
            subscription_status: 'none',
            subscription_start_date: null,
            subscription_end_date: null,
            setup_intent_status: null,
            setup_intent_id: null,
            debt_amount: 0,
            last_failed_charge: null,
            failed_charge_amount: null,
            requires_subscription: false,
            can_accept_orders: true,
            orders_until_subscription: 3
          });
          return;
        }

        setStatus(data);
        logger.info('Fetched subscription status:', { 
          sellerId,
          totalOrders: data.total_orders,
          status: data.subscription_status,
          requiresSubscription: data.requires_subscription
        });
      } catch (err) {
        logger.error('Error fetching subscription status:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription status');
      } finally {
        setLoading(false);
      }
    }

    if (sellerId) {
      fetchStatus();
    }
  }, [sellerId]);

  return { status, loading, error };
}