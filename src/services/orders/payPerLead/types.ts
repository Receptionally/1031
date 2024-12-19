export interface UnlockOrderParams {
  orderId: string;
  sellerId: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}