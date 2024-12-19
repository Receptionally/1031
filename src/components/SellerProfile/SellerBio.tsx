import React from 'react';
import { User } from 'lucide-react';
import type { Seller } from '../../types/seller';

interface SellerBioProps {
  seller: Seller;
}

export function SellerBio({ seller }: SellerBioProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {seller.profile_image ? (
            <img
              src={seller.profile_image}
              alt={seller.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{seller.name}</h3>
          {seller.bio ? (
            <p className="mt-2 text-gray-600">{seller.bio}</p>
          ) : (
            <p className="mt-2 text-gray-500 italic">
              Local firewood supplier committed to quality service.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}