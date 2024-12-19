import React from 'react';
import { formatCurrency, formatDate } from '../../../utils/format';
import type { Order } from '../../../types/order';

interface OrderDetailsProps {
  order: Order;
  showSellerInfo?: boolean;
}

export function OrderDetails({ order, showSellerInfo = false }: OrderDetailsProps) {
  const fields = [
    showSellerInfo && {
      label: 'Seller',
      value: order.seller_name,
    },
    { label: 'Email', value: order.customer_email },
    { 
      label: 'Product',
      value: `${order.product_name} (x${order.quantity})`
    },
    {
      label: 'Total Amount',
      value: formatCurrency(order.total_amount)
    },
    { label: 'Delivery Address', value: order.delivery_address },
    {
      label: 'Delivery Distance',
      value: `${order.delivery_distance?.toFixed(1)} miles`
    },
    {
      label: 'Delivery Fee',
      value: formatCurrency(order.delivery_fee)
    },
    order.stacking_included && {
      label: 'Stacking Fee',
      value: formatCurrency(order.stacking_fee)
    },
    {
      label: 'Payment Status',
      value: order.stripe_payment_status
    },
    {
      label: 'Payment Intent',
      value: order.stripe_payment_intent
    },
    {
      label: 'Customer ID',
      value: order.stripe_customer_id
    },
    {
      label: 'Account ID',
      value: order.stripe_account_id
    },
    {
      label: 'Created',
      value: formatDate(order.created_at)
    },
    {
      label: 'Updated',
      value: formatDate(order.updated_at)
    }
  ].filter(Boolean);

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
        {fields.map((field, index) => field && (
          <div key={index}>
            <dt className="text-xs font-medium text-gray-500">{field.label}</dt>
            <dd className="mt-1 text-sm text-gray-900">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}