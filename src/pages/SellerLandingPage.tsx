import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Truck, DollarSign, Search, MapPin, Users, Package, CheckCircle } from 'lucide-react';
import { SellerSignupForm } from '../components/SellerSignup/SellerSignupForm';

export function SellerLandingPage() {
  const features = [
    {
      icon: Search,
      title: 'Customers Find You',
      description: 'When customers search their address, you appear in results if you deliver to their location.'
    },
    {
      icon: Package,
      title: 'First 3 Orders Free',
      description: 'Start risk-free with 3 free orders. After that, just $10 per order with no monthly fees.'
    },
    {
      icon: MapPin,
      title: 'Set Your Service Area',
      description: 'You control your delivery radius, pricing, and service area. Only get orders you want.'
    }
  ];

  const howItWorks = [
    {
      icon: Users,
      title: 'Create Your Profile',
      description: 'Quick signup process to set your delivery area, pricing, and stacking services.'
    },
    {
      icon: DollarSign,
      title: 'Connect Payments',
      description: 'Accept credit card payments securely through Stripe - only pay per order.'
    },
    {
      icon: Truck,
      title: 'Start Delivering',
      description: 'Get notified of new orders and coordinate deliveries directly with customers.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-orange-600">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover mix-blend-multiply filter brightness-50"
            src="https://images.unsplash.com/photo-1520114878144-6123749968dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Stacked firewood"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Grow Your Firewood Business
          </h1>
          <p className="mt-6 text-xl text-orange-100 max-w-3xl">
            Connect with local customers looking for firewood delivery. Manage orders, payments, and grow your business - all in one place.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple steps to start growing your business
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-orange-600 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-base text-gray-600 text-center">{step.description}</p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Platform Features</h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to run your firewood delivery business
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-lg shadow-sm p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-orange-100 text-orange-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Signup Form Section */}
      <div className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started with your first 3 orders free
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/seller-login" className="font-medium text-orange-600 hover:text-orange-500">
                Sign in here
              </Link>
            </p>
          </div>
          <div className="bg-gray-50 shadow-sm rounded-lg p-8">
            <SellerSignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}