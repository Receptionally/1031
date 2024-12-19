import React, { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { OrderRow } from './OrderRow';
import { Package, Search } from 'lucide-react';

interface OrdersListProps {
  sellerId?: string; // Optional - if not provided, shows all orders (admin only)
}

export function OrdersList({ sellerId }: OrdersListProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { orders, loading, error } = useOrders(sellerId);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-600">No orders yet</p>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        />
      </div>

      {filteredOrders.map((order) => (
        <OrderRow
          key={order.id}
          order={order}
          isExpanded={expandedOrderId === order.id}
          onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
          showSellerInfo={!sellerId} // Only show seller info in admin view
        />
      ))}
    </div>
  );
}