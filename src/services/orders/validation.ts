import { z } from 'zod';
import type { OrderData } from './types';

const orderDataSchema = z.object({
  sellerId: z.string().uuid('Invalid seller ID'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  productName: z.string().min(1, 'Product name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  totalAmount: z.number().positive('Total amount must be positive'),
  stripeCustomerId: z.string().min(1, 'Stripe customer ID is required'),
  stripeAccountId: z.string().min(1, 'Stripe account ID is required'),
  stripePaymentIntent: z.string().min(1, 'Stripe payment intent is required'),
  stackingIncluded: z.boolean(),
  stackingFee: z.number().min(0, 'Stacking fee cannot be negative'),
  deliveryFee: z.number().min(0, 'Delivery fee cannot be negative'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  deliveryDistance: z.number().min(0, 'Delivery distance cannot be negative'),
});

export function validateOrderData(data: OrderData) {
  const result = orderDataSchema.safeParse(data);
  return {
    success: result.success,
    error: result.success ? undefined : result.error.message
  };
}