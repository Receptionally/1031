import { supabase } from '../../../config/supabase';
import { logger } from '../../utils/logger';

export async function updateOrderVisibility(orderId: string, sellerId: string, isHidden: boolean) {
  const { error } = await supabase
    .from('orders')
    .update({ is_hidden: isHidden })
    .eq('id', orderId)
    .eq('seller_id', sellerId);

  if (error) throw error;
}

export async function getOrderCount(sellerId: string): Promise<number> {
  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact' })
    .eq('seller_id', sellerId);

  return count || 0;
}

export async function getOrderVisibility(orderId: string): Promise<boolean> {
  const { data } = await supabase
    .from('orders')
    .select('is_hidden')
    .eq('id', orderId)
    .single();

  return data?.is_hidden ?? true;
}