import React from 'react';
import { DollarSign, Calendar } from 'lucide-react';
import { useChargeHistory } from '../hooks/useChargeHistory';
import { formatCurrency, formatDate } from '../../../utils/format';

interface ChargeHistoryProps {
  sellerId: string;
}

export function ChargeHistory({ sellerId }: ChargeHistoryProps) {
  const { charges, loading, error } = useChargeHistory(sellerId);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!charges || charges.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Charges Yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Charges will appear here after your first 3 orders
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Subscription Charges</h2>
        <DollarSign className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {charges.map((charge) => (
          <div 
            key={charge.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Order #{charge.order_id.slice(0, 8)}
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(charge.created_at)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(charge.amount / 100)}
              </p>
              <p className="text-xs text-gray-500">
                {charge.status === 'succeeded' ? 'Paid' : 'Failed'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}