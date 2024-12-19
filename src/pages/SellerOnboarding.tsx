import React from 'react';
import { Header } from '../components/Header';
import { OnboardingForm } from '../components/SellerOnboarding/OnboardingForm';

export function SellerOnboarding() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto py-16 px-4 sm:py-24 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Complete Your Seller Profile
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Tell us about your business and delivery preferences.
          </p>
        </div>

        <OnboardingForm />
      </main>
    </div>
  );
}