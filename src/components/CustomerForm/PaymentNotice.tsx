import React from 'react';
import { AlertCircle, CreditCard } from 'lucide-react';

interface PaymentNoticeProps {
  type: 'card' | 'cash';
  paymentTiming?: 'scheduling' | 'delivery';
}

export function PaymentNotice({ type, paymentTiming }: PaymentNoticeProps) {
  if (type === 'card') {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <CreditCard className="h-5 w-5 text-blue-400" />
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              {paymentTiming === 'scheduling'
                ? 'Your card will be charged when delivery is scheduled.'
                : 'Your card will be charged at delivery.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'cash') {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Payment will be collected in cash at delivery.
            </p>
          </div>
        </div>
      </div>
    );
  }
}