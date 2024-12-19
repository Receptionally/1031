import React from 'react';
import { useSellers } from '../../hooks/useSellers';
import { SellerRow } from './SellerRow';
import { PackageX, AlertTriangle } from 'lucide-react';
import type { AdminSeller } from '../../types/seller';

interface SellersListProps {
  statusFilter: string;
  searchQuery: string;
}

export function SellersList({ statusFilter, searchQuery }: SellersListProps) {
  const { sellers, loading, error, updateSellerStatus } = useSellers();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <div>
            <p className="text-sm font-medium text-red-800">Error Loading Sellers</p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredSellers = sellers.filter(seller => {
    const matchesStatus = statusFilter === 'all' || seller.status === statusFilter;
    const matchesSearch = !searchQuery || [
      seller.business_name,
      seller.email,
      seller.business_address,
      seller.phone
    ].some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  if (filteredSellers.length === 0) {
    return (
      <div className="text-center py-12">
        <PackageX className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No sellers found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {statusFilter !== 'all' 
            ? `No sellers with ${statusFilter} status.`
            : 'New seller applications will appear here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {filteredSellers.map((seller) => (
          <SellerRow 
            key={seller.id} 
            seller={seller} 
            onStatusUpdate={updateSellerStatus}
          />
        ))}
      </ul>
    </div>
  );
}