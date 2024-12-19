import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { logger } from '../../../services/utils/logger';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface AddressSearch {
  id: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  search_type: 'manual' | 'autocomplete';
  created_at: string;
}

export function useRecentSearches(limit = 10) {
  const [searches, setSearches] = useState<AddressSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSearches = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('address_searches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;

      setSearches(data || []);
      logger.info('Fetched recent searches:', { count: data?.length });
    } catch (err) {
      logger.error('Error fetching recent searches:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recent searches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearches();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('recent_searches')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'address_searches'
      }, (payload: RealtimePostgresChangesPayload<AddressSearch>) => {
        logger.info('New search received:', payload);
        // Prepend new search and maintain limit
        setSearches(prev => [payload.new as AddressSearch, ...prev].slice(0, limit));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return { 
    searches, 
    loading, 
    error,
    refresh: fetchSearches 
  };
}