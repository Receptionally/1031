import React from 'react';
import type { SellerWithAccount } from '../types/seller';
import type { DeliveryCost } from '../utils/delivery';
import { StackingSelector } from './SellerDetails/StackingSelector';
import { PriceCalculator } from './SellerDetails/PriceCalculator';
import { DeliveryInfo } from './DeliveryInfo';
import { UnitMeasurements } from './SellerDetails/UnitMeasurements';

interface SellerDetailsProps {
  seller: SellerWithAccount;
  quantity: number;
  setQuantity: (quantity: number) => void;
  includeStacking: boolean;
  setIncludeStacking: (include: boolean) => void;
  deliveryCost: DeliveryCost | null;
}

export function SellerDetails({ 
  seller, 
  quantity, 
  setQuantity, 
  includeStacking,
  setIncludeStacking,
  deliveryCost 
}: SellerDetailsProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Product Details</h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-500">Unit Size:</span>
              <span className="font-medium capitalize">{seller.firewood_unit}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500">Price per Unit:</span>
              <span className="font-medium">${seller.price_per_unit.toFixed(2)}</span>
            </p>
          </div>
          <UnitMeasurements unit={seller.firewood_unit} />
        </div>

        <DeliveryInfo 
          deliveryCost={deliveryCost}
          maxDistance={seller.max_delivery_distance}
        />
      </div>

      {seller.provides_stacking && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <StackingSelector
            checked={includeStacking}
            onChange={setIncludeStacking}
            stackingFee={seller.stacking_fee_per_unit}
            unit={seller.firewood_unit}
            maxStackingDistance={seller.max_stacking_distance || 0}
          />
        </div>
      )}
      
      <PriceCalculator
        quantity={quantity}
        onQuantityChange={setQuantity}
        basePrice={seller.price_per_unit}
        stackingFee={includeStacking ? seller.stacking_fee_per_unit : 0}
        deliveryCost={deliveryCost}
      />
    </div>
  );
}