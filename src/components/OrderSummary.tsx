import React from 'react';
import { formatUnit } from '../utils/units';

interface OrderSummaryProps {
  quantity: number;
  basePrice: number;
  unit: string;
  stackingFee?: number;
  kilnDriedFee?: number;
  deliveryFee?: number;
  includeStacking?: boolean;
  includeKilnDried?: boolean;
}

export function OrderSummary({
  quantity,
  basePrice,
  unit,
  stackingFee = 0,
  kilnDriedFee = 0,
  deliveryFee = 0,
  includeStacking = false,
  includeKilnDried = false,
}: OrderSummaryProps) {
  const productTotal = basePrice * quantity;
  const stackingTotal = includeStacking ? stackingFee * quantity : 0;
  const kilnDriedTotal = includeKilnDried ? kilnDriedFee * quantity : 0;
  const totalPrice = productTotal + stackingTotal + kilnDriedTotal + deliveryFee;

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium text-gray-900 mb-4">Order Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            {quantity} {formatUnit(unit, quantity)}:
          </span>
          <span className="font-medium">${productTotal.toFixed(2)}</span>
        </div>
        
        {includeKilnDried && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Kiln Dried:</span>
            <span className="font-medium">${kilnDriedTotal.toFixed(2)}</span>
          </div>
        )}
        
        {includeStacking && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Stacking Service:</span>
            <span className="font-medium">${stackingTotal.toFixed(2)}</span>
          </div>
        )}

        <div className="pt-2 mt-2 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">Total:</span>
            <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 mt-3">
            <p className="text-blue-700 font-medium text-sm text-center">
              Delivery included in price
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}