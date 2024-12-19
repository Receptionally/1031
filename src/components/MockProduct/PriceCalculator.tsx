import React from 'react';
import { formatUnit } from '../../utils/units';

interface PriceCalculatorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  basePrice: number;
  stackingFee: number;
  kilnDriedFee: number;
  deliveryCost: DeliveryCost | null;
}

export function PriceCalculator({ 
  quantity, 
  onQuantityChange, 
  basePrice, 
  stackingFee,
  kilnDriedFee,
  deliveryCost 
}: PriceCalculatorProps) {
  const productTotal = basePrice * quantity;
  const stackingTotal = stackingFee * quantity;
  const kilnDriedTotal = kilnDriedFee * quantity;
  const deliveryTotal = deliveryCost?.totalFee || 0;
  const totalPrice = productTotal + stackingTotal + kilnDriedTotal + deliveryTotal;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center">
            <button
              onClick={() => quantity > 1 && onQuantityChange(quantity - 1)}
              className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100"
              type="button"
            >
              <span className="text-gray-600 font-medium text-lg leading-none">−</span>
            </button>
            <span className="mx-3 text-lg font-medium text-gray-900">{quantity} {formatUnit(unit, quantity)}</span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100"
              type="button"
            >
              <span className="text-gray-600 font-medium text-lg leading-none">+</span>
            </button>
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-gray-500">
            Product Total: ${productTotal.toFixed(2)}
          </p>
          {kilnDriedFee > 0 && (
            <p className="text-sm text-gray-500">
              Kiln Dried: ${kilnDriedTotal.toFixed(2)}
            </p>
          )}
          {stackingFee > 0 && (
            <p className="text-sm text-gray-500">
              Stacking: ${stackingTotal.toFixed(2)}
            </p>
          )}
          <p className="text-xl font-bold text-gray-900">
            Total: ${totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}