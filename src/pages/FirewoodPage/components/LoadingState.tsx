import React from 'react';
import { Header } from '../../../components/Header';

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-16 px-4">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    </div>
  );
}