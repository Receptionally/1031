import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { logger } from '../services/utils/logger';
import { sleep } from '../utils/async';

interface StateRule {
  id: string;
  state_code: string;
  state_name: string;
  allows_import: boolean;
  allows_export: boolean;
  allowed_import_states: string[];
  allowed_export_states: string[];
  requires_certification: boolean;
  certification_details: string | null;
  additional_requirements: string | null;
  max_transport_miles: number | null;
  requires_certification_beyond_miles: boolean;
  certification_miles_threshold: number | null;
}

export function useStateRules() {
  const [rules, setRules] = useState<StateRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStates, setUpdatingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchRules();
  }, []);

  async function fetchRules() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('state_rules')
        .select('*')
        .order('state_name');

      if (fetchError) throw fetchError;

      logger.info(`Fetched ${data.length} state rules`);
      setRules(data);
    } catch (err) {
      logger.error('Error fetching state rules:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch state rules');
    } finally {
      setLoading(false);
    }
  }

  async function updateRule(stateCode: string, updates: Partial<StateRule>) {
    try {
      // Set updating state for this specific rule
      setUpdatingStates(prev => ({ ...prev, [stateCode]: true }));
      
      logger.info(`Updating rule for ${stateCode}:`, updates);
      
      const { error: updateError } = await supabase
        .from('state_rules')
        .update(updates)
        .eq('state_code', stateCode);

      if (updateError) throw updateError;

      // Add small delay to prevent UI flicker
      await sleep(300);

      // Update local state
      setRules(rules.map(rule => 
        rule.state_code === stateCode ? { ...rule, ...updates } : rule
      ));

      logger.info(`Successfully updated rule for ${stateCode}`);
    } catch (err) {
      logger.error(`Error updating rule for ${stateCode}:`, err);
      throw err;
      setUpdatingStates(prev => ({ ...prev, [stateCode]: false }));
    }
  }

  return {
    rules,
    loading,
    error,
    updateRule,
    updatingStates,
    refresh: fetchRules
  };
}