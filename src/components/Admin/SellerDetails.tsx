import React from 'react';
import { Building2, MapPin, Phone, Mail, Package, Truck, DollarSign, CreditCard, User } from 'lucide-react';
import type { Seller } from '../../types/seller';
import { formatUnit } from '../../utils/units';

interface SellerDetailsProps {
  seller: Seller;
  onStatusUpdate: (sellerId: string, status: Seller['status']) => Promise<void>;
}

export function SellerDetails({ seller, onStatusUpdate }: SellerDetailsProps) {
  return (
    <div className="px-6 py-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            {seller.profile_image ? (
              <img
                src={seller.profile_image}
                alt={seller.name}
                className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{seller.name}</h3>
              {seller.bio ? (
                <p className="mt-1 text-gray-600">{seller.bio}</p>
              ) : (
                <p className="mt-1 text-gray-500 italic">No bio provided</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Business Name</p>
                  <p className="text-sm text-gray-500">{seller.business_name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Business Address</p>
                  <p className="text-sm text-gray-500">{seller.business_address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-500">{seller.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">{seller.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product & Delivery</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Firewood Unit</p>
                  <p className="text-sm text-gray-500 capitalize">{seller.firewood_unit}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Pricing</p>
                  <p className="text-sm text-gray-500">
                    ${seller.price_per_unit} per {formatUnit(seller.firewood_unit, 1)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Delivery</p>
                  <ul className="text-sm text-gray-500">
                    <li>Maximum distance: {seller.max_delivery_distance} miles</li>
                    <li>Minimum fee: ${seller.min_delivery_fee}</li>
                    <li>Price per mile: ${seller.price_per_mile}</li>
                  </ul>
                </div>
              </div>

              {seller.provides_stacking && (
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Stacking Service</p>
                    <ul className="text-sm text-gray-500">
                      <li>${seller.stacking_fee_per_unit} per {formatUnit(seller.firewood_unit, 1)}</li>
                      <li>Maximum {seller.max_stacking_distance} feet from truck to stacking location</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment Required</p>
                  <p className="text-sm text-gray-500">At {seller.payment_timing}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Total Orders: {seller.total_orders || 0}
              </p>
              <p className="text-sm text-gray-600">
                Subscription Status: {seller.subscription_status || 'none'}
              </p>
            </div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={seller.status}
              onChange={(e) => onStatusUpdate(seller.id, e.target.value as Seller['status'])}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Joined: {new Date(seller.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}