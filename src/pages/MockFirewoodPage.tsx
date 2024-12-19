import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Building2 } from 'lucide-react';
import { MOCK_SELLER } from '../components/MockProduct/mockData';
import { OrderSummary } from '../components/OrderSummary';
import { ImageGallery } from '../components/MockProduct/ImageGallery';
import { SellerBio } from '../components/SellerProfile/SellerBio';
import { ProductDetails } from '../components/SellerDetails/ProductDetails';
import { StackingSelector } from '../components/SellerDetails/StackingSelector';
import { KilnDriedSelector } from '../components/SellerDetails/KilnDriedSelector';
import { PriceCalculator } from '../components/PriceCalculator';
import { OrderForm } from '../components/OrderForm';

export function MockFirewoodPage() {
  const [quantity, setQuantity] = useState(1);
  const [includeStacking, setIncludeStacking] = useState(false);
  const [includeKilnDried, setIncludeKilnDried] = useState(false);

  const productTotal = MOCK_SELLER.price_per_unit * quantity;
  const stackingTotal = includeStacking ? MOCK_SELLER.stacking_fee_per_unit * quantity : 0;
  const kilnDriedTotal = includeKilnDried ? MOCK_SELLER.kiln_dried_fee_per_unit * quantity : 0;
  const deliveryFee = MOCK_SELLER.min_delivery_fee;
  const totalPrice = productTotal + stackingTotal + kilnDriedTotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="w-full bg-white shadow sm:rounded-lg">
          <div className="w-full bg-gray-50 px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {MOCK_SELLER.business_name}
              </h2>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="max-w-2xl mx-auto">
              <div>
                <SellerBio seller={MOCK_SELLER} />
                <ImageGallery />
                <div className="space-y-6">
                  <ProductDetails seller={MOCK_SELLER} />
                  
                  <PriceCalculator
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    basePrice={MOCK_SELLER.price_per_unit}
                    unit={MOCK_SELLER.firewood_unit}
                  />

                  {MOCK_SELLER.provides_stacking && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <StackingSelector
                        checked={includeStacking}
                        onChange={setIncludeStacking}
                        stackingFee={MOCK_SELLER.stacking_fee_per_unit}
                        unit={MOCK_SELLER.firewood_unit}
                        maxStackingDistance={MOCK_SELLER.max_stacking_distance}
                        businessName={MOCK_SELLER.business_name}
                      />
                    </div>
                  )}

                  {MOCK_SELLER.provides_kiln_dried && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <KilnDriedSelector
                        checked={includeKilnDried}
                        onChange={setIncludeKilnDried}
                        kilnDriedFee={MOCK_SELLER.kiln_dried_fee_per_unit}
                        unit={MOCK_SELLER.firewood_unit}
                        businessName={MOCK_SELLER.business_name}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 bg-gray-50 rounded-lg">
              <OrderForm 
                seller={MOCK_SELLER}
                quantity={quantity}
                includeStacking={includeStacking}
                includeKilnDried={includeKilnDried}
                deliveryCost={null}
                deliveryAddress="123 Main St, Portland, OR 97201"
              />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}