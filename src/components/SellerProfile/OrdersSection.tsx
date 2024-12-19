import React from 'react';
import { Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { type Order } from '../../types/order';
import { ChargeModal } from '../ChargeModal';
import { chargeCustomer } from '../../services/stripe';

interface OrdersSectionProps {
  sellerId: string;
  stripeAccountId?: string;
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

export function OrdersSection({ sellerId, stripeAccountId }: OrdersSectionProps) {
  const { orders, loading, error } = useOrders(sellerId);
  const [expandedOrderId, setExpandedOrderId] = React.useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isChargeModalOpen, setIsChargeModalOpen] = React.useState(false);
  const [chargeError, setChargeError] = React.useState<string | null>(null);

  const handleCharge = async (amount: number) => {
    if (!selectedOrder || !selectedOrder.stripe_customer_id || !stripeAccountId) {
      throw new Error('Cannot process charge without Stripe setup');
    }

    setChargeError(null);
    try {
      await chargeCustomer({
        stripeAccountId,
        customerId: selectedOrder.stripe_customer_id,
        amount,
        description: `Additional charge for order ${selectedOrder.id}`,
      });
      
      setIsChargeModalOpen(false);
      setSelectedOrder(null);
      alert('Payment processed successfully!');
    } catch (err) {
      setChargeError(err instanceof Error ? err.message : 'Failed to process payment');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
        <div className="text-center py-6">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">No orders yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
      
      <div className="space-y-4">
        {orders.map((order) => {
          const StatusIcon = STATUS_ICONS[order.status];
          const isExpanded = expandedOrderId === order.id;

          return (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="px-4 py-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`h-5 w-5 ${STATUS_COLORS[order.status]}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-gray-500">
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

              {isExpanded && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{order.customer_email}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Product</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {order.product_name} (x{order.quantity})
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Amount</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ${order.total_amount.toFixed(2)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(order.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>

                  {stripeAccountId && order.stripe_customer_id && (
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsChargeModalOpen(true);
                          setChargeError(null);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Charge Customer
                      </button>
                    </div>
                  )}

                  {chargeError && selectedOrder?.id === order.id && (
                    <div className="mt-3 text-sm text-red-600">
                      {chargeError}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedOrder && stripeAccountId && (
        <ChargeModal
          isOpen={isChargeModalOpen}
          onClose={() => {
            setIsChargeModalOpen(false);
            setSelectedOrder(null);
            setChargeError(null);
          }}
          onCharge={handleCharge}
          customerName={selectedOrder.customer_name}
        />
      )}
    </div>
  );
}