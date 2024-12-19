import { z } from 'zod';

export const stripeSchema = z.object({
  publishableKey: z.string().min(1, 'Stripe publishable key is required'),
  clientId: z.string().min(1, 'Stripe client ID is required'),
});

export const supabaseSchema = z.object({
  url: z.string().url('Invalid Supabase URL'),
  anonKey: z.string().min(1, 'Supabase anon key is required'),
});

export const appSchema = z.object({
  url: z.string().min(1, 'App URL is required'),
});

export const googleSchema = z.object({
  mapsApiKey: z.string().min(1, 'Google Maps API key is required'),
});

export const envSchema = z.object({
  stripe: stripeSchema,
  supabase: supabaseSchema,
  app: appSchema,
  google: googleSchema,
  isDevelopment: z.boolean().default(false),
});