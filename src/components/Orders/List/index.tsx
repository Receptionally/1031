import React, { useState } from 'react';
import { useOrders } from '../../../hooks/useOrders';
import { OrderRow } from './OrderRow';
import { OrderSearch } from '../Search';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

interface OrderListProps {
  sellerId?: string;
}

export function OrderList({ sellerId }: OrderListProps) {
  const [searchQuery, setSearchQuery] = useState('');
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

    return matchesSearch;
  });

  if (!filteredOrders || filteredOrders.length === 0) {
    return (
      <div>
        <div className="mb-6 space-y-4">
          <OrderSearch onSearch={setSearchQuery} />
        </div>
        <EmptyState hasFilters={searchQuery !== ''} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <OrderSearch onSearch={setSearchQuery} />
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