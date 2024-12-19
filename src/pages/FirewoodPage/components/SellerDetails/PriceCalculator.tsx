import React from 'react';
import { Minus, Plus } from 'lucide-react';
import type { DeliveryCost } from '../../../../utils/delivery';

interface PriceCalculatorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  basePrice: number;
  deliveryCost: DeliveryCost | null;
}

export function PriceCalculator({ 
  quantity, 
  onQuantityChange, 
  basePrice, 
  deliveryCost 
}: PriceCalculatorProps) {
  const productTotal = basePrice * quantity;
  const deliveryTotal = deliveryCost?.totalFee || 0;
  const totalPrice = productTotal + deliveryTotal;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => quantity > 1 && onQuantityChange(quantity - 1)}
          className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100"
          type="button"
        >
          <Minus className="h-4 w-4 text-gray-600" />
        </button>
        <span className="text-lg font-medium text-gray-900">{quantity}</span>
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100"
          type="button"
        >
          <Plus className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <div className="text-right">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            Product Total: ${productTotal.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            Delivery: ${deliveryTotal.toFixed(2)}
          </p>
          <p className="text-xl font-bold text-gray-900">
            Total: ${totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}