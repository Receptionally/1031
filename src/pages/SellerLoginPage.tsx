import React from 'react';
import { Header } from '../components/Header';
import { SellerLoginForm } from '../components/SellerLogin/SellerLoginForm';

export function SellerLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-md mx-auto py-16 px-4 sm:py-24 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Seller Login
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/seller-signup" className="font-medium text-orange-600 hover:text-orange-500">
              Sign up here
            </a>
          </p>
        </div>
        <SellerLoginForm />
      </main>
    </div>
  );
}