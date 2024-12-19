import React, { useState } from 'react';
import { useOrders } from '../../../hooks/useOrders';
import { OrderRow } from './OrderRow';
import { OrderSearch } from './OrderSearch';
import { OrderFilters } from './OrderFilters';
import { Package } from 'lucide-react';

interface OrderListProps {
  sellerId: string;
}

export function OrderList({ sellerId }: OrderListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!filteredOrders || filteredOrders.length === 0) {
    return (
      <div>
        <div className="mb-6 space-y-4">
          <OrderSearch onSearch={setSearchQuery} />
          <OrderFilters currentFilter={statusFilter} onFilterChange={setStatusFilter} />
        </div>
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters.'
              : 'Orders will appear here once customers make purchases.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <OrderSearch onSearch={setSearchQuery} />
        <OrderFilters currentFilter={statusFilter} onFilterChange={setStatusFilter} />
      </div>
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}