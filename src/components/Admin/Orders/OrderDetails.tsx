import React from 'react';
import type { Order } from '../../../types/order';

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
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
          <dt className="text-xs font-medium text-gray-500">Total Amount</dt>
          <dd className="mt-1 text-sm text-gray-900">
            ${order.total_amount.toFixed(2)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gray-500">Delivery Address</dt>
          <dd className="mt-1 text-sm text-gray-900">{order.delivery_address}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gray-500">Delivery Distance</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {order.delivery_distance?.toFixed(1)} miles
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gray-500">Delivery Fee</dt>
          <dd className="mt-1 text-sm text-gray-900">
            ${order.delivery_fee.toFixed(2)}
          </dd>
        </div>
        {order.stacking_included && (
          <div>
            <dt className="text-xs font-medium text-gray-500">Stacking Fee</dt>
            <dd className="mt-1 text-sm text-gray-900">
              ${order.stacking_fee.toFixed(2)}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-medium text-gray-500">Payment Status</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {order.stripe_payment_status}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gray-500">Created</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {new Date(order.created_at).toLocaleString()}
          </dd>
        </div>
      </dl>
    </div>
  );
}