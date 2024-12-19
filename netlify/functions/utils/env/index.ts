import { validateEnv } from './validation';
import { logger } from '../logger';

// Environment variables for Netlify Functions
const env = {
  stripe: {
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.VITE_STRIPE_SECRET_KEY,
    clientId: process.env.VITE_STRIPE_CLIENT_ID,
  },
  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY,
  },
  app: {
    url: process.env.VITE_APP_URL,
  },
};

const validation = validateEnv(env);

if (!validation.success) {
  logger.error('Environment validation failed:', validation.error);
  throw new Error('Required environment variables are missing or invalid');
}

export const ENV = validation.data;