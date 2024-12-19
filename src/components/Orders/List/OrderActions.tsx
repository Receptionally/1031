import React, { useState } from 'react';
import { useUpdateOrder } from '../../../hooks/useUpdateOrder';
import { ChargeModal } from '../../ChargeModal';
import type { Order } from '../../../types/order';

interface OrderActionsProps {
  order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
  const { updateStatus, loading, error } = useUpdateOrder();

  const handleComplete = async () => {
    await updateStatus(order.id, 'completed');
  };

  return (
    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleComplete()}
            disabled={loading || order.status === 'completed'}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm font-medium rounded-md bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {order.status === 'completed' ? 'Completed' : 'Mark as Complete'}
          </button>
        </div>

        {order.stripe_customer_id && (
          <button
            onClick={() => setIsChargeModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Charge Customer
          </button>
        )}
      </div>

      <ChargeModal
        isOpen={isChargeModalOpen}
        onClose={() => setIsChargeModalOpen(false)}
        order={order}
      />
    </div>
  );
}