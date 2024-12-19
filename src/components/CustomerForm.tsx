import React from 'react';
import { StripePaymentForm } from './PaymentForm/StripePaymentForm';
import type { SellerWithAccount } from '../types/seller';
import { NonStripeForm } from './CustomerForm/NonStripeForm';

interface CustomerFormProps {
  seller: SellerWithAccount;
  productId: string;
  quantity: number;
  amount: number;
  deliveryAddress: string;
  onSuccess: () => void;
}

export function CustomerForm(props: CustomerFormProps) {
  const { seller, productId, quantity, amount, deliveryAddress, onSuccess } = props;

  if (seller.has_stripe_account && seller.stripe_account_id) {
    return <StripePaymentForm {...props} />;
  }

  // Show non-Stripe form for sellers without Stripe
  return <NonStripeForm {...props} />;
}