import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { logger } from '../services/utils/logger';
import type { AppSettings } from '../types/settings';

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchSettings() {
    try {
      setLoading(true);
      setError(null);

      // Get the first settings record
      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();

      if (fetchError) {
        // If no settings exist, create default settings
        if (fetchError.code === 'PGRST116') {
          const { data: newData, error: insertError } = await supabase
            .from('settings')
            .insert([{ dev_mode: false }])
            .select()
            .single();

          if (insertError) throw insertError;
          setSettings(newData);
          return;
        }
        throw fetchError;
      }

      setSettings(data);
    } catch (err) {
      logger.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  async function updateDevMode(enabled: boolean) {
    try {
      if (!settings?.id) {
        throw new Error('No settings found');
      }

      logger.info('Updating dev mode:', { enabled });

      const { error } = await supabase
        .from('settings')
        .update({ dev_mode: enabled })
        .eq('id', settings.id);

      if (error) throw error;
      
      setSettings(prev => prev ? { ...prev, dev_mode: enabled } : null);
      
      logger.info('Dev mode updated successfully');
      return true;
    } catch (err) {
      logger.error('Error updating dev mode:', err);
      throw err;
    }
  }

  return {
    settings,
    loading,
    error,
    updateDevMode,
    refresh: fetchSettings
  };
}