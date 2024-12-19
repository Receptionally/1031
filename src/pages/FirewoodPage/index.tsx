import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../../components/Header';
import { useSellerSearch } from '../../hooks/useSellerSearch';
import { Building2 } from 'lucide-react';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { SellerBio } from '../../components/SellerProfile/SellerBio';
import { ProductDetails } from '../../components/SellerDetails/ProductDetails';
import { PriceCalculator } from '../../components/PriceCalculator';
import { StackingSelector } from '../../components/SellerDetails/StackingSelector';
import { ImageGallery } from '../../components/FirewoodPage/ImageGallery';
import { OrderForm } from '../../components/OrderForm';

export function FirewoodPage() {
  const [searchParams] = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [includeStacking, setIncludeStacking] = useState(false);
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
        <div className="max-w-6xl mx-auto">
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
              <div className="flex flex-col lg:flex-row lg:space-x-8">
                <div className="lg:w-3/5">
                  <SellerBio seller={seller} />
                  <ImageGallery />
                  <div className="space-y-6">
                    <PriceCalculator
                      quantity={quantity}
                      onQuantityChange={setQuantity}
                      basePrice={seller.price_per_unit}
                      unit={seller.firewood_unit}
                      stackingFee={includeStacking ? seller.stacking_fee_per_unit : 0}
                      deliveryCost={deliveryCost}
                    />

                    <ProductDetails seller={seller} />
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                            className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100"
                            type="button"
                          >
                            <span className="text-gray-600 font-medium text-lg leading-none">−</span>
                          </button>
                          <span className="mx-3 text-lg font-medium text-gray-900">
                            {quantity} {formatUnit(seller.firewood_unit, quantity)}
                          </span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100"
                            type="button"
                          >
                            <span className="text-gray-600 font-medium text-lg leading-none">+</span>
                          </button>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm text-gray-500">
                            {quantity} {formatUnit(seller.firewood_unit, quantity)}: ${(seller.price_per_unit * quantity).toFixed(2)}
                          </p>
                          {includeStacking && (
                            <p className="text-sm text-gray-500">
                              Stacking: ${(seller.stacking_fee_per_unit * quantity).toFixed(2)}
                            </p>
                          )}
                          <p className="text-xl font-bold text-gray-900">
                            Total: ${((seller.price_per_unit * quantity) + (includeStacking ? seller.stacking_fee_per_unit * quantity : 0)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {seller.provides_stacking && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <StackingSelector
                          seller={seller}
                          checked={includeStacking}
                          onChange={setIncludeStacking}
                          stackingFee={seller.stacking_fee_per_unit}
                          unit={seller.firewood_unit}
                          maxStackingDistance={seller.max_stacking_distance || 0}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <OrderForm 
                  seller={seller}
                  quantity={quantity}
                  includeStacking={includeStacking}
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