import React from 'react';
import { Truck } from 'lucide-react';
import type { DeliveryCost } from '../utils/delivery';

interface DeliveryInfoProps {
  deliveryCost: DeliveryCost | null;
  maxDistance: number;
}

export function DeliveryInfo({ deliveryCost, maxDistance }: DeliveryInfoProps) {
  if (!deliveryCost) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex">
          <Truck className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Delivery Not Available
            </h3>
            <p className="mt-1 text-sm text-red-700">
              This location is outside our maximum delivery range of {maxDistance} miles.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium text-gray-900 mb-2">Delivery Info</h3>
      <div className="space-y-2 text-sm">
        <p className="flex justify-between">
          <span className="text-gray-500">Distance:</span>
          <span className="font-medium">{deliveryCost.distance} miles</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500">Minimum Fee:</span>
          <span className="font-medium">${deliveryCost.baseFee.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500">Mileage Fee:</span>
          <span className="font-medium">${deliveryCost.mileageFee.toFixed(2)}</span>
        </p>
        <div className="pt-2 border-t border-gray-200">
          <p className="flex justify-between text-base">
            <span className="font-medium text-gray-900">Total Delivery:</span>
            <span className="font-bold text-gray-900">
              ${deliveryCost.totalFee.toFixed(2)}
            </span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {deliveryCost.mileageFee < deliveryCost.baseFee ? (
              <>Minimum delivery fee applied since mileage fee is lower</>
            ) : (
              <>Mileage-based fee applied (${deliveryCost.price_per_mile}/mile)</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}