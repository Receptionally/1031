import { useState } from 'react';
import { supabase } from '../config/supabase';
import { logger } from '../services/utils/logger';
import type { Order } from '../types/order';

export function useUpdateOrderStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (orderId: string, status: Order['status']) => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (updateError) throw updateError;

      logger.info(`Updated order ${orderId} status to ${status}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order status';
      logger.error('Error updating order:', err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
}