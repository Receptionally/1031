import React from 'react';
import type { MockSeller } from './types';
import { formatUnit } from '../../utils/units';

interface ProductDetailsProps {
  seller: MockSeller;
}

export function ProductDetails({ seller }: ProductDetailsProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium text-gray-900 mb-2">Product Details</h3>
      <div className="space-y-2 text-sm">
        <p className="flex justify-between">
          <span className="text-gray-500">Unit Size:</span>
          <span className="font-medium capitalize">{formatUnit(seller.firewood_unit)}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500">Price per {formatUnit(seller.firewood_unit, 1)}:</span>
          <span className="font-medium">${seller.price_per_unit.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}