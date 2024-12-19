import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';
import mixpanel from './config';

interface SearchData {
  address: string;
  latitude?: number;
  longitude?: number;
  search_type: 'manual' | 'autocomplete';
}

export async function trackAddressSearch(data: SearchData) {
  try {
    // Track in Supabase
    const { error: searchError } = await supabase
      .from('address_searches')
      .insert([{
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        search_type: data.search_type,
        user_agent: navigator.userAgent
      }]);

    if (searchError) throw searchError;

    // Track in Mixpanel
    mixpanel.track('Address Search', {
      address: data.address,
      has_coordinates: !!(data.latitude && data.longitude),
      latitude: data.latitude,
      longitude: data.longitude,
      search_type: data.search_type,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer || 'direct'
    });
    logger.info('Address search tracked successfully');

    logger.info('Address search tracked:', {
      address: data.address,
      type: data.search_type
    });

  } catch (err) {
    logger.error('Failed to track address search:', err);
    // Don't throw to prevent breaking the UI
  }
}