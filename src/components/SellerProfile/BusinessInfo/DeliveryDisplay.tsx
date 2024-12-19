import React from 'react';
import { Truck } from 'lucide-react';
import type { Seller } from '../../../types/seller';

interface DeliveryDisplayProps {
  seller: Seller;
}

export function DeliveryDisplay({ seller }: DeliveryDisplayProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Delivery Settings</h4>
      
      <div className="flex items-start space-x-3">
        <Truck className="h-5 w-5 text-gray-400 mt-1" />
        <div>
          <p className="text-sm font-medium text-gray-900">Delivery Range & Pricing</p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>Maximum distance: {seller.max_delivery_distance} miles</li>
            <li>Base delivery fee: ${seller.min_delivery_fee}</li>
            <li>Price per mile: ${seller.price_per_mile}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}