import mixpanel from './config';
import { ENV } from '../../config/env';
import { logger } from '../utils/logger';
import { supabase } from '../../config/supabase';

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  try {
    // Add common properties to all events
    const enrichedProperties = {
      ...properties,
      environment: ENV.isDevelopment ? 'development' : 'production',
      timestamp: new Date().toISOString(),
      client_type: 'web',
      url: window.location.href,
      pathname: window.location.pathname,
      referrer: document.referrer || 'direct',
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      user_agent: navigator.userAgent,
      distinct_id: mixpanel.get_distinct_id()
    };

    mixpanel.track(event, enrichedProperties);
    logger.info(`✓ Tracked event: ${event}`, enrichedProperties);

    // Also track in Supabase if it's a pageview event
    if (event === 'Page View' && properties?.seller_id) {
      trackSellerPageview(properties.seller_id);
    }
  } catch (err) {
    logger.error(`Failed to track event: ${event}`, err);
  }
};

async function trackSellerPageview(sellerId: string) {
  try {
    const { error } = await supabase.rpc('track_seller_pageview', {
      p_seller_id: sellerId,
      p_visitor_id: mixpanel.get_distinct_id(),
      p_page_path: window.location.pathname,
      p_referrer: document.referrer,
      p_user_agent: navigator.userAgent
    });

    if (error) throw error;
  } catch (err) {
    logger.error('Failed to track seller pageview:', err);
  }
}

export const trackPageView = (pageName: string, properties?: Record<string, any>) => {
  trackEvent('Page View', {
    page: pageName,
    title: document.title,
    ...properties
  });
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  try {
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set({
        ...traits,
        $last_seen: new Date().toISOString(),
        $browser: navigator.userAgent,
        $browser_version: navigator.appVersion,
        $os: navigator.platform
      });
    }
    logger.info('✓ Identified user:', { userId });
  } catch (err) {
    logger.error('Failed to identify user:', err);
  }
};

export const resetUser = () => {
  try {
    mixpanel.reset();
    logger.info('✓ Reset user identification');
  } catch (err) {
    logger.error('Failed to reset user:', err);
  }
};