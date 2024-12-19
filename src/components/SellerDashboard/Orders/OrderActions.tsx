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

  const handleStatusChange = async (status: Order['status']) => {
    await updateStatus(order.id, status);
  };

  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
            disabled={loading}
            className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        {order.stripe_customer_id && (
          <button
            onClick={() => setIsChargeModalOpen(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
          >
            Charge Customer
          </button>
        )}
      </div>

      <ChargeModal
        isOpen={isChargeModalOpen}
        onClose={() => setIsChargeModalOpen(false)}
        customerName={order.customer_name}
        onCharge={async (amount) => {
          // Implement charge logic
          console.log('Charging customer:', amount);
        }}
      />
    </div>
  );
}