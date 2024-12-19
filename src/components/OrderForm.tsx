import React from 'react';
import { AlertCircle, DollarSign, Phone } from 'lucide-react';
import { CustomerForm } from './CustomerForm';
import type { SellerWithAccount } from '../types/seller';
import type { DeliveryCost } from '../utils/delivery';
import { formatUnit } from '../utils/units';

interface OrderFormProps {
  seller: SellerWithAccount;
  quantity: number;
  includeKilnDried: boolean;
  includeStacking: boolean;
  deliveryCost: DeliveryCost | null;
  deliveryAddress: string | null;
}

export function OrderForm({ seller, quantity, includeKilnDried, includeStacking, deliveryCost, deliveryAddress }: OrderFormProps) {
  if (!deliveryAddress) {
    return null;
  }

  const productTotal = seller.price_per_unit * quantity;
  const stackingTotal = includeStacking ? seller.stacking_fee_per_unit * quantity : 0;
  const kilnDriedTotal = includeKilnDried ? seller.kiln_dried_fee_per_unit * quantity : 0;
  const deliveryDistance = parseFloat(sessionStorage.getItem('delivery_distance') || '0');
  const deliveryFee = Math.max(seller.min_delivery_fee, seller.price_per_mile * deliveryDistance);
  const totalAmount = Math.round((productTotal + stackingTotal + kilnDriedTotal + deliveryFee) * 100);
  
  const OrderNotices = () => (
    <div className="mt-8 space-y-4">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <DollarSign className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <p className="text-sm text-yellow-700 font-medium">
              State and local sales tax may apply
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex">
          <Phone className="h-5 w-5 text-green-400" />
          <div className="ml-3">
            <p className="text-sm text-green-700">
              The seller will call to confirm your order and schedule delivery
            </p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {seller.has_stripe_account 
                ? `A valid credit card is required to place your order. No payment will be processed today - payment will be collected ${seller.payment_timing === 'scheduling' ? 'when delivery is scheduled' : 'upon delivery'}.`
                : `Payment will be collected ${seller.payment_timing === 'scheduling' ? 'when your delivery is scheduled' : 'upon delivery'}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Complete Your Order
      </h2>
      <div className="mb-6">
        <div className="text-lg font-medium text-gray-900 mb-2">Order Summary</div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>{quantity} {formatUnit(seller.firewood_unit, quantity)}:</span>
            <span>${productTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Stacking:</span>
            <span>{includeStacking ? `$${stackingTotal.toFixed(2)}` : 'Not included'}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Drying Method:</span>
            <span>{includeKilnDried ? 'Kiln dried' : 'Air dried (seasoned)'}</span>
          </div>
          {includeKilnDried && (
            <div className="flex justify-between">
              <span>Kiln Dried:</span>
              <span>${kilnDriedTotal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
            <span>Total:</span>
            <span>${(totalAmount / 100).toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 mt-3">
            <p className="text-blue-700 font-medium text-sm text-center">
              Delivery included in price
            </p>
          </div>
        </div>
      </div>
      <div className="mb-8 mt-8 space-y-8">
        <OrderNotices />
      </div>
      <CustomerForm
        seller={seller}
        productId={seller.firewood_unit}
        quantity={quantity}
        includeStacking={includeStacking}
        amount={totalAmount}
        deliveryAddress={deliveryAddress}
        onSuccess={() => window.location.href = '/customer-success'}
      />
      {/* Trust Indicators */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="flex flex-col items-center space-y-3">
          <p className="text-sm font-medium text-gray-700">Secure Payment Processing</p>
          <div className="flex items-center space-x-4">
            <div className="text-gray-600 font-medium">powered by</div>
            <div className="text-[#635BFF] font-bold text-xl tracking-tight">stripe</div>
          </div>
          <div className="flex items-center text-gray-500">
            <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm">SSL encrypted checkout</span>
          </div>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">
          Your payment information is encrypted and securely processed by Stripe.
        </p>
      </div>
    </div>
  );
}