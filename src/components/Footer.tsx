import React from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Flame className="h-8 w-8 text-orange-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">WoodHeat</span>
          </div>
          <div className="flex space-x-6">
            <Link
              to="/seller-signup"
              className="text-base text-gray-500 hover:text-gray-900"
            >
              Become a Seller
            </Link>
            <Link
              to="/seller-login"
              className="text-base text-gray-500 hover:text-gray-900"
            >
              Seller Login
            </Link>
            <Link
              to="/admin"
              className="text-base text-gray-500 hover:text-gray-900"
            >
              Admin
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} WoodHeat. Connecting homes with local firewood suppliers.
          </p>
        </div>
      </div>
    </footer>
  );
}