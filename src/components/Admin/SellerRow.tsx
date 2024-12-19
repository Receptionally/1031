import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import type { Seller } from '../../types/seller';
import { SellerDetails } from './SellerDetails';

interface SellerRowProps {
  seller: Seller;
  onStatusUpdate: (sellerId: string, status: Seller['status']) => Promise<void>;
}

const STATUS_ICONS = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

const STATUS_COLORS = {
  pending: 'text-yellow-500',
  approved: 'text-green-500',
  rejected: 'text-red-500',
};

export function SellerRow({ seller, onStatusUpdate }: SellerRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const StatusIcon = STATUS_ICONS[seller.status];

  return (
    <li className="bg-white shadow rounded-lg mb-4 overflow-hidden">
      <div 
        className="px-6 py-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <p className="text-lg font-medium text-gray-900 truncate">{seller.business_name}</p>
            <StatusIcon className={`ml-2 h-5 w-5 ${STATUS_COLORS[seller.status]}`} />
          </div>
          <p className="mt-1 text-sm text-gray-500">{seller.email}</p>
        </div>
        <div className="ml-4 flex items-center">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200">
          <SellerDetails seller={seller} onStatusUpdate={onStatusUpdate} />
        </div>
      )}
    </li>
  );
}