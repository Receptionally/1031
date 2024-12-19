import React from 'react';
import { Package } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Package className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
      <p className="mt-1 text-sm text-gray-500">
        {hasFilters 
          ? 'Try adjusting your search or filters.'
          : 'Orders will appear here once customers make purchases.'}
      </p>
    </div>
  );
}