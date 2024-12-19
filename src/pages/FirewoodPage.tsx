import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { useSellerSearch } from '../hooks/useSellerSearch';
import { Building2, Wind } from 'lucide-react';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { SellerBio } from '../components/SellerProfile/SellerBio';
import { ProductDetails } from '../components/SellerDetails/ProductDetails';
import { ImageGallery } from '../components/FirewoodPage/ImageGallery';
import { OrderForm } from '../components/OrderForm';
import { StackingSelector } from '../components/SellerDetails/StackingSelector';
import { KilnDriedSelector } from '../components/SellerDetails/KilnDriedSelector';
import { PriceCalculator } from '../components/PriceCalculator';

export function FirewoodPage() {
  const [searchParams] = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [includeStacking, setIncludeStacking] = useState(false);
  const [includeKilnDried, setIncludeKilnDried] = useState(false);
  const deliveryAddress = searchParams.get('address') || sessionStorage.getItem('delivery_address');
  const { seller, deliveryCost, loading, error } = useSellerSearch(deliveryAddress);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !seller) {
    return <ErrorState error={error || 'No sellers available'} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="w-full bg-gray-50 px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {seller.business_name}
                </h2>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div>
                <SellerBio seller={seller} />
                <ImageGallery />
                <div className="space-y-6">
                  <ProductDetails seller={seller} />

                  <PriceCalculator
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    basePrice={seller.price_per_unit}
                    unit={seller.firewood_unit}
                  />

                  {seller.provides_stacking && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <StackingSelector
                        checked={includeStacking}
                        onChange={setIncludeStacking}
                        stackingFee={seller.stacking_fee_per_unit}
                        unit={seller.firewood_unit}
                        maxStackingDistance={seller.max_stacking_distance || 0}
                        businessName={seller.business_name}
                      />
                    </div>
                  )}

                  {seller.provides_kiln_dried && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <KilnDriedSelector
                        checked={includeKilnDried}
                        onChange={setIncludeKilnDried}
                        kilnDriedFee={seller.kiln_dried_fee_per_unit}
                        unit={seller.firewood_unit}
                        businessName={seller.business_name}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 bg-gray-50 rounded-lg">
                <OrderForm 
                  seller={seller}
                  quantity={quantity}
                  includeStacking={includeStacking}
                  includeKilnDried={includeKilnDried}
                  deliveryCost={deliveryCost}
                  deliveryAddress={deliveryAddress}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}