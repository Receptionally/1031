import React, { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Order } from '../../../types/order';
import { OrderDetails } from './OrderDetails';

interface OrderRowProps {
  order: Order;
}

const STATUS_ICONS = {
  pending: Clock,
  processing: Package,
  completed: CheckCircle,
  cancelled: XCircle,
};

const STATUS_COLORS = {
  pending: 'text-yellow-500',
  processing: 'text-blue-500',
  completed: 'text-green-500',
  cancelled: 'text-red-500',
};

export function OrderRow({ order }: OrderRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const StatusIcon = STATUS_ICONS[order.status];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div 
        className="px-6 py-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <StatusIcon className={`h-5 w-5 ${STATUS_COLORS[order.status]}`} />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {order.customer_name}
              </h3>
              <p className="text-sm text-gray-500">
                Order #{order.id.slice(0, 8)}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && <OrderDetails order={order} />}
    </div>
  );
}