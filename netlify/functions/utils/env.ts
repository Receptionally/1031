import { z } from 'zod';
import { logger } from './logger';

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

// Default values for development
const defaultEnv = {
  stripe: {
    publishableKey: 'pk_test_51QSRC3LR3tfiHjIkHrf943h8WoGn3gRnnkHGQFNEskzXeGXTVvkdwHyh3Aaq8MC8C5OjdcpLfvK1nsTC9TspWo4A00QL0lhaNW',
    secretKey: 'sk_test_51QSRC3LR3tfiHjIk0Qv3pw64UKSLFxLZpzC0WwkF1f69SSLa97p6LSMQNT4RSjJoOkcIPA7p0nf7YPdwyon5XHsA00jFac3BQ9',
    clientId: 'ca_RMEcR05tPZNIlUhLwcMWCn0Kt3jsuN2',
  },
  supabase: {
    url: 'https://aqfwytsugjnpmkdzvzvs.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnd5dHN1Z2pucG1rZHp2enZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MDY1NTcsImV4cCI6MjA0OTI4MjU1N30.TkpGIHNububITO18e6KE-tY4au7XkfrfN1y-DUZwsPM',
  },
  app: {
    url: 'https://bejewelled-panda-63039f.netlify.app',
  },
};

// Environment variables for Netlify Functions with fallbacks
const env = {
  stripe: {
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || defaultEnv.stripe.publishableKey,
    secretKey: process.env.VITE_STRIPE_SECRET_KEY || defaultEnv.stripe.secretKey,
    clientId: process.env.VITE_STRIPE_CLIENT_ID || defaultEnv.stripe.clientId,
  },
  supabase: {
    url: process.env.VITE_SUPABASE_URL || defaultEnv.supabase.url,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || defaultEnv.supabase.anonKey,
  },
  app: {
    url: process.env.VITE_APP_URL || defaultEnv.app.url,
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