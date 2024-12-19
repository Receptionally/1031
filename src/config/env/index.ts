import { defaultEnv } from './defaults';
import { envSchema } from './schema';
import { logger } from '../../services/utils/logger';

// Environment variables with fallbacks to defaults
const env = {
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || defaultEnv.stripe.publishableKey,
    clientId: import.meta.env.VITE_STRIPE_CLIENT_ID || defaultEnv.stripe.clientId,
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || defaultEnv.supabase.url,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || defaultEnv.supabase.anonKey,
  },
  app: {
    url: import.meta.env.VITE_APP_URL || defaultEnv.app.url,
  },
  google: {
    mapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || defaultEnv.google.mapsApiKey,
  },
  mixpanel: {
    token: import.meta.env.VITE_MIXPANEL_TOKEN || defaultEnv.mixpanel.token,
  },
  isDevelopment: import.meta.env.DEV,
};

const result = envSchema.safeParse(env);

if (!result.success) {
  const errors = result.error.format();
  logger.error('❌ Invalid environment variables:', errors);
  if (!import.meta.env.DEV) {
    throw new Error('Required environment variables are missing or invalid');
  } else {
    logger.warn('⚠️ Using default environment variables in development mode');
  }
}

logger.info('✓ Environment variables validated successfully');
export const ENV = result.data;