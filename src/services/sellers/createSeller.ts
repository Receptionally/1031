import { supabase } from '../../config/supabase';
import { logger } from '../utils/logger';
import type { User } from '@supabase/supabase-js';

const DEFAULT_BIO = 'I enjoy delivering firewood to my customers. It\'s very hard work but it is also rewarding too as I get to be outside.';

export async function createSellerRecord(user: User) {
  try {
    const { data: newSeller, error: createError } = await supabase
      .from('sellers')
      .insert([{
        id: user.id,
        email: user.email,
        name: '',
        business_name: '',
        business_address: '',
        phone: '',
        bio: DEFAULT_BIO,
        firewood_unit: 'cords',
        payment_timing: 'delivery',
        provides_stacking: false,
        stacking_fee_per_unit: 0,
        max_stacking_distance: 20,
        status: 'pending'
      }])
      .select()
      .single();

    if (createError) throw createError;
    
    logger.info('Created new seller record:', { sellerId: newSeller.id });
    return newSeller;
  } catch (err) {
    logger.error('Error creating seller record:', err);
    throw err;
  }
}