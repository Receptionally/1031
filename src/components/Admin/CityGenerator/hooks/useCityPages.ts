import { useState } from 'react';
import { supabase } from '../../../../config/supabase';
import { logger } from '../../../../services/utils/logger';
import type { CityPage } from '../types';

export function useCityPages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePage = async (city: string, state: string) => {
    try {
      setLoading(true);
      setError(null);

      // Create URL-friendly slug
      const slug = `${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`;

      // Generate page content
      const title = `Premium Firewood Delivery in ${city}, ${state}`;
      const metaDescription = `Find local firewood sellers in ${city}, ${state}. Premium firewood delivered right to your door. Order online today!`;
      const content = generateCustomContent(city, state);

      // Insert new page
      const { error: insertError } = await supabase
        .from('city_pages')
        .insert([{
          city,
          state,
          slug,
          title,
          meta_description: metaDescription,
          content,
          custom_content: content,
          status: 'pending'
        }]);

      if (insertError) throw insertError;

      logger.info('Generated city page:', { city, state, slug });
    } catch (err) {
      logger.error('Error generating city page:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate city page');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approvePage = async (pageId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: approveError } = await supabase
        .rpc('approve_city_page', { page_id: pageId });

      if (approveError) throw approveError;

      logger.info('Approved city page:', { pageId });
    } catch (err) {
      logger.error('Error approving city page:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve city page');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (pageId: string, content: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .rpc('update_city_page_content', { 
          page_id: pageId,
          new_content: content
        });

      if (updateError) throw updateError;

      logger.info('Updated city page content:', { pageId });
    } catch (err) {
      logger.error('Error updating city page content:', err);
      setError(err instanceof Error ? err.message : 'Failed to update content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generatePage,
    approvePage,
    updateContent
  };
}

function generateCustomContent(city: string, state: string): string {
  return `About ${city} Firewood Delivery
Finding reliable firewood delivery in ${city}, ${state} has never been easier. Our local sellers provide premium, seasoned firewood delivered right to your door. Whether you need wood for your fireplace, wood stove, or outdoor fire pit, we connect you with trusted local suppliers who understand the specific needs of ${city} residents.

Our sellers offer various wood types common to the ${state} region, ensuring you get the best burning experience possible. With options for convenient delivery and professional stacking services, we make it simple to keep your home warm and cozy throughout the season.`;
}