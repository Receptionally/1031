import React from 'react';
import { formatCurrency, formatDate } from '../../utils/format';
import type { Order } from '../../types/order';

interface OrderDetailsProps {
  order: Order;
  showSellerInfo?: boolean;
}

export function OrderDetails({ order, showSellerInfo = false }: OrderDetailsProps) {
  const sections = [
    {
      title: 'Customer Information',
      fields: [
        { label: 'Name', value: order.customer_name },
        { label: 'Email', value: order.customer_email },
      ]
    },
    {
      title: 'Order Details',
      fields: [
        { label: 'Product', value: order.product_name },
        { label: 'Quantity', value: order.quantity },
        { label: 'Total Amount', value: formatCurrency(order.total_amount) },
      ]
    },
    {
      title: 'Delivery Information',
      fields: [
        { label: 'Address', value: order.delivery_address },
        { label: 'Distance', value: `${order.delivery_distance.toFixed(1)} miles` },
        { label: 'Fee', value: formatCurrency(order.delivery_fee) },
      ]
    },
    order.stacking_included && {
      title: 'Stacking Service',
      fields: [
        { label: 'Fee', value: formatCurrency(order.stacking_fee) },
      ]
    },
    {
      title: 'Payment Information',
      fields: [
        { label: 'Status', value: order.stripe_payment_status },
        { label: 'Customer ID', value: order.stripe_customer_id || 'N/A' },
        { label: 'Payment Intent', value: order.stripe_payment_intent || 'N/A' },
        { label: 'Account ID', value: order.stripe_account_id },
      ]
    },
    {
      title: 'Timestamps',
      fields: [
        { label: 'Created', value: formatDate(order.created_at) },
        { label: 'Updated', value: formatDate(order.updated_at) },
      ]
    },
  ].filter(Boolean);

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, i) => section && (
          <div key={i} className="space-y-3">
            <h4 className="font-medium text-gray-900">{section.title}</h4>
            <dl className="space-y-2">
              {section.fields.map((field, j) => (
                <div key={j}>
                  <dt className="text-xs font-medium text-gray-500">{field.label}</dt>
                  <dd className="mt-1 text-sm text-gray-900 break-all">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}