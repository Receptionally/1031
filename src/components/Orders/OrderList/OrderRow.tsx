import React, { useState } from 'react';
import { OrderHeader } from './OrderHeader';
import { OrderDetails } from './OrderDetails';
import { OrderActions } from './OrderActions';
import type { Order } from '../../../types/order';

interface OrderRowProps {
  order: Order;
  showSellerInfo?: boolean;
}

export function OrderRow({ order, showSellerInfo = false }: OrderRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <OrderHeader 
        order={order}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        showSellerInfo={showSellerInfo}
      />

      {isExpanded && (
        <>
          <OrderDetails order={order} showSellerInfo={showSellerInfo} />
          <OrderActions order={order} />
        </>
      )}
    </div>
  );
}