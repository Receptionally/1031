import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { createOrder } from '../services/orders/createOrder';
import { getStoredOrderData, clearOrderData } from '../services/orders/storage';
import { logger } from '../services/utils/logger';

export function CustomerSuccess() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOrder = async () => {
      try {
        const orderData = getStoredOrderData();
        if (!orderData) {
          logger.error('No order data found in session storage');
          setError('Order data not found');
          return;
        }

        await createOrder(orderData);
        clearOrderData();

        // Redirect after successful order creation
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } catch (err) {
        logger.error('Error processing order:', err);
        setError(err instanceof Error ? err.message : 'Failed to process order');
      }
    };

    processOrder();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
            <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Order Processing Error</h1>
            <p className="mt-4 text-lg text-red-600">{error}</p>
            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Order Placed Successfully!</h1>
          <p className="mt-4 text-lg text-gray-500">
            Thank you for your order. You will receive a confirmation email shortly.
          </p>
          <p className="mt-2 text-gray-500">
            Redirecting you to the home page in a few seconds...
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}