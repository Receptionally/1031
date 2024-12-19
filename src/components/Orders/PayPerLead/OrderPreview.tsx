import React from 'react';
import { formatCurrency } from '../../../utils/format';
import type { Order } from '../../../types/order';

interface OrderPreviewProps {
  order: Order;
  showSellerInfo?: boolean;
}

export function OrderPreview({ order, showSellerInfo }: OrderPreviewProps) {
  return (
    <div className="flex items-center space-x-2">
      <h3 className="text-lg font-medium text-gray-900">
        New Order
      </h3>
      <span className="text-sm text-gray-500">
        ({formatCurrency(order.total_amount)})
      </span>
      {showSellerInfo && order.seller_name && (
        <span className="text-sm text-gray-500">
          • {order.seller_name}
        </span>
      )}
    </div>
  );
}