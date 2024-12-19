import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { logger } from '../services/utils/logger';

interface StripeAccount {
  seller_id: string;
  business_name: string;
  email: string;
  phone: string;
  business_address: string;
  seller_status: string;
  profile_image: string | null;
  stripe_account_id: string | null;
  connected_at: string | null;
  total_orders: number;
  total_processed: number;
}

export function useAdminStripeAccounts() {
  const [accounts, setAccounts] = useState<StripeAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('admin_stripe_accounts_view')
          .select('*')
          .order('connected_at', { ascending: false, nullsLast: true });

        if (fetchError) throw fetchError;

        logger.info(`Fetched ${data.length} Stripe accounts`);
        setAccounts(data);
      } catch (err) {
        logger.error('Error fetching Stripe accounts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch Stripe accounts');
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  return { accounts, loading, error };
}