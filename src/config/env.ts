import { z } from 'zod';
import { logger } from '../services/utils/logger';

// Schema for frontend environment variables
const envSchema = z.object({
  stripe: z.object({
    publishableKey: z.string().min(1, 'Stripe publishable key is required'),
    clientId: z.string().min(1, 'Stripe client ID is required'),
  }),
  supabase: z.object({
    url: z.string().url('Invalid Supabase URL'),
    anonKey: z.string().min(1, 'Supabase anon key is required'),
  }),
  app: z.object({
    url: z.string().min(1, 'App URL is required'),
  }),
  google: z.object({
    mapsApiKey: z.string().min(1, 'Google Maps API key is required'),
  }),
  mixpanel: z.object({
    token: z.string().min(1, 'Mixpanel token is required'),
  }),
  isDevelopment: z.boolean().default(false),
});

// Environment variables with default values for development
const env = {
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    clientId: import.meta.env.VITE_STRIPE_CLIENT_ID,
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  app: {
    url: import.meta.env.VITE_APP_URL || 'https://bejewelled-panda-63039f.netlify.app',
  },
  google: {
    mapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAmMx7LFgKxsxyrY5X2ODLy9vjPoWNbKrI',
  },
  mixpanel: {
    token: import.meta.env.VITE_MIXPANEL_TOKEN || 'mock-token',
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