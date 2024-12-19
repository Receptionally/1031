import mixpanel from 'mixpanel-browser';
import { ENV } from '../../config/env';
import { logger } from '../utils/logger';

const mixpanelConfig = {
  debug: ENV.isDevelopment,
  track_pageview: true,
  persistence: 'localStorage',
  ignore_dnt: true,
  api_host: 'https://api-js.mixpanel.com',
  loaded: () => {
    logger.info('✓ Mixpanel loaded and ready');
  }
};

// Initialize Mixpanel with project token
mixpanel.init(ENV.mixpanel.token, mixpanelConfig);

// Ensure distinct_id is set
if (!mixpanel.get_distinct_id()) {
  mixpanel.reset();
}

export default mixpanel;