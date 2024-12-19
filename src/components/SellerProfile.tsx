import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { Seller } from '../types/seller';
import { SellerBio } from './SellerProfile/SellerBio';
import { OrdersSection } from './SellerProfile/OrdersSection';
import { StateRulesInfo } from './SellerProfile/StateRulesInfo';
import { CollapsibleLegalNotice } from './SellerProfile/CollapsibleLegalNotice';
import { SellerSettings } from './SellerProfile/SellerSettings';

interface SellerProfileProps {
  seller: Seller;
  onUpdate: () => void;
}

export function SellerProfile({ seller, onUpdate }: SellerProfileProps) {
  const isProfileIncomplete = !seller.profile_image || !seller.bio;
  const connectedAccount = seller.connected_accounts?.[0];

  return (
    <div className="space-y-6">
      {isProfileIncomplete && seller.status === 'pending' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Profile Incomplete</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Your profile needs to be completed before it can be approved. Please add:</p>
                <ul className="list-disc list-inside mt-1">
                  {!seller.profile_image && <li>Profile picture</li>}
                  {!seller.bio && <li>Short bio</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <CollapsibleLegalNotice />

      <OrdersSection 
        sellerId={seller.id} 
        stripeAccountId={connectedAccount?.stripe_account_id} 
      />

      <StateRulesInfo businessAddress={seller.business_address} />

      <SellerBio seller={seller} />

      <SellerSettings seller={seller} onUpdate={onUpdate} />
    </div>
  );
}