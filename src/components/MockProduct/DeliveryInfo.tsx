import React from 'react';
import type { MockDelivery } from './types';

interface DeliveryInfoProps {
  delivery: MockDelivery;
}

export function DeliveryInfo({ delivery }: DeliveryInfoProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium text-gray-900 mb-2">Delivery Info</h3>
      <div className="space-y-2 text-sm">
        <p className="flex justify-between">
          <span className="text-gray-500">Distance:</span>
          <span className="font-medium">{delivery.distance} miles</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500">Base Fee:</span>
          <span className="font-medium">${delivery.baseFee.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-500">Mileage Fee:</span>
          <span className="font-medium">${delivery.mileageFee.toFixed(2)}</span>
        </p>
        <div className="pt-2 border-t border-gray-200">
          <p className="flex justify-between text-base">
            <span className="font-medium text-gray-900">Total Delivery:</span>
            <span className="font-bold text-gray-900">
              ${delivery.totalFee.toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}