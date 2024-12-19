import React from 'react';
import { AlertCircle, DollarSign, Phone } from 'lucide-react';

interface OrderNoticesProps {
  paymentTiming: 'scheduling' | 'delivery';
}

export function OrderNotices({ paymentTiming }: OrderNoticesProps) {
  return (
    <div className="mb-8 mt-8 space-y-4">
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

      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Payment will be collected {paymentTiming === 'scheduling' ? 'when delivery is scheduled' : 'upon delivery'}
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
    </div>
  );
}