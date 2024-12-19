import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useSellerProfile } from '../hooks/useSellerProfile';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { SellerBio } from '../components/SellerProfile/SellerBio';
import { ProductDetails } from '../components/SellerDetails/ProductDetails';
import { ImageGallery } from '../components/FirewoodPage/ImageGallery';
import { OrderForm } from '../components/OrderForm';
import { AddressSearch } from '../components/AddressSearch';

export function SellerProfilePage() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { seller, loading, error } = useSellerProfile(sellerId);
  const deliveryAddress = sessionStorage.getItem('delivery_address');

  if (loading) {
    return <LoadingState />;
  }

  if (error || !seller) {
    return <ErrorState error={error || 'Seller not found'} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {!deliveryAddress && (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Enter Your Delivery Address
              </h2>
              <AddressSearch />
            </div>
          )}

          {deliveryAddress && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <SellerBio seller={seller} />
                <ImageGallery />
                <div className="space-y-6">
                  <ProductDetails seller={seller} />
                  <OrderForm 
                    seller={seller}
                    quantity={1}
                    includeStacking={false}
                    includeKilnDried={false}
                    deliveryCost={null}
                    deliveryAddress={deliveryAddress}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}