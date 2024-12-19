import React, { useState } from 'react';
import { DollarSign, Phone } from 'lucide-react';
import { CustomerFormFields } from './CustomerFormFields';
import { storeOrderData } from '../../services/orders/storage';
import { logger } from '../../services/utils/logger';
import { formatUnit } from '../../utils/units';
import type { OrderData } from '../../services/orders/types';
import type { SellerWithAccount } from '../../types/seller';

interface NonStripeFormProps {
  seller: SellerWithAccount;
  productId: string;
  quantity: number;
  includeStacking: boolean;
  amount: number;
  deliveryAddress: string;
  onSuccess: () => void;
}

export function NonStripeForm({
  seller,
  productId,
  quantity,
  includeStacking,
  amount,
  deliveryAddress,
  onSuccess
}: NonStripeFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: ''
  });

  const productTotal = seller.price_per_unit * quantity;
  const stackingTotal = includeStacking ? seller.stacking_fee_per_unit * quantity : 0;
  const deliveryDistance = parseFloat(sessionStorage.getItem('delivery_distance') || '0');
  const deliveryFee = Math.max(seller.min_delivery_fee, seller.price_per_mile * deliveryDistance);
  const totalAmount = productTotal + stackingTotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Store order data
      const orderData: OrderData = {
        sellerId: seller.id,
        customerName: formData.customerName,
        customerEmail: formData.email,
        productName: `${quantity} ${seller.firewood_unit} of Firewood`,
        quantity,
        totalAmount,
        stripeCustomerId: null,
        stripeAccountId: '',
        stripePaymentIntent: null,
        stackingIncluded: includeStacking,
        stackingFee: stackingTotal,
        deliveryFee,
        deliveryAddress,
        deliveryDistance
      };

      storeOrderData(orderData);
      logger.info('Order data stored successfully');
      onSuccess();
    } catch (err) {
      logger.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

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
            <span>Air dried (seasoned)</span>
          </div>
          <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
            <span>Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <CustomerFormFields
          customerName={formData.customerName}
          email={formData.email}
          phone={formData.phone}
          deliveryAddress={deliveryAddress}
          onCustomerNameChange={(value) => setFormData(prev => ({ ...prev, customerName: value }))}
          onEmailChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          onPhoneChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
        />

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
}