import { z } from 'zod';
import { logger } from '../logger';

// Schema for Netlify Functions environment variables
export const envSchema = z.object({
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

export function validateEnv(env: Record<string, any>) {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.format();
    logger.error('❌ Invalid environment variables:', errors);
    
    // Log detailed validation errors
    Object.entries(errors).forEach(([key, value]) => {
      if (key !== '_errors') {
        logger.error(`${key}:`, value);
      }
    });

    return { success: false, error: 'Required environment variables are missing or invalid' };
  }

  logger.info('✓ Environment variables validated successfully');
  return { success: true, data: result.data };
}