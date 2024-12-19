import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CustomerFormFields } from '../CustomerForm/CustomerFormFields';
import { CARD_ELEMENT_OPTIONS } from './config/cardOptions';
import { storeOrderData } from '../../services/orders/storage';
import { logger } from '../../services/utils/logger';
import type { OrderData } from '../../services/orders/types';
import type { SellerWithAccount } from '../../types/seller';

interface PaymentFormContentProps {
  seller: SellerWithAccount;
  productId: string;
  quantity: number;
  includeStacking: boolean;
  amount: number;
  deliveryAddress: string;
  onSuccess: () => void;
}

export function PaymentFormContent({ 
  seller,
  productId,
  quantity,
  includeStacking,
  amount,
  deliveryAddress,
  onSuccess 
}: PaymentFormContentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: formData.customerName,
          email: formData.email,
          phone: formData.phone,
        },
      });

      if (pmError) throw pmError;

      // Create customer
      const response = await fetch('/.netlify/functions/create-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          address: deliveryAddress,
          paymentMethod: paymentMethod.id,
          productId,
          quantity,
          amount,
          stripeAccountId: seller.stripe_account_id,
          sellerId: seller.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create customer');

      // Get delivery distance from session storage
      const deliveryDistance = parseFloat(sessionStorage.getItem('delivery_distance') || '0');
      const baseAmount = seller.price_per_unit * quantity;
      const deliveryFee = Math.max(seller.min_delivery_fee, seller.price_per_mile * deliveryDistance);
      const stackingFee = includeStacking ? seller.stacking_fee_per_unit * quantity : 0;
      const totalAmount = baseAmount + stackingFee + deliveryFee;

      // Store order data for processing on success page
      const orderData: OrderData = {
        sellerId: seller.id,
        customerName: formData.customerName,
        customerEmail: formData.email,
        productName: `${quantity} ${seller.firewood_unit} of Firewood`,
        quantity,
        totalAmount,
        stripeCustomerId: data.customerId,
        stripeAccountId: seller.stripe_account_id,
        stripePaymentIntent: data.paymentIntentId,
        stackingIncluded: includeStacking,
        stackingFee,
        deliveryFee,
        deliveryAddress,
        deliveryDistance
      };

      storeOrderData(orderData);
      logger.info('Order data stored successfully');
      onSuccess();
    } catch (err) {
      logger.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Card Details
        </label>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          'Submit Order'
        )}
      </button>
    </form>
  );
}