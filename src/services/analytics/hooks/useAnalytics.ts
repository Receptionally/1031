import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../events';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    const pageName = location.pathname.replace(/^\//, '') || 'home';
    trackPageView(pageName, {
      url: location.pathname,
      search: location.search,
      hash: location.hash
    });
  }, [location]);
}