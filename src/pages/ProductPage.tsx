import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { CustomerForm } from '../components/CustomerForm';
import { findNearestSeller } from '../services/sellers.service';
import type { Seller } from '../types/seller';
import { MapPin, Truck, Package } from 'lucide-react';

export function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSeller() {
      try {
        // For demo purposes, using a fixed address. In production, you'd get this from user input
        const nearestSeller = await findNearestSeller("New York, NY");
        setSeller(nearestSeller);
      } catch (err) {
        setError('Failed to find a seller in your area');
      } finally {
        setLoading(false);
      }
    }

    loadSeller();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-16 px-4">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">No Sellers Available</h1>
            <p className="mt-2 text-gray-600">
              {error || 'No sellers were found in your area. Please try a different location.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
            >
              Return Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="md:w-1/2">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Premium Firewood</h1>
                  <img
                    src="https://images.unsplash.com/photo-1506271961370-3d057c812281?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Mixed Hardwood"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  
                  <div className="mt-6 space-y-6">
                    <div className="border-t border-gray-200 pt-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Seller Information</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{seller.business_name}</p>
                            <p className="text-sm text-gray-500">{seller.business_address}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Package className="h-5 w-5 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Pricing</p>
                            <p className="text-sm text-gray-500">
                              ${seller.price_per_unit} per {seller.firewood_unit}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Truck className="h-5 w-5 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Delivery</p>
                            <ul className="text-sm text-gray-500">
                              <li>Up to {seller.max_delivery_distance} miles</li>
                              <li>Minimum fee: ${seller.min_delivery_fee}</li>
                              <li>${seller.price_per_mile} per mile</li>
                            </ul>
                          </div>
                        </div>

                        {seller.provides_stacking && (
                          <div className="flex items-start space-x-3">
                            <Package className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Stacking Service</p>
                              <p className="text-sm text-gray-500">
                                ${seller.stacking_fee_per_unit} per {seller.firewood_unit}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-1/2">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
                  <CustomerForm
                    productId={seller.firewood_unit}
                    quantity={1}
                    amount={Math.round(seller.price_per_unit * 100)}
                    deliveryAddress=""
                    onSuccess={() => navigate('/customer-success')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}