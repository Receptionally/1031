import { UnlockOrderParams, PaymentResponse } from './types';

export async function createUnlockPayment(params: UnlockOrderParams): Promise<PaymentResponse> {
  const response = await fetch('/.netlify/functions/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 1000, // $10.00 in cents
      sellerId: params.sellerId,
      orderId: params.orderId,
      type: 'lead_unlock'
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create payment');
  }

  return data;
}