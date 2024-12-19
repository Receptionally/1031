import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-16 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{error}</h2>
          <p className="mt-2 text-gray-600 max-w-lg mx-auto">
            {error.includes('currently available') ? (
              'Our sellers are either busy or temporarily unavailable. Please check back soon as new sellers are added regularly.'
            ) : (
              'Unfortunately, we couldn\'t find any sellers in your area. Please try a different address.'
            )}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}