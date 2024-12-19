import { supabase } from '../config/supabase';
import { logger } from '../services/utils/logger';

export async function isDevModeEnabled(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('dev_mode')
      .single();

    if (error) {
      logger.error('Error checking dev mode:', error);
      return false;
    }

    const enabled = data?.dev_mode || false;
    logger.info('Dev mode status:', enabled);
    return enabled;
  } catch (err) {
    logger.error('Error checking dev mode:', err);
    return false;
  }
}