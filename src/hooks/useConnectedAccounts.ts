import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { logger } from '../services/utils/logger';
import type { ConnectedAccount } from '../types/stripe';

export function useConnectedAccounts() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoading(true);
        setError(null);
        
        logger.info('Fetching connected accounts');
        const { data, error: fetchError } = await supabase
          .from('connected_accounts_view')
          .select('*')
          .order('connected_at', { ascending: false });

        if (fetchError) throw fetchError;

        logger.info(`Found ${data?.length || 0} connected accounts`);
        setAccounts(data || []);
      } catch (err) {
        logger.error('Error fetching connected accounts:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch accounts'));
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  return { accounts, loading, error };
}