import React from 'react';
import { Wind, Minus, Plus } from 'lucide-react';
import { formatUnit } from '../utils/units';

interface PriceCalculatorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  basePrice: number;
  unit: string;
}

export function PriceCalculator({ 
  quantity, 
  onQuantityChange, 
  basePrice, 
  unit,
}: PriceCalculatorProps) {
  const productTotal = basePrice * quantity;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-4 w-full">
          <button
            onClick={() => quantity > 1 && onQuantityChange(quantity - 1)}
            className="p-2.5 rounded-full border border-gray-300 hover:bg-gray-100"
            type="button"
          >
            <Minus className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-lg font-medium text-gray-900 min-w-[100px] text-center">
            {quantity} {formatUnit(unit, quantity)}
          </span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="p-2.5 rounded-full border border-gray-300 hover:bg-gray-100"
            type="button"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="text-center space-y-1.5 w-full">
          <p className="text-sm text-gray-500">
            {quantity} {formatUnit(unit, quantity)}: ${productTotal.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex items-start border-t border-gray-200 pt-6">
        <Wind className="h-5 w-5 text-orange-500 flex-shrink-0 mr-3 mt-0.5" />
        <p className="text-gray-600 text-sm">
          Split mixed hardwoods properly seasoned (air dried) with low moisture content (15%-20%) for optimal burning. Perfect for most wood stoves and easy handling. All wood is cut to approximately 16" lengths.
        </p>
      </div>
    </div>
  );
}