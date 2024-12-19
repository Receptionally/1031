import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { logger } from '../services/utils/logger';

interface CityPage {
  id: string;
  city: string;
  state: string;
  slug: string;
  title: string;
  meta_description: string;
  content: string;
}

export function useCityPage(slug: string | undefined) {
  const [cityPage, setCityPage] = useState<CityPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCityPage() {
      try {
        if (!slug) {
          throw new Error('No slug provided');
        }

        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('city_pages')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('City page not found');

        logger.info('Fetched city page:', { slug });
        setCityPage(data);
      } catch (err) {
        logger.error('Error fetching city page:', err);
        setError(err instanceof Error ? err.message : 'Failed to load city page');
      } finally {
        setLoading(false);
      }
    }

    fetchCityPage();
  }, [slug]);

  return { cityPage, loading, error };
}