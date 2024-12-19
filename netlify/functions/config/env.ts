import { z } from 'zod';
import { logger } from '../utils/logger';

// Schema for Netlify Functions environment variables
const envSchema = z.object({
  stripe: z.object({
    publishableKey: z.string().min(1, 'Stripe publishable key is required'),
    secretKey: z.string().min(1, 'Stripe secret key is required'),
    clientId: z.string().min(1, 'Stripe client ID is required'),
  }),
  supabase: z.object({
    url: z.string().url('Invalid Supabase URL'),
    anonKey: z.string().min(1, 'Supabase anon key is required'),
  }),
  app: z.object({
    url: z.string().min(1, 'App URL is required'),
  }),
});

// Environment variables for Netlify Functions
const env = {
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    clientId: process.env.STRIPE_CLIENT_ID,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },
  app: {
    url: process.env.APP_URL || 'http://localhost:5173',
  },
};

const result = envSchema.safeParse(env);

if (!result.success) {
  const errors = result.error.format();
  logger.error('❌ Invalid environment variables:', errors);
  throw new Error('Required environment variables are missing or invalid');
}

logger.info('✓ Environment variables validated successfully');
export const ENV = result.data;