import React from 'react';
import { Header } from '../components/Header';

export function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Test Page
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            This page is for development testing purposes.
          </p>
        </div>
      </main>
    </div>
  );
}