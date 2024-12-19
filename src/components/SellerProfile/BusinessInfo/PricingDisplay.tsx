import React from 'react';
import { Package, DollarSign } from 'lucide-react';
import type { Seller } from '../../../types/seller';

interface PricingDisplayProps {
  seller: Seller;
}

export function PricingDisplay({ seller }: PricingDisplayProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Pricing</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start space-x-3">
          <Package className="h-5 w-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Product Details</p>
            <p className="text-sm text-gray-500">
              {seller.firewood_unit} at ${seller.price_per_unit}/unit
            </p>
          </div>
        </div>

        {seller.provides_stacking && (
          <div className="flex items-start space-x-3">
            <DollarSign className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900">Stacking Service</p>
              <ul className="text-sm text-gray-500">
                <li>${seller.stacking_fee_per_unit} per {seller.firewood_unit}</li>
                <li>Maximum {seller.max_stacking_distance} feet from truck to stacking location</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}