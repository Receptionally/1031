import React from 'react';
import { Clock, Package, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { OrderDetails } from './OrderDetails';
import { ChargeModal } from '../ChargeModal';
import { useUpdateOrderStatus } from '../../hooks/useUpdateOrderStatus';
import type { Order } from '../../types/order';

interface OrderRowProps {
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

export function OrderRow({ order, isExpanded, onToggle, showSellerInfo }: OrderRowProps) {
  const [isChargeModalOpen, setIsChargeModalOpen] = React.useState(false);
  const { updateStatus, loading, error } = useUpdateOrderStatus();
  const StatusIcon = STATUS_ICONS[order.status];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
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

      {isExpanded && (
        <>
          <OrderDetails order={order} showSellerInfo={showSellerInfo} />
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
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
          </div>

          {isChargeModalOpen && (
            <ChargeModal
              isOpen={isChargeModalOpen}
              onClose={() => setIsChargeModalOpen(false)}
              customerName={order.customer_name}
              onCharge={async (amount) => {
                // Implement charge logic
                console.log('Charging customer:', amount);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}