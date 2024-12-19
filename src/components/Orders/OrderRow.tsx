import React, { useState } from 'react';
import { Package, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { OrderDetails } from './OrderDetails';
import { OrderActions } from './OrderActions';
import { UnlockButton } from './PayPerLead/UnlockButton';
import { OrderPreview } from './PayPerLead/OrderPreview';
import { shouldHideOrder, unlockOrder } from '../../services/orders/payPerLead';
import type { Order } from '../../types/order';

interface OrderRowProps {
  order: Order;
  showSellerInfo?: boolean;
}

export function OrderRow({ order, showSellerInfo = false }: OrderRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async () => {
    try {
      setLoading(true);
      setError(null);
      await unlockOrder(order.id, order.seller_id);
      setIsHidden(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock order');
    } finally {
      setLoading(false);
    }
  };

  // Check if order should be hidden
  React.useEffect(() => {
    shouldHideOrder(order.seller_id, order.id).then(setIsHidden);
  }, [order.id, order.seller_id]);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div 
        className="px-6 py-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isHidden ? (
              <Lock className="h-5 w-5 text-orange-500" />
            ) : (
              <Package className="h-5 w-5 text-green-500" />
            )}
            <div>
              {isHidden ? (
                <OrderPreview order={order} showSellerInfo={showSellerInfo} />
              ) : (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Order #{order.id.slice(0, 8)}</span>
                  {showSellerInfo && (
                    <>
                      <span>•</span>
                      <span>{order.seller_name}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {isHidden ? (
            <div className="px-6 py-4 bg-orange-50 border-t border-orange-100">
              <UnlockButton
                onUnlock={handleUnlock}
                loading={loading}
                error={error}
              />
            </div>
          ) : (
            <>
              <OrderDetails order={order} showSellerInfo={showSellerInfo} />
              <OrderActions order={order} />
            </>
          )}
        </>
      )}
    </div>
  );
}