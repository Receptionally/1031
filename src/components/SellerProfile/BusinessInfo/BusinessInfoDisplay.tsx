import React from 'react';
import { Building2, MapPin, Phone, Mail } from 'lucide-react';
import type { Seller } from '../../../types/seller';

interface BusinessInfoDisplayProps {
  seller: Seller;
}

export function BusinessInfoDisplay({ seller }: BusinessInfoDisplayProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Business Information</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start space-x-3">
          <Building2 className="h-5 w-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Business Name</p>
            <p className="text-sm text-gray-500">{seller.business_name}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-gray-400 mt-1" />
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
  );
}