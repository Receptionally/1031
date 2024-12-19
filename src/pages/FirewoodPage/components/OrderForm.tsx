import React from 'react';
import { CustomerForm } from '../../../components/CustomerForm';
import type { SellerWithAccount } from '../../../types/seller';
import type { DeliveryCost } from '../../../utils/delivery';

interface OrderFormProps {
  seller: SellerWithAccount;
  quantity: number;
  deliveryCost: DeliveryCost | null;
  deliveryAddress: string | null;
}

export function OrderForm({ seller, quantity, deliveryCost, deliveryAddress }: OrderFormProps) {
  if (!deliveryAddress) {
    return null;
  }

  const totalAmount = Math.round(
    (seller.price_per_unit * quantity + (deliveryCost?.totalFee || 0)) * 100
  );

  return (
    <div className="lg:w-2/5 mt-8 lg:mt-0">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Complete Your Order
        </h2>
        <CustomerForm
          seller={seller}
          productId={seller.firewood_unit}
          quantity={quantity}
          amount={totalAmount}
          deliveryAddress={deliveryAddress}
          onSuccess={() => window.location.href = '/customer-success'}
        />
      </div>
    </div>
  );
}