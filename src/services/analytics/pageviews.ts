import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';
import mixpanel from './config';

interface PageviewData {
  sellerId: string;
  pagePath: string;
  referrer?: string;
}

export async function trackPageview(data: PageviewData) {
  try {
    // Get or generate visitor ID from Mixpanel
    const visitorId = mixpanel.get_distinct_id();

    // Track in Supabase
    const { error: insertError } = await supabase
    .from('pageviews')
    .insert([{
      seller_id: data.sellerId,
      visitor_id: visitorId,
      page_path: data.pagePath,
      referrer: data.referrer || document.referrer,
      user_agent: navigator.userAgent
      }]);

    if (insertError) throw insertError;
    logger.info('Pageview tracked:', data);

    // Track in Mixpanel
    mixpanel.track('Page View', {
      seller_id: data.sellerId,
      page_path: data.pagePath,
      referrer: data.referrer || document.referrer,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
    logger.info('Pageview tracked successfully');

  } catch (err) {
    logger.error('Failed to track pageview:', err);
    // Don't throw to prevent breaking the UI
  }
}