import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';
import type { User } from '@supabase/supabase-js';

export async function fetchSeller(user: User) {
  try {
    const { data, error } = await supabase
      .from('sellers')
      .select(`
        *,
        connected_accounts (
          stripe_account_id,
          access_token,
          connected_at
        )
      `)
      .eq('id', user.id)
      .single();

    if (error) {
      // If no seller record exists, create one
      if (error.code === 'PGRST116') {
        const { data: newSeller, error: createError } = await supabase
          .from('sellers')
          .insert([{
            id: user.id,
            email: user.email,
            name: '',
            business_name: '',
            business_address: '',
            phone: '',
            bio: 'I enjoy delivering firewood to my customers. It\'s very hard work but it is also rewarding too as I get to be outside.',
            firewood_unit: 'cords',
            payment_timing: 'delivery',
            provides_stacking: false,
            stacking_fee_per_unit: 0,
            provides_kiln_dried: false,
            kiln_dried_fee_per_unit: 0,
            max_stacking_distance: 20,
            status: 'pending'
          }])
          .select(`
            *,
            connected_accounts (
              stripe_account_id,
              access_token,
              connected_at
            )
          `)
          .single();

        if (createError) throw createError;
        return newSeller;
      }
      throw error;
    }

    return data;
  } catch (err) {
    logger.error('Error fetching seller:', err);
    throw err;
  }
}