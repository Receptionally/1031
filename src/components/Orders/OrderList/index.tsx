import React, { useState } from 'react';
import { useOrders } from '../../../hooks/useOrders';
import { OrderRow } from './OrderRow';
import { OrderSearch } from './OrderSearch';
import { OrderFilters } from './OrderFilters';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

interface OrderListProps {
  sellerId?: string;
}

export function OrderList({ sellerId }: OrderListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { orders, loading, error } = useOrders(sellerId);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
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
        <EmptyState hasFilters={searchQuery !== '' || statusFilter !== 'all'} />
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
          <OrderRow 
            key={order.id} 
            order={order} 
            showSellerInfo={!sellerId}
          />
        ))}
      </div>
    </div>
  );
}