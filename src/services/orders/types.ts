export interface OrderData {
  id: string;
  sellerId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  stripeCustomerId: string | null;
  stripeAccountId: string;
  stripePaymentIntent: string | null;
  stackingIncluded: boolean;
  stackingFee: number;
  deliveryFee: number;
  deliveryAddress: string;
  deliveryDistance: number;
  isHidden?: boolean; // New field to track if order is hidden until paid
}