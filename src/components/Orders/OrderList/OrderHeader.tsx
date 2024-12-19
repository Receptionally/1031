import React from 'react';
import { Clock, Package, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Order } from '../../../types/order';

interface OrderHeaderProps {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  showSellerInfo?: boolean;
}

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

export function OrderHeader({ order, isExpanded, onToggle, showSellerInfo }: OrderHeaderProps) {
  const StatusIcon = STATUS_ICONS[order.status];

  return (
    <div 
      className="px-6 py-4 cursor-pointer hover:bg-gray-50"
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <StatusIcon className={`h-5 w-5 ${STATUS_COLORS[order.status]}`} />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {order.customer_name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Order #{order.id.slice(0, 8)}</span>
              {showSellerInfo && (
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
  );
}