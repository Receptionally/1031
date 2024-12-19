import React from 'react';
import { AlertCircle, DollarSign, Phone } from 'lucide-react';

interface OrderNoticesProps {
  paymentTiming: 'scheduling' | 'delivery';
}

export function OrderNotices({ paymentTiming }: OrderNoticesProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="space-y-4">
        {/* Tax Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <DollarSign className="h-5 w-5 text-blue-400" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-blue-700 font-medium">
                State and local sales tax may apply
              </p>
            </div>
          </div>
        </div>

        {/* Payment Timing Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-yellow-700 font-medium">
                No payment is due today
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Payment will be collected {paymentTiming === 'scheduling' ? 'when delivery is scheduled' : 'upon delivery'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Notice */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <Phone className="h-5 w-5 text-green-400" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-green-700 font-medium">
                Seller will contact you soon
              </p>
              <p className="text-sm text-green-600 mt-1">
                The seller will call to confirm your order and schedule delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}