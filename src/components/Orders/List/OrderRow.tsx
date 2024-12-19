import React, { useState } from 'react';
import { Clock, Package, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { OrderDetails } from '../Details';
import { OrderActions } from '../Actions';
import { formatCurrency } from '../../../utils/format';
import type { OrderRowProps } from '../types';

const STATUS_ICONS = {
  pending: Clock,
  processing: Package,
  completed: CheckCircle,
  cancelled: XCircle,
} as const;

const STATUS_COLORS = {
  pending: 'text-yellow-500',
  processing: 'text-blue-500',
  completed: 'text-green-500',
  cancelled: 'text-red-500',
} as const;

export function OrderRow({ order, showSellerInfo = false }: OrderRowProps) {
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
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {order.customer_name}
                </h3>
                <span className="text-sm text-gray-500">
                  ({formatCurrency(order.total_amount)})
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Order #{order.id.slice(0, 8)}</span>
                {showSellerInfo && order.seller_name && (
                  <>
                    <span>•</span>
                    <span>{order.seller_name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          <OrderDetails order={order} showSellerInfo={showSellerInfo} />
          <OrderActions order={order} />
        </>
      )}
    </div>
  );
}