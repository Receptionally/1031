import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { useAuth } from '../services/auth/context';
export function Header() {
  const location = useLocation();
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Flame className="h-8 w-8 text-orange-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">WoodHeat</span>
            </Link>
          </div>
          <div>
            <div className="flex items-center space-x-4">
              <Link
                to="/seller-landing"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Become a Seller
              </Link>
              <Link
                to="/seller-login"
                className="text-gray-500 hover:text-gray-700"
              >
                Seller Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}