import React from 'react';
import type { SellerWithAccount } from '../../types/seller';
import { UnitMeasurements } from './UnitMeasurements';
import { formatUnit } from '../../utils/units';
import { Wind } from 'lucide-react';

interface ProductDetailsProps {
  seller: SellerWithAccount;
}

export function ProductDetails({ seller }: ProductDetailsProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium text-gray-900 mb-2">Firewood Details</h3>
      <div className="space-y-3 text-sm">
        <p className="flex justify-between">
          <span className="text-gray-500 shrink-0">Unit Size:</span> 
          <span className="font-medium text-right">Full {formatUnit(seller.firewood_unit)}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500 shrink-0">Wood Type:</span>
          <span className="font-medium text-right">Split Mixed Hardwoods</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500 shrink-0">Log Length:</span>
          <span className="font-medium text-right">Approx. 16" standard cut</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500 shrink-0">Stacked Dimensions:</span>
          <span className="font-medium text-right">4H x 4H x 8L</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500 shrink-0">Price per {formatUnit(seller.firewood_unit, 1)}:</span>
          <span className="font-medium">${seller.price_per_unit.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}