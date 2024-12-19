import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';
import { logger } from './logger';

if (!ENV.supabase.url || !ENV.supabase.anonKey) {
  logger.error('Missing Supabase configuration');
  throw new Error('Missing Supabase configuration');
}

// Initialize Supabase client with proper configuration
export const supabase = createClient(ENV.supabase.url, ENV.supabase.anonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'apikey': ENV.supabase.anonKey,
      'Authorization': `Bearer ${ENV.supabase.anonKey}`
    }
  }
});