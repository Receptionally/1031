import React from 'react';
import { Building2 } from 'lucide-react';
import type { SellerWithAccount } from '../../../../types/seller';
import type { DeliveryCost } from '../../../../utils/delivery';
import { SellerBio } from './SellerBio';
import { DeliveryInfo } from './DeliveryInfo';
import { PriceCalculator } from './PriceCalculator';

interface SellerDetailsProps {
  seller: SellerWithAccount;
  quantity: number;
  setQuantity: (quantity: number) => void;
  deliveryCost: DeliveryCost | null;
}

export function SellerDetails({ seller, quantity, setQuantity, deliveryCost }: SellerDetailsProps) {
  return (
    <div className="lg:w-3/5">
      <div className="flex items-center space-x-2 mb-4">
        <Building2 className="h-6 w-6 text-orange-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          {seller.business_name}
        </h2>
      </div>

      <SellerBio seller={seller} />

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
            {seller.provides_stacking && (
              <p className="flex justify-between">
                <span className="text-gray-500">Stacking Fee:</span>
                <span className="font-medium">+${seller.stacking_fee_per_unit}</span>
              </p>
            )}
          </div>
        </div>

        <DeliveryInfo 
          deliveryCost={deliveryCost}
          maxDistance={seller.max_delivery_distance}
        />
      </div>
      
      <PriceCalculator
        quantity={quantity}
        onQuantityChange={setQuantity}
        basePrice={seller.price_per_unit}
        deliveryCost={deliveryCost}
      />
    </div>
  );
}